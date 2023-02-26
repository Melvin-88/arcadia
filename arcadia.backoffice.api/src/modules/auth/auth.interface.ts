import { ApiProperty } from '@nestjs/swagger';

export class LoginUserInfoInterface {
    @ApiProperty()
    public firstName: string;

    @ApiProperty()
    public lastName: string;

    @ApiProperty()
    public email: string;
}

export class LoginVoucherPortalOperatorInterface {
    @ApiProperty()
    public name: string;

    @ApiProperty()
    public id: number;
}

export class LoginResponse {
    @ApiProperty()
    public token: string;

    @ApiProperty()
    public permittedModules: number[];

    @ApiProperty({ type: LoginUserInfoInterface })
    public user: LoginUserInfoInterface;
}

export class LoginVoucherPortalResponse {
    @ApiProperty()
    public token: string;

    @ApiProperty({ type: LoginVoucherPortalOperatorInterface })
    public operator: LoginVoucherPortalOperatorInterface;
}

export class BoModuleResponse {
    @ApiProperty()
    public id: number;

    @ApiProperty()
    public name: string;

    @ApiProperty()
    public description: string;
}

export class BoModulesResponse {
    @ApiProperty({ type: [BoModuleResponse] })
    public modules: BoModuleResponse[];
}
