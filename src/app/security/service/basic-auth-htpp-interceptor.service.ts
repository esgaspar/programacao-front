import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.endsWith('login')) {
    return next(req);
  }

  const isOwnApi = req.url.startsWith(environment.apiUrl);
  const token = sessionStorage.getItem('token');

  if (isOwnApi && token && sessionStorage.getItem('user')) {
    return next(req.clone({ headers: req.headers.set('Authorization', token) }));
  }

  return next(req);
};
