import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, Color } from 'ng2-charts';

@Component({
  selector: 'app-multiple-choice-chart',
  templateUrl: './multiple-choice-chart.component.html'
})
export class MultipleChoiceChartComponent implements OnInit, OnChanges {
  @Input() selectedQuestion:any;
  @Input() visualization:any;
  @Input() chartTheme:any;
  @Input() legend:any;
  
  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  };

  public pieChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true
  };

  
  public chartOptions: ChartOptions = this.pieChartOptions;
  public chartLabels: Label[] = [];
  public chartData: SingleDataSet = [];
  public chartType: ChartType = 'pie';
  public chartLegend = true;
  public chartPlugins = [];

  
  noData = false;

  totalAnswers=0;
  totalValue=0;
  averageValue="";
  evaluated = false;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.totalAnswers=0;
    this.totalValue=0;
    this.chartLegend = this.legend;
    this.chartType = this.visualization;
    this.averageValue="";
    this.evaluated = false;

    if (this.visualization == "bar") {
      this.chartOptions = this.barChartOptions;
    } else {
      this.chartOptions = this.pieChartOptions;
    }

    this.updateChart();
  }


  updateChart() {
    this.totalAnswers = 0;
    this.totalValue = 0;
    this.averageValue = "";
    this.evaluated = false;
    this.chartLabels = [];
    this.chartData = [];

    var lowest = Number.POSITIVE_INFINITY;
    var highest = Number.NEGATIVE_INFINITY;
    var tmp;

    for (var i = 0; i < this.selectedQuestion.answers.length; i++) {

      tmp = this.selectedQuestion.answers[i].value;
      if (tmp < lowest) lowest = tmp;
      if (tmp > highest) highest = tmp;
      this.totalValue+=(this.selectedQuestion.answers[i].value*this.selectedQuestion.answers[i].totalAnswers);
      if(this.selectedQuestion.type=="star"){
        this.chartLabels.push(this.selectedQuestion.answers[i].value);
      } else {

        var textToAdd = this.selectedQuestion.answers[i].text;
        if(this.selectedQuestion.answers[i].text.length>30){
          textToAdd=this.selectedQuestion.answers[i].text.substring(0, 29)+"...";
        }

        if(this.selectedQuestion.answers[i].value!=0){
          this.chartLabels.push(this.selectedQuestion.answers[i].value + " - "+textToAdd );
        } else {
          this.chartLabels.push(textToAdd);
        };
      }
      this.chartData.push(this.selectedQuestion.answers[i].totalAnswers);
      this.totalAnswers+=this.selectedQuestion.answers[i].totalAnswers;
    }

    if(highest != lowest){
      this.evaluated = true;
      this.averageValue = (this.totalValue/this.totalAnswers).toFixed(2);
    }

    if(this.totalAnswers == 0){
      console.log("no data")
      this.noData = true;
    } else {
      this.noData = false;
    }
  }
}
