import axios from 'axios';
import { BookDTO } from '../../model/BookDTO';

const BASE_URL = '/api/book';

export const BookService = {
  findAllActive: async (): Promise<BookDTO[]> => {
    const response = await axios.get<BookDTO[]>(`${BASE_URL}/list`);
    return response.data;
  },

  findById: async (id: number): Promise<BookDTO> => {
    const response = await axios.get<BookDTO>(`${BASE_URL}/${id}`);
    return response.data;
  },

  save: async (bookDTO: BookDTO): Promise<BookDTO> => {
    const response = await axios.post<BookDTO>(`${BASE_URL}/add`, bookDTO);
    return response.data;
  },

  edit: async (bookDTO: BookDTO): Promise<BookDTO> => {
    const response = await axios.post<BookDTO>(`${BASE_URL}/edit`, bookDTO);
    return response.data;
  },

  hide: async (id: number): Promise<void> => {
    await axios.post(`${BASE_URL}/hidden`, { id });
  },

  activate: async (id: number): Promise<void> => {
    await axios.post(`${BASE_URL}/active`, { id });
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/delete`, { params: { id } });
  }
};
