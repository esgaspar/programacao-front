import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Privilegio } from './model/privilegio';
import { PrivilegioService } from './service/privilegio.service';




import {
  CdkDragDrop,
  moveItemInArray
} from '@angular/cdk/drag-drop';
import { SnackComponent } from '../snack/snack.component';

@Component({
  selector: 'app-privilegio',
  templateUrl: './privilegio.component.html',
  styleUrls: ['./privilegio.component.css']
})
export class PrivilegioComponent implements OnInit {
  datemask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

  service: PrivilegioService;
  list: Privilegio[] = [];

  constructor(service: PrivilegioService, private _snackBar: MatSnackBar) {
    this.service = service;
  }
  ngOnInit(): void {
    this.getList();
  }

  getList() {
    this.service.getList()
      .subscribe((list: Privilegio[]) => {
        this.list = list
      });
  }

  drop(event: CdkDragDrop<string[]>) {
    this.list[event.previousIndex].ordem = event.currentIndex;
    moveItemInArray(this.list, event.previousIndex, event.currentIndex);

    for (let index = 0; index < this.list.length; index++) {
      this.list[index].ordem = index;
    }

    this.service.saveAll(this.list).subscribe({
      next: (list) => { },
      error: (e) => { console.error(e); this.openSnackBar("Erro ao salvar", "ok", "error"); },
      complete: () => { }
    })
  }

  novo() {
    this.list.push(new Privilegio());
  }

  salvar(privilegio: Privilegio, sendMsg: boolean = true) {
    privilegio.codigo = this.normalizeCodigo(privilegio.descricao);
    this.service.save(privilegio).subscribe({
      next: (v) => {
        if (sendMsg) {
          this.openSnackBar("Salvo com sucesso", "ok", "sucess");
        }
        console.log(v);
        privilegio.id = v.id;
      },
      error: (e) => { console.error(e); this.openSnackBar("Erro ao salvar", "ok", "error"); },
      complete: () => { }
    })
  }

  openSnackBar(message: string, action: string, type: String) {
    let config = new MatSnackBarConfig();
    config.duration = 1000;
    config.data = { type: type, message: message, action: action };
    this._snackBar.openFromComponent(SnackComponent, config)
  }

  remove(toRemove: Privilegio) {
    this.service.remove(toRemove).subscribe({
      next: v => {
        this.openSnackBar("Removido com sucesso", "ok", "sucess");
        this.list = this.list.filter(v => v.id != toRemove.id);
      },
      error: e => {
        this.openSnackBar("Erro ao remover", "ok", "error");
      },
      complete: () => {

      }
    })
  }

  normalizeCodigo(value: String) {
    return value.toLocaleLowerCase().trim().replace(/ /g, "-").normalize('NFD').replace(/\p{Mn}/gu, "");
  }

}
