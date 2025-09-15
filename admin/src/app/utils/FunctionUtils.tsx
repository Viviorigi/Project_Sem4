import React from 'react'
import { format } from 'date-fns';

export const formatCurrency = (amount: any, currency = 'VND') => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,  // Đồng VND không cần phần thập phân
    }).format(amount);
};

export const formatDate = (date: any) => {
    return format(new Date(date), 'dd/MM/yyyy, hh:mm');
  };

export default function FunctionUtils() {
    return (
        <div>FunctionUtils</div>
    )
}
