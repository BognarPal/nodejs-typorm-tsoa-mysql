import { AbstractRepository, EntityRepository, getCustomRepository } from 'typeorm'
import { HttpStatusCode } from '../common/http-status-code';
import { OperationError } from '../common/operation-error';
import { LoginModel } from '../models/login.model';
import { LoginResponseModel } from '../models/login.response.model';
import { SessionModel } from '../models/session.model';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import { UserModel } from '../models/user.model';

@EntityRepository(SessionModel)
export class AuthRepository extends AbstractRepository<SessionModel>  {

    async login(model: LoginModel): Promise<LoginResponseModel> {
        const user = await getCustomRepository(UserRepository).getByEmail(model.email);
        if (!user || !bcrypt.compareSync(model.password, user.passwordHash)) {
            throw new OperationError('INVALID_EMAIL_OR_PASSWORD', HttpStatusCode.FORBIDDEN);
        }
        const session = new SessionModel({
            user: user,
            lastAccess: new Date(),
            token: this.generateToken()
        });
        await this.repository.insert(session)

        const response = new LoginResponseModel({
            email: model.email,
            name: user.name,
            roles: user.roles.map(r => r.name),
            token: session.token
        });
        return response;
    }

    async getSession(token: string): Promise<SessionModel | undefined> {
        let session = await this.repository.findOne({
            where: { token: token },
            relations: ['user', 'user.roles']
        });

        if (session) {
            let validTo = new Date()
            validTo.setTime(session.lastAccess.getTime() + parseInt(process.env.SESSION_TIMEOUT_MINUTE as string, 10) * 60 * 1000);
            if (validTo < new Date()) {
                console.log('expired token - deleted');
                await this.repository.remove(session);
                return undefined;
            }
        }
        return session;
    };

    async updateSessionLastAccessDate(token: string): Promise<void> {
        let session = await this.getSession(token);
        if (session) {
            session.lastAccess = new Date();
            await this.repository.save(session)
        }
    }

    generateToken(length = 120): string {
        let token = '';
        while (token.length < length)
            token += Math.random().toString(36).slice(2);
        return token.substring(0, length);
    }


}