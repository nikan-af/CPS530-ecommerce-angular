import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../shared/data.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { ModalService } from '../shared/modal.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'products-component',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

    products: any;
    cartItems = [];
    loading = true;

    constructor(private dataService: DataService, private dialog: MatDialog, private modalService: ModalService, private cookieService: CookieService) {
        this.cartItems = JSON.parse(this.cookieService.get("cartItems"));
    }

    onClick() {
        console.log('here');
    }

    ngOnInit() {
        console.log(this.dataService.genderOfProducts);
        this.dataService.getProducts(this.dataService.genderOfProducts).subscribe(
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
            height: '60vh',
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

