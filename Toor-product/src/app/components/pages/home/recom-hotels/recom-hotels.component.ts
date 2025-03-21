import { Component, OnInit } from '@angular/core';
import { VoyageService, Voyage } from 'src/app/components/pages/tableau-de-bord/services/voyage.service';
import { ImageService } from 'src/app/components/pages/tableau-de-bord/services/image.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-recom-hotels',
  templateUrl: './recom-hotels.component.html',
  styleUrls: ['./recom-hotels.component.css'],
})
export class RecomHotelsComponent implements OnInit {
  voyages: Voyage[] = []; // Liste des voyages
  voyageImages: { [key: number]: SafeUrl[] } = {}; // URLs des images par voyage
  isLoading: boolean = true; // Indicateur de chargement

  // Configuration du carrousel
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
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          arrows: true,
          slidesToShow: 3,
        },
      },
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
          slidesToShow: 2,
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
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadVoyages(); // Charge les voyages au démarrage
  }

  /**
   * Charge la liste des voyages avec les types de voyage et les vols associés.
   */
  loadVoyages(): void {
    this.voyageService.getAllVoyagesWithVols().subscribe({
      next: (data: Voyage[]) => {
        this.voyages = data;
        this.loadImagesForVoyages(); // Charge les images pour chaque voyage
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des voyages :', err);
        this.isLoading = false; // Désactive l'indicateur de chargement en cas d'erreur
      },
    });
  }

  /**
   * Charge les images pour chaque voyage.
   */
  loadImagesForVoyages(): void {
    const imageLoadPromises: Promise<void>[] = [];

    this.voyages.forEach((voyage) => {
      if (voyage.imageIds && voyage.imageIds.length > 0) {
        this.voyageImages[voyage.idVoyage] = []; // Initialise la liste des images pour ce voyage
        voyage.imageIds.forEach((imageId) => {
          const promise = new Promise<void>((resolve, reject) => {
            this.imageService.getImageById(imageId).subscribe({
              next: (blob: Blob) => {
                const imageUrl = URL.createObjectURL(blob); // Convertit le Blob en URL
                const safeUrl = this.sanitizer.bypassSecurityTrustUrl(imageUrl); // Sécurise l'URL
                this.voyageImages[voyage.idVoyage].push(safeUrl); // Ajoute l'URL de l'image
                resolve();
              },
              error: (err: any) => {
                console.error('Erreur lors du chargement de l\'image :', err);
                reject(err);
              },
            });
          });
          imageLoadPromises.push(promise);
        });
      }
    });

    // Attend que toutes les images soient chargées avant de désactiver l'indicateur de chargement
    Promise.all(imageLoadPromises)
      .then(() => {
        this.isLoading = false; // Désactive l'indicateur de chargement
      })
      .catch(() => {
        this.isLoading = false; // Désactive l'indicateur de chargement en cas d'erreur
      });
  }

  /**
   * Extrait uniquement la date d'une chaîne de date complète (avec l'heure).
   * @param dateString La chaîne de date complète (ex: "2023-10-01T12:00:00") ou undefined.
   * @returns La date seule (ex: "2023-10-01") ou une chaîne vide si la date est undefined.
   */
  extractDateOnly(dateString: string | undefined): string {
    if (!dateString) return ''; // Retourne une chaîne vide si dateString est undefined ou null
    return dateString.split('T')[0]; // Divise la chaîne au niveau du 'T' et prend la première partie
  }
}
