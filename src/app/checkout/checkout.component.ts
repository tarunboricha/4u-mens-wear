import { Component, OnInit } from '@angular/core';
import { ProductSerService } from '../services/product-ser.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  totalPrice:number|undefined;
  constructor(private product:ProductSerService, private router:Router){}
  ngOnInit(): void {
    if (localStorage.getItem('user')) {
      this.product.cartData.subscribe((result) => {
        if (result.length) {
          let price = 0;
          if (result.length) {
            result.forEach((item) => {
              if (item.productQuantity) {
                price = price + (+item.productPrice * +item.productQuantity)
              }
            })
            this.totalPrice = price + 100;
          }
        }
      });
    }
    else{
      this.router.navigate(['']);
    }
  }
}
