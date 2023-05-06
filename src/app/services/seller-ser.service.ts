import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signUp, Login } from '../data-type';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SellerSerService {

  SellerLoginFailed = new EventEmitter<boolean>(false);
  checkSellerlogin = new BehaviorSubject<boolean>(false);
  constructor(private htttp: HttpClient, private router: Router) { }

  sellerReloadpage() {
    if (localStorage.getItem('seller')) {
      this.checkSellerlogin.next(true);
      this.router.navigate(['seller-homepage']);
    }
  }
  sellerLoginservice(data: Login) {
    this.htttp.get(`http://localhost:3000/seller?email=${data.email}&password=${data.password}`,
      { observe: 'response' }).subscribe((result: any) => {
        if (result && result.body && result.body.length) {
          this.checkSellerlogin.next(true);
          localStorage.setItem('seller', JSON.stringify(result.body));
          this.router.navigate(['seller-homepage']);
        }
        else {
          this.SellerLoginFailed.emit(true);
        }
      });
  }
}
