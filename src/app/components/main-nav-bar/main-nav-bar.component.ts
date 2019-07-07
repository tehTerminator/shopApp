import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { User } from '../../class/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-nav-bar',
  templateUrl: './main-nav-bar.component.html',
  styleUrls: ['./main-nav-bar.component.css']
})
export class MainNavBarComponent {

  constructor(public user: UserService, private router: Router,) { }

  logout(): void{
    this.user.currentUser = new User(0, 'Anonymous', 0);
    this.router.navigate(['/login']);
  }

}
