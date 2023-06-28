import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableModule } from '@angular/material/table';
import { Designacao } from './model/designacao';
import { Reuniao } from './model/reuniao';
import { DesignacaoService } from './service/designacao.service';
import { PrivilegioService } from '../privilegio/service/privilegio.service';
import { Privilegio } from '../privilegio/model/privilegio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackComponent } from '../snack/snack.component';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';



export interface ReuniaoInterface {
  data: String;
  volanteEsq?: String;
  indicadorEstacionamento?: String;
  volanteDir?: String;
  video?: String;
  audio?: String;
  indicadorAuditorio?: String;
  indicadorExterno?: String;
}


@Component({
  selector: 'app-designacao',
  templateUrl: './designacao.component.html',
  styleUrls: ['./designacao.component.css']
})
export class DesignacaoComponent implements OnInit {
  @ViewChild(MatTable) table: MatTable<any>;
  ds: Record<string, any>[];


  displayedColumns: String[] = ['data'];

  service: DesignacaoService;
  privilegioService: PrivilegioService;
  list: Designacao[] = [];
  reuniaoList: Reuniao[] = [];
  privilegioList: Privilegio[] = [];
  durationInSeconds: number = 5;
  datepipe: DatePipe;
  // ds: ReuniaoInterface[] = [];

  constructor(service: DesignacaoService, privilegioService: PrivilegioService, private _snackBar: MatSnackBar, datepipe: DatePipe) {
    this.service = service;
    this.privilegioService = privilegioService;
    this.datepipe = datepipe;
  }
  ngOnInit(): void {
    // this.getList();
  }

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  get startDate() {
    return this.range.controls.start.value
  }

  get endDate() {
    return this.range.controls.end.value
  }



  getList() {

    if (this.endDate == null || this.startDate == null) {
      return;
    }

    let start = this.datepipe.transform(this.startDate, "dd-MM-YYYY");
    let end = this.datepipe.transform(this.endDate, "dd-MM-YYYY");

    this.service.getByRangeDate(start, end)
      .subscribe((list: Designacao[]) => {
        this.list = list;
        this.reuniaoList = this.transfor(list);
        this.print();
      });

    this.privilegioService.getList().subscribe((list: Privilegio[]) => {
      this.privilegioList = list;

      this.privilegioList.forEach((privilegio: Privilegio) => {
        this.displayedColumns.push(privilegio.descricao);

      });
    })
  }

  transfor(list: Designacao[]): Reuniao[] {
    let reuniaoList: Reuniao[] = [];

    list.forEach((designacao: Designacao) => {
      let reuniao = reuniaoList.filter((reuniao: Reuniao) => { return reuniao.data == designacao.data });


      if (reuniao.length > 0) {
        reuniao[0].designacaoList.push(designacao);

      } else {
        let novaReuniao: Reuniao = new Reuniao();
        novaReuniao.data = designacao.data;
        novaReuniao.check = true;
        novaReuniao.designacaoList = [];
        novaReuniao.designacaoList.push(designacao);
        reuniaoList.push(novaReuniao);
      }

    });
    return reuniaoList;
  }

  stringToDate(str: String) {
    const [day, month, year] = str.split('/');
    return new Date(+year, +month - 1, +day);
  }

  print() {
    this.ds = [];
    this.reuniaoList.filter(value => value.check).forEach(reuniao => {
      let reuniaoDs: Record<string, any> = [];
      reuniaoDs['data'] = reuniao.data;

      this.privilegioList.forEach((element: Privilegio) => {
        reuniaoDs[element.codigo] = "";
      });


      reuniao.designacaoList.forEach((designacao: Designacao) => {
        let voluntarioNome = designacao.voluntario.nome
        reuniaoDs[designacao.privilegio.codigo] = voluntarioNome
      });

      this.ds.push(reuniaoDs);

    });
  }

  openSnackBar() {
    this._snackBar.openFromComponent(SnackComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }


  pageBreak(bloco: number) {
    let blocoAjust = bloco + 1;
    return blocoAjust.toString().endsWith("0") || blocoAjust.toString().endsWith("5");
  }
}