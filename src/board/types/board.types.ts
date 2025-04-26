import { PostDocument } from "../posts/schemas/post.schema";
import { CommentDocument } from "../comments/schemas/comment.schema";

export type PostPreview = {
    _id: string;
    title: string;
    authorId: string;
    createdAt: Date;
  };

  export type CommentResponse = {
    _id: string;
    content: string;
    authorId: string;
    createdAt: Date;
  };

  export type PostSortType = 'latest' | 'like';

  export interface PostWithCommentsResponse {
    post: PostDocument;
    comments: CommentDocument[];
  }