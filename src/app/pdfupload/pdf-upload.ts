import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from '@openng/optimus-ui/api';
import { CardModule } from '@openng/optimus-ui/card';
import { ButtonModule } from '@openng/optimus-ui/button';
import { ToastModule } from '@openng/optimus-ui/toast';
import { PdfService } from './pdf.service';

@Component({
  selector: 'app-pdf-upload',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, ToastModule],
  templateUrl: './pdf-upload.html',
  styleUrls: ['./pdf-upload.scss']
})
export class PdfUpload {
  private pdfService = inject(PdfService);
  private messageService = inject(MessageService);

  isDragging = signal(false);
  isUploading = signal(false);
  selectedFile = signal<File | null>(null);

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

    console.log('Drop-Event ausgelöst');
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.validateAndSetFile(file);
    }
  }

  onFileSelect(event: Event): void {
    console.log('File-Select Event ausgelöst');
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.validateAndSetFile(file);
    }
  }

  private validateAndSetFile(file: File): void {
    console.log('Checking file:', file.name, file.type);

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      console.log('File is NOT a PDF - Sending toast...');
      this.messageService.add({
        severity: 'info',
        summary: 'Only PDF files supported',
        detail: `"${file.name}" is not a PDF file.`,
        life: 4000
      });
      return;
    }

    console.log('PDF successfully accepted');
    this.selectedFile.set(file);
  }

  upload(): void {
    const file = this.selectedFile();
    if (!file) return;

    this.isUploading.set(true);

    this.pdfService.uploadPdf(file).subscribe({
      next: () => {
        this.isUploading.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `File ${file.name} uploaded successfully.`
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
  }
}
