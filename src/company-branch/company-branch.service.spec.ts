import { Test, TestingModule } from '@nestjs/testing';
import { CompanyBranchService } from './company-branch.service';

describe('CompanyBranchService', () => {
  let service: CompanyBranchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyBranchService],
    }).compile();

    service = module.get<CompanyBranchService>(CompanyBranchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
