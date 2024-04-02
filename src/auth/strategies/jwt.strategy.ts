import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStragety extends PassportStrategy(Strategy) {
    constructor() {
        console.log("secret key: " + process.env.JWT_SECRET);

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
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