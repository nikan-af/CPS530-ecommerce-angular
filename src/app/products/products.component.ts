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

    ngOnInit() {
        // Gets the current url path and checks if it is products-men or women and then sets the gender flag which is later used to get the products.
        this.gender = this.route.snapshot.url[0].path === 'products-men' ? 'M' : 'F';

        // Gets the products from the back-end by making a post request.
        this.dataService.getProducts(this.gender).subscribe(
            success => {
                this.products = success;
                this.getFavorites();
            }, fail => {
                console.log(fail);
            }
        )

        // Sets behaviour subject on user data so that in case the user logs in or out the code block gets executed and updates the favorites component.
        this.dataService.userBehaviorSubject.subscribe(
            success => {
                this.user = success;
                this.loading = true;
                this.getFavorites();
            }
        );

        // Sets behaviour subject on favorites in case the favorites changes when the user logs in/out.
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
            }
        })
    }

    /**
     * Gets favorites from the backend using the user id.
     * Get the product Id of the favorite products and checks whether the products are present in the products component if so it will push the product
            onto the the favoriteProducts array. 
     */
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
            },
            fail => {
                console.log(fail);
            }
        )
    }

    /**
     * Removes the product from the list of favorite products 
     * Makes a post request to the php backend to remove the product from favorites in the favorites table.
     * @param product 
     */
    removeFromFavorites(product) {
        this.favoriteProducts.splice(this.favoriteProducts.indexOf(product.productId), 1);
        this.dataService.removeFromFavorites(this.user.id, product.productId).subscribe(success => {
        }, fail => {
            console.log(fail);
        })
    }

    /**
     * If the user is NOT logged in it will open the login dialog box and asks the user to login.
     * If the user IS logged in, it will add the product to the favoriteProducts array and makes 
            post request to the php backend to insert the data into the favorites table.
     * @param product 
     */
    addToFavorites(product) {
        if (this.user.email === '') {
            this.modalService.open(this.dataService.loginRef);
        } else {
            this.favoriteProducts.push(product.productId);
            this.dataService.favoriteItems.push(product);
            this.dataService.addFavorite(this.user.id, product.productId).subscribe(
                success => {
                }, fail => {
                    console.log(fail);
                }
            );
        }
    }

    /**
     * Opens the product-dialog.component and passes in the product item so that the details can be used on the dialog
     * Adds an attribute to the product object called 'favorite' so that if true then the "Add to favorites" button
            will get hidden because the item is already added to favorites.
     * @param product 
     */
    openProductDialog(product) {
        product.favorite = this.favoriteProducts.indexOf(product.productId) >= 0 ? true : false;
        const dialogRef = this.dialog.open(ProductDialogComponent, {
            panelClass: 'custom-dialog-container',
            width: '1200px',
            height: '1000',
            data: product
        });

        dialogRef.afterClosed().subscribe(result => {
            this.getFavorites();
        });
    }
}

/* The interface used for the object that gets passed into the product dialog */
export interface ProductDialogData {
    productId: string;
    productName: string;
    gender: string;
    description: string;
    price: string;
    favorite: boolean;
}

