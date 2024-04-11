import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IJwtService, IJwtServicePayload } from 'src/domain/adapters/jwt.interface';

@Injectable()
export class JwtTokenService implements IJwtService {
    constructor(private readonly jwtService: JwtService) { }

    async checkToken(token: string): Promise<any> {
        const decode = await this.jwtService.verifyAsync(token);
        return decode;
    }

    createToken(payload: IJwtServicePayload, secret: string, expiresIn: string) {
        return this.jwtService.sign(payload, {
            secret,
            expiresIn,
        });
    }

}
