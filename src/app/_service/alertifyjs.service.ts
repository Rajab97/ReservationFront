import { Injectable } from '@angular/core';
import * as alertify from 'alertifyjs'
@Injectable({
  providedIn: 'root'
})
export class AlertifyjsService {

constructor() { }

 confirm(message:string , okCallBack : () => any , cancelCallback : () => any){
    alertify.confirm(message , (e: any) => {

      if(e){
        okCallBack()
      }
      else{
        cancelCallback();
      }
    });
 }

  success(message : string){
    alertify.success(message);
  }
  error(message : string){
    alertify.error(message);
  }
  message(message : string){
    alertify.message(message);
  }
  warning(message : string){
    alertify.warning(message);
  }

}
