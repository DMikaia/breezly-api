export class UpdateComment {
  id: number;
  blog_id: number;
  content: string;
  user_id: string;
}

export class Comment {
  blog_id: number;
  content: string;
  user_id: string;
}

export class CommentDto {
  id: number;
  blog_id: number;
  user_id: string;
  content: string;
  created_at: Date;
  updated_at: Date;
}
