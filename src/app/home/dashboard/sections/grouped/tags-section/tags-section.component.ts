import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';

@Component({
  selector: 'app-tags-section',
  templateUrl: './tags-section.component.html'
})
export class TagsSectionComponent implements OnInit {
  @Input() inputAnswers: any;
  @Input() chartTheme: any;

  noData = false;
  noQuestions = false;

  totalAnswers=0;
  totalValue = 0;
  averageValue = "";

  scaleCorrect = true;
  tags = [];

  selectedTag;
  visualization = 'line';

  public chartOptions: ChartOptions = {
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
  public chartLabels: Label[] = [];
  public chartData: SingleDataSet = [];
  public chartType: ChartType = 'line';
  public chartLegend = false;
  public chartPlugins = [];
  

  constructor() {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend(); }

  ngOnInit(): void {
    console.log(this.inputAnswers)
  }

  ngOnChanges(): void {
    this.totalAnswers=0;
    this.totalValue = 0;
    this.averageValue = "";
    if(this.inputAnswers.length == 0){
      this.noQuestions = true;
      return;
    }
    this.noQuestions = false;
    this.selectedTag = this.inputAnswers[0];
    this.updateChart();
  }

  updateChart() {
    this.totalAnswers = 0;
    this.totalValue = 0;
    this.averageValue = "";
    this.chartLabels = [];
    this.chartData = [];
    this.selectedTag.answers.sort(function (a, b) { return a.value - b.value });

    for (var i = 0; i < this.selectedTag.answers.length; i++) {
      this.chartLabels.push(this.selectedTag.answers[i].value);
      this.chartData.push(this.selectedTag.answers[i].totalAnswers);
      this.totalAnswers+=this.selectedTag.answers[i].totalAnswers;
      this.totalValue+=(this.selectedTag.answers[i].value*this.selectedTag.answers[i].totalAnswers);
    }

    this.averageValue = (this.totalValue/this.totalAnswers).toFixed(2);
    
    if(this.totalAnswers == 0){
      console.log("no data")
      this.noData = true;
    } else {
      console.log(this.chartType);
      this.noData = false;
    }
    this.checkScale();
  }

  checkScale(){
    var min = 0; var max = 0;
    this.scaleCorrect = true;
    if( this.selectedTag.questions[0]!=undefined){
      min = this.selectedTag.questions[0].min;
      max = this.selectedTag.questions[0].max;
    }

    for (var i = 0; i < this.selectedTag.questions.length; i++) {
      if(this.selectedTag.questions[i].min != min || this.selectedTag.questions[i].max != max){
        this.scaleCorrect = false;
      }
    }
  }


  async changeVisualization(type: any) {

    this.visualization = type;
    this.chartType = type;
  }
}
