export class CreatePostDto {
    readonly authorId: string;
    readonly title: string;
    readonly content: string;
    readonly tags?: string[];
  }