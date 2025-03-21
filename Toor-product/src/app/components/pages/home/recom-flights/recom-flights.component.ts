import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { VoyageService, Voyage } from 'src/app/components/pages/tableau-de-bord/services/voyage.service';
import { ImageService } from 'src/app/components/pages/tableau-de-bord/services/image.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-recom-flights',
  templateUrl: './recom-flights.component.html',
  styleUrls: ['./recom-flights.component.css'],
})
export class RecomFlightsComponent implements OnInit {
  voyages: Voyage[] = []; // Liste des voyages de type "Aventure"
  voyageImages: { [key: number]: SafeUrl[] } = {}; // Dictionnaire pour stocker les URLs des images par voyage
  imagesLoaded = false; // Variable pour contrôler l'affichage du carrousel

  settings = {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    dots: false,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 500,
    cssEase: 'linear',
    responsive: [
      {
        breakpoint: 992,
        settings: {
          arrows: true,
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          dots: true,
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 576,
        settings: {
          arrows: false,
          dots: true,
          slidesToShow: 1,
        },
      },
    ],
  };

  constructor(
    private voyageService: VoyageService,
    private imageService: ImageService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef // Injecter ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadVoyages(); // Chargez les voyages au démarrage du composant
  }

  /**
   * Charge la liste des voyages avec les types de voyage et les vols associés.
   */
  loadVoyages(): void {
    this.voyageService.getVoyagesByType('Safari').subscribe({
      next: (data: Voyage[]) => {
        console.log('Voyages récupérés:', data); // Log des données reçues
        this.voyages = data;

        this.loadImagesForVoyages().then(() => {
          this.imagesLoaded = true;
          this.cdr.detectChanges(); // Forcer la détection de changement
          console.log('Toutes les images sont chargées');
        });
      },
      error: (err) => {
        console.error('Erreur lors du chargement des voyages:', err);
      },
    });
  }

  /**
   * Charge les images pour chaque voyage.
   */
  loadImagesForVoyages(): Promise<void> {
    const imagePromises: Promise<void>[] = [];

    this.voyages.forEach((voyage) => {
      if (voyage.imageIds && voyage.imageIds.length > 0) {
        this.voyageImages[voyage.idVoyage] = []; // Initialiser la liste des images pour ce voyage
        voyage.imageIds.forEach((imageId) => {
          const imagePromise = this.imageService.getImageById(imageId).toPromise()
            .then((blob: Blob) => {
              const imageUrl = this.imageService.getImageUrlFromBlob(blob);
              this.voyageImages[voyage.idVoyage].push(imageUrl); // Ajouter l'URL de l'image
              console.log('Image chargée pour le voyage', voyage.idVoyage, ':', imageUrl);
            })
            .catch((err) => {
              console.error('Erreur lors du chargement de l\'image :', err);
            });

          imagePromises.push(imagePromise);
        });
      }
    });

    // Retourner une Promise qui se résout lorsque toutes les images sont chargées
    return Promise.all(imagePromises).then(() => {});
  }
}
