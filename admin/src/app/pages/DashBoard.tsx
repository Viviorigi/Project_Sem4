import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useFetcher } from 'react-router-dom';
import BookBorrowChart from './BookBorrowChart';


export default function DashBoard() {
  const [bookToday, setBookToday] = useState(0);
  const [feedToday, setFeedToday] = useState(0);
  const [borrowToday, setBorrowToday] = useState(0);
  const [userToday, setUserToday] = useState(0);
  const [bookLoveList, setBookLoveList] = useState([]);
  const [orderList, setOrderList] = useState([]);
  useEffect(() => {
    //----------------số sách mới----------------------------
    // let url_book_today = process.env.REACT_APP_API_URL + `/api/admin/book/today`;
    let url_book_today = process.env.REACT_APP_API_URL + `/book/today`;
    axios.get(url_book_today).then((resp: any) => {
      if (resp.data)
        setBookToday(resp.data);
    }).catch((err: any) => {
    })

    //-------------------số feed back mới -------------------------
    let url_feed_today = process.env.REACT_APP_API_URL + `/feedback/today`;
    axios.get(url_feed_today).then((resp: any) => {
      if (resp.data)
        setFeedToday(resp.data);
    }).catch((err: any) => {
    })

    //-------------------số user mới -------------------------
    let url_user_today = process.env.REACT_APP_API_URL + `/user/today`;
    axios.get(url_user_today).then((resp: any) => {
      if (resp.data)
        setUserToday(resp.data);
    }).catch((err: any) => {
    })

    //-------------------Sách yêu thích -------------------------
    let url_book_love = process.env.REACT_APP_API_URL + `/book/love`;
    axios.get(url_book_love).then((resp: any) => {
      if (resp.data)
        setBookLoveList(resp.data);
    }).catch((err: any) => {
    })

    //-------------------order thích-chi tiết -------------------------
    let url_order_details = process.env.REACT_APP_API_URL + `/order-details/month`;
    axios.get(url_order_details).then((resp: any) => {
      if (resp.data) {
        setOrderList(resp.data);
        // console.log("Sách yêu là");
        // console.log(resp.data);
      }
    }).catch((err: any) => {
    })

  }, [])

  return (
    <>
      <div className='card mx-n4 px-4 mx-lg-n6 px-lg-6 bg-white'>
        <div className="container-fluid" style={{ paddingTop: '20px' }}> {/* Giảm khoảng cách từ lề trên */}
          <div className="content" style={{ paddingTop: '20px' }}> {/* Giảm khoảng cách từ lề trên */}
            <div className="pb-5" style={{ paddingBottom: '20px' }}> {/* Giảm khoảng cách dưới */}
              <div className="row g-4">
                <div className="col-12 col-xxl-12">
                  <div className="mb-8" style={{ marginBottom: '10px' }}> {/* Giảm khoảng cách dưới tiêu đề */}
                    <h2 className="mb-2" style={{ marginBottom: '5px' }}> {/* Giảm khoảng cách dưới tiêu đề h2 */}
                      Tổng quan
                    </h2>
                    <h5 className="text-700 fw-semi-bold" style={{ marginBottom: '5px' }}> {/* Giảm khoảng cách dưới tiêu đề h5 */}
                      Thư viện của bạn
                    </h5>
                  </div>
                  {/* -----------------1 số thống kê */}
                  <div className="row align-items-center g-4">
                    <div className="col-12 col-md" style={{ padding: '0' }}> {/* Xóa padding để làm đầy chiều rộng */}
                      <div className="d-flex align-items-center" style={{ marginBottom: '10px' }}> {/* Giảm khoảng cách dưới các phần tử */}
                        <span className="fa-stack" style={{ minHeight: 46, minWidth: 46 }}>
                          <span className="fa-solid fa-square fa-stack-2x text-success-300" data-fa-transform="down-4 rotate--10 left-4" />
                          <span className="fa-solid fa-circle fa-stack-2x stack-circle text-success-100" data-fa-transform="up-4 right-3 grow-2" />
                          <span className="fa-stack-1x fa-solid fa-star text-success" data-fa-transform="shrink-2 up-8 right-6" />
                        </span>
                        <div className="ms-3">
                          <h4 className="mb-0" style={{ marginBottom: '5px' }}>{bookToday} cuốn</h4>
                          <p className="text-800 fs--1 mb-0" style={{ marginBottom: '0' }}>Số sách mới</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md" style={{ padding: '0' }}>
                      <div className="d-flex align-items-center" style={{ marginBottom: '10px' }}>
                        <span className="fa-stack" style={{ minHeight: 46, minWidth: 46 }}>
                          <span className="fa-solid fa-square fa-stack-2x text-warning-300" data-fa-transform="down-4 rotate--10 left-4" />
                          <span className="fa-solid fa-circle fa-stack-2x stack-circle text-warning-100" data-fa-transform="up-4 right-3 grow-2" />
                          <span className="fa-stack-1x fa-solid fa-pause text-warning" data-fa-transform="shrink-2 up-8 right-6" />
                        </span>
                        <div className="ms-3">
                          <h4 className="mb-0" style={{ marginBottom: '5px' }}>{feedToday} feedback</h4>
                          <p className="text-800 fs--1 mb-0" style={{ marginBottom: '0' }}>Feedback hôm nay</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md" style={{ padding: '0' }}>
                      <div className="d-flex align-items-center" style={{ marginBottom: '10px' }}>
                        <span className="fa-stack" style={{ minHeight: 46, minWidth: 46 }}>
                          <span className="fa-solid fa-square fa-stack-2x text-danger-300" data-fa-transform="down-4 rotate--10 left-4" />
                          <span className="fa-solid fa-circle fa-stack-2x stack-circle text-danger-100" data-fa-transform="up-4 right-3 grow-2" />
                          <span className="fa-stack-1x fa-solid fa-xmark text-danger" data-fa-transform="shrink-2 up-8 right-6" />
                        </span>
                        <div className="ms-3">
                          <h4 className="mb-0" style={{ marginBottom: '5px' }}>{userToday} tài khoản</h4>
                          <p className="text-800 fs--1 mb-0" style={{ marginBottom: '0' }}>Số người dùng mới</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Thêm đồ thị vào đây */}
                  <div className="container-fluid mt-4">
                    <BookBorrowChart data={orderList} />
                  </div>
                  {/* ------------------------------------------------------------------ */}

                  <hr className="bg-200 mb-6 mt-4" style={{ marginTop: '10px' }} />
                  <div className="row flex-between-center mb-4 g-3">
                    <div className="col-auto">
                      <h3>Sách được yêu thích nhiều</h3>
                      <p className="text-700 lh-sm mb-0">Một số cuốn sách được yêu thích</p>
                    </div>

                    {/* ----------------------Đổ dữ liệu sách yêu thích --------------------------------- */}
                    <div className="col-12">
                      <table className="table" style={{ marginBottom: '0' }}> {/* Xóa khoảng cách dưới bảng */}
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Tên sách</th>
                            <th scope="col">Tác giả</th>
                            <th scope="col">Nhà xuất bản</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookLoveList.map((book: any, index: any) => (
                            <tr key={book.id}>
                              <th scope="row">{index + 1}</th>
                              <td>{book.title}</td>
                              <td>{book.publisher}</td>
                              <td>{book.nxb}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* ----------------------Đổ dữ liệu sách yêu thích --------------------------------- */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      <footer className="footer position-absolute">
        <div className="row g-0 justify-content-between align-items-center h-100">
          <div className="col-12 col-sm-auto text-center">
            <p className="mb-0 mt-2 mt-sm-0 text-900">ATWOM BOOk<span className="d-none d-sm-inline-block" /><span className="d-none d-sm-inline-block mx-1">|</span><br className="d-sm-none" />2024 ©</p>
          </div>
          <div className="col-12 col-sm-auto text-center">
            <p className="mb-0 text-600">v1.1.0</p>
          </div>
        </div>
      </footer>
    </>
  );
}
