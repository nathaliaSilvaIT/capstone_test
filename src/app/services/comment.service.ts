import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CommentService {
  constructor(private http: HttpClient) {
    let server: 'https://academy-backend.herokuapp.com';
    //let server: 'http://localhost:3000';
   }

  getAllComment(): Observable<any> {
    return this.http.get('https://academy-backend.herokuapp.com/getComment').pipe(map((gets) => {
      return gets;
    }));
  }


  updateComment(comment, commentId): Observable<any> {
      return this.http.post(`https://academy-backend.herokuapp.com/updateComment/${commentId}`, comment);
    }

  addComment(comment): Observable<any> {
      return this.http.post('https://academy-backend.herokuapp.com/addComment', comment).
      pipe(
         map((data: any) => {
           return data;
         }), catchError( error => {
           return throwError( 'Something went wrong!' );
         })
      );
  }

}
