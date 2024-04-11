import { Body, Controller, Inject, Post, Req, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { IsAuthPresenter } from "./auth.presenter";
import { UsecasesProxyModule } from "src/infrastructure/usecases-proxy/usecases-proxy.module";
import { UseCaseProxy } from "src/infrastructure/usecases-proxy/usecases-proxy";
import { LoginUseCases } from "src/usecases/auth/login.usecases";
import { LogoutUseCases } from "src/usecases/auth/logout.usecases";
import { IsAuthenticatedUseCases } from "src/usecases/auth/isAuthenticated.usecases";
import { AuthLoginDto } from "./auth-dto.class";
import { LoginGuard } from "src/infrastructure/common/guard/login.guard";
import { JwtAuthGuard } from "src/infrastructure/common/guard/jwtAuth.guard";
import { ApiResponseType } from "src/infrastructure/common/swagger/response.decorator";
import { JwtRefreshGuard } from "src/infrastructure/common/guard/jwtRefresh.guard";

@Controller('auth')
@ApiTags('auth')
@ApiResponse({
    status: 401,
    description: 'No authorization token was found',
})
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(IsAuthPresenter)
export class AuthController {
    constructor(
        @Inject(UsecasesProxyModule.LOGIN_USECASES_PROXY)
        private readonly loginUsecaseProxy: UseCaseProxy<LoginUseCases>,
        @Inject(UsecasesProxyModule.LOGOUT_USECASES_PROXY)
        private readonly logoutUsecaseProxy: UseCaseProxy<LogoutUseCases>,
        @Inject(UsecasesProxyModule.IS_AUTHENTICATED_USECASES_PROXY)
        private readonly isAuthUsecaseProxy: UseCaseProxy<IsAuthenticatedUseCases>,
    ) { }

    @Post('login')
    @UseGuards(LoginGuard)
    @ApiBearerAuth()
    @ApiBody({ type: AuthLoginDto })
    @ApiOperation({ description: 'login' })
    async login(@Body() auth: AuthLoginDto, @Request() request: any) {
        const accessTokenCookie = await this.loginUsecaseProxy.getInstance().getCookieWithJwtToken(auth.username);
        const refreshTokenCookie = await this.loginUsecaseProxy.getInstance().getCookieWithJwtRefreshToken(auth.username);
        request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
        return 'Login successful';
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ description: 'logout' })
    async logout(@Request() request: any) {
        const cookie = await this.logoutUsecaseProxy.getInstance().execute();
        request.res.setHeader('Set-Cookie', cookie);
        return 'Logout successful';
    }

    @Post('is_authenticated')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ description: 'is_authenticated' })
    @ApiResponseType(IsAuthPresenter, false)
    async isAuthenticated(@Req() request: any) {
        const user = await this.isAuthUsecaseProxy.getInstance().execute(request.user.username);
        const response = new IsAuthPresenter();
        response.username = user.username;
        return response;
    }

    @Post('refresh')
    @UseGuards(JwtRefreshGuard)
    @ApiBearerAuth()
    async refresh(@Req() request: any) {
        const accessTokenCookie = await this.loginUsecaseProxy.getInstance().getCookieWithJwtToken(request.user.username);
        request.res.setHeader('Set-Cookie', accessTokenCookie);
        return 'Refresh successful';
    }
}