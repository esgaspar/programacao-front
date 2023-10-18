import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../model/user';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    host = "http://89.117.32.90/api/";
    // host = "http://localhost:8080/api/";
    // host = "https://esgaspar.cloudns.ph/api/";
    voluntario_url = this.host + "user"
    constructor(private http: HttpClient) { }


    getById(id: number) {
        let service = `/${id}`
        return this.http.get<User>(this.voluntario_url + service);
    }
    getList(): Observable<User[]> {
        let service = `/list`
        return this.http.get<User[]>(this.voluntario_url + service);
    }
    save(value: User): Observable<User> {
        return this.http.post<User>(this.voluntario_url, value);
    }
    remove(value: User): Observable<any> {
        return this.http.delete<any>(this.voluntario_url + `/${value.id}`);
    }

}
