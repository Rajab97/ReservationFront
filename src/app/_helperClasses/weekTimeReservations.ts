import { ReservationDto } from '../_dtos/reservationDto';

export class WeekTimeReservations {
    timeId:number;
    time:string;
    reservationsForWeek:ReservationDto[] = [];
}
