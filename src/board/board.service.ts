import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/post/create-post.dto';
import { UpdatePostDto } from './dto/post/update-post.dto';
import { CreateCommentDto } from './dto/comment/create-comment.dto';
import { UpdateCommentDto } from './dto/comment/update-comment.dto';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { Comment, CommentDocument } from './schemas/comment.schema';

@Injectable()
export class BoardService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    @InjectModel(Comment.name) private readonly commentModel: Model<CommentDocument>,
  ) { }

  async createPost(dto: CreatePostDto) {
    const post = new this.postModel(dto);
    return post.save();
  }

  async createComment(postId: string, dto: CreateCommentDto) {
    const comment = new this.commentModel({ ...dto, postId });
    const saved = await comment.save();

    await this.postModel.findByIdAndUpdate(postId, {
      $push: { comments: saved._id }
    });

    return saved;
  }

  async findAllPost() {
    return this.postModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    return this.postModel.findById(id).populate('comments').exec();
  }

  async updatePost(id: string, dto: UpdatePostDto) {
    return this.postModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async updateComment(id: string, dto: UpdateCommentDto) {
    return this.commentModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async remove(id: string) {
    return this.postModel.findByIdAndDelete(id);
  }
}
