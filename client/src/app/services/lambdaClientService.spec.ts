import { TestBed, inject } from '@angular/core/testing';

import { LambdaClientService } from './lambdaClientService';

describe('LambdaClientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LambdaClientService]
    });
  });

  it('should be created', inject([LambdaClientService], (service: LambdaClientService) => {
    expect(service).toBeTruthy();
  }));
});
