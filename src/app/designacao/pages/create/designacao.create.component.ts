import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Privilegio } from '../../../privilegio/model/privilegio';
import { PrivilegioService } from '../../../privilegio/service/privilegio.service';
import { Voluntario } from '../../../voluntario/model/voluntario';
import { Designacao } from '../../model/designacao';
import { Reuniao } from '../../model/reuniao';
import { DesignacaoService } from '../../service/designacao.service';
import { SnackComponent } from '../../../snack/snack.component';

@Component({
  selector: 'app-designacao-create',
  standalone: true,
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    FaIconComponent,
    DatePipe,
  ],
  templateUrl: './designacao.create.component.html',
  styleUrls: ['./designacao.create.component.css'],
})
export class DesignacaoCreateComponent implements OnInit {
  selectedDate: Date | null = null;

  listPrivilegio = signal<Privilegio[]>([]);
  historicoMes = signal<Reuniao[]>([]);

  ds: Record<string, any> = {};
  search: Record<string, any> = {};
  filteredOptions: Record<string, any> = {};

  constructor(
    private privilegioService: PrivilegioService,
    private service: DesignacaoService,
    private datepipe: DatePipe,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.getList();
    this.ds['data'] = '';
    this.buscaMes();
  }

  openSnackBar(message: string, action: string, type: string) {
    const config = new MatSnackBarConfig();
    config.duration = 1000;
    config.data = { type, message, action };
    this._snackBar.openFromComponent(SnackComponent, config);
  }

  getList() {
    this.privilegioService.getList().subscribe((list: Privilegio[]) => {
      this.listPrivilegio.set(list);
      this.initDs();
    });
  }

  private initDs() {
    this.listPrivilegio().forEach(element => {
      this.ds[element.codigo] = '';
      this.search[element.codigo] = '';
    });
  }

  buscaReuniao() {
    if (this.selectedDate) {
      const data = this.datepipe.transform(this.selectedDate, 'dd-MM-YYYY');
      if (data) {
        this.service.getByDate(data).subscribe({
          next: (v: Designacao[]) => {
            if (!v.length) {
              this.initDs();
            } else {
              v.forEach(element => {
                this.ds[element.privilegio.codigo] = element.voluntario;
                this.search[element.privilegio.codigo] = element.voluntario.nome;
              });
            }
          },
          error: e => console.error(e),
        });
      }
    }
    this.buscaMes();
  }

  buscaMes() {
    const data = this.selectedDate
      ? this.datepipe.transform(this.selectedDate, 'MM')
      : this.datepipe.transform(new Date(), 'MM');

    if (data) {
      this.service.getByMes(data).subscribe({
        next: (v: Designacao[]) => {
          if (v.length) this.historicoMes.set(this.transfor(v));
        },
        error: e => console.error(e),
      });
    }
  }

  saveAll() {
    const designacaoListToSave: Designacao[] = [];
    this.listPrivilegio().forEach(privilegio => {
      const data = this.datepipe.transform(this.selectedDate, 'dd-MM-YYYY');
      if (!data) return;
      const designacao = new Designacao();
      designacao.data = data;
      designacao.privilegio = privilegio;
      designacao.voluntario = this.ds[privilegio.codigo];
      designacaoListToSave.push(designacao);
    });

    this.service.saveAll(designacaoListToSave).subscribe({
      next: () => this.openSnackBar('Salvo com sucesso', 'ok', 'sucess'),
      error: () => this.openSnackBar('Erro ao salvar', 'ok', 'error'),
    });
  }

  remove(value: Reuniao) {
    this.service.deleteAll(value.designacaoList).subscribe({
      next: () => {
        this.openSnackBar('Removido com sucesso', 'ok', 'sucess');
        this.historicoMes.update(l => l.filter(h => h.data !== value.data));
      },
      error: () => this.openSnackBar('Erro ao remover', 'ok', 'error'),
    });
  }

  displayFn(voluntario: Voluntario): string {
    return voluntario && voluntario.nome ? voluntario.nome.toString() : '';
  }

  changeSelect(privilegio: Privilegio, voluntario: any) {
    if (!voluntario?.option?.value?.id) return;

    const v = JSON.parse(JSON.stringify(voluntario.option.value));
    const alerta: { tipo: string; mensagem: string[] } = { tipo: '', mensagem: [] };

    this.listPrivilegio().forEach(p => {
      if (this.ds[p.codigo]?.id === v.id && p.codigo !== privilegio.codigo) {
        alerta.tipo = 'erro';
        alerta.mensagem.push(`[Conflito com designação de ${p.descricao} nesta semana]`);
      }
    });

    let listDataConflito: string | String = '';
    this.historicoMes().forEach(mes => {
      mes.designacaoList
        .filter(d => d.privilegio.id === privilegio.id && v.id === d.voluntario.id)
        .forEach(d => {
          listDataConflito = listDataConflito === '' ? d.data : listDataConflito + ', ' + d.data;
        });
    });

    if (listDataConflito !== '') {
      alerta.tipo = 'erro';
      alerta.mensagem.push(
        `[Conflito com designação de ${privilegio.descricao} em ${listDataConflito}]`,
      );
    }

    setTimeout(() => {
      v.alerta = alerta;
      this.ds[privilegio.codigo] = v;
    }, 10);
  }

  private _filter(nome: string, options: Voluntario[]): Voluntario[] {
    const filterValue = nome.toLowerCase();
    return options.filter(o => o.nome.toLowerCase().includes(filterValue));
  }

  busca(e: any, privilegio: Privilegio) {
    const input = document.getElementById('busca_' + privilegio.codigo) as HTMLInputElement | null;
    if (input) {
      this.filteredOptions[privilegio.codigo] = this._filter(input.value, privilegio.voluntarioList);
    }
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

  stringToDate(str: string): Date {
    const [day, month, year] = str.split('/');
    return new Date(+year, +month - 1, +day);
  }
}
