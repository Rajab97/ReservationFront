import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertifyjsService } from '../_service/alertifyjs.service';
import { AuthService } from '../_service/auth.service';
import { ChangePasswordDto } from '../_dtos/changePasswordDto';
import { Router } from '@angular/router';
import { MemberService } from '../_service/member.service';
import { NgForm, NgModel } from '@angular/forms';

@Component({
  selector: 'app-changePassword',
  templateUrl: './changePassword.component.html',
  styleUrls: ['./changePassword.component.css']
})
export class ChangePasswordComponent implements OnInit {

  password:any = {};
  @ViewChild("changePasswordForm",{static:true}) changePasswordForm:NgForm
  @ViewChild("PasswordModel",{static:true}) PasswordModel:NgModel
  @ViewChild("confirmPasswordModel",{static:true}) confirmPasswordModel:NgModel

  IsPasswordAndConfirmPasswordSame:boolean = false;
  constructor(private _alertify:AlertifyjsService,private _memberService:MemberService,private router:Router) { }

  ngOnInit() {
  }
  changePassword(){
    if(this.password.new !== this.password.confirm){
        this.IsPasswordAndConfirmPasswordSame = true;
      return;
    }
    let dto = new ChangePasswordDto();
    dto.lastPassword = this.password.last;
    dto.newPassword = this.password.new;
    this._memberService.changePassword(dto).subscribe(next => {this._alertify.success("Changed succesfully");this.router.navigate(["/calendar"]) ;},error => this._alertify.error(error));
  }
  checkFormIsValid():boolean{
    if(this.changePasswordForm.valid ){
     
      return false;
    }
    return true;
  }
}
