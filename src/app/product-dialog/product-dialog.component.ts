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
        this.user = this.dataService.userBehaviorSubject.subscribe(
            success => {
                this.user = success;
            }
        )
    }

    ngOnInit() {
        this.product = this.data;
        console.log(this.product.productId);
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

    addToCart() {
        const result = this.dataService.addProductToCart({...this.product, 'qty': this.qty, 'size': this.size});
        
        if (result) {
            this.cartItems.push(this.product);
            this.dialogRef.close();
            console.log('Added to cart!');
        } else {
            this.itemAlreadyAdded = true;
        }
    }

    addToFavorites(product) {
        if (this.user.email === '') {
            this.modalSerivce.open(this.modalSerivce.modalRef);
        }
    }


    
}