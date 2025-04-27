import { Test, TestingModule } from '@nestjs/testing';
import { YogaclassService } from './yogaclass.service';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import { checkinstructorRoles } from '../helpers/yogaClass.helper';
import { checkLocationById } from '../helpers/location.helper';
import YogaClass from '../interfaces/YogaClass';
import generateMockYogaClass, {
  getRandomString,
} from '../utils/mocks/generateMockYogaClass';
import EndpointReturn from '../interfaces/EndpointReturn';
import CreateClassDTO from './dto/createClassDTO';
import { faker } from '@faker-js/faker/.';
import HTTP_MESSAGES from '../utils/messages/httpMessages';
import { parseIsoString } from '../helpers/time.helper';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

jest.mock('../helpers/yogaClass.helper');
jest.mock('../helpers/location.helper');
jest.mock('../helpers/time.helper');

describe('YogaclassService', () => {
  let yogaclassService: YogaclassService;
  let prismaService: PrismaService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        YogaclassService,
        {
          provide: PrismaService,
          useValue: {
            yogaClass: {
              create: jest.fn(),
              findFirst: jest.fn(),
              findMany: jest.fn(),
              findUniqueOrThrow: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            yogaAdultStudent: {
              create: jest.fn(),
              delete: jest.fn(),
            },
            yogaChildStudent: {
              create: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    yogaclassService = module.get<YogaclassService>(YogaclassService);
    prismaService = module.get<PrismaService>(PrismaService);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(yogaclassService).toBeDefined();
  });

  describe('createClass()', () => {
    it('should create a new class', async () => {
      const yogaClass: CreateClassDTO = {
        type: getRandomString(['ADULTS', 'CHILDREN']),
        status: getRandomString([
          'SCHEDULED',
          'RESCHEDULED',
          'DONE',
          'CANCELLED',
        ]),
        date: faker.date.soon(),
        time: faker.date.soon().toTimeString().split(' ')[0],
        instructorId: faker.string.uuid(),
        locationId: faker.number.int(),
      };
      const randomDate: Date = faker.date.soon();

      (checkinstructorRoles as jest.Mock).mockResolvedValue(undefined);
      (checkLocationById as jest.Mock).mockResolvedValue(undefined);
      (prismaService.yogaClass.create as jest.Mock).mockResolvedValue(
        yogaClass,
      );
      (parseIsoString as jest.Mock).mockReturnValue(randomDate);

      const result: EndpointReturn =
        await yogaclassService.createClass(yogaClass);

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.yogaClass.createClass.status_201,
        data: yogaClass,
      });

      expect(checkinstructorRoles).toHaveBeenCalledWith(
        prismaService,
        yogaClass.instructorId,
      );

      expect(checkLocationById).toHaveBeenCalledWith(
        prismaService,
        logger,
        yogaClass.locationId,
      );

      expect(prismaService.yogaClass.create).toHaveBeenCalledWith({
        data: {
          type: yogaClass.type,
          status: yogaClass.status,
          date: parseIsoString(yogaClass.date, yogaClass.time),
          instructorId: yogaClass.instructorId,
          locationId: yogaClass.locationId,
        },
      });

      expect(parseIsoString).toHaveBeenCalledWith(
        yogaClass.date,
        yogaClass.time,
      );
    });

    it('should throw a not found exception because the instructor does not possess the required role', async () => {
      const yogaClass: CreateClassDTO = {
        type: getRandomString(['ADULTS', 'CHILDREN']),
        status: getRandomString([
          'SCHEDULED',
          'RESCHEDULED',
          'DONE',
          'CANCELLED',
        ]),
        date: faker.date.soon(),
        time: faker.date.soon().toTimeString().split(' ')[0],
        instructorId: faker.string.uuid(),
        locationId: faker.number.int(),
      };

      (checkinstructorRoles as jest.Mock).mockRejectedValue(
        new NotFoundException(),
      );

      await expect(yogaclassService.createClass(yogaClass)).rejects.toThrow(
        NotFoundException,
      );

      expect(checkinstructorRoles).toHaveBeenCalledWith(
        prismaService,
        yogaClass.instructorId,
      );
    });

    it('should throw a not found request because the location was not found', async () => {
      const yogaClass: CreateClassDTO = {
        type: getRandomString(['ADULTS', 'CHILDREN']),
        status: getRandomString([
          'SCHEDULED',
          'RESCHEDULED',
          'DONE',
          'CANCELLED',
        ]),
        date: faker.date.soon(),
        time: faker.date.soon().toTimeString().split(' ')[0],
        instructorId: faker.string.uuid(),
        locationId: faker.number.int(),
      };

      (checkinstructorRoles as jest.Mock).mockResolvedValue(undefined);
      (checkLocationById as jest.Mock).mockRejectedValue(
        new NotFoundException(),
      );

      await expect(yogaclassService.createClass(yogaClass)).rejects.toThrow(
        NotFoundException,
      );

      expect(checkinstructorRoles).toHaveBeenCalledWith(
        prismaService,
        yogaClass.instructorId,
      );
      expect(checkLocationById).toHaveBeenCalledWith(
        prismaService,
        logger,
        yogaClass.locationId,
      );
    });

    it('it should throw a bad request exception because the date is before the current date', async () => {
      const yogaClass: CreateClassDTO = {
        type: getRandomString(['ADULTS', 'CHILDREN']),
        status: getRandomString([
          'SCHEDULED',
          'RESCHEDULED',
          'DONE',
          'CANCELLED',
        ]),
        date: faker.date.past(),
        time: faker.date.soon().toTimeString().split(' ')[0],
        instructorId: faker.string.uuid(),
        locationId: faker.number.int(),
      };

      (checkinstructorRoles as jest.Mock).mockResolvedValue(undefined);
      (checkLocationById as jest.Mock).mockResolvedValue(undefined);

      await expect(yogaclassService.createClass(yogaClass)).rejects.toThrow(
        BadRequestException,
      );

      expect(checkinstructorRoles).toHaveBeenCalledWith(
        prismaService,
        yogaClass.instructorId,
      );
      expect(checkLocationById).toHaveBeenCalledWith(
        prismaService,
        logger,
        yogaClass.locationId,
      );
    });

    it('should throw an internal error', async () => {
      const yogaClass: CreateClassDTO = {
        type: getRandomString(['ADULTS', 'CHILDREN']),
        status: getRandomString([
          'SCHEDULED',
          'RESCHEDULED',
          'DONE',
          'CANCELLED',
        ]),
        date: faker.date.soon(),
        time: faker.date.soon().toTimeString().split(' ')[0],
        instructorId: faker.string.uuid(),
        locationId: faker.number.int(),
      };
      const randomDate: Date = faker.date.soon();

      (checkinstructorRoles as jest.Mock).mockResolvedValue(undefined);
      (checkLocationById as jest.Mock).mockResolvedValue(undefined);
      (prismaService.yogaClass.create as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(),
      );
      (parseIsoString as jest.Mock).mockReturnValue(randomDate);

      await expect(yogaclassService.createClass(yogaClass)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(checkinstructorRoles).toHaveBeenCalledWith(
        prismaService,
        yogaClass.instructorId,
      );

      expect(checkLocationById).toHaveBeenCalledWith(
        prismaService,
        logger,
        yogaClass.locationId,
      );

      expect(prismaService.yogaClass.create).toHaveBeenCalledWith({
        data: {
          type: yogaClass.type,
          status: yogaClass.status,
          date: parseIsoString(yogaClass.date, yogaClass.time),
          instructorId: yogaClass.instructorId,
          locationId: yogaClass.locationId,
        },
      });

      expect(parseIsoString).toHaveBeenCalledWith(
        yogaClass.date,
        yogaClass.time,
      );
    });
  });

  describe('fetchClasses()', () => {
    it('should fetch all classes', async () => {
      const yogaClasses: YogaClass[] = [
        generateMockYogaClass(),
        generateMockYogaClass(),
      ];
      (prismaService.yogaClass.findMany as jest.Mock).mockResolvedValue(
        yogaClasses,
      );

      const result: EndpointReturn = await yogaclassService.fetchClasses();

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.yogaClass.fetchClasses.status_200,
        data: yogaClasses,
      });

      expect(prismaService.yogaClass.findMany).toHaveBeenCalled();
    });
  });
});
