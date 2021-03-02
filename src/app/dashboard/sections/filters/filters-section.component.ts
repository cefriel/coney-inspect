import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-filters-section',
  templateUrl: './filters-section.component.html',
  animations: [
    trigger(
      'filtersAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 1 }),
        animate('250ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0)', opacity: 1 }),
        animate('50ms ease-out', style({ opacity: 0 }))
      ])
    ]
    )]
})
export class LanguageSectionComponent implements OnInit, OnChanges {
  @Output() filterByLanguage = new EventEmitter<any>();
  @Input() inputAnswers: any;
  @Input() filtersCleared: any;
  @Input() meta1: any;
  @Input() meta2: any;

  selectedLanguage = "All languages";
  languages = [];
  pastFiltersCleared = false;
  showUnfinishedSelected = true;
  pastConvId = "";
  metadata: any = {};

  opened = true;

  constructor() { }

  ngOnInit(): void {
   
    this.languages = this.inputAnswers.languages;
    this.metadata.meta1 = this.meta1;
    this.metadata.meta2 = this.meta2;
  }

  ngOnChanges(): void {
    if(this.pastConvId == "" || this.pastConvId == null || this.pastConvId == undefined || this.pastConvId != sessionStorage.getItem("conv")){
      
        this.languages = this.inputAnswers.languages;
        this.metadata.meta1 = this.meta1;
        this.metadata.meta2 = this.meta2;
        this.pastConvId = sessionStorage.getItem("conv");
    }

    if(this.filtersCleared == !this.pastFiltersCleared){
      for(var i = 0; i<this.languages.length; i++){
        this.languages[i].checked = true;
        this.showUnfinishedSelected = true;
      }
      for(var j = 0; j<this.metadata.meta1.length; j++){
        this.metadata.meta1[j].checked = true;
      }
      for(var z = 0; z<this.metadata.meta2.length; z++){
        this.metadata.meta2[z].checked = true;
      }
      this.pastFiltersCleared = this.filtersCleared;
    }
  }



  filterSelected(){
    this.filterByLanguage.emit({
      languages: this.languages,
      meta1: this.meta1,
      meta2: this.meta2,
      unfinished: this.showUnfinishedSelected
    });
  }

  prepareFrame() {
    if(this.opened){
      this.closeFrame();
      return;
    }
    var button = document.getElementById("coney-open-f");
    var panel = document.getElementById("side-panel");
    panel.style.right = "400px";
    
    this.opened = true;
    
    //var filtersTab = document.getElementById("coney-filters");
    
}

closeFrame() {
  //var filtersTab = document.getElementById("coney-filters");
  //filtersTab.style.display = "none";

  var button = document.getElementById("coney-open-f");
  var panel = document.getElementById("side-panel");
  panel.style.right = "0px";
  this.opened = false;
  }
}
