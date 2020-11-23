import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../shared/data.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { ModalService } from '../shared/modal.service';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
    user;

    constructor(private toastr: ToastrService, private dataService: DataService, private dialog: MatDialog, private modalService: ModalService, private cookieService: CookieService, private route: ActivatedRoute) {
        this.cartItems = JSON.parse(this.cookieService.get("cartItems"));
        this.dataService.userBehaviorSubject.subscribe(
            success => {
                this.user = success;
            }
        );
        // this.dataService.getFavorites(this.user.id).subscribe(
        //     success => {
        //         console.log(success);
        //     },
        //     fail => {
        //         console.log(fail);
        //     }
        // )
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
        console.log(this.user)
        if (this.user.email === '') {
            this.modalService.open(this.dataService.loginRef);
        } else {
            this.dataService.favoriteItems.push(product);
            this.dataService.addFavorite(this.user.id, product.productId).subscribe(
                success => {
                    console.log(success);
                    this.toastr.success('Item added to your favorites.');
                }, fail => {
                    console.log(fail);
                }
            );
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

