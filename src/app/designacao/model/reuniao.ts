import { Privilegio } from "src/app/privilegio/model/privilegio";
import { Voluntario } from "src/app/voluntario/model/voluntario";
import { Designacao } from "./designacao";

export class Reuniao {
    data!: String;
    designacaoList: Designacao[] = [];
    check: boolean = false;
}