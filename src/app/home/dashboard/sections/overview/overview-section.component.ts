import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, Color } from 'ng2-charts';
import { IntroSectionService } from 'src/app/services/utils/intro-section.service';

@Component({
  selector: 'app-overview-section',
  templateUrl: './overview-section.component.html'
})
export class IntroSectionComponent implements OnInit, OnChanges {
  @Input() inputAnswers: any;
  @Input() chartTheme: any;

  durationParsedData: any = {};
  durationUnits = "seconds";

  public chartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    },
    elements: 
    { 
        point: 
        {
            radius: 0
        }
    }
  };

  public chartLegend = false;
  public chartType: ChartType = "line";
  public chartPlugins = [];

  public durationChartData: ChartDataSets[] = [
    { data: [], label: '' },
  ];
  public durationChartLabels: Label[] = [];
  public chartColors: Color[] = [
    {
      borderColor: '#495568',
      backgroundColor: '#495568',
    },
  ];


  public timesChartLabels: Label[] = [];
  public timesChartData: SingleDataSet = [];

  public datesChartLabels: Label[] = [];
  public datesChartData: SingleDataSet = [];
  public datesChartPlugins = [];

  durationDataEmpty = false;

  constructor(private introService: IntroSectionService) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit(): void {
   
  }

  ngOnChanges(): void {
    this.parseData();
  }


  parseData() {
    var durationData = this.introService.parseDuration(this.inputAnswers.durations);
    var timesData = this.introService.parseTimes(this.inputAnswers.times);
    var datesData = this.introService.parseDates(this.inputAnswers.dates);


    //duration chart
    if (durationData.durationChartData.length != 0) {
      this.durationDataEmpty = false;
      this.durationChartData = durationData.durationChartData;
      this.durationChartLabels = durationData.durationChartLabels;
      this.durationUnits = durationData.measure;
    } else {
      this.durationDataEmpty = true;
    }


    //dates chart
      this.datesChartData = datesData.datesChartData;
      this.datesChartLabels = datesData.datesChartLabels;


   

    //times chart
      this.timesChartData = timesData.timesChartData;
      this.timesChartLabels = timesData.timesChartLabels;


    
  }


}
