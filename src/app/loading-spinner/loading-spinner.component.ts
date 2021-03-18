import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.css']
})
export class LoadingSpinnerComponent implements OnInit {
  @Input() loading;
  @Output() stopLoading = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  closeLoading(){
    this.stopLoading.emit();
  }

}
