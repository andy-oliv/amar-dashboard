import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import CreateRoleDTO from './dto/createRoleDTO';
import generateMockRole from '../utils/mocks/generateMockRole';
import HTTP_MESSAGES from '../utils/messages/httpMessages';
import EndpointReturn from '../interfaces/EndpointReturn';
import Role from '../interfaces/Role';

describe('RoleController', () => {
  let roleController: RoleController;
  let roleService: RoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: RoleService,
          useValue: {
            createRole: jest.fn(),
            fetchRoles: jest.fn(),
            fetchRole: jest.fn(),
            updateRole: jest.fn(),
            deleteRole: jest.fn(),
          },
        },
      ],
      controllers: [RoleController],
    }).compile();

    roleController = module.get<RoleController>(RoleController);
    roleService = module.get<RoleService>(RoleService);
  });

  it('should be defined', () => {
    expect(roleController).toBeDefined();
  });

  describe('createRole()', () => {
    it('should create a new role', async () => {
      const roleInfo: CreateRoleDTO = generateMockRole();
      const mockReturn: EndpointReturn = {
        message: HTTP_MESSAGES.EN.role.createRole.status_201,
        data: roleInfo,
      };

      (roleService.createRole as jest.Mock).mockResolvedValue(mockReturn);

      const result: EndpointReturn = await roleController.createRole(roleInfo);

      expect(roleService.createRole).toHaveBeenCalledWith(roleInfo);
      expect(result).toMatchObject(mockReturn);
    });
  });

  describe('fetchRoles()', () => {
    it('should fetch all roles in the database', async () => {
      const roleA: Role = generateMockRole();
      const roleB: Role = generateMockRole();
      const roles: Role[] = [roleA, roleB];
      const mockReturn: EndpointReturn = {
        message: HTTP_MESSAGES.EN.role.fetchRoles.status_200,
        data: roles,
      };

      (roleService.fetchRoles as jest.Mock).mockResolvedValue(mockReturn);

      const result: EndpointReturn = await roleController.fetchRoles();

      expect(roleService.fetchRoles).toHaveBeenCalled();
      expect(result).toMatchObject(mockReturn);
    });
  });

  describe('fetchRole()', () => {
    it('should fetch a role', async () => {
      const role: Role = generateMockRole();
      const mockReturn: EndpointReturn = {
        message: HTTP_MESSAGES.EN.role.fetchRole.status_200,
        data: role,
      };

      (roleService.fetchRole as jest.Mock).mockResolvedValue(mockReturn);

      const result: EndpointReturn = await roleController.fetchRole(role.id);

      expect(roleService.fetchRole).toHaveBeenCalledWith(role.id);
      expect(result).toMatchObject(mockReturn);
    });
  });

  describe('updateRole()', () => {
    it('should update a role', async () => {
      const updatedRole: Role = generateMockRole();
      const mockReturn: EndpointReturn = {
        message: HTTP_MESSAGES.EN.role.updateRole.status_200,
        data: updatedRole,
      };

      (roleService.updateRole as jest.Mock).mockResolvedValue(mockReturn);

      const result: EndpointReturn = await roleController.updateRole(
        updatedRole.id,
        updatedRole,
      );

      expect(roleService.updateRole).toHaveBeenCalledWith({
        id: updatedRole.id,
        title: updatedRole.title,
      });
      expect(result).toMatchObject(mockReturn);
    });
  });

  describe('deleteRole()', () => {
    it('should delete a role', async () => {
      const roleId: string = 'mock-id';
      const mockReturn: { message: string } = {
        message: HTTP_MESSAGES.EN.role.deleteRole.status_200,
      };

      (roleService.deleteRole as jest.Mock).mockResolvedValue(mockReturn);

      const result: { message: string } =
        await roleController.deleteRole(roleId);

      expect(roleService.deleteRole).toHaveBeenCalledWith(roleId);
      expect(result).toMatchObject(mockReturn);
    });
  });
});
