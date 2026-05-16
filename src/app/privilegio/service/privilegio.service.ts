import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Privilegio } from '../model/privilegio';

@Injectable({
    providedIn: 'root'
})
export class PrivilegioService {
    host = environment.apiUrl;

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
