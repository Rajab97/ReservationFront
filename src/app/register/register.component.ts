import { Component, OnInit, ViewChild } from '@angular/core';
import { RegistrationDto } from '../_dtos/registrationDto';
import { NgForm, NgModel } from '@angular/forms';
import { AlertifyjsService } from '../_service/alertifyjs.service';
import { MemberService } from '../_service/member.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../_service/auth.service';
import { Observable } from 'rxjs';
import * as alertify from 'alertifyjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user:RegistrationDto = new RegistrationDto();
  @ViewChild('userForm',{static:true}) userForm:NgForm;
  @ViewChild('selectedColor',{static:true}) selectedColor:NgModel;
  @ViewChild('name',{static:true}) MemberName:NgModel;
  constructor(private _alertify:AlertifyjsService , private _memberService: MemberService , private router:Router, private activatedRouter:ActivatedRoute) {
    
  }  
  ngOnInit() {}

  setColorValue(value:string){
    this.user.color = value;
  }
  saveValues(){
    if(!this.checkIsFormActive()) {
      let response:Observable<RegistrationDto> = this._memberService.register(this.user);
      if(response == null){
        this._alertify.error("Istifadəçini qeydə alan zaman xəta baş vermişdir.");
      }
      response.subscribe(next =>{
        if(next != null){
            this.router.navigate(["/calendar"]);
            this._alertify.success("Registered successfully.");
        }
      } , err => this._alertify.error(err));
    }
    else{
      this._alertify.warning("Məlumatlar düzgün daxil edilməyib.");
    }
 
  }
 
  checkIsFormActive(){
    if(this.selectedColor.touched && this.userForm.valid) {
      return false;
    }
    if(this.userForm.dirty && this.userForm.valid) {
      return false;
    }
    return true;
  }

}
