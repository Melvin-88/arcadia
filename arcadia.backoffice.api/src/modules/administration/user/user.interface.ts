import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
    @ApiProperty()
    public status: string;

    @ApiProperty()
    public id: number;

    @ApiProperty()
    public isAdmin: boolean;

    @ApiProperty()
    public userName: string;

    @ApiProperty()
    public firstName: string;

    @ApiProperty()
    public lastName: string;

    @ApiProperty()
    public lastAccessDate: Date;

    @ApiProperty()
    public lastAccessIp: string;

    @ApiProperty()
    public phone1: string;

    @ApiProperty()
    public phone2: string;

    @ApiProperty()
    public email: string;

    @ApiProperty()
    public permittedModules: number[];
}

export class UsersResponse {
    @ApiProperty()
    public total: number;

    @ApiProperty({ type: [UserResponse] })
    public users: UserResponse[];
}

export class Change {
    @ApiProperty()
    public action: string;

    @ApiProperty()
    public previousData: any;

    @ApiProperty()
    public newData: any;
}

export class UserAction {
    @ApiProperty()
    public id: string;

    @ApiProperty()
    public path: string;

    @ApiProperty()
    public ip: string;

    @ApiProperty()
    public date: Date;

    @ApiProperty({ type: [Change] })
    public changes: Change[];
}

export class UserActionsResponse {
    @ApiProperty({ type: [UserAction] })
    public actions: UserAction[];

    @ApiProperty()
    public total: number;
}
