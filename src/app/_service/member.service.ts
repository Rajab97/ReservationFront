import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserSettingsDto } from '../_dtos/UserSettingsDto';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { AlertifyjsService } from './alertifyjs.service';
import { Router } from '@angular/router';
import { ChangePasswordDto } from '../_dtos/changePasswordDto';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

    baseUrl = environment.baseUrl + 'member/'
  
constructor(private http:HttpClient , private _authService:AuthService,private _alertify:AlertifyjsService , private _router:Router) { }
getUserDetails():Observable<UserSettingsDto>{
  return this.http.get<UserSettingsDto>(this.baseUrl + this._authService.decodedToken.nameid);
}
updateUserDetails(userDetails:UserSettingsDto):Observable<UserSettingsDto>{
  return this.http.put<UserSettingsDto>(this.baseUrl + "update/",userDetails).pipe(
    catchError( er => {
      this._alertify.error(er);
      this._router.navigate(["/settings"]);
      return of(null);
    })
  );
}
changePassword(dto:ChangePasswordDto):Observable<Object>{
  return this.http.post(this.baseUrl+"changePassword",dto);
}
}
