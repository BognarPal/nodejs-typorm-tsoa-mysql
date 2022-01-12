import { GenericRepository } from './generic.repository';
import { EntityRepository } from 'typeorm'
import { UserModel } from '../models/user.model';

@EntityRepository(UserModel)
export class UserRepository extends GenericRepository<UserModel> {}