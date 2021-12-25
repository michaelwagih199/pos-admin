import { Component, OnInit } from '@angular/core';
import { Arabic } from 'src/app/text';


@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {

  arabic:Arabic = new Arabic()

  constructor() { }

  ngOnInit(): void {
  }

}
