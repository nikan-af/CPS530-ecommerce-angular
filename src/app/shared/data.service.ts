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
    userFavoritesBehaviourSubject: BehaviorSubject<any>;
    paymentInfoBehaviourService: BehaviorSubject<any>;
    ordersInfoBehaviourSubject: BehaviorSubject<any>;

    loginRef: ElementRef;
    favoriteItems = [];
    loggedIn = false;
    orders = [];
    paymentInfo:any = {
        orderId: '',
        userId: '',
        productId: '',
        qty: '',
        orderTimestamp: '',
        credit_card_number: '',
        credit_card_holder: '',
        expiry_month: '',
        expiry_year: '', 
        credit_card_first_name: '', 
        credit_card_last_name: '', 
        credit_card_address_line_1: '', 
        credit_card_address_line_2: '', 
        country: '', 
        province: '', 
        city: '', 
        postal_code: ''
    };
    tempUser: User = {
        id: 0,
        email: '',
        pwd: '',
        fullName: ''
    };

    genderOfProducts = '';
 
    redirectUrl: string;
    /* PROD 
    baseUrl: string = "http://3.12.38.160/api";
    */
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
        this.userFavoritesBehaviourSubject = new BehaviorSubject<any>(this.favoriteItems);
        this.paymentInfoBehaviourService = new BehaviorSubject<any>(this.paymentInfo);
        this.ordersInfoBehaviourSubject = new BehaviorSubject<any>(this.orders);

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
        console.log('here12');
        this.userBehaviorSubject.next(
            {
                id: 0,
                fullName: '',
                pwd: '',
                email: ''
            }
        );
        this.paymentInfoBehaviourService.next(
            {orderId: '',
            userId: '',
            productId: '',
            qty: '',
            orderTimestamp: '',
            credit_card_number: '',
            credit_card_holder: '',
            expiry_month: '',
            expiry_year: '', 
            credit_card_first_name: '', 
            credit_card_last_name: '', 
            credit_card_address_line_1: '', 
            credit_card_address_line_2: '', 
            country: '', 
            province: '', 
            city: '', 
            postal_code: ''}
        );
        this.userFavoritesBehaviourSubject.next([]);
        this.isLoggedInBehvaiourSubject.next(false);

    }

    getProducts(gender) {
        return this.httpClient.post(this.baseUrl + '/products.php', {'gender': gender});
    }

    removeFromFavorites(userId, productId) {
        console.log(userId);
        console.log(productId);
        return this.httpClient.post(this.baseUrl + '/removeFromFavorites.php', { 'userId': `${userId}`, 'productId': `${productId}` });
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
        console.log(formData);
        return this.httpClient.post(this.baseUrl + '/recordPurchase.php', {...formData});
    }

    getPaymentInfo(userId) {
        return this.httpClient.post(this.baseUrl + '/getPaymentInfo.php', { "userId":userId });
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

    getFavoriteProducts(userId) {
        return this.httpClient.post(this.baseUrl + '/getFavoriteProducts.php', { "userId":userId });
    }

    isLoggedIn() {
        return new BehaviorSubject<any>(this.loggedIn);
    }
}











