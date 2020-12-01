import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { DataService } from '../shared/data.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { ModalService } from '../shared/modal.service';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
    selector: 'products-component',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

    products: any;
    cartItems = [];
    favoriteItems: any;
    favoriteProducts = [];
    loading = true;
    gender = "";
    user;

    constructor(private toastr: ToastrService, private dataService: DataService, private dialog: MatDialog, private modalService: ModalService, private cookieService: CookieService, private route: ActivatedRoute) {
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
                this.getFavorites();
            }, fail => {
                console.log(fail);
            }
        )

        this.dataService.userBehaviorSubject.subscribe(
            success => {
                console.log(success);
                this.user = success;
                this.loading = true;
                this.getFavorites();
            }
        );

        this.dataService.userFavoritesBehaviourSubject.subscribe((success) => {
            this.favoriteItems = success as [];
            this.favoriteProducts = [];
            if (this.favoriteItems.length > 0) {
                for (let i = 0; i < this.favoriteItems.length; i++) {
                    for (let j = 0; j < this.products.length; j++) {
                        if (this.products[j].productId === this.favoriteItems[i].productId) {
                            this.favoriteProducts.push(this.products[j]['productId']);
                        }
                    }
                }
                console.log(this.favoriteItems);
            }

            console.log(this.products);
            console.log(this.favoriteItems[this.products[2]['productId']])
        })
    }

    getFavorites() {
        this.dataService.getFavorites(this.user.id).subscribe(
            success => {
                this.favoriteItems = success;
                this.favoriteProducts = [];
                this.dataService.userFavoritesBehaviourSubject.next(success);
                if (this.products) {
                    for (let i = 0; i < this.favoriteItems.length; i++) {
                        for (let j = 0; j < this.products.length; j++) {
                            if (this.products[j].productId === this.favoriteItems[i].productId) {
                                this.favoriteProducts.push(this.products[j]['productId']);
                            }
                        }
                    }
                }
                this.loading = false;
                console.log(this.favoriteProducts);
            },
            fail => {
                console.log(fail);
            }
        )
    }

    removeFromFavorites(product) {
        console.log(product.productId);
        this.favoriteProducts.splice(this.favoriteProducts.indexOf(product.productId), 1);
        this.dataService.removeFromFavorites(this.user.id, product.productId).subscribe(success => {
            console.log(this.favoriteProducts);
            console.log(success);
        }, fail => {
            console.log(fail);
        })
    }

    addToFavorites(product) {
        if (this.user.email === '') {
            this.modalService.open(this.dataService.loginRef);
        } else {
            this.favoriteProducts.push(product.productId);
            this.dataService.favoriteItems.push(product);
            this.dataService.addFavorite(this.user.id, product.productId).subscribe(
                success => {
                    console.log(success);
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
            width: '1200px',
            height: '1000',
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

