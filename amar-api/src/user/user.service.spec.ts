import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import generateMockUser from '../utils/mocks/generateMockUser';
import EndpointReturn from '../interfaces/EndpointReturn';
import { User } from '../interfaces/User';
import {
  checkUserExists,
  findUser,
  generateHash,
} from '../helpers/user.helper';
import HTTP_MESSAGES from '../utils/messages/httpMessages';
import LOGGER_MESSAGES from '../utils/messages/loggerMessages';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import { PrismaClientKnownRequestError } from '../../prisma/generated/prisma-client-js/runtime/library';
import { Prisma } from '../../prisma/generated/prisma-client-js';
import { faker } from '@faker-js/faker/.';

jest.mock('../helpers/user.helper');
jest.mock('../helpers/generateTimestamp');
jest.mock('uuid');

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findFirst: jest.fn(),
              findMany: jest.fn(),
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

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('createUser()', () => {
    it('should create a user', async () => {
      const user: User = generateMockUser();
      const userCheck: boolean = false;
      const hash: string = 'mock-hash';
      const id: string = 'mock-id';
      const timestamp: string = 'mock-timestamp';

      const log = {
        message: LOGGER_MESSAGES.log.user.createUser.success,
        userData: {
          name: user.name,
          email: user.email,
        },
        pid: process.pid,
        timestamp: timestamp,
      };

      (checkUserExists as jest.Mock).mockResolvedValue(userCheck);
      (generateHash as jest.Mock).mockResolvedValue(hash);
      (uuidv4 as jest.Mock).mockReturnValue(id);
      (logger.log as jest.Mock).mockReturnValue(log);
      (prismaService.user.create as jest.Mock).mockResolvedValue(user);

      const result: EndpointReturn = await userService.createUser(user);

      expect(checkUserExists).toHaveBeenCalledWith(prismaService, user.email);
      expect(generateHash).toHaveBeenCalledWith(user.password);
      expect(uuidv4).toHaveBeenCalled();
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          id,
          name: user.name,
          email: user.email,
          password: hash,
          pictureUrl: user.pictureUrl,
        },
      });
      expect(logger.log).toHaveBeenCalled();

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.user.createUser.status_201,
        data: user,
      });
    });

    it('should return a conflict error', async () => {
      const user: User = generateMockUser();
      const userCheck: boolean = true;
      const timestamp: string = 'mock-timestamp';
      const error = {
        message: LOGGER_MESSAGES.error.user.createUser.conflict,
        conflictData: {
          name: user.name,
          email: user.email,
        },
        pid: process.pid,
        timestamp: timestamp,
      };

      (checkUserExists as jest.Mock).mockResolvedValue(userCheck);
      (logger.error as jest.Mock).mockReturnValue(error);

      await expect(userService.createUser(user)).rejects.toThrow(
        HTTP_MESSAGES.EN.user.createUser.status_409,
      );

      expect(checkUserExists).toHaveBeenCalledWith(prismaService, user.email);
      expect(logger.error).toHaveBeenCalled();
    });

    it('should throw an internal server error', async () => {
      const user: User = generateMockUser();
      const userCheck: boolean = false;
      const hash: string = 'mock-hash';
      const id: string = 'mock-id';
      const timestamp: string = 'mock-timestamp';
      const error: any = {
        message: '',
        code: '',
      };
      const errorLog = {
        message: LOGGER_MESSAGES.error.user.createUser.internalError,
        code: error.code,
        error: error.message,
        pid: process.pid,
        timestamp,
      };

      (checkUserExists as jest.Mock).mockResolvedValue(userCheck);
      (generateHash as jest.Mock).mockResolvedValue(hash);
      (uuidv4 as jest.Mock).mockReturnValue(id);
      (prismaService.user.create as jest.Mock).mockRejectedValue(
        'PrismaValidationError',
      );
      (logger.error as jest.Mock).mockReturnValue(errorLog);

      await expect(userService.createUser(user)).rejects.toThrow(
        HTTP_MESSAGES.EN.generalMessages.status_500,
      );

      expect(checkUserExists).toHaveBeenCalledWith(prismaService, user.email);
      expect(generateHash).toHaveBeenCalledWith(user.password);
      expect(uuidv4).toHaveBeenCalled();
      expect(prismaService.user.create).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('fetchUsers()', () => {
    it('should fetch all the users from the database', async () => {
      const userA: User = generateMockUser();
      const userB: User = generateMockUser();
      const users: User[] = [userA, userB];

      (prismaService.user.findMany as jest.Mock).mockResolvedValue(users);
      const result: EndpointReturn = await userService.fetchUsers();

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.user.fetchUsers.status_200,
        data: users,
      });

      expect(prismaService.user.findMany).toHaveBeenCalled();
    });

    it('should throw a notFound error', async () => {
      const users: User[] = [];
      const timestamp: string = 'mock-timestamp';

      (prismaService.user.findMany as jest.Mock).mockResolvedValue(users);
      (logger.log as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.log.user.fetchUsers.notFound,
        pid: process.pid,
        timestamp,
      });

      await expect(userService.fetchUsers()).rejects.toThrow(
        HTTP_MESSAGES.EN.user.fetchUsers.status_404,
      );
      expect(prismaService.user.findMany).toHaveBeenCalled();
      expect(logger.log).toHaveBeenCalled();
    });

    it('should throw an internal server error', async () => {
      const error: any = {
        code: '',
        message: '',
      };
      const timestamp: string = 'mock-timestamp';

      (prismaService.user.findMany as jest.Mock).mockRejectedValue(
        'prismaValidationError',
      );
      (logger.error as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.error.user.fetchUsers.internalError,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp,
      });

      await expect(userService.fetchUsers()).rejects.toThrow(
        HTTP_MESSAGES.EN.generalMessages.status_500,
      );

      expect(prismaService.user.findMany).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('fetchUser()', () => {
    it('should fetch a user', async () => {
      const user: User = generateMockUser();

      (prismaService.user.findUniqueOrThrow as jest.Mock).mockResolvedValue(
        user,
      );
      const result: EndpointReturn = await userService.fetchUser(user.id);

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.user.fetchUser.status_200,
        data: user,
      });

      expect(prismaService.user.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          id: user.id,
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
    });

    it('should throw a not found error', async () => {
      const id: string = 'mock-id';
      const timestamp: string = 'mock-timestamp';
      const error: PrismaClientKnownRequestError =
        new Prisma.PrismaClientKnownRequestError('Record not found', {
          code: 'P2025',
          clientVersion: 'fake-client-version',
        });
      const log = {
        message: LOGGER_MESSAGES.log.user.fetchUser.notFound,
        pid: process.pid,
        timestamp,
      };

      (prismaService.user.findUniqueOrThrow as jest.Mock).mockRejectedValue(
        error,
      );
      (logger.log as jest.Mock).mockReturnValue(log);

      await expect(userService.fetchUser(id)).rejects.toThrow(
        HTTP_MESSAGES.EN.user.fetchUser.status_404,
      );

      expect(prismaService.user.findUniqueOrThrow).toHaveBeenCalledWith({
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

      expect(logger.log).toHaveBeenCalled();
    });

    it('should throw an internal server error', async () => {
      const id: string = 'mock-id';
      const timestamp: string = 'mock-timestamp';
      const error = {
        code: '',
        message: '',
        stack: '',
      };
      const errorLog = {
        message: LOGGER_MESSAGES.error.user.fetchUser.internalError,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp,
      };

      (prismaService.user.findUniqueOrThrow as jest.Mock).mockRejectedValue(
        'PrismaValidationError',
      );
      (logger.error as jest.Mock).mockReturnValue(errorLog);

      await expect(userService.fetchUser(id)).rejects.toThrow(
        HTTP_MESSAGES.EN.generalMessages.status_500,
      );

      expect(prismaService.user.findUniqueOrThrow).toHaveBeenCalledWith({
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

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('updateUser()', () => {
    it('should update a user', async () => {
      const user: User = generateMockUser();
      const updatedUser: Partial<User> = {
        id: user.id,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        pictureUrl: faker.internet.url(),
      };
      const hash: string = 'mock-hash';

      (findUser as jest.Mock).mockResolvedValue(user);
      (generateHash as jest.Mock).mockResolvedValue(hash);
      (prismaService.user.update as jest.Mock).mockResolvedValue(updatedUser);

      const result: EndpointReturn = await userService.updateUser(updatedUser);

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.user.updateUser.status_200,
        data: updatedUser,
      });
      expect(findUser).toHaveBeenCalledWith(prismaService, user.id);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: {
          id: updatedUser.id,
        },
        data: {
          name: updatedUser.name,
          email: updatedUser.email,
          password: hash,
          pictureUrl: updatedUser.pictureUrl,
        },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });
    });

    it('should throw a not found exception', async () => {
      const timestamp: string = 'mock-timestamp';
      const user: User = generateMockUser();
      const errorLog = {
        message: LOGGER_MESSAGES.error.user.updateUser.notFound,
        pid: process.pid,
        timestamp,
      };

      (findUser as jest.Mock).mockResolvedValue(null);
      (logger.error as jest.Mock).mockReturnValue(errorLog);

      await expect(userService.updateUser(user)).rejects.toThrow(
        HTTP_MESSAGES.EN.user.updateUser.status_404,
      );

      expect(findUser).toHaveBeenCalledWith(prismaService, user.id);
      expect(logger.error).toHaveBeenCalled();
    });

    it('should throw an internal server error', async () => {
      const user: User = generateMockUser();
      const updatedUser: Partial<User> = {
        id: user.id,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        pictureUrl: faker.internet.url(),
      };
      const timestamp: string = 'mock-timestamp';
      const hash: string = 'mock-hash';
      const error: any = {
        code: '',
        message: '',
        stack: '',
      };
      const errorLog = {
        message: LOGGER_MESSAGES.error.user.updateUser.internalError,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp,
      };

      (findUser as jest.Mock).mockResolvedValue(user);
      (generateHash as jest.Mock).mockResolvedValue(hash);
      (prismaService.user.update as jest.Mock).mockRejectedValue(
        'PrismaValidationError',
      );
      (logger.error as jest.Mock).mockReturnValue(errorLog);

      await expect(userService.updateUser(updatedUser)).rejects.toThrow(
        HTTP_MESSAGES.EN.generalMessages.status_500,
      );

      expect(findUser).toHaveBeenCalledWith(prismaService, user.id);
      expect(generateHash).toHaveBeenCalledWith(updatedUser.password);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: {
          id: updatedUser.id,
        },
        data: {
          name: updatedUser.name,
          email: updatedUser.email,
          password: hash,
          pictureUrl: updatedUser.pictureUrl,
        },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('deleteUser()', () => {
    it('should delete a user', async () => {
      const user: User = generateMockUser();
      const log = {
        message: LOGGER_MESSAGES.log.user.deleteUser.success,
        deletedUser: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };
      (prismaService.user.findFirst as jest.Mock).mockResolvedValue(user);
      (prismaService.user.delete as jest.Mock).mockResolvedValue(user);
      (logger.log as jest.Mock).mockReturnValue(log);

      const result: EndpointReturn = await userService.deleteUser(user.id);

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.user.deleteUser.status_200,
        data: user,
      });

      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: {
          id: user.id,
        },
      });

      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: {
          id: user.id,
        },
      });

      expect(logger.log).toHaveBeenCalled();
    });

    it('should throw a not found exception', async () => {
      const user: User = generateMockUser();
      const timestamp: string = 'mock-timestamp';
      const errorLog = {
        message: LOGGER_MESSAGES.error.user.deleteUser.notFound,
        pid: process.pid,
        timestamp,
      };

      (prismaService.user.findFirst as jest.Mock).mockResolvedValue(null);
      (logger.error as jest.Mock).mockReturnValue(errorLog);

      await expect(userService.deleteUser(user.id)).rejects.toThrow(
        HTTP_MESSAGES.EN.user.deleteUser.status_404,
      );

      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: {
          id: user.id,
        },
      });

      expect(logger.error).toHaveBeenCalled();
    });

    it('should throw an internal server error', async () => {
      const user: User = generateMockUser();
      const timestamp: string = 'mock-timestamp';
      const error: any = {
        code: '',
        message: '',
        stack: '',
      };
      const errorLog = {
        message: LOGGER_MESSAGES.error.user.deleteUser.internalError,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp,
      };

      (prismaService.user.findFirst as jest.Mock).mockResolvedValue(user);
      (prismaService.user.delete as jest.Mock).mockRejectedValue(
        'PrismaValidationError',
      );
      (logger.error as jest.Mock).mockReturnValue(errorLog);

      await expect(userService.deleteUser(user.id)).rejects.toThrow(
        HTTP_MESSAGES.EN.generalMessages.status_500,
      );

      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: {
          id: user.id,
        },
      });

      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: {
          id: user.id,
        },
      });

      expect(logger.error).toHaveBeenCalled();
    });
  });
});
