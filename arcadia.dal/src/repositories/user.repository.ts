import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { UserEntity } from '../entities';
import { Sort, UserInterface } from '../interfaces';
import { setSorting } from '../utils';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  private buildWhereString(filters: any, queryBuilder: SelectQueryBuilder<UserEntity>): void {
    queryBuilder.where('');
    if (filters.id) {
      queryBuilder.andWhere('user.id = :id', { id: filters.id });
    }
    if (filters.status) {
      queryBuilder.andWhere('user.status IN (:status)', { status: filters.status });
    }
    if (filters.isAdmin) {
      queryBuilder.andWhere('user.is_admin = :isAdmin', { isAdmin: filters.isAdmin });
    }
    if (filters.userName) {
      queryBuilder.andWhere('CONCAT(user.first_name, " ", user.last_name) LIKE :userName', { userName: `%${filters.userName}%` });
    }
    if (filters.lastAccessDateFrom) {
      queryBuilder.andWhere('user.last_access_date >= :lastAccessDateFrom', { lastAccessDateFrom: filters.lastAccessDateFrom });
    }
    if (filters.lastAccessDateTo) {
      queryBuilder.andWhere('user.last_access_date <= :lastAccessDateTo', { lastAccessDateTo: filters.lastAccessDateTo });
    }
    if (filters.lastAccessIp) {
      queryBuilder.andWhere('INET6_NTOA(user.last_access_ip) = :ip', { ip: filters.lastAccessIp });
    }
    queryBuilder.andWhere('user.is_deleted = false');
  }

  public async getAllUsers(filters: any): Promise<[UserInterface[], number]> {
    let sortParam: Sort = { sort: 'user.create_date', order: 'DESC' };
    if (filters.sortBy) {
      sortParam = setSorting(this, ['userName', 'lastAccessIp'], filters.sortBy, filters.sortOrder);
    }
    const usersQuery = this.createQueryBuilder('user')
      .select('user.id', 'id')
      .addSelect('user.status', 'status')
      .addSelect('user.is_admin', 'isAdmin')
      .addSelect('CONCAT(user.first_name, " ", user.last_name)', 'userName')
      .addSelect('user.first_name', 'firstName')
      .addSelect('user.last_name', 'lastName')
      .addSelect('user.last_access_date', 'lastAccessDate')
      .addSelect('INET6_NTOA(user.last_access_ip)', 'lastAccessIp')
      .addSelect('user.phone', 'phone1')
      .addSelect('user.phone2', 'phone2')
      .addSelect('user.email', 'email')
      .leftJoin('user_permitted_modules_bo_module', 'cross_table', 'id=cross_table.user_id')
      .leftJoin('bo_module', 'modules', 'cross_table.bo_module_id=modules.id')
      .addSelect('GROUP_CONCAT(modules.id)', 'permittedModules')
      .groupBy('id');
    this.buildWhereString(filters, usersQuery);

    const users = await usersQuery
      .addOrderBy(sortParam.sort, sortParam.order)
      .limit(filters.take || 20)
      .offset(filters.offset || 0)
      .addGroupBy('email')
      .having('COUNT(email) > 0')
      .getRawMany();

    users.forEach(user => {
      user.isAdmin = !!user.isAdmin;
      if (user.permittedModules) {
        user.permittedModules = user.permittedModules.split(',').map(moduleId => Number(moduleId));
      }
    });

    const countQuery = this.createQueryBuilder('user')
      .select('COUNT(*)', 'count');
    this.buildWhereString(filters, countQuery);
    const count = await countQuery.getRawOne();

    return [users, parseInt(count.count, 10)];
  }
}
