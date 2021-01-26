import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-language-section',
  templateUrl: './language-section.component.html'
})
export class LanguageSectionComponent implements OnInit, OnChanges {
  @Output() filterByLanguage = new EventEmitter<any>();
  @Input() inputAnswers: any;
  @Input() filtersCleared: any;

  selectedLanguage = "All languages";
  languages = [];
  pastFiltersCleared = false;
  showUnfinishedSelected = true;
  pastConvId = "";

  constructor() { }

  ngOnInit(): void {
    console.log(this.inputAnswers);
    this.languages = this.inputAnswers.languages;
  }

  ngOnChanges(): void {
    if(this.pastConvId == "" || this.pastConvId == null || this.pastConvId == undefined || this.pastConvId != sessionStorage.getItem("conv")){
      
        this.languages = this.inputAnswers.languages;
        this.pastConvId = sessionStorage.getItem("conv");
    }

    if(this.filtersCleared == !this.pastFiltersCleared){
      for(var i = 0; i<this.languages.length; i++){
        this.languages[i].checked = true;
        this.showUnfinishedSelected = true;
      }
      this.pastFiltersCleared = this.filtersCleared;
    }
  }

  languageSelected(){
    this.filterByLanguage.emit({
      languages: this.languages,
      unfinished: this.showUnfinishedSelected
    });
  }

}
