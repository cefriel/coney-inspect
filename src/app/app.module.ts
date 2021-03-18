import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TagsSectionComponent } from './dashboard/sections/grouped/tags-section/tags-section.component';
import { MultipleSectionComponent } from './dashboard/sections/grouped/multiple-section/multiple-section.component';
import { CheckboxSectionComponent } from './dashboard/sections/grouped/checkbox-section/checkbox-section.component';
import { UsersSectionComponent } from './dashboard/sections/per-user/users-section.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthHtppInterceptorService } from './services/auth-services/auth-http-interceptor.service';

import { BackendService } from './services/backend.service';
import { SearchConvService } from './services/utils/search-conv.service';
import { DataRetrievalService } from './services/utils/data-retrieval.service';
import { DataParseService } from './services/utils/data-parse.service';
import { IntroSectionService } from './services/utils/intro-section.service';

import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { NgxPrintModule } from 'ngx-print';

import { ChartsModule } from 'ng2-charts';
import { IntroSectionComponent } from './dashboard/sections/overview/overview-section.component';
import { OpenSectionComponent } from './dashboard/sections/grouped/open-section/open-section.component';
import { DownloadCSVDialogComponent } from './dialog/download/download-csv.dialog.component';
import { LanguageSectionComponent } from './dashboard/sections/filters/filters-section.component';
import { SearchDialogComponent } from './dialog/search/search.dialog.component';
import { ReportSectionComponent } from './dashboard/sections/report/report-section.component';
import { MultipleChoiceChartComponent } from './dashboard/charts/multiple-choice-chart/multiple-choice-chart.component';
import { CheckboxChartComponent } from './dashboard/charts/checkbox-chart/checkbox-chart.component';
import { ToastrModule } from 'ngx-toastr';
import { SideSliderComponent } from './other-components/side-slider/side-slider.component';
import { NavbarComponent } from './other-components/navbar/navbar.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    TagsSectionComponent,
    MultipleSectionComponent,
    CheckboxSectionComponent,
    UsersSectionComponent,
    DashboardComponent,
    LoginComponent,
    LogoutComponent,
    HomeComponent,
    IntroSectionComponent,
    LanguageSectionComponent,
    OpenSectionComponent,
    DownloadCSVDialogComponent,
    SearchDialogComponent,
    ReportSectionComponent,
    MultipleChoiceChartComponent,
    CheckboxChartComponent,
    SideSliderComponent,
    NavbarComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatProgressBarModule,
    MatDialogModule,
    MatChipsModule,
    MatCheckboxModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    MatIconModule,
    MatSlideToggleModule,
    MatRadioModule,
    ChartsModule,
    NgxPrintModule,
    ToastrModule.forRoot()
  ],
  providers: [
    BackendService,
    DataParseService,
    SearchConvService,
    DataRetrievalService,
    IntroSectionService,
    {
      provide: HTTP_INTERCEPTORS, useClass: AuthHtppInterceptorService, multi: true
    },
    BackendService],
  entryComponents: [
    DownloadCSVDialogComponent,
    SearchDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
