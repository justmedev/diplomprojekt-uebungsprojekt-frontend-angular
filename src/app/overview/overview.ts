import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { Card } from '@openng/optimus-ui/card';
import { Button } from '@openng/optimus-ui/button';
import { Tooltip } from '@openng/optimus-ui/tooltip';

export interface PdfItem {
  id: number;
  title: string;
  thumbnailUrl: string;
}

const DUMMY_PDFS: PdfItem[] = [
  {
    id: 1,
    title: 'Mietvertrag_Wohnung.pdf',
    thumbnailUrl: 'https://optimus.openng.org/demo/card-ng.jpg',
  },
  {
    id: 2,
    title: 'Rechnung_2026_03.pdf',
    thumbnailUrl: 'https://optimus.openng.org/demo/card-ng.jpg',
  },
  {
    id: 3,
    title: 'Projektkonzept_Masterarbeit.pdf',
    thumbnailUrl: 'https://optimus.openng.org/demo/card-ng.jpg',
  },
  {
    id: 4,
    title: 'Gehaltsabrechnung_Januar.pdf',
    thumbnailUrl: 'https://optimus.openng.org/demo/card-ng.jpg',
  },
  {
    id: 5,
    title: 'Gehaltsabrechnung_Januar.pdf',
    thumbnailUrl: 'https://optimus.openng.org/demo/card-ng.jpg',
  },
  {
    id: 6,
    title: 'Gehaltsabrechnung_Januar.pdf',
    thumbnailUrl: 'https://optimus.openng.org/demo/card-ng.jpg',
  },
  {
    id: 7,
    title: 'Gehaltsabrechnung_Januar.pdf',
    thumbnailUrl: 'https://optimus.openng.org/demo/card-ng.jpg',
  },
  {
    id: 8,
    title: 'Gehaltsabrechnung_Januar.pdf',
    thumbnailUrl: 'https://optimus.openng.org/demo/card-ng.jpg',
  },
];

@Component({
  selector: 'overview',
  standalone: true,
  template: `
    <div class="container">
      <div class="grid">
        @for (item of items(); track item.id) {
          <p-card class="card">
            <ng-template #header>
              <img [alt]="item.title" class="w-full" [src]="item.thumbnailUrl" />
            </ng-template>
            <ng-template #title>
              <div [pTooltip]="item.title" tooltipPosition="top" appendTo="body" [showDelay]="300">
                {{ item.title }}
              </div>
            </ng-template>
            <ng-template #footer>
              <div class="flex gap-4 mt-1">
                <p-button icon="pi pi-ellipsis-v" [text]="true"/>
              </div>
            </ng-template>
          </p-card>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 1.5rem;
        padding: 1.5rem;
        width: 50%;
      }
      img {
        width: 100%;
        height: 200px;
        object-fit: cover;
      }
      .container {
        display: flex;
        justify-content: center;
        width: 100%;
      }
      .card {
        overflow: hidden;
      }
    `,
  ],
  imports: [Card, Button, Tooltip],
})
export class OverviewComponent {
  private readonly http = inject(HttpClient);

  readonly items = toSignal(
    this.http.get<PdfItem[]>('/api/all-pdfs').pipe(catchError(() => of(DUMMY_PDFS))),
    {
      initialValue: DUMMY_PDFS,
    },
  );
}
