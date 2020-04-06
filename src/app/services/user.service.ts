import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Interests } from '../models/interest.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUserById(): Observable<any> {
    return this.http.get('https://academy-backend.herokuapp.com/getUser/5e35d3669265662da0a249e4').pipe(map((gets) => {
      return gets;
    }));
  }


  getAllUser(): Observable<any> {
    return this.http.get('https://academy-backend.herokuapp.com/getUser').pipe(map((gets) => {
      return gets;
    }));
  }

  updateUser(user, userId): Observable<any> {
      return this.http.post(`https://academy-backend.herokuapp.com/updateUser/${userId}`, user);
    }

    addUser(user): Observable<any> {
      return this.http.post('https://academy-backend.herokuapp.com/addUser', user).
      pipe(
         map((data: any) => {
           return data;
         }), catchError( error => {
           return throwError( 'Something went wrong!' );
         })
      );
        }
      }


