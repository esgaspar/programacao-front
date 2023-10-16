import { Role } from "./roles";

export class User {
    id!: number | null;
    password!: string;
    username!: string;
    email!: string;
    name!: string;
    roles!: Role[];
}