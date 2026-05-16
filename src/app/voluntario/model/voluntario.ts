import { Privilegio } from '../../privilegio/model/privilegio';

export class Voluntario {
    id!: number;
    nome!: string;
    privilegioList: Privilegio[] = [];
    alerta: any;
    isLoading: boolean = false;
}
