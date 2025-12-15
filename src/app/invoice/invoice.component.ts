import { Component, OnInit } from '@angular/core';
import { XlsApi } from '../api/xl-api';
import * as xls from 'xlsx';
@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent implements OnInit {
  healthIndicator: any;
  month: any;
  allMonths: any;
  allObjects: any;
  results: any = [];
  groups: any;
  item: any;
  datas: any;
  selectedOptions: string = 'Q4-25';


 quarters = [
  'Q1-23','Q2-23','Q3-23','Q4-23',
  'Q1-24','Q2-24','Q3-24','Q4-24',
  'Q1-25','Q2-25','Q3-25','Q4-25'
];


  constructor(private xls: XlsApi) {}

  ngOnInit(): void {
    this.month = sessionStorage.getItem('selectedMonth');
    this.loadData();
  }
  

  loadData() {
    this.xls.getDataFromXl3(3, 3).then((data) => {
      this. datas = data;
      console.log(this.datas);    
      
    });
  }
}