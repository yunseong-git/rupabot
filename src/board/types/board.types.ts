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