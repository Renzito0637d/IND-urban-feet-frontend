import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SugerennciasComponent } from './sugerenncias.component';

describe('SugerennciasComponent', () => {
  let component: SugerennciasComponent;
  let fixture: ComponentFixture<SugerennciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SugerennciasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SugerennciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
