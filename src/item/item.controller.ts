import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PaypalService } from 'src/paypal/paypal.service';
import { UpdateDateColumn } from 'typeorm';
import { CallbackDto } from './dto/callback.dto';
import { CreateItemDto } from './dto/createItem.dto';
import { UpdateItemDto } from './dto/updateItem.dto';
import { ItemEntity } from './entities/item.entity';
import { ItemService } from './item.service';

@Controller('item')
export class ItemController {
  constructor(
    private readonly itemService: ItemService,
    private readonly paypalService: PaypalService,
  ) {}

  @Get()
  async getAll(): Promise<ItemEntity[]> {
    const items = await this.itemService.getAll();
    return items;
  }
  @Get(':id')
  async getById(@Param('id') id: number): Promise<ItemEntity> {
    const item = await this.itemService.getById(id);
    return item;
  }
  @Post()
  async create(@Body() createItemDto: CreateItemDto): Promise<ItemEntity> {
    const item = await this.itemService.create(createItemDto);
    return item;
  }
  @Patch(':id')
  async updateItem(
    @Param('id') id: number,
    @Body() updateItemDto: UpdateItemDto,
  ): Promise<ItemEntity> {
    const item = await this.itemService.update(id, updateItemDto);
    return item;
  }
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.itemService.delete(id);
  }
  @Post('/buy/:id')
  async buyItem(@Param('id') id: number) {
    const item = await this.itemService.getById(id);
    return this.paypalService.createOrder(item);
  }
  @Post('/callback')
  async callback(@Body() callbackDto: CallbackDto) {
    return {
      callbackDto,
    };
  }
}
