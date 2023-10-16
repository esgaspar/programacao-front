import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Privilegio } from '../model/privilegio';

@Injectable({
    providedIn: 'root'
})
export class PrivilegioService {
    host = "http://localhost:8080/api/";
    // host = "https://esgaspar.cloudns.ph/api/";
    privilegio_url = this.host + "privilegio"
    constructor(private http: HttpClient) { }


    getPrivilegio(id: number) {
        let service = `/${id}`
        return this.http.get<Privilegio>(this.privilegio_url + service);
    }
    getList(): Observable<Privilegio[]> {
        let service = `/list`
        return this.http.get<Privilegio[]>(this.privilegio_url + service);
    }

    save(privilegio: Privilegio): Observable<Privilegio> {
        return this.http.post<Privilegio>(this.privilegio_url, privilegio);
    }
    saveAll(privilegioList: Privilegio[]): Observable<Privilegio> {
        let service = `/save-all`
        return this.http.post<Privilegio>(this.privilegio_url + service, privilegioList);
    }

    remove(privilegio: Privilegio): Observable<any> {
        return this.http.delete<any>(this.privilegio_url + `/${privilegio.id}`);
    }

}
