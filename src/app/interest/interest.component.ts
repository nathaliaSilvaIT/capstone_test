import { Component, OnInit } from '@angular/core';
import { InterestService } from '../services/interest.service';
import { UserService } from '../services/user.service';
import { SessionStorageService } from 'angular-web-storage';
import {Router} from '@angular/router';

@Component({
  templateUrl: './interest.component.html',
  styleUrls: ['./interest.component.css']
})
export class InterestComponent implements OnInit {
  public interests: any = [];
  private interestsModified: any = [];
  private userData: any = [];
  public users: any = [];
  public userId: any = [];
  logged: any;

  constructor(public interestService: InterestService,
              private userService: UserService,
              private session: SessionStorageService,
              private router: Router
     ) {  }

  ngOnInit() {
    this.logged = this.session.get('logged');
    if (this.logged !== true) {
      this.router.navigate(['signin']);
    }

    this.interests = this.session.get('interest');

    this.users = this.session.get('user');

    if (this.users.user === undefined) {
      this.users = this.users;
    } else {
      this.users = this.users.user;
    }
  }

  // btn Update function
  btnUpdate(id) {
    this.router.navigate(['/updateUser'], { queryParams: { id}});
   }

   updateStatus(id, intid, name, status) {
     let count = 0;
     this.users.interest.forEach(element => {
       if (element._id === id) {
         this.interestsModified[count] = { _id : id,
          interest_id : intid,
          interest_name : name,
          interest_status : status };
       } else {

         this.interestsModified[count] = { _id : element._id,
          interest_id : element.interest_id,
          interest_name : element.interest_name,
          interest_status : element.interest_status };
       }
       count++;
     });

     this.userData = {
                    _id : this.users._id,
                    organization_id : this.users.organization_id,
                    interest: this.interestsModified,
                    event: this.users.event,
                    role: this.users.role,
                    email: this.users.email,
                    password: this.users.password,
                    firstname: this.users.firstname,
                    lastname: this.users.lastname,
                    nickname: this.users.nickname,
                    picture: this.users.picture
            };

     this.userService.updateUser(this.userData, this.users._id).subscribe(data => {
                      data = this.userData;
                      this.session.set('user', data, 0);
                      this.session.set('interest', this.userData.interest, 0);
                      this.router.navigate(['interest']);
                      window.location.reload();
                    });
   }
  }
