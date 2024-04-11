import { Module } from '@nestjs/common';
import { EnvironmentConfigService } from './environment-config.service';
import { ConfigModule } from '@nestjs/config';
import { validate } from './environment-config.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './env/local.env',
      // ignoreEnvFile: process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'test' ? false : true,
      isGlobal: true,
      validate,
    }),
  ],
  providers: [EnvironmentConfigService],
  exports: [EnvironmentConfigService],
})
export class EnvironmentConfigModule {
  constructor() {
    console.log('TEST PARAM ENV: ' + process.env.NODE_ENV);
    console.log('HOST: ' + process.env.DATABASE_HOST);
    console.log('PORT: ' + process.env.DATABASE_PORT);

  }
}
