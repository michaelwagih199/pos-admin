import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

interface ImagesModel {
  src: string;
  header: string;
  discription: string;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  showNavigationArrows = false;
  showNavigationIndicators = false;

  constructor(private config: NgbCarouselConfig) {
    // customize default values of carousels used by this component tree
    this.config.interval = 10000;
    this.config.wrap = false;
    this.config.keyboard = false;
    this.config.pauseOnHover = false;
  }

  ngOnInit(): void { }
  images: ImagesModel[] = [
    { src: 'assets/home4.jpg', header: 'Omelnour Eco Systems', discription: '' },
    { src: 'assets/home2.jpg', header: 'Together We Can', discription: '' },
    { src: 'assets/home.jpg', header: 'Do your Work Quietly', discription: '' },
    { src: 'assets/home5.jpg', header: 'Never Stop Dreaming', discription: '' },
  ];
}
