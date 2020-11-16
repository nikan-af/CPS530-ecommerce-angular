import { Injectable, Output, EventEmitter } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { User } from './models/user.model';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    obj = {'title':'T-shirt by Jack & Jones','bullets':['Part of our responsible edit','Crew neck','Short sleeves','Logo chest embroidery','Relaxed fit','Slouchy cut']};
    tempUser: User = {
        id: 0,
        pwd: '',
        email: '',
        fullName: ''
    };

    genderOfProducts = '';

    redirectUrl: string;
    baseUrl: string = "http://localhost:8080/api";
    @Output() getLoggedInName: EventEmitter<any> = new EventEmitter();
    constructor(private httpClient: HttpClient) { }
    public userlogin(email, password) {
        return this.httpClient.post(this.baseUrl + '/login.php', { 'email': email, 'password': password });
    }
    
    //token
    setToken(token: string) {
        localStorage.setItem('token', token);
    }

    getToken() {
        return localStorage.getItem('token');
    }

    deleteToken() {
        localStorage.removeItem('token');
    }

    registerUser({fullName, email, password}) {
        return this.httpClient.post(this.baseUrl + '/register.php', {'fullName': fullName, 'email': email, 'password': password});
    }

    logout() {
        this.tempUser.id = 0;
        this.tempUser.fullName = '';
        this.tempUser.pwd = '';
        this.tempUser.email = '';
    }

    isLoggedIn() {
        const usertoken = this.getToken();
        if (usertoken != null) {
            return true
        }
        return false;
    }

    getProducts(gender) {
        return this.httpClient.post(this.baseUrl + '/products.php', {'gender': gender});
    }

}











