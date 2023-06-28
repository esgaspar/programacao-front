import { Component, OnInit } from '@angular/core';
import { PrivilegioService } from './service/privilegio.service';
import { Privilegio } from './model/privilegio';

@Component({
  selector: 'app-privilegio',
  templateUrl: './privilegio.component.html',
  styleUrls: ['./privilegio.component.sass']
})
export class PrivilegioComponent implements OnInit {

  service: PrivilegioService;
  list: Privilegio[] = [];

  constructor(service: PrivilegioService) {
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

}
