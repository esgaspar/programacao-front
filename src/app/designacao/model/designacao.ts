import { Privilegio } from '../../privilegio/model/privilegio';
import { Voluntario } from '../../voluntario/model/voluntario';

export class Designacao {
    id!: number;
    data!: string;
    voluntario!: Voluntario;
    privilegio!: Privilegio;
}
