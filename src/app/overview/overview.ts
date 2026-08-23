import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Card } from '@openng/optimus-ui/card';
import { Button } from '@openng/optimus-ui/button';
import { Tooltip } from '@openng/optimus-ui/tooltip';
import { ConfirmationService, MessageService } from '@openng/optimus-ui/api';
import { ConfirmDialog } from '@openng/optimus-ui/confirmdialog';
import { Toast } from '@openng/optimus-ui/toast';
import { finalize } from 'rxjs';
import { ProgressSpinner } from '@openng/optimus-ui/progressspinner';
import { PdfItem } from '../types';

@Component({
  selector: 'overview',
  standalone: true,
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
  imports: [Card, Button, Tooltip, ConfirmDialog, Toast, ProgressSpinner],
})
export class OverviewComponent {
  private http = inject(HttpClient);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  items = signal<PdfItem[]>([]);

  isLoading = signal(true);

  constructor() {
    this.http
      .get<PdfItem[]>('/api/pdfs')
      .pipe(
        takeUntilDestroyed(),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (data) => this.items.set(data),
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.message,
            life: 3000,
          });
        },
      });
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
