import {Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable} from "typeorm";
import { RoleModel } from "./role.model.";

@Entity({name: 'users'})
export class UserModel {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 200,
        unique: true
    })
    email: string;

    @Column({
        length: 100
    })
    name: string;

    @Column({
        length: 200
    })
    passwordHash: string;

    @ManyToMany(() => RoleModel)
    @JoinTable({name: 'users_roles'})
    roles: RoleModel[];
}