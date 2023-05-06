import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { addToCart, product } from '../data-type';
@Injectable({
  providedIn: 'root'
})
export class ProductSerService {

  cartData = new EventEmitter<product[] | []>();
  addProductMessage: string = '';
  constructor(private http: HttpClient) { }
  AddProductservice(data: product) {
    return this.http.post('http://localhost:3000/products', data, { observe: 'response' });
  }

  productListservice() {
    return this.http.get<product[]>('http://localhost:3000/products');
  }

  deleteProductservice(data: number) {
    return this.http.delete(`http://localhost:3000/products/${data}`);
  }

  getProductservice(data: string) {
    return this.http.get<product>(`http://localhost:3000/products/${data}`);
  }

  updateProductservice(data: product) {
    return this.http.put<product>(`http://localhost:3000/products/${data.id}`, data);
  }

  popularProductservice() {
    return this.http.get<product[]>('http://localhost:3000/products?_limit=3');
  }

  trendingProductservice() {
    return this.http.get<product[]>('http://localhost:3000/products?_limit=8');
  }

  searchSuggestionservice(data: string) {
    return this.http.get<product[]>(`http://localhost:3000/products?q=${data}`);
  }

  searchProductService(data: string) {
    return this.http.get<product[]>(`http://localhost:3000/products?q=${data}`);
  }

  FilterProductService(data: string) {
    return this.http.get<product[]>(`http://localhost:3000/products?productType=${data}`);
  }

  localAddtoCartservice(data: product) {
    let cartData = [];
    let localData = localStorage.getItem('LocaladdToCart');
    if (!localData) {
      localStorage.setItem('LocaladdToCart', JSON.stringify([data]));
      this.cartData.emit([data]);
    }
    else {
      cartData = JSON.parse(localData);
      cartData.push(data);
      localStorage.setItem('LocaladdToCart', JSON.stringify(cartData));
      this.cartData.emit(cartData);
    }
  }

  UseraddTocart(data: addToCart) {
    return this.http.post('http://localhost:3000/Cart', data);
  }

  removeTocart(data: number) {
    if (localStorage.getItem('user')) {
      this.http.delete('http://localhost:3000/Cart/' + data).subscribe((result) => {
        if (result) {
          let user = localStorage.getItem('user');
          let userID = user && JSON.parse(user)[0].id;
          this.getCartlist(userID);
        }
      });
    }
    else {
      let localData = localStorage.getItem('LocaladdToCart');
      let itemsData: product[] = localData && JSON.parse(localData);
      itemsData = itemsData.filter((item: product) => data !== item.id);
      if (itemsData.length) {
        localStorage.setItem('LocaladdToCart', JSON.stringify(itemsData));
        this.cartData.emit(itemsData);
      }
      else{
        localStorage.removeItem('LocaladdToCart');
        this.cartData.emit([]);
      }
    }
  }

  getCartlist(data: number) {
    return this.http.get<product[]>(`http://localhost:3000/Cart?userID=${data}`,
      { observe: 'response' }).subscribe((result) => {
        if (result && result.body) {
          this.cartData.emit(result.body);
        }
      });
  }
}
