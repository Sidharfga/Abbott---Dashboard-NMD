import { Component, OnInit, OnDestroy } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { XlsApi } from '../../../api/xl-api';

@Component({
  selector: 'app-resource-skill-level',
  templateUrl: './resource-skill-level.component.html',
  styleUrls: ['./resource-skill-level.component.scss'],
})
export class ResourceSkillLevelComponent implements OnInit, OnDestroy {

  private chart4: am4charts.XYChart | null = null;

  month = "Q1-26";
  showChart = true;
  showTable = false;
  trainingTable: any[] = [];
  allMonths: any[] = [];
  upskilling = "";
  healthIndicator: any;

  constructor(private xls: XlsApi) {}

  ngOnInit(): void {
    this.loadMonths();
    setTimeout(() => this.loadMap(), 50);
  }

  ngOnDestroy(): void {
    if (this.chart4) this.chart4.dispose();
  }

  loadMonths() {
    this.xls.getDataFromXl(3, 11).then((data) => {
      this.healthIndicator = data;

      this.allMonths = data
        .map((d: any) => ({ Month: d.key }))
        .filter((item: any, index: number, arr: any[]) =>
          arr.findIndex(t => t.Month === item.Month) === index
        );
    });
  }

  async loadMap() {

    if (this.chart4) {
      this.chart4.dispose();
      this.chart4 = null;
    }

    const selectedMonth = this.month.trim();
    const [quarter, year] = selectedMonth.split("-");
    const qNum = Number(quarter.replace("Q", ""));
    const yNum = Number(year);

    const cutoffQuarter = 3;
    const cutoffYear = 25;

    this.upskilling = selectedMonth === "Q1-26"
      ? "Upskilling Plans"
      : "Skills Upgraded";

    if (
  yNum > cutoffYear ||
  (yNum === cutoffYear && qNum >= cutoffQuarter)
) {


      this.showTable = true;
      this.showChart = false;

      const normalize = (val: string) => val?.replace(/–/g, "-").trim();
      const tableData = await this.xls.getDataFromXl(3, 14);

      const filtered = tableData.filter((item: any) =>
        normalize(item.key) === normalize(selectedMonth) ||
        normalize(item.value1) === normalize(selectedMonth)
      );

      this.trainingTable = filtered.map((row: any) => ({
        Training: row.value1,
        Planned: row.value2,
        Completed: row.value3 === "-" || row.value3 === "" ? "-" : row.value3,
      }));

      return;
    }

    this.showChart = true;
    this.showTable = false;

    const chartSource = await this.xls.getDataFromXl(3, 6);
    const filteredData = chartSource.filter((x: any) => x.value4 === selectedMonth);

    setTimeout(() => {
      am4core.useTheme(am4themes_animated);

      this.chart4 = am4core.create("chartdiv4", am4charts.XYChart);
      this.chart4.logo.disabled = true;

      this.chart4.data = filteredData.map((x: any) => ({
        range: x.value1,
        count: x.value3
      }));

      let categoryAxis = this.chart4.yAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "range";

      let valueAxis = this.chart4.xAxes.push(new am4charts.ValueAxis());

      let series = this.chart4.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueX = "count";
      series.dataFields.categoryY = "range";
      series.columns.template.fill = am4core.color("#159BD7");

      // ⭐ Added tooltip on hover
      series.tooltipText = "{range}: {count}";
      this.chart4.cursor = new am4charts.XYCursor();
      

      let bullet = series.bullets.push(new am4charts.LabelBullet());
      bullet.label.text = "{valueX}";
      bullet.label.dx = -30;

    }, 100);
  }

  changeGraph() {
    this.loadMap();
  }
}
