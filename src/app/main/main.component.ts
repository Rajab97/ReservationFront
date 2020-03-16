import { Component, OnInit } from '@angular/core';
import { WeekDay } from '@angular/common';
import { ValitTimesService } from '../_service/valitTimes.service';
import { ValidTimesDto } from '../_dtos/validTimesDto';
import { ReservationService } from '../_service/reservation.service';
import { ReservationDto } from '../_dtos/reservationDto';
import { map } from 'rxjs/operators';
import { element } from 'protractor';
import { WeekTimeReservations } from '../_helperClasses/weekTimeReservations';
import { DayTimeReservation } from '../_helperClasses/dayTimeReservation';
import { WeekDayReservationsForList } from '../_helperClasses/weekDayReservationsForList';
import { AlertifyjsService } from '../_service/alertifyjs.service';
import { AuthService } from '../_service/auth.service';
import { CreateReservationDto } from '../_dtos/createReservationDto';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {


  //Colors
  DefaultWhiteBcgForWeekTable:string = "#fff";
 
  WEEKDAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  WEEKDAYSABV = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  MONTHSABV = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  navigate: any = 'mounth';
  AppDate:Date;
  YEAR:number;
  MOUNTH:number;
  WEEK:number;
  WEEKINDEXINMONTHARRAY:number = -1;
  DAY:number;
  DAYINDEXINWEKKARRAY:number = -1;
  MonthViewData:CalendarCell[] = [];
  WeekViewData:CalendarCell[] = [];
  WeekReservationForTime:WeekTimeReservations[] = [];
  DayReservationForTime:DayTimeReservation[] =[];
  WeekDayReservationsList:WeekDayReservationsForList[] =[];
  DayViewData:CalendarCell;
  ValidHours:ValidTimesDto[];
  Reservations:ReservationDto[];
  TopText:string;
  UserName:string;
  AddedReservationsHoursIds:number[] = [];
  AddedReservationInfo:any = {};
  constructor(private _timesService:ValitTimesService ,
      private _reservationService:ReservationService ,
       private alertify:AlertifyjsService,
        private _authService:AuthService,
         private _alertify:AlertifyjsService) { 
      
  }

  ngOnInit() {
    this.InitializeCurrentDate();
    this._timesService.GetAllValidTimes().subscribe(data =>{this.ValidHours = data; })
    this.UserName = this._authService.decodedToken.unique_name;
    // this._reservationService.GetReservations().subscribe(data =>{this.Reservations = data;})
    // this._reservationService.GetReservations().pipe(
    //   map(response =>
    //       {
    //           response.forEach(element => {
    //             let date = new Date(element.reservationDate);
    //               element.year = date.getFullYear();
    //               element.month = date.getMonth();
    //               element.day = date.getDate();
    //           });
    //           return response;
    //         }
    //      )).subscribe(source =>{this.Reservations = source;    });
    this.DayViewData = new CalendarCell(new Date(),null,true);
    this.mounth();

  }

  InitializeCurrentDate(){
    this.AppDate = new Date();
    this.YEAR = this.AppDate.getFullYear();
    this.MOUNTH = this.AppDate.getMonth();
    this.WEEK = this.getDayOfWeek(this.AppDate);
    this.DAY = this.AppDate.getDate();
  }
  left(){
    if( this.navigate == "mounth"){
    
      this.monthLeft();
      
      this.mounth();
      this.WEEKINDEXINMONTHARRAY = -1;
      this.DAYINDEXINWEKKARRAY = -1;

    }
    else if(this.navigate == "week"){
        this.weekLeft();
        this.week(this.WEEKINDEXINMONTHARRAY);
        this.DAYINDEXINWEKKARRAY = -1;

    }
    else if(this.navigate == "day"){
      if(this.DAYINDEXINWEKKARRAY == 0){
        this.weekLeft();
        this.fillWeekViewData(this.WEEKINDEXINMONTHARRAY);
        this.DAYINDEXINWEKKARRAY = 6;
      }
      else{
        this.DAYINDEXINWEKKARRAY -= 1;
      }
      this.day(this.DAYINDEXINWEKKARRAY);
    }
    else if(this.navigate == "list"){
        this.weekLeft();
        this.list(this.WEEKINDEXINMONTHARRAY);
        this.DAYINDEXINWEKKARRAY = -1;
    }

  }
  monthLeft(){
    if(this.MOUNTH == 0){
      this.AppDate = new Date(this.YEAR - 1, 11 ,31);
      this.YEAR = this.AppDate.getFullYear();
      this.MOUNTH =  this.AppDate.getMonth();
    }
    else{
      this.MOUNTH =  this.MOUNTH - 1;
      this.AppDate = new Date(this.YEAR,   this.MOUNTH ,1)
    }
  }
  weekLeft(){
    if(this.WEEKINDEXINMONTHARRAY == 0){
      this.monthLeft();

      let firstDayOfLastMonthLastWeek = this.MonthViewData[0].day;
      this.fillMonthViewData();
      let firstdayOfNewMonthFirstWeek = this.MonthViewData[this.MonthViewData.length - 7].day;

      //Check if last month last week equal to new month first week
      if(firstDayOfLastMonthLastWeek == firstdayOfNewMonthFirstWeek){
        this.WEEKINDEXINMONTHARRAY = Math.floor((this.MonthViewData.length - 1) / 7) - 1
      }
      else{
        this.WEEKINDEXINMONTHARRAY = Math.floor((this.MonthViewData.length - 1) / 7)
      }
      
    }
    else {
      this.WEEKINDEXINMONTHARRAY -= 1;
    }
  }

  right(){
    if( this.navigate == "mounth"){
      this.monthRight();
      this.mounth();
      this.WEEKINDEXINMONTHARRAY = -1;
      this.DAYINDEXINWEKKARRAY = -1;
    }
    else if(this.navigate == "week"){
      this.weekRight();
      this.week(this.WEEKINDEXINMONTHARRAY);
      this.DAYINDEXINWEKKARRAY = -1;
    }
    else if(this.navigate == "day"){
      if(this.DAYINDEXINWEKKARRAY == 6){
        this.weekRight();
        this.fillWeekViewData(this.WEEKINDEXINMONTHARRAY);
        this.DAYINDEXINWEKKARRAY = 0;
      }
      else{
        this.DAYINDEXINWEKKARRAY += 1;
      }
      this.day(this.DAYINDEXINWEKKARRAY);
    }
    else if(this.navigate == "list"){
      this.weekRight();
      this.list(this.WEEKINDEXINMONTHARRAY);
      this.DAYINDEXINWEKKARRAY = -1;
    }

  }
  monthRight(){
    if(this.MOUNTH == 11){
      this.AppDate = new Date(this.YEAR + 1, 0 ,1);
      this.YEAR = this.AppDate.getFullYear();
      this.MOUNTH =  this.AppDate.getMonth();
    }
    else{
      this.MOUNTH =  this.MOUNTH + 1;
      this.AppDate = new Date(this.YEAR, this.MOUNTH ,1)
    }
  }
  weekRight(){
    
    if(this.WEEKINDEXINMONTHARRAY == Math.floor((this.MonthViewData.length - 1)/7)){
      this.monthRight();
      let firstDayOfLastMonthLastWeek = this.MonthViewData[this.MonthViewData.length - 7].day;
      this.fillMonthViewData();
      let firstdayOfNewMonthFirstWeek = this.MonthViewData[0].day;

      //Check if last month last week equal to new month first week
      if(firstDayOfLastMonthLastWeek == firstdayOfNewMonthFirstWeek){
        this.WEEKINDEXINMONTHARRAY = 1;
      }
      else{
        this.WEEKINDEXINMONTHARRAY = 0;
      }
    }
    else {
      this.WEEKINDEXINMONTHARRAY += 1;
    }

  }

  today(){
    this.InitializeCurrentDate();
    this.fillMonthViewData();
    this.WEEKINDEXINMONTHARRAY = -1;
    this.DAYINDEXINWEKKARRAY = -1;
    if( this.navigate == "mounth"){
      this.mounth();
    }
    else if(this.navigate == "week"){
        this.week();
    }
    else if(this.navigate == "day"){
      this.day();
    }
    else if(this.navigate == "list"){
        this.list();
    }

  }

  //Used for fill month container
  mounth(){
    //Remove selected hours from array
    this.AddedReservationsHoursIds = [];

    this.getReservations().subscribe(data => { this.Reservations = data; this.fillMonthViewData();  this.navigate = "mounth"} , error => this.alertify.error(error));


    this.TopText = this.MONTHS[this.MOUNTH]+" "+this.YEAR;
   
  }
  getReservations(){
    return this._reservationService.GetReservations(this.YEAR,this.MOUNTH+1).pipe(
      map(response =>
          {
              response.forEach(element => {
                let date = new Date(element.reservationDate);
                  element.year = date.getFullYear();
                  element.month = date.getMonth();
                  element.day = date.getDate();
              });
              return response;
            }
         ))
  }
  getWeekCountInMonth(){
    let result = [];
    for(let i=0 ; i <= this.MonthViewData.length/7; i++){
      result.push(i);
    }
    return result;
  }
  getDaysOfWeek(weekNumber){
    return this.MonthViewData.slice(weekNumber*7, weekNumber*7+7);
  }
  fillMonthViewData(){
    let date:Date = new Date(this.YEAR,this.MOUNTH,1);
    let weekDayOfFirstDayOfWeek = date.getDay();

    date = new Date(date.setDate(date.getDate() - weekDayOfFirstDayOfWeek - 1));

    this.MonthViewData = [];
    //Add cells from previous month
    for(let i=weekDayOfFirstDayOfWeek ; i > 0; i--){
      date = new Date(date.setDate(date.getDate() + 1 ));
      let calendarCell = new CalendarCell(date,this.GetReservationsForCurrentDate(date),false);
      this.MonthViewData.push(calendarCell);
    }

    //Add dates of current month
    for(let i = 1; i <= this.getDaysOfMounth(this.YEAR,this.MOUNTH);i++){
      date = new Date(this.YEAR,this.MOUNTH,i);
      let calendarCell = new CalendarCell(date,this.GetReservationsForCurrentDate(date),true);
      this.MonthViewData.push(calendarCell);
    }


     //Add dates of next month
     date = new Date(this.YEAR,this.MOUNTH,this.getDaysOfMounth(this.YEAR,this.MOUNTH));
     weekDayOfFirstDayOfWeek = date.getDay();
    
     for(let i=weekDayOfFirstDayOfWeek+1 ; i <= 6; i++){
      date = new Date(date.setDate(date.getDate() + 1 ));
      let calendarCell = new CalendarCell(date,this.GetReservationsForCurrentDate(date),false);
      this.MonthViewData.push(calendarCell);
    }
  }
  GetReservationsForCurrentDate(date:Date):ReservationDto[]{
    return this.Reservations.filter(m => m.year == date.getFullYear() && m.month == date.getMonth() && m.day == date.getDate());
  }
  checkReservationForDay(id:number):boolean{
    if(this.MonthViewData[id].reservations.length == 0)
      return false;
    return true;
  }
  checkIfThisDateIsCurrent(dayIndexInMonthArray:number):boolean{
    let date = this.MonthViewData[dayIndexInMonthArray];
    let currentDate = new Date();
    if(date.year == currentDate.getFullYear() && date.mounth == currentDate.getMonth() && date.day == currentDate.getDate())
      return true;
    return false;
  }
  checkIFThisWeekDayIsCurrent(weekNumber:number){
    let date = new Date();
    if(this.WeekViewData[weekNumber].year == date.getFullYear() && this.WeekViewData[weekNumber].mounth == date.getMonth() && this.WeekViewData[weekNumber].day == date.getDate())
      return true;
    return false;
  }
  getReservationForDay(id:number,numberOfReservations:number):ReservationDto[]{
      
    let reservations = this.MonthViewData[id].reservations;
    if(reservations.length > numberOfReservations){
      reservations.splice(numberOfReservations-1,reservations.length - numberOfReservations)
    }
    return reservations;
  }
  checkReservationsCountMoreThanSendedLength(id:number,length:number) : boolean{
   
    let cell = this.MonthViewData[id];
    if(cell.countOfReservation > length){
      return true;
    }
    return false;
  }
  getReservationForDateAndTime(date:Date,timeId:number):ReservationDto{
    let result ;
    this.Reservations.forEach(element => {
      let reservationDate = new Date(element.reservationDate);
      if((reservationDate.getFullYear() == date.getFullYear() && reservationDate.getMonth() == date.getMonth() && reservationDate.getDate() == date.getDate()) && timeId == element.timeId){
        result = element;
      }
    });
    return result;
  }
  week(weekIndexInArray:number = -1){
    
    this.navigate = "week"
    //Remove selected hours from array
    this.AddedReservationsHoursIds = [];
    
    
    if(weekIndexInArray == -1){
      this.fillWeekViewData()
    }
    else if(this.WEEKINDEXINMONTHARRAY != -1){
      this.fillWeekViewData(this.WEEKINDEXINMONTHARRAY);
    }
    else{
      this.fillWeekViewData(weekIndexInArray);
    }

    this.fillWeekReservationForTime();

    if(this.WeekViewData[0].mounth != this.WeekViewData[this.WeekViewData.length-1].mounth){
      this.TopText =  this.MONTHS[this.WeekViewData[0].mounth]+" "+this.WeekViewData[0].day +" - "
       + this.MONTHS[this.WeekViewData[this.WeekViewData.length-1].mounth]+" "+this.WeekViewData[this.WeekViewData.length-1].day +"," +  this.WeekViewData[0].year;
    }
    else{
      this.TopText =  this.MONTHS[this.WeekViewData[0].mounth]+" "+this.WeekViewData[0].day +" - "
      + this.WeekViewData[this.WeekViewData.length-1].day +", " +  this.WeekViewData[0].year;
    }
  }
  fillWeekReservationForTime(){
    //Ardi burda
    this.WeekReservationForTime = [];
    this.ValidHours.forEach(element => {
      this.WeekReservationForTime.push( this.getReservationsOfCurrentTimeInWeek(element.id));
    });
  }
  fillDayReservationForTime(){
    this.DayReservationForTime = [];
    this.ValidHours.forEach(element => {
      this.DayReservationForTime.push(this.getReservationsOfCurrentTimeInDay(element.id));
    });
  }
  fillDayReservationForList(){
    this.WeekDayReservationsList = [];
    this.WeekViewData.forEach(element => {
      this.WeekDayReservationsList.push(this.getReservationsOfCurrentTimeInWeekList(element.weekNumber,new Date(element.year,element.mounth,element.day)));
    });
  }
  fillWeekViewData(weekIndexInArray:number = -1){
    if(weekIndexInArray == -1 && this.WEEKINDEXINMONTHARRAY == -1){
  
      let currentDateIndex = -1;
      let currentDate = new Date();
      for(let i = 0;i < this.MonthViewData.length ; i++){
        if(this.MonthViewData[i].year == currentDate.getFullYear() && this.MonthViewData[i].mounth == currentDate.getMonth() && this.MonthViewData[i].day == currentDate.getDate()){
          currentDateIndex = i;
          break;
        }
      }
      
      if(currentDateIndex != -1){
        this.WEEKINDEXINMONTHARRAY = Math.floor(currentDateIndex / 7);
      }
      else{
        this.WEEKINDEXINMONTHARRAY = 0;
      }
    }
    else if(weekIndexInArray != -1 && this.WEEKINDEXINMONTHARRAY != -1){
        this.WEEKINDEXINMONTHARRAY = weekIndexInArray;
    }
    else if(this.WEEKINDEXINMONTHARRAY == -1){
        this.WEEKINDEXINMONTHARRAY = weekIndexInArray;
    }
    this.WeekViewData = [];
    for(let i = 0 ; i < 7 ; i++){
      this.WeekViewData.push(this.MonthViewData[this.WEEKINDEXINMONTHARRAY*7+i]);
    }
  }

  //Burda Qaldim
  getReservationsOfCurrentTimeInWeek(timeId:number):WeekTimeReservations{
    let result = new WeekTimeReservations();
    result.timeId = timeId;
    result.time = this.ValidHours.find(m => m.id == timeId).startTime + " - " + this.ValidHours.find(m => m.id == timeId).endTime;
    this.WeekViewData.forEach((element,i) => {
      let reservationDto = this.getReservationForDateAndTime(new Date(element.year,element.mounth,element.day),timeId);
      result.reservationsForWeek[i] = reservationDto;
    });
    return result;
  }
  getReservationsOfCurrentTimeInDay(timeId:number):DayTimeReservation{
    let dayDate = new Date(this.DayViewData.year,this.DayViewData.mounth,this.DayViewData.day);
    let result = new DayTimeReservation();
    
    result.timeId = timeId;
    result.time = this.ValidHours.find(m => m.id == timeId).startTime + " - " + this.ValidHours.find(m => m.id == timeId).endTime;
    result.reservationsForDay =  this.getReservationForDateAndTime(dayDate,timeId);
    result.selected = false;
    result.isExpired = this.checkDateIsExpired(dayDate,timeId);
    return result;
  }
  checkDateIsExpired(date:Date,timeId:number) : boolean{
    let currentDateUtc = new Date(Date.now());

    date.setHours(this.ValidHours.find(m => m.id == timeId).startTime.split(":")[0]);
    date.setMinutes(this.ValidHours.find(m => m.id == timeId).startTime.split(":")[1]);
    return date < currentDateUtc;
  }
  getReservationsOfCurrentTimeInWeekList(weekIndex:number,date:Date):WeekDayReservationsForList{
    let result = new WeekDayReservationsForList();
    result.weekIndex = weekIndex;
    result.reservations = this.GetReservationsForCurrentDate(date);
    result.dateText = this.MONTHS[date.getMonth()] + " "+date.getDate() +", " + date.getFullYear();
    result.date = date;
    return result;
  }
  checkTimeAndWeekDayReservation(timeId:number,weekIndex:number):boolean{
    let weekReservationForTime = this.WeekReservationForTime.find(m => m.timeId == timeId);
    if(weekReservationForTime.reservationsForWeek[weekIndex] != null && weekReservationForTime.reservationsForWeek[weekIndex] != undefined)
      return true;
    return false;
  }
  day(dayIndexInWeek:number = -1,weekIndexInMonth:number = -1){
    this.navigate = "day"
    if(dayIndexInWeek != -1 && weekIndexInMonth != -1){
      // this.fillWeekViewData(weekIndexInMonth);
      this.DAYINDEXINWEKKARRAY = dayIndexInWeek;
      // this.DayViewData = this.WeekViewData[dayIndexInWeek];
    }
    else{
     
      if(dayIndexInWeek == -1 && this.DAYINDEXINWEKKARRAY  == -1){
        this.fillWeekViewData();
        let currentDateIndex = -1;
        let currentDate = new Date();
        for(let i = 0;i < this.WeekViewData.length ; i++){
          if(this.WeekViewData[i].year == currentDate.getFullYear() && this.WeekViewData[i].mounth == currentDate.getMonth() && this.WeekViewData[i].day == currentDate.getDate()){
            currentDateIndex = i;
            break;
          }
        }
        if(currentDateIndex != -1){
          this.DAYINDEXINWEKKARRAY = currentDateIndex;
          this.DayViewData = this.WeekViewData[currentDateIndex];
        }
        else{
          this.DAYINDEXINWEKKARRAY = 0;
          this.DayViewData = this.WeekViewData[0];
        }
      }
      else if(this.DAYINDEXINWEKKARRAY  != -1){
        this.DayViewData = this.WeekViewData[this.DAYINDEXINWEKKARRAY];
      }
      else{
        this.DayViewData = this.WeekViewData[dayIndexInWeek];
      }
    }
    this.fillDayReservationForTime();
    this.TopText = this.MONTHS[this.DayViewData.mounth]+ " " + this.DayViewData.day+", "+this.DayViewData.year;
    

  }
  checkIfDayBelongToThisMonth(dayIndexInWeekArray:number, weekIndexInMonthArray:number):boolean{
    this.fillWeekViewData(weekIndexInMonthArray);
    this.DayViewData = this.WeekViewData[dayIndexInWeekArray];
    this.WEEKINDEXINMONTHARRAY = -1;
    return this.DayViewData.isActive
  }
  selectDay(dayIndexInWeekArray:number, weekIndexInMonthArray:number){
    if(this.checkIfDayBelongToThisMonth(dayIndexInWeekArray,weekIndexInMonthArray)){
      this.day(dayIndexInWeekArray,weekIndexInMonthArray);
    }
  }
  selectDayByDayNumber(monthNumber:number,dayNumber:number){
  
   
    let dayIndex = this.WeekViewData.findIndex(m => m.day == dayNumber && m.mounth == monthNumber);
    if(dayIndex == -1)
      this.alertify.message("Enter valid day");
    if(this.WeekViewData[dayIndex].isActive){
      this.DAYINDEXINWEKKARRAY = dayIndex
      this.day();
    }
    else{
      this.alertify.message("This month doesn't belong to this month.");
    }
      
   
  }
  selectHourForReservation(hour:DayTimeReservation):void{
     if(!hour.reservationsForDay && hour.selected == false){
      hour.selected = !hour.selected;
      this.AddedReservationsHoursIds.push(hour.timeId);
     }
     else if(hour.selected == true){
      hour.selected = !hour.selected;
      this.AddedReservationsHoursIds.splice(this.AddedReservationsHoursIds.findIndex(m => m == hour.timeId),1);
     }
     else{
      this.alertify.message("This time is reserved");
     }
  }
  CheckAnyHourSelected():boolean{
    if(this.AddedReservationsHoursIds.length > 0)
      return true;
    return false

  }
  SaveReservation(){
    let reservationDto = new CreateReservationDto();
    reservationDto.description = this.AddedReservationInfo.description;
    reservationDto.memberId = this._authService.decodedToken.nameid;
    reservationDto.timeIds = this.GetValidTimeIdsForReservation(this.AddedReservationsHoursIds);
    reservationDto.date = new Date(this.DayViewData.year , this.DayViewData.mounth , this.DayViewData.day).toDateString();
    this._reservationService.CreateReservation(reservationDto).subscribe(
      next =>{ 
        this.AddedReservationsHoursIds = [];
        this.getReservations().subscribe(data => { this.Reservations = data; this.fillMonthViewData();
        this.fillDayReservationForTime();} , error =>{this.alertify.error(error);} ); 
        this.alertify.success("Reservation added successfully.")}  ,

      error =>{this.alertify.error("Reservation doesn't added. \n"); }) 
  }
  GetValidTimeIdsForReservation(timeIds:number[]):number[]{
    let result = [];
    let dayDate = new Date(this.DayViewData.year,this.DayViewData.mounth,this.DayViewData.day);
    timeIds.forEach(id => {
      if(!this.checkDateIsExpired(dayDate,id)){
        result.push(id);
      }
    });
    return result;
  }
  checkReservationCancelationForCurrentUser(example : ReservationDto,timeId:number):boolean{
  
    if(example){
      let date = new Date(example.reservationDate);
      if(!this.checkDateIsExpired(date,timeId)){
        if(example.memberId == this._authService.decodedToken.nameid || this.checkIfUserIsAdmin(this._authService.decodedToken.role)){
          return true;
        }
        else{
          return false;
        }
      }
    }
    return false;
  } 
  checkIfUserIsAdmin(userRolesString:string) : boolean{
     let roles = userRolesString.trim().split(" ");

     let result = false;
     roles.forEach(role => {
       if(role === "Administrator"){
          result = true;
       }
     });
     return result
  }
  checkAccesForDelete(reservation:ReservationDto):boolean{
    


    if(reservation){
      if(reservation.memberId == this._authService.decodedToken.nameid){
        return true;
      }
      else{
        return false;
      }
    }
    else{
      this.alertify.message("Reservation doesn't find.");
    }
  }
  CancelReservation(reservation:DayTimeReservation){
    this._reservationService.DeleteReservation(reservation.reservationsForDay.id).subscribe(
      next => { 
        this.getReservations().subscribe(
          data => {
           this.Reservations = data;
            this.fillMonthViewData(); 
             this.fillDayReservationForTime();
             this.SetSelectedToPreviousSelectedTimes();
              this._alertify.success("Reservation deleted succesfully")
            } ,
            
          error => this.alertify.error(error));} ,
       error => {this._alertify.error(error)});
  } 
  SetSelectedToPreviousSelectedTimes(){
    this.AddedReservationsHoursIds.forEach(element => {
      this.DayReservationForTime.find(m => m.timeId == element).selected = true;
    });
  }
  selectDayByDate(date:Date){
    let indexInMonthArray = this.MonthViewData.findIndex(m => m.year == date.getFullYear() && m.mounth == date.getMonth() && m.day == date.getDate())
    this.day(indexInMonthArray % 7,Math.floor(indexInMonthArray/7));
  }
  list(weekIndex:number = -1){
        //Remove selected hours from array
        this.AddedReservationsHoursIds = [];
    if(weekIndex == -1){
      this.week();
    }
    else{
      this.week(weekIndex);
    }
    this.fillDayReservationForList();
    this.navigate = "list";

  }
  private getDaysOfMounth(year:number,month:number) {
   return new Date(year, month+1, 0).getDate();
  };
  private getPreviousMounth(date:Date){
    return new Date(date.setMonth(date.getMonth() - 1));
  }
  private getDayOfWeek(date:Date){
    return date.getDay()
  }


}
export class CalendarCell{
  year:number;
  mounth:number;
  weekNumber:number;
  day:number;
  countOfReservation:number;
  reservations:ReservationDto[];
  isActive:boolean;
  /**
   *
   */
 
  constructor(date:Date,reservations:ReservationDto[],isActive:boolean) {
    this.year = date.getFullYear();
    this.mounth = date.getMonth();
    this.day = date.getDate();
    this.weekNumber = date.getDay();
    this.reservations = reservations;
    this.isActive = isActive;
    if(reservations){
      this.countOfReservation = reservations.length;
    }
    else{
      this.countOfReservation = 0;
    }
    
  }
}