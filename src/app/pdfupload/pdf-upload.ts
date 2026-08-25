import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from '@openng/optimus-ui/api';
import { CardModule } from '@openng/optimus-ui/card';
import { ButtonModule } from '@openng/optimus-ui/button';
import { ToastModule } from '@openng/optimus-ui/toast';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { PdfService } from './pdf.service';

@Component({
  selector: 'app-pdf-upload',
  imports: [CommonModule, FormsModule, CardModule, ButtonModule, ToastModule, InputTextModule],
  templateUrl: './pdf-upload.html',
  styleUrls: ['./pdf-upload.scss']
})
export class PdfUpload {
  private pdfService = inject(PdfService);
  private messageService = inject(MessageService);

  isDragging = signal(false);
  isUploading = signal(false);
  selectedFile = signal<File | null>(null);
  documentName = signal<string>('');

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const file = event.dataTransfer?.files[0];
    if (file) {
      this.validateAndSetFile(file);
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.validateAndSetFile(file);
    }
  }

  private validateAndSetFile(file: File): void {
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      this.messageService.add({
        severity: 'info',
        summary: 'Only PDF files supported',
        detail: `"${file.name}" is not a PDF file.`,
        life: 4000
      });
      return;
    }

    this.selectedFile.set(file);
    this.documentName.set(file.name);
  }

  upload(): void {
    const file = this.selectedFile();
    const name = this.documentName().trim();
    if (!file || !name) return;

    this.isUploading.set(true);

    this.pdfService.uploadPdf(file, name).subscribe({
      next: () => {
        this.isUploading.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `File "${name}" uploaded successfully.`
        });
        this.reset();
      },
      error: () => {
        this.isUploading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Upload failed.'
        });
      }
    });
  }

  reset(): void {
    this.selectedFile.set(null);
    this.documentName.set('');
  }
}
