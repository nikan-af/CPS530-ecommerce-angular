import { Component, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalService } from '../shared/modal.service';
import { Router } from '@angular/router';
import { DataService } from '../shared/data.service'
import { User } from '../shared/models/user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  exportAs: 'modal',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  @Input() content: ElementRef;
  @Output() userStatus: EventEmitter<any> = new EventEmitter();

  constructor(private dataService: DataService, private toastr: ToastrService, private modalService: ModalService) {

  }

  tempUser: User = {
    id: 0,
    fullName: '',
    email: '',
    pwd: ''
  };

  signUpSelected = false;
  userWasCreated = false;
  userIsValid = false;
  userIsLoggedIn = false;
  userHasSignedUp = false;
  emailRX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  changeTab() {
    this.signUpSelected = !this.signUpSelected;
  }

  onSubmit(form: NgForm) {
    if (form.value.passwordSignUp) {
      this.dataService.registerUser({ 'fullName': form.value.fullName, 'email': form.value.emailSignUp, 'password': form.value.passwordSignUp }).subscribe(
        success => {
          this.userWasCreated = true;
          this.userHasSignedUp = true;
          this.dataService.isLoggedInBehvaiourSubject.next(false);
        },
        fail => {
          console.log(fail);
        }
      );
    } else {
      this.dataService.userlogin(this.tempUser.email, this.tempUser.pwd).subscribe(
        response => {
          console.log(response);
          this.dataService.userBehaviorSubject.next(
            {
              id: response[0].userId,
              email: response[0].email,
              fullName: response[0].fullName,
              pwd: ''
            }
          );
          this.dataService.getPaymentInfo(response[0].userId).subscribe(
            success => {
              console.log(success);
              console.log(success[0]);
              this.dataService.paymentInfoBehaviourService.next(success[0]);
            }, fail => {
              console.log(fail);
            }
          )
          this.dataService.getOrders(response[0].userId).subscribe(
            success => {
              console.log(success);
              console.log(success[0]);
              this.dataService.ordersInfoBehaviourSubject.next(success);
            }, fail => {
              console.log(fail);
            }
          )
          this.userStatus.emit('loggedIn');
          this.userIsLoggedIn = true;
          this.dataService.isLoggedInBehvaiourSubject.next(true);
          this.modalService.close(this.content);
          this.toastr.success("Hello " + response[0].fullName + ", you are logged in!");
        },
        fail => {
          console.log(fail);
        }
      );
    }
  }
}
