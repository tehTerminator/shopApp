import { DirectoryService } from './service/directory.service';
import { AppRouterModule } from './../module/app-router/app-router.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
    AssignTaskComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRouterModule,
  ],
  providers: [DirectoryService, NotificationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
