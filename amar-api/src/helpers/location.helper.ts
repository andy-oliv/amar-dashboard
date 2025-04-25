import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import Location from '../interfaces/Location';
import { PrismaService } from '../prisma/prisma.service';
import generateTimestamp from './generateTimestamp';
import { Logger } from 'nestjs-pino';
import LOGGER_MESSAGES from '../utils/messages/loggerMessages';
import HTTP_MESSAGES from '../utils/messages/httpMessages';

export async function checkLocationExists(
  prismaService: PrismaService,
  logger: Logger,
  locationInfo: Location,
): Promise<void> {
  const locationExists: Location = await prismaService.location.findFirst({
    where: {
      name: locationInfo.name,
      address: locationInfo.address,
      neighborhood: locationInfo.neighborhood,
      city: locationInfo.city,
    },
  });

  if (locationExists) {
    const timestamp: string = generateTimestamp();

    logger.error({
      message: LOGGER_MESSAGES.error.location.createLocation.conflict,
      pid: process.pid,
      timestamp,
    });

    throw new ConflictException({
      message: HTTP_MESSAGES.EN.location.createLocation.status_409,
      pid: process.pid,
      timestamp,
    });
  }
}

export async function checkLocationById(
  prismaService: PrismaService,
  logger: Logger,
  locationId: number,
): Promise<void> {
  try {
    await prismaService.location.findUniqueOrThrow({
      where: {
        id: locationId,
      },
    });
  } catch (error) {
    const timestamp: string = generateTimestamp();

    if (error.code === 'P2025') {
      logger.error({
        message: LOGGER_MESSAGES.error.helpers.checkLocationById.notFound,
        pid: process.pid,
        timestamp,
      });

      throw new NotFoundException({
        message: HTTP_MESSAGES.EN.helpers.checkLocationById.status_404,
        pid: process.pid,
        timestamp,
      });
    }

    logger.error({
      message: LOGGER_MESSAGES.error.helpers.checkLocationById.internalError,
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
