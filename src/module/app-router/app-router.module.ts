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
  },
  {
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
  },
  {
    path: 'cashbook/combined', component: CombinedCashbookComponent
  },
  {
    path: 'report/operator', component: OperatorReportComponent
  },
  {
    path: 'report/acMonthly', component: CalendarViewComponent
  },
  {
    path: 'admin/dictionary', component: WordListComponent
  },
  {
    path: 'report/dailyEarning', component: DailyEarningComponent
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
