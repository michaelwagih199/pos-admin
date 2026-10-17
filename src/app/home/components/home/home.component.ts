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
    standalone: false
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
  // Phase B (§5 step 6): WebP at 1920px wide. The originals were 5300-8000px
  // JPEGs totalling 13.67 MB; the template renders these through an
  // object-fit: cover box, so downscaling changes no framing.
  images: ImagesModel[] = [
    { src: 'assets/home4.webp', header: 'Omelnour Eco Systems', discription: '' },
    { src: 'assets/home2.webp', header: 'Together We Can', discription: '' },
    { src: 'assets/home.webp', header: 'Do your Work Quietly', discription: '' },
    { src: 'assets/home5.webp', header: 'Never Stop Dreaming', discription: '' },
  ];
}
