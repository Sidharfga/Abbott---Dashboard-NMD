import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeuroComponent } from './Neuro.component';

describe('NeuroComponent', () => {
  let component: NeuroComponent;
  let fixture: ComponentFixture<NeuroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NeuroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NeuroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
