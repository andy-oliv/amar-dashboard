import { Test, TestingModule } from '@nestjs/testing';
import { YogaclassService } from './yogaclass.service';

describe('YogaclassService', () => {
  let service: YogaclassService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YogaclassService],
    }).compile();

    service = module.get<YogaclassService>(YogaclassService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
