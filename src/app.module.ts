import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './common/config/configuration';
import { UserModule } from './user/user.module';
import { JwtConfigModule } from './jwt-config/jwt-config.module';
import { EmailHandlerModule } from './email-handler/email-handler.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: path.join(__dirname, '..', 'public'),
		}),
		UserModule,
		EmailHandlerModule,
		ConfigModule.forRoot({
			load: [configuration],
		}),
		SequelizeModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				...configService.get<any>('database'),
				sync: {
					alter: true,
				},
				autoLoadModels: true,
			}),
			inject: [ConfigService],
		}),
		JwtConfigModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
