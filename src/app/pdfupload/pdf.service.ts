import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UploadResponse {
  id: string;
  filename: string;
}

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  private http = inject(HttpClient);

  uploadPdf(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<UploadResponse>('/api/pdfs', formData);
  }
}
