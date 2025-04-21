import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreatePostDto } from './dto/post/create-post.dto';
import { UpdatePostDto } from './dto/post/update-post.dto';
import { CreateCommentDto } from './dto/comment/create-comment.dto';
import { UpdateCommentDto } from './dto/comment/update-comment.dto';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) { }

  @Post()
  createPost(@Body() dto: CreatePostDto) {
    return this.boardService.createPost(dto);
  }

  @Post(':id/comments')
  createComment(@Param('id') postId: string, @Body() dto: CreateCommentDto) {
    return this.boardService.createComment(postId, dto);
  }

  @Get()
  findAllPost() {
    return this.boardService.findAllPost();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boardService.findOne(id);
  }

  @Patch(':id')
  updatePost(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    return this.boardService.updatePost(id, dto);
  }

  @Patch(':id/comments')
  updateComment(@Param('id') id: string, @Body() dto: UpdateCommentDto) {
    return this.boardService.updateComment(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardService.remove(id);
  }
}