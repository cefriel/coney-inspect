import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { SideSliderService } from 'src/app/services/utils/side-slider.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-side-slider',
  templateUrl: './side-slider.component.html',
  styleUrls: ['./side-slider.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SideSliderComponent implements OnInit {

  showSideSlider: Observable<boolean>;

  @Input() duration: number = 0.25;
  @Input() sliderWidth: number = window.innerWidth;
  
  constructor(private sliderService: SideSliderService) {}

  ngOnInit(): void {
    this.showSideSlider = this.sliderService.getShowSlider();
  }

  onSidebarClose() {
    this.sliderService.setShowSlider(false);
  }

  getSideSliderBarStyle(showSlider: boolean) {
    let sliderBarStyle: any = {};
    
    sliderBarStyle.transition = 'right ' + this.duration + 's, visibility ' + this.duration + 's';
    sliderBarStyle.width = this.sliderWidth + 'px';
    sliderBarStyle['right'] = (showSlider ? 0 : (this.sliderWidth * -1)) + 'px';
    
    return sliderBarStyle;
  }
}