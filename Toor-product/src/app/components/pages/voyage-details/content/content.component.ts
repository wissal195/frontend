import { Component, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HotelHelperService } from 'src/app/components/helper/hotel/hotel-helper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { VoyageDetailsService, Annonce, Itineraire } from 'src/app/components/pages/voyage-details/services/voyageDetails.service';
import { ImageService } from 'src/app/components/pages/tableau-de-bord/services/image.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent extends HotelHelperService {

  idAnnonce: number | null = null;
  annonce: Annonce | null = null; // Une seule annonce
  itineraires: Itineraire[] = [];
  isLoading = false;
   selectedImage: SafeUrl | null = null;

 constructor(
   private activatedRoute: ActivatedRoute,
   private voyagedetailsService: VoyageDetailsService,
   private angularRouter: Router,
   private imageService: ImageService,
   private sanitizer: DomSanitizer // Injectez DomSanitizer
 ) {
   super(activatedRoute, angularRouter);
 }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.idAnnonce = +id;
        this.loadAnnonce(this.idAnnonce); // Charger une seule annonce
      }
    });
  }

  loadAnnonce(idAnnonce: number): void {
    this.isLoading = true;
    this.voyagedetailsService.getAnnonceById(idAnnonce).subscribe(
      (data: Annonce) => {
        this.annonce = data; // Stocker l'annonce unique
        const idVoyage = this.annonce.voyage.idVoyage;
        this.loadItineraires(idVoyage); // Charger les itinéraires
         this.loadImagesForAnnonce(); // Charger les images pour cette annonce
        this.isLoading = false;
      },
      (error: any) => {
        this.isLoading = false;
        console.error('Erreur lors du chargement de l\'annonce', error);
      }
    );
  }
   // Charger les images pour une seule annonce
loadImagesForAnnonce(): void {
  if (this.annonce) { // Vérifiez que this.annonce n'est pas null
    console.log('Loading images for annonce ID:', this.annonce.idAnnonce);

    if (this.annonce.voyage.imageIds && this.annonce.voyage.imageIds.length > 0) {
      console.log('Image IDs to load:', this.annonce.voyage.imageIds);

      this.annonce.voyage.images = []; // Initialiser un tableau pour les URLs des images

      this.annonce.voyage.imageIds.forEach((imageId: string) => {
        console.log('Loading image with ID:', imageId);

        this.imageService.getImageById(imageId).subscribe(
          (blob: Blob) => {
            const imageUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob)); // Convertir Blob en SafeUrl
            this.annonce!.voyage.images?.push(imageUrl); // Ajoutez l'URL de l'image au tableau
            console.log('Image URL added:', imageUrl);
          },
          (error) => {
            console.error('Erreur lors de la récupération de l\'image avec ID:', imageId, error);
          },
          () => {
            // Une fois toutes les images chargées, vérifiez le nombre total d'images
            if (this.annonce?.voyage.images) {
              console.log('Total images loaded:', this.annonce.voyage.images.length);
            }
          }
        );
      });
    } else {
      console.log('No image IDs available to load.');
    }
  } else {
    console.log('Annonce is not available.');
  }
}

 loadItineraires(idVoyage: number): void {
    this.voyagedetailsService.getItinerairesByVoyageId(idVoyage).subscribe(
      (data: Itineraire[]) => {
         console.log('Itineraire:', data); // Log des données reçues
        this.itineraires = data;
      },
      (error: any) => {
        console.error('Erreur lors du chargement des itinéraires', error);
      }
    );
  }

 // Track the currently selected image


  changeMainImage(image: SafeUrl): void {
    this.selectedImage = image; // Set the selected image
    if (this.annonce?.voyage?.images) {
      const mainImageIndex = this.annonce.voyage.images.findIndex(
        (img: SafeUrl) => this.getSafeUrl(img) === this.getSafeUrl(image)
      );
      if (mainImageIndex !== -1) {
        this.settings.initialSlide = mainImageIndex; // Change la diapositive active
      }
    }
  }

// Méthode pour extraire l'URL réelle d'un SafeUrl
getSafeUrl(image: SafeUrl): string {
  return this.sanitizer.sanitize(SecurityContext.URL, image) || '';
}

public getSanitizedUrl(image: SafeUrl): string {
  return this.sanitizer.sanitize(SecurityContext.URL, image) || '';
}

 settings = {
   infinite: true,
   slidesToShow: 1,
   slidesToScroll: 1,
   arrows: false, // Disable navigation arrows
   dots: true,   // Keep dots for navigation (optional)
   cssEase: 'linear',
   asNavFor: '.detail-slider-nav',
   initialSlide: 0,
 };

   settingsThumb = {
     infinite: true,
     slidesToShow: 5,
     slidesToScroll: 1,
     arrows: true,
     dots: true,
     cssEase: 'linear',
     centerMode: true,
     centerPadding: '0px',
     focusOnSelect: true,
     asNavFor: '.detail-slider-for',
     responsive: [{
       breakpoint: 576,
       settings: {
         slidesToShow: 3
       }
     }]
   };

   settingsTesti = {
     infinite: true,
     slidesToShow: 1,
     slidesToScroll: 1,
     autoplay: true,
     autoplaySpeed: 2000,
     speed: 300,
     arrows: true,
     dots: true,
     cssEase: 'linear',
   };
}
