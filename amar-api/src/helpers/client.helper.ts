import { BadRequestException } from '@nestjs/common';
import Client from '../interfaces/Client';
import { PrismaService } from '../prisma/prisma.service';
import HTTP_MESSAGES from '../utils/messages/httpMessages';
import generateTimestamp from './generateTimestamp';
import LOGGER_MESSAGES from '../utils/messages/loggerMessages';
import { Logger } from 'nestjs-pino';

export async function checkClientExists(
  prisma: PrismaService,
  clientInfo: Client,
): Promise<boolean> {
  const existingClient: Client = await prisma.client.findFirst({
    where: {
      email: clientInfo.email,
    },
  });

  return !!existingClient;
}

export async function validateParentIdsExist(
  prismaService: PrismaService,
  logger: Logger,
  parentIds: string[],
): Promise<void> {
  const existingParents = await prismaService.client.findMany({
    where: {
      id: {
        in: parentIds,
      },
    },
  });

  if (existingParents.length !== parentIds.length) {
    const timestamp: string = generateTimestamp();

    logger.log({
      message: LOGGER_MESSAGES.log.client.helpers.badRequest,
      parentIds,
      pid: process.pid,
      timestamp,
    });

    throw new BadRequestException({
      message: HTTP_MESSAGES.EN.client.helpers.status_400,
      pid: process.pid,
      timestamp,
    });
  }
}
