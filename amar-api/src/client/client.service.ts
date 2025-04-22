import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { PrismaService } from '../prisma/prisma.service';
import Client from '../interfaces/Client';
import { checkClientExists } from '../helpers/client.helper';
import generateTimestamp from '../helpers/generateTimestamp';
import HTTP_MESSAGES from '../utils/messages/httpMessages';
import LOGGER_MESSAGES from '../utils/messages/loggerMessages';
import EndpointReturn from '../interfaces/EndpointReturn';

@Injectable()
export class ClientService {
  constructor(
    private readonly logger: Logger,
    private readonly prismaService: PrismaService,
  ) {}

  async createClient(
    clientInfo: Client,
  ): Promise<{ message: string; data: Client }> {
    const clientExists: boolean = await checkClientExists(
      this.prismaService,
      clientInfo,
    );

    if (clientExists) {
      const timestamp: string = generateTimestamp();

      this.logger.error({
        message: LOGGER_MESSAGES.error.client.createClient.conflict,
        clientData: {
          name: clientInfo.name,
          email: clientInfo.email,
        },
        pid: process.pid,
        timestamp: timestamp,
      });

      throw new ConflictException({
        message: HTTP_MESSAGES.EN.client.createClient.status_409,
        pid: process.pid,
        timestamp: timestamp,
      });
    }

    try {
      const newClient: Client = await this.prismaService.client.create({
        data: clientInfo,
      });

      this.logger.log({
        message: LOGGER_MESSAGES.log.client.createClient.success,
        clientData: {
          id: newClient.id,
          name: newClient.name,
          email: newClient.email,
        },
        pid: process.pid,
        timestamp: generateTimestamp(),
      });
      return {
        message: HTTP_MESSAGES.EN.client.createClient.status_201,
        data: newClient,
      };
    } catch (error) {
      const timestamp: string = generateTimestamp();

      this.logger.error({
        message: LOGGER_MESSAGES.error.client.createClient.internalError,
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

  async fetchClients(): Promise<{ message: string; data: Client[] }> {
    try {
      const clientList: Client[] = await this.prismaService.client.findMany();

      if (clientList.length === 0) {
        const timestamp: string = generateTimestamp();

        this.logger.log({
          message: LOGGER_MESSAGES.log.client.fetchClients.notFound,
          pid: process.pid,
          timestamp,
        });

        throw new NotFoundException({
          message: HTTP_MESSAGES.EN.client.fetchClients.status_404,
          pid: process.pid,
          timestamp,
        });
      }

      return {
        message: HTTP_MESSAGES.EN.client.fetchClients.status_200,
        data: clientList,
      };
    } catch (error) {
      const timestamp: string = generateTimestamp();

      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error({
        message: LOGGER_MESSAGES.error.client.fetchClients.internalError,
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

  async fetchClient(
    clientId: string,
  ): Promise<{ message: string; data: Client }> {
    try {
      const client: Client = await this.prismaService.client.findUniqueOrThrow({
        where: {
          id: clientId,
        },
        include: {
          children: true,
          yogaClasses: true,
          presences: true,
          contracts: true,
          notifications: true,
        },
      });

      return {
        message: HTTP_MESSAGES.EN.client.fetchClient.status_200,
        data: client,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        const timestamp: string = generateTimestamp();

        this.logger.log({
          message: LOGGER_MESSAGES.log.client.fetchClient.notFound,
          pid: process.pid,
          timestamp,
        });

        throw new NotFoundException({
          message: HTTP_MESSAGES.EN.client.fetchClient.status_404,
          pid: process.pid,
          timestamp,
        });
      }

      const timestamp: string = generateTimestamp();

      this.logger.error({
        message: LOGGER_MESSAGES.error.client.fetchClient.internalError,
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

  async updateClient(updatedData: Partial<Client>): Promise<EndpointReturn> {
    try {
      await this.prismaService.client.findUniqueOrThrow({
        where: {
          id: updatedData.id,
        },
      });

      const updatedClient: Client = await this.prismaService.client.update({
        where: {
          id: updatedData.id,
        },
        data: {
          name: updatedData.name,
          email: updatedData.email,
          address: updatedData.address,
          neighborhood: updatedData.neighborhood,
          city: updatedData.city,
          cpf: updatedData.cpf,
        },
      });

      return {
        message: HTTP_MESSAGES.EN.client.updateClient.status_200,
        data: updatedClient,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        const timestamp: string = generateTimestamp();

        this.logger.error({
          message: LOGGER_MESSAGES.error.client.updateClient.notFound,
          pid: process.pid,
          timestamp,
        });

        throw new NotFoundException({
          message: HTTP_MESSAGES.EN.client.updateClient.status_404,
          pid: process.pid,
          timestamp,
        });
      }

      const timestamp: string = generateTimestamp();

      this.logger.error({
        message: LOGGER_MESSAGES.error.client.updateClient.internalError,
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

  async deleteClient(id: string): Promise<EndpointReturn> {
    try {
      await this.prismaService.client.findUniqueOrThrow({
        where: {
          id,
        },
      });

      const deletedClient: Client = await this.prismaService.client.delete({
        where: {
          id,
        },
      });

      this.logger.log({
        message: LOGGER_MESSAGES.log.client.deleteClient.success,
        deletedClientData: {
          id: deletedClient.id,
          name: deletedClient.name,
          email: deletedClient.email,
        },
      });

      return {
        message: HTTP_MESSAGES.EN.client.deleteClient.status_200,
        data: deletedClient,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        const timestamp: string = generateTimestamp();

        this.logger.error({
          message: LOGGER_MESSAGES.error.client.deleteClient.notFound,
          pid: process.pid,
          timestamp,
        });

        throw new NotFoundException({
          message: HTTP_MESSAGES.EN.client.deleteClient.status_404,
          pid: process.pid,
          timestamp,
        });
      }

      const timestamp: string = generateTimestamp();

      this.logger.error({
        message: LOGGER_MESSAGES.error.client.deleteClient.internalError,
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
