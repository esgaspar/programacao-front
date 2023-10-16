import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Privilegio } from '../privilegio/model/privilegio';
import { PrivilegioService } from '../privilegio/service/privilegio.service';
import { SnackComponent } from '../snack/snack.component';
import { Voluntario } from './model/voluntario';
import { VoluntarioService } from './service/voluntario.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-voluntario',
  templateUrl: './voluntario.component.html',
  styleUrls: ['./voluntario.component.css']
})
export class VoluntarioComponent implements OnInit {

  service: VoluntarioService;
  privilegioService: PrivilegioService;
  list: Voluntario[] = [];
  privilegioList: Privilegio[] = [];
  busca: string = '';
  privilegio = new FormControl('');



  constructor(service: VoluntarioService, privilegioService: PrivilegioService, private _snackBar: MatSnackBar) {
    this.service = service;
    this.privilegioService = privilegioService;
  }

  openSnackBar(message: string, action: string, type: String) {
    let config = new MatSnackBarConfig();
    config.duration = 1000;
    config.data = { type: type, message: message, action: action };
    this._snackBar.openFromComponent(SnackComponent, config)
  }

  ngOnInit(): void {
    this.getList();
  }

  getList() {
    this.service.getListByNome(this.busca)
      .subscribe((list: Voluntario[]) => {
        this.list = list;

        this.privilegioService.getList().subscribe((privilegioList: Privilegio[]) => {
          this.privilegioList = privilegioList;


          // this.list.forEach(voluntario => {
          //   this.privilegioList.forEach(privilegio => {
          //     let privilegioListVoluntario = voluntario.privilegioList;
          //     let privilegioEncontrado = privilegioListVoluntario.find(p => p.id == privilegio.id);
          //     if (privilegioEncontrado) {
          //       privilegioEncontrado.checked = true;
          //     } else {
          //       privilegio.checked = false;
          //       privilegioListVoluntario.push(JSON.parse(JSON.stringify(privilegio)));
          //     }

          //   });

          //   voluntario.privilegioList.sort((a, b) => a.ordem - b.ordem);
          // });

        })

      });


  }

  salvar(voluntario: Voluntario, sendMsg: boolean = true) {
    voluntario.isLoading = true;
    this.service.save(voluntario).subscribe({
      next: (v) => {
        if (sendMsg) {
          this.openSnackBar("Salvo com sucesso", "ok", "sucess");
        }
        console.log(v);
        voluntario.id = v.id;
      },
      error: (e) => { console.error(e); this.openSnackBar("Erro ao salvar", "ok", "error"); },
      complete: () => {
        setTimeout(() => {
          voluntario.isLoading = false
        }, 500);
      }
    })
  }

  isDisabled(privilegio: Privilegio, list: Privilegio[]) {
    return list.filter(p => p.id == privilegio.id).length > 0;
  }

  alteraPrivilegio(voluntario: Voluntario, privilegio: any) {
    let tmp: Privilegio | undefined = voluntario.privilegioList.pop();
    if (tmp !== undefined) {
      tmp.descricao = privilegio.value.descricao;
      tmp.id = privilegio.value.id;
      tmp.status = "novo";
      voluntario.privilegioList.push(tmp);

      this.salvar(voluntario);
    }
  }

  // removePrivilegio(voluntario: Voluntario, privilegio: any) {
  //   voluntario.privilegioList = JSON.parse(JSON.stringify(voluntario.privilegioList.filter(p => p.id !== privilegio.id)));
  //   this.salvar(voluntario);
  // }

  novoVoluntario() {
    this.list.push(new Voluntario());
  }

  removeVoluntario(voluntario: Voluntario) {
    this.service.remove(voluntario).subscribe({
      next: v => {
        this.openSnackBar("Removido com sucesso", "ok", "sucess");
        this.list = this.list.filter(v => v.id != voluntario.id);
      },
      error: e => {
        this.openSnackBar("Erro ao remover", "ok", "error");
      },
      complete: () => {

      }
    })
  }

  compareFn(p1: Privilegio, p2: Privilegio) {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }
}
