import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariacionesComponent } from './variaciones.component';

describe('VariacionesComponent', () => {
  let component: VariacionesComponent;
  let fixture: ComponentFixture<VariacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VariacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VariacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
