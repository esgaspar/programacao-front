import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Privilegio } from '../model/privilegio';

@Injectable({
    providedIn: 'root'
  })
export class PrivilegioService {
    privilegio_url = "http://localhost:8080/privilegio"
    constructor(private http: HttpClient) { }


    getPrivilegio(id: number) {
        let service = `/${id}`
        return this.http.get<Privilegio>(this.privilegio_url + service);
    }
    getList(): Observable<Privilegio[]> {
        let service = `/list`
        return this.http.get<Privilegio[]>(this.privilegio_url + service);
    }

}
