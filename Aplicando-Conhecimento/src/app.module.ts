import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TransacoesModule } from './transacoes/transacoes.module';

@Module({
  imports: [
    // Carrega as variáveis do arquivo .env
    ConfigModule.forRoot({ isGlobal: true }),

    // Conexão com o MongoDB Atlas usando a string definida em MONGODB_URI
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),

    TransacoesModule,
  ],
})
export class AppModule {}
