import { Routes } from '@angular/router';
import { PdfUpload } from './pdfupload/pdf-upload';
import { OverviewComponent } from './overview/overview';

export const routes: Routes = [
  {
    path: 'upload',
    component: PdfUpload,
  },
  {
    path: '',
    component: OverviewComponent,
  },
];
