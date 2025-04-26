import { Test, TestingModule } from '@nestjs/testing';
import { RollcallController } from './rollcall.controller';

describe('RollcallController', () => {
  let controller: RollcallController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RollcallController],
    }).compile();

    controller = module.get<RollcallController>(RollcallController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
