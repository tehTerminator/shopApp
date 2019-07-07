import { AccountBalanceComponent } from './../../app/page/account-balance/account-balance.component';
import { AccountDetailsComponent } from './../../app/page/account-details/account-details.component';
import { LiveViewComponent } from './../../app/page/live-view/live-view.component';
import { TaskComponent } from './../../app/page/task/task.component';
import { CashBookComponent } from './../../app/page/cash-book/cash-book.component';
import { CreateTaskComponent } from './../../app/page/create-task/create-task.component';
import { ListBatchComponent } from './../../app/page/list-batch/list-batch.component';
import { BatchFormComponent } from './../../app/page/batch-form/batch-form.component';
import { AdminComponent } from './../../app/page/admin/admin.component';
import { DirectoryComponent } from './../../app/page/directory/directory.component';
import { LoginComponent } from './../../app/page/login/login.component';
import { HomeComponent } from './../../app/page/home/home.component';
import { DayReportComponent } from './../../app/page/day-report/day-report.component';
import { ReportComponent } from './../../app/page/report/report.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyTaskComponent } from '../../app/page/my-task/my-task.component';

const routes: Routes = [
  {
    path: 'home', component: HomeComponent
  },
  {
    path: 'directory', component: DirectoryComponent
  },
  {
    path: 'cashbook/view', component: AccountDetailsComponent
  },
  {
    path: 'admin', component: AdminComponent
  },
  {
    path: 'task/liveView', component: LiveViewComponent
  },
  {
    path: '', redirectTo: '/login', pathMatch: 'full'
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'batch', component: ListBatchComponent
  },
  {
    path: 'task/create', component: CreateTaskComponent
  },
  {
    path: 'cashbook', component: CashBookComponent
  },
  {
    path: 'task', component: TaskComponent
  },
  {
    path: 'batch/create', component: BatchFormComponent
  }, {
    path: 'cashbook/balance', component: AccountBalanceComponent
  },
  {
    path: 'report/day', component: DayReportComponent
  },
  {
    path: 'report', component: ReportComponent
  },
  {
    path: 'task/myTask', component: MyTaskComponent
  }

];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRouterModule { }
