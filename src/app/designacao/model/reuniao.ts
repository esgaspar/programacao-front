import { Designacao } from "./designacao";

export class Reuniao {
    data!: string;
    designacaoList: Designacao[] = [];
    check: boolean = false;
}
