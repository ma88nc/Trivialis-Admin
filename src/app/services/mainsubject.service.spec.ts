import { TestBed } from '@angular/core/testing';

import { MainSubjectService } from './mainsubject.service';

describe('MainSubjectService', () => {
  let service: MainSubjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainSubjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
