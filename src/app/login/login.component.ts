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

  // Once the user logs in emits the event to the parent component.
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

  // Regex used for email validation.
  emailRX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // Changes the form tab from sign in to sign up and vice versa
  changeTab() {
    this.signUpSelected = !this.signUpSelected;
  }

  /**
   * gets the form data and checks whether the user is trying to signup or sign in 
   * if sign in it will get the result and send the data to the php backend endpoint for registration and if login to login endpoint.
   * @param form 
   */
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
      /*
        Once the user logs in we set all the behavior subjects set on user, paymentinfo, orders and favorites to inform other components that 
        the user has logged and we then fetch the data for paymentInfo, favorites and orders using the if of the user.
      */
      this.dataService.userlogin(this.tempUser.email, this.tempUser.pwd).subscribe(
        response => {
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
              this.dataService.paymentInfoBehaviourService.next(success[0]);
            }, fail => {
              console.log(fail);
            }
          )
          this.dataService.getOrders(response[0].userId).subscribe(
            success => {
              this.dataService.ordersInfoBehaviourSubject.next(success);
            }, fail => {
              console.log(fail);
            }
          )
          this.dataService.getFavoriteProducts(response[0].userId).subscribe(
            success => {
              this.dataService.userFavoritesBehaviourSubject.next(success);
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
