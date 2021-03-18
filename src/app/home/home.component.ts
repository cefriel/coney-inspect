import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { SearchConvService } from '../services/utils/search-conv.service';
import { DataRetrievalService } from '../services/utils/data-retrieval.service';
import { DownloadCSVDialogComponent } from '../dialog/download/download-csv.dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment';
import { trigger, style, animate, transition } from '@angular/animations';
import { SearchDialogComponent } from '../dialog/search/search.dialog.component';
import { BackendService } from '../services/backend.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  title = 'Coney Inspect';

  loading = false;
  user = undefined;
  enterprise = true;
  dataRetrievalSubscription: any;
  convSearchSubscription: any;

  conversations = [];
  projects = [];
  rawAnswers: any = [];
  meta1: any = [];
  meta2: any = [];
  orderedQuestions: any = [];

  interface = "search"; //displayed screen

  constructor(private dataRetrievalService: DataRetrievalService,
    private searchConvService: SearchConvService,
    public backend: BackendService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.enterprise = environment.enterprise;
    this.loading = true;
    this.title = "Coney Inspect";
    this.initialize();
  }

  initialize() {
    this.loading = true;

    if (sessionStorage.getItem("conv") == null) {

      sessionStorage.removeItem("conv");
      sessionStorage.removeItem("title");

      this.title = "Coney Inspect";

      this.getConversations();

    } else {

      //I have session data
      this.title = sessionStorage.getItem("title");
      this.getData(sessionStorage.getItem("conv"), sessionStorage.getItem("title"));

    }

  }

  getConversations() {
    this.searchConvService.getConversations();
    this.convSearchSubscription = this.searchConvService.results$.subscribe(
      res => {
        if (res.success) {
          this.loading = false;
          this.conversations = res.conversations;
          this.projects = res.projects;
          this.stopSearchSubscription();
          this.openSearchDialog()
        }
      }
    )
  }


  openSearchDialog(){
    
    const dialogRef = this.dialog.open(SearchDialogComponent, {
      maxWidth: '90%',
      maxHeight: '90vh',
      data: {
        conversations: this.conversations,
        projects: this.projects
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if(res!=undefined){
        this.selectedConversation(res);
      }
    });
  }

  selectedConversation(event) {
    var oldConv = sessionStorage.getItem("conv");

    if(event==undefined && oldConv == null){
      this.resetData();
      this.loading = false;
      return;
    }

    if(event == undefined || oldConv == event.conversationId){ return;}

    this.loading = true;
    sessionStorage.setItem("conv", event.conversationId);
    sessionStorage.setItem("title", event.conversationTitle);
    
    this.title = event.conversationTitle;
    this.getData(event.conversationId,event.conversationTitle);

  }

  resetData(){
    this.title = "Coney Inspect";
    sessionStorage.removeItem("conv");
    sessionStorage.removeItem("title");
    this.rawAnswers = [];
  }


  getData(conversationId, conversationTitle) {
    this.loading = true;
    this.dataRetrievalService.conversationChosen(conversationId, conversationTitle);
    this.dataRetrievalSubscription = this.dataRetrievalService.results$.subscribe(
      res => {
        
        if(res.conversationId != conversationId || res.parsedData == undefined){
          return;}
          
        this.loading = false;
        this.rawAnswers = res.parsedData;
        this.orderedQuestions = res.orderedQuestions;
        this.meta1 = res.meta1;
        this.meta2 = res.meta2;
        if (res.success) {
          this.stopDataSubscription();
        }

      }
    )
  }

  stopLoading(){
    this.loading = false;
  }

  changeSurvey() {
    if(this.conversations.length==0){
      this.getConversations();
    } else {
      this.openSearchDialog();
    }
  }

  refreshData() {
    this.rawAnswers = [];
    this.loading = true;
    this.getData(sessionStorage.getItem("conv"), sessionStorage.getItem("title"));
  }

  //data export
  exportData() {
    const dialogRef = this.dialog.open(DownloadCSVDialogComponent, {
      maxWidth: '80%',
      maxHeight: '85vh',
      data: {}
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res !== undefined && res.confirm !== undefined && res.confirm) {
        if (res.simplify) {
          //this.downloadData("csv", res.trim, res.anonymize, true);
        } else {
          this.downloadData("csv", res.trim, res.anonymize, false);
        }
      }
    });
  }

  //data download
  downloadData(type: string, trim: boolean, anonymize: boolean, simplify: boolean) {

    if(sessionStorage.getItem("conv") == null || sessionStorage.getItem("conv") == '' || sessionStorage.getItem("conv")==undefined){
      return;
    }

    this.loading = true;
    var strt = "";
    var end = ".csv";
    var reqType = "text/csv"
    var endpoint = "/data/";

    
    endpoint += "getAnswersOfConversation";
    strt = "res_csv_";
    
    endpoint += "?conversationId=" + sessionStorage.getItem("conv");
    if (trim) {
      endpoint += "&trim=true"
    }

    if (anonymize) {
      endpoint += "&anonymize=true"
    }

    if(simplify){
      endpoint+="&simplify=true";
    }

    this.backend.getRequest(endpoint).subscribe(res => {
      this.loading = false;

      const blob = new Blob([res], { type: reqType });

      saveAs(blob, strt + sessionStorage.getItem("title") + end);
    }, err => {
      this.loading = false;
      this.operationFeedbackMessage("error", "Unable to download requested file");
    });

  }
  
  //utils methods


  operationFeedbackMessage(type: string, msg: string) {
    switch (type) {
      case "success":
        this.toastr.success(msg, '');
        break;
      case "info":
        this.toastr.info(msg, '');
        break;
      case "warning":
        this.toastr.warning(msg, '');
        break;
      case "error":
        this.toastr.error(msg, '');
        break;
    }
  }

  stopSearchSubscription(){
    this.convSearchSubscription.unsubscribe();
  }

  stopDataSubscription(){
    this.dataRetrievalSubscription.unsubscribe();
  }
}
