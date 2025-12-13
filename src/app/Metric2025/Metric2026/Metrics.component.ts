import { Component, OnInit } from '@angular/core';
import { XlsApi } from 'src/app/api/xl-api';

@Component({
  selector: 'app-Metrics',
  templateUrl: './Metrics.component.html',
  styleUrls: ['./Metrics.component.scss'],
})
export class MetricsComponent implements OnInit {

  selectedYear: string = 'CY-2025';
  yearOptions: string[] = ['CY-2025', 'CY-2026'];
  datas: any;

  constructor(private xls: XlsApi) {}

  ngOnInit(): void {

    const storedYear = sessionStorage.getItem('selectedYear');
    if (storedYear) this.selectedYear = storedYear;

    this.loadData();
  }

  onYearChange() {
    sessionStorage.setItem('selectedYear', this.selectedYear);
    this.loadData();
  }

  // Convert Excel serial number OR return text/dates as-is
  parseDate(value: any) {
    if (!value) return '';

    if (!isNaN(value)) {
      const utcDays = Math.floor(value - 25569);
      const date = new Date(utcDays * 86400 * 1000);
      return date;
    }

    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? value : parsed;
  }

  // Final formatter used in HTML
  formatValue(val: any): any {
  if (val instanceof Date) {
    
    const day = val.getDate().toString().padStart(2, "0");

    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const month = monthNames[val.getMonth()];

    const year = val.getFullYear().toString().slice(-2);

    return `${day}-${month}-${year}`;
  }

  return val || '';
}


  loadData() {
    this.xls.getDataFromXl3(3, 13).then((data) => {
      this.datas = data.map((row: any) => ({
        ...row,
        value2: this.parseDate(row.value2),
        value3: this.parseDate(row.value3),
        value4: this.parseDate(row.value4),
        value5: this.parseDate(row.value5),
        value7: this.parseDate(row.value7),
      }));
    });
  }
}
