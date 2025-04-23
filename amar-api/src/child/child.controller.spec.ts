import { Test, TestingModule } from '@nestjs/testing';
import { ChildController } from './child.controller';
import { ChildService } from './child.service';
import generateMockChild from '../utils/mocks/generateMockChild';
import Child from '../interfaces/Child';
import HTTP_MESSAGES from '../utils/messages/httpMessages';
import { faker } from '@faker-js/faker/.';

describe('ChildController', () => {
  let childController: ChildController;
  let childService: ChildService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ChildService,
          useValue: {
            createChild: jest.fn(),
            fetchChildren: jest.fn(),
            fetchChildrenByName: jest.fn(),
            fetchChild: jest.fn(),
            updateChild: jest.fn(),
            deleteChild: jest.fn(),
          },
        },
      ],
      controllers: [ChildController],
    }).compile();

    childController = module.get<ChildController>(ChildController);
    childService = module.get<ChildService>(ChildService);
  });

  it('should be defined', () => {
    expect(childController).toBeDefined();
  });

  describe('createChild()', () => {
    it('should create a child', async () => {
      const child: Child = generateMockChild();

      (childService.createChild as jest.Mock).mockResolvedValue({
        message: HTTP_MESSAGES.EN.child.createChild.status_201,
        data: child,
      });
      const result = await childController.createChild(child);

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.child.createChild.status_201,
        data: child,
      });

      expect(childService.createChild).toHaveBeenCalledWith(child);
    });
  });

  describe('fetchChildren()', () => {
    it('should fetch all children', async () => {
      const children: Child[] = [generateMockChild(), generateMockChild()];

      (childService.fetchChildren as jest.Mock).mockResolvedValue({
        message: HTTP_MESSAGES.EN.child.fetchChildren.status_200,
        data: children,
      });
      const result = await childController.fetchChildren();

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.child.fetchChildren.status_200,
        data: children,
      });

      expect(childService.fetchChildren).toHaveBeenCalled();
    });
  });

  describe('fetchChildrenByName()', () => {
    it('should fetch children by a given word', async () => {
      const name: string = faker.person.fullName();
      const children: Child[] = [generateMockChild(), generateMockChild()];

      (childService.fetchChildrenByName as jest.Mock).mockResolvedValue({
        message: HTTP_MESSAGES.EN.child.fetchChildrenByName.status_200,
        data: children,
      });
      const result = await childController.fetchChildrenByName(name);

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.child.fetchChildrenByName.status_200,
        data: children,
      });

      expect(childService.fetchChildrenByName).toHaveBeenCalled();
    });
  });

  describe('fetchChild()', () => {
    it('should fetch a child', async () => {
      const child: Child = generateMockChild();

      (childService.fetchChild as jest.Mock).mockResolvedValue({
        message: HTTP_MESSAGES.EN.child.fetchChild.status_200,
        data: child,
      });
      const result = await childController.fetchChild(child.id);

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.child.fetchChild.status_200,
        data: child,
      });

      expect(childService.fetchChild).toHaveBeenCalled();
    });
  });

  describe('updateChild()', () => {
    it('should update a child', async () => {
      const child: Child = generateMockChild();
      const updatedChild: Child = {
        id: child.id,
        name: faker.person.fullName(),
      };

      (childService.updateChild as jest.Mock).mockResolvedValue({
        message: HTTP_MESSAGES.EN.child.updateChild.status_200,
        data: updatedChild,
      });
      const result = await childController.updateChild(child.id, updatedChild);

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.child.updateChild.status_200,
        data: updatedChild,
      });

      expect(childService.updateChild).toHaveBeenCalled();
    });
  });

  describe('deleteChild()', () => {
    it('should delete a child', async () => {
      const deletedChild: Child = generateMockChild();

      (childService.deleteChild as jest.Mock).mockResolvedValue({
        message: HTTP_MESSAGES.EN.child.deleteChild.status_200,
        data: deletedChild,
      });
      const result = await childController.deleteChild(deletedChild.id);

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.child.deleteChild.status_200,
        data: deletedChild,
      });

      expect(childService.deleteChild).toHaveBeenCalled();
    });
  });
});
