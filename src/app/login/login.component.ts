import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {SessionStorageService} from 'angular-web-storage';
import { InterestService } from '../services/interest.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {

  UserDataDB: any;
  submitted = false;
  redirect = 0;
  message: any;
  errorMessage: any;
  userData: any;
  userId: any;
  allInterest: any;
  interestsModified: any = [];
  interestsObject: object;
  postOpen: boolean;
  logged: any;
  constructor(private router: Router,
              private session: SessionStorageService,
              private userService: UserService,
              private interestService: InterestService,
              private _route: ActivatedRoute
              ) {  }

  ngOnInit( ) {
    this.logged = this.session.get('logged');

    this.errorMessage = false;
    this.userService.getAllUser().subscribe(data => {
      this.UserDataDB = data;
    });
    this.postOpen = true;
   }

  onSubmit(username, password) {
    if (username.value.includes('@georgebrown.ca') === false) {
      this.errorMessage = true;
    } else {
      for (const iterator of this.UserDataDB.users) {
        if (username.value === iterator.email && password.value === iterator.password ) {
          this.errorMessage = true;
          this.session.set('logged', true, 0);
          this.session.set('interest', iterator.interest, 0);
          this.session.set('event', iterator.event, 0);
          this.session.set('user', iterator, 0);
          //waits(1000);
          this.router.navigate(['/home']);
          //thread.sleep(3000)
          //window.location.reload();
          //this.router.navigate(['home'], {queryParams: { 'authentication': 'Sucessful'}});
        } else {
          this.errorMessage = true;
        }
      }
    }


  }

  registerUser(firstname, lastname, nickname, email, password) {
    this.interestService.getAllInterests().subscribe(gets => {
      this.allInterest = gets;
      let count = 0;
      this.allInterest.interests.forEach(element => {
        this.interestsModified[count] = {
        interest_id : element._id,
        interest_name : element.name,
        interest_status : false
      };
        count++;
     });

      this.userData = {
            organization_id : '5e210bc35db23341c0d87f6e',
            interest: this.interestsModified,
            event: [],
            role: 'Student',
            email: email.value,
            password: password.value,
            firstname: firstname.value,
            lastname: lastname.value,
            nickname: nickname.value,
            picture: '../../assets/images/logo/bear-animal-cartoon.png',
      };


      this.userService.addUser(this.userData).subscribe(data => {
                        this.userData = {
                          _id : data.createdUser._id,
                          organization_id : data.createdUser.organization_id,
                          interest: data.createdUser.interest,
                          event: [],
                          role: data.createdUser.role,
                          email: data.createdUser.email,
                          password: data.createdUser.password,
                          firstname: data.createdUser.firstname,
                          lastname: data.createdUser.lastname,
                          nickname: data.createdUser.nickname,
                          picture: data.createdUser.picture,
                        };

                        this.session.set('user', this.userData, 0);
                        this.session.set('interest', data.createdUser.interest, 0);
                        this.session.set('event', [], 0);
                        this.session.set('logged', true, 0);
                        this.router.navigate(['home']);
                    });
    });
   }


OpenPost(bool) {
  if (bool !== undefined || bool !== null) {
    if (bool !== this.postOpen) {
      if (this.postOpen === true) {
        this.postOpen = false;
        return this.postOpen;
      } else {
        return this.postOpen = true;
      }
    }
  } else {
    return this.postOpen = bool;
  }
}

}



