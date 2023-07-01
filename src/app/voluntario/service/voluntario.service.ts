import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Voluntario } from '../model/voluntario';

@Injectable({
    providedIn: 'root'
})
export class VoluntarioService {
    //host = "http://localhost:8080/api/";
    host = "http://esgaspar.cloudns.ph/api/";
    voluntario_url = this.host + "voluntario"
    constructor(private http: HttpClient) { }


    getById(id: number) {
        let service = `/${id}`
        return this.http.get<Voluntario>(this.voluntario_url + service);
    }
    getList(): Observable<Voluntario[]> {
        let service = `/list`
        return this.http.get<Voluntario[]>(this.voluntario_url + service);
    }
    save(voluntario: Voluntario): Observable<Voluntario> {
        return this.http.post<Voluntario>(this.voluntario_url, voluntario);
    }

}
