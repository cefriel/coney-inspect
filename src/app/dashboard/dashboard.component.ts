import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataParseService } from 'src/app/services/utils/data-parse.service';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
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
    ),
    trigger(
      'usersAnimation', [
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
export class DashboardComponent implements OnInit {
  @Output() refreshData = new EventEmitter<any>();
  @Output() exportData = new EventEmitter<any>();
  @Output() changeSurvey = new EventEmitter<any>();
  @Input() rawAnswers: any;
  @Input() orderedQuestions: any;

  view = "charts";

  showCharts = false;
  noData = false;
  noSurvey = false;
  displayClearFilterButton = false;
  filtersCleared = false;

  displayingUnfinished = true;

  parsedAnswers: any;
  chartTheme: any[] = [ //chartBackground
    {
      backgroundColor: ["#012060", "#572471", "#942575", "#c92f6c", "#f04d59", "#ff7940", "#ffaa20", "#ffdc05"]
    }];

  constructor(private dataParse: DataParseService) { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.parseData(undefined);
  }


  filterByLanguage(filters:any){
    
    var langIndex = filters.languages.findIndex(x => x.checked == false);
    console.log("langIndex: "+langIndex)
    if(langIndex!=-1 || !filters.unfinished){
      //filters applied
      this.displayClearFilterButton = true;
    } else {
      this.displayClearFilterButton = false;
    }
    this.parseData(filters);
  }

  clearLanguageFilter(){
    this.displayClearFilterButton = false;
    this.filtersCleared = !this.filtersCleared;
    this.parseData(undefined);
  }

  parseData(filter:any){
   
    this.noData = false;
    if (this.rawAnswers.length != 0) {
      console.log("Parsing data");
      this.parsedAnswers = this.dataParse.initialDataParse(this.rawAnswers, this.orderedQuestions, filter);
      console.log(this.parsedAnswers);
      if (this.parsedAnswers.generic.totSessions == 0) {
        this.showCharts = false;
        this.noData = true;
        this.noSurvey = false;
      } else {
        this.noSurvey = false;
        //this.filtersCleared = !this.filtersCleared;
        this.showCharts = true;
        this.noData = false;
      }

    } else {
      this.showCharts = false;
      this.noData = true;
      this.noSurvey = false;
      if(sessionStorage.getItem("conv") == null){
        this.noSurvey = true;
      } 
    }
  }

  refresh() {
    this.refreshData.emit();
  }

  export() {
    this.exportData.emit();
  }

  changeView(view: string) {
    this.view = view;
  }

  backToSearch() {
    this.changeSurvey.emit();
  }

}
