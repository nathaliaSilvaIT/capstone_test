import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { InterestService } from '../services/interest.service';
import { UserService } from '../services/user.service';
import { SessionStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';
import { CommentService } from '../services/comment.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public interestService: InterestService,
              private userService: UserService,
              private postService: PostService,
              private commentService: CommentService,
              private session: SessionStorageService,
              private router: Router) {
    this.getPost();


   }
  logged: any;
  posts: any;
  comments: any;
  errorOut: any;
  interests: any[];
  users: any;
  hideCom: boolean;
  postData: any;
  commentData: any;
  checkAnonymous: any;
  postId: any;
  postOpen: boolean;
  OpenOptions: any[];
  OpenComments: any[];
  OpenOptionsBoolean: boolean;

  ngOnInit() {
    this.interests = this.session.get('interest');
    this.users = this.session.get('user');

    this.logged = this.session.get('logged');
    if (this.logged !== true) {
      this.router.navigate(['signin']);
    }


    if (this.users.user === undefined) {
      this.users = this.users;
    } else {
      this.users = this.users.user;
    }
    this.hideCom = true;
    this.checkAnonymous = false;
    this.postOpen = false;
   }


   checkAnonymousFun() {
    if (this.checkAnonymous === true) {
      this.checkAnonymous = false;
      return this.checkAnonymous;
    } else {
     return this.checkAnonymous = true;
    }
  }

  getPost() {

    this.postService.getAllPosts().subscribe(gets => {
      this.posts = gets;

      this.comments = this.posts.comment;

      let count = 0;
      this.OpenOptions = [];
      this.OpenComments = [];
      let elementAdd: any;
      this.posts.posts.forEach(elementPosts => {
                this.interests.forEach(interestUser => {
                  if ( interestUser.interest_name === elementPosts.interest_id.name) {
                    if (interestUser.interest_status === false) {
                      elementAdd = {beVisible: false};
                      Object.assign(this.posts.posts[count], elementAdd);
                    } else {
                      elementAdd = {beVisible: true};
                      Object.assign(this.posts.posts[count], elementAdd);
                    }
                  }
                });
                let classAdd = {className: 'ed-opts-open-' + elementPosts._id};
                Object.assign(this.posts.posts[count], classAdd);

                this.OpenOptions[elementPosts._id] = 'inactive';
                this.OpenComments[elementPosts._id] = 'false';
                count++;
      });
    });
  }

  onChange(isChecked: boolean) {
    this.checkAnonymous = isChecked;
  }

  onSubmitPost(interest, content) {
        this.postData = {
            user_id : this.users._id,
            interest_id: interest.value,
            is_anonymous: this.checkAnonymous,
            content: content.value,
            comment: []
      };

        this.postService.addPost(this.postData).subscribe(data => {
                        this.router.navigate(['home']);
                        window.location.reload();
                    });
    }

onSubmitComment(post_id_in, commentContent) {
      this.postId = post_id_in;
      this.commentData = {
          user_id : this.users._id,
          post_id: post_id_in,
          content: commentContent.value,
    };

      this.commentService.addComment(this.commentData).subscribe(dataCom => {
                      this.postService.getPostById(post_id_in).subscribe(dataPost => {
                                dataPost = dataPost.post;

                                const commentsIn = [];
                                let count = 0;
                                dataPost.comment.forEach(element => {
                                  commentsIn[count] = {comment_id : element.comment_id};
                                  count++;
                                });

                                commentsIn[count] = {comment_id : dataCom.createdComment._id};

                                this.postData = {
                                  user_id : dataPost.user_id,
                                  interest_id: dataPost.interest_id,
                                  is_anonymous: dataPost.is_anonymous,
                                  content: dataPost.content,
                                  created_at: dataPost.created_at,
                                  comment: commentsIn
                                };

                                this.postService.updatePost(this.postData, this.postId).subscribe(dataUpdatePost => {
                                  this.router.navigate(['home']);
                                  window.location.reload();
                                });

                        });
                  });




  }

   // btn delete function
   btnDelete(id) {
    this.postService.deletePost(id).subscribe(data => {
      // this.router.navigate(['home']);
      });

  }

  OpenPost(bool) {
    if(bool !== undefined || bool !== null)
    {
      if (this.postOpen === true) {
        this.postOpen = false;
        return this.postOpen;
      } else {
       return this.postOpen = true;
      }
    }
    else
    {
      return this.postOpen = bool;
    }
  }

  OpenOption(postId) {

      if (this.OpenOptions[postId] === 'active') {
          this.OpenOptions[postId] = 'inactive';
          return this.OpenOptions[postId];
      } else {
          this.OpenOptions[postId] = 'active';
          return this.OpenOptions[postId];
      }
  }

  OpenComment(postId) {

    if (this.OpenComments[postId] === 'true') {
        this.OpenComments[postId] = 'false';
        return this.OpenComments[postId];
    } else {
        this.OpenComments[postId] = 'true';
        return this.OpenComments[postId];
    }
}

}

