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

  noQuestions = false;

  totalAnswers=0;

  constructor() { 
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if(this.inputAnswers.length == 0){
      this.noQuestions = true;
      return;
    }

    this.noQuestions = false;
    this.selectedQuestion = this.inputAnswers[0];
  }
  
  async changeVisualization(type: any) {
    this.visualization = type;
  }


}
