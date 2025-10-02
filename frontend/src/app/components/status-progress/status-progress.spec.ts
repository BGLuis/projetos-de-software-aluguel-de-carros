import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusProgress } from './status-progress';

describe('StatusProgress', () => {
  let component: StatusProgress;
  let fixture: ComponentFixture<StatusProgress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusProgress]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusProgress);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
