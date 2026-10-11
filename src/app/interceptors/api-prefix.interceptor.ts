import { HttpInterceptorFn } from '@angular/common/http';

export const apiPrefixInterceptor: HttpInterceptorFn = (req, next) => {

  const apiUrl = 'http://localhost:8080/api';

  console.log('Interceptando solicitud:', req.url);

  // Si la URL no es absoluta (no empieza por http), le añadimos el prefijo
  if (!req.url.startsWith('http')) {

    // Clona la petición y añádele el prefijo de la API
    const apiReq = req.clone({
      url: `${apiUrl}${req.url}`,
      withCredentials: true
    });

    // Pasa la petición clonada (con el prefijo)
    return next(apiReq);
  }

  // Si ya era una URL absoluta (empezaba con http), déjala pasar tal cual
  return next(req);
};