import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../shared/data.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { ModalService } from '../shared/modal.service';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'products-component',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

    products: any;
    cartItems = [];
    loading = true;
    gender = "";

    constructor(private dataService: DataService, private dialog: MatDialog, private modalService: ModalService, private cookieService: CookieService, private route: ActivatedRoute) {
        this.cartItems = JSON.parse(this.cookieService.get("cartItems"));
    }

    onClick() {
        console.log('here');
    }

    ngOnInit() {
        this.gender = this.route.snapshot.url[0].path === 'products-men' ? 'M' : 'F';
        this.dataService.getProducts(this.gender).subscribe(
            success => {
                this.products = success;
                console.log(success);
                this.loading = false;
            }, fail => {
                console.log(fail);
            }
        )
    }

    addToFavorites(product) {
        console.log(product);
        if (this.dataService.tempUser.email === '') {
            this.modalService.open(this.dataService.loginRef);
        } else {
            this.dataService.favoriteItems.push(product);
        }
    }

    openProductDialog(product) {
        console.log(product);
        this.dialog.open(ProductDialogComponent, {
            panelClass: 'custom-dialog-container',
            width: '60vw',
            height: '67vh',
            data: product
          });
    }
}

export interface ProductDialogData {
    productId: string;
    productName: string;
    gender: string;
    description: string;
    price: string;
}

