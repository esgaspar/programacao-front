import { Component, Inject, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';


@Component({
  selector: 'snack-bar',
  templateUrl: './snack.component.html',
  styleUrls: ['./snack.component.css'],
})
export class SnackComponent {

  snackBarRef = inject(MatSnackBarRef);
  mensagem: String;
  type: String;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    this.mensagem = data.message;
    this.type = data.type;
  }
}

