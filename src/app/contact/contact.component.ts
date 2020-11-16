import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { DataService } from '../shared/data.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  emailRX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  emailAddress;
  contact_form_validations;
  typeOfInquiry;
  formSent = false;

  inquiryTypeOptions = { option1: 'Inquiring about a property'};


  errorMessages = {
    first_name: [
      { type: 'required', message: 'First name is required.' },
      { type: 'pattern', message: 'First name must only contain letters.' }
    ],
    last_name: [
      { type: 'required', message: 'Last name is required.' },
      { type: 'pattern', message: 'Last name must only contain letters.' }
    ],
    email: [
      { type: 'required', message: 'Email address is required.' },
      { type: 'pattern', message: 'Please enter a valid email address.' }
    ],
    inquiryType: [
      { type: 'required', message: 'Please select a type.' },
    ],
    messageTextBox: [
      { type: 'required', message: 'Message is required.' },
      { type: 'maxLength', message: 'Max characters 265.' }
    ]
  }

  constructor(private formBuilder: FormBuilder, private dataService: DataService) { }

  ngOnInit(): void {
    this.contact_form_validations = this.formBuilder.group({
      first_name: new FormControl('', {validators: Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z ]*$')])
          , updateOn: 'blur'
        }),
      last_name: new FormControl('', {validators: Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z ]*$')])
        , updateOn: 'blur'
      }),
      emailAddress: new FormControl('', {validators: Validators.compose([
        Validators.required,
        Validators.pattern(this.emailRX)
        ]),
        updateOn: 'blur'
      }),
      inquiryType: new FormControl('', {validators: Validators.required, updateOn: 'blur'}),
      messageTextBox: new FormControl('', {validators: Validators.compose([
        Validators.required,
        Validators.maxLength(265)
      ]),
        updateOn: 'blur'
      }),
      sendEmailToSelf: new FormControl()
    });
  }


  submit() {
    // if (this.contact_form_validations.valid) {
    //   let formValues = { 'first_name': '', 'last_name': '', 'emailAddress': '', 'inquiryType': '', 'messageTextBox': '', 'sendEmailToSelf': '' };
    //   for (const field in this.contact_form_validations.controls) {
    //     if (field === 'inquiryType') {
    //       formValues[field] = this.inquiryTypeOptions[this.contact_form_validations.controls[field].value];
    //       continue;
    //     }
    //     console.log(this.contact_form_validations.controls[field].value);
    //     formValues[field] = this.contact_form_validations.controls[field].value;
    //   }
    //   console.log(formValues);

    //   this.formService.sendInquiryForm(formValues).subscribe(
    //     success => {
    //       console.log('Form submitted to the server!');
    //     }
    //   );
    //   this.contact_form_validations.reset();
    //   for (let name in this.contact_form_validations.controls) {
    //     this.contact_form_validations.controls[name].setErrors(null);
    //  }
    //  this.formSent = true;
    // }
  }

}
