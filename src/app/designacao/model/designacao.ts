import { Privilegio } from "src/app/privilegio/model/privilegio";
import { Voluntario } from "src/app/voluntario/model/voluntario";

export class Designacao {
    id!: number;
    data!: String;
    voluntario!: Voluntario;
    privilegio!: Privilegio;
}