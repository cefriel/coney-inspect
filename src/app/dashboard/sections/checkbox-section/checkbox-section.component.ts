import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';

@Component({
  selector: 'app-checkbox-section',
  templateUrl: './checkbox-section.component.html'
})
export class CheckboxSectionComponent implements OnInit, OnChanges {
  @Input() inputAnswers: any;
  @Input() chartTheme: any;

  selectedQuestion;
  visualization = 'bar';

  noData = false;
  noQuestions = false;

  public chartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ],
      xAxes: [
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
  public chartType: ChartType = 'bar';
  public chartLegend = false;
  public chartPlugins = [];

  totalAnswers=0;

  constructor() { 
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.totalAnswers=0;
    this.totalAnswers=0;
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
    this.chartLabels = [];
    this.chartData = [];
    for (var i = 0; i < this.selectedQuestion.answers.length; i++) {

      var textToAdd = this.selectedQuestion.answers[i].text;
      if(this.selectedQuestion.answers[i].text.length>30){
        textToAdd=this.selectedQuestion.answers[i].text.substring(0, 29)+"...";
      }

      this.chartLabels.push(textToAdd);
      this.chartData.push(this.selectedQuestion.answers[i].totalAnswers);
      this.totalAnswers+=this.selectedQuestion.answers[i].totalAnswers;
    }
    if(this.totalAnswers == 0){
      console.log("no data")
      this.noData = true;
    } else {
      this.noData = false;
    }
    
  }

  
  async changeVisualization(type: any) {
    this.visualization = type;
    this.chartType = type;
  }


}
