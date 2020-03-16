import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()

export class ErrorInterceptor implements HttpInterceptor{
    intercept(
        req: import("@angular/common/http").HttpRequest<any>,
         next: import("@angular/common/http").HttpHandler):
          import("rxjs").Observable<import("@angular/common/http").HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError(errorResponse => {
                if(errorResponse.status === 401){
                    return throwError(errorResponse.statusText);  
                }
                else if(errorResponse instanceof HttpErrorResponse){
                    const applicationError = errorResponse.headers.get("Application-Error");
                    if(applicationError){
                        return throwError(applicationError)
                    }
                    const serverErrors = errorResponse.error;
                    let errorMessages = '';
                
                    if(serverErrors.errors  && typeof serverErrors.errors === 'object'){
                        for(const key in serverErrors){
                            if(serverErrors.errors[key]){
                                errorMessages += serverErrors.errors[key] + '\n';
                            }
                        }
                    }
                   return throwError(errorMessages || serverErrors || 'Server Error')
                }
                else{
                    return throwError(errorResponse.statusText); 
                }
            })
        )
    }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass : ErrorInterceptor,
    multi : true
}
