import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { VoyageService, Voyage } from 'src/app/components/pages/tableau-de-bord/services/voyage.service';
import { ImageService } from 'src/app/components/pages/tableau-de-bord/services/image.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-recom-cruise',
  templateUrl: './recom-cruise.component.html',
  styleUrls: ['./recom-cruise.component.css']
})
export class RecomCruiseComponent implements OnInit {
  voyages: Voyage[] = []; // Liste des voyages de type "Noce"
  voyageImages: { [key: number]: SafeUrl[] } = {}; // Dictionnaire pour stocker les URLs des images par voyage
  imagesLoaded = false; // Indicateur de chargement des images
  isLoading = true; // Indicateur de chargement global

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

  constructor(
    private voyageService: VoyageService,
    private imageService: ImageService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadVoyages();
  }

  /**
   * Charge la liste des voyages de type "Noce".
   */
  loadVoyages(): void {
    this.voyageService.getVoyagesNoce().subscribe({
      next: (data: Voyage[]) => {
        console.log('test:', data); // Log des données reçues
        this.voyages = data;
        this.loadImagesForVoyages().then(() => {
          this.imagesLoaded = true;
          this.isLoading = false;
          this.cdr.detectChanges(); // Forcer la détection de changement
        }).catch((err) => {
          console.error('Erreur lors du chargement des images:', err);
          this.isLoading = false;
        });
      },
      error: (err) => {
        console.error('Erreur lors du chargement des voyages:', err);
        this.isLoading = false;
      },
    });
  }

  /**
   * Charge les images pour chaque voyage.
   */
  loadImagesForVoyages(): Promise<void> {
    const imageObservables: Observable<SafeUrl>[] = [];

    this.voyages.forEach((voyage) => {
      if (voyage.imageIds && voyage.imageIds.length > 0) {
        this.voyageImages[voyage.idVoyage] = []; // Initialiser la liste des images pour ce voyage
        voyage.imageIds.forEach((imageId) => {
          const imageObservable = this.imageService.getImageById(imageId).pipe(
            map((blob: Blob) => {
              const imageUrl = URL.createObjectURL(blob); // Convertit le Blob en URL
              return this.sanitizer.bypassSecurityTrustUrl(imageUrl); // Sécurise l'URL
            }),
            catchError((err) => {
              console.error('Erreur lors du chargement de l\'image :', err);
              // Retourner une URL d'image par défaut en cas d'erreur
              return of(this.sanitizer.bypassSecurityTrustUrl('assets/images/default-image.jpg'));
            })
          );

          imageObservables.push(imageObservable);
        });
      }
    });

    // Charger toutes les images en parallèle
    return forkJoin(imageObservables).pipe(
      map((imageUrls: SafeUrl[]) => {
        let index = 0;
        this.voyages.forEach((voyage) => {
          if (voyage.imageIds && voyage.imageIds.length > 0) {
            this.voyageImages[voyage.idVoyage] = imageUrls.slice(index, index + voyage.imageIds.length);
            index += voyage.imageIds.length;
          }
        });
      })
    ).toPromise() as Promise<void>;
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

  /**
   * Génère un tableau d'étoiles en fonction de la catégorie de l'hôtel.
   * @param categorie La catégorie de l'hôtel (ex: "3 étoiles").
   * @returns Un tableau de longueur égale au nombre d'étoiles.
   */
  generateStars(categorie: string): number[] {
    const starCount = parseInt(categorie, 10); // Convertit la catégorie en nombre d'étoiles
    return Array(starCount).fill(0); // Crée un tableau de longueur starCount
  }
}
