import { AbstractRepository, EntityRepository, getCustomRepository } from 'typeorm'
import { HttpStatusCode } from '../common/http-status-code';
import { OperationError } from '../common/operation-error';
import { LoginModel } from '../models/login.model';
import { LoginResponseModel } from '../models/login.response.model';
import { SessionModel } from '../models/session.model';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import { UserModel } from '../models/user.model';
import { RegistrationModel } from '../models/registration.model';

@EntityRepository(SessionModel)
export class AuthRepository extends AbstractRepository<SessionModel>  {

    async login(model: LoginModel): Promise<LoginResponseModel> {
        const user = await getCustomRepository(UserRepository).getByEmail(model.email);
        if (!user || !bcrypt.compareSync(model.password, user.passwordHash)) {
            throw new OperationError('INVALID_EMAIL_OR_PASSWORD', HttpStatusCode.FORBIDDEN);
        }
        return this.generateSession(user);
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

    async deleteSession(token: string): Promise<boolean> {
        let session = await this.repository.findOne({
            where: { token: token }
        });

        if (session) {
            await this.repository.remove(session);
        }
        return true;
    };

    async updateSessionLastAccessDate(token: string): Promise<SessionModel | undefined> {
        let session = await this.getSession(token);
        if (session) {
            session.lastAccess = new Date();
            await this.repository.save(session)
            return session;
        }
        return undefined;
    }

    generateToken(length = 120): string {
        let token = '';
        while (token.length < length)
            token += Math.random().toString(36).slice(2);
        return token.substring(0, length);
    }

    async registerUser(model: RegistrationModel): Promise<LoginResponseModel> {
        if (await getCustomRepository(UserRepository).getByEmail(model.email)) {
            throw new OperationError('EMAIL_ADDRESS_ALREADY_IN_USE', HttpStatusCode.BAD_REQUEST);
        }
        const reg = new RegistrationModel(model);
        const passwordCheck = reg.isPassowrdOk();
        if (!passwordCheck.ok) {
            throw new OperationError(passwordCheck.errorCode, HttpStatusCode.BAD_REQUEST)
        }
        
        let user = new UserModel();
        user.name = reg.name;
        user.email = reg.email;
        user.passwordHash = await UserRepository.hashPassword(reg.password);
        user = await getCustomRepository(UserRepository).insert(user);
        
        return this.generateSession(user);
    }    

    private async generateSession(user: UserModel): Promise<LoginResponseModel> {
        const session = new SessionModel({
            user: user,
            lastAccess: new Date(),
            token: this.generateToken()
        });
        await this.repository.insert(session)
        let validTo = new Date()
        validTo.setTime(session.lastAccess.getTime() + parseInt(process.env.SESSION_TIMEOUT_MINUTE as string, 10) * 60 * 1000);
        const response = new LoginResponseModel({
            email: user.email,
            name: user.name,
            roles: user.roles.map(r => r.name),
            token: session.token,
            validTo: validTo
        });
        return response;
    }

}