import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity({name : 'roles'})
export class RoleModel {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 30,
        unique: true
    })
    name: string;
}