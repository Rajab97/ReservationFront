import { Injectable } from "@angular/core"
import { UserSettingsDto } from '../_dtos/UserSettingsDto';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AlertifyjsService } from '../_service/alertifyjs.service';
import { AuthService } from '../_service/auth.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MemberService } from '../_service/member.service';

@Injectable()

export class MemberSettingsResolver implements Resolve<UserSettingsDto>{
    
    
    constructor(private _alertify:AlertifyjsService , private _memberSerive:MemberService, private router:Router) {
     
        
    }
    
    resolve(route: ActivatedRouteSnapshot, state:RouterStateSnapshot): Observable<UserSettingsDto> {
        return this._memberSerive.getUserDetails().pipe(
            catchError( error =>{
                 this._alertify.error("Error happend while loading user details");
                this.router.navigate(["/calendar"]);
                 return of(null);
                })
        );
    }
    
}