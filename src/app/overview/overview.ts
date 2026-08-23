import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Card } from '@openng/optimus-ui/card';
import { Button } from '@openng/optimus-ui/button';
import { Tooltip } from '@openng/optimus-ui/tooltip';
import { ConfirmationService, MessageService } from '@openng/optimus-ui/api';
import { ConfirmDialog } from '@openng/optimus-ui/confirmdialog';
import { Toast } from '@openng/optimus-ui/toast';

export interface PdfItem {
  id: number;
  name: string;
  // thumbnailUrl: string;
}

@Component({
  selector: 'overview',
  standalone: true,
  template: `
    <p-confirm-dialog></p-confirm-dialog>
    <p-toast></p-toast>

    <div class="container">
      <div class="grid">
        @for (item of items(); track item.id) {
          <p-card class="card">
            <!-- <ng-template #header>
             <img [alt]="item.title" class="w-full" [src]="item.thumbnailUrl"/>
            </ng-template> -->
            <ng-template #title>
              <div [pTooltip]="item.name" tooltipPosition="top" appendTo="body" [showDelay]="300">
                {{ item.name }}
              </div>
            </ng-template>
            <ng-template #footer>
              <div class="footer">
                <p-button label="edit" icon="pi pi-file-edit" />
                <p-button
                  icon="pi pi-trash"
                  severity="danger"
                  [text]="true"
                  (onClick)="confirmDelete(item, $event)"
                />
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
      .footer {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
      }
    `,
  ],
  imports: [Card, Button, Tooltip, ConfirmDialog, Toast],
})
export class OverviewComponent {
  private http = inject(HttpClient);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  readonly items = signal<PdfItem[]>([]);

  constructor() {
    this.http
      .get<PdfItem[]>('/api/pdfs')
      .pipe(takeUntilDestroyed())
      .subscribe((data) => this.items.set(data));
  }

  confirmDelete(item: PdfItem, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete ' + item.name + '?',
      header: 'Delete document',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        severity: 'secondary',
        label: 'Cancel',
      },
      acceptLabel: 'Delete',
      acceptButtonProps: {
        severity: 'danger',
        label: 'Delete',
      },
      accept: () => {
        this.http.delete('/api/delete-pdf/' + item.id).subscribe({
          next: () => {
            this.items.update((currentItems) => currentItems.filter((i) => i.id !== item.id));
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.message,
              life: 3000,
            });
          },
        });
      },
    });
  }
}
