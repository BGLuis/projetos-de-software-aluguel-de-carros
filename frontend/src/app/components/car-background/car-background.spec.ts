import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarBackground } from './car-background';

describe('CarBackground', () => {
  let component: CarBackground;
  let fixture: ComponentFixture<CarBackground>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarBackground]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarBackground);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
