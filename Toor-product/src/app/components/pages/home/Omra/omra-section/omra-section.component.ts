import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-omra-section',
  templateUrl: './omra-section.component.html',
  styleUrls: ['./omra-section.component.css']
})
export class OmraSectionComponent implements OnInit {


    constructor() { }
    settings = {
      infinite: true,
      slidesToShow: 4,
      slidesToScroll: 1,
      arrows: true,
      dots: false,
      autoplay: true,
      autoplaySpeed: 2000,
      speed: 500,
      cssEase: 'linear',
      responsive: [{
        breakpoint: 1200,
        settings: {
          arrows: true,
          slidesToShow: 3
        }
      }, {
        breakpoint: 992,
        settings: {
          arrows: true,
          slidesToShow: 2
        }
      }, {
        breakpoint: 768,
        settings: {
          arrows: false,
          dots: true,
          slidesToShow: 2
        }
      }, {
        breakpoint: 576,
        settings: {
          arrows: false,
          dots: true,
          slidesToShow: 1
        }
      }]
    };
    ngOnInit(): void {
    }

  }
