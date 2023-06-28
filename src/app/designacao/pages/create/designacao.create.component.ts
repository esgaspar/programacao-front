import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Privilegio } from 'src/app/privilegio/model/privilegio';
import { PrivilegioService } from 'src/app/privilegio/service/privilegio.service';
import { Voluntario } from 'src/app/voluntario/model/voluntario';
import { Designacao } from '../../model/designacao';
import { DesignacaoService } from '../../service/designacao.service';
import { SnackComponent } from 'src/app/snack/snack.component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';



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
  selector: 'app-designacao-create',
  templateUrl: './designacao.create.component.html',
  styleUrls: ['./designacao.create.component.css']
})
export class DesignacaoCreateComponent implements OnInit {
  selectedDate: Date | null;


  privilegioService: PrivilegioService;
  datepipe: DatePipe;
  service: DesignacaoService;
  listPrivilegio: Privilegio[] = [];
  ds: Record<string, any> = [];
  search: Record<string, any> = [];
  filteredOptions: Record<string, any> = [];

  constructor(privilegioService: PrivilegioService,
    service: DesignacaoService,
    datepipe: DatePipe,
    private _snackBar: MatSnackBar) {
    this.datepipe = datepipe;
    this.privilegioService = privilegioService;
    this.service = service;
  }

  openSnackBar(message: string, action: string, type: String) {
    let config = new MatSnackBarConfig();
    config.duration = 1000;
    config.data = { type: type, message: message, action: action };
    this._snackBar.openFromComponent(SnackComponent, config)
  }

  ngOnInit(): void {
    this.getList();
    this.ds["data"] = "";
  }

  getList() {
    this.privilegioService.getList()
      .subscribe((list: Privilegio[]) => {
        this.listPrivilegio = list
        this.initDs();
      });
  }

  private initDs() {
    this.listPrivilegio.forEach(element => {
      this.ds[element.codigo] = "";
      this.search[element.codigo] = "";

    });
  }

  buscaReuniao() {
    if (this.selectedDate) {

      let data = this.datepipe.transform(this.selectedDate, "dd-MM-YYYY");

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

            console.log(v);
          },
          error: (e) => {
            console.error(e);
          },
          complete: () => { }
        })
      }
    }
  }

  saveAll() {
    let designacaoListToSave: Designacao[] = [];

    this.listPrivilegio.forEach(privilegio => {
      let designacao = new Designacao();
      let data = this.datepipe.transform(this.selectedDate, "dd-MM-YYYY");

      if (!data) { return }

      designacao.data = data;
      designacao.privilegio = privilegio;
      let v = new Voluntario();
      v = this.ds[privilegio.codigo];
      designacao.voluntario = v;

      designacaoListToSave.push(designacao);
    });

    this.service.saveAll(designacaoListToSave).subscribe({
      next: (v) => {
        this.openSnackBar("Salvo com sucesso", "ok", "sucess");
        console.log("sucesso", v)
      },
      error: (e) => {
        this.openSnackBar("Erro ao salvar", "ok", "error");
        console.log("erro", e)
      },
      complete: () => { console.log("save all complete!") }

    });

  }

  displayFn(voluntario: Voluntario): string {

    return (voluntario && voluntario.nome ? voluntario.nome : "").toString();
  }

  changeSelect(privilegio: Privilegio, voluntario: Voluntario) {

    if (!voluntario || !voluntario.id)
      return;

    this.ds[privilegio.codigo] = JSON.parse(JSON.stringify(voluntario));
  }



  private _filter(nome: string, options: Voluntario[]): Voluntario[] {
    const filterValue = nome.toLowerCase();

    return options.filter(option => option.nome.toLowerCase().includes(filterValue));
  }

  busca(e: any, privilegio: Privilegio) {

    let input = document.getElementById(
      'busca_' + privilegio.codigo,
    ) as HTMLInputElement | null;

    if (input)
      this.filteredOptions[privilegio.codigo] = this._filter(input.value, privilegio.voluntarioList);
  }
}