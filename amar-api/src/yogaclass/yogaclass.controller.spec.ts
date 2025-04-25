import { Test, TestingModule } from '@nestjs/testing';
import { YogaclassController } from './yogaclass.controller';
import { YogaclassService } from './yogaclass.service';

describe('YogaclassController', () => {
  let yogaclassController: YogaclassController;
  let yogaclassService: YogaclassService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [YogaclassController],
    }).compile();

    yogaclassController = module.get<YogaclassController>(YogaclassController);
    yogaclassService = module.get<YogaclassService>(YogaclassService);
  });

  it('should be defined', () => {
    expect(yogaclassController).toBeDefined();
  });
});
