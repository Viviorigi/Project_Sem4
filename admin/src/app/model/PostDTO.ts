export class PostDTO {
  id?: number;
  title: string = "";
  description?: string;
  postCategoryId: number = 0;
  content: string = "";
  status?: string;
  image?: File | null; // gửi qua FormData
}
