import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { TokenPayload } from "src/domain/model/auth";
import { EnvironmentConfigService } from "src/infrastructure/config/environment-config/environment-config.service";
import { ExceptionsService } from "src/infrastructure/exceptions/exceptions.service";
import { LoggerService } from "src/infrastructure/logger/logger.service";
import { UseCaseProxy } from "src/infrastructure/usecases-proxy/usecases-proxy";
import { UsecasesProxyModule } from "src/infrastructure/usecases-proxy/usecases-proxy.module";
import { LoginUseCases } from "src/usecases/auth/login.usecases";

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
    constructor(
        private readonly configService: EnvironmentConfigService,
        @Inject(UsecasesProxyModule.LOGIN_USECASES_PROXY)
        private readonly loginUsecaseProxy: UseCaseProxy<LoginUseCases>,
        private readonly logger: LoggerService,
        private readonly exceptionService: ExceptionsService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request?.cookies?.Refresh;
                },
            ]),
            secretOrKey: configService.getJwtRefreshSecret(),
            passReqToCallback: true,
        })
    }

    async validate(request: Request, payload: TokenPayload) {
        const refreshToken = request.cookies?.Refresh;
        const user = this.loginUsecaseProxy.getInstance().getUserIfRefreshTokenMatches(refreshToken, payload.username);
        if (!user) {
            this.logger.warn('JwtStrategy', `User not found or hash not correct`);
            this.exceptionService.UnauthorizedException({ message: 'User not found or hash not correct' });
        }
        return user;
    }
}