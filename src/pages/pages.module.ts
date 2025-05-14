import { Module } from '@nestjs/common';
import { AuthPagesController } from './authPages.controller';
import { BoardPagesController } from './boardPages.controller';

@Module({
  controllers: [
    AuthPagesController,
    BoardPagesController,
  ]
})
export class PagesModule { }
