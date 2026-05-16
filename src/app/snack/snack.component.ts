import { Component, Inject, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { MAT_SNACK_BAR_DATA, MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'snack-bar',
  standalone: true,
  imports: [NgIf, MatSnackBarModule, FaIconComponent],
  templateUrl: './snack.component.html',
  styleUrls: ['./snack.component.css'],
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


