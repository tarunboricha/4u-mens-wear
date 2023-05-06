import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {Login, signUp } from '../data-type';

@Injectable({
  providedIn: 'root'
})
export class UserSerService {

  UserLoginFailed = new EventEmitter<boolean>(false);
  constructor(private htttp: HttpClient, private router: Router) { }
  userSignupservice(data: signUp) {
    if (data.name != '' && data.email != '' && data.password != '') {
      this.htttp.post('http://localhost:3000/user',
        data, { observe: 'response' }).subscribe((result) => {
          this.router.navigate(['']);
        });
    }
  }
  UserLoginservice(data: Login) {
    this.htttp.get(`http://localhost:3000/user?email=${data.email}&password=${data.password}`,
      { observe: 'response' }).subscribe((result: any) => {
        if (result && result.body && result.body.length) {
          localStorage.setItem('user', JSON.stringify(result.body));
          this.router.navigate(['']);
        }
        else{
          this.UserLoginFailed.emit(true);
        }
      });
  }
}
