// src/components/BookBorrowChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Đăng ký các thành phần của Chart.js mà bạn sẽ sử dụng
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const BookBorrowChart = ({ data }) => {
  // Kiểm tra dữ liệu nhận được
  console.log('Dữ liệu nhận được từ props:', data);

  // Tạo các labels và data từ props
  const labels = data.map(item => item[1]); // Tên sách
  const datasetData = data.map(item => item[3]); // Số lượt mượn

  // In ra labels và data
  console.log('Labels:', labels);
  console.log('Dataset Data:', datasetData);

  // Định dạng dữ liệu cho đồ thị
  const chartData = {
    labels: labels, // Tên sách
    datasets: [
      {
        label: 'Số lượt mượn',
        data: datasetData, // Số lượt mượn
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }
    ]
  };

  // Tùy chọn đồ thị
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `Tên sách: ${tooltipItem.label}, Số lượt mượn: ${tooltipItem.raw}`;
          }
        }
      },
      title: {
        display: true,
        text: 'Sách được mượn nhiều trong 30 ngày qua', // Tiêu đề của đồ thị
        font: {
          size: 18, // Kích thước font tiêu đề
          weight: 'bold' // Độ dày font tiêu đề
        },
        color: '#333', // Màu font tiêu đề
        padding: {
          top: 10,
          bottom: 20
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Tên sách',
          font: {
            size: 14, // Kích thước font trục x
            weight: 'bold' // Độ dày font trục x
          },
          color: '#555' // Màu font trục x
        }
      },
      y: {
        title: {
          display: true,
          text: 'Số lượt mượn',
          font: {
            size: 14, // Kích thước font trục y
            weight: 'bold' // Độ dày font trục y
          },
          color: '#555' // Màu font trục y
        },
        beginAtZero: true
      }
    }
  };

  // CSS trong JS
  const chartContainerStyle = {
    width: '100%',        // Đảm bảo rằng đồ thị chiếm toàn bộ chiều rộng của vùng chứa
    maxWidth: '800px',    // Giới hạn chiều rộng tối đa của đồ thị
    margin: '0 auto',     // Căn giữa đồ thị
    padding: '20px',      // Thêm padding nếu cần
    backgroundColor: '#f9f9f9', // Thay đổi màu nền của vùng chứa
    borderRadius: '8px',  // Thêm bo tròn góc nếu muốn
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)' // Thêm hiệu ứng bóng đổ cho vùng chứa
  };

  return (
    <div style={chartContainerStyle}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BookBorrowChart;
