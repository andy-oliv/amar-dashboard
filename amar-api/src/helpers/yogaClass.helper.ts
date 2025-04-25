import { NotFoundException } from '@nestjs/common';
import YogaClass from '../interfaces/YogaClass';
import { PrismaService } from '../prisma/prisma.service';
import HTTP_MESSAGES from '../utils/messages/httpMessages';
import LOGGER_MESSAGES from '../utils/messages/loggerMessages';
import generateTimestamp from './generateTimestamp';
import { Child, Client } from '../../prisma/generated/prisma-client-js';

export async function checkClassExists(
  prismaService: PrismaService,
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

      this.logger.error({
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

      this.logger.error({
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
