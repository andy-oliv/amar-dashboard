import { Test, TestingModule } from '@nestjs/testing';
import { ChildService } from './child.service';
import { validateParentIdsExist } from '../helpers/client.helper';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import { checkChildExists } from '../helpers/child.helper';
import generateMockChild from '../utils/mocks/generateMockChild';
import Child from '../interfaces/Child';
import LOGGER_MESSAGES from '../utils/messages/loggerMessages';
import HTTP_MESSAGES from '../utils/messages/httpMessages';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import EndpointReturn from '../interfaces/EndpointReturn';
import { faker } from '@faker-js/faker/.';
import { PrismaClientKnownRequestError } from '../../prisma/generated/prisma-client-js/runtime/library';
import { Prisma } from '../../prisma/generated/prisma-client-js';

jest.mock('../helpers/client.helper');
jest.mock('../helpers/child.helper');

describe('ChildService', () => {
  let childService: ChildService;
  let prismaService: PrismaService;
  let logger: Logger;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChildService,
        {
          provide: PrismaService,
          useValue: {
            child: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findUniqueOrThrow: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            family: {
              create: jest.fn(),
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

    childService = module.get<ChildService>(ChildService);
    prismaService = module.get<PrismaService>(PrismaService);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(childService).toBeDefined();
  });

  describe('createChild()', () => {
    it('should register a child', async () => {
      const child: Child = generateMockChild();
      const timestamp: string = 'mock-timestamp';

      (validateParentIdsExist as jest.Mock).mockResolvedValue(undefined);
      (checkChildExists as jest.Mock).mockResolvedValue(false);
      (prismaService.child.create as jest.Mock).mockResolvedValue(child);
      prismaService.family.create as jest.Mock;
      (prismaService.child.findUnique as jest.Mock).mockResolvedValue(child);
      (logger.log as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.log.child.createChild.success,
        childData: child,
        pid: process.pid,
        timestamp,
      });

      const result: EndpointReturn = await childService.createChild(child);

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.child.createChild.status_201,
        data: child,
      });

      expect(validateParentIdsExist).toHaveBeenCalledWith(
        prismaService,
        logger,
        child.parentId,
      );
      expect(checkChildExists).toHaveBeenCalledWith(prismaService, child);
      expect(prismaService.child.create).toHaveBeenCalledWith({
        data: {
          name: child.name,
        },
      });

      expect(prismaService.family.create).toHaveBeenCalledTimes(
        child.parentId.length,
      );

      expect(prismaService.child.findUnique).toHaveBeenCalledWith({
        where: {
          id: child.id,
        },
        include: {
          parents: {
            select: {
              client: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });
      expect(logger.log).toHaveBeenCalled();
    });

    it('should throw a bad request exception', async () => {
      const child: Child = generateMockChild();

      (validateParentIdsExist as jest.Mock).mockRejectedValue(
        new BadRequestException(),
      );

      await expect(childService.createChild(child)).rejects.toThrow(
        BadRequestException,
      );

      expect(validateParentIdsExist).toHaveBeenCalledWith(
        prismaService,
        logger,
        child.parentId,
      );
    });

    it('should throw a conflict exception', async () => {
      const child: Child = generateMockChild();
      const timestamp: string = 'mock-timestamp';

      (validateParentIdsExist as jest.Mock).mockResolvedValue(undefined);
      (checkChildExists as jest.Mock).mockResolvedValue(true);
      (logger.error as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.error.child.createChild.conflict,
        childData: {
          name: child.name,
          parentIds: child.parentId,
        },
        pid: process.pid,
        timestamp,
      });

      await expect(childService.createChild(child)).rejects.toThrow(
        ConflictException,
      );

      expect(validateParentIdsExist).toHaveBeenCalledWith(
        prismaService,
        logger,
        child.parentId,
      );
      expect(checkChildExists).toHaveBeenCalledWith(prismaService, child);
      expect(logger.error).toHaveBeenCalled();
    });

    it('should throw an internal server error', async () => {
      const child: Child = generateMockChild();
      const timestamp: string = 'mock-timestamp';
      const error: any = {
        code: '',
        message: '',
        stack: '',
      };

      (validateParentIdsExist as jest.Mock).mockResolvedValue(undefined);
      (checkChildExists as jest.Mock).mockResolvedValue(false);
      (prismaService.child.create as jest.Mock).mockRejectedValue(
        'prismaValidationError',
      );
      (logger.error as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.error.child.createChild.internalError,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp,
      });

      await expect(childService.createChild(child)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(validateParentIdsExist).toHaveBeenCalledWith(
        prismaService,
        logger,
        child.parentId,
      );
      expect(checkChildExists).toHaveBeenCalledWith(prismaService, child);
      expect(prismaService.child.create).toHaveBeenCalledWith({
        data: {
          name: child.name,
        },
      });

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('fetchChildren()', () => {
    it('should fetch all registers', async () => {
      const children: Child[] = [generateMockChild(), generateMockChild()];

      (prismaService.child.findMany as jest.Mock).mockResolvedValue(children);

      const result: EndpointReturn = await childService.fetchChildren();

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.child.fetchChildren.status_200,
        data: children,
      });

      expect(prismaService.child.findMany).toHaveBeenCalled();
    });

    it('should throw a not found exception', async () => {
      const children: Child[] = [];
      const timestamp: string = 'mock-timestamp';

      (prismaService.child.findMany as jest.Mock).mockResolvedValue(children);
      (logger.log as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.log.child.fetchChildren.notFound,
        pid: process.pid,
        timestamp,
      });

      await expect(childService.fetchChildren()).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaService.child.findMany).toHaveBeenCalled();
      expect(logger.log).toHaveBeenCalled();
    });

    it('should throw an internal server error', async () => {
      const timestamp: string = 'mock-timestamp';
      const error: any = {
        code: '',
        message: '',
        stack: '',
      };

      (prismaService.child.findMany as jest.Mock).mockResolvedValue(null);
      (logger.error as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.error.child.fetchChildren.internalError,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp,
      });

      await expect(childService.fetchChildren()).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(prismaService.child.findMany).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('fetchChildrenByName()', () => {
    it('should fetch all registers', async () => {
      const children: Child[] = [generateMockChild(), generateMockChild()];

      (prismaService.child.findMany as jest.Mock).mockResolvedValue(children);

      const result: EndpointReturn = await childService.fetchChildrenByName(
        children[0].name,
      );

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.child.fetchChildrenByName.status_200,
        data: children,
      });

      expect(prismaService.child.findMany).toHaveBeenCalledWith({
        where: {
          name: {
            contains: children[0].name,
          },
        },
        include: {
          parents: {
            select: {
              client: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });
    });

    it('should throw a not found exception', async () => {
      const children: Child[] = [];
      const name: string = faker.person.firstName();
      const timestamp: string = 'mock-timestamp';

      (prismaService.child.findMany as jest.Mock).mockResolvedValue(children);
      (logger.error as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.error.child.fetchChildrenByName.notFound,
        pid: process.pid,
        timestamp,
      });

      await expect(childService.fetchChildrenByName(name)).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaService.child.findMany).toHaveBeenCalledWith({
        where: {
          name: {
            contains: name,
          },
        },
        include: {
          parents: {
            select: {
              client: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      expect(logger.error).toHaveBeenCalled();
    });
    it('should throw an internal server error', async () => {
      const name: string = faker.person.firstName();
      const error: any = {
        code: '',
        message: '',
        stack: '',
      };
      const timestamp: string = 'mock-timestamp';

      (prismaService.child.findMany as jest.Mock).mockResolvedValue(null);
      (logger.error as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.error.child.fetchChildrenByName.internalError,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp,
      });

      await expect(childService.fetchChildrenByName(name)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(prismaService.child.findMany).toHaveBeenCalledWith({
        where: {
          name: {
            contains: name,
          },
        },
        include: {
          parents: {
            select: {
              client: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('fetchChild()', () => {
    it('should fetch a register', async () => {
      const child: Child = generateMockChild();

      (prismaService.child.findUniqueOrThrow as jest.Mock).mockResolvedValue(
        child,
      );

      const result: EndpointReturn = await childService.fetchChild(child.id);

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.child.fetchChild.status_200,
        data: child,
      });

      expect(prismaService.child.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          id: child.id,
        },
        include: {
          parents: {
            select: {
              client: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });
    });

    it('should throw a not found exception', async () => {
      const child: Child = generateMockChild();
      const error: PrismaClientKnownRequestError =
        new Prisma.PrismaClientKnownRequestError('Record not found', {
          code: 'P2025',
          clientVersion: 'fake-client-version',
        });
      const timestamp: string = 'mock-timestamp';

      (prismaService.child.findUniqueOrThrow as jest.Mock).mockRejectedValue(
        error,
      );
      (logger.error as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.error.child.fetchChild.notFound,
        pid: process.pid,
        timestamp,
      });

      await expect(childService.fetchChild(child.id)).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaService.child.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          id: child.id,
        },
        include: {
          parents: {
            select: {
              client: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      expect(logger.error).toHaveBeenCalled();
    });

    it('should throw an internal server error', async () => {
      const child: Child = generateMockChild();
      const error: any = {
        code: '',
        message: '',
        stack: '',
      };
      const timestamp: string = 'mock-timestamp';

      (prismaService.child.findUniqueOrThrow as jest.Mock).mockRejectedValue(
        'prismaValidationError',
      );
      (logger.error as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.error.child.fetchChild.internalError,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp,
      });

      await expect(childService.fetchChild(child.id)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(prismaService.child.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          id: child.id,
        },
        include: {
          parents: {
            select: {
              client: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('updateChild()', () => {
    it('should update a child register', async () => {
      const child: Child = generateMockChild();
      const updatedChild: Child = {
        id: child.id,
        name: faker.person.fullName(),
        parentId: child.parentId,
      };

      (prismaService.child.update as jest.Mock).mockResolvedValue(updatedChild);

      const result: EndpointReturn =
        await childService.updateChild(updatedChild);

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.child.updateChild.status_200,
        data: updatedChild,
      });

      expect(prismaService.child.update).toHaveBeenCalledWith({
        where: {
          id: child.id,
        },
        data: {
          name: updatedChild.name,
        },
      });
    });

    it('should throw a not found exception', async () => {
      const child: Child = generateMockChild();
      const updatedChild: Child = {
        id: child.id,
        name: faker.person.fullName(),
        parentId: child.parentId,
      };
      const error: PrismaClientKnownRequestError =
        new Prisma.PrismaClientKnownRequestError('Record not found', {
          code: 'P2025',
          clientVersion: 'fake-client-version',
        });
      const timestamp: string = 'mock-timestamp';

      (prismaService.child.update as jest.Mock).mockRejectedValue(error);
      (logger.error as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.error.child.updateChild.notFound,
        pid: process.pid,
        timestamp,
      });

      await expect(childService.updateChild(updatedChild)).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaService.child.update).toHaveBeenCalledWith({
        where: {
          id: child.id,
        },
        data: {
          name: updatedChild.name,
        },
      });

      expect(logger.error).toHaveBeenCalled();
    });

    it('should throw an internal server error', async () => {
      const child: Child = generateMockChild();
      const updatedChild: Child = {
        id: child.id,
        name: faker.person.fullName(),
        parentId: child.parentId,
      };
      const error: any = {
        code: '',
        message: '',
        stack: '',
      };
      const timestamp: string = 'mock-timestamp';

      (prismaService.child.update as jest.Mock).mockRejectedValue(
        'prismaValidationError',
      );
      (logger.error as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.error.child.updateChild.internalError,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp,
      });

      await expect(childService.updateChild(updatedChild)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(prismaService.child.update).toHaveBeenCalledWith({
        where: {
          id: child.id,
        },
        data: {
          name: updatedChild.name,
        },
      });

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('deleteChild()', () => {
    it('should deleted a child register', async () => {
      const deletedChild: Child = generateMockChild();

      (prismaService.child.delete as jest.Mock).mockResolvedValue(deletedChild);

      const result: EndpointReturn = await childService.deleteChild(
        deletedChild.id,
      );

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.child.deleteChild.status_200,
        data: deletedChild,
      });

      expect(prismaService.child.delete).toHaveBeenCalledWith({
        where: {
          id: deletedChild.id,
        },
      });
    });

    it('should throw a not found exception', async () => {
      const deletedChild: Child = generateMockChild();
      const timestamp: string = 'mock-timestamp';
      const error: PrismaClientKnownRequestError =
        new Prisma.PrismaClientKnownRequestError('Record not found', {
          code: 'P2025',
          clientVersion: 'fake-client-version',
        });

      (prismaService.child.delete as jest.Mock).mockRejectedValue(error);
      (logger.error as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.error.child.deleteChild.notFound,
        pid: process.pid,
        timestamp,
      });

      await expect(childService.deleteChild(deletedChild.id)).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaService.child.delete).toHaveBeenCalledWith({
        where: {
          id: deletedChild.id,
        },
      });

      expect(logger.error).toHaveBeenCalled();
    });

    it('should throw an internal server error', async () => {
      const deletedChild: Child = generateMockChild();
      const timestamp: string = 'mock-timestamp';
      const error: any = {
        code: '',
        message: '',
        stack: '',
      };

      (prismaService.child.delete as jest.Mock).mockRejectedValue(
        'prismaValidationError',
      );
      (logger.error as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.error.child.deleteChild.internalError,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp,
      });

      await expect(childService.deleteChild(deletedChild.id)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(prismaService.child.delete).toHaveBeenCalledWith({
        where: {
          id: deletedChild.id,
        },
      });

      expect(logger.error).toHaveBeenCalled();
    });
  });
});
