import { Test, TestingModule } from '@nestjs/testing';
import { SubServiceService } from './sub-service.service';

describe('SubServiceService', () => {
  let service: SubServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubServiceService],
    }).compile();

    service = module.get<SubServiceService>(SubServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
