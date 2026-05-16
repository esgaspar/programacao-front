import { Voluntario } from '../../voluntario/model/voluntario';

export class Privilegio {
    id!: number;
    ordem!: number;
    codigo!: string;
    descricao!: string;
    voluntarioList!: Voluntario[];
    status!: string;
    checked = false;
}
