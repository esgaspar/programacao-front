import { Component, OnInit } from '@angular/core';
import { EscolaService } from './service/escola.service';
import { Designacao } from '../designacao/model/designacao';

@Component({
    selector: 'escola',
    imports: [],
    templateUrl: './escola.component.html',
    styleUrls: ['./escola.component.scss']
})
export class EscolaComponent implements OnInit {
  constructor(public service: EscolaService) {}

  ngOnInit(): void {
    this.service.getById(1).subscribe({
      next: (v: Designacao) => console.log(v),
      error: (e) => console.error(e),
    });
  }
}

