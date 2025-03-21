import { Component, OnInit } from '@angular/core';
import { AllVoyageService, Voyage, Itineraire } from 'src/app/components/pages/home/all-voyage/service/all-voyage.service';
@Component({
  selector: 'app-all-voyage',
  templateUrl: './all-voyage.component.html',
  styleUrls: ['./all-voyage.component.css'],
})
export class AllVoyageComponent implements OnInit {
  voyages: Voyage[] = [];
  itineraires: { [voyageId: number]: Itineraire[] } = {};

  constructor(private allVoyageService: AllVoyageService) {}

  ngOnInit(): void {
    // Récupérer les résultats de la recherche depuis le service
    const results = this.allVoyageService.getSearchResults();
    this.voyages = results.voyages;
    this.itineraires = results.itineraires;
  }
}
