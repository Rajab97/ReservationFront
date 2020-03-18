import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_service/auth.service';
import { AlertifyjsService } from '../_service/alertifyjs.service';

@Injectable({
  providedIn: 'root',
})
export class RegisterForAdmin implements CanActivate {
  /**
   *
   */
  constructor(
    private _authService:AuthService ,
     private _alertify : AlertifyjsService ,
      private _router : Router) {}

  canActivate(): boolean{
    if(this._authService.loggedInAsAdmin()){
      console.log("Admin");
      return true;
    }
    console.log("User");

      this._alertify.message("Bu sehifeye icazen yoxdur.");
      this._router.navigate(['/calendar']);
      return false;
  }
  
}
