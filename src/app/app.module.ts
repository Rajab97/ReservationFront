import { from } from 'rxjs';


//Modules
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';

//Prividers
import { ErrorInterceptorProvider } from './_helperClasses/ErrorInterceptor';

//Components
import { NavBarComponent } from './navBar/navBar.component';
import { MainComponent } from './main/main.component';
import { ValueComponent } from './value/value.component';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ChangePasswordComponent } from './changePassword/changePassword.component';
import { UserSettingsComponent } from './userSettings/userSettings.component';
//3 part libraries
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap';
import { RouterModule } from '@angular/router';
import { appRoutes } from './routes';
import { JwtModule } from '@auth0/angular-jwt';
import { ColorPickerModule } from 'ngx-color-picker';
//Services
import { AuthService } from './_service/auth.service';
import { ValitTimesService } from './_service/valitTimes.service';
import {ReservationService} from './_service/reservation.service';
import { AlertifyjsService } from './_service/alertifyjs.service';
import { environment } from 'src/environments/environment';
import { MemberSettingsResolver } from './_resolvers/member-settings.resolver';
import { MemberService } from './_service/member.service';
import { RegisterComponent } from './register/register.component';




export function tokenGetter():string{
   return localStorage.getItem("token");
}

@NgModule({
   declarations: [
      AppComponent,
      ValueComponent,
      LoginComponent,
      MainComponent,
      NavBarComponent,
      ChangePasswordComponent,
      UserSettingsComponent,
      RegisterComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      FormsModule,
      BrowserAnimationsModule,
      JwtModule.forRoot({
         config:{
           tokenGetter: tokenGetter,
           whitelistedDomains: environment.whiteList,
           blacklistedRoutes: environment.blackList
         }
       }),
      BsDropdownModule.forRoot(),
      RouterModule.forRoot(appRoutes),
      ColorPickerModule
   ],
   providers: [
      AuthService,
      ValitTimesService,
      ReservationService,
      MemberService,
      AlertifyjsService,
      ErrorInterceptorProvider,
      MemberSettingsResolver
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }