import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) {}

  getAllEvents(): Observable<any> {
    return this.http.get('https://academy-backend.herokuapp.com/getEvent').pipe(map((gets) => {
      return gets;
    }));
  }

  getEventById(eventId): Observable<any> {
    return this.http.get(`https://academy-backend.herokuapp.com/getEvent/${eventId}`).pipe(map((gets) => {
      return gets;
    }));
  }

  updateEvent(event, eventId): Observable<any> {
    return this.http.post(`https://academy-backend.herokuapp.com/updateEvent/${eventId}`, event);
  }

  deleteEvent(eventId): Observable<any> {
      return this.http.delete(`https://academy-backend.herokuapp.com/deleteEvent/${eventId}`, eventId);
    }

    addEvent(event): Observable<any> {
      return this.http.post('https://academy-backend.herokuapp.com/addEvent', event).
      pipe(
         map((data: any) => {
           return data;
         }), catchError( error => {
           return throwError( 'Something went wrong!' );
         })
      );
  }

}
