import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import Child from '../interfaces/Child';
import EndpointReturn from '../interfaces/EndpointReturn';
import { checkChildExists } from '../helpers/child.helper';
import generateTimestamp from '../helpers/generateTimestamp';
import LOGGER_MESSAGES from '../utils/messages/loggerMessages';
import HTTP_MESSAGES from '../utils/messages/httpMessages';
import Client from '../interfaces/Client';
import { validateParentIdsExist } from '../helpers/client.helper';

@Injectable()
export class ChildService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

  async createChild(childInfo: Child): Promise<EndpointReturn> {
    await validateParentIdsExist(
      this.prismaService,
      this.logger,
      childInfo.parentId,
    );

    const childExists: boolean = await checkChildExists(
      this.prismaService,
      childInfo,
    );

    if (childExists) {
      const timestamp: string = generateTimestamp();

      this.logger.error({
        message: LOGGER_MESSAGES.error.child.createChild.conflict,
        childData: {
          name: childInfo.name,
          parentIds: childInfo.parentId,
        },
        pid: process.pid,
        timestamp,
      });

      throw new ConflictException({
        message: HTTP_MESSAGES.EN.child.createChild.status_409,
        pid: process.pid,
        timestamp,
      });
    }
    try {
      let child: Child = await this.prismaService.child.create({
        data: {
          name: childInfo.name,
        },
      });

      for (const id of childInfo.parentId) {
        await this.prismaService.family.create({
          data: {
            childId: child.id,
            clientId: id,
          },
        });
      }

      child = await this.prismaService.child.findUnique({
        where: {
          id: child.id,
        },
        include: {
          parents: {
            include: {
              client: true,
            },
          },
        },
      });

      this.logger.log({
        message: LOGGER_MESSAGES.log.child.createChild.success,
        childData: child,
        pid: process.pid,
        timestamp: generateTimestamp(),
      });

      return {
        message: HTTP_MESSAGES.EN.child.createChild.status_201,
        data: child,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      const timestamp: string = generateTimestamp();

      this.logger.error({
        message: LOGGER_MESSAGES.error.child.createChild.internalError,
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

  async fetchChildren(): Promise<EndpointReturn> {
    try {
      const children: Child[] = await this.prismaService.child.findMany();

      if (children.length === 0) {
        const timestamp: string = generateTimestamp();

        this.logger.log({
          message: LOGGER_MESSAGES.log.child.fetchChildren.notFound,
          pid: process.pid,
          timestamp,
        });

        throw new NotFoundException({
          message: HTTP_MESSAGES.EN.child.fetchChildren.status_404,
          pid: process.pid,
          timestamp,
        });
      }

      return {
        message: HTTP_MESSAGES.EN.child.fetchChildren.status_200,
        data: children,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      const timestamp: string = generateTimestamp();

      this.logger.error({
        message: LOGGER_MESSAGES.error.child.fetchChildren.internalError,
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
