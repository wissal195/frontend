import { Component, OnInit } from '@angular/core';
import { AdminService, ConcessionnaireResponse } from 'src/app/components/pages/tableau-de-bord/services/Admin.service';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.css'],
})
export class PartnersComponent implements OnInit {
  public partners: ConcessionnaireResponse[] = []; // Liste des concessionnaires
  public isLoading: boolean = true; // Indicateur de chargement

  // Configuration du carrousel
  settings = {
    infinite: true,
    slidesToShow: 2,
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
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          dots: true,
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 576,
        settings: {
          arrows: false,
          dots: true,
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 400,
        settings: {
          arrows: false,
          dots: true,
          slidesToShow: 2,
        },
      },
    ],
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadPartners(); // Charge les partenaires au démarrage
  }

  /**
   * Charge la liste des concessionnaires.
   */
  loadPartners(): void {
    this.adminService.findAll().subscribe({
      next: (data: ConcessionnaireResponse[]) => {
        console.log('partenaire:', data); // Log des données reçues
        this.partners = data;
        this.isLoading = false; // Désactive l'indicateur de chargement
      },
      error: (err) => {
        console.error('Erreur lors du chargement des partenaires :', err);
        this.isLoading = false; // Désactive l'indicateur de chargement en cas d'erreur
      },
    });
  }

  /**
   * Convertit un logo en base64 en URL sécurisée.
   */
  getLogoUrl(logo: string | undefined): string {
    if (logo) {
      return `data:image/png;base64,${logo}`; // Assurez-vous que le format d'image est correct
    } else {
      return 'assets/images/default-logo.png'; // Chemin vers une image par défaut
    }
  }
}
