import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Checks if the user is logged in and adds the token to the request headers
 */
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const storage = authService.getLocalStorage();
  if (!!storage && !!storage.token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${storage.token}`,
      },
    });
  } else {
    req = req.clone({
      setHeaders: {
        Accept: 'application/json',
      },
    });
  }
  return next(req);
};
