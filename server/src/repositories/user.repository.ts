import { GenericRepository } from './generic.repository';
import { EntityRepository } from 'typeorm'
import { UserModel } from '../models/user.model';
import { OperationError } from '../common/operation-error';
import { HttpStatusCode } from '../common/http-status-code';
import * as bcrypt from 'bcrypt'; 

@EntityRepository(UserModel)
export class UserRepository extends GenericRepository<UserModel> {
    async getByEmail(email: string): Promise<UserModel> {
        var user =  await this.repository.findOne({
            where: { email: email },
            relations: ['roles']
        });
        if (!user) {
            throw new OperationError('INVALID_EMAIL_OR_PASSWORD', HttpStatusCode.FORBIDDEN);
        }
        return user;
      }

    static hashPassword(password: string): string {        
        return bcrypt.hashSync(password, 10);        
    }
}