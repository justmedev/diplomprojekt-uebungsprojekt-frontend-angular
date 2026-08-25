import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_BASE_URL } from './base-url.token';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = inject(API_BASE_URL, { optional: true });

  if (!baseUrl || req.url.startsWith('http://') || req.url.startsWith('https://')) {
    return next(req);
  }

  const cleanBase = baseUrl.replace(/\/+$/, '');
  const cleanUrl = req.url.replace(/^\/+/, '');

  const apiReq = req.clone({
    url: `${cleanBase}/${cleanUrl}`,
  });

  return next(apiReq);
};
