import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/data.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  loading = true;
  noOrderHistory: Boolean;
  user;
  orders;
  orderByDate: any[] = [];
  reverseList: any[] = [];
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.userBehaviorSubject.subscribe(
      data => {
        this.user = data;
      }
    );

    this.dataService.ordersInfoBehaviourSubject.subscribe(
      success => {
        this.processData(success);
      }
    )

    this.dataService.getOrders(this.user.id).subscribe(
      success => {
        this.processData(success);
      },
      fail => {
        console.log(fail);
      }
    )
  }

  processData(success) {
    this.orders = success as [];
    console.log(this.orders);
    this.orderByDate = [];
    this.orders.map(order => {
      if (!this.orderByDate[`${order.timestamp}`]) {
        this.orderByDate[`${order.timestamp}`] = [];
      }
      this.orderByDate[`${order.timestamp}`].push(order);
    });
    if (this.orders.length === 0) {
      this.noOrderHistory = true;
    } else {
      this.noOrderHistory = false;
    }
    this.reverseList = this.orderByDate.reverse();
    this.loading = false;
  }

}
