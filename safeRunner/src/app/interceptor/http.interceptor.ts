import { AlertService } from './../services/alert/alert.service';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError,tap} from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication/authentication.service';


@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  constructor(private authService: AuthenticationService, private alertService: AlertService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      tap(response=>{
        if (response instanceof HttpResponse) {
        }
    },(err)=>{
      if (err instanceof HttpErrorResponse) {
        if(err.error.statusCode ===403){
          this.authService.logout();
        }
      }
    }));

  }

}
