import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import EndpointReturn from '../interfaces/EndpointReturn';
import Location from '../interfaces/Location';
import { checkLocationExists } from '../helpers/location.helper';
import { Logger } from 'nestjs-pino';
import generateTimestamp from '../helpers/generateTimestamp';
import LOGGER_MESSAGES from '../utils/messages/loggerMessages';
import HTTP_MESSAGES from '../utils/messages/httpMessages';

@Injectable()
export class LocationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

  async createLocation(locationInfo: Location): Promise<EndpointReturn> {
    await checkLocationExists(this.prismaService, this.logger, locationInfo);

    try {
      const newLocation: Location = await this.prismaService.location.create({
        data: locationInfo,
      });

      this.logger.log({
        message: LOGGER_MESSAGES.log.location.createLocation.success,
        pid: process.pid,
        timestamp: generateTimestamp(),
      });

      return {
        message: HTTP_MESSAGES.EN.location.createLocation.status_201,
        data: newLocation,
      };
    } catch (error) {
      const timestamp: string = generateTimestamp();

      this.logger.error({
        message: LOGGER_MESSAGES.error.location.createLocation.internalError,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp,
      });

      throw new InternalServerErrorException({
        message: HTTP_MESSAGES.EN.generalMessages.status_500,
        pid: process.pid,
        timestamp,
      });
    }
  }

  async fetchLocations(): Promise<EndpointReturn> {
    try {
      const locations: Location[] =
        await this.prismaService.location.findMany();

      if (locations.length === 0) {
        const timestamp: string = generateTimestamp();

        this.logger.log({
          message: LOGGER_MESSAGES.log.location.fetchLocations.notFound,
          pid: process.pid,
          timestamp,
        });

        throw new NotFoundException({
          message: HTTP_MESSAGES.EN.location.fetchLocations.status_404,
          pid: process.pid,
          timestamp,
        });
      }

      return {
        message: HTTP_MESSAGES.EN.location.fetchLocations.status_200,
        data: locations,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      const timestamp: string = generateTimestamp();

      this.logger.error({
        message: LOGGER_MESSAGES.error.location.fetchLocations.internalError,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp,
      });

      throw new InternalServerErrorException({
        message: HTTP_MESSAGES.EN.generalMessages.status_500,
        pid: process.pid,
        timestamp,
      });
    }
  }

  async fetchLocationsByNameOrAddress(location: {
    name: string;
    address: string;
  }): Promise<EndpointReturn> {
    try {
      const locations: Location[] = await this.prismaService.location.findMany({
        where: {
          OR: [
            { name: { contains: location.name } },
            { address: { contains: location.address } },
          ],
        },
      });

      if (locations.length === 0) {
        const timestamp: string = generateTimestamp();

        this.logger.log({
          message:
            LOGGER_MESSAGES.log.location.fetchLocationsByNameOrAddress.notFound,
          data: {
            name: location.name,
            address: location.address,
          },
          pid: process.pid,
          timestamp,
        });

        throw new NotFoundException({
          message:
            HTTP_MESSAGES.EN.location.fetchLocationsByNameOrAddress.status_404,
          pid: process.pid,
          timestamp,
        });
      }

      return {
        message:
          HTTP_MESSAGES.EN.location.fetchLocationsByNameOrAddress.status_200,
        data: locations,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      const timestamp: string = generateTimestamp();

      this.logger.error({
        message:
          LOGGER_MESSAGES.error.location.fetchLocationsByNameOrAddress
            .internalError,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp,
      });

      throw new InternalServerErrorException({
        message: HTTP_MESSAGES.EN.generalMessages.status_500,
        pid: process.pid,
        timestamp,
      });
    }
  }

  async fetchLocation(id: number): Promise<EndpointReturn> {
    try {
      const location: Location =
        await this.prismaService.location.findUniqueOrThrow({
          where: {
            id,
          },
        });

      return {
        message: HTTP_MESSAGES.EN.location.fetchLocation.status_200,
        data: location,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        const timestamp: string = generateTimestamp();

        this.logger.error({
          message: LOGGER_MESSAGES.error.location.fetchLocation.notFound,
          pid: process.pid,
          timestamp,
        });

        throw new NotFoundException({
          message: HTTP_MESSAGES.EN.location.fetchLocation.status_404,
          pid: process.pid,
          timestamp,
        });
      }

      const timestamp: string = generateTimestamp();

      this.logger.error({
        message: LOGGER_MESSAGES.error.location.fetchLocation.internalError,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp,
      });

      throw new InternalServerErrorException({
        message: HTTP_MESSAGES.EN.generalMessages.status_500,
        pid: process.pid,
        timestamp,
      });
    }
  }

  async updateLocation(
    locationInfo: Partial<Location>,
  ): Promise<EndpointReturn> {
    try {
      const updatedLocation: Location =
        await this.prismaService.location.update({
          where: {
            id: locationInfo.id,
          },
          data: {
            name: locationInfo.name,
            address: locationInfo.address,
            neighborhood: locationInfo.neighborhood,
            city: locationInfo.city,
          },
        });

      return {
        message: HTTP_MESSAGES.EN.location.updateLocation.status_200,
        data: updatedLocation,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        const timestamp: string = generateTimestamp();

        this.logger.error({
          message: LOGGER_MESSAGES.error.location.updateLocation.notFound,
          pid: process.pid,
          timestamp,
        });

        throw new NotFoundException({
          message: HTTP_MESSAGES.EN.location.updateLocation.status_404,
          pid: process.pid,
          timestamp,
        });
      }

      const timestamp: string = generateTimestamp();

      this.logger.error({
        message: LOGGER_MESSAGES.error.location.updateLocation.internalError,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp,
      });

      throw new InternalServerErrorException({
        message: HTTP_MESSAGES.EN.generalMessages.status_500,
        pid: process.pid,
        timestamp,
      });
    }
  }

  async deleteLocation(locationId: number): Promise<EndpointReturn> {
    try {
      const deletedLocation: Location =
        await this.prismaService.location.delete({
          where: {
            id: locationId,
          },
        });

      return {
        message: HTTP_MESSAGES.EN.location.deleteLocation.status_200,
        data: deletedLocation,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        const timestamp: string = generateTimestamp();

        this.logger.error({
          message: LOGGER_MESSAGES.error.location.deleteLocation.notFound,
          pid: process.pid,
          timestamp,
        });

        throw new NotFoundException({
          message: HTTP_MESSAGES.EN.location.deleteLocation.status_404,
          pid: process.pid,
          timestamp,
        });
      }

      const timestamp: string = generateTimestamp();

      this.logger.error({
        message: LOGGER_MESSAGES.error.location.deleteLocation.internalError,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp,
      });

      throw new InternalServerErrorException({
        message: HTTP_MESSAGES.EN.generalMessages.status_500,
        pid: process.pid,
        timestamp,
      });
    }
  }
}
