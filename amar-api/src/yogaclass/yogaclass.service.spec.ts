import { Test, TestingModule } from '@nestjs/testing';
import { YogaclassService } from './yogaclass.service';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import {
  checkClassExists,
  checkDateIsPast,
  checkinstructorRoles,
  checkStudentExists,
} from '../helpers/yogaClass.helper';
import { checkLocationById } from '../helpers/location.helper';
import YogaClass from '../interfaces/YogaClass';
import generateMockYogaClass, {
  getRandomString,
} from '../utils/mocks/generateMockYogaClass';
import EndpointReturn from '../interfaces/EndpointReturn';
import CreateClassDTO from './dto/createClassDTO';
import { faker } from '@faker-js/faker/.';
import HTTP_MESSAGES from '../utils/messages/httpMessages';
import { dateRange, parseIsoString } from '../helpers/time.helper';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '../../prisma/generated/prisma-client-js/runtime/library';
import { Prisma } from '../../prisma/generated/prisma-client-js';
import LOGGER_MESSAGES from '../utils/messages/loggerMessages';
import generateTimestamp from '../helpers/generateTimestamp';
import * as dayjs from 'dayjs';
import FetchClassesDTO from './dto/fetchClassesDTO';
import UpdateClassDTO from './dto/updateClassDTO';
import Client from '../interfaces/Client';
import generateMockClient from '../utils/mocks/generateMockClients';

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
        logger,
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
        logger,
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
        logger,
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
      (checkDateIsPast as jest.Mock).mockRejectedValue(
        new BadRequestException(),
      );

      await expect(yogaclassService.createClass(yogaClass)).rejects.toThrow(
        BadRequestException,
      );

      expect(checkinstructorRoles).toHaveBeenCalledWith(
        prismaService,
        logger,
        yogaClass.instructorId,
      );
      expect(checkLocationById).toHaveBeenCalledWith(
        prismaService,
        logger,
        yogaClass.locationId,
      );

      expect(checkDateIsPast).toHaveBeenCalledWith(yogaClass.date);
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
      const error = {
        code: '',
        message: '',
        stack: '',
      };

      (checkinstructorRoles as jest.Mock).mockResolvedValue(undefined);
      (checkLocationById as jest.Mock).mockResolvedValue(undefined);
      (checkDateIsPast as jest.Mock).mockResolvedValue(undefined);
      (prismaService.yogaClass.create as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(),
      );
      (parseIsoString as jest.Mock).mockReturnValue(randomDate);
      (logger.error as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.error.yogaClass.createClass.internalError,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp: generateTimestamp(),
      });

      await expect(yogaclassService.createClass(yogaClass)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(checkinstructorRoles).toHaveBeenCalledWith(
        prismaService,
        logger,
        yogaClass.instructorId,
      );

      expect(checkLocationById).toHaveBeenCalledWith(
        prismaService,
        logger,
        yogaClass.locationId,
      );

      expect(checkDateIsPast).toHaveBeenCalledWith(yogaClass.date);

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

      expect(logger.error).toHaveBeenCalled();
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

    it('should throw a not found exception', async () => {
      const yogaClasses: YogaClass[] = [];

      (prismaService.yogaClass.findMany as jest.Mock).mockResolvedValue(
        yogaClasses,
      );

      (logger.log as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.log.yogaClass.fetchClasses.notFound,
        pid: process.pid,
        timestamp: generateTimestamp(),
      });

      await expect(yogaclassService.fetchClasses()).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaService.yogaClass.findMany).toHaveBeenCalled();

      expect(logger.log).toHaveBeenCalled();
    });

    it('should throw an internal server error', async () => {
      const error: PrismaClientKnownRequestError =
        new Prisma.PrismaClientKnownRequestError('Record not found', {
          code: 'P2025',
          clientVersion: 'mock-client-version',
        });

      const errorLog = {
        code: '',
        message: '',
        stack: '',
      };

      (prismaService.yogaClass.findMany as jest.Mock).mockRejectedValue(error);

      (logger.error as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.error.yogaClass.fetchClasses.internalError,
        code: errorLog.code,
        error: errorLog.message,
        stack: errorLog.stack,
        pid: process.pid,
        timestamp: generateTimestamp(),
      });

      await expect(yogaclassService.fetchClasses()).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(prismaService.yogaClass.findMany).toHaveBeenCalled();

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('fetchByQuery()', () => {
    it('should fetch classes by query', async () => {
      const classes: YogaClass[] = [
        {
          id: faker.number.int(),
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
        },
      ];

      const query: FetchClassesDTO = {
        type: undefined,
        status: undefined,
        date: faker.date.soon(),
        instructorId: undefined,
        locationId: undefined,
      };

      const mockRange = {
        startRange: new Date(query.date),
        endRange: new Date(query.date),
      };

      (parseIsoString as jest.Mock).mockReturnValue(query.date);
      (dateRange as jest.Mock).mockReturnValue(mockRange);
      (prismaService.yogaClass.findMany as jest.Mock).mockResolvedValue(
        classes,
      );

      const result: EndpointReturn = await yogaclassService.fetchByQuery(query);

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.yogaClass.fetchByQuery.status_200,
        data: classes,
      });

      expect(parseIsoString).toHaveBeenCalledWith(query.date);
      expect(dateRange).toHaveBeenCalledWith(query.date);

      expect(prismaService.yogaClass.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { type: undefined },
            { status: undefined },
            {
              date: {
                gte: mockRange.startRange,
                lte: mockRange.endRange,
              },
            },
            { instructorId: undefined },
            { locationId: undefined },
          ],
        },
      });
    });

    it('should throw a not found exception', async () => {
      const classes: YogaClass[] = [];

      const query: FetchClassesDTO = {
        type: undefined,
        status: undefined,
        date: faker.date.soon(),
        instructorId: undefined,
        locationId: undefined,
      };

      const mockRange = {
        startRange: new Date(query.date),
        endRange: new Date(query.date),
      };

      (parseIsoString as jest.Mock).mockReturnValue(query.date);
      (dateRange as jest.Mock).mockReturnValue(mockRange);
      (prismaService.yogaClass.findMany as jest.Mock).mockResolvedValue(
        classes,
      );

      await expect(yogaclassService.fetchByQuery(query)).rejects.toThrow(
        NotFoundException,
      );

      expect(parseIsoString).toHaveBeenCalledWith(query.date);
      expect(dateRange).toHaveBeenCalledWith(query.date);

      expect(prismaService.yogaClass.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { type: undefined },
            { status: undefined },
            {
              date: {
                gte: mockRange.startRange,
                lte: mockRange.endRange,
              },
            },
            { instructorId: undefined },
            { locationId: undefined },
          ],
        },
      });
    });

    it('should throw an internal server error', async () => {
      const prismaError: PrismaClientKnownRequestError =
        new Prisma.PrismaClientKnownRequestError('PrismaValidationError', {
          code: 'P2002',
          clientVersion: 'mock-version',
        });

      const query: FetchClassesDTO = {
        type: undefined,
        status: undefined,
        date: faker.date.soon(),
        instructorId: undefined,
        locationId: undefined,
      };

      const mockRange = {
        startRange: new Date(query.date),
        endRange: new Date(query.date),
      };

      (parseIsoString as jest.Mock).mockReturnValue(query.date);
      (dateRange as jest.Mock).mockReturnValue(mockRange);
      (prismaService.yogaClass.findMany as jest.Mock).mockRejectedValue(
        prismaError,
      );

      await expect(yogaclassService.fetchByQuery(query)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(parseIsoString).toHaveBeenCalledWith(query.date);
      expect(dateRange).toHaveBeenCalledWith(query.date);

      expect(prismaService.yogaClass.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { type: undefined },
            { status: undefined },
            {
              date: {
                gte: mockRange.startRange,
                lte: mockRange.endRange,
              },
            },
            { instructorId: undefined },
            { locationId: undefined },
          ],
        },
      });
    });
  });

  describe('fetchByRange()', () => {
    it('should fetch classes based on a date range', async () => {
      const classes: YogaClass[] = [
        {
          id: faker.number.int(),
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
        },
      ];

      const ranges = {
        rangeStart: faker.date.past(),
        rangeEnd: faker.date.soon(),
      };

      const parsedStart = '2024-01-01T00:00:00.000Z';
      const parsedEnd = '2024-01-03T23:59:59.000Z';

      (parseIsoString as jest.Mock)
        .mockReturnValueOnce(parsedStart)
        .mockReturnValueOnce(parsedEnd);

      (prismaService.yogaClass.findMany as jest.Mock).mockResolvedValue(
        classes,
      );

      const result: EndpointReturn = await yogaclassService.fetchByRange({
        rangeStart: ranges.rangeStart,
        rangeEnd: ranges.rangeEnd,
      });

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.yogaClass.fetchByRange.status_200,
        data: classes,
      });

      expect(prismaService.yogaClass.findMany).toHaveBeenCalledWith({
        where: {
          date: {
            gte: parsedStart,
            lte: parsedEnd,
          },
        },
      });

      expect(parseIsoString).toHaveBeenCalled();
    });

    it('should throw a not found exception', async () => {
      const classes: YogaClass[] = [];

      const ranges = {
        rangeStart: faker.date.past(),
        rangeEnd: faker.date.soon(),
      };

      const parsedStart = '2024-01-01T00:00:00.000Z';
      const parsedEnd = '2024-01-03T23:59:59.000Z';

      (parseIsoString as jest.Mock)
        .mockReturnValueOnce(parsedStart)
        .mockReturnValueOnce(parsedEnd);

      (prismaService.yogaClass.findMany as jest.Mock).mockResolvedValue(
        classes,
      );

      await expect(yogaclassService.fetchByRange(ranges)).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaService.yogaClass.findMany).toHaveBeenCalledWith({
        where: {
          date: {
            gte: parsedStart,
            lte: parsedEnd,
          },
        },
      });

      expect(parseIsoString).toHaveBeenCalled();
    });

    it('should throw an internal server error', async () => {
      const prismaError: PrismaClientKnownRequestError =
        new Prisma.PrismaClientKnownRequestError('PrismaValidationError', {
          code: 'P2002',
          clientVersion: 'mock-version',
        });

      const ranges = {
        rangeStart: faker.date.past(),
        rangeEnd: faker.date.soon(),
      };

      const parsedStart = '2024-01-01T00:00:00.000Z';
      const parsedEnd = '2024-01-03T23:59:59.000Z';

      (parseIsoString as jest.Mock)
        .mockReturnValueOnce(parsedStart)
        .mockReturnValueOnce(parsedEnd);

      (prismaService.yogaClass.findMany as jest.Mock).mockRejectedValue(
        prismaError,
      );

      await expect(yogaclassService.fetchByRange(ranges)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(prismaService.yogaClass.findMany).toHaveBeenCalledWith({
        where: {
          date: {
            gte: parsedStart,
            lte: parsedEnd,
          },
        },
      });

      expect(parseIsoString).toHaveBeenCalled();
    });
  });

  describe('fetchClass()', () => {
    it('should fetch a class', async () => {
      const fetchedClass: YogaClass = generateMockYogaClass();

      (
        prismaService.yogaClass.findUniqueOrThrow as jest.Mock
      ).mockResolvedValue(fetchedClass);

      const result: EndpointReturn = await yogaclassService.fetchClass(
        fetchedClass.id,
      );

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.yogaClass.fetchClass.status_200,
        data: fetchedClass,
      });

      expect(prismaService.yogaClass.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          id: fetchedClass.id,
        },
        include: {
          adultStudents: {
            include: {
              student: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          childStudents: {
            include: {
              student: {
                select: {
                  id: true,
                  name: true,
                  parents: {
                    include: {
                      client: {
                        select: {
                          id: true,
                          name: true,
                          email: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          instructor: {
            select: {
              id: true,
              name: true,
              email: true,
              pictureUrl: true,
            },
          },
          location: {
            select: {
              id: true,
              name: true,
              address: true,
              neighborhood: true,
              city: true,
            },
          },
          rollCall: {
            select: {
              id: true,
              date: true,
              presences: true,
            },
          },
          transactions: true,
        },
      });
    });

    it('should throw a not found exception', async () => {
      const fetchedClass: YogaClass = generateMockYogaClass();
      const error: PrismaClientKnownRequestError =
        new Prisma.PrismaClientKnownRequestError('Record not found', {
          code: 'P2025',
          clientVersion: 'mock-version',
        });

      (
        prismaService.yogaClass.findUniqueOrThrow as jest.Mock
      ).mockRejectedValue(error);

      (logger.error as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.error.yogaClass.fetchClass.notFound,
        pid: process.pid,
        timestamp: generateTimestamp(),
      });

      await expect(
        yogaclassService.fetchClass(fetchedClass.id),
      ).rejects.toThrow(NotFoundException);

      expect(prismaService.yogaClass.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          id: fetchedClass.id,
        },
        include: {
          adultStudents: {
            include: {
              student: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          childStudents: {
            include: {
              student: {
                select: {
                  id: true,
                  name: true,
                  parents: {
                    include: {
                      client: {
                        select: {
                          id: true,
                          name: true,
                          email: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          instructor: {
            select: {
              id: true,
              name: true,
              email: true,
              pictureUrl: true,
            },
          },
          location: {
            select: {
              id: true,
              name: true,
              address: true,
              neighborhood: true,
              city: true,
            },
          },
          rollCall: {
            select: {
              id: true,
              date: true,
              presences: true,
            },
          },
          transactions: true,
        },
      });

      expect(logger.error).toHaveBeenCalled();
    });

    it('should throw an internal server error', async () => {
      const fetchedClass: YogaClass = generateMockYogaClass();
      const error: PrismaClientKnownRequestError =
        new Prisma.PrismaClientKnownRequestError('PrismaValidationError', {
          code: 'P2002',
          clientVersion: 'mock-version',
        });
      const errorLog = {
        code: '',
        message: '',
        stack: '',
      };

      (
        prismaService.yogaClass.findUniqueOrThrow as jest.Mock
      ).mockRejectedValue(error);

      (logger.error as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.error.yogaClass.fetchClass.internalError,
        code: errorLog.code,
        error: errorLog.message,
        stack: errorLog.stack,
      });

      await expect(
        yogaclassService.fetchClass(fetchedClass.id),
      ).rejects.toThrow(InternalServerErrorException);

      expect(prismaService.yogaClass.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          id: fetchedClass.id,
        },
        include: {
          adultStudents: {
            include: {
              student: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          childStudents: {
            include: {
              student: {
                select: {
                  id: true,
                  name: true,
                  parents: {
                    include: {
                      client: {
                        select: {
                          id: true,
                          name: true,
                          email: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          instructor: {
            select: {
              id: true,
              name: true,
              email: true,
              pictureUrl: true,
            },
          },
          location: {
            select: {
              id: true,
              name: true,
              address: true,
              neighborhood: true,
              city: true,
            },
          },
          rollCall: {
            select: {
              id: true,
              date: true,
              presences: true,
            },
          },
          transactions: true,
        },
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('updateClass()', () => {
    it('should update a class', async () => {
      const foundClass: YogaClass = generateMockYogaClass();
      const updatedClass: UpdateClassDTO = {
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

      (prismaService.yogaClass.findFirst as jest.Mock).mockResolvedValue(
        foundClass,
      );
      (prismaService.yogaClass.update as jest.Mock).mockResolvedValue(
        updatedClass,
      );
      (checkinstructorRoles as jest.Mock).mockResolvedValue(undefined);
      (checkLocationById as jest.Mock).mockResolvedValue(undefined);
      (checkDateIsPast as jest.Mock).mockResolvedValue(undefined);

      const result: EndpointReturn = await yogaclassService.updateClass(
        foundClass.id,
        updatedClass,
      );
      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.yogaClass.updateClass.status_200,
        data: updatedClass,
      });

      expect(prismaService.yogaClass.findFirst).toHaveBeenCalledWith({
        where: {
          id: foundClass.id,
        },
      });
      expect(prismaService.yogaClass.update).toHaveBeenCalledWith({
        where: {
          id: foundClass.id,
        },
        data: {
          type: updatedClass.type,
          status: updatedClass.status,
          date: parseIsoString(
            updatedClass.date ? updatedClass.date : foundClass.date,
            updatedClass.time
              ? updatedClass.time
              : dayjs(foundClass.date).format('HH:mm:ss'),
          ),
          instructorId: updatedClass.instructorId,
          locationId: updatedClass.locationId,
        },
      });

      expect(checkinstructorRoles).toHaveBeenCalledWith(
        prismaService,
        logger,
        updatedClass.instructorId,
      );

      expect(checkLocationById).toHaveBeenCalledWith(
        prismaService,
        logger,
        updatedClass.locationId,
      );

      expect(checkDateIsPast).toHaveBeenCalledWith(updatedClass.date);
    });

    it('should throw a not found exception for not finding the class', async () => {
      const foundClass: YogaClass = generateMockYogaClass();

      const updatedClass: UpdateClassDTO = {
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

      (prismaService.yogaClass.findFirst as jest.Mock).mockRejectedValue(
        new NotFoundException(),
      );

      await expect(
        yogaclassService.updateClass(foundClass.id, updatedClass),
      ).rejects.toThrow(NotFoundException);

      expect(prismaService.yogaClass.findFirst).toHaveBeenCalledWith({
        where: {
          id: foundClass.id,
        },
      });
    });

    it('should throw a not found exception for not finding the correct role for the instructor', async () => {
      const foundClass: YogaClass = generateMockYogaClass();
      const updatedClass: UpdateClassDTO = {
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

      (prismaService.yogaClass.findFirst as jest.Mock).mockResolvedValue(
        foundClass,
      );

      (checkinstructorRoles as jest.Mock).mockRejectedValue(
        new NotFoundException(),
      );

      await expect(
        yogaclassService.updateClass(foundClass.id, updatedClass),
      ).rejects.toThrow(NotFoundException);

      expect(prismaService.yogaClass.findFirst).toHaveBeenCalledWith({
        where: {
          id: foundClass.id,
        },
      });

      expect(checkinstructorRoles).toHaveBeenCalledWith(
        prismaService,
        logger,
        updatedClass.instructorId,
      );
    });

    it('should throw a not found exception for not finding the location', async () => {
      const foundClass: YogaClass = generateMockYogaClass();
      const updatedClass: UpdateClassDTO = {
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

      (prismaService.yogaClass.findFirst as jest.Mock).mockResolvedValue(
        foundClass,
      );

      (checkinstructorRoles as jest.Mock).mockResolvedValue(undefined);
      (checkLocationById as jest.Mock).mockRejectedValue(
        new NotFoundException(),
      );

      await expect(
        yogaclassService.updateClass(foundClass.id, updatedClass),
      ).rejects.toThrow(NotFoundException);

      expect(prismaService.yogaClass.findFirst).toHaveBeenCalledWith({
        where: {
          id: foundClass.id,
        },
      });

      expect(checkinstructorRoles).toHaveBeenCalledWith(
        prismaService,
        logger,
        updatedClass.instructorId,
      );

      expect(checkLocationById).toHaveBeenCalledWith(
        prismaService,
        logger,
        updatedClass.locationId,
      );
    });

    it('should throw a bad request exception because the date is in the past', async () => {
      const foundClass: YogaClass = generateMockYogaClass();
      const updatedClass: UpdateClassDTO = {
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

      (prismaService.yogaClass.findFirst as jest.Mock).mockResolvedValue(
        foundClass,
      );

      (checkinstructorRoles as jest.Mock).mockResolvedValue(undefined);
      (checkLocationById as jest.Mock).mockResolvedValue(undefined);
      (checkDateIsPast as jest.Mock).mockRejectedValue(
        new BadRequestException(),
      );

      await expect(
        yogaclassService.updateClass(foundClass.id, updatedClass),
      ).rejects.toThrow(BadRequestException);

      expect(prismaService.yogaClass.findFirst).toHaveBeenCalledWith({
        where: {
          id: foundClass.id,
        },
      });

      expect(checkinstructorRoles).toHaveBeenCalledWith(
        prismaService,
        logger,
        updatedClass.instructorId,
      );

      expect(checkLocationById).toHaveBeenCalledWith(
        prismaService,
        logger,
        updatedClass.locationId,
      );

      expect(checkDateIsPast).toHaveBeenCalledWith(updatedClass.date);
    });

    it('should throw an internal error', async () => {
      const foundClass: YogaClass = generateMockYogaClass();
      const updatedClass: UpdateClassDTO = {
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
      const prismaError: PrismaClientKnownRequestError =
        new Prisma.PrismaClientKnownRequestError('PrismaValidationError', {
          code: 'P2002',
          clientVersion: 'mock-version',
        });

      (prismaService.yogaClass.findFirst as jest.Mock).mockResolvedValue(
        foundClass,
      );

      (checkinstructorRoles as jest.Mock).mockResolvedValue(undefined);
      (checkLocationById as jest.Mock).mockResolvedValue(undefined);
      (checkDateIsPast as jest.Mock).mockResolvedValue(undefined);
      (prismaService.yogaClass.update as jest.Mock).mockRejectedValue(
        prismaError,
      );

      await expect(
        yogaclassService.updateClass(foundClass.id, updatedClass),
      ).rejects.toThrow(InternalServerErrorException);

      expect(prismaService.yogaClass.findFirst).toHaveBeenCalledWith({
        where: {
          id: foundClass.id,
        },
      });

      expect(checkinstructorRoles).toHaveBeenCalledWith(
        prismaService,
        logger,
        updatedClass.instructorId,
      );

      expect(checkLocationById).toHaveBeenCalledWith(
        prismaService,
        logger,
        updatedClass.locationId,
      );

      expect(checkDateIsPast).toHaveBeenCalledWith(updatedClass.date);

      expect(prismaService.yogaClass.update).toHaveBeenCalledWith({
        where: {
          id: foundClass.id,
        },
        data: {
          type: updatedClass.type,
          status: updatedClass.status,
          date: parseIsoString(
            updatedClass.date ? updatedClass.date : foundClass.date,
            updatedClass.time
              ? updatedClass.time
              : dayjs(foundClass.date).format('HH:mm:ss'),
          ),
          instructorId: updatedClass.instructorId,
          locationId: updatedClass.locationId,
        },
      });
    });
  });

  describe('deleteClass()', () => {
    it('should delete a class', async () => {
      const yogaClass: YogaClass = generateMockYogaClass();

      (prismaService.yogaClass.delete as jest.Mock).mockResolvedValue(
        yogaClass,
      );

      const result: EndpointReturn = await yogaclassService.deleteClass(
        yogaClass.id,
      );

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.yogaClass.deleteClass.status_200,
        data: yogaClass,
      });

      expect(prismaService.yogaClass.delete).toHaveBeenCalledWith({
        where: {
          id: yogaClass.id,
        },
      });
    });

    it('should throw a not found exception', async () => {
      const yogaClass: YogaClass = generateMockYogaClass();
      const prismaError: PrismaClientKnownRequestError =
        new Prisma.PrismaClientKnownRequestError('Record not found', {
          code: 'P2025',
          clientVersion: 'mock-version',
        });

      (prismaService.yogaClass.delete as jest.Mock).mockRejectedValue(
        prismaError,
      );

      await expect(yogaclassService.deleteClass(yogaClass.id)).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaService.yogaClass.delete).toHaveBeenCalledWith({
        where: {
          id: yogaClass.id,
        },
      });
    });

    it('should throw an internal server error', async () => {
      const yogaClass: YogaClass = generateMockYogaClass();
      const prismaError: PrismaClientKnownRequestError =
        new Prisma.PrismaClientKnownRequestError('PrismaValidationError', {
          code: 'P2002',
          clientVersion: 'mock-version',
        });

      (prismaService.yogaClass.delete as jest.Mock).mockRejectedValue(
        prismaError,
      );

      await expect(yogaclassService.deleteClass(yogaClass.id)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(prismaService.yogaClass.delete).toHaveBeenCalledWith({
        where: {
          id: yogaClass.id,
        },
      });
    });
  });

  describe('addStudent()', () => {
    it('should add a new student to a class', async () => {
      const foundClass: YogaClass = generateMockYogaClass();
      const newStudent: Client = generateMockClient();

      (checkClassExists as jest.Mock).mockResolvedValue(foundClass);
      (checkStudentExists as jest.Mock).mockResolvedValue(undefined);
      (prismaService.yogaAdultStudent.create as jest.Mock).mockResolvedValue(
        newStudent,
      );
      (prismaService.yogaChildStudent.create as jest.Mock).mockResolvedValue(
        newStudent,
      );

      const result: { message: string } = await yogaclassService.addStudent(
        foundClass.id,
        newStudent.id,
      );

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.yogaClass.addStudent.status_200,
      });

      expect(checkClassExists).toHaveBeenCalledWith(
        prismaService,
        logger,
        foundClass.id,
      );
      expect(checkStudentExists).toHaveBeenCalledWith(
        prismaService,
        logger,
        foundClass.type,
        newStudent.id,
      );

      if (foundClass.type === 'ADULTS') {
        expect(prismaService.yogaAdultStudent.create).toHaveBeenCalledWith({
          data: {
            studentId: newStudent.id,
            yogaClassId: foundClass.id,
          },
        });
      } else {
        expect(prismaService.yogaChildStudent.create).toHaveBeenCalledWith({
          data: {
            studentId: newStudent.id,
            yogaClassId: foundClass.id,
          },
        });
      }
    });

    it('should throw a not found exception because the class does not exist', async () => {
      const foundClass: YogaClass = generateMockYogaClass();
      const newStudent: Client = generateMockClient();

      (checkClassExists as jest.Mock).mockRejectedValue(
        new NotFoundException(),
      );

      await expect(
        yogaclassService.addStudent(foundClass.id, newStudent.id),
      ).rejects.toThrow(NotFoundException);

      expect(checkClassExists).toHaveBeenCalledWith(
        prismaService,
        logger,
        foundClass.id,
      );
    });

    it('should throw a not found exception because the student was not found', async () => {
      const foundClass: YogaClass = generateMockYogaClass();
      const newStudent: Client = generateMockClient();

      (checkClassExists as jest.Mock).mockResolvedValue(foundClass);
      (checkStudentExists as jest.Mock).mockRejectedValue(
        new NotFoundException(),
      );

      await expect(
        yogaclassService.addStudent(foundClass.id, newStudent.id),
      ).rejects.toThrow(NotFoundException);

      expect(checkClassExists).toHaveBeenCalledWith(
        prismaService,
        logger,
        foundClass.id,
      );

      expect(checkStudentExists).toHaveBeenCalledWith(
        prismaService,
        logger,
        foundClass.type,
        newStudent.id,
      );
    });

    it('should throw a conflict exception because the student is already in class', async () => {
      const foundClass: YogaClass = generateMockYogaClass();
      const newStudent: Client = generateMockClient();
      const prismaError: PrismaClientKnownRequestError =
        new Prisma.PrismaClientKnownRequestError('Constraint violation', {
          code: 'P2002',
          clientVersion: 'mock-clientversion',
        });

      (checkClassExists as jest.Mock).mockResolvedValue(foundClass);
      (checkStudentExists as jest.Mock).mockResolvedValue(undefined);
      (prismaService.yogaAdultStudent.create as jest.Mock).mockRejectedValue(
        prismaError,
      );
      (prismaService.yogaChildStudent.create as jest.Mock).mockRejectedValue(
        prismaError,
      );

      await expect(
        yogaclassService.addStudent(foundClass.id, newStudent.id),
      ).rejects.toThrow(ConflictException);

      expect(checkClassExists).toHaveBeenCalledWith(
        prismaService,
        logger,
        foundClass.id,
      );
      expect(checkStudentExists).toHaveBeenCalledWith(
        prismaService,
        logger,
        foundClass.type,
        newStudent.id,
      );

      if (foundClass.type === 'ADULTS') {
        expect(prismaService.yogaAdultStudent.create).toHaveBeenCalledWith({
          data: {
            studentId: newStudent.id,
            yogaClassId: foundClass.id,
          },
        });
      } else {
        expect(prismaService.yogaChildStudent.create).toHaveBeenCalledWith({
          data: {
            studentId: newStudent.id,
            yogaClassId: foundClass.id,
          },
        });
      }
    });

    it('should throw an internal server error', async () => {
      const foundClass: YogaClass = generateMockYogaClass();
      const newStudent: Client = generateMockClient();
      const prismaError: PrismaClientKnownRequestError =
        new Prisma.PrismaClientKnownRequestError('PrismaValidationError', {
          code: '',
          clientVersion: 'mock-clientversion',
        });

      (checkClassExists as jest.Mock).mockResolvedValue(foundClass);
      (checkStudentExists as jest.Mock).mockResolvedValue(undefined);
      (prismaService.yogaAdultStudent.create as jest.Mock).mockRejectedValue(
        prismaError,
      );
      (prismaService.yogaChildStudent.create as jest.Mock).mockRejectedValue(
        prismaError,
      );

      await expect(
        yogaclassService.addStudent(foundClass.id, newStudent.id),
      ).rejects.toThrow(InternalServerErrorException);

      expect(checkClassExists).toHaveBeenCalledWith(
        prismaService,
        logger,
        foundClass.id,
      );
      expect(checkStudentExists).toHaveBeenCalledWith(
        prismaService,
        logger,
        foundClass.type,
        newStudent.id,
      );

      if (foundClass.type === 'ADULTS') {
        expect(prismaService.yogaAdultStudent.create).toHaveBeenCalledWith({
          data: {
            studentId: newStudent.id,
            yogaClassId: foundClass.id,
          },
        });
      } else {
        expect(prismaService.yogaChildStudent.create).toHaveBeenCalledWith({
          data: {
            studentId: newStudent.id,
            yogaClassId: foundClass.id,
          },
        });
      }
    });
  });

  describe('removeStudent()', () => {
    it('should remove a student from a class', async () => {
      const foundClass: YogaClass = generateMockYogaClass();
      const deletedStudent: Client = generateMockClient();

      (checkClassExists as jest.Mock).mockResolvedValue(foundClass);
      (checkStudentExists as jest.Mock).mockResolvedValue(undefined);
      (prismaService.yogaAdultStudent.delete as jest.Mock).mockResolvedValue(
        deletedStudent,
      );
      (prismaService.yogaChildStudent.delete as jest.Mock).mockResolvedValue(
        deletedStudent,
      );

      const result: { message: string } = await yogaclassService.removeStudent(
        foundClass.id,
        deletedStudent.id,
      );

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.yogaClass.deleteStudent.status_200,
      });

      expect(checkClassExists).toHaveBeenCalledWith(
        prismaService,
        logger,
        foundClass.id,
      );
      expect(checkStudentExists).toHaveBeenCalledWith(
        prismaService,
        logger,
        foundClass.type,
        deletedStudent.id,
      );

      if (foundClass.type === 'ADULTS') {
        expect(prismaService.yogaAdultStudent.delete).toHaveBeenCalledWith({
          where: {
            yogaClassId_studentId: {
              studentId: deletedStudent.id,
              yogaClassId: foundClass.id,
            },
          },
        });
      } else {
        expect(prismaService.yogaChildStudent.delete).toHaveBeenCalledWith({
          where: {
            yogaClassId_studentId: {
              studentId: deletedStudent.id,
              yogaClassId: foundClass.id,
            },
          },
        });
      }
    });

    it('should throw a not found exception because the class does not exist', async () => {
      const foundClass: YogaClass = generateMockYogaClass();
      const deletedStudent: Client = generateMockClient();

      (checkClassExists as jest.Mock).mockRejectedValue(
        new NotFoundException(),
      );

      await expect(
        yogaclassService.removeStudent(foundClass.id, deletedStudent.id),
      ).rejects.toThrow(NotFoundException);

      expect(checkClassExists).toHaveBeenCalledWith(
        prismaService,
        logger,
        foundClass.id,
      );
    });

    it('should throw a not found exception because the student was not found', async () => {
      const foundClass: YogaClass = generateMockYogaClass();
      const deletedStudent: Client = generateMockClient();

      (checkClassExists as jest.Mock).mockResolvedValue(foundClass);
      (checkStudentExists as jest.Mock).mockRejectedValue(
        new NotFoundException(),
      );

      await expect(
        yogaclassService.removeStudent(foundClass.id, deletedStudent.id),
      ).rejects.toThrow(NotFoundException);

      expect(checkClassExists).toHaveBeenCalledWith(
        prismaService,
        logger,
        foundClass.id,
      );

      expect(checkStudentExists).toHaveBeenCalledWith(
        prismaService,
        logger,
        foundClass.type,
        deletedStudent.id,
      );
    });

    it('should throw an internal server error', async () => {
      const foundClass: YogaClass = generateMockYogaClass();
      const deletedStudent: Client = generateMockClient();
      const prismaError: PrismaClientKnownRequestError =
        new Prisma.PrismaClientKnownRequestError('PrismaValidationError', {
          code: 'P2002',
          clientVersion: 'mock-clientversion',
        });

      (checkClassExists as jest.Mock).mockResolvedValue(foundClass);
      (checkStudentExists as jest.Mock).mockResolvedValue(undefined);
      (prismaService.yogaAdultStudent.delete as jest.Mock).mockRejectedValue(
        prismaError,
      );
      (prismaService.yogaChildStudent.delete as jest.Mock).mockRejectedValue(
        prismaError,
      );

      await expect(
        yogaclassService.removeStudent(foundClass.id, deletedStudent.id),
      ).rejects.toThrow(InternalServerErrorException);

      expect(checkClassExists).toHaveBeenCalledWith(
        prismaService,
        logger,
        foundClass.id,
      );
      expect(checkStudentExists).toHaveBeenCalledWith(
        prismaService,
        logger,
        foundClass.type,
        deletedStudent.id,
      );

      if (foundClass.type === 'ADULTS') {
        expect(prismaService.yogaAdultStudent.delete).toHaveBeenCalledWith({
          where: {
            yogaClassId_studentId: {
              studentId: deletedStudent.id,
              yogaClassId: foundClass.id,
            },
          },
        });
      } else {
        expect(prismaService.yogaChildStudent.delete).toHaveBeenCalledWith({
          where: {
            yogaClassId_studentId: {
              studentId: deletedStudent.id,
              yogaClassId: foundClass.id,
            },
          },
        });
      }
    });
  });
});
