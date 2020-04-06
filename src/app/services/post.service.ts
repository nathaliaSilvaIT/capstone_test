import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Posts } from '../models/post.model';
import { HttpClient } from '@angular/common/http';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) {}

  getAllPosts(): Observable<any> {
    return this.http.get('https://academy-backend.herokuapp.com/getPost').pipe(map((gets) => {
      return gets;
    }));
  }

  getPostById(postId): Observable<any> {
    return this.http.get(`https://academy-backend.herokuapp.com/getPost/${postId}`).pipe(map((gets) => {
      return gets;
    }));
  }

  updatePost(post, postId): Observable<any> {
    return this.http.post(`https://academy-backend.herokuapp.com/updatePost/${postId}`, post);
  }

  deletePost(postId): Observable<any> {
      return this.http.delete(`https://academy-backend.herokuapp.com/deletePost/${postId}`, postId);
    }

    addPost(post): Observable<any> {
      return this.http.post('https://academy-backend.herokuapp.com/addPost', post).
      pipe(
         map((data: any) => {
           return data;
         }), catchError( error => {
           return throwError( 'Something went wrong!' );
         })
      );
  }

}
