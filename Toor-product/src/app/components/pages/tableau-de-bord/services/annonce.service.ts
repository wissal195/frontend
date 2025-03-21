import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'; // Pour sécuriser les URLs des images

export interface Annonce {
  idAnnonce: number;
  concessionnaire: {
    idConcessionnaire: number;
    nomGerant: string;
    logoUrl: string;
    siteWeb: string;
    numeroTax: string;
    licenceCommerciale: string;
    description: string;
    emailGerant: string;
    telephoneGerant: string;
    paye: string;
    utilisateur: {
      idUtilisateur: number;
    };
  };
  voyage: {
    idVoyage: number;
    titreVoyage: string;
    description: string;
    prix: number;
    duree: number;
    idTypeVoyage: number;
    typeVoyage: {
      idTypeVoyage: number;
    };
    circuit: string;
    tailleGroupe: number;
    trancheAge: string;
    guide: string;
    langueGuide: string;
    vol: {
      idVol: number;
    };
    imageIds: string[];
    images?: SafeUrl[]; // Ajoutez cette propriété pour stocker les URLs des images
    itineraires: {
      idItineraire: number;
    }[];
  };
  statutAnnonce: {
    idStatutAnnonce: number;
    statut: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AnnonceService {
  private apiUrl = 'http://localhost:8080/api/annonces';
  private imageApiUrl = 'http://localhost:8080/api/images'; // Endpoint pour les images

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  // Récupérer les annonces en attente
  getAnnoncesEnAttente(): Observable<Annonce[]> {
    return this.http.get<Annonce[]>(`${this.apiUrl}/En-attente`);
  }

  // Mettre à jour le statut d'une annonce
  updateAnnonceStatus(idAnnonce: number, status: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.put(`${this.apiUrl}/${idAnnonce}/status`, { statut: status }, { headers });
  }

  // Récupérer les annonces du concessionnaire connecté
  getAnnoncesByConcessionnaireConnecte(token: string): Observable<Annonce[]> {
    const headers = new HttpHeaders({
      Authorization: token,
    });
    return this.http.get<Annonce[]>(`${this.apiUrl}/concessionnaire-connecte`, { headers });
  }


}
