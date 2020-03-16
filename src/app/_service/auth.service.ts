import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt'
import { AlertifyjsService } from './alertifyjs.service';
import { ChangePasswordDto } from '../_dtos/changePasswordDto';
import { Observable } from 'rxjs';
import { ChangeColorDto } from '../_dtos/changeColorDto';
import { environment } from 'src/environments/environment';
import { UserSettingsDto } from '../_dtos/UserSettingsDto';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = environment.baseUrl + 'auth/';
  jwtHelper = new JwtHelperService();
  decodedToken : any;
constructor(private http:HttpClient , private alertify:AlertifyjsService) {

 }
 tokenGetter():string{
  return localStorage.getItem("token");
 }

  login(model:any){
    return this.http.post(this.baseUrl + "login",model).pipe(
        map((response:any) => {

          if(response){
            localStorage.setItem("token",response.token);
            this.decodedToken = this.jwtHelper.decodeToken(response.token);
          }
            
        })
      );
  }
  loggedIn(){
    const token = localStorage.getItem("token")
    return !this.jwtHelper.isTokenExpired(token);
  }
  logOut(){
    this.decodedToken = null;
    this.alertify.message("Logout");
    localStorage.removeItem("token");
  }

  // changeColor(dto:ChangeColorDto):Observable<Object>{
  //   return this.http.post(this.baseUrl+"changeColor",dto);
  // }

}


