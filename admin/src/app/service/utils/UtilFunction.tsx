import { format, parseISO } from "date-fns";

function formatDate(dateString: string): string {
    try {
        const date = parseISO(dateString); // Chuyển đổi chuỗi ISO thành đối tượng Date
        return format(date, 'dd/MM/yyyy'); // Định dạng ngày tháng
    } catch (error) {
        console.error('Invalid date string:', error);
        return ''; // Trả về chuỗi rỗng nếu có lỗi
    }
}