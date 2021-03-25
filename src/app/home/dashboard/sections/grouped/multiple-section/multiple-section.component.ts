import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-multiple-section',
  templateUrl: './multiple-section.component.html'
})
export class MultipleSectionComponent implements OnInit, OnChanges {
  @Input() inputAnswers: any;
  @Input() chartTheme: any;

  selectedQuestion;
  visualization = 'pie';
  legend = true;

  noQuestions = false;

  constructor() {
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
    
    if (type == "bar") {
      this.legend = false;
      await this.delay(300);
      this.visualization = type;
    } else {
      this.visualization = type;
      await this.delay(300);
      this.legend = true;
    }
    
    

   

    
  }

  //delay method
  delay(time: any) {
    return new Promise(resolve => setTimeout(resolve, time));
  }
}
