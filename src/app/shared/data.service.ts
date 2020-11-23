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

    cartItems = [];
    cartItemsBehaviourSubject: BehaviorSubject<any>;
    isLoggedInBehvaiourSubject: BehaviorSubject<any>;
    userBehaviorSubject: BehaviorSubject<User>;

    loginRef: ElementRef;
    favoriteItems = [];
    loggedIn = false;
    tempUser: User = {
        id: 0,
        email: '',
        pwd: '',
        fullName: ''
    };

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
        this.isLoggedInBehvaiourSubject = new BehaviorSubject<any>(this.loggedIn);
        this.userBehaviorSubject = new BehaviorSubject<any>(this.tempUser);
        this.userBehaviorSubject.next(this.tempUser);
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
        this.userBehaviorSubject.next(
            {
                id: 0,
                fullName: '',
                pwd: '',
                email: ''
            }
        );
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

    resetCart() {
        this.cartItems = [];
        this.cartItemsBehaviourSubject.next([]);
        this.cookieService.set("cartItems", JSON.stringify([]));
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

    recordPurchase(formData) {
        return this.httpClient.post(this.baseUrl + '/recordPurchase.php', {...formData});
    }

    getOrders(userId) {
        return this.httpClient.post(this.baseUrl + '/getOrders.php', {"userId":userId});
    }

    addFavorite(userId, productId) {
        console.log(userId);
        console.log(productId);
        return this.httpClient.post(this.baseUrl + '/addFavorite.php', {"userId":userId,"productId":productId});
    }

    getFavorites(userId) {
        return this.httpClient.post(this.baseUrl + '/getFavorites.php', {"userId":userId});
    }

    isLoggedIn() {
        return new BehaviorSubject<any>(this.loggedIn);
    }
}











