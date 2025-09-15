import axios from 'axios';
import { CheckoutDetailDTO } from '../../model/CheckoutDetailDTO';

const BASE_URL = process.env.REACT_APP_API_URL + '/api/checkoutdt';

export const CheckoutDetailService = {
  findAll: async (): Promise<CheckoutDetailDTO[]> => {
    try {
      const response = await axios.get<CheckoutDetailDTO[]>(`${BASE_URL}/list`);
      return response.data;
    } catch (error) {
      console.error("Error fetching checkout details", error);
      throw error;
    }
  },

  findById: async (id: number): Promise<CheckoutDetailDTO> => {
    try {
      const response = await axios.get<CheckoutDetailDTO>(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching checkout detail with ID: ${id}`, error);
      throw error;
    }
  },

  add: async (id: number,checkoutDetailDTO: CheckoutDetailDTO): Promise<CheckoutDetailDTO> => {
    try {
      const response = await axios.post<CheckoutDetailDTO>(`${BASE_URL}/add/${id}`, checkoutDetailDTO);
      return response.data;
    } catch (error) {
      console.error("Error adding checkout detail", error);
      throw error;
    }
  },

  update: async (id: number, checkoutDetailDTO: CheckoutDetailDTO): Promise<CheckoutDetailDTO> => {
    try {
      const response = await axios.put<CheckoutDetailDTO>(`${BASE_URL}/update/${id}`, checkoutDetailDTO);
      return response.data;
    } catch (error) {
      console.error(`Error updating checkout detail with ID: ${id}`, error);
      throw error;
    }
  },

  deleteById: async (id: number): Promise<void> => {
    try {
      await axios.delete(`${BASE_URL}/delete/${id}`);
    } catch (error) {
      console.error(`Error deleting checkout detail with ID: ${id}`, error);
      throw error;
    }
  }
};
