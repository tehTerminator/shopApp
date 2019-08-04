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
import { CombinedCashbookComponent } from '../../app/page/combined-cashbook/combined-cashbook.component';
import { OperatorReportComponent } from './../../app/page/operator-report/operator-report.component';
import { CalendarViewComponent } from '../../app/page/calendar-view/calendar-view.component';
import { WordListComponent } from '../../app/page/word-list/word-list.component';
import { DailyEarningComponent } from '../../app/page/daily-earning/daily-earning.component';
import { TaskReportComponent } from './../../app/page/task-report/task-report.component';

const routes: Routes = [
  {
    path: '', redirectTo: '/login', pathMatch: 'full'
  },
  {
    path: 'home', component: HomeComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'task', component: TaskComponent
  },
  {
    path: 'task/create', component: CreateTaskComponent
  },
  {
    path: 'task/liveView', component: LiveViewComponent
  },
  {
    path: 'task/myTask', component: MyTaskComponent
  },
  {
    path: 'cashbook', component: CashBookComponent
  },
  {
    path: 'cashbook/combined', component: CombinedCashbookComponent
  },
  {
    path: 'cashbook/balance', component: AccountBalanceComponent
  },
  {
    path: 'cashbook/view', component: AccountDetailsComponent
  },
  {
    path: 'report', component: ReportComponent
  },
  {
    path: 'report/day', component: DayReportComponent
  },
  {
    path: 'report/operator', component: OperatorReportComponent
  },
  {
    path: 'report/acMonthly', component: CalendarViewComponent
  },
  {
    path: 'report/dailyEarning', component: DailyEarningComponent
  },
  {
    path: 'report/task', component: TaskReportComponent
  },
  {
    path: 'admin', component: AdminComponent
  },
  {
    path: 'admin/directory', component: DirectoryComponent
  },
  {
    path: 'admin/batch/create', component: BatchFormComponent
  },
  {
    path: 'admin/dictionary', component: WordListComponent
  },
  {
    path: 'admin/batch/list', component: ListBatchComponent
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
