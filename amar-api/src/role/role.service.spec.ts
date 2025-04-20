import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import { v4 as uuidv4 } from 'uuid';
import Role from '../interfaces/Role';
import generateMockRole from '../utils/mocks/generateMockRole';
import EndpointReturn from '../interfaces/EndpointReturn';
import HTTP_MESSAGES from '../utils/messages/httpMessages';
import { checkRoleExists, getRole } from '../helpers/role.helper';
import LOGGER_MESSAGES from '../utils/messages/loggerMessages';
import generateTimestamp from '../helpers/generateTimestamp';
import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

jest.mock('uuid');
jest.mock('../helpers/role.helper');
jest.mock('../helpers/generateTimestamp');

describe('RoleService', () => {
  let roleService: RoleService;
  let prismaService: PrismaService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: PrismaService,
          useValue: {
            role: {
              create: jest.fn(),
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

    roleService = module.get<RoleService>(RoleService);
    prismaService = module.get<PrismaService>(PrismaService);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(roleService).toBeDefined();
  });

  describe('createRole()', () => {
    it('should create a new role', async () => {
      const role: Role = generateMockRole();

      (checkRoleExists as jest.Mock).mockResolvedValue(false);
      (generateTimestamp as jest.Mock).mockReturnValue('mock-timestamp');
      (uuidv4 as jest.Mock).mockReturnValue(role.id);
      (prismaService.role.create as jest.Mock).mockResolvedValue(role);
      (logger.log as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.log.role.createRole.success,
        roleData: {
          id: role.id,
          title: role.title,
        },
        pid: process.pid,
        timestamp: generateTimestamp(),
      });

      const result: EndpointReturn = await roleService.createRole(role);
      const roleExists: boolean = await checkRoleExists(prismaService, role);

      expect(roleExists).toBe(false);

      expect(uuidv4).toHaveBeenCalled();

      expect(prismaService.role.create).toHaveBeenCalledWith({
        data: {
          id: role.id,
          title: role.title,
        },
      });

      expect(logger.log).toHaveBeenCalled();

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.role.createRole.status_201,
        data: role,
      });
    });

    it('should throw a conflict error', async () => {
      const role: Role = generateMockRole();

      (checkRoleExists as jest.Mock).mockResolvedValue(true);
      (generateTimestamp as jest.Mock).mockReturnValue('mock-timestamp');
      (logger.error as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.error.role.createRole.conflict,
        roleTitle: role.title,
        pid: process.pid,
        timestamp: generateTimestamp(),
      });

      await expect(roleService.createRole(role)).rejects.toThrow(
        HTTP_MESSAGES.EN.role.createRole.status_409,
      );

      expect(checkRoleExists).toHaveBeenCalledWith(prismaService, role);
      expect(logger.error).toHaveBeenCalled();
    });

    it('should throw an internal server error', async () => {
      const role: Role = generateMockRole();

      (checkRoleExists as jest.Mock).mockResolvedValue(false);
      (generateTimestamp as jest.Mock).mockReturnValue('mock-timestamp');
      (uuidv4 as jest.Mock).mockReturnValue(role.id);
      (prismaService.role.create as jest.Mock).mockRejectedValue(
        'PrismaClientValidationError',
      );
      (logger.log as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.log.role.createRole.success,
        roleData: {
          id: role.id,
          title: role.title,
        },
        pid: process.pid,
        timestamp: generateTimestamp(),
      });

      await expect(roleService.createRole(role)).rejects.toThrow(
        HTTP_MESSAGES.EN.generalMessages.status_500,
      );
      const roleExists: boolean = await checkRoleExists(prismaService, role);

      expect(roleExists).toBe(false);

      expect(uuidv4).toHaveBeenCalled();

      expect(prismaService.role.create).toHaveBeenCalled();
    });
  });

  describe('fetchRoles()', () => {
    it('should fetch all roles', async () => {
      const firstRole: Role = generateMockRole();
      const secondRole: Role = generateMockRole();
      const roles: Role[] = [firstRole, secondRole];

      (prismaService.role.findMany as jest.Mock).mockResolvedValue(roles);

      const result = await roleService.fetchRoles();

      expect(prismaService.role.findMany).toHaveBeenCalled();

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.role.fetchRoles.status_200,
        data: roles,
      });
    });

    it('should throw a not found error', async () => {
      const roles: Role[] = [];

      (prismaService.role.findMany as jest.Mock).mockResolvedValue(roles);
      (generateTimestamp as jest.Mock).mockReturnValue('mock-timestamp');
      (logger.log as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.log.role.fetchRoles.notFound,
        pid: process.pid,
        timestamp: generateTimestamp(),
      });

      await expect(roleService.fetchRoles()).rejects.toThrow(NotFoundException);

      expect(prismaService.role.findMany).toHaveBeenCalled();
      expect(logger.log).toHaveBeenCalled();
    });

    it('should throw an internal server error', async () => {
      let error: { code: string } = { code: '' };

      (prismaService.role.findMany as jest.Mock).mockRejectedValue(
        'PrismaClientValidationError',
      );

      (generateTimestamp as jest.Mock).mockReturnValue('mock-timestamp');

      (logger.error as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.error.role.fetchRoles.internalError,
        code: error.code,
        error: error,
        pid: process.pid,
        timestamp: generateTimestamp(),
      });

      await expect(roleService.fetchRoles()).rejects.toThrow(
        HTTP_MESSAGES.EN.generalMessages.status_500,
      );

      expect(prismaService.role.findMany).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('fetchRole()', () => {
    it('should fetch a role', async () => {
      const role: Role = generateMockRole();

      (prismaService.role.findUniqueOrThrow as jest.Mock).mockResolvedValue({
        id: role.id,
        title: role.title,
      });

      const result = await roleService.fetchRole(role.id);

      expect(prismaService.role.findUniqueOrThrow).toHaveBeenCalled();
      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.role.fetchRole.status_200,
        data: role,
      });
    });

    it('should return a not found error', async () => {
      const role: Role = generateMockRole();
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Record not found',
        {
          code: 'P2025',
          clientVersion: 'fake-client-version',
        },
      );

      (prismaService.role.findUniqueOrThrow as jest.Mock).mockRejectedValue(
        prismaError,
      );
      (generateTimestamp as jest.Mock).mockReturnValue('mock-timestamp');
      (logger.log as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.log.role.fetchRole.notFound,
        pid: process.pid,
        timestamp: generateTimestamp(),
      });

      await expect(roleService.fetchRole(role.id)).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaService.role.findUniqueOrThrow).toHaveBeenCalled();
      expect(logger.log).toHaveBeenCalled();
    });

    it('should throw an internal server error', async () => {
      const role: Role = generateMockRole();
      const error: { code: string } = { code: '' };

      (prismaService.role.findUniqueOrThrow as jest.Mock).mockRejectedValue(
        'PrismaValidationError',
      );
      (generateTimestamp as jest.Mock).mockReturnValue('mock-timestamp');
      (logger.error as jest.Mock).mockReturnValue({
        message: LOGGER_MESSAGES.error.role.fetchRole,
        code: error.code,
        error,
        pid: process.pid,
        timestamp: generateTimestamp(),
      });

      await expect(roleService.fetchRole(role.id)).rejects.toThrow(
        HTTP_MESSAGES.EN.generalMessages.status_500,
      );

      expect(prismaService.role.findUniqueOrThrow).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('updateRole()', () => {
    it('should update a role', async () => {
      const updatedRole: Role = generateMockRole();
      const foundRole: Role = {
        id: updatedRole.id,
        title: 'mock-title',
      };

      (getRole as jest.Mock).mockResolvedValue(foundRole);
      (prismaService.role.update as jest.Mock).mockResolvedValue(updatedRole);

      const result = await roleService.updateRole(updatedRole);

      expect(getRole).toHaveBeenCalledWith(
        prismaService,
        logger,
        updatedRole.id,
      );
      expect(prismaService.role.update).toHaveBeenCalledWith({
        where: {
          id: updatedRole.id,
        },
        data: {
          title: updatedRole.title,
        },
      });
      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.role.updateRole.status_200,
        data: updatedRole,
      });
    });

    it('should throw a not found exception', async () => {
      const role: Role = generateMockRole();

      (getRole as jest.Mock).mockRejectedValue(new NotFoundException());

      await expect(roleService.updateRole(role)).rejects.toThrow(
        NotFoundException,
      );

      expect(getRole).toHaveBeenCalledWith(prismaService, logger, role.id);
    });

    it('should throw an internal server error', async () => {
      const role: Role = generateMockRole();

      (getRole as jest.Mock).mockResolvedValue(role);
      (prismaService.role.update as jest.Mock).mockRejectedValue(
        'PrismaValidationError',
      );

      await expect(roleService.updateRole(role)).rejects.toThrow(
        HTTP_MESSAGES.EN.generalMessages.status_500,
      );

      expect(getRole).toHaveBeenCalledWith(prismaService, logger, role.id);
      expect(prismaService.role.update).toHaveBeenCalledWith({
        where: {
          id: role.id,
        },
        data: {
          title: role.title,
        },
      });
    });
  });

  describe('deleteRole()', () => {
    it('should delete a role', async () => {
      const role: Role = generateMockRole();

      (getRole as jest.Mock).mockResolvedValue(role);
      (prismaService.role.delete as jest.Mock).mockResolvedValue(role);

      const result = await roleService.deleteRole(role.id);

      expect(getRole).toHaveBeenCalledWith(prismaService, logger, role.id);
      expect(prismaService.role.delete).toHaveBeenCalledWith({
        where: {
          id: role.id,
        },
      });

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.role.deleteRole.status_200,
      });
    });

    it('should throw a not found exception', async () => {
      const mockId: string = 'mock-id';

      (getRole as jest.Mock).mockRejectedValue(new NotFoundException());

      await expect(roleService.deleteRole(mockId)).rejects.toThrow(
        NotFoundException,
      );

      expect(getRole).toHaveBeenCalledWith(prismaService, logger, mockId);
    });

    it('should throw an internal server error', async () => {
      const role: Role = generateMockRole();

      (getRole as jest.Mock).mockResolvedValue(role);
      (prismaService.role.delete as jest.Mock).mockRejectedValue(
        'PrismaValidationError',
      );

      await expect(roleService.deleteRole(role.id)).rejects.toThrow(
        HTTP_MESSAGES.EN.generalMessages.status_500,
      );

      expect(prismaService.role.delete).toHaveBeenCalledWith({
        where: {
          id: role.id,
        },
      });

      expect(getRole).toHaveBeenCalledWith(prismaService, logger, role.id);
    });
  });
});
