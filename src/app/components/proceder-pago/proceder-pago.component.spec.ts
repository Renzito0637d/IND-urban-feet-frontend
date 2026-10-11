import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcederPagoComponent } from './proceder-pago.component';

describe('ProcederPagoComponent', () => {
  let component: ProcederPagoComponent;
  let fixture: ComponentFixture<ProcederPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcederPagoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcederPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
