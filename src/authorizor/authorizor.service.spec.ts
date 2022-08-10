import { Test, TestingModule } from '@nestjs/testing';
import { AuthorizorService } from './authorizor.service';

describe('AuthorizorService', () => {
  let service: AuthorizorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthorizorService],
    }).compile();

    service = module.get<AuthorizorService>(AuthorizorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
