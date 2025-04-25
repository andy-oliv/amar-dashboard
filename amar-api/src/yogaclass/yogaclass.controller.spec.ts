import { Test, TestingModule } from '@nestjs/testing';
import { YogaclassController } from './yogaclass.controller';
import { YogaclassService } from './yogaclass.service';
import YogaClass from '../interfaces/YogaClass';
import generateMockYogaClass from '../utils/mocks/generateMockYogaClass';
import CreateClassDTO from './dto/createClassDTO';
import { faker } from '@faker-js/faker/.';
import EndpointReturn from '../interfaces/EndpointReturn';
import HTTP_MESSAGES from '../utils/messages/httpMessages';
import { create } from 'domain';
import FetchClassesDTO from './dto/fetchClassesDTO';
import FetchByRangeDTO from './dto/fetchByRangeDTO';
import Client from '../interfaces/Client';
import generateMockClient from '../utils/mocks/generateMockClients';
import UpdateClassDTO from './dto/updateClassDTO';

describe('YogaclassController', () => {
  let yogaclassController: YogaclassController;
  let yogaclassService: YogaclassService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: YogaclassService,
          useValue: {
            createClass: jest.fn(),
            fetchClasses: jest.fn(),
            fetchClass: jest.fn(),
            addStudent: jest.fn(),
            removeStudent: jest.fn(),
            fetchByQuery: jest.fn(),
            fetchByRange: jest.fn(),
            updateClass: jest.fn(),
            deleteClass: jest.fn(),
          },
        },
      ],
      controllers: [YogaclassController],
    }).compile();

    yogaclassController = module.get<YogaclassController>(YogaclassController);
    yogaclassService = module.get<YogaclassService>(YogaclassService);
  });

  it('should be defined', () => {
    expect(yogaclassController).toBeDefined();
  });

  describe('createClass()', () => {
    it('should create a new class', async () => {
      const createdClass: CreateClassDTO = {
        type: 'ADULTS',
        status: 'SCHEDULED',
        date: faker.date.soon(),
        time: faker.date.soon().toTimeString().split(' ')[0],
        instructorId: faker.string.uuid(),
        locationId: faker.number.int(),
      };
      (yogaclassService.createClass as jest.Mock).mockResolvedValue({
        message: HTTP_MESSAGES.EN.yogaClass.createClass.status_201,
        data: createdClass,
      });

      const result: EndpointReturn =
        await yogaclassService.createClass(createdClass);

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.yogaClass.createClass.status_201,
        data: createdClass,
      });

      expect(yogaclassService.createClass).toHaveBeenCalledWith(createdClass);
    });
  });

  describe('fetchClasses()', () => {
    it('should fetch all classes', async () => {
      const fetchedClasses: YogaClass[] = [
        generateMockYogaClass(),
        generateMockYogaClass(),
      ];

      (yogaclassService.fetchClasses as jest.Mock).mockResolvedValue({
        message: HTTP_MESSAGES.EN.yogaClass.fetchClasses.status_200,
        data: fetchedClasses,
      });

      const result: EndpointReturn = await yogaclassController.fetchClasses();

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.yogaClass.fetchClasses.status_200,
        data: fetchedClasses,
      });

      expect(yogaclassService.fetchClasses).toHaveBeenCalled();
    });
  });

  describe('fetchByQuery()', () => {
    it('should fetch classes based on the query', async () => {
      const fetchedClasses: YogaClass[] = [
        generateMockYogaClass(),
        generateMockYogaClass(),
      ];
      const query: FetchClassesDTO = {
        instructorId: faker.string.uuid(),
      };

      (yogaclassService.fetchByQuery as jest.Mock).mockResolvedValue({
        message: HTTP_MESSAGES.EN.yogaClass.fetchByQuery.status_200,
        data: fetchedClasses,
      });

      const result: EndpointReturn =
        await yogaclassController.fetchByQuery(query);

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.yogaClass.fetchByQuery.status_200,
        data: fetchedClasses,
      });

      expect(yogaclassService.fetchByQuery).toHaveBeenCalled();
    });
  });

  describe('fetchByRange()', () => {
    it('should fetch classes based on the range', async () => {
      const fetchedClasses: YogaClass[] = [
        generateMockYogaClass(),
        generateMockYogaClass(),
      ];
      const query: FetchByRangeDTO = {
        rangeStart: faker.date.soon(),
        rangeEnd: faker.date.soon(),
      };

      (yogaclassService.fetchByRange as jest.Mock).mockResolvedValue({
        message: HTTP_MESSAGES.EN.yogaClass.fetchByRange.status_200,
        data: fetchedClasses,
      });

      const result: EndpointReturn =
        await yogaclassController.fetchByRange(query);

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.yogaClass.fetchByRange.status_200,
        data: fetchedClasses,
      });

      expect(yogaclassService.fetchByRange).toHaveBeenCalled();
    });
  });

  describe('fetchClass()', () => {
    it('should fetch a class', async () => {
      const fetchedClass: YogaClass = generateMockYogaClass();

      (yogaclassService.fetchClass as jest.Mock).mockResolvedValue({
        message: HTTP_MESSAGES.EN.yogaClass.fetchClass.status_200,
        data: fetchedClass,
      });

      const result: EndpointReturn = await yogaclassController.fetchClass(
        fetchedClass.id,
      );

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.yogaClass.fetchClass.status_200,
        data: fetchedClass,
      });

      expect(yogaclassService.fetchClass).toHaveBeenCalledWith(fetchedClass.id);
    });
  });

  describe('addStudent()', () => {
    it('should add a student to a class', async () => {
      const studentId: string = faker.string.uuid();
      const yogaclassId: number = faker.number.int();

      (yogaclassService.addStudent as jest.Mock).mockResolvedValue({
        message: HTTP_MESSAGES.EN.yogaClass.addStudent.status_200,
      });

      const result: { message: string } = await yogaclassController.addStudent({
        studentId,
        classId: yogaclassId,
      });

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.yogaClass.addStudent.status_200,
      });

      expect(yogaclassService.addStudent).toHaveBeenCalledWith(
        yogaclassId,
        studentId,
      );
    });
  });

  describe('deleteStudent()', () => {
    it('should remove a student from a class', async () => {
      const studentId: string = faker.string.uuid();
      const yogaclassId: number = faker.number.int();

      (yogaclassService.removeStudent as jest.Mock).mockResolvedValue({
        message: HTTP_MESSAGES.EN.yogaClass.deleteStudent.status_200,
      });

      const result: { message: string } =
        await yogaclassController.removeStudent({
          studentId,
          classId: yogaclassId,
        });

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.yogaClass.deleteStudent.status_200,
      });

      expect(yogaclassService.removeStudent).toHaveBeenCalledWith(
        yogaclassId,
        studentId,
      );
    });
  });

  describe('updateClass()', () => {
    it('should update a class', async () => {
      const classId: number = faker.number.int();
      const updatedClass: UpdateClassDTO = {
        type: 'ADULTS',
        status: 'SCHEDULED',
        date: faker.date.soon(),
        time: faker.date.soon().toTimeString().split(' ')[0],
        instructorId: faker.string.uuid(),
        locationId: faker.number.int(),
      };

      (yogaclassService.updateClass as jest.Mock).mockResolvedValue({
        message: HTTP_MESSAGES.EN.yogaClass.updateClass.status_200,
        data: updatedClass,
      });

      const result: EndpointReturn = await yogaclassController.updateClass(
        classId,
        updatedClass,
      );

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.yogaClass.updateClass.status_200,
        data: updatedClass,
      });

      expect(yogaclassService.updateClass).toHaveBeenCalledWith(
        classId,
        updatedClass,
      );
    });
  });

  describe('deleteClass()', () => {
    it('should delete a class', async () => {
      const deletedClass: YogaClass = generateMockYogaClass();

      (yogaclassService.deleteClass as jest.Mock).mockResolvedValue({
        message: HTTP_MESSAGES.EN.yogaClass.deleteClass.status_200,
        data: deletedClass,
      });

      const result: EndpointReturn = await yogaclassController.deleteClass(
        deletedClass.id,
      );

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.yogaClass.deleteClass.status_200,
        data: deletedClass,
      });

      expect(yogaclassService.deleteClass).toHaveBeenCalledWith(
        deletedClass.id,
      );
    });
  });
});
