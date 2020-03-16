import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_service/auth.service';
import { AlertifyjsService } from '../_service/alertifyjs.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  /**
   *
   */
  constructor(
    private _authService:AuthService ,
     private _alertify : AlertifyjsService ,
      private _router : Router) {}

  canActivate(): boolean{
    if(this._authService.loggedIn())
      return true;
  
      this._alertify.message("You don't have access");
      this._router.navigate(['/login']);
      return false;
  }
  
}
