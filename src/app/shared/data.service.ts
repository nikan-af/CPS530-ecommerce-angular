import { Injectable, Output, EventEmitter, ElementRef } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { User } from './models/user.model';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';

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
    cartItems = [];
    cartItemsBehaviourSubject: BehaviorSubject<any>;
    loginRef: ElementRef;
    favoriteItems = [];

    genderOfProducts = '';
 
    redirectUrl: string;
    baseUrl: string = "http://localhost:8080/api";
    @Output() getLoggedInName: EventEmitter<any> = new EventEmitter();
    constructor(private httpClient: HttpClient, private cookieService: CookieService) { 
        var tempCookie = this.cookieService.get("cartItems");
        if (!tempCookie) {
            this.cookieService.set("cartItems", JSON.stringify(this.cartItems));
        } else {
            this.cartItems = JSON.parse(tempCookie);
        }
        this.cartItemsBehaviourSubject = new BehaviorSubject<any>(this.cartItems);
    }

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

    getImages(productId) {
        return this.httpClient.post(this.baseUrl + '/productImages.php', {'productId': productId});
    }

    getCartItems() {
        return JSON.parse(this.cookieService.get("cartItems"));
    }

    addProductToCart(product) {
        var productExists = this.cartItems.map(tmpProduct => {
            if (tmpProduct.productId == product.productId) {
                return true;
            }

            return false;
        })

        console.log(productExists);
        
        var cartItems = this.getCartItems();
        if (!productExists.includes(true)) {
            cartItems.push(product);
            this.cartItemsBehaviourSubject.next(cartItems);
            this.cartItems = cartItems;
            this.cookieService.set("cartItems", JSON.stringify(cartItems));
            return true;
        } 
        
        return false;
    }

    updateCartItems() {
        return new BehaviorSubject<any>(this.cartItems);
    }

    removeItem(product) {
        var tmpCartItems = this.getCartItems();
        for (var i = 0; i < tmpCartItems.length; i++) {
            if (tmpCartItems[i].productId == product.productId) {
                tmpCartItems.splice(i, 1);
            }
        }
        this.cartItems = tmpCartItems;
        this.cartItemsBehaviourSubject.next(tmpCartItems);
        this.cookieService.set("cartItems", JSON.stringify(tmpCartItems));
    }
}











