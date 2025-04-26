import { Test, TestingModule } from '@nestjs/testing';
import { RollcallService } from './rollcall.service';

describe('RollcallService', () => {
  let service: RollcallService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RollcallService],
    }).compile();

    service = module.get<RollcallService>(RollcallService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
