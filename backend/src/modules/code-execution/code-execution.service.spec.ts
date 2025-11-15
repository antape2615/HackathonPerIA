import { Test, TestingModule } from '@nestjs/testing';
import { CodeExecutionService } from './code-execution.service';

describe('CodeExecutionService', () => {
  let service: CodeExecutionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CodeExecutionService],
    }).compile();

    service = module.get<CodeExecutionService>(CodeExecutionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
