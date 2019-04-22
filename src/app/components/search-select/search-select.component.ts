import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-search-select',
  templateUrl: './search-select.component.html',
  styleUrls: ['./search-select.component.css']
})
export class SearchSelectComponent implements OnInit {
  // @Input() source: any;
  @Input() someData: string;

  ngOnInit() {
    
  }

  changeData() {
    this.someData = 'This is Changed Data';
  }
}
