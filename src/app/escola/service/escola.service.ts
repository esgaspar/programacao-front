import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Designacao } from '../../designacao/model/designacao';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EscolaService {

    host = environment.apiUrl;
    designacao_url = this.host + "escola"
    constructor(private http: HttpClient) { }


    getById(id: number) {
        let service = `/`
        return this.http.get<Designacao>(this.designacao_url + service);
    }
}


