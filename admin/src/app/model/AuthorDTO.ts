import { BookDTO } from "./BookDTO";

export interface AuthorDTO {
    id: number;
    name: string;
    books: BookDTO[];  // Giả sử bạn có model `BookDTO`.
  }
  