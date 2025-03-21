import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VoyageDataService } from 'src/app/components/pages/tableau-de-bord/services/voyage-data.service';
import { VoyageService } from 'src/app/components/pages/tableau-de-bord/services/voyage.service';
import { Voyage } from 'src/app/components/model/Voyage.model';

@Component({
  selector: 'app-etape1-publier-voyage',
  templateUrl: './etape1-publier-voyage.component.html',
  styleUrls: ['./etape1-publier-voyage.component.css']
})
export class Etape1PublierVoyageComponent implements OnInit {
  // Déclaration de formData avec la propriété images
  formData: {
    dateDepart: Date;
    titreVoyage: string;
    description: string;
    prix: number | null;
    duree: number | null;
    ageMin: number | null;
    ageMax: number | null;
    circuit: 'prive' | 'groupe';
    tailleGroupe: number | null;
    guide: 'oui' | 'non';
    langueGuide: string;
    idTypeVoyage: number;
    images?: string[]; // Ajout de la propriété images
  } = {
    titreVoyage: '',
    description: '',
    prix: null,
    duree: null,
    ageMin: null,
    ageMax: null,
    circuit: 'prive',
    tailleGroupe: null,
    guide: 'non',
    langueGuide: '',
    idTypeVoyage: 0,
    dateDepart: new Date(),
    images: [], // Initialisation du tableau d'images
  };

  minAge: number = 0;
  maxAge: number = 100;

  listeLangues = ['Français', 'Anglais', 'Espagnol', 'Arabe', 'Chinois', 'Japonais', 'Autre...'];
  typesVoyage: any[] = [];

  // Tableaux pour gérer les images et leurs aperçus
  images: (File | null)[] = [];
  imagePreviews: (string | null)[] = [];

  constructor(
    private voyageDataService: VoyageDataService,
    private router: Router,
    private voyageService: VoyageService
  ) {}

  ngOnInit() {
    // Récupérer les données stockées dans le service
    const storedData = this.voyageDataService.getVoyageData();
    this.formData = {
      ...this.formData,
      titreVoyage: storedData.titreVoyage || '',
      description: storedData.description || '',
      prix: storedData.prix ?? null,
      duree: storedData.duree ?? null,
      ageMin: storedData.ageMin ?? null,
      ageMax: storedData.ageMax ?? null,
      circuit: storedData.circuit || 'prive',
      tailleGroupe: storedData.tailleGroupe ?? null,
      guide: storedData.guide || 'non',
      langueGuide: storedData.langueGuide || '',
      idTypeVoyage: storedData.idTypeVoyage ?? 0,
      dateDepart: storedData.vol?.dateDepart || new Date(),
      images: storedData.images || [], // Initialiser les images
    };

    // Charger les types de voyage
    this.voyageService.getTypesVoyage().subscribe(
      (data: any[]) => {
        this.typesVoyage = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des types de voyage :', error);
      }
    );

    // Ajouter un champ d'image initial
    this.addImageField();
  }

  // Méthode pour ajouter un nouveau champ d'image
  addImageField(): void {
    this.images.push(null);
    this.imagePreviews.push(null);
  }

  // Méthode pour gérer le changement de fichier
  onFileChange(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      this.images[index] = file;

      // Convertir le fichier en base64
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviews[index] = e.target.result; // Afficher l'aperçu
        this.formData.images = this.formData.images || []; // Initialiser le tableau si nécessaire
        this.formData.images[index] = e.target.result.split(',')[1]; // Stocker en base64 (sans le préfixe)
      };
      reader.readAsDataURL(file);
    }
  }

  // Méthode pour mettre à jour l'âge minimum
  updateMinAge(event: Event): void {
    const value = +(event.target as HTMLInputElement).value;
    if (value > this.formData.ageMax!) {
      this.formData.ageMin = this.formData.ageMax;
    } else {
      this.formData.ageMin = value;
    }
  }

  // Méthode pour mettre à jour l'âge maximum
  updateMaxAge(event: Event): void {
    const value = +(event.target as HTMLInputElement).value;
    if (value < this.formData.ageMin!) {
      this.formData.ageMax = this.formData.ageMin;
    } else {
      this.formData.ageMax = value;
    }
  }

  // Méthode pour gérer le changement de circuit
  onCircuitChange() {
    if (this.formData.circuit === 'prive') {
      this.formData.tailleGroupe = null;
    }
  }

  // Méthode pour gérer le changement de guide
  onGuideChange() {
    if (this.formData.guide === 'non') {
      this.formData.langueGuide = '';
    }
  }

  // Méthode pour soumettre le formulaire
  onSubmit() {
    console.log('✅ onSubmit() a été déclenché !');

    const ageMin = this.formData.ageMin ?? 0;
    const ageMax = this.formData.ageMax ?? 0;

    // Créer l'objet cleanedData
    const cleanedData: Voyage = {
      idVoyage: 0,
      titreVoyage: this.formData.titreVoyage,
      description: this.formData.description,
      prix: this.formData.prix ?? 0,
      duree: this.formData.duree ?? 0,
      circuit: this.formData.circuit,
      tailleGroupe: this.formData.tailleGroupe ?? 0,
      guide: this.formData.guide,
      langueGuide: this.formData.langueGuide,
      idTypeVoyage: this.formData.idTypeVoyage,
      ageMin: ageMin,
      ageMax: ageMax,
      vol: {
        dateDepart: this.formData.dateDepart,
        dateArrivee: new Date(),
        numeroVol: '',
        nomCompagnieAerienne: '',
        paysDepart: '',
        paysArrivee: '',
        classeVolId: 0,
        escale: 'direct',
        fraisClassesVol: {},
        escales_aller: [],
      },
      images: this.formData.images, // Stocker les images en base64
    };

    // Sauvegarder les données dans le service
    this.voyageDataService.setVoyageData(cleanedData);
    console.log('📌 Données du voyage sauvegardées :', this.voyageDataService.getVoyageData());

    // Naviguer vers l'étape 2
    this.router.navigate(['/tableau-de-bord-agence/etape2-publier-voyage']);
  }
}
