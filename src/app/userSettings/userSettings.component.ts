import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../_service/auth.service';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { AlertifyjsService } from '../_service/alertifyjs.service';
import { UserSettingsDto } from '../_dtos/UserSettingsDto';
import { MemberService } from '../_service/member.service';
import { Observable } from 'rxjs';
import { NgForOf } from '@angular/common';
import { NgForm, NgModel, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-userSettings',
  templateUrl: './userSettings.component.html',
  styleUrls: ['./userSettings.component.css']
})
export class UserSettingsComponent implements OnInit {

  user:UserSettingsDto = new UserSettingsDto();
  @ViewChild('userForm',{static:true}) userForm:NgForm;
  @ViewChild('selectedColor',{static:true}) selectedColor:NgModel;
  @ViewChild('name',{static:true}) MemberName:NgModel;
  constructor(private _alertify:AlertifyjsService , private _memberService:MemberService , private router:Router, private activatedRouter:ActivatedRoute) {
    
   }  

  ngOnInit() {
    this.activatedRouter.data.subscribe(
      data => {
        this.user = data["user"];
      }
    );
  }
  // saveColorValue(){
  //   this._authService.changeColor(this.user).subscribe(next => { this._alertify.success("Changed succesfully"); this.router.navigate(['/calendar']) } , error => this._alertify.error(error));
  // }
  setColorValue(value:string){
    this.user.color = value;
    console.log(this.user)
  }
  saveValues(){
    if(this.userForm.valid){
      let response:Observable<UserSettingsDto> = this._memberService.updateUserDetails(this.user);
      if(response == null){
        this._alertify.error("Error occured while updating user details.");
      }
      response.subscribe(next =>{ console.log(next); this.userForm.reset(this.userForm.value); this.user = next; this._alertify.success("Saved successfully."); console.log(this.user);} , err => this._alertify.error(err))
    }
  }
 
  checkIsFormActive(){
    if(this.selectedColor.touched && this.userForm.valid){
      return false;
    }
    if(this.userForm.dirty && this.userForm.valid)
    return false;
    return true;
    
  }
}
