import { Component, Input, OnChanges, OnInit } from '@angular/core';


@Component({
  selector: 'app-report-section',
  templateUrl: './report-section.component.html'
})
export class ReportSectionComponent implements OnInit, OnChanges {
  @Input() inputAnswers: any;

  constructor() { }

  ngOnInit(): void {
    console.log(this.inputAnswers)
  }

  ngOnChanges(): void {
      this.updateCharts();
  }

  updateCharts(){}
}
