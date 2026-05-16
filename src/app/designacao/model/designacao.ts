import { Privilegio } from '../../privilegio/model/privilegio';
import { Voluntario } from '../../voluntario/model/voluntario';

export class Designacao {
    id!: number;
    data!: String;
    voluntario!: Voluntario;
    privilegio!: Privilegio;
}