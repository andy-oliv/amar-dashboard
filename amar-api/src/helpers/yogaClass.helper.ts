import { BadRequestException, NotFoundException } from '@nestjs/common';
import YogaClass from '../interfaces/YogaClass';
import { PrismaService } from '../prisma/prisma.service';
import HTTP_MESSAGES from '../utils/messages/httpMessages';
import LOGGER_MESSAGES from '../utils/messages/loggerMessages';
import generateTimestamp from './generateTimestamp';
import { Child, Client } from '../../prisma/generated/prisma-client-js';
import Role from '../interfaces/Role';
import { findUser } from './user.helper';
import { User } from '../interfaces/User';
import dayjs from 'dayjs';
import { Logger } from 'nestjs-pino';

export async function checkClassExists(
  prismaService: PrismaService,
  logger: Logger,
  classId: number,
) {
  try {
    const foundClass: YogaClass =
      await prismaService.yogaClass.findFirstOrThrow({
        where: {
          id: classId,
        },
      });

    return foundClass;
  } catch (error) {
    if (error.code === 'P2025') {
      const timestamp: string = generateTimestamp();

      logger.error({
        message: LOGGER_MESSAGES.error.helpers.checkClassExists.notFound,
        pid: process.pid,
        timestamp,
      });

      throw new NotFoundException({
        message: HTTP_MESSAGES.EN.helpers.checkClassExists.status_404,
        pid: process.pid,
        timestamp,
      });
    }
  }
}

export async function checkStudentExists(
  prismaService: PrismaService,
  logger: Logger,
  classType: string,
  studentId: string,
) {
  let foundStudent: Client | Child;
  try {
    if (classType === 'ADULTS') {
      foundStudent = await prismaService.client.findFirstOrThrow({
        where: {
          id: studentId,
        },
      });
    } else {
      foundStudent = await prismaService.child.findFirstOrThrow({
        where: {
          id: studentId,
        },
      });
    }
  } catch (error) {
    if (error.code === 'P2025') {
      const timestamp: string = generateTimestamp();

      logger.error({
        message: LOGGER_MESSAGES.error.yogaClass.addStudent.notFound,
        pid: process.pid,
        timestamp,
      });

      throw new NotFoundException({
        message: HTTP_MESSAGES.EN.yogaClass.addStudent.status_404,
        pid: process.pid,
        timestamp,
      });
    }
  }
}

export async function checkinstructorRoles(
  prismaService: PrismaService,
  logger: Logger,
  instructorId: string,
): Promise<void> {
  const instructor: User = await findUser(prismaService, instructorId);

  let instructorRoles: string[] = instructor.roles.map((role) => role.roleId);

  if (
    instructorRoles.length === 0 ||
    !instructorRoles.includes(process.env.YOGA_INSTRUCTOR_ROLE_ID)
  ) {
    const timestamp: string = generateTimestamp();

    logger.error({
      message: LOGGER_MESSAGES.error.helpers.findUser.notFound,
      pid: process.pid,
      timestamp,
    });

    throw new NotFoundException({
      message: HTTP_MESSAGES.EN.helpers.findUser.status_404,
      pid: process.pid,
      timestamp,
    });
  }
}

export async function checkDateIsPast(date: string | Date): Promise<void> {
  if (dayjs(date).isBefore(dayjs())) {
    throw new BadRequestException({
      message: HTTP_MESSAGES.EN.yogaClass.updateClass.status_400,
      pid: process.pid,
      timestamp: generateTimestamp(),
    });
  }
}
