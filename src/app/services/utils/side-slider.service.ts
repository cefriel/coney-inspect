import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SideSliderService implements OnInit {

  private showSlider$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  ngOnInit() {
  }

  //exposes the showSlider$ as an Observable
  getShowSlider(){
    return this.showSlider$.asObservable();
  }

  //sets the showSlider$ 
  setShowSlider(showHide: boolean) {
    this.showSlider$.next(showHide);
  }

  //toggles the value
  toggleSliderState() {
    this.showSlider$.next(!this.showSlider$.value);
  }

  //t/f based on the state
  isSliderOpen() {
    return this.showSlider$.value;
  }
}