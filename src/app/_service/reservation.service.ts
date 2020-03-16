import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReservationDto } from '../_dtos/reservationDto';
import { CreateReservationDto } from '../_dtos/createReservationDto';
import { AlertifyjsService } from './alertifyjs.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  baseUrl:string = environment.baseUrl + "CalendarManipulation/";
  constructor(private http:HttpClient) { }

  GetReservations(year?:number,month?:number) : Observable<ReservationDto[]>{
    if(year != null && month != null){
      return this.http.get<ReservationDto[]>(this.baseUrl+"GetReservations/"+year+"/"+month);
    }
    else if(year != null){
      return this.http.get<ReservationDto[]>(this.baseUrl+"GetReservations/"+year);
    }else{
      return this.http.get<ReservationDto[]>(this.baseUrl+"GetReservations");
    }
    
  }
  CreateReservation(model:CreateReservationDto){
    return this.http.post(environment.baseUrl + "Reservation/create",model);
  }
  DeleteReservation(reservationId:number){
    return this.http.delete(environment.baseUrl + "Reservation/delete/"+reservationId);
  }
}