import { DirectoryService } from './service/directory.service';
import { UserService } from './service/user.service';
import { MySQLService } from './service/my-sql.service';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'shopApp';
  users = [];

  constructor(
    private mysql: MySQLService,
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        if (e.url !== '/login' && !this.userService.isLoggedIn()) {
          this.router.navigate(['/login']);
        }
      }
    })
  }

  getUsers() {
    this.mysql.select('users').subscribe((response: any) => {
      this.users = response;
    });
  }
}
