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
  asideLeft = false;
  asideRight = true;

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
    });
  }

  getUsers() {
    this.mysql.select('users').subscribe((response: any) => {
      this.users = response;
    });
  }

  getWidth() {
    if ( this.asideLeft && this.asideRight ) {
      return 'ten wide column';
    } else if ( this.asideLeft || this.asideRight ) {
      return 'thirteen wide column';
    } else {
      return 'sixteen wide column';
    }
  }

  columnCount() {
    if ( this.asideLeft && this.asideRight ) {
      return 'ui three column divided padded stackable grid';
    } else if ( this.asideLeft || this.asideRight ) {
      return 'ui two column divided padded stackable grid';
    } else {
      return 'ui one column divided padded stackable grid';
    }
  }

  toggleLeftSideBar() {
    this.asideLeft = !this.asideLeft;
  }

  toggleRightSideBar() {
    this.asideRight = !this.asideRight;
  }

}
