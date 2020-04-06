import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { SessionStorageService } from 'angular-web-storage';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  logged: any;
  constructor(private router: Router, private session: SessionStorageService) {  }

  ngOnInit() {
  }

  onSubmit() {
    this.router.navigate(['login']);
  }

  logout() {
    this.session.set('logged', false, 0);
    this.router.navigate(['signin']);
  }


}


