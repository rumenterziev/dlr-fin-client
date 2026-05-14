import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface CertData {
  title: string;
  issuer: string;
  image: string;
}

@Component({
  selector: 'app-cert-dialog',
  imports: [],
  templateUrl: './cert-dialog.html',
  styleUrl: './cert-dialog.scss',
})
export class CertDialog {
  readonly data = inject<CertData>(MAT_DIALOG_DATA);
  private readonly ref = inject(MatDialogRef<CertDialog>);

  close(): void {
    this.ref.close();
  }
}
