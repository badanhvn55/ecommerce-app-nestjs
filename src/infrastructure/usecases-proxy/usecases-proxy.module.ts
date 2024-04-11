import { DynamicModule, Module } from "@nestjs/common";
import { LoggerModule } from "../logger/logger.module";
import { RepositoriesModule } from "../repositories/repositories.module";
import { ExceptionsModule } from "../exceptions/exceptions.module";
import { DatabaseTodoRepository } from "../repositories/todo.repository";
import { UseCaseProxy } from "./usecases-proxy";
import { getTodoUseCases } from "src/usecases/todo/getTodo.usecases";
import { LoggerService } from "../logger/logger.service";
import { getTodosUseCases } from "src/usecases/todo/getTodos.usecases";
import { addTodoUseCases } from "src/usecases/todo/addTodo.usecases";
import { updateTodoUseCases } from "src/usecases/todo/updateTodo.usecases";
import { deleteTodoUseCases } from "src/usecases/todo/deleteTodo.usecases";
import { EnvironmentConfigModule } from "../config/environment-config/environment-config.module";
import { JwtModule } from "../services/jwt/jwt.module";
import { BcryptModule } from "../services/bcrypt/bcrypt.module";
import { LoginUseCases } from "src/usecases/auth/login.usecases";
import { JwtTokenService } from "../services/jwt/jwt.service";
import { EnvironmentConfigService } from "../config/environment-config/environment-config.service";
import { BcryptService } from "../services/bcrypt/bcrypt.service";
import { IsAuthenticatedUseCases } from "src/usecases/auth/isAuthenticated.usecases";
import { LogoutUseCases } from "src/usecases/auth/logout.usecases";
import { DatabaseUserRepository } from "../repositories/user.repository";

@Module({
    imports: [LoggerModule, JwtModule, BcryptModule, EnvironmentConfigModule, RepositoriesModule, ExceptionsModule],
})
export class UsecasesProxyModule {
    // Auth
    static LOGIN_USECASES_PROXY = 'LoginUseCasesProxy';
    static IS_AUTHENTICATED_USECASES_PROXY = 'IsAuthenticatedUseCasesProxy';
    static LOGOUT_USECASES_PROXY = 'LogoutUseCasesProxy';

    static GET_TODO_USECASES_PROXY = 'getTodoUsecasesProxy';
    static GET_TODOS_USECASES_PROXY = 'getTodosUsecasesProxy';
    static POST_TODO_USECASES_PROXY = 'postTodoUsecasesProxy';
    static DELETE_TODO_USECASES_PROXY = 'deleteTodoUsecasesProxy';
    static PUT_TODO_USECASES_PROXY = 'putTodoUsecasesProxy';

    static register(): DynamicModule {
        return {
            module: UsecasesProxyModule,
            providers: [
                {
                    inject: [
                        LoggerService,
                        JwtTokenService,
                        EnvironmentConfigService,
                        DatabaseUserRepository,
                        BcryptService,
                    ],
                    provide: UsecasesProxyModule.LOGIN_USECASES_PROXY,
                    useFactory: (
                        logger: LoggerService,
                        jwtTokenService: JwtTokenService,
                        config: EnvironmentConfigService,
                        userRepo: DatabaseUserRepository,
                        bcryptService: BcryptService,
                    ) => new UseCaseProxy(new LoginUseCases(logger, jwtTokenService, config, userRepo, bcryptService)),
                },
                {
                    inject: [DatabaseUserRepository],
                    provide: UsecasesProxyModule.IS_AUTHENTICATED_USECASES_PROXY,
                    useFactory: (userRepo: DatabaseUserRepository) =>
                        new UseCaseProxy(new IsAuthenticatedUseCases(userRepo)),
                },
                {
                    inject: [],
                    provide: UsecasesProxyModule.LOGOUT_USECASES_PROXY,
                    useFactory: () =>
                        new UseCaseProxy(new LogoutUseCases()),
                },
                {
                    inject: [DatabaseTodoRepository],
                    provide: UsecasesProxyModule.GET_TODO_USECASES_PROXY,
                    useFactory: (todoRepository: DatabaseTodoRepository) =>
                        new UseCaseProxy(new getTodoUseCases(todoRepository)),
                },
                {
                    inject: [DatabaseTodoRepository],
                    provide: UsecasesProxyModule.GET_TODOS_USECASES_PROXY,
                    useFactory: (todoRepository: DatabaseTodoRepository) =>
                        new UseCaseProxy(new getTodosUseCases(todoRepository)),
                },
                {
                    inject: [LoggerService, DatabaseTodoRepository],
                    provide: UsecasesProxyModule.POST_TODO_USECASES_PROXY,
                    useFactory: (logger: LoggerService, todoRepository: DatabaseTodoRepository) =>
                        new UseCaseProxy(new addTodoUseCases(logger, todoRepository)),
                },
                {
                    inject: [LoggerService, DatabaseTodoRepository],
                    provide: UsecasesProxyModule.PUT_TODO_USECASES_PROXY,
                    useFactory: (logger: LoggerService, todoRepository: DatabaseTodoRepository) =>
                        new UseCaseProxy(new updateTodoUseCases(logger, todoRepository)),
                },
                {
                    inject: [LoggerService, DatabaseTodoRepository],
                    provide: UsecasesProxyModule.DELETE_TODO_USECASES_PROXY,
                    useFactory: (logger: LoggerService, todoRepository: DatabaseTodoRepository) =>
                        new UseCaseProxy(new deleteTodoUseCases(logger, todoRepository)),
                },
            ],
            exports: [
                UsecasesProxyModule.LOGIN_USECASES_PROXY,
                UsecasesProxyModule.IS_AUTHENTICATED_USECASES_PROXY,
                UsecasesProxyModule.LOGOUT_USECASES_PROXY,
                UsecasesProxyModule.GET_TODO_USECASES_PROXY,
                UsecasesProxyModule.GET_TODOS_USECASES_PROXY,
                UsecasesProxyModule.POST_TODO_USECASES_PROXY,
                UsecasesProxyModule.PUT_TODO_USECASES_PROXY,
                UsecasesProxyModule.DELETE_TODO_USECASES_PROXY,
            ],
        };
    }
}