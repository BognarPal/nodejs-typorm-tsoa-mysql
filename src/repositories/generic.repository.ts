import { AbstractRepository, UpdateResult, DeleteResult, createConnection } from 'typeorm'
import { HttpStatusCode } from '../common/http-status-code';
import { OperationError } from '../common/operation-error';

export class GenericRepository<T> extends AbstractRepository<T> {

  async getAll(): Promise<T[]> {
    return await this.repository.find();
  }

  async getById(id: number): Promise<T> {
    var item =  await this.repository.findOne(id);
    if (!item) {
        throw new OperationError("NOT_FOUND", HttpStatusCode.NOT_FOUND);
    }
    return item;
  }

  async create(data: object): Promise<T> {
    const result = this.repository.create(data);
    return await this.repository.save(result);
  }

  async update(id: string, data: object): Promise<UpdateResult> {
    return await this.repository.update(id, data);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }
}