import { Component, OnInit, Input, Inject } from '@angular/core';
import { DataService } from '../shared/data.service';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductDialogData } from '../products/products.component';
import { ModalService } from '../shared/modal.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'product-dialog-component',
    templateUrl: './product-dialog.component.html',
    styleUrls: ['./product-dialog.component.css']
})
export class ProductDialogComponent implements OnInit {

    product: ProductDialogData;
    images: any;
    productDetails;
    loading = true;
    itemAlreadyAdded = false;
    size = 'xs';
    qty = 1;
    cartItems = [];
    user;

    constructor(private dataService: DataService, public dialogRef: MatDialogRef<ProductDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: ProductDialogData, private modalSerivce: ModalService) {
        this.cartItems = this.dataService.getCartItems();

        // Gets the user information to see if the user is logged in
        this.dataService.userBehaviorSubject.subscribe(
            success => {
                this.user = success;
            }
        )
    }

    ngOnInit() {
        this.product = this.data;
        
        // Gets product images using the productId of the product object passed into the dialog (i.e. this.data)
        this.dataService.getImages(this.product.productId).subscribe(
            success => {
                this.images = success;
                this.productDetails = JSON.parse(this.product.description);
                this.loading = false;
            }, fail => {
                console.log(fail);
            }
        )
    }

    // Adds the product to the cart when the user clicks "Add to cart" button and creates the cookie and then closes the dialog.
    addToCart() {
        const result = this.dataService.addProductToCart({...this.product, 'qty': this.qty, 'size': this.size});
        
        if (result) {
            this.cartItems.push(this.product);
            this.dialogRef.close();
        } else {
            this.itemAlreadyAdded = true;
        }
    }

    // Makes a post request to PHP backend to insert the product into the favorites table or asks the user to login if not logged in.
    addToFavorites() {
        if (this.user.id === 0) {
            this.modalSerivce.open(this.dataService.loginRef);
        } else {
            this.dataService.addFavorite(this.user.id, this.data.productId).subscribe(
                success => {
                }, fail => {
                    console.log(fail);
                }
            );
        }
    }
}