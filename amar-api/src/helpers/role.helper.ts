import { NotFoundException } from '@nestjs/common';
import Role from '../interfaces/Role';
import { PrismaService } from '../prisma/prisma.service';
import generateTimestamp from './generateTimestamp';
import { Logger } from 'nestjs-pino';
import HTTP_MESSAGES from '../utils/messages/httpMessages';
import LOGGER_MESSAGES from '../utils/messages/loggerMessages';

export async function checkRoleExists(
  prisma: PrismaService,
  roleInfo: Role,
): Promise<boolean> {
  const existingRole: Role = await prisma.role.findFirst({
    where: {
      title: roleInfo.title,
    },
  });

  return !!existingRole;
}

export async function getRole(
  prisma: PrismaService,
  logger: Logger,
  roleId: string,
): Promise<Role> {
  const fetchedRole: Role = await prisma.role.findUnique({
    where: {
      id: roleId,
    },
  });

  if (!fetchedRole) {
    const timestamp: string = generateTimestamp();

    logger.log({
      message: LOGGER_MESSAGES.log.role.fetchRole.notFound,
      pid: process.pid,
      timestamp,
    });

    throw new NotFoundException({
      message: HTTP_MESSAGES.EN.role.fetchRole.status_404,
      pid: process.pid,
      timestamp,
    });
  }

  return fetchedRole;
}
