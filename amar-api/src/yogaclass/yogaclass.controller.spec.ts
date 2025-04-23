import { Test, TestingModule } from '@nestjs/testing';
import { YogaclassController } from './yogaclass.controller';

describe('YogaclassController', () => {
  let controller: YogaclassController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [YogaclassController],
    }).compile();

    controller = module.get<YogaclassController>(YogaclassController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
