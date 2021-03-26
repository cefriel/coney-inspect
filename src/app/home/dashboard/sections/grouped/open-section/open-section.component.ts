import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-open-section',
  templateUrl: './open-section.component.html'
})
export class OpenSectionComponent implements OnInit, OnChanges {
  @Input() inputAnswers: any;

  totalAnswers = 0; 
  selectedQuestion;

  constructor() { }

  ngOnInit(): void {
    
  }

  ngOnChanges(): void {
    this.totalAnswers = 0; 
    this.selectedQuestion = this.inputAnswers[0];
    if(this.selectedQuestion!=undefined){
      this.updateChart();
    }
  }

  updateChart() {
    this.totalAnswers = 0;
    for (let i = 0; i < this.selectedQuestion.answers.length; i++) {
      this.totalAnswers += 1;
    }
  }
}
