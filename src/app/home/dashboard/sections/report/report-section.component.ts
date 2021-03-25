import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-report-section',
  templateUrl: './report-section.component.html',
  animations: [
    trigger(
      'chartsAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 1 }),
        animate('250ms ease-in', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0)', opacity: 1 }),
        animate('100ms ease-out', style({ transform: 'translateY(-30%)', opacity: 0 }))
      ])
    ]
    )
  ],
})
export class ReportSectionComponent implements OnInit, OnChanges {
  @Input() inputAnswers: any;
  @Input() chartTheme: any;

  constructor() { }

  ngOnInit(): void {
    console.log(this.inputAnswers)
  }

  ngOnChanges(): void {
      this.updateCharts();
  }

  updateCharts(){}
}
