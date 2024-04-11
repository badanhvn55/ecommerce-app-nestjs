import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserM } from "src/domain/model/user";
import { UserRepository } from "src/domain/repositories/userRepository.interface";
import { User } from "../config/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class DatabaseUserRepository implements UserRepository {
    constructor(
        @InjectRepository(User)
        private readonly userEntityRepository: Repository<User>
    ) { }

    async getUserByUsername(username: string): Promise<UserM> {
        const adminUserEntity = await this.userEntityRepository.findOne({
            where: {
                username
            },
        });
        if (!adminUserEntity) {
            return null;
        }
        return this.toUser(adminUserEntity);
    }

    async updateLastLogin(username: string): Promise<void> {
        await this.userEntityRepository.update(
            {
                username
            },
            { last_login: () => 'CURRENT_TIMESTAMP' },
        );
    }

    async updateRefreshToken(username: string, refreshToken: string): Promise<void> {
        await this.userEntityRepository.update(
            {
                username
            },
            { hach_refresh_token: refreshToken }
        );
    }

    private toUser(adminUserEntity: User): UserM {
        const adminUser: UserM = new UserM();
        adminUser.id = adminUserEntity.id;
        adminUser.username = adminUserEntity.username;
        adminUser.password = adminUserEntity.password;
        adminUser.createDate = adminUserEntity.createdate;
        adminUser.updateDate = adminUserEntity.updatedate;
        adminUser.lastLogin = adminUserEntity.last_login;
        adminUser.hashRefreshToken = adminUserEntity.hach_refresh_token;
        return adminUser;
    }

    private toUserEntity(adminUser: UserM): User {
        const adminUserEntity: User = new User();
        adminUserEntity.username = adminUser.username;
        adminUserEntity.password = adminUser.password;
        adminUserEntity.last_login = adminUser.lastLogin;
        return adminUserEntity;
    }
}