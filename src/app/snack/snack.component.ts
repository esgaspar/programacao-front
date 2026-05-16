import { Component, Inject, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'snack-bar',
    imports: [MatSnackBarModule, FaIconComponent],
    templateUrl: './snack.component.html',
    styleUrl: './snack.component.scss',
})
export class SnackComponent {
  snackBarRef = inject(MatSnackBarRef);
  mensagem: string;
  type: string;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    this.mensagem = data.message;
    this.type = data.type;
  }
}
