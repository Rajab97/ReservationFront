import { Component, OnInit } from '@angular/core';
import {JwtHelperService} from "@auth0/angular-jwt";
import { from } from 'rxjs';
import { AuthService } from './_service/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  
  jwtHelper = new JwtHelperService();
  /**
   *
   */
  constructor(private _authService:AuthService) {
    
  }
  ngOnInit(): void {
    const token = localStorage.getItem("token");
    if(token){
      this._authService.decodedToken = this.jwtHelper.decodeToken(token);
      console.log(this._authService.decodedToken);
    }
  }
  loggedIn(){
    return this._authService.loggedIn();
  }
}
