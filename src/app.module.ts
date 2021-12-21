import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemEntity } from './item/entities/item.entity';
import { ItemModule } from './item/item.module';
import { PaypalModule } from './paypal/paypal.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'test_db',
      entities: [ItemEntity],
      synchronize: true,
    }),
    ItemModule,
    PaypalModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
