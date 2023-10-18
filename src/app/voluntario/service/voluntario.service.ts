import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Voluntario } from '../model/voluntario';

@Injectable({
    providedIn: 'root'
})
export class VoluntarioService {
    host = "http://89.117.32.90/api/";
    // host = "http://localhost:8080/api/";
    // host = "https://esgaspar.cloudns.ph/api/";
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
    remove(voluntario: Voluntario): Observable<any> {
        return this.http.delete<any>(this.voluntario_url + `/${voluntario.id}`);
    }

    getListByNome(nome: string): Observable<Voluntario[]> {
        let busca = nome;
        if (busca === '') {
            busca = '-';
        }
        let service = `/list/nome/${busca}`
        return this.http.get<Voluntario[]>(this.voluntario_url + service);
    }

}
