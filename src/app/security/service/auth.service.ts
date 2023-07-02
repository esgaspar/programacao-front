import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";

export class User {
    constructor(public status: string) { }
}

@Injectable({
    providedIn: "root"
})
export class AuthService {
    constructor(private httpClient: HttpClient, private router: Router) { }

    private _isUserLoggedIn = new BehaviorSubject<boolean>(false);
    // Provide username and password for authentication, and once authentication is successful, 
    //store JWT token in session
    authenticate(username: string, password: string) {
        // let host = "http://localhost:8080/api/";
        let host = "https://esgaspar.cloudns.ph/api/";
        return this.httpClient
            .post<any>(host + "login", { username, password })
            .pipe(
                map(userData => {
                    sessionStorage.setItem("username", username);
                    let tokenStr = "Bearer " + userData.token;
                    sessionStorage.setItem("token", tokenStr);
                    this._isUserLoggedIn.next(true);
                    return userData;
                })
            );
    }

    public getisUserLoggedIn() {
        return this._isUserLoggedIn.asObservable();
    }

    isUserLoggedIn() {
        let user = sessionStorage.getItem("username");
        return !(user === null);
    }

    logOut() {
        this._isUserLoggedIn.next(false);
        sessionStorage.removeItem("username");
        this.router.navigate(["/login"]);
    }


}