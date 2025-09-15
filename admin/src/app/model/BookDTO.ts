import { CategoryDTO } from './CategoryDTO';
import { AuthorDTO } from './AuthorDTO';

export class BookDTO {
  id?: number;
  title?: string;
  publisher?:string;
  publicationYear?: number;
  description?:string;
  price?: number;
  nxb?:string;
  image?: string; 
  quantity?: number;
  active?:boolean;
  cateId?:number;
  cateName?:string;
  createdDate?: string;
  updatedDate?: string; 
}
