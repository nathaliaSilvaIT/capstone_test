import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
import { Interests } from '../models/interest.model';

@Injectable({
  providedIn: 'root'
})
export class InterestService {

  constructor(private http: HttpClient) { }

  getAllInterests(): Observable<any> {
    return this.http.get('https://academy-backend.herokuapp.com/getInterest').pipe(map((gets) => {
      return gets;
    }));
  }
}
