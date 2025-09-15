import axios from 'axios';
import { CheckoutDTO } from '../../model/CheckoutDTO';
import { CheckoutStatus } from '../../model/CheckoutStatus';
import { CheckoutBookDTO } from '../../model/CheckoutBookDTO';

const BASE_URL = process.env.REACT_APP_API_URL + '/api/checkout';

export const CheckoutService = {
  findAll: async (params?: { keySearch?: string; status: CheckoutStatus; limit?: number; page?: number; }) => {
    try {
      const response = await axios.get(`${BASE_URL}/lists`, { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching checkouts", error);
      throw error;
    }
  },

  findNeedReturn: async (params?: { keySearch?: string; limit?: number; page?: number; }): Promise<CheckoutDTO[]> => {
    try {
      const response = await axios.get<CheckoutDTO[]>(`${BASE_URL}/checkout/getReturn`, { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching checkouts", error);
      throw error;
    }
  },

  findById: async (id: number): Promise<CheckoutDTO> => {
    try {
      const response = await axios.get<CheckoutDTO>(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching checkout with ID: ${id}`, error);
      throw error;
    }
  },

  save: async (checkoutDTO: CheckoutBookDTO): Promise<CheckoutBookDTO> => {
    try {
      const response = await axios.post<CheckoutBookDTO>(`${BASE_URL}/add`, checkoutDTO);
      return response.data;
    } catch (error) {
      console.error("Error saving checkout", error);
      throw error;
    }
  },

  update: async (id: number, checkoutDTO: CheckoutDTO): Promise<CheckoutDTO> => {
    try {
      const response = await axios.put<CheckoutDTO>(`${BASE_URL}/${id}/update`, checkoutDTO);
      return response.data;
    } catch (error) {
      console.error(`Error updating checkout with ID: ${id}`, error);
      throw error;
    }
  },

  approveCheckout: async (id: number): Promise<CheckoutDTO> => {
    try {
      const response = await axios.put<CheckoutDTO>(`${BASE_URL}/approve/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error approving checkout with ID: ${id}`, error);
      throw error;
    }
  },

  rejectCheckout: async (id: number): Promise<CheckoutDTO> => {
    try {
      const response = await axios.put<CheckoutDTO>(`${BASE_URL}/reject/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error rejecting checkout with ID: ${id}`, error);
      throw error;
    }
  },

  borrowCheckout: async (id: number): Promise<CheckoutDTO> => {
    try {
      const response = await axios.put<CheckoutDTO>(`${BASE_URL}/borrow/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error borrowing checkout with ID: ${id}`, error);
      throw error;
    }
  },

  expiredCheckout: async (id: number): Promise<CheckoutDTO> => {
    try {
      const response = await axios.put<CheckoutDTO>(`${BASE_URL}/expired/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error marking checkout as expired with ID: ${id}`, error);
      throw error;
    }
  },

  returnedCheckout: async (id: number): Promise<CheckoutDTO> => {
    try {
      const response = await axios.put<CheckoutDTO>(`${BASE_URL}/return/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error marking checkout as returned with ID: ${id}`, error);
      throw error;
    }
  },

  penaltyCheckout: async (id: number): Promise<CheckoutDTO> => {
    try {
      const response = await axios.put<CheckoutDTO>(`${BASE_URL}/${id}/penalty`);
      return response.data;
    } catch (error) {
      console.error(`Error marking checkout as penalty with ID: ${id}`, error);
      throw error;
    }
  },

  deleteById: async (id: number): Promise<void> => {
    try {
      await axios.delete(`${BASE_URL}/delete/${id}`);
    } catch (error) {
      console.error(`Error deleting checkout with ID: ${id}`, error);
      throw error;
    }
  },

  checkExpiredCheckouts: async (): Promise<void> => {
    console.log('Checking expired checkouts (this should run on the server side).');
  },
};
