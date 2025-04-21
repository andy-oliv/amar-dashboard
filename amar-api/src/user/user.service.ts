import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import EndpointReturn from '../interfaces/EndpointReturn';
import { User } from '../interfaces/User';
import {
  checkUserExists,
  connectUserRole,
  generateHash,
} from '../helpers/user.helper';
import generateTimestamp from '../helpers/generateTimestamp';
import HTTP_MESSAGES from '../utils/messages/httpMessages';
import LOGGER_MESSAGES from '../utils/messages/loggerMessages';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

  async createUser(userData: User): Promise<EndpointReturn> {
    const userExists: boolean = await checkUserExists(
      this.prismaService,
      userData.email,
    );

    this.logger.log(userExists);

    if (userExists) {
      const timestamp: string = generateTimestamp();

      this.logger.error({
        message: LOGGER_MESSAGES.error.user.createUser.conflict,
        conflictData: {
          name: userData.name,
          email: userData.email,
        },
        pid: process.pid,
        timestamp,
      });

      throw new ConflictException({
        message: HTTP_MESSAGES.EN.user.createUser.status_409,
        pid: process.pid,
        timestamp,
      });
    }

    const hash: string = await generateHash(userData.password);
    const id: string = uuidv4();

    try {
      const newUser: User = await this.prismaService.user.create({
        data: {
          id,
          name: userData.name,
          email: userData.email,
          password: hash,
          pictureUrl: userData.pictureUrl,
        },
      });

      await connectUserRole(
        this.prismaService,
        this.logger,
        newUser.id,
        userData.roleId,
      );

      this.logger.log({
        message: LOGGER_MESSAGES.log.user.createUser.success,
        userData: {
          name: newUser.name,
          email: newUser.email,
        },
        pid: process.pid,
        timestamp: generateTimestamp(),
      });

      return {
        message: HTTP_MESSAGES.EN.user.createUser.status_201,
        data: newUser,
      };
    } catch (error) {
      const timestamp: string = generateTimestamp();

      this.logger.error({
        message: LOGGER_MESSAGES.error.user.createUser.internalError,
        code: error.code,
        error: error.message,
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

  async fetchUsers(): Promise<EndpointReturn> {
    try {
      const users: User[] = await this.prismaService.user.findMany();

      if (users.length === 0) {
        const timestamp: string = generateTimestamp();

        this.logger.log({
          message: LOGGER_MESSAGES.log.user.fetchUsers.notFound,
          pid: process.pid,
          timestamp,
        });

        throw new NotFoundException({
          message: HTTP_MESSAGES.EN.user.fetchUsers.status_404,
          pid: process.pid,
          timestamp,
        });
      }

      return {
        message: HTTP_MESSAGES.EN.user.fetchUsers.status_200,
        data: users,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      const timestamp: string = generateTimestamp();

      this.logger.error({
        message: LOGGER_MESSAGES.error.user.fetchUsers.internalError,
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

  async fetchUser(id: string): Promise<EndpointReturn> {
    try {
      const user: User = await this.prismaService.user.findUniqueOrThrow({
        where: {
          id,
        },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
          notifications: true,
          photoContracts: true,
          videoContracts: true,
        },
      });

      return {
        message: HTTP_MESSAGES.EN.user.fetchUser.status_200,
        data: user,
      };
    } catch (error) {
      const timestamp: string = generateTimestamp();

      if (error.code === 'P2025') {
        this.logger.log({
          message: LOGGER_MESSAGES.log.user.fetchUser.notFound,
          pid: process.pid,
          timestamp,
        });

        throw new NotFoundException({
          message: HTTP_MESSAGES.EN.user.fetchUser.status_404,
          pid: process.pid,
          timestamp,
        });
      }

      this.logger.error({
        message: LOGGER_MESSAGES.error.user.fetchUser.internalError,
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

  async updateUser(updatedData: Partial<User>): Promise<EndpointReturn> {
    const userExists: boolean = await checkUserExists(
      this.prismaService,
      updatedData.email,
    );

    if (!userExists) {
      const timestamp: string = generateTimestamp();

      this.logger.error({
        message: LOGGER_MESSAGES.error.user.updateUser.notFound,
        pid: process.pid,
        timestamp,
      });

      throw new NotFoundException({
        message: HTTP_MESSAGES.EN.user.updateUser.status_404,
        pid: process.pid,
        timestamp,
      });
    }

    try {
      await connectUserRole(
        this.prismaService,
        this.logger,
        updatedData.id,
        updatedData.roleId,
      );

      const updatedUser: User = await this.prismaService.user.update({
        where: {
          id: updatedData.id,
        },
        data: {
          name: updatedData.name,
          email: updatedData.email,
          password: updatedData.password,
          pictureUrl: updatedData.pictureUrl,
        },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });

      return {
        message: HTTP_MESSAGES.EN.user.updateUser.status_200,
        data: updatedUser,
      };
    } catch (error) {
      const timestamp: string = generateTimestamp();

      this.logger.error({
        message: LOGGER_MESSAGES.error.user.updateUser.internalError,
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

  async deleteUser(id: string): Promise<EndpointReturn> {
    const userExists: User = await this.prismaService.user.findFirst({
      where: {
        id,
      },
    });

    if (!userExists) {
      const timestamp: string = generateTimestamp();

      this.logger.error({
        message: LOGGER_MESSAGES.error.user.deleteUser.notFound,
        pid: process.pid,
        timestamp,
      });

      throw new NotFoundException({
        message: HTTP_MESSAGES.EN.user.deleteUser.status_404,
        pid: process.pid,
        timestamp,
      });
    }

    try {
      const deletedUser: User = await this.prismaService.user.delete({
        where: {
          id,
        },
      });
      this.logger.log({
        message: LOGGER_MESSAGES.log.user.deleteUser.success,
        deletedUser: {
          id: deletedUser.id,
          name: deletedUser.name,
          email: deletedUser.email,
        },
      });

      return {
        message: HTTP_MESSAGES.EN.user.deleteUser.status_200,
        data: deletedUser,
      };
    } catch (error) {
      const timestamp: string = generateTimestamp();

      this.logger.error({
        message: LOGGER_MESSAGES.error.user.deleteUser.internalError,
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
