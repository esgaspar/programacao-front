import { DatePipe } from '@angular/common';
import { Component, OnInit, TrackByFunction } from '@angular/core';
import { Privilegio } from 'src/app/privilegio/model/privilegio';
import { PrivilegioService } from 'src/app/privilegio/service/privilegio.service';
import { Voluntario } from 'src/app/voluntario/model/voluntario';
import { Designacao } from '../../model/designacao';
import { DesignacaoService } from '../../service/designacao.service';
import { SnackComponent } from 'src/app/snack/snack.component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Reuniao } from '../../model/reuniao';



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
    this.buscaMes();
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
    this.buscaMes();
  }

  historicoMes: Reuniao[];

  buscaMes() {
    let data;

    if (this.selectedDate) {

      data = this.datepipe.transform(this.selectedDate, "MM");
    } else {
      data = this.datepipe.transform(new Date(), "MM");
    }

    if (data) {
      this.service.getByMes(data).subscribe({
        next: (v: Designacao[]) => {

          if (v.length) {
            this.historicoMes = this.transfor(v);
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

  remove(value: Reuniao) {

    this.service.deleteAll(value.designacaoList).subscribe({
      next: (v) => {
        this.openSnackBar("Removido com sucesso", "ok", "sucess");
        console.log("sucesso", v)
        this.historicoMes = this.historicoMes.filter(h => h.data != value.data);
      },
      error: (e) => {
        this.openSnackBar("Erro ao remover", "ok", "error");
        console.log("erro", e)
      },
      complete: () => { console.log("save all complete!") }

    });

  }

  displayFn(voluntario: Voluntario): string {

    return (voluntario && voluntario.nome ? voluntario.nome : "").toString();
  }

  changeSelect(privilegio: Privilegio, voluntario: any) {

    console.log("voluntario", voluntario);
    if (!voluntario || !voluntario?.option?.value?.id)
      return;

    let v = JSON.parse(JSON.stringify(voluntario?.option?.value))
    let alerta = { tipo: '', mensagem: [''] };

    this.listPrivilegio?.forEach(p => {
      if (this.ds[p.codigo].id === v.id && p.codigo !== privilegio.codigo) {
        if (alerta.mensagem[0] === '')
          alerta.mensagem.pop()
        alerta.tipo = 'erro';
        alerta.mensagem.push(`[Conflito com designação de ${p.descricao} nesta semana]
        

        `);
      }
    });


    let conflitoDesignacao = [];
    let listDataConflito: any = "";
    this.historicoMes?.forEach(mes => {
      conflitoDesignacao = mes.designacaoList.filter(designacao => {
        return designacao.privilegio.id === privilegio.id && v.id === designacao.voluntario.id
      })
      conflitoDesignacao.forEach(element => {
        listDataConflito = listDataConflito == '' ? element.data : listDataConflito + ', ' + element.data;
      });
    });

    if (listDataConflito !== "") {
      if (alerta.mensagem[0] === '')
        alerta.mensagem.pop()
      alerta.tipo = 'erro';
      alerta.mensagem.push(` 

      [Conflito com designação de ${privilegio.descricao} em ${listDataConflito.toLocaleString()}]`)

    }

    setTimeout(() => {
      v.alerta = alerta
      this.ds[privilegio.codigo] = v;
    }, 10);;
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

  stringToDate(str: String): Date {
    const [day, month, year] = str.split('/');
    return new Date(+year, +month - 1, +day);
  }
}