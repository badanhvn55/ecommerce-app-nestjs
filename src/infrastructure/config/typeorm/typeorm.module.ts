import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { EnvironmentConfigService } from "../environment-config/environment-config.service";
import { Module } from "@nestjs/common";
import { EnvironmentConfigModule } from "../environment-config/environment-config.module";

export const getTypeOrmModuleOptions = (config: EnvironmentConfigService): TypeOrmModuleOptions => {
    console.log(`getTypeOrmModuleOptions-host: ${config.getDatabaseHost()}`);
    console.log(`getTypeOrmModuleOptions-port: ${config.getDatabasePort()}`);
    console.log(`getTypeOrmModuleOptions-usr: ${config.getDatabaseUser()}`);
    console.log(`getTypeOrmModuleOptions-psw: ${config.getDatabasePassword()}`);
    console.log(`getTypeOrmModuleOptions-dbname: ${config.getDatabaseName()}`);
    return ({
        type: 'postgres',
        host: config.getDatabaseHost(),
        port: config.getDatabasePort(),
        username: config.getDatabaseUser(),
        password: config.getDatabasePassword(),
        database: config.getDatabaseName(),
        entities: [__dirname + './../../**/*.entity{.ts,.js}'],
        synchronize: true,
        schema: process.env.DATABASE_SCHEMA,
        // migrationsRun: true,
        // migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
        // cli: {
        //     migrationsDir: 'src/migrations',
        // },
        // ssl: {
        //     rejectUnauthorized: false,
        // },
    } as TypeOrmModuleOptions);
}

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [EnvironmentConfigModule],
            inject: [EnvironmentConfigService],
            useFactory: getTypeOrmModuleOptions,
        }),
    ],
})
export class TypeOrmConfigModule {
    constructor() {
        console.log(`DATABASE_SCHEMA ${process.env.DATABASE_SCHEMA}`);

    }
}