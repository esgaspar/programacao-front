import { Voluntario } from "src/app/voluntario/model/voluntario";

export class Privilegio {
    id!: number;
    ordem!: number;
    codigo!: string;
    descricao!: String;
    voluntarioList!: Voluntario[];
    status!: String;
  checked: boolean;
}