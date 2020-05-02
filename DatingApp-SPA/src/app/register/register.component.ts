import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { HttpUrlEncodingCodec } from '@angular/common/http';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { User } from '../_models/user';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  // 4.7.3 Dodati register()i cancel() ->register.html
  // model: any = {};
   // 12.10 Prepraviti register () ->auth.service
   user: User;
  // 4.8.1 Dodati input() ->register.html
  // @Input() valuesFromHome: any;
  // 4.9 Dodati output za Child parent vezu -home.html
  // 6.2.6 Dodati alertify ->auth.service
  @Output() cancelRegister = new EventEmitter();
  // 12.2 Dodati novi property za registerFormu ->app.module.ts
  registerForm: FormGroup;
  // 12.6 Dodati formBuilfer servis za kreiranje forme jer je jednostavnije
  // 12.8.3 Dodati kofiguraciju za datepicker ->register.component.html
  bsConfig: Partial<BsDatepickerConfig>;
  constructor(private authService: AuthService,
              private alertify: AlertifyService,
              private fb: FormBuilder,
              private router: Router) { }

  ngOnInit() {
    // 12.8.3
    this.bsConfig = {
      containerClass: 'theme-red'
    };
    // 12.6
    this.createRegisterForm();
    // 12.2 kreiranje form grupe
    // this.registerForm = new FormGroup({
      // 12.3 dodati validaciju
      // username: new FormControl('', Validators.required),
      // password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
      // confirmPassword: new FormControl('', Validators.required)
    // },
    // 12.4
    // this.passwordMatchValidator);
  }
  // 12.6
  // 12.7 Dodati nove propertije u form builder -> register.component.html
  createRegisterForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {validator: this.passwordMatchValidator});
  }

  // 12.4 poredjenje passworda ->register.component.html
  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value ? null : {mismatch: true};
  }
  // 4.10.1 Napraviti register metod
  register() {
    if (this.registerForm.valid) {
      this.user = Object.assign({}, this.registerForm.value);
      this.authService.register(this.user).subscribe(() => {
        this.alertify.success('Uspjena registracija');
      }, error => {
        this.alertify.error(error);
      }, () => {
        this.authService.login(this.user).subscribe(() => {
          this.router.navigate(['/members']);
        });
      });
    }
    /*this.authService.register(this.model).subscribe(() => {
      this.alertify.success('Uspjesna registracija');
    }, error => {
      this.alertify.error(error);
    });*/
    console.log(this.registerForm.value);
  }
  cancel() {
    this.cancelRegister.emit(false);
    this.alertify.message('Otkazano');
  }
}
