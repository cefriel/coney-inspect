import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-generic-data-chart',
  templateUrl: './generic-data-chart.component.html',
  styleUrls: ['./generic-data-chart.component.css']
})
export class GenericDataChartComponent implements OnInit {

  @Input() data: {total: number, unfinished: number};

  totalParticipants = 0;
  totalFinish = 0;

  constructor() { }

  ngOnInit() {

    this.totalParticipants = this.data.total-1;
    this.totalFinish = this.totalParticipants - this.data.unfinished;
  }

}
