import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import Role from '../interfaces/Role';
import EndpointReturn from '../interfaces/EndpointReturn';
import { checkRoleExists, getRole } from '../helpers/role.helper';
import generateTimestamp from '../helpers/generateTimestamp';
import HTTP_MESSAGES from '../utils/messages/httpMessages';
import { v4 as uuidv4 } from 'uuid';
import LOGGER_MESSAGES from '../utils/messages/loggerMessages';

@Injectable()
export class RoleService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

  async createRole(roleInfo: Role): Promise<EndpointReturn> {
    const roleExists: boolean = await checkRoleExists(
      this.prismaService,
      roleInfo,
    );

    if (roleExists) {
      const timestamp: string = generateTimestamp();

      this.logger.error({
        message: LOGGER_MESSAGES.error.role.createRole.conflict,
        roleTitle: roleInfo.title,
        pid: process.pid,
        timestamp,
      });

      throw new ConflictException({
        message: HTTP_MESSAGES.EN.role.createRole.status_409,
        pid: process.pid,
        timestamp,
      });
    }

    const id: string = uuidv4();

    try {
      const newRole: Role = await this.prismaService.role.create({
        data: {
          id: id,
          title: roleInfo.title,
        },
      });

      this.logger.log({
        message: LOGGER_MESSAGES.log.role.createRole.success,
        roleData: {
          id: newRole.id,
          title: newRole.title,
        },
        pid: process.pid,
        timestamp: generateTimestamp(),
      });

      return {
        message: HTTP_MESSAGES.EN.role.createRole.status_201,
        data: newRole,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      const timestamp: string = generateTimestamp();
      this.logger.error({
        message: LOGGER_MESSAGES.error.role.createRole.internalError,
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

  async fetchRoles(): Promise<EndpointReturn> {
    try {
      const registeredRoles: Role[] = await this.prismaService.role.findMany();

      if (registeredRoles.length === 0) {
        const timestamp: string = generateTimestamp();

        this.logger.log({
          message: LOGGER_MESSAGES.log.role.fetchRoles.notFound,
          pid: process.pid,
          timestamp,
        });

        throw new NotFoundException({
          message: HTTP_MESSAGES.EN.role.fetchRoles.status_404,
          pid: process.pid,
          timestamp,
        });
      }

      return {
        message: HTTP_MESSAGES.EN.role.fetchRoles.status_200,
        data: registeredRoles,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      const timestamp: string = generateTimestamp();

      this.logger.error({
        message: LOGGER_MESSAGES.error.role.fetchRoles.internalError,
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

  async fetchRole(id: string): Promise<EndpointReturn> {
    try {
      const fetchedRole: Role = await this.prismaService.role.findUniqueOrThrow(
        {
          where: {
            id,
          },
        },
      );

      return {
        message: HTTP_MESSAGES.EN.role.fetchRole.status_200,
        data: fetchedRole,
      };
    } catch (error) {
      const timestamp: string = generateTimestamp();

      if (error.code === 'P2025') {
        this.logger.log({
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

      this.logger.error({
        message: LOGGER_MESSAGES.error.role.fetchRole,
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

  async updateRole(updatedData: Role): Promise<EndpointReturn> {
    const role: Role = await getRole(
      this.prismaService,
      this.logger,
      updatedData.id,
    );

    try {
      const updatedRole: Role = await this.prismaService.role.update({
        where: {
          id: role.id,
        },
        data: {
          title: updatedData.title,
        },
      });

      return {
        message: HTTP_MESSAGES.EN.role.updateRole.status_200,
        data: updatedRole,
      };
    } catch (error) {
      const timestamp: string = generateTimestamp();

      this.logger.error({
        message: LOGGER_MESSAGES.error.role.updateRole.internalError,
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

  async deleteRole(id: string): Promise<{ message: string }> {
    const role: Role = await getRole(this.prismaService, this.logger, id);

    try {
      await this.prismaService.role.delete({
        where: {
          id: role.id,
        },
      });

      return { message: HTTP_MESSAGES.EN.role.deleteRole.status_200 };
    } catch (error) {
      const timestamp: string = generateTimestamp();

      this.logger.error({
        message: LOGGER_MESSAGES.error.role.deleteRole.internalError,
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
