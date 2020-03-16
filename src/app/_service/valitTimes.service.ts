import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ValidTimesDto} from 'src/app/_dtos/validTimesDto';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ValitTimesService {
  baseUrl = environment.baseUrl + 'CalendarManipulation/';

constructor(private http:HttpClient) {
 
 }

 GetAllValidTimes() :Observable<ValidTimesDto[]>{
   return this.http.get<ValidTimesDto[]>(this.baseUrl + "validTimes")
 }
}
