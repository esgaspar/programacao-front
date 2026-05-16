import { Voluntario } from '../../voluntario/model/voluntario';

export class Privilegio {
    id!: number;
    ordem!: number;
    codigo!: string;
    descricao!: String;
    voluntarioList!: Voluntario[];
    status!: String;
  checked: boolean;
}