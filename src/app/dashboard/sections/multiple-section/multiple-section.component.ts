import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';

@Component({
  selector: 'app-multiple-section',
  templateUrl: './multiple-section.component.html'
})
export class MultipleSectionComponent implements OnInit, OnChanges {
  @Input() inputAnswers: any;
  @Input() chartTheme: any;

  selectedQuestion;
  visualization = 'pie';

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
  noQuestions = false;

  totalAnswers=0;
  totalValue=0;
  averageValue="";
  evaluated = false;

  constructor() {

    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }


  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.totalAnswers=0;
    this.totalValue=0;
    this.averageValue="";
    this.evaluated = false;
    console.log(this.inputAnswers);
    if(this.inputAnswers.length == 0){
      this.noQuestions = true;
      return;
    }
    this.noQuestions = false;
    this.selectedQuestion = this.inputAnswers[0];
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
        if(this.selectedQuestion.answers[i].value!=0){
          this.chartLabels.push(this.selectedQuestion.answers[i].value + " - "+this.selectedQuestion.answers[i].text );
        } else {
          this.chartLabels.push(this.selectedQuestion.answers[i].text );
        };
      }
      this.chartData.push(this.selectedQuestion.answers[i].totalAnswers);
      this.totalAnswers+=this.selectedQuestion.answers[i].totalAnswers;
    }

    if(highest != lowest){
      this.evaluated = true;
      console.log(this.totalValue);
      console.log(this.totalAnswers);
      this.averageValue = (this.totalValue/this.totalAnswers).toFixed(2);
    }

    if(this.totalAnswers == 0){
      console.log("no data")
      this.noData = true;
    } else {
      this.noData = false;
    }
  }

  async changeVisualization(type: any) {
    
    if (type == "bar") {
      this.chartLegend = false;
    } else {
      this.chartLegend = true;
    }
    
    await this.delay(300);

    this.visualization = type;
    this.chartType = type;

    if (type == "bar") {
      this.chartOptions = this.barChartOptions;
    } else {
      this.chartOptions = this.pieChartOptions;
    }
    
  }

  //delay method
  delay(time: any) {
    return new Promise(resolve => setTimeout(resolve, time));
  }
}
