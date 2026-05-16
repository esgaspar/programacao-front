import { Privilegio } from '../../privilegio/model/privilegio';
import { Voluntario } from '../../voluntario/model/voluntario';
import { Designacao } from "./designacao";

export class Reuniao {
    data!: String;
    designacaoList: Designacao[] = [];
    check: boolean = false;
}