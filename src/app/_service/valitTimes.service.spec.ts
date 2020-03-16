/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ValitTimesService } from './valitTimes.service';

describe('Service: ValitTimes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValitTimesService]
    });
  });

  it('should ...', inject([ValitTimesService], (service: ValitTimesService) => {
    expect(service).toBeTruthy();
  }));
});
