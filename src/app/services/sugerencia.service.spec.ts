import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SugerenciaService } from './sugerencia.service';
import { SugerenciaRequest, SugerenciaResponse } from '../models/sugerencia.model';

describe('SugerenciaService', () => {

  let service: SugerenciaService;
  let httpMock: HttpTestingController;
  const baseUrl = '/sugerencias';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SugerenciaService]
    });

    service = TestBed.inject(SugerenciaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería listar sugerencias (GET /sugerencias)', () => {
    const mockResponse: SugerenciaResponse[] = [
      {
        id: 1,
        asunto: 'Prueba',
        mensaje: 'Mensaje de prueba',
        fechaEnvio: '2025-01-01T10:00:00',
        estado: 'pendiente',
        userId: 3
      }
    ];

    service.listar().subscribe(data => {
      expect(data.length).toBe(1);
      expect(data[0].asunto).toBe('Prueba');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('debería obtener una sugerencia por ID (GET /sugerencias/{id})', () => {
    const mockResponse: SugerenciaResponse = {
      id: 1,
      asunto: 'Test',
      mensaje: 'Mensaje',
      fechaEnvio: '2025-01-01T10:00:00',
      estado: 'pendiente',
      userId: 3
    };

    service.obtener(1).subscribe(data => {
      expect(data.id).toBe(1);
      expect(data.asunto).toBe('Test');
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('debería crear una sugerencia (POST /sugerencias)', () => {
    const request: SugerenciaRequest = {
      asunto: 'Nuevo',
      mensaje: 'Mensaje nuevo'
    };

    const mockResponse: SugerenciaResponse = {
      id: 10,
      asunto: 'Nuevo',
      mensaje: 'Mensaje nuevo',
      fechaEnvio: '2025-01-01T12:00:00',
      estado: 'pendiente',
      userId: 3
    };

    service.crear(request).subscribe(data => {
      expect(data.id).toBe(10);
      expect(data.asunto).toBe('Nuevo');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('debería actualizar una sugerencia (PUT /sugerencias/{id})', () => {
    const request: SugerenciaRequest = {
      asunto: 'Editado',
      mensaje: 'Mensaje editado'
    };

    const mockResponse: SugerenciaResponse = {
      id: 1,
      asunto: 'Editado',
      mensaje: 'Mensaje editado',
      fechaEnvio: '2025-01-01T10:00:00',
      estado: 'pendiente',
      userId: 3
    };

    service.actualizar(1, request).subscribe(data => {
      expect(data.asunto).toBe('Editado');
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('debería eliminar una sugerencia (DELETE /sugerencias/{id})', () => {
    service.eliminar(1).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

});
