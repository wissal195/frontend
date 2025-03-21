import { Component, OnInit } from '@angular/core';
import { AnnonceService, Annonce } from 'src/app/components/pages/tableau-de-bord/services/annonce.service';
import { ImageService } from 'src/app/components/pages/tableau-de-bord/services/image.service';

@Component({
  selector: 'app-panier-agence',
  templateUrl: './panier-agence.component.html',
  styleUrls: ['./panier-agence.component.css'],
})
export class PanierAgenceComponent implements OnInit {
  annonces: Annonce[] = [];
  page: number = 1;
  itemsPerPage: number = 6;

  constructor(
    private annonceService: AnnonceService,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.loadAnnonces();
  }

  // Charger les annonces
  loadAnnonces(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.annonceService.getAnnoncesByConcessionnaireConnecte(token).subscribe(
        (data: Annonce[]) => {
          this.annonces = data;
          this.loadImagesForAnnonces();
        },
        (error) => {
          console.error('Erreur lors de la récupération des annonces', error);
        }
      );
    } else {
      console.error('Token JWT non trouvé');
    }
  }

  // Charger les images pour chaque annonce
  loadImagesForAnnonces(): void {
    this.annonces.forEach((annonce) => {
      if (annonce.voyage.imageIds && annonce.voyage.imageIds.length > 0) {
        annonce.voyage.images = []; // Initialiser un tableau pour les URLs des images
        annonce.voyage.imageIds.forEach((imageId) => {
          this.imageService.getImageById(imageId).subscribe(
            (blob: Blob) => {
              const imageUrl = this.imageService.getImageUrlFromBlob(blob);
              annonce.voyage.images?.push(imageUrl);
              console.log('Image added to annonce:', annonce.idAnnonce, imageUrl); // Ajoutez ce log
            },
            (error) => {
              console.error('Erreur lors de la récupération de l\'image', error);
            }
          );
        });
      }
    });
  }
}
