import { Comment } from "../comments/schemas/comment.schema";

export function toPlainComment(c: any): Comment & { postId: string | null; pId?: string | null } {
    return {
        ...c,
        postId: c.postId?.toString() ?? null,
        pId: c.pId?.toString() ?? null,
    };
}

export type PlainComment = Comment & {
    postId: string | null;
    pId?: string | null;
};