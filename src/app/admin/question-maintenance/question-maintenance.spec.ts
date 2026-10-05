import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionMaintenance } from './question-maintenance';

describe('QuestionMaintenance', () => {
  let component: QuestionMaintenance;
  let fixture: ComponentFixture<QuestionMaintenance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionMaintenance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionMaintenance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
