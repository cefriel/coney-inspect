import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() title: string = "Coney Inspect";
  @Input() status: string = "";
  @Input() projectName: string = "";
  @Input() conversationAccessLevel: any = "3";
  
  enterprise: any;

  constructor() {}

  ngOnInit(): void {
    this.enterprise = environment.enterprise;
  }

  ngOnChanges(): void {
    console.log(this.conversationAccessLevel);
  }

  navigateToHome() {
    if(environment.enterprise){

      if(this.conversationAccessLevel!=3){
        sessionStorage.removeItem("conv");
        sessionStorage.removeItem("title");
      }

      let url = environment.baseUrl + "/home";
      window.location.href = url;

    } else{
      //do nothing
    }
  }
}
