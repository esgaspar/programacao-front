import { DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Privilegio } from '../privilegio/model/privilegio';
import { PrivilegioService } from '../privilegio/service/privilegio.service';
import { SnackComponent } from '../snack/snack.component';
import { Designacao } from './model/designacao';
import { Reuniao } from './model/reuniao';
import { DesignacaoService } from './service/designacao.service';
import html2pdf from 'html2pdf.js';

@Component({
    selector: 'app-designacao',
    imports: [
        ReactiveFormsModule,
        RouterLink,
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDividerModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatInputModule,
        MatTooltipModule,
        FaIconComponent,
        DatePipe,
    ],
    templateUrl: './designacao.component.html',
    styleUrl: './designacao.component.scss',
})
export class DesignacaoComponent implements OnInit {
  reuniaoList = signal<Reuniao[]>([]);
  privilegioList = signal<Privilegio[]>([]);
  ds = signal<Record<string, any>[]>([]);
  isPrinting = false;

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(
    private service: DesignacaoService,
    private privilegioService: PrivilegioService,
    private _snackBar: MatSnackBar,
    private datepipe: DatePipe,
  ) {}

  ngOnInit(): void {}

  get startDate() {
    return this.range.controls.start.value;
  }

  get endDate() {
    return this.range.controls.end.value;
  }

  getList() {
    if (this.endDate == null || this.startDate == null) return;

    const start = this.datepipe.transform(this.startDate, 'dd-MM-YYYY');
    const end = this.datepipe.transform(this.endDate, 'dd-MM-YYYY');

    this.service.getByRangeDate(start, end).subscribe((list: Designacao[]) => {
      this.reuniaoList.set(this.transfor(list));
      this.print();
    });

    this.privilegioService.getList().subscribe((list: Privilegio[]) => {
      this.privilegioList.set(list);
    });
  }

  transfor(list: Designacao[]): Reuniao[] {
    const reuniaoList: Reuniao[] = [];
    list.forEach((designacao: Designacao) => {
      const existing = reuniaoList.find(r => r.data === designacao.data);
      if (existing) {
        existing.designacaoList.push(designacao);
      } else {
        const novaReuniao = new Reuniao();
        novaReuniao.data = designacao.data;
        novaReuniao.check = true;
        novaReuniao.designacaoList = [designacao];
        reuniaoList.push(novaReuniao);
      }
    });
    return reuniaoList;
  }

  stringToDate(str: string) {
    const [day, month, year] = str.split('/');
    return new Date(+year, +month - 1, +day);
  }

  print() {
    const dsItems: Record<string, any>[] = [];
    this.reuniaoList()
      .filter(r => r.check)
      .forEach(reuniao => {
        const reuniaoDs: Record<string, any> = {};
        reuniaoDs['data'] = reuniao.data;
        this.privilegioList().forEach(p => (reuniaoDs[p.codigo] = ''));
        reuniao.designacaoList.forEach(d => (reuniaoDs[d.privilegio.codigo] = d.voluntario.nome));
        dsItems.push(reuniaoDs);
      });
    this.ds.set(dsItems);
  }

  pageBreak(bloco: number) {
    const n = bloco + 1;
    return n.toString().endsWith('0') || n.toString().endsWith('5');
  }

  remove(value: Reuniao) {
    this.service.deleteAll(value.designacaoList).subscribe({
      next: () => {
        this.openSnackBar('Removido com sucesso', 'ok', 'sucess');
        this.reuniaoList.update(l => l.filter(h => h.data !== value.data));
      },
      error: () => this.openSnackBar('Erro ao remover', 'ok', 'error'),
    });
  }

  openSnackBar(message: string, action: string, type: string) {
    const config = new MatSnackBarConfig();
    config.duration = 1000;
    config.data = { type, message, action };
    this._snackBar.openFromComponent(SnackComponent, config);
  }

  imprimir() {
    const element = document.querySelector('#print-section');
    const start = this.datepipe.transform(this.startDate, 'dd-MM-YYYY');
    const end = this.datepipe.transform(this.endDate, 'dd-MM-YYYY');
    const options = {
      filename: `Indicadores de ${start} até ${end}`,
      margin: [0, 0.5, 0, 0.5] as [number, number, number, number],
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'cm', format: 'A4', orientation: 'portrait' as const },
    };
    html2pdf().set(options).from(element as HTMLElement).save();
  }
}
