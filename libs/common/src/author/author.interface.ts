export interface AuthorUtils {
  isAuthor(id: string, author_id: string): Promise<boolean>;
}
