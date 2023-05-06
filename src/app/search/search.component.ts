import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductSerService } from '../services/product-ser.service';
import { product } from '../data-type';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @HostListener('document:click', ['$event']) onDocumentClick(event: any) {
    event.stopPropagation();
    this.showSortBy = false;
  }
  isDetailsLoad: boolean = false;
  sortBy: string = 'default';
  isSort: boolean | undefined;
  showSortBy: boolean = false;
  searchProductData: undefined | product[];
  constructor(private router: ActivatedRoute, private product: ProductSerService) { }
  ngOnInit(): void {
    this.loadDetails();
  }
  loadDetails() {
    if (!this.isDetailsLoad) {
      let Query = this.router.snapshot.paramMap.get('query');
      Query && this.product.searchProductService(Query).subscribe((result) => {
        this.searchProductData = result;
      });
      this.isDetailsLoad = true;
    }
    if (this.sortBy == 'price') {
      if (this.isSort) {
        if (this.searchProductData)
          this.searchProductData.sort((a, b) => a.productPrice - b.productPrice);
      }
      else {
        if (this.searchProductData)
          this.searchProductData.sort((a, b) => b.productPrice - a.productPrice);
      }
    }
    else {
      if (this.isSort) {
        if (this.searchProductData)
          this.searchProductData.sort((a, b) => (a.productName > b.productName) ? 1 : ((b.productName > a.productName) ? -1 : 0));
      }
      else {
        if (this.searchProductData)
          this.searchProductData.sort((a, b) => (a.productName < b.productName) ? 1 : ((b.productName < a.productName) ? -1 : 0));
      }
    }
  }
  flipSortBy() {
    if (this.showSortBy)
      this.showSortBy = false;
    else
      this.showSortBy = true;
  }
  sortFunc(data: string, check: boolean) {
    this.sortBy = data;
    this.isSort = check;
    this.loadDetails();
  }
}