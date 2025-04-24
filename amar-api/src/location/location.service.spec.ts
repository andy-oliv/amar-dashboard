import { Test, TestingModule } from '@nestjs/testing';
import { LocationService } from './location.service';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import { checkLocationExists } from '../helpers/location.helper';
import generateTimestamp from '../helpers/generateTimestamp';
import { faker } from '@faker-js/faker/.';
import generateMockLocation from '../utils/mocks/generateMockLocation';
import Location from '../interfaces/Location';
import EndpointReturn from '../interfaces/EndpointReturn';
import HTTP_MESSAGES from '../utils/messages/httpMessages';
import { PrismaClientKnownRequestError } from '../../prisma/generated/prisma-client-js/runtime/library';
import { Prisma } from '../../prisma/generated/prisma-client-js';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import LOGGER_MESSAGES from '../utils/messages/loggerMessages';

jest.mock('../helpers/location.helper');
jest.mock('../helpers/generateTimestamp');

describe('LocationService', () => {
  let locationService: LocationService;
  let prismaService: PrismaService;
  let logger: Logger;

  const location: Location = generateMockLocation();
  const updatedLocation: Location = {
    id: location.id,
    name: faker.person.fullName(),
    address: faker.location.streetAddress(),
    neighborhood: location.neighborhood,
    city: location.city,
  };
  const timestamp: string = 'mock-timestamp';
  (generateTimestamp as jest.Mock).mockReturnValue(timestamp);
  const pid: number = faker.number.int();
  const logError: any = {
    code: '',
    message: '',
    stack: '',
  };
  const prismaNotFoundError: PrismaClientKnownRequestError =
    new Prisma.PrismaClientKnownRequestError('Record not found', {
      code: 'P2025',
      clientVersion: 'mock-client-version',
    });
  const prismaValidationError: PrismaClientKnownRequestError =
    new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
      code: 'P2002',
      clientVersion: 'mock-client-version',
    });
  const voidReturn: undefined = undefined;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationService,
        {
          provide: PrismaService,
          useValue: {
            location: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUniqueOrThrow: jest.fn(),
              update: jest.fn(),
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

    locationService = module.get<LocationService>(LocationService);
    prismaService = module.get<PrismaService>(PrismaService);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(locationService).toBeDefined();
  });

  describe('createLocation()', () => {
    it('should create a new location', async () => {
      (checkLocationExists as jest.Mock).mockResolvedValue(voidReturn);
      (prismaService.location.create as jest.Mock).mockResolvedValue(location);
      (logger.log as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.log.location.createLocation.success,
        pid,
        timestamp,
      });

      const result: EndpointReturn =
        await locationService.createLocation(location);

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.location.createLocation.status_201,
        data: location,
      });

      expect(checkLocationExists).toHaveBeenCalledWith(
        prismaService,
        logger,
        location,
      );

      expect(prismaService.location.create).toHaveBeenCalledWith({
        data: location,
      });

      expect(logger.log).toHaveBeenCalled();
    });

    it('should throw a conflict exception', async () => {
      (checkLocationExists as jest.Mock).mockRejectedValue(
        new ConflictException(),
      );

      await expect(locationService.createLocation(location)).rejects.toThrow(
        ConflictException,
      );

      expect(checkLocationExists).toHaveBeenCalledWith(
        prismaService,
        logger,
        location,
      );
    });

    it('should throw an internal error', async () => {
      (checkLocationExists as jest.Mock).mockResolvedValue(voidReturn);
      (prismaService.location.create as jest.Mock).mockRejectedValue(
        prismaValidationError,
      );
      (logger.error as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.error.location.createLocation.internalError,
        code: logError.code,
        error: logError.message,
        stack: logError.stack,
        pid,
        timestamp,
      });

      await expect(locationService.createLocation(location)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(checkLocationExists).toHaveBeenCalledWith(
        prismaService,
        logger,
        location,
      );

      expect(prismaService.location.create).toHaveBeenCalledWith({
        data: location,
      });

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('fetchLocations()', () => {
    it('should fetch all locations', async () => {
      const locations: Location[] = [location, location];

      (prismaService.location.findMany as jest.Mock).mockResolvedValue(
        locations,
      );

      const result: EndpointReturn = await locationService.fetchLocations();

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.location.fetchLocations.status_200,
        data: locations,
      });

      expect(prismaService.location.findMany).toHaveBeenCalled();
    });

    it('should throw a not found exception', async () => {
      const locations: Location[] = [];

      (prismaService.location.findMany as jest.Mock).mockResolvedValue(
        locations,
      );
      (logger.log as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.log.location.fetchLocations.notFound,
        pid,
        timestamp,
      });

      await expect(locationService.fetchLocations()).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaService.location.findMany).toHaveBeenCalled();

      expect(logger.log).toHaveBeenCalled();
    });

    it('should throw an internal server error', async () => {
      (prismaService.location.findMany as jest.Mock).mockRejectedValue(
        prismaValidationError,
      );
      (logger.error as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.error.location.fetchLocations.internalError,
        code: logError.code,
        error: logError.message,
        stack: logError.stack,
        pid,
        timestamp,
      });

      await expect(locationService.fetchLocations()).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(prismaService.location.findMany).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('fetchLocationsByNameOrAddress', () => {
    it('should fetch locations based on name and/or address', async () => {
      const locations: Location[] = [location, location];

      (prismaService.location.findMany as jest.Mock).mockResolvedValue(
        locations,
      );

      const result: EndpointReturn =
        await locationService.fetchLocationsByNameOrAddress({
          name: location.name,
          address: location.address,
        });

      expect(result).toMatchObject({
        message:
          HTTP_MESSAGES.EN.location.fetchLocationsByNameOrAddress.status_200,
        data: locations,
      });

      expect(prismaService.location.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { name: { contains: location.name } },
            { address: { contains: location.address } },
          ],
        },
      });
    });

    it('should throw a not found exception', async () => {
      const locations: Location[] = [];

      (prismaService.location.findMany as jest.Mock).mockResolvedValue(
        locations,
      );
      (logger.log as jest.Mock).mockReturnValue({
        message:
          LOGGER_MESSAGES.log.location.fetchLocationsByNameOrAddress.notFound,
        pid,
        timestamp,
      });

      await expect(
        locationService.fetchLocationsByNameOrAddress({
          name: location.name,
          address: location.address,
        }),
      ).rejects.toThrow(NotFoundException);

      expect(prismaService.location.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { name: { contains: location.name } },
            { address: { contains: location.address } },
          ],
        },
      });

      expect(logger.log).toHaveBeenCalled();
    });

    it('should throw an internal server error', async () => {
      (prismaService.location.findMany as jest.Mock).mockRejectedValue(
        prismaValidationError,
      );
      (logger.error as jest.Mock).mockReturnValue({
        message:
          LOGGER_MESSAGES.error.location.fetchLocationsByNameOrAddress
            .internalError,
        code: logError.code,
        error: logError.message,
        stack: logError.stack,
        pid,
        timestamp,
      });

      await expect(
        locationService.fetchLocationsByNameOrAddress({
          name: location.name,
          address: location.address,
        }),
      ).rejects.toThrow(InternalServerErrorException);

      expect(prismaService.location.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { name: { contains: location.name } },
            { address: { contains: location.address } },
          ],
        },
      });

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('fetchLocation()', () => {
    it('should fetch a location', async () => {
      (prismaService.location.findUniqueOrThrow as jest.Mock).mockResolvedValue(
        location,
      );

      const result: EndpointReturn = await locationService.fetchLocation(
        location.id,
      );

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.location.fetchLocation.status_200,
        data: location,
      });

      expect(prismaService.location.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          id: location.id,
        },
      });
    });

    it('should throw a not found exception', async () => {
      (prismaService.location.findUniqueOrThrow as jest.Mock).mockRejectedValue(
        prismaNotFoundError,
      );
      (logger.error as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.error.location.fetchLocation.notFound,
        pid,
        timestamp,
      });

      await expect(locationService.fetchLocation(location.id)).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaService.location.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          id: location.id,
        },
      });

      expect(logger.error).toHaveBeenCalled();
    });

    it('should throw an internal server error', async () => {
      (prismaService.location.findUniqueOrThrow as jest.Mock).mockRejectedValue(
        prismaValidationError,
      );
      (logger.error as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.error.location.fetchLocation.internalError,
        code: logError.code,
        error: logError.message,
        stack: logError.stack,
        pid,
        timestamp,
      });

      await expect(locationService.fetchLocation(location.id)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(prismaService.location.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          id: location.id,
        },
      });

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('updateLocation()', () => {
    it('should update a location', async () => {
      (prismaService.location.update as jest.Mock).mockResolvedValue(
        updatedLocation,
      );

      const result: EndpointReturn =
        await locationService.updateLocation(updatedLocation);

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.location.updateLocation.status_200,
        data: updatedLocation,
      });

      expect(prismaService.location.update).toHaveBeenCalledWith({
        where: {
          id: updatedLocation.id,
        },
        data: {
          name: updatedLocation.name,
          address: updatedLocation.address,
          neighborhood: updatedLocation.neighborhood,
          city: updatedLocation.city,
        },
      });
    });

    it('should throw a not found exception', async () => {
      (prismaService.location.update as jest.Mock).mockRejectedValue(
        prismaNotFoundError,
      );
      (logger.error as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.error.location.updateLocation.notFound,
        pid,
        timestamp,
      });

      await expect(
        locationService.updateLocation(updatedLocation),
      ).rejects.toThrow(NotFoundException);

      expect(prismaService.location.update).toHaveBeenCalledWith({
        where: {
          id: updatedLocation.id,
        },
        data: {
          name: updatedLocation.name,
          address: updatedLocation.address,
          neighborhood: updatedLocation.neighborhood,
          city: updatedLocation.city,
        },
      });

      expect(logger.error).toHaveBeenCalled();
    });

    it('should throw an internal server error', async () => {
      (prismaService.location.update as jest.Mock).mockRejectedValue(
        prismaValidationError,
      );
      (logger.error as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.error.location.updateLocation.internalError,
        code: logError.code,
        error: logError.message,
        stack: logError.stack,
        pid,
        timestamp,
      });

      await expect(
        locationService.updateLocation(updatedLocation),
      ).rejects.toThrow(InternalServerErrorException);

      expect(prismaService.location.update).toHaveBeenCalledWith({
        where: {
          id: updatedLocation.id,
        },
        data: {
          name: updatedLocation.name,
          address: updatedLocation.address,
          neighborhood: updatedLocation.neighborhood,
          city: updatedLocation.city,
        },
      });

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('deleteLocation()', () => {
    it('should update a location', async () => {
      (prismaService.location.delete as jest.Mock).mockResolvedValue(location);

      const result: EndpointReturn = await locationService.deleteLocation(
        location.id,
      );

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.location.deleteLocation.status_200,
        data: location,
      });

      expect(prismaService.location.delete).toHaveBeenCalledWith({
        where: {
          id: location.id,
        },
      });
    });

    it('should throw a not found exception', async () => {
      (prismaService.location.delete as jest.Mock).mockRejectedValue(
        prismaNotFoundError,
      );
      (logger.error as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.error.location.deleteLocation.notFound,
        pid,
        timestamp,
      });

      await expect(locationService.deleteLocation(location.id)).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaService.location.delete).toHaveBeenCalledWith({
        where: {
          id: location.id,
        },
      });

      expect(logger.error).toHaveBeenCalled();
    });

    it('should throw an internal server error', async () => {
      (prismaService.location.delete as jest.Mock).mockRejectedValue(
        prismaValidationError,
      );
      (logger.error as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.error.location.deleteLocation.internalError,
        code: logError.code,
        error: logError.message,
        stack: logError.stack,
        pid,
        timestamp,
      });

      await expect(locationService.deleteLocation(location.id)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(prismaService.location.delete).toHaveBeenCalledWith({
        where: {
          id: location.id,
        },
      });

      expect(logger.error).toHaveBeenCalled();
    });
  });
});
