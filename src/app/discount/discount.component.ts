import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { DataService } from '../shared/data.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.css']
})
export class DiscountComponent implements OnInit {

  schoolName: string = '';
  fullname: string = '';
  email: string = '';
  formSent = false;

  discount_form_validations;

  // Regex used for email address validation
  emailRX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // Error messages if the form field values are not valid.
  errorMessages = {
    fullname: [
      { type: 'required', message: 'Name is required.' },
      { type: 'pattern', message: 'Name must only contain letters.' }
    ],
    email: [
      { type: 'required', message: 'Email address is required.' },
      { type: 'pattern', message: 'Please enter a valid email address.' }
    ],
    schoolName: [
      { type: 'required', message: 'School name is required.' },
      { type: 'pattern', message: 'School name must only contain letters.' }
    ],
  }

  constructor(private formBuilder: FormBuilder, private dataService: DataService, private toastr: ToastrService) { }

  ngOnInit(): void {
    // Form validator
    this.discount_form_validations = this.formBuilder.group({
      fullname: new FormControl('', {
        validators: Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z ]*$')])
        , updateOn: 'blur'
      }),
      email: new FormControl('', {
        validators: Validators.compose([
          Validators.required,
          Validators.pattern(this.emailRX)
        ]),
        updateOn: 'blur'
      }),
      schoolName: new FormControl('', {
        validators: Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z ]*$')])
        , updateOn: 'blur'
      })
    });
  }

  /**
   * Submits the inquiry to the php backend and then the data will be stored in the inquiries table for later processing.
   * Checks whether the form inputs are valid using the validator above.
   * If the form is successfully submitted to the backend it will reset the form data. 
   */
  submit() {
    if (this.discount_form_validations.valid) {
      let formValues = { 'fullname': '', 'email': '', 'schoolName': '' };
      for (const field in this.discount_form_validations.controls) {
        formValues[field] = this.discount_form_validations.controls[field].value;
      }

      this.dataService.recordDiscountReq(formValues).subscribe(
        success => {
          this.toastr.success('We have received your request.')
        }
      );
      this.discount_form_validations.reset();
      for (let name in this.discount_form_validations.controls) {
        this.discount_form_validations.controls[name].setErrors(null);
      }
      this.formSent = true;
    }
  }

}
