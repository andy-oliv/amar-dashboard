import { Test, TestingModule } from '@nestjs/testing';
import { ClientService } from './client.service';
import { checkClientExists } from '../helpers/client.helper';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import generateMockClient from '../utils/mocks/generateMockClients';
import Client from '../interfaces/Client';
import LOGGER_MESSAGES from '../utils/messages/loggerMessages';
import EndpointReturn from '../interfaces/EndpointReturn';
import HTTP_MESSAGES from '../utils/messages/httpMessages';
import { PrismaClientKnownRequestError } from '../../prisma/generated/prisma-client-js/runtime/library';
import { Prisma } from '../../prisma/generated/prisma-client-js';
import generateTimestamp from '../helpers/generateTimestamp';
import { faker } from '@faker-js/faker/.';

jest.mock('../helpers/client.helper');

describe('ClientService', () => {
  let clientService: ClientService;
  let prismaService: PrismaService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientService,
        {
          provide: PrismaService,
          useValue: {
            client: {
              create: jest.fn(),
              findMany: jest.fn(),
              findFirstOrThrow: jest.fn(),
              findUniqueOrThrow: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    clientService = module.get<ClientService>(ClientService);
    prismaService = module.get<PrismaService>(PrismaService);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(clientService).toBeDefined();
  });

  describe('createClient()', () => {
    it('should create a client', async () => {
      const client: Client = generateMockClient();
      const timestamp: string = 'mock-timestamp';

      (checkClientExists as jest.Mock).mockResolvedValue(false);
      (prismaService.client.create as jest.Mock).mockResolvedValue(client);
      (logger.log as jest.Mock).mockResolvedValue({
        message: LOGGER_MESSAGES.log.client.createClient.success,
        clientData: {
          id: client.id,
          name: client.name,
          email: client.email,
        },
        pid: process.pid,
        timestamp,
      });

      const result: EndpointReturn = await clientService.createClient(client);

      expect(checkClientExists).toHaveBeenCalledWith(prismaService, client);
      expect(prismaService.client.create).toHaveBeenCalledWith({
        data: client,
      });
      expect(logger.log).toHaveBeenCalled();

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.client.createClient.status_201,
        data: client,
      });
    });

    it('should throw a conflict exception', async () => {
      const client: Client = generateMockClient();
      const timestamp: string = 'mock-timestamp';

      (checkClientExists as jest.Mock).mockReturnValue(true);
      (logger.error as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.error.client.createClient.conflict,
        clientData: {
          name: client.name,
          email: client.email,
        },
        pid: process.pid,
        timestamp: timestamp,
      });

      await expect(clientService.createClient(client)).rejects.toThrow(
        HTTP_MESSAGES.EN.client.createClient.status_409,
      );

      expect(checkClientExists).toHaveBeenCalledWith(prismaService, client);
      expect(logger.error).toHaveBeenCalled();
    });

    it('should throw an internal server error', async () => {
      const client: Client = generateMockClient();
      const timestamp: string = 'mock-timestamp';
      const error: any = {
        code: '',
        message: '',
        stack: '',
      };

      (checkClientExists as jest.Mock).mockReturnValue(false);
      (logger.error as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.error.client.createClient.internalError,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp: timestamp,
      });
      (prismaService.client.create as jest.Mock).mockRejectedValue(
        'prismaValidationError',
      );

      await expect(clientService.createClient(client)).rejects.toThrow(
        HTTP_MESSAGES.EN.generalMessages.status_500,
      );

      expect(checkClientExists).toHaveBeenCalledWith(prismaService, client);
      expect(logger.error).toHaveBeenCalled();
      expect(prismaService.client.create).toHaveBeenCalledWith({
        data: client,
      });
    });
  });

  describe('fetchclients()', () => {
    it('should fetch all clients', async () => {
      const clientA: Client = generateMockClient();
      const clientB: Client = generateMockClient();
      const clients: Client[] = [clientA, clientB];

      (prismaService.client.findMany as jest.Mock).mockResolvedValue(clients);

      const result: EndpointReturn = await clientService.fetchClients();

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.client.fetchClients.status_200,
        data: clients,
      });
      expect(prismaService.client.findMany).toHaveBeenCalled();
    });

    it('should throw a not found exception', async () => {
      const clients: Client[] = [];
      const timestamp: string = 'mock-timestamp';

      (prismaService.client.findMany as jest.Mock).mockResolvedValue(clients);
      (logger.log as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.log.client.fetchClients.notFound,
        pid: process.pid,
        timestamp,
      });

      await expect(clientService.fetchClients()).rejects.toThrow(
        HTTP_MESSAGES.EN.client.fetchClients.status_404,
      );

      expect(prismaService.client.findMany).toHaveBeenCalled();
      expect(logger.log).toHaveBeenCalled();
    });

    it('should throw an internal server error', async () => {
      const timestamp: string = 'mock-timestamp';
      const error: any = {
        code: '',
        message: '',
        stack: '',
      };

      (prismaService.client.findMany as jest.Mock).mockRejectedValue(
        'prismaValidationError',
      );
      (logger.error as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.error.client.fetchClients.internalError,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp,
      });

      await expect(clientService.fetchClients()).rejects.toThrow(
        HTTP_MESSAGES.EN.generalMessages.status_500,
      );

      expect(prismaService.client.findMany).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('fetchclient()', () => {
    it('should fetch a client', async () => {
      const client: Client = generateMockClient();

      (prismaService.client.findUniqueOrThrow as jest.Mock).mockResolvedValue(
        client,
      );

      const result: EndpointReturn = await clientService.fetchClient(client.id);

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.client.fetchClient.status_200,
        data: client,
      });

      expect(prismaService.client.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          id: client.id,
        },
        include: {
          children: {
            include: {
              child: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          yogaClasses: true,
          presences: true,
          contracts: true,
          notifications: true,
        },
      });
    });

    it('should throw a not found exception', async () => {
      const client: Client = generateMockClient();
      const timestamp: string = generateTimestamp();
      const error: PrismaClientKnownRequestError =
        new Prisma.PrismaClientKnownRequestError('Record not found', {
          code: 'P2025',
          clientVersion: 'fake-client-version',
        });

      (prismaService.client.findUniqueOrThrow as jest.Mock).mockRejectedValue(
        error,
      );
      (logger.log as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.log.client.fetchClient.notFound,
        pid: process.pid,
        timestamp,
      });

      await expect(clientService.fetchClient(client.id)).rejects.toThrow(
        HTTP_MESSAGES.EN.client.fetchClient.status_404,
      );

      expect(prismaService.client.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          id: client.id,
        },
        include: {
          children: {
            include: {
              child: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          yogaClasses: true,
          presences: true,
          contracts: true,
          notifications: true,
        },
      });

      expect(logger.log).toHaveBeenCalled();
    });

    it('should throw an internal server error', async () => {
      const client: Client = generateMockClient();
      const error: any = {
        code: '',
        message: '',
        stack: '',
      };
      const timestamp: string = 'mock-timestamp';

      (prismaService.client.findUniqueOrThrow as jest.Mock).mockRejectedValue(
        'prismaValidationError',
      );
      (logger.error as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.error.client.fetchClient.internalError,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp,
      });

      await expect(clientService.fetchClient(client.id)).rejects.toThrow(
        HTTP_MESSAGES.EN.generalMessages.status_500,
      );

      expect(prismaService.client.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          id: client.id,
        },
        include: {
          children: {
            include: {
              child: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          yogaClasses: true,
          presences: true,
          contracts: true,
          notifications: true,
        },
      });

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('fetchClientByName()', () => {
    it('should fetch a client', async () => {
      const client: Client = generateMockClient();

      (prismaService.client.findFirstOrThrow as jest.Mock).mockResolvedValue(
        client,
      );

      const result: EndpointReturn = await clientService.fetchClientByName(
        client.name,
      );

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.client.fetchClientByName.status_200,
        data: client,
      });

      expect(prismaService.client.findFirstOrThrow).toHaveBeenCalledWith({
        where: {
          name: {
            contains: client.name,
          },
        },
        include: {
          children: {
            select: {
              child: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          yogaClasses: true,
          presences: true,
          contracts: true,
          notifications: true,
        },
      });
    });

    it('should throw a not found exception', async () => {
      const client: Client = generateMockClient();
      const timestamp: string = generateTimestamp();
      const error: PrismaClientKnownRequestError =
        new Prisma.PrismaClientKnownRequestError('Record not found', {
          code: 'P2025',
          clientVersion: 'fake-client-version',
        });

      (prismaService.client.findFirstOrThrow as jest.Mock).mockRejectedValue(
        error,
      );
      (logger.log as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.log.client.fetchClientByName.notFound,
        pid: process.pid,
        timestamp,
      });

      await expect(
        clientService.fetchClientByName(client.name),
      ).rejects.toThrow(HTTP_MESSAGES.EN.client.fetchClientByName.status_404);

      expect(prismaService.client.findFirstOrThrow).toHaveBeenCalledWith({
        where: {
          name: {
            contains: client.name,
          },
        },
        include: {
          children: {
            select: {
              child: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          yogaClasses: true,
          presences: true,
          contracts: true,
          notifications: true,
        },
      });

      expect(logger.log).toHaveBeenCalled();
    });

    it('should throw an internal server error', async () => {
      const client: Client = generateMockClient();
      const error: any = {
        code: '',
        message: '',
        stack: '',
      };
      const timestamp: string = 'mock-timestamp';

      (prismaService.client.findFirstOrThrow as jest.Mock).mockRejectedValue(
        'prismaValidationError',
      );
      (logger.error as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.error.client.fetchClientByName.internalError,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp,
      });

      await expect(
        clientService.fetchClientByName(client.name),
      ).rejects.toThrow(HTTP_MESSAGES.EN.generalMessages.status_500);

      expect(prismaService.client.findFirstOrThrow).toHaveBeenCalledWith({
        where: {
          name: {
            contains: client.name,
          },
        },
        include: {
          children: {
            select: {
              child: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          yogaClasses: true,
          presences: true,
          contracts: true,
          notifications: true,
        },
      });

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('updateClient()', () => {
    it('should update a client', async () => {
      const client: Client = generateMockClient();
      const updatedClient: Partial<Client> = {
        id: client.id,
        name: faker.person.fullName(),
        email: client.email,
        address: client.address,
        neighborhood: client.neighborhood,
        city: client.city,
        cpf: client.cpf,
      };

      (prismaService.client.findUniqueOrThrow as jest.Mock).mockResolvedValue(
        client,
      );
      (prismaService.client.update as jest.Mock).mockResolvedValue(
        updatedClient,
      );

      const result: EndpointReturn =
        await clientService.updateClient(updatedClient);

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.client.updateClient.status_200,
        data: updatedClient,
      });

      expect(prismaService.client.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          id: updatedClient.id,
        },
      });

      expect(prismaService.client.update).toHaveBeenCalledWith({
        where: {
          id: updatedClient.id,
        },
        data: {
          name: updatedClient.name,
          email: updatedClient.email,
          address: updatedClient.address,
          neighborhood: updatedClient.neighborhood,
          city: updatedClient.city,
          cpf: updatedClient.cpf,
        },
      });
    });

    it('should throw a not found exception', async () => {
      const client: Client = generateMockClient();
      const error: PrismaClientKnownRequestError =
        new Prisma.PrismaClientKnownRequestError('Record not found', {
          code: 'P2025',
          clientVersion: 'fake-client-version',
        });
      const timestamp: string = 'mock-timestamp';

      (prismaService.client.findUniqueOrThrow as jest.Mock).mockRejectedValue(
        error,
      );
      (logger.error as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.error.client.deleteClient.notFound,
        pid: process.pid,
        timestamp,
      });

      await expect(clientService.updateClient(client)).rejects.toThrow(
        HTTP_MESSAGES.EN.client.updateClient.status_404,
      );

      expect(prismaService.client.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          id: client.id,
        },
      });

      expect(logger.error).toHaveBeenCalled();
    });

    it('should throw an internal server error', async () => {
      const client: Client = generateMockClient();
      const updatedClient: Partial<Client> = {
        id: client.id,
        name: faker.person.fullName(),
        email: client.email,
        address: client.address,
        neighborhood: client.neighborhood,
        city: client.city,
        cpf: client.cpf,
      };
      const error: any = {
        code: '',
        message: '',
        stack: '',
      };
      const timestamp: string = 'mock-timestamp';

      (prismaService.client.findUniqueOrThrow as jest.Mock).mockResolvedValue(
        client,
      );
      (prismaService.client.update as jest.Mock).mockRejectedValue(
        'prismaValidationError',
      );
      (logger.error as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.error.client.updateClient.internalError,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp,
      });

      await expect(clientService.updateClient(updatedClient)).rejects.toThrow(
        HTTP_MESSAGES.EN.generalMessages.status_500,
      );

      expect(prismaService.client.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          id: updatedClient.id,
        },
      });

      expect(prismaService.client.update).toHaveBeenCalledWith({
        where: {
          id: updatedClient.id,
        },
        data: {
          name: updatedClient.name,
          email: updatedClient.email,
          address: updatedClient.address,
          neighborhood: updatedClient.neighborhood,
          city: updatedClient.city,
          cpf: updatedClient.cpf,
        },
      });

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('deleteClient()', () => {
    it('should update a client', async () => {
      const client: Client = generateMockClient();

      (prismaService.client.findUniqueOrThrow as jest.Mock).mockResolvedValue(
        client,
      );
      (prismaService.client.delete as jest.Mock).mockResolvedValue(client);

      const result: EndpointReturn = await clientService.deleteClient(
        client.id,
      );

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.client.deleteClient.status_200,
        data: client,
      });

      expect(prismaService.client.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          id: client.id,
        },
      });

      expect(prismaService.client.delete).toHaveBeenCalledWith({
        where: {
          id: client.id,
        },
      });
    });

    it('should throw a not found exception', async () => {
      const client: Client = generateMockClient();
      const error: PrismaClientKnownRequestError =
        new Prisma.PrismaClientKnownRequestError('Record not found', {
          code: 'P2025',
          clientVersion: 'fake-client-version',
        });
      const timestamp: string = 'mock-timestamp';

      (prismaService.client.findUniqueOrThrow as jest.Mock).mockRejectedValue(
        error,
      );
      (logger.error as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.error.client.deleteClient.notFound,
        pid: process.pid,
        timestamp,
      });

      await expect(clientService.deleteClient(client.id)).rejects.toThrow(
        HTTP_MESSAGES.EN.client.deleteClient.status_404,
      );

      expect(prismaService.client.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          id: client.id,
        },
      });

      expect(logger.error).toHaveBeenCalled();
    });

    it('should throw an internal server error', async () => {
      const client: Client = generateMockClient();
      const error: any = {
        code: '',
        message: '',
        stack: '',
      };
      const timestamp: string = 'mock-timestamp';

      (prismaService.client.findUniqueOrThrow as jest.Mock).mockResolvedValue(
        client,
      );
      (prismaService.client.update as jest.Mock).mockRejectedValue(
        'prismaValidationError',
      );
      (logger.error as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.error.client.updateClient.internalError,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp,
      });

      await expect(clientService.deleteClient(client.id)).rejects.toThrow(
        HTTP_MESSAGES.EN.generalMessages.status_500,
      );

      expect(prismaService.client.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          id: client.id,
        },
      });

      expect(prismaService.client.delete).toHaveBeenCalledWith({
        where: {
          id: client.id,
        },
      });

      expect(logger.error).toHaveBeenCalled();
    });
  });
});
