import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { InterestService } from '../services/interest.service';
import { UserService } from '../services/user.service';
import { SessionStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';
import { CommentService } from '../services/comment.service';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})

export class EventComponent implements OnInit {

    constructor(private interestService: InterestService,
                private userService: UserService,
                private postService: PostService,
                private eventService: EventService,
                private commentService: CommentService,
                private session: SessionStorageService,
                private router: Router) {
      this.getEvent();

     }

    events: any;
    comments: any;
    errorOut: any;
    interests: any[];
    users: any;
    hideCom: boolean;
    eventData: any;
    commentData: any;
    checkAnonymous: any;
    postId: any;
    eventUser: any;
    userData: any;
    postOpen: boolean;
    OpenOptions: any[];
    date: Date;
    datenow: any;
    errorDate: any;
    logged: any;

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
      this.hideCom = true;
      this.checkAnonymous = false;
      this.postOpen = false;
      this.errorDate = false;
      this.date= new Date();

      let year = this.date.getFullYear();
      let month = this.date.getMonth() + 1;
      let date = this.date.getDate();
      let hour = this.date.getHours();
      let minutes = this.date.getMinutes();

      let monthCust = '';
      let dateCust = '';
      let hourCust = '';
      let minutesCust = '';

      if (month >= 1 && month <= 9) {
        monthCust = '0' + month.toString();
      } else {
        monthCust = month.toString();
      }

      if (date >= 1 && date <= 9) {
         dateCust = '0' + date.toString();
      } else {
        dateCust = date.toString();
      }

      if (hour >= 1 && hour <= 9) {
         hourCust = '0' + hour.toString();
      } else {
        hourCust = hour.toString();
      }

      if (minutes >= 1 && minutes <= 9) {
         minutesCust = '0' + minutes.toString();
      } else {
        minutesCust = minutes.toString();
      }

      this.datenow = year + '-' + monthCust  + '-' + dateCust  + 'T' + hourCust + ':' + minutesCust;
      console.log(this.datenow);
     }

     hideComments() {
       if (this.hideCom === true) {
         return this.hideCom = false;
       } else {
        return this.hideCom = true;
       }
     }

    getEvent() {
      this.eventService.getAllEvents().subscribe(gets => {
        this.events = gets;
        let count = 0;
        let elementAdd: any;
        this.OpenOptions = [];

        this.events.events.forEach(elementEvents => {
          elementEvents.subscribed.forEach(elementSubcribed => {
            if (elementSubcribed.user_id === this.users._id) {
                        elementAdd = {userSubscribed: true};
                        Object.assign(this.events.events[count], elementAdd);
                }

              });
          this.OpenOptions[elementEvents._id] = 'inactive';
          count++;
        });

        count = 0;
        let elementAddEvent: any;
        this.events.events.forEach(elementEvents => {
                  this.interests.forEach(interestUser => {
                    if ( interestUser.interest_name === elementEvents.interest_id.name) {
                      if (interestUser.interest_status === false) {
                        elementAddEvent = {beVisible: false};
                        Object.assign(this.events.events[count], elementAddEvent);
                      } else {
                        if (elementEvents.date_time >= this.datenow) {
                          elementAddEvent = {beVisible: true};
                          Object.assign(this.events.events[count], elementAddEvent);
                        }

                      }
                    }
                  });
                  count++;
        });
      });
    }

    onChange(isChecked: boolean) {
      this.checkAnonymous = isChecked;
    }

    onSubmitEvent(interest, title, location, content, date, time) {

      console.log(date.value + 'T' + time.value);
      console.log(this.datenow);
      if (date.value + 'T' + time.value >= this.datenow) {
        this.errorDate = false;
          this.eventData = {
              user_id : this.users._id,
              interest_id: interest.value,
              title: title.value,
              location: location.value,
              content: content.value,
              date_time: date.value + 'T' + time.value,
              subscribed: []
        };

          this.eventService.addEvent(this.eventData).subscribe(data => {
                          this.router.navigate(['event']);
                          window.location.reload();
                      });
      }
      else {
        this.errorDate = true;
      }
    }
    onSubscribeEvent(eventIdIn, eventName, subcribedBool) {

      this.eventService.getEventById(eventIdIn).subscribe(gets => {
        this.events = gets.event;

        const subscribeIn = [];
        let count = 0;
        if (this.events.subscribed !== null && this.events.subscribed !== []) {
          this.events.subscribed.forEach(element => {
            subscribeIn[count] = {user_id : element.user_id};
            count++;
          });
        }


        subscribeIn[count] = {user_id : this.users._id};

        this.eventData = {
                                      id : eventIdIn,
                                      user_id : this.events.user_id,
                                      interest_id: this.events.interest_id,
                                      title: this.events.title,
                                      location: this.events.location,
                                      date_time: this.events.date_time,
                                      subscribed: subscribeIn
                                    };

        this.eventService.updateEvent(this.eventData, eventIdIn).subscribe(dataUpdatePost => {
                                            });

        let countUser = 0;
        this.eventUser = [];

        if (this.users.event !== undefined && this.users.event !== null && this.users.event !== [] ) {

          this.users.event.forEach(element => {
            this.eventUser[countUser] = {
              event_id : element.event_id,
              event_name : element.event_name,
              event_status : element.event_status
            };
            countUser++;
              });
          this.eventUser[countUser] = { event_id : eventIdIn,
            event_name : eventName,
            event_status : subcribedBool };

        } else {
          this.eventUser[0] = { event_id : eventIdIn,
            event_name : eventName,
            event_status : subcribedBool};
        }

        this.userData = {
                                              _id : this.users._id,
                                              organization_id : this.users.organization_id,
                                              interest: this.users.interest,
                                              event: this.eventUser,
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
                                              this.session.set('event', data.event, 0);
                                              this.router.navigate(['event']);
                                              window.location.reload();
                                            });

      });


    }

     // btn delete function
     btnDelete(id) {
      this.eventService.deleteEvent(id).subscribe(data => {
        // this.router.navigate(['event']);
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

  }
