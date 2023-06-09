import { Component, OnInit } from '@angular/core';
import { ProductSerService } from '../services/product-ser.service';
import { ActivatedRoute } from '@angular/router';
import { addToCart, product } from '../data-type';

@Component({
  selector: 'app-details-of-product',
  templateUrl: './details-of-product.component.html',
  styleUrls: ['./details-of-product.component.css']
})
export class DetailsOfProductComponent implements OnInit {

  Selectsize:string = 'Select Size';
  productSize:number|undefined;
  removeCard: boolean = false;
  productQuantity: number = 1;
  detailsOfproduct: undefined | product;
  cartDetails: product | undefined;
  constructor(private product: ProductSerService, private route: ActivatedRoute) { }
  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('Productid');
    id && this.product.getProductservice(id).subscribe((result) => {
      this.detailsOfproduct = result;
    });
    if (localStorage.getItem('user')) {
      this.product.cartData.subscribe((result) => {
        if (result) {
          result = result.filter((item: product) => id == item.productID?.toString());
          if (result.length) {
            this.cartDetails = result[0];
            this.removeCard = true;
            if (result[0].productQuantity)
              this.productQuantity = result[0].productQuantity;
            if(result[0].productSize)
              this.Selectsize = 'Size: ' + result[0].productSize.toString();
          }
        }
      });
    }
    else {
      let cartData = localStorage.getItem('LocaladdToCart');
      if (id && cartData?.length) {
        let itemData = JSON.parse(cartData);
        itemData = itemData.filter((item: product) => id == item.id.toString());
        if (itemData.length != 0) {
          this.removeCard = true;
          this.productQuantity = itemData[0].productQuantity;
          this.Selectsize = itemData[0].productSize;
        }
        else {
          this.removeCard = false;
        }
      }
    }
  }
  size(data:number){
    this.productSize = data;
    this.Selectsize = 'Size: '+ data.toString();
  }
  AddtoCartProduct() {
    if (this.detailsOfproduct) {
      this.detailsOfproduct.productQuantity = this.productQuantity;
      let userData = localStorage.getItem('user');
      if (userData) {
        let userID = JSON.parse(userData)[0].id;
        let Cartdata: addToCart = {
          ...this.detailsOfproduct,
          userID,
          productID: this.detailsOfproduct.id,
          productSize: this.productSize
        }
        delete Cartdata.id;
        this.product.UseraddTocart(Cartdata).subscribe((result) => {
          if (result) {
            this.product.getCartlist(userID);
            this.removeCard = true;
          }
        });
      }
      else {
        this.detailsOfproduct.productSize = this.productSize;
        this.product.localAddtoCartservice(this.detailsOfproduct);
        this.removeCard = true;
      }
    }
  }
  RemovetoCartProduct(data: number) {
    if (!localStorage.getItem('user')) {
      this.product.removeTocart(data);
    }
    else {
      this.cartDetails && this.product.removeTocart(this.cartDetails.id);
    }
    this.removeCard = false;
    this.productQuantity = 1;
    this.Selectsize = 'Select Size';
  }

  handleQuantity(data: string) {
    if (data == 'plus' && this.productQuantity < 20)
      this.productQuantity++;
    else if (data == 'min' && this.productQuantity > 1)
      this.productQuantity--;
  }
}
