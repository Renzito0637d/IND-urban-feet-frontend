import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosInternosComponent } from './usuariosinternos.component';

describe('UsuariosfinalesComponent', () => {
  let component: UsuariosInternosComponent;
  let fixture: ComponentFixture<UsuariosInternosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosInternosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosInternosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
