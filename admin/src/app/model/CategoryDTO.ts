import { BookDTO } from "./BookDTO";

export class CategoryDTO {
  id?: number;
  name?: string;
  description?: string;
  createdDate?: string;
  updatedDate?: string;
  active?: boolean;
  books?: BookDTO[];
}
