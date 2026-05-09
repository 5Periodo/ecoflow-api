import { Test, TestingModule } from '@nestjs/testing';
import { RecompensasController } from './recompensas.controller';

describe('RecompensasController', () => {
  let controller: RecompensasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecompensasController],
    }).compile();

    controller = module.get<RecompensasController>(RecompensasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
