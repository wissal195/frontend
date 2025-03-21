import { Component, OnInit } from '@angular/core';
import { HelperService } from '../../helper/helper.service';
import { VoyageService, Pays } from 'src/app/components/pages/tableau-de-bord/services/voyage.service';

// Définir une interface pour la structure des éléments de navigation
interface NavigationItem {
  id: number;
  linkText: string;
  child: boolean;
  submenu?: {
    id: number;
    linkText: string;
    link?: string;
    child?: boolean;
    submenu?: NavigationItem[];
  }[];
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent extends HelperService implements OnInit {
  pays: Pays[] = [];

  constructor(private voyageService: VoyageService) {
    super(); // Appel du constructeur parent
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.voyageService.getPays().subscribe(
      (data: Pays[]) => {
        this.pays = data;
        // Ajouter les pays au sous-menu "Destination"
        const destinationItem = this.navigation.find((item: NavigationItem) => item.linkText === 'Destination');
        if (destinationItem) {
          destinationItem.submenu = this.pays.map(pays => ({
            id: pays.idPaysDestination,
            linkText: pays.nomPays,
            link: `/destination/${pays.idPaysDestination}` // Exemple de lien
          }));
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des pays', error);
      }
    );
  }
}
