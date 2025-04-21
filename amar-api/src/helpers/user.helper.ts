import { User } from '../interfaces/User';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import LOGGER_MESSAGES from '../utils/messages/loggerMessages';
import generateTimestamp from './generateTimestamp';
import { InternalServerErrorException } from '@nestjs/common';
import HTTP_MESSAGES from '../utils/messages/httpMessages';
import { Logger } from 'nestjs-pino';

export async function checkUserExists(
  prismaService: PrismaService,
  email: string,
): Promise<boolean> {
  const userExists: User = await prismaService.user.findFirst({
    where: {
      email,
    },
  });
  return !!userExists;
}

export async function findUser(
  prismaService: PrismaService,
  id: string,
): Promise<User> {
  const user: User = await prismaService.user.findFirst({
    where: {
      id,
    },
  });

  return user;
}

export async function generateHash(password: string): Promise<string> {
  const hashedPassword: string = await bcrypt.hash(password, 12);

  return hashedPassword;
}

export async function connectUserRole(
  prismaService: PrismaService,
  logger: Logger,
  userId: string,
  roles: string[],
) {
  try {
    if (roles !== undefined && roles.length > 0) {
      for (const role of roles) {
        const connectionExists = await prismaService.userRole.findFirst({
          where: {
            userId,
            roleId: role,
          },
        });

        if (!connectionExists) {
          await prismaService.userRole.create({
            data: {
              userId: userId,
              roleId: role,
            },
          });
        }
      }
    }
  } catch (error) {
    const timestamp: string = generateTimestamp();

    logger.error({
      message: LOGGER_MESSAGES.error.user.createUser.internalConnectionError,
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
