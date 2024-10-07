export class Blog {
  author_id: string;
  title: string;
  thumbnail: string;
  content: string;
  tags: string[];
}

export class CreateBlog {
  title: string;
  thumbnail: string;
  content: string;
  tags: string[];
}

export class UpdateBlog {
  id: number;
  title: string;
  thumbnail: string;
  content: string;
  tags: string[];
}
