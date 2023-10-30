import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { Privilegio } from '../privilegio/model/privilegio';
import { PrivilegioService } from '../privilegio/service/privilegio.service';
import { SnackComponent } from '../snack/snack.component';
import { Designacao } from './model/designacao';
import { Reuniao } from './model/reuniao';
import { DesignacaoService } from './service/designacao.service';
import html2pdf from 'html2pdf.js';


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
  isPrinting = false;
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

  pageBreak(bloco: number) {
    let blocoAjust = bloco + 1;
    return blocoAjust.toString().endsWith("0") || blocoAjust.toString().endsWith("5");
  }

  remove(value: Reuniao) {

    this.service.deleteAll(value.designacaoList).subscribe({
      next: (v) => {
        this.openSnackBar("Removido com sucesso", "ok", "sucess");
        console.log("sucesso", v)
        this.reuniaoList = this.reuniaoList.filter(h => h.data != value.data);
      },
      error: (e) => {
        this.openSnackBar("Erro ao remover", "ok", "error");
        console.log("erro", e)
      },
      complete: () => { console.log("save all complete!") }

    });

  }

  openSnackBar(message: string, action: string, type: String) {
    let config = new MatSnackBarConfig();
    config.duration = 1000;
    config.data = { type: type, message: message, action: action };
    this._snackBar.openFromComponent(SnackComponent, config)
  }

  imprimir() {

    const element = document.querySelector('#print-section');//id of HTML element

    let start = this.datepipe.transform(this.startDate, "dd-MM-YYYY");
    let end = this.datepipe.transform(this.endDate, "dd-MM-YYYY");

    const options = {
      filename: `Indicadores de ${start} até ${end}`,
      margin: [0, 0.5, 0, 0.5],
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'cm', format: 'A4', orientation: 'portrait' },
    };
    html2pdf().set(options).from(element).save().then(result => {
      console.log("rtersultado")
    });
  }
}