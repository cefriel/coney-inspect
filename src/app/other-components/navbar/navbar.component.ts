import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Input() title: string = "Coney Inspect";
  
  enterprise: any;

  constructor() { }

  ngOnInit(): void {
    this.enterprise = environment.enterprise;
  }

  navigateToHome() {
    if(environment.enterprise){
      var url = environment.baseUrl + "/home";
      window.location.href = url;
    } else{
      //do nothing
    }
  }
}
