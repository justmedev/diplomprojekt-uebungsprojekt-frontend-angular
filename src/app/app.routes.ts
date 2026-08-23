import { Routes } from '@angular/router';
import { PdfUpload } from './pdfupload/pdf-upload';

export const routes: Routes = [
  {
    path: 'upload',
    component: PdfUpload,
  },
  {
    path: '',
    redirectTo: 'upload',
    pathMatch: 'full',
  },
];
