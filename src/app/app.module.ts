import { DirectoryService } from './service/directory.service';
import { AppRouterModule } from './../module/app-router/app-router.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MainNavBarComponent } from './components/main-nav-bar/main-nav-bar.component';
import { HomeComponent } from './page/home/home.component';
import { LoginComponent } from './page/login/login.component';
import { SearchSelectComponent } from './components/search-select/search-select.component';
import { DirectoryComponent } from './page/directory/directory.component';
import { DirectoryTableComponent } from './components/directory-table/directory-table.component';
import { DirectoryFormComponent } from './components/directory-form/directory-form.component';
import { AdminComponent } from './page/admin/admin.component';
import { NotificationSegmentComponent } from './components/notification-segment/notification-segment.component';
import { BatchFormComponent } from './page/batch-form/batch-form.component';
import { ListBatchComponent } from './page/list-batch/list-batch.component';
import { SearchPipe } from './pipes/search.pipe';
import { CreateTaskComponent } from './page/create-task/create-task.component';
import { CashBookFormComponent } from './components/cash-book-form/cash-book-form.component';
import { CashBookTableComponent } from './components/cash-book-table/cash-book-table.component';
import { CashBookComponent } from './page/cash-book/cash-book.component';
import { TaskComponent } from './page/task/task.component';
import { CashDetailsComponent } from './components/cash-details/cash-details.component';
import { NewDataFormComponent } from './components/new-data-form/new-data-form.component';
import { LiveViewComponent } from './page/live-view/live-view.component';
import { TaskLabelComponent } from './components/task-label/task-label.component';
import { AccountDetailsComponent } from './page/account-details/account-details.component';
import { NotificationService } from './service/notification.service';
import { AccountBalanceComponent } from './page/account-balance/account-balance.component';
import { AssignTaskComponent } from './components/assign-task/assign-task.component';
import { DayReportComponent } from './page/day-report/day-report.component';
import { AccountCardComponent } from './components/account-card/account-card.component';
import { ReportComponent } from './page/report/report.component';
import { AbsPipe } from './pipes/abs.pipe';
import { MyTaskComponent } from './page/my-task/my-task.component';
import { CombinedCashbookComponent } from './page/combined-cashbook/combined-cashbook.component';
import { LedgerDateRangeComponent } from './page/ledger-date-range/ledger-date-range.component';
import { OperatorReportComponent } from './page/operator-report/operator-report.component';
import { CalendarViewComponent } from './page/calendar-view/calendar-view.component';
import { TaskEntryFormComponent } from './components/task-entry-form/task-entry-form.component';
import { WordListComponent } from './page/word-list/word-list.component';
import { DailyEarningComponent } from './page/daily-earning/daily-earning.component';
import {NgxMaskModule, IConfig} from 'ngx-mask';
import { TaskCounterComponent } from './components/task-counter/task-counter.component';
import { SlotViewComponent } from './components/slot-view/slot-view.component';
import { SearchTaskByNameComponent } from './components/search-task-by-name/search-task-by-name.component';
import { ManageTaskComponent } from './page/manage-task/manage-task.component';
import { TaskReportComponent } from './page/task-report/task-report.component'
import { DatePipe } from '@angular/common';
import { ProductCounterComponent } from './components/product-counter/product-counter.component';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  declarations: [
    AppComponent,
    MainNavBarComponent,
    HomeComponent,
    LoginComponent,
    SearchSelectComponent,
    DirectoryComponent,
    DirectoryTableComponent,
    DirectoryFormComponent,
    AdminComponent,
    NotificationSegmentComponent,
    BatchFormComponent,
    ListBatchComponent,
    SearchPipe,
    CreateTaskComponent,
    CashBookFormComponent,
    CashBookTableComponent,
    CashBookComponent,
    TaskComponent,
    CashDetailsComponent,
    NewDataFormComponent,
    LiveViewComponent,
    TaskLabelComponent,
    AccountDetailsComponent,
    AccountBalanceComponent,
    AssignTaskComponent,
    DayReportComponent,
    AccountCardComponent,
    ReportComponent,
    AbsPipe,
    MyTaskComponent,
    CombinedCashbookComponent,
    LedgerDateRangeComponent,
    OperatorReportComponent,
    CalendarViewComponent,
    TaskEntryFormComponent,
    WordListComponent,
    DailyEarningComponent,
    TaskCounterComponent,
    SlotViewComponent,
    SearchTaskByNameComponent,
    ManageTaskComponent,
    TaskReportComponent,
    ProductCounterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRouterModule,
    BrowserAnimationsModule,
    NgxMaskModule.forRoot(options)
  ],
  providers: [DirectoryService, NotificationService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
