import { ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import generateTimestamp from './generateTimestamp';
import HTTP_MESSAGES from '../utils/messages/httpMessages';

export async function checkRollCallExists(
  prismaService: PrismaService,
  classId: number,
): Promise<void> {
  const rollCallExists = await prismaService.rollCall.findFirst({
    where: {
      classId,
    },
  });

  if (rollCallExists) {
    throw new ConflictException({
      message: HTTP_MESSAGES.EN.helpers.checkRollCallExists.status_409,
      pid: process.pid,
      timestamp: generateTimestamp(),
    });
  }
}
