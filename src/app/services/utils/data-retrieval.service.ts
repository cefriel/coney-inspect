import { BackendService } from '../backend.service';
import { Injectable, Output, Component, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';


@Injectable()
export class DataRetrievalService {

  dataOk = undefined;

  data: any = {
    title: "",
    conversationId: "",
    err: "",
    success: false,
    parsedData: []
  };

  public results$ = new BehaviorSubject<any>({});

  constructor(private backend: BackendService) { }

  public dataGatheringComplete(): Observable<any> {

    if (this.data.success) {
      this.data.ready = true;
      this.results$.next(this.data);
      return this.results$.asObservable();
    }
    
  }

  //Opens the conversation and read the CSV
  conversationChosen(conversationId, conversationTitle) {

    let endpoint = '/data/getAnswersOfConversation';
    endpoint = endpoint + '?conversationId=' + conversationId;

    this.backend.getRequest(endpoint).subscribe(
      (res) => {
        this.data.title = conversationTitle;
        this.data.conversationId = conversationId;

        this.initDataRead(res);

      }, err => {

        this.data.err = "No conversation found";
        this.data.success = false;
        this.dataGatheringComplete();
      }
    );
  }

  //data read initialization
  initDataRead(file) {
    let csvRecordsArray = (<string>file).split(/\r\n|\n/);
    let headersRow = this.getHeaderArray(csvRecordsArray);
    let records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow);

    this.data.success = true;
    this.data.err = "";
    this.data.parsedData = records;
    this.dataGatheringComplete();
  }

  //parse the first row
  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  //gets the rest of the data
  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, header: any) {
    let csvArr = [];
    for (let i = 1; i < csvRecordsArray.length; i++) {

      var currentRecord = (<string>csvRecordsArray[i]).split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      if (currentRecord.length == header.length) {
        let csvRecord: any = {};
        csvRecord.user = currentRecord[header.findIndex(x => x == "user")].trim().replace(/['"]+/g, '');
        csvRecord.question = currentRecord[header.findIndex(x => x == "question")].trim().replace(/["]+/g, '');
        csvRecord.questionId = currentRecord[header.findIndex(x => x == "questionId")].trim();
        csvRecord.questionType = currentRecord[header.findIndex(x => x == "questionType")].trim().replace(/["]+/g, '');
        csvRecord.language = currentRecord[header.findIndex(x => x == "language")].trim().replace(/["]+/g, '');
        csvRecord.meta1 = currentRecord[header.findIndex(x => x == "meta1")].trim().replace(/["]+/g, '');
        csvRecord.meta2 = currentRecord[header.findIndex(x => x == "meta2")].trim().replace(/["]+/g, '');
        csvRecord.tag = currentRecord[header.findIndex(x => x == "tag")].trim().replace(/["]+/g, '');
        csvRecord.option = currentRecord[header.findIndex(x => x == "option")].trim().replace(/["]+/g, '');
        csvRecord.value = currentRecord[header.findIndex(x => x == "value")];
        csvRecord.order = currentRecord[header.findIndex(x => x == "order")];
        csvRecord.freeAnswer = currentRecord[header.findIndex(x => x == "freeAnswer")].trim().replace(/["]+/g, '');
        csvRecord.points = currentRecord[header.findIndex(x => x == "points")].trim();
        csvRecord.date = currentRecord[header.findIndex(x => x == "date")].trim().replace(/['"]+/g, '');
        csvRecord.time = currentRecord[header.findIndex(x => x == "time")].trim().replace(/['"]+/g, '');
        csvRecord.session = currentRecord[header.findIndex(x => x == "session")].trim().replace(/['"]+/g, '');
        csvRecord.totalDuration = currentRecord[header.findIndex(x => x == "totalDuration")].trim().replace(/['"]+/g, '');
        csvArr.push(csvRecord);
      }
    }
    return csvArr;
  }

}