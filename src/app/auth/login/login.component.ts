import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from 'src/app/core/services/user/user.service';
import Swal from 'sweetalert2';

declare const gapi: any;

import { Constants } from '../../Constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  //pantalla de carga
  loading: boolean = true;

  public formSubmit = false;
  public auth2: any;

  public loginImage = 1;

  public loginForm = this.fb.group({
    email: [
      localStorage.getItem('email') || '',
      [
        Validators.required,
        Validators.email,
        Validators.pattern(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
      ],
    ],
    password: ['', [Validators.required]],
    remember: [false],
  });

  Constants: any = Constants;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.loadImage();
    setTimeout(() => {
      this.loading = false;
     }, 1000);
    // this.renderButton();
  }

  login() {
    // console.log( this.loginForm.value  );
    this.userService.login(this.loginForm.value).subscribe(
      (res) => {
        if (this.loginForm.get('remember').value) {
          localStorage.setItem('email', this.loginForm.get('email').value);
        } else {
          localStorage.removeItem('email');
        }
        localStorage.setItem('uid', res.user.uid);
        localStorage.setItem('language', res.user.language);
        localStorage.setItem('countryShort', res.user.country);
        localStorage.setItem('case', String(1));
        this.router.navigateByUrl('/dashboard');
      },
      (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      }
    );
  }

  // renderButton() {
  //   gapi.signin2.render('my-signin2', {
  //     scope: 'profile email',
  //     width: 240,
  //     height: 50,
  //     longtitle: true,
  //     theme: 'dark',
  //   });
  //   this.startApp();
  // }

  async startApp() {
    // await this.userService.googleInit();
    this.auth2 = this.userService.auth2;
    this.attachSignin(document.getElementById('my-signin2'));
  }

  attachSignin(element) {
    this.auth2.attachClickHandler(
      element,
      {},
      (googleUser) => {
        const id_token = googleUser.getAuthResponse().id_token;
        // console.log( id_token );
        this.userService.loginGoogle(id_token).subscribe((resp) => {
          this.ngZone.run(() => {
            this.router.navigateByUrl('/dashboard');
          });
        });
      },
      (error) => {
        alert(JSON.stringify(error, undefined, 2));
      }
    );
  }

  register() {
    this.router.navigateByUrl('/register');
  }

  async loadImage() {
    this.loginImage = (await Math.floor(Math.random() * (3 - 1 + 1))) + 1;
    console.log('img', this.loginImage);
  }
}
