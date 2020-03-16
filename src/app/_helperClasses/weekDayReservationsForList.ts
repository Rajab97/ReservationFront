import { ReservationDto } from '../_dtos/reservationDto';

export class WeekDayReservationsForList {
    weekIndex:number;
    dateText:string;
    date:Date;
    reservations:ReservationDto[] = [];
}
