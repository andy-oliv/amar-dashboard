import { ConflictException } from '@nestjs/common';
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
