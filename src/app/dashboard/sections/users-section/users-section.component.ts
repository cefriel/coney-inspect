import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-users-section',
  templateUrl: './users-section.component.html'
})
export class UsersSectionComponent implements OnInit, OnChanges {
  @Input() inputAnswers: any;

  selectedUser;

  constructor() { }

  ngOnInit(): void {
    console.log(this.inputAnswers);
  }
  
  ngOnChanges(): void {
    this.selectedUser = this.inputAnswers[0];
    this.selectedUser.answers.sort((a, b) => (a.time > b.time) ? 1 : -1);
  }

  updateData(){
    this.selectedUser.answers.sort((a, b) => (a.time > b.time) ? 1 : -1);
  }
}
