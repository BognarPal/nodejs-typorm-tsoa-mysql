import { GenericRepository } from './generic.repository';
import { EntityRepository } from 'typeorm'
import { UserModel } from '../models/user.model';
import { OperationError } from '../common/operation-error';
import { HttpStatusCode } from '../common/http-status-code';
import * as bcrypt from 'bcrypt';

@EntityRepository(UserModel)
export class UserRepository extends GenericRepository<UserModel> {
    async getByEmail(email: string): Promise<UserModel | undefined> {
        const user = await this.repository.findOne({
            where: { email: email },
            relations: ['roles']
        });       
        return user;
    }

    async insert(model: UserModel): Promise<UserModel> {
        await this.repository.insert(model)
        const user = this.getByEmail(model.email);
        return user as Promise<UserModel>;        
    }

    static hashPassword(password: string): string {
        return bcrypt.hashSync(password, 10);
    }
}