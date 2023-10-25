import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    host = environment.apiUrl;
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
