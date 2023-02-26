import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as argon2 from 'argon2';
import {
  InjectRepository,
  connectionNames,
  UserRepository,
  UserEntity,
  BoModuleRepository,
  OperatorRepository,
  OperatorEntity,
} from 'arcadia-dal';
import { BoModulesResponse, LoginResponse, LoginVoucherPortalResponse } from './auth.interface';
import { BAD_TOKEN, LOGIN_FAILED } from '../../messages/messages';
import { ConfigService } from '../config/config.service';

@Injectable()
export class AuthService {
  private readonly jwtSecret: string;
  constructor(
      @InjectRepository(UserRepository, connectionNames.DATA) private readonly userRepository: UserRepository,
      @InjectRepository(OperatorRepository, connectionNames.DATA) private readonly operatorRepository: OperatorRepository,
      @InjectRepository(BoModuleRepository, connectionNames.DATA) private readonly boModuleRepository: BoModuleRepository,
      private readonly config: ConfigService,
  ) {
    this.jwtSecret = config.get(['core', 'JWT_SECRET']) as string;
  }

  public async validateToken(token: string): Promise<UserEntity> {
    let payload = null;
    try {
      payload = await jwt.verify(token, this.jwtSecret);
    } catch (err) {
      throw new UnauthorizedException(BAD_TOKEN.en);
    }
    if (!payload.userId) {
      throw new UnauthorizedException(BAD_TOKEN.en);
    }

    return this.userRepository.findOne(payload.userId, { where: { isDeleted: false }, relations: ['permittedModules'] });
  }

  public async validateVoucherPortalToken(token: string): Promise<OperatorEntity> {
    let payload = null;
    try {
      payload = await jwt.verify(token, this.jwtSecret);
    } catch (err) {
      throw new UnauthorizedException(BAD_TOKEN.en);
    }
    if (!payload.operatorId) {
      throw new UnauthorizedException(BAD_TOKEN.en);
    }

    return this.operatorRepository.findOne({ where: { id: payload.operatorId, isDeleted: false } });
  }

  public async verifyPassword(password: string, argonPassword: string): Promise<boolean> {
    return argon2.verify(argonPassword, password);
  }

  public async login(email: string, password: string): Promise<LoginResponse> {
    const user = await this.userRepository.findOne({ where: { email, isDeleted: false }, relations: ['permittedModules'] });
    if (!user) {
      throw new UnauthorizedException(LOGIN_FAILED.en);
    }
    // Validate password
    if (!(await this.verifyPassword(password, user.password))) {
      throw new UnauthorizedException(LOGIN_FAILED.en);
    }
    const payload = { userId: user.id };
    const token = jwt.sign(payload, this.jwtSecret);

    return {
      token,
      permittedModules: user.permittedModules.map(module => module.id),
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    };
  }

  public async loginVoucherPortal(username: string, password: string): Promise<LoginVoucherPortalResponse> {
    const operator = await this.operatorRepository.findOne({ where: { voucherPortalUsername: username, isDeleted: false } });
    if (!operator) {
      throw new UnauthorizedException(LOGIN_FAILED.en);
    }
    // Validate password
    if (!(await this.verifyPassword(password, operator.voucherPortalPassword))) {
      throw new UnauthorizedException(LOGIN_FAILED.en);
    }
    const payload = { operatorId: operator.id };
    const token = jwt.sign(payload, this.jwtSecret);

    return {
      token,
      operator: {
        id: operator.id,
        name: operator.name,
      },
    };
  }

  public async getAllBoModules(): Promise<BoModulesResponse> {
    const modules = await this.boModuleRepository.getAllBoModules();

    return { modules: modules.map(module => ({ id: module.id, name: module.name, description: module.description })) };
  }
}
