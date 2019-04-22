import { UserService } from './../../service/user.service';
import { MySQLService } from './../../service/my-sql.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../class/user';
import { NotificationService } from '../../service/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';

  message = {
    show: false,
    text: ['No Error Found']
  };

  constructor(
    private mysql: MySQLService,
    private router: Router,
    private userService: UserService,
    private notificationService: NotificationService,
  ) { }

  reset() {
    this.username = '';
    this.password = '';
  }

  login() {
    let error = false;
    const message = { text: '', status: 'positive' };
    // this.message.text = [];
    if (this.username.length === 0) {
      // this.message.show = true;
      // this.message.text.push('Username cannot be empty');
      error = true;
      message.text = 'Username cannot be empty. ';
      message.status = 'yellow';
    }

    if (this.password.length === 0) {
      // this.message.show = true;
      // this.message.text.push('Password cannot be empty');
      error = true;
      message.text += 'Password cannot be empty. ';
      message.status = 'yellow';
    }

    // if (this.message.show === false) {
    if (error === false) {
      this.mysql.select('users', {
        columns: ['id', 'name', 'authLevel'],
        andWhere: {
          name: this.username,
          password: this.password
        }
      }).subscribe((response: any) => {
        if (response.length === 1) {
          const user = response[0];
          this.notificationService.changeMessage({ text: 'Sucessfully Logged In', status: 'green' });
          this.userService.currentUser = new User(user.id, user.name, Number(user.authLevel));
          this.router.navigate(['/home']);
        } else {
          // this.message.show = true;
          // this.message.text.push('Invalid Username Or Password');
          error = true;
          this.notificationService.changeMessage({ text: 'Invalid Username or Password', status: 'red' });
        }
      });
    } else {
      this.notificationService.changeMessage(message);
      return;
    }
  }

}
