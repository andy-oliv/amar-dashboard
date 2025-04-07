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
        message: 'Client already exists in the database',
        clientData: {
          name: clientInfo.name,
          email: clientInfo.email,
          cpf: clientInfo.cpf,
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

      return {
        message: HTTP_MESSAGES.EN.client.createClient.status_201,
        data: newClient,
      };
    } catch (error) {
      const timestamp: string = generateTimestamp();

      this.logger.error({
        message: 'An error occurred during the creation of the new client.',
        code: error.code,
        error,
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
          message: 'There are no clients to show.',
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
        message: 'An error occurred while fetching the clients.',
        code: error.code,
        error,
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
