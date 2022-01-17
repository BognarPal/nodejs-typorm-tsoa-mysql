import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinTable, JoinColumn} from "typeorm";
import { UserModel } from "./user.model";

@Entity({name: 'sessions'})
export class SessionModel {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => UserModel)
    @JoinColumn({name : 'userId', referencedColumnName: 'id'})
    user: UserModel;

    @Column()
    lastAccess: Date;

    @Column({
        length: 200,
        unique: true
    })
    token: string;

    public constructor(init?:Partial<SessionModel>) {
        if (init)
            Object.assign(this, init);
    }
}