import { AbstractRepository, EntityRepository, getCustomRepository } from 'typeorm'
import { HttpStatusCode } from '../common/http-status-code';
import { OperationError } from '../common/operation-error';
import { LoginModel } from '../models/login.model';
import { LoginResponseModel } from '../models/login.response.model';
import { SessionModel } from '../models/session.model';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt'; 

@EntityRepository(SessionModel)
export class AuthRepository extends AbstractRepository<SessionModel>  {

    async login(model: LoginModel): Promise<LoginResponseModel> {        
        var user = await getCustomRepository(UserRepository).getByEmail(model.email);        
        if (!user || !bcrypt.compareSync(model.password, user.passwordHash)) {
            throw new OperationError('INVALID_EMAIL_OR_PASSWORD', HttpStatusCode.FORBIDDEN);
        }
        var session = new SessionModel({
            user: user,
            lastAccess: new Date(),
            token: this.generateToken()
        });
        await this.repository.insert(session)

        var response = new LoginResponseModel({
            email: model.email,
            name: user.name,
            roles: user.roles.map(r => r.name),
            token: session.token
        });
        return response;
      }

    generateToken(length = 120): string {
        var token = '';
        while (token.length < length)
            token += Math.random().toString(36).slice(2);
        return token.substring(0, length);
    }
    

}