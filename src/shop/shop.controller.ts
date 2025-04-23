import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ShopService } from './shop.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-shop.dto';
import { BuyItemDto } from './dto/buy-item.dto';
import { Response, Request } from 'express';

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    return this.shopService.create(createItemDto);
  }

  @Get()
  findAll(@Req() req: Request) {
    const userId = "123"
    return this.shopService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shopService.findOne(id);
  }

  @Post(':itemId/buy')
  async buyItem(@Param('itemId') itemId: string, @Body() dto: BuyItemDto) {
    return this.shopService.buyItem(dto.userId, itemId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.shopService.update(id, updateItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shopService.remove(id);
  }
}
