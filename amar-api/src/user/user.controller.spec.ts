import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import generateMockUser from '../utils/mocks/generateMockUser';
import { User } from '../interfaces/User';
import HTTP_MESSAGES from '../utils/messages/httpMessages';
import EndpointReturn from '../interfaces/EndpointReturn';
import { faker } from '@faker-js/faker/.';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(),
            fetchUsers: jest.fn(),
            fetchUser: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
          },
        },
      ],
      controllers: [UserController],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('createUser()', () => {
    it('should create a user', async () => {
      const user: User = generateMockUser();
      (userService.createUser as jest.Mock).mockResolvedValue({
        message: HTTP_MESSAGES.EN.user.createUser.status_201,
        data: user,
      });

      const result: EndpointReturn = await userController.createUser(user);

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.user.createUser.status_201,
        data: user,
      });

      expect(userService.createUser).toHaveBeenCalledWith(user);
    });
  });

  describe('fetchUsers()', () => {
    it('should fetch all users', async () => {
      const userA: User = generateMockUser();
      const userB: User = generateMockUser();
      const users: User[] = [userA, userB];

      (userService.fetchUsers as jest.Mock).mockResolvedValue({
        message: HTTP_MESSAGES.EN.user.fetchUsers.status_200,
        data: users,
      });

      const result: EndpointReturn = await userController.fetchUsers();

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.user.fetchUsers.status_200,
        data: users,
      });

      expect(userService.fetchUsers).toHaveBeenCalled();
    });
  });

  describe('fetchUser()', () => {
    it('should fetch a user', async () => {
      const user: User = generateMockUser();

      (userService.fetchUser as jest.Mock).mockResolvedValue({
        message: HTTP_MESSAGES.EN.user.fetchUser.status_200,
        data: user,
      });

      const result: EndpointReturn = await userController.fetchUser(user.id);

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.user.fetchUser.status_200,
        data: user,
      });

      expect(userService.fetchUser).toHaveBeenCalledWith(user.id);
    });
  });

  describe('updateUser()', () => {
    it('should update a user', async () => {
      const user: User = generateMockUser();
      const updatedUser: Partial<User> = {
        id: user.id,
        name: faker.person.fullName(),
      };

      (userService.updateUser as jest.Mock).mockResolvedValue({
        message: HTTP_MESSAGES.EN.user.updateUser.status_200,
        data: updatedUser,
      });

      const result: EndpointReturn = await userController.updateUser(
        updatedUser.id,
        updatedUser,
      );

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.user.updateUser.status_200,
        data: updatedUser,
      });

      expect(userService.updateUser).toHaveBeenCalledWith(updatedUser);
    });
  });

  describe('deleteUser()', () => {
    it('should delete a user', async () => {
      const user: User = generateMockUser();

      (userService.deleteUser as jest.Mock).mockResolvedValue({
        message: HTTP_MESSAGES.EN.user.deleteUser.status_200,
        data: user,
      });

      const result: EndpointReturn = await userController.deleteUser(user.id);

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.user.deleteUser.status_200,
        data: user,
      });

      expect(userService.deleteUser).toHaveBeenCalledWith(user.id);
    });
  });
});
