import { Test, TestingModule } from '@nestjs/testing';
import { CompanyBranchController } from './company-branch.controller';
import { CompanyBranchService } from './company-branch.service';

describe('CompanyBranchController', () => {
  let controller: CompanyBranchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyBranchController],
      providers: [CompanyBranchService],
    }).compile();

    controller = module.get<CompanyBranchController>(CompanyBranchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
