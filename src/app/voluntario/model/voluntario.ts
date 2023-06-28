import { Privilegio } from "src/app/privilegio/model/privilegio";

export class Voluntario {
    id!: number;
    nome!: String;
    privilegioList: Privilegio[] = [];
}