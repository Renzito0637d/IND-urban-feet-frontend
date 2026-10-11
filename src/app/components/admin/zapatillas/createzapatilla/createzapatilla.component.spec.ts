import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatezapatillaComponent } from './createzapatilla.component';

describe('CreatezapatillaComponent', () => {
  let component: CreatezapatillaComponent;
  let fixture: ComponentFixture<CreatezapatillaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatezapatillaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatezapatillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
