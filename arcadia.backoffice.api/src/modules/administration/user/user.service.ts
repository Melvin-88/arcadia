/* eslint-disable max-lines */
import { BadRequestException, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { ContextId, ModuleRef } from '@nestjs/core';
import {
  connectionNames,
  getRepositoryToken,
  UserEntity,
  BoModuleRepository,
  UserRepository,
  UserStatus,
  BoModulesEntity,
  In, ActionRepository,
  AuditAction,
} from 'arcadia-dal';
import { UserActionsResponse, UserResponse, UsersResponse } from './user.interface';
import { ChangeUserPasswordDto, CreateUserDto, EditUserDto } from './user.dto';
import {
  USER_ALREADY_EXISTS,
  USER_DELETED,
  USER_NOT_ACTIVE,
  USER_NOT_DISABLED,
  USER_NOT_FOUND,
  INVALID_PERMITTED_MODULES_SET,
} from '../../../messages/messages';
import { ModuleTags } from '../../../enums';
import { intToIp } from '../../../helpers/intToIp';
import { getObjectDiffs } from '../../../helpers/objectDiff';

@Injectable()
export class UserService {
  constructor(
      private readonly moduleRef: ModuleRef,
  ) {
  }

  private async isPermissionSetValid(permissionIds: number[], contextId: ContextId): Promise<boolean> {
    const boModuleRepository: BoModuleRepository = await this.moduleRef
      .resolve<BoModuleRepository>(getRepositoryToken(BoModuleRepository, connectionNames.DATA), contextId);
    const permissionListFromDBIds: number[] = (await boModuleRepository.getAllBoModules())
      .map((permission: BoModulesEntity) => permission.id);

    return permissionIds.every((id: number) => permissionListFromDBIds.includes(id));
  }

  public async getUsers(filters: any, contextId: ContextId): Promise<UsersResponse> {
    const userRepository: UserRepository = await this.moduleRef
      .resolve<UserRepository>(getRepositoryToken(UserRepository, connectionNames.DATA), contextId);
    const usersAndCount = await userRepository.getAllUsers(filters);
    const users = usersAndCount[0].map(user => {
      !user.permittedModules && (user.permittedModules = []);
      return user;
    });
    return {
      total: usersAndCount[1],
      users,
    };
  }

  public async createUser(data: CreateUserDto, contextId: ContextId): Promise<UserResponse> {
    const boModuleRepository: BoModuleRepository = await this.moduleRef
      .resolve<BoModuleRepository>(getRepositoryToken(BoModuleRepository, connectionNames.DATA), contextId);
    const userRepository: UserRepository = await this.moduleRef
      .resolve<UserRepository>(getRepositoryToken(UserRepository, connectionNames.DATA), contextId);

    const existingUser = await userRepository.findOne({ email: data.email, isDeleted: false });
    if (existingUser) {
      throw new BadRequestException(USER_ALREADY_EXISTS.en);
    }

    if (!(await this.isPermissionSetValid(data.permittedModules, contextId))) {
      throw new BadRequestException(INVALID_PERMITTED_MODULES_SET.en);
    }

    const user = new UserEntity();
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.email = data.email;
    user.password = await argon2.hash(data.userPassword);
    user.phone = data.phone1;
    user.phone2 = data.phone2;
    user.isAdmin = !!data.isAdmin;

    user.permittedModules = await boModuleRepository.find({ where: { id: In(data.permittedModules) } });

    if (!data.isAdmin) {
      user.permittedModules = user.permittedModules
        .filter(module => module.tag !== ModuleTags.OPERATORS && module.tag !== ModuleTags.ADMINISTRATION);
    }

    const savedUser = await userRepository.save(user);
    return {
      id: savedUser.id,
      status: savedUser.status,
      isAdmin: savedUser.isAdmin,
      userName: `${savedUser.firstName} ${savedUser.lastName}`,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      lastAccessDate: savedUser.lastAccessDate,
      lastAccessIp: savedUser.lastAccessIP as string,
      phone1: savedUser.phone,
      phone2: savedUser.phone2,
      email: savedUser.email,
      permittedModules: savedUser.permittedModules.map(module => module.id),
    };
  }

  public async editUser(id: string, data: EditUserDto, contextId: ContextId): Promise<UserResponse> {
    const userRepository: UserRepository = await this.moduleRef
      .resolve<UserRepository>(getRepositoryToken(UserRepository, connectionNames.DATA), contextId);
    const boModuleRepository: BoModuleRepository = await this.moduleRef
      .resolve<BoModuleRepository>(getRepositoryToken(BoModuleRepository, connectionNames.DATA), contextId);

    const user = await userRepository.findOne(id, { relations: ['permittedModules'] });
    if (!user) {
      throw new BadRequestException(USER_NOT_FOUND.en);
    }
    if (user.isDeleted) {
      throw new BadRequestException(USER_DELETED.en);
    }

    if (data.permittedModules) {
      if (!(await this.isPermissionSetValid(data.permittedModules, contextId))) {
        throw new BadRequestException(INVALID_PERMITTED_MODULES_SET.en);
      }
    }

    user.firstName = data.firstName || user.firstName;
    user.lastName = data.lastName || user.lastName;
    user.email = data.email || user.email;
    user.phone = data.phone1 || user.phone;
    user.phone2 = data.phone2 !== undefined ? data.phone2 : user.phone2;
    user.isAdmin = typeof data.isAdmin === 'boolean' ? data.isAdmin : user.isAdmin;
    user.updateDate = () => 'NOW()';

    if (data.permittedModules) {
      user.permittedModules = await boModuleRepository.find({ where: { id: In(data.permittedModules) } });
      if (!data.isAdmin) {
        user.permittedModules = user.permittedModules
            .filter(module => module.tag !== ModuleTags.OPERATORS && module.tag !== ModuleTags.ADMINISTRATION);
      }
    }

    const savedUser = await userRepository.save(user);
    return {
      id: savedUser.id,
      status: savedUser.status,
      isAdmin: savedUser.isAdmin,
      userName: `${savedUser.firstName} ${savedUser.lastName}`,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      lastAccessDate: savedUser.lastAccessDate,
      lastAccessIp: savedUser.lastAccessIP as string,
      phone1: savedUser.phone,
      phone2: savedUser.phone2,
      email: savedUser.email,
      permittedModules: savedUser.permittedModules.map(module => module.id),
    };
  }

  public async changeUserPassword(id: string, data: ChangeUserPasswordDto, contextId: ContextId): Promise<void> {
    const userRepository: UserRepository = await this.moduleRef
      .resolve<UserRepository>(getRepositoryToken(UserRepository, connectionNames.DATA), contextId);

    const user = await userRepository.findOne(id);
    if (!user) {
      throw new BadRequestException(USER_NOT_FOUND.en);
    }
    if (user.isDeleted) {
      throw new BadRequestException(USER_DELETED.en);
    }

    user.password = await argon2.hash(data.password);
    await userRepository.save(user);
  }

  public async enableUser(id: string, contextId: ContextId): Promise<UserResponse> {
    const userRepository: UserRepository = await this.moduleRef
      .resolve<UserRepository>(getRepositoryToken(UserRepository, connectionNames.DATA), contextId);

    const user = await userRepository.findOne(id);
    if (!user) {
      throw new BadRequestException(USER_NOT_FOUND.en);
    }
    if (user.isDeleted) {
      throw new BadRequestException(USER_DELETED.en);
    }
    if (user.status !== UserStatus.DISABLED) {
      throw new BadRequestException(USER_NOT_DISABLED.en);
    }
    user.status = UserStatus.ENABLED;
    const savedUser = await userRepository.save(user);
    return {
      id: savedUser.id,
      status: savedUser.status,
      isAdmin: savedUser.isAdmin,
      userName: `${savedUser.firstName} ${savedUser.lastName}`,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      lastAccessDate: savedUser.lastAccessDate,
      lastAccessIp: savedUser.lastAccessIP as string,
      phone1: savedUser.phone,
      phone2: savedUser.phone2,
      email: savedUser.email,
      permittedModules: savedUser.permittedModules.map(module => module.id),
    };
  }

  public async disableUser(id: string, contextId: ContextId): Promise<UserResponse> {
    const userRepository: UserRepository = await this.moduleRef
      .resolve<UserRepository>(getRepositoryToken(UserRepository, connectionNames.DATA), contextId);

    const user = await userRepository.findOne(id);
    if (!user) {
      throw new BadRequestException(USER_NOT_FOUND.en);
    }
    if (user.isDeleted) {
      throw new BadRequestException(USER_DELETED.en);
    }
    if (user.status !== UserStatus.ENABLED) {
      throw new BadRequestException(USER_NOT_ACTIVE.en);
    }
    user.status = UserStatus.DISABLED;
    const savedUser = await userRepository.save(user);
    return {
      id: savedUser.id,
      status: savedUser.status,
      isAdmin: savedUser.isAdmin,
      userName: `${savedUser.firstName} ${savedUser.lastName}`,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      lastAccessDate: savedUser.lastAccessDate,
      lastAccessIp: savedUser.lastAccessIP as string,
      phone1: savedUser.phone,
      phone2: savedUser.phone2,
      email: savedUser.email,
      permittedModules: savedUser.permittedModules.map(module => module.id),
    };
  }

  public async removeUser(id: string, contextId: ContextId): Promise<void> {
    const userRepository: UserRepository = await this.moduleRef
      .resolve<UserRepository>(getRepositoryToken(UserRepository, connectionNames.DATA), contextId);

    const user = await userRepository.findOne(id);
    if (!user) {
      throw new BadRequestException(USER_NOT_FOUND.en);
    }
    if (user.isDeleted) {
      throw new BadRequestException(USER_DELETED.en);
    }
    user.isDeleted = true;
    await userRepository.save(user);
  }

  public async userActions(id: string, query: any, contextId: ContextId): Promise<UserActionsResponse> {
    const actionsRepository: ActionRepository = await this.moduleRef
      .resolve<ActionRepository>(getRepositoryToken(ActionRepository, connectionNames.AUDIT), contextId);

    if (query.sortBy) {
      switch (query.sortBy) {
        case 'date':
          query.sortBy = 'action.createDate';
          break;
        case 'ip':
          query.sortBy = 'action.ip';
          break;
        case 'id':
          query.sortBy = 'action.id';
          break;
        case 'path':
          query.sortBy = 'action.path';
          break;
        default:
          throw new BadRequestException(`Unknown sort field '${query.sortBy}'`);
      }
    }

    const actions = await actionsRepository
      .createQueryBuilder('action')
      .select('action.id')
      .addSelect('action.path')
      .addSelect('action.ip')
      .addSelect('action.createDate')
      .leftJoinAndSelect('action.changes', 'changes')
      .orderBy(query.sortBy, query.sortOrder)
      .where('action.userId = :userId', { userId: parseInt(id, 10) })
      .take(query.take ? parseInt(query.take, 10) : 20)
      .skip(query.skip ? parseInt(query.skip, 10) : 0)
      .getManyAndCount();

    return {
      actions: actions[0].map(a => ({
        id: a.id,
        path: a.path,
        ip: intToIp((a.ip as unknown as Buffer).readInt32BE(0)),
        date: a.createDate,
        changes: a.changes.map(c => {
          const objectDiff = c.actionType === AuditAction.UPDATE ? getObjectDiffs(c.oldEntity, c.newEntity) : null;
          const previousData = objectDiff ? objectDiff.aOld : c.oldEntity;
          const newData = objectDiff ? objectDiff.bNew : c.newEntity;
          if (previousData?.logoBinary) {
            delete previousData.logoBinary;
          }
          if (newData?.logoBinary) {
            delete newData.logoBinary;
          }
          return {
            action: c.actionType,
            previousData,
            newData,
          };
        }),
      })),
      total: actions[1],
    };
  }
}
