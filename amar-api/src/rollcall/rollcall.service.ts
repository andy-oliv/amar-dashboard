import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import EndpointReturn from '../interfaces/EndpointReturn';
import RollCall from '../interfaces/Rollcall';
import { checkRollCallExists } from '../helpers/rollcall.helper';
import HTTP_MESSAGES from '../utils/messages/httpMessages';
import generateTimestamp from '../helpers/generateTimestamp';
import LOGGER_MESSAGES from '../utils/messages/loggerMessages';
import { checkClassExists } from '../helpers/yogaClass.helper';
import { parseIsoString } from '../helpers/time.helper';
import * as dayjs from 'dayjs';

@Injectable()
export class RollcallService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

  async createRollCall(rollcallData: RollCall): Promise<EndpointReturn> {
    await checkClassExists(
      this.prismaService,
      this.logger,
      rollcallData.classId,
    );
    await checkRollCallExists(this.prismaService, rollcallData.classId);

    try {
      const newRollCall: RollCall = await this.prismaService.rollCall.create({
        data: {
          classId: rollcallData.classId,
          date: parseIsoString(rollcallData.date),
        },
      });

      return {
        message: HTTP_MESSAGES.EN.rollCall.createRollCall.status_201,
        data: newRollCall,
      };
    } catch (error) {
      const timestamp: string = generateTimestamp();

      this.logger.error({
        message: LOGGER_MESSAGES.error.rollCall.createRollCall.internalError,
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

  async fetchRollCalls(): Promise<EndpointReturn> {
    try {
      const rollCalls: RollCall[] =
        await this.prismaService.rollCall.findMany();

      if (rollCalls.length === 0) {
        const timestamp: string = generateTimestamp();

        this.logger.log({
          message: LOGGER_MESSAGES.log.rollCall.fetchRollCalls.notFound,
          pid: process.pid,
          timestamp,
        });

        throw new NotFoundException({
          message: HTTP_MESSAGES.EN.rollCall.fetchRollCalls.status_404,
          pid: process.pid,
          timestamp,
        });
      }

      return {
        message: HTTP_MESSAGES.EN.rollCall.fetchRollCalls.status_200,
        data: rollCalls,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      const timestamp: string = generateTimestamp();

      this.logger.error({
        message: LOGGER_MESSAGES.error.rollCall.fetchRollCalls.internalError,
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
