import React, { useEffect, useRef, useState } from 'react'
import { FeedSearch } from './feed-search'
import Swal from 'sweetalert2';
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { toast, ToastContainer } from 'react-toastify';
import Pagination from '../../comp/common/Pagination';
import { format } from 'date-fns';
import { formatCurrency, formatDate } from "../../utils/FunctionUtils";
import defaultPersonImage from "../../../assets/images/imagePerson.png"
import noImageAvailable from "../../../assets/images/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg"
import { useAppDispatch } from '../../store/hook';
import { setLoading } from '../../reducers/spinnerSlice';

export default function Book() {

    const [searchDto, setSearchDto] = useState(new FeedSearch('', 1, 0, new Date().getTime()))
    const [feedBackList, setFeedBackList] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const dispatch = useAppDispatch();

    //phân trang
    const handlePageClick = (pageNumber: any) => {
        setSearchDto(() => ({
            ...searchDto,
            page: pageNumber,
        }));
    };

    const prev = () => {
        if (searchDto.page > 1) {
            setSearchDto(() => ({
                ...searchDto,
                page: searchDto.page - 1,
            }));
        }
    };
    const next = () => {
        if (searchDto.page < totalPages) {
            setSearchDto(() => ({
                ...searchDto,
                page: searchDto.page + 1,
            }));
        }
    };

    // xử lý khi chữ thay đổi
    const handleChangeText = (event: any) => {
        setSearchDto({
            ...searchDto,
            [event.target.name]: event.target.value
        });
    }

    //
    const handleKeyUpSearch = (e: any) => {
        if (e.key === "Enter") {
            setSearchDto({
                ...searchDto,
                timer: new Date().getTime(),
            });
        }
    };


    //delete
    //xóa
    const delBook = (id: number) => {
        Swal.fire({
            title: `Xác nhận`,
            text: `Bạn có muốn xóa feed back này`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#89B449',
            cancelButtonColor: '#E68A8C',
            confirmButtonText: `Yes`,
            cancelButtonText: `No`
        }).then((result) => {
            if (result.value) {
                dispatch(setLoading(true));
                let url = `${process.env.REACT_APP_API_URL}/feedback/delete?id=${id}`;
                axios.delete(url).then((resp: any) => {
                    dispatch(setLoading(false));
                    toast.success("Đã xóa");
                    setSearchDto({
                        ...searchDto,
                        timer: new Date().getTime()
                    })
                }).catch((err: any) => {
                    dispatch(setLoading(false));
                    // console.log(err);
                    toast.error("Xóa thất bại");
                })
            }
        })
    }

    //Lây du lieu
    useEffect(() => {
        let url = `${process.env.REACT_APP_API_URL}/feedback/list-page?page=${searchDto.page}`;
        axios.get(url).then((resp: any) => {
            if (resp.data) {
                setFeedBackList(resp.data.content);
                setTotalPages(resp.data.totalPages);
                setTotalItems(resp.data.totalElements);
            }
        }).catch((err: any) => {

        })
    }, [searchDto.page, searchDto.timer])

    return (
        <div>
            <div className="mb-9">
                <div className='card mx-n4 px-4 mx-lg-n6 px-lg-6 bg-white'>
                    <div className="row g-2 mb-4">
                        <div className="col-auto">
                            {/* title */}
                            <h2 className="mt-4">Danh sách feedback</h2>
                        </div>
                    </div>
                    <div id="products" data-list="{&quot;valueNames&quot;:[&quot;customer&quot;,&quot;email&quot;,&quot;total-orders&quot;,&quot;total-spent&quot;,&quot;city&quot;,&quot;last-seen&quot;,&quot;last-order&quot;],&quot;page&quot;:10,&quot;pagination&quot;:true}">
                        <div className=" border-bottom border-200 position-relative top-1">

                            {/* table------------------------------------------------------------------- */}
                            <div className="table-responsive scrollbar-overlay mx-n1 px-1">
                                <table className="table table-bordered fs--1 mb-2 mt-5">
                                    <thead>
                                        <tr>
                                            <th className="sort align-middle text-center" scope="col" style={{ width: '5%' }}>#</th>
                                            <th className="sort align-middle text-center" scope="col" style={{ width: '20%' }}>TÊN USER</th>
                                            <th className="sort align-middle text-center" scope="col" style={{ width: '25%' }}>TÊN SÁCH</th>
                                            <th className="sort align-middle text-center" scope="col" style={{ width: '10%' }}>RATING</th>
                                            <th className="sort align-middle text-center" scope="col" style={{ width: '25%' }}>COMMENT</th>
                                            <th className="sort align-middle text-center" scope="col" style={{ width: '10%' }}>NGÀY ĐÁNH GIÁ</th>
                                            <th className="sort align-middle text-center" scope="col" style={{ width: '5%' }}>HÀNH ĐỘNG</th>
                                        </tr>
                                    </thead>
                                    <tbody className="list" id="customers-table-body">
                                        {feedBackList.map((u: any, index: number) => (
                                            <tr className="hover-actions-trigger btn-reveal-trigger position-static" key={u.id}>
                                                <td className='align-middle text-center text-700'>{index + 1}</td>
                                                <td className="align-middle text-center">
                                                    <div className="d-flex align-items-center">
                                                        <div className="avatar avatar-m">
                                                            <img
                                                                className="rounded-circle"
                                                                src={u.image ? `${process.env.REACT_APP_API_URL}/getImage?atchFleSeqNm=${u.user_avatar}` : defaultPersonImage}
                                                                alt="PersonAvatar"
                                                                onError={(e) => {
                                                                    const target = e.target as HTMLImageElement;
                                                                    target.onerror = null;
                                                                    target.src = noImageAvailable;
                                                                }}
                                                            />
                                                        </div>
                                                        <p className="mb-0 ms-3 text-1100 fw-bold">{u.user_name}</p>
                                                    </div>
                                                </td>
                                                <td className="align-middle text-start">{u.bookName}</td>
                                                <td className="align-middle text-start text-1000">{u.rating}</td>
                                                <td className="align-middle text-start text-1100">{u.comment}</td>
                                                <td className="align-middle text-start text-700">{formatDate(u.upd_dt)}</td>
                                                <td className="align-middle text-start">
                                                    <button className="btn btn-phoenix-danger me-1 mb-1" type="button" onClick={() => delBook(u.id)}>
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* table------------------------------------------------------------------- */}

                            <div className="row align-items-center justify-content-between py-2 pe-0 fs--1">
                                <div className="col-auto d-flex">
                                    <p className="mb-0 d-none d-sm-block me-3 fw-semi-bold text-900" data-list-info="data-list-info"><span className='fw-bold'>Tổng số feedback: </span> {totalItems} </p>
                                </div>
                                <div className="col-auto d-flex">
                                    <Pagination totalPage={totalPages} currentPage={searchDto.page} handlePageClick={handlePageClick} prev={prev} next={next} />
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
        </div>
    )
}
