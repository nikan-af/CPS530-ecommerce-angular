import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from '../shared/modal.service';
import { DataService } from '../shared/data.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'nav-component',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent implements AfterViewInit {
    closeResult = '';
    isMenuCollapsed: boolean;
    optionsBoxOpen = false;
    pageName = 'propertyListings';
    userIsLoggedIn = false;
    cartItems = [];

    @ViewChild('content') content: ElementRef;

    constructor(private modalService: ModalService, private router: Router, public dataService: DataService, private cookieService: CookieService) {
        this.cartItems = JSON.parse(this.cookieService.get("cartItems"));
    }

    ngAfterViewInit() {
        this.dataService.loginRef = this.content;
    }

    handleLogin(content) {
        if (this.userIsLoggedIn) {
          this.userIsLoggedIn = false;
          this.dataService.logout();
          console.log(this.dataService.tempUser);
        } else {
          this.modalService.open(content);
        }
    }

    onUserStatusChange(event) {
        if (event === 'loggedIn') {
            this.userIsLoggedIn = true;
        }
    }

    setProductsGender(gender) {
        this.dataService.genderOfProducts = gender;
    }
}