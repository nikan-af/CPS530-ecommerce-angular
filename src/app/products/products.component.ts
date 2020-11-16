import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../shared/data.service';

@Component({
    selector: 'products-component',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

    products: any;

    constructor(private dataService: DataService) {}

    onClick() {
        console.log('here');
    }

    ngOnInit() {
        console.log(this.dataService.genderOfProducts);
        this.dataService.getProducts(this.dataService.genderOfProducts).subscribe(
            success => {
                this.products = success;
                console.log(success);
            }, fail => {
                console.log(fail);
            }
        )
    }

    favorite(product) {
        console.log(product);
    }
}