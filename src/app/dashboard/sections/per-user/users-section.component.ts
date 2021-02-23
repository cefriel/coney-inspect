import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-users-section',
  templateUrl: './users-section.component.html',
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
      'fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('100ms ease-out', style({ opacity: 0 }))
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
export class UsersSectionComponent implements OnInit, OnChanges {
  @Input() inputAnswers: any;

  selectedUser;

  constructor() { }

  ngOnInit(): void {
  }
  
  ngOnChanges(): void {
    this.selectedUser = this.inputAnswers[0];
    console.log(this.selectedUser);
    this.formatTime();
    this.selectedUser.answers.sort((a, b) => (a.time > b.time) ? 1 : -1);
  }

  updateData(){
    this.formatTime();
    this.selectedUser.answers.sort((a, b) => (a.time > b.time) ? 1 : -1);
  }

  formatTime(){
    var tempTime = this.selectedUser.duration;
    var returnTime = "";
    var timeArr = tempTime.split(":");
    console.log(timeArr);
    if(timeArr[0].length<2){
      returnTime = "0"+timeArr[0];
    } else {
      returnTime = timeArr[0];
    }

    if(timeArr[1].length<2){
      returnTime += ":0"+timeArr[1];
    } else {
      returnTime += ":"+timeArr[1];
    }

    if(timeArr[2].length<2){
      returnTime += ":0"+timeArr[2];
    } else {
      returnTime += ":"+timeArr[2];
    }

    this.selectedUser.duration = returnTime;
  }
}
