/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateItemDto } from './dto/createItem.dto';
import { UpdateItemDto } from './dto/updateItem.dto';
import { ItemEntity } from './entities/item.entity';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(ItemEntity)
    private itemRepository: Repository<ItemEntity>,
  ) {}
  async getAll(): Promise<ItemEntity[]> {
    const result = await this.itemRepository.find();
    return result;
  }
  async getById(id: number): Promise<ItemEntity> {
    const result = await this.itemRepository.findOne(id);
    return result;
  }
  async create(createItemDto: CreateItemDto): Promise<ItemEntity> {
    const item = new ItemEntity();
    item.name = createItemDto.name;
    item.description = createItemDto.description;
    item.cost = createItemDto.cost;
    const result = await this.itemRepository.save(item);
    return result;
  }
  async update(id: number, updateItemDto: UpdateItemDto): Promise<ItemEntity> {
    const item = await this.getById(id);
    if (updateItemDto.name != null) item.name = updateItemDto.name;
    if (updateItemDto.description != null)
      item.description = updateItemDto.description;
    if (updateItemDto.cost != null) item.cost = updateItemDto.cost;

    const result = await this.itemRepository.save(item);
    return result;
  }
  async delete(id: number): Promise<void> {
    this.itemRepository.delete(id);
  }
}
