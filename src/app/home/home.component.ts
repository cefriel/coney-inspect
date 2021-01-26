import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { SearchConvService } from '../services/utils/search-conv.service';
import { DataRetrievalService } from '../services/utils/data-retrieval.service';
import { DownloadCSVDialogComponent } from '../dialog/download/download-csv.dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { trigger, style, animate, transition } from '@angular/animations';
import { SearchDialogComponent } from '../dialog/search/search.dialog.component';


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

  interface = "search"; //displayed screen

  constructor(private dataRetrievalService: DataRetrievalService,
    private searchConvService: SearchConvService,
    public dialog: MatDialog,
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
    console.log(sessionStorage.getItem("conv"));

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
        this.selectedConversation(res);
    });
  }

  selectedConversation(event) {
    console.log("selected  conv: ")
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

    console.log("searching survey ")
    this.rawAnswers = [];
  }


  getData(conversationId, conversationTitle) {
    console.log("data requested for: "+conversationTitle);
    this.loading = true;
    this.dataRetrievalService.conversationChosen(conversationId, conversationTitle);
    this.dataRetrievalSubscription = this.dataRetrievalService.results$.subscribe(
      res => {
        
        if(res.conversationId != conversationId || res.parsedData == undefined){
          return;}
          
          console.log(res);

        this.loading = false;
        this.rawAnswers = res.parsedData;
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

  //utils
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
          //this.downloadData("csv", res.trim, res.anonymize, false);
        }
      }
    });
  }

  
  navigateToHome() {
    if(environment.enterprise){
      var url = environment.baseUrl + "/home";
      window.location.href = url;
    } else{
      this.openSearchDialog();
    }
  }

  
  stopSearchSubscription(){
    this.convSearchSubscription.unsubscribe();
  }

  stopDataSubscription(){
    this.dataRetrievalSubscription.unsubscribe();
  }
}
