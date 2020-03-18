import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { AuthGuard } from './_guards/auth.guard';
import { ChangePasswordComponent } from './changePassword/changePassword.component';
import { UserSettingsComponent } from './userSettings/userSettings.component';
import { MemberSettingsResolver } from './_resolvers/member-settings.resolver';
import { RegisterComponent } from './register/register.component';
import { RegisterForAdmin } from './_guards/registerForAdmin.guard';

export const appRoutes:Routes = [
    {path :"login" , component:LoginComponent},
    {path : "calendar" , component:MainComponent ,canActivate:[AuthGuard]},
    {path:"changePassword" , component:ChangePasswordComponent,canActivate:[AuthGuard]},
    {path:"register" , component:RegisterComponent,canActivate:[RegisterForAdmin]},
    {path: "settings" , component:UserSettingsComponent,canActivate:[AuthGuard],resolve:{user:MemberSettingsResolver}},
    {path : "**" , redirectTo:"calendar",pathMatch:"full"}
]