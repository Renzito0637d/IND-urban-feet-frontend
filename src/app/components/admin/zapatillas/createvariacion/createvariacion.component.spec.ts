import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatevariacionComponent } from './createvariacion.component';

describe('CreatevariacionComponent', () => {
  let component: CreatevariacionComponent;
  let fixture: ComponentFixture<CreatevariacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatevariacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatevariacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
