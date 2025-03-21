import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private apiUrl = 'http://localhost:8080/api/images'; // Endpoint pour récupérer les images

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  // Récupérer une image par son ID
  getImageById(imageId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${imageId}`, { responseType: 'blob' });
  }

  // Convertir un Blob en URL sécurisée
  getImageUrlFromBlob(blob: Blob): SafeUrl {
    const imageUrl = URL.createObjectURL(blob);
    console.log('Generated image URL:', imageUrl); // Ajoutez ce log
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }
}
