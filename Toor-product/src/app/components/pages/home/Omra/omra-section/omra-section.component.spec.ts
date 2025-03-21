import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OmraSectionComponent } from './omra-section.component';

describe('OmraSectionComponent', () => {
  let component: OmraSectionComponent;
  let fixture: ComponentFixture<OmraSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OmraSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OmraSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
