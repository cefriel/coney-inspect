import { Component, OnInit } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/auth-services/authentication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username = ''
  password = ''
  invalidLogin = false
  isLogging = false;

  id = "";

  constructor(private router: Router, private route: ActivatedRoute,
    private loginservice: AuthenticationService) { }

  ngOnInit() {
    
    if (!environment.enterprise) {
      this.router.navigate([''], { queryParams: this.route.queryParams });
    }
  }

  checkLogin() {
    this.isLogging = true;
    this.invalidLogin = false;

    (this.loginservice.authenticate(this.username, this.password).subscribe(
      data => {
        this.isLogging = false;
        this.router.navigate([''], { queryParams: {
          s: "search"
        }});
        this.invalidLogin = false
      },
      error => {
        this.isLogging = false;
        this.invalidLogin = true

      }
    )
    );

  }
}
