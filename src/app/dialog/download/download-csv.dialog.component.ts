import { Component } from '@angular/core';
import { MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-download-csv-dialog',
  templateUrl: './download-csv.dialog.component.html'
})

export class DownloadCSVDialogComponent {


  isAnonymizeChecked: boolean = false;
  isTrimChecked: boolean = true;
  standardFormatActive: boolean = true;
  simpleFormatActive: boolean = false;

  simpleCard:HTMLElement;
  standardCard:HTMLElement;

  res: {
    anonymize: boolean,
    trim: boolean,
    simplify: boolean,
    confirm: boolean
  }

  constructor(public dialogRef: MatDialogRef<DownloadCSVDialogComponent>) {
    this.res = {
      anonymize: false,
      trim: false,
      simplify: false,
      confirm: false
    }
    
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.simpleCard = document.getElementById("simpleCard");
    this.standardCard = document.getElementById("standardCard");
    
    this.changeFormat("standard");
  }

  changeFormat(format) {
    if (format == "standard") {
      this.simpleFormatActive = false;
      this.standardFormatActive = true;
      this.standardCard.classList.add("active");
      this.simpleCard.classList.remove("active");
    } else {
      this.simpleFormatActive = true;
      this.standardFormatActive = false;
      this.simpleCard.classList.add("active");
      this.standardCard.classList.remove("active");
    }
  }

  save() {
    this.res.anonymize = this.isAnonymizeChecked;
    this.res.trim = this.isTrimChecked;
    this.res.simplify = this.simpleFormatActive;
    this.res.confirm = true;
    this.dialogRef.close(this.res);
  }

  discard() {
    this.res.confirm = false;
    this.dialogRef.close(this.res);
  }

  close() {
    this.res.confirm = false;
    this.dialogRef.close(this.res);
  }

}