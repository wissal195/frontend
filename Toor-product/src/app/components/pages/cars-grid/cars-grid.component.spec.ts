import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarsGridComponent } from './cars-grid.component';

describe('CarsGridComponent', () => {
  let component: CarsGridComponent;
  let fixture: ComponentFixture<CarsGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarsGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
