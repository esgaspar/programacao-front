import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Designacao } from '../model/designacao';

@Injectable({
    providedIn: 'root'
})
export class DesignacaoService {

    host = "http://89.117.32.90/api";
    // host = "http://localhost:8080/api/";
    // host = "https://esgaspar.cloudns.ph/api/";
    designacao_url = this.host + "designacao"
    constructor(private http: HttpClient) { }


    getById(id: number) {
        let service = `/${id}`
        return this.http.get<Designacao>(this.designacao_url + service);
    }
    getList(): Observable<Designacao[]> {
        let service = `/list`
        return this.http.get<Designacao[]>(this.designacao_url + service);
    }

    getByDate(data: String): Observable<Designacao[]> {
        //let date = data.getDate() + "-" + data.getMonth() + "-" + data.getFullYear();
        let service = `/inicio/${data}/fim/${data}`;
        return this.http.get<Designacao[]>(this.designacao_url + service);
    }
    getByMes(data: String): Observable<Designacao[]> {
        //let date = data.getDate() + "-" + data.getMonth() + "-" + data.getFullYear();
        let service = `/mes/${data}`;
        return this.http.get<Designacao[]>(this.designacao_url + service);
    }
    getByRangeDate(startDate: String | null, endDate: String | null): Observable<Designacao[]> {
        //let date = data.getDate() + "-" + data.getMonth() + "-" + data.getFullYear();
        let service = `/inicio/${startDate}/fim/${endDate}`;
        return this.http.get<Designacao[]>(this.designacao_url + service);
    }

    saveAll(designacaoListToSave: Designacao[]): Observable<Designacao[]> {
        let service = '/save-all'
        return this.http.post<Designacao[]>(this.designacao_url + service, designacaoListToSave);
    }

    deleteAll(designacaoListToSave: Designacao[]): Observable<Designacao[]> {
        let service = '/delete-all'
        return this.http.post<Designacao[]>(this.designacao_url + service, designacaoListToSave);
    }
}


