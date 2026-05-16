import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BasicAuthHtppInterceptorService implements HttpInterceptor {

    constructor(private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        if (req.url.endsWith('login')) {
            return next.handle(req);
        }

        const isOwnApi = req.url.startsWith(environment.apiUrl);
        const token = sessionStorage.getItem('token');

        if (isOwnApi && token && sessionStorage.getItem('user')) {
            const clonedRequest = req.clone({ headers: req.headers.append('Authorization', token) });
            return next.handle(clonedRequest);
        }

        return next.handle(req);
    }
}