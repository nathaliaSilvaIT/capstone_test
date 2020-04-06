import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from 'angular-web-storage';
import {Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../services/user.service';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css']
})
export class MyprofileComponent implements OnInit {
  public users: any = [];
  public interests: any = [];
  public role: any;
  private userData: any;
  userId: any;
  event: any;
  overviewOpen: boolean;
  errorMessage: any;
  imageSrc: any;
  messageText = '';
  logged: any;

  public imageButtons = [ {src: '../../assets/images/logo/bear-animal-cartoon.png', name: 'bear'},
  {src: '../../assets/images/logo/beaver-animal-cartoon.png', name: 'beaver'},
  {src: '../../assets/images/logo/hedgehog-animal-cartoon.png', name: 'hedgehog'},
  {src: '../../assets/images/logo/raccoon-animal-cartoon.png', name: 'raccoon'},
  {src: '../../assets/images/logo/seal-animal-cartoon.png', name: 'seal'},
  {src: '../../assets/images/logo/turtle-animal-cartoon.png', name: 'turtle'}
];
pictureOut: any;
pictureNext: any;
  constructor(private session: SessionStorageService,
              private userService: UserService,
              private eventService: EventService,
              private router: Router,
              private http: HttpClient) {  }

  ngOnInit() {
    this.logged = this.session.get('logged');
    if (this.logged !== true) {
      this.router.navigate(['signin']);
    }


    this.users = this.session.get('user');

    if (this.users.user === undefined) {
      this.users = this.users;
    } else {
      this.users = this.users.user;
    }
    this.interests = this.session.get('interest');

    this.event = this.session.get('event');

    this.pictureOut = this.checkImage(this.users.picture);
    this.imageSrc = this.imageButtons[this.pictureOut].src;
    this.overviewOpen = false;
    this.errorMessage = false;
  }

  onSubmit(nickname) {
      if (nickname.value !== '') {
        this.errorMessage = false;
        this.userData = {
          _id : this.users._id,
          organization_id : this.users.organization_id,
          interest: this.users.interest,
          event: this.users.event,
          role: this.users.role,
          email: this.users.email,
          password: this.users.password,
          firstname: this.users.firstname,
          lastname: this.users.lastname,
          nickname: nickname.value,
          picture: this.users.picture
        };

        this.userService.updateUser(this.userData, this.users._id).subscribe(data => {
            this.session.set('user', this.userData, 0);
            data = this.userData;
            this.session.set('user', data, 0);
            this.router.navigate(['updateUser']);
            window.location.reload();
          });
      }
      else {
        this.errorMessage = true;
      }

   }

   onClickImage() {
     if (this.pictureOut >= 5) {
      this.pictureOut =  0;
      this.pictureNext = 0;
     } else {
      this.pictureOut =  this.pictureOut + 1;
      this.pictureNext = this.pictureOut;
     }

     this.imageSrc = this.imageButtons[this.pictureNext].src;
  }

  checkImage(pictureIn) {
    if (pictureIn.includes('bear')) {
      return 0;
    } else if (pictureIn.includes('beaver')) {
      return 1;
    } else if (pictureIn.includes('hedgehog')) {
      return 2;
    } else if (pictureIn.includes('raccoon'))  {
      return 3;
    } else if (pictureIn.includes('seal')) {
      return 4;
    } else if (pictureIn.includes('turtle')) {
      return 5;
    }

  }

  onClickSaveImage() {
    this.userData = {
      _id : this.users._id,
      organization_id : this.users.organization_id,
      interest: this.users.interest,
      event: this.users.event,
      role: this.users.role,
      email: this.users.email,
      password: this.users.password,
      firstname: this.users.firstname,
      lastname: this.users.lastname,
      nickname: this.users.nickname,
      picture: this.imageSrc
  };

    this.userService.updateUser(this.userData, this.users._id).subscribe(data => {
        this.session.set('user', this.userData, 0);
        data = this.userData;
        this.session.set('user', data, 0);
        this.router.navigate(['updateUser']);
      });
  }
  OverviewOpen(bool) {
    if (bool !== undefined || bool !== null) {
      if (this.overviewOpen === true) {
        this.overviewOpen = false;
        return this.overviewOpen;
      } else {
       return this.overviewOpen = true;
      }
    } else {
      return this.overviewOpen = bool;
    }
  }
}
