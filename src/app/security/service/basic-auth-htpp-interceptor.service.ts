import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class BasicAuthHtppInterceptorService implements HttpInterceptor {


    constructor(private router: Router) {

    }
    intercept(req: HttpRequest<any>, next: HttpHandler) {

        if (req.url.endsWith('login')) {
            return next.handle(req);
        }

        if (sessionStorage.getItem('username') && sessionStorage.getItem('token')) {
            const clonedRequest = req.clone({ headers: req.headers.append('Authorization', sessionStorage.getItem('token')!) });
            return next.handle(clonedRequest);
        }

        // this.router.navigate(["/login"]);

        return next.handle(req);

    }
}