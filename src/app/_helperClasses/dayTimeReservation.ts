import { ReservationDto } from '../_dtos/reservationDto';

export class DayTimeReservation {
    timeId:number;
    time:string;
    reservationsForDay:ReservationDto;
    selected:boolean = false;
    isExpired:boolean;
}
