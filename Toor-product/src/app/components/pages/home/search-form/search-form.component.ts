import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VoyageService, TypeVoyage } from 'src/app/components/pages/tableau-de-bord/services/voyage.service';

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

  constructor(private router: Router, private voyageService: VoyageService) {}

  ngOnInit(): void {
    // Récupérer les types de voyage depuis la base de données
    this.voyageService.getTypesVoyage().subscribe({
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
    // Rediriger vers la page des résultats avec les critères de recherche
    this.router.navigate(['/voyages'], {
      queryParams: this.searchCriteria,
    });
  }
}
