export class UserWithoutPassword {
    id: number;
    username: string;
    createDate: Date;
    updateDate: Date;
    lastLogin: Date;
    hashRefreshToken: string;
}

export class UserM extends UserWithoutPassword {
    password: string;
}