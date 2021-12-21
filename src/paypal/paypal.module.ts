import { Module } from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { PaypalController } from './paypal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemEntity } from 'src/item/entities/item.entity';

@Module({
  providers: [PaypalService],
  controllers: [PaypalController],
  imports: [TypeOrmModule.forFeature([ItemEntity])],
})
export class PaypalModule {}
