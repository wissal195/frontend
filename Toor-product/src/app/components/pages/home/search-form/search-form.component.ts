// search-form.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AllVoyageService, TypeVoyage, Voyage, Itineraire } from 'src/app/components/pages/home/all-voyage/service/all-voyage.service';
import { VoyageService } from 'src/app/components/pages/tableau-de-bord/services/voyage.service';
@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css'],
})
export class SearchFormComponent implements OnInit {
  // Critères de recherche
  searchCriteria = {
    destination: '',
    departureDate: '',
    tripType: '',
  };

  // Liste des types de voyage
  tripTypes: TypeVoyage[] = [];

  constructor(private router: Router, private AllVoyageService: AllVoyageService,private VoyageService: VoyageService ) {}

  ngOnInit(): void {
    // Récupérer les types de voyage depuis la base de données
    this.VoyageService.getTypesVoyage().subscribe({
      next: (types) => {
        this.tripTypes = types;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des types de voyage :', err);
      },
    });
  }

  // Méthode appelée lors de la soumission du formulaire
  onSearch() {
    if (this.searchCriteria.tripType) {
      // Récupérer les voyages par type
      this.AllVoyageService.getVoyagesByType(this.searchCriteria.tripType).subscribe({
        next: (voyages) => {
          const itineraires: { [voyageId: number]: Itineraire[] } = {};

          // Pour chaque voyage, récupérer les itinéraires
          voyages.forEach((voyage) => {
            this.AllVoyageService.getItinerairesByVoyageId(voyage.idVoyage).subscribe({
              next: (itinerairesVoyage) => {
                itineraires[voyage.idVoyage] = itinerairesVoyage;
              },
              error: (err) => {
                console.error(`Erreur lors de la récupération des itinéraires pour le voyage ${voyage.idVoyage} :`, err);
              },
            });
          });

          // Stocker les résultats dans le service
          this.AllVoyageService.setSearchResults(voyages, itineraires);

          // Naviguer vers la page all-voyage
          this.router.navigate(['/all-voyage']);
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des voyages :', err);
        },
      });
    }
  }
}
