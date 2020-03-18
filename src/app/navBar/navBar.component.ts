import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_service/auth.service';
import { Router } from '@angular/router';
import { MemberService } from '../_service/member.service';

@Component({
  selector: 'app-navBar',
  templateUrl: './navBar.component.html',
  styleUrls: ['./navBar.component.css']
})
export class NavBarComponent implements OnInit {

  userName:string;
  
  constructor(private _authService : AuthService , private router : Router ,private member:MemberService) { }

  ngOnInit() {
   this.member.getUserDetails().subscribe(m => this.userName = m.name + " " + m.surname);
  }
  logout(){
    this._authService.logOut();
    this.router.navigate(["/login"]);

  }
  loggedIn():boolean{
    return this._authService.loggedIn();
  }
  loggedInAsAdmin():boolean{
    return this._authService.loggedInAsAdmin();
  }
}
