import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_service/auth.service';
import { AlertifyjsService } from '../_service/alertifyjs.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user:any = {}
  constructor(private _authService : AuthService , private alertify : AlertifyjsService , private router : Router) { }

  ngOnInit() {
  }

  login(){
    this._authService.login(this.user)
      .subscribe(
        next => {this.alertify.success("Logged in succesfully.") ;  this.router.navigate(['/calendar']); } ,
         error => {this.alertify.error(error);})          
  }
  logout(){
    this._authService.logOut();
    this.router.navigate(["/login"]);
  }

}
