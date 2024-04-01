import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStragety extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExiration: false,
            secretOfKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: any) {
        return {
            userId: payload.sub,
            username: payload.username,
            roles: payload.roles,
        }
    }
}