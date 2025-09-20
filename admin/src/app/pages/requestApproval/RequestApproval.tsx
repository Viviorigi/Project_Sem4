import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Dialog } from 'primereact/dialog';
import { toast } from 'react-toastify';
import Pagination from '../../comp/common/Pagination';
import { useAppDispatch } from '../../store/hook';
import { setLoading } from '../../reducers/spinnerSlice';
import { HeadersUtil } from '../../utils/Headers.Util';
import { format } from 'date-fns';

// ==== Types (đã chuẩn hoá cho UI) ====
type ReqSearch = {
  pageNumber: number;
  pageSize: number;
  keyword: string;
  status: string;
  sortBy: string;
  sortDir: 'asc' | 'desc' | '';
  startDate: string;
  endDate: string;
  timer: number;
};

type RequestRow = {
  id: number;                 // requestId
  commentId: number;
  commentContent: string;
  createdAt: string;          // comment.createdAt
  postName: string;           // comment.post.title
  status: string;             // request status (PENDING/…)
  requestedAt?: string;
  userName?: string;
  userEmail?: string;
  avatar?: string | null;
};

type RequestDetail = RequestRow;

// ==== Helpers ====
const safe = (s?: string | null) => s ?? '';

export default function RequestComments() {
  const dispatch = useAppDispatch();

  const PAGE_SIZE = 10;

  const [search, setSearch] = useState<ReqSearch>({
    pageNumber: 1,
    pageSize: PAGE_SIZE,
    keyword: '',
    status: '',
    sortBy: '',
    sortDir: '',
    startDate: '',
    endDate: '',
    timer: Date.now(),
  });

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [list, setList] = useState<RequestRow[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [openView, setOpenView] = useState(false);
  const detailRef = useRef<RequestDetail | null>(null);

  // === Fetch list + normalize ===
  useEffect(() => {
    
    const fetchData = async () => {
      try {
    
        const url = `${process.env.REACT_APP_API_URL}/api/RequestApproval/search`;
        const body = {
          pageNumber: search.pageNumber,
          pageSize: search.pageSize,
          keyword: search.keyword,
          status: search.status,
          sortBy: search.sortBy,
          sortDir: search.sortDir,
          startDate: search.startDate,
          endDate: search.endDate,
        };
        const resp = await axios.post(url, body, {
          headers: { ...HeadersUtil.getHeadersAuth?.() },
        });

    

        const raw = resp.data ?? {};
        const items: RequestRow[] = (raw.data ?? []).map((it: any) => {
          const c = it.comment ?? {};
          const p = c.post ?? {};
          const acc = c.account ?? {};
          return {
            id: it.id,
            commentId: it.commentId,
            commentContent: c.content ?? '',
            createdAt: c.createdAt ?? it.createdAt ?? '',
            postName: p.title ?? '',
            status: it.status ?? '',
            requestedAt: it.requestedAt ?? '',
            userName: acc.userName ?? '',
            userEmail: acc.email ?? '',
            avatar: acc.avatar ?? null,
          };
        });

        setList(items);
        const total = raw.totalRecords ?? items.length ?? 0;
        setTotalItems(total);
        setTotalPages(Math.max(1, Math.ceil(total / (raw.pageSize ?? search.pageSize))));
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Không tải được danh sách yêu cầu.');
      } finally {
        
      }
    };

    fetchData();
  }, [search.pageNumber, search.timer, search.pageSize, search.keyword, search.status, search.sortBy, search.sortDir, search.startDate, search.endDate, dispatch]);

  // === Actions ===
  const doSearch = () =>
    setSearch(prev => ({
      ...prev,
      pageNumber: 1,
      startDate,
      endDate,
      timer: Date.now(),
    }));

  const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') doSearch();
  };

  const handlePageClick = (p: number) => setSearch(prev => ({ ...prev, pageNumber: p }));
  const prev = () => setSearch(prev => ({ ...prev, pageNumber: Math.max(1, prev.pageNumber - 1) }));
  const next = () => setSearch(prev => ({ ...prev, pageNumber: Math.min(totalPages, prev.pageNumber + 1) }));

  const viewDetail = async (id: number) => {
    // Nếu BE có endpoint detail riêng thì call; còn không có thể lấy từ list:
    const found = list.find(x => x.id === id);
    if (found) {
      detailRef.current = found;
      setOpenView(true);
      return;
    }
    try {
      dispatch(setLoading(true));
      const url = `${process.env.REACT_APP_API_URL}/api/RequestApproval/${id}`;
      const resp = await axios.get(url, { headers: { ...HeadersUtil.getHeadersAuth?.() } });
      const it = resp.data ?? {};
      const c = it.comment ?? {};
      const p = c.post ?? {};
      const acc = c.account ?? {};
      detailRef.current = {
        id: it.id,
        commentId: it.commentId,
        commentContent: c.content ?? '',
        createdAt: c.createdAt ?? it.createdAt ?? '',
        postName: p.title ?? '',
        status: it.status ?? '',
        requestedAt: it.requestedAt ?? '',
        userName: acc.userName ?? '',
        userEmail: acc.email ?? '',
        avatar: acc.avatar ?? null,
      };
      setOpenView(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Không xem được chi tiết.');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const approve = (id: number) => {
    Swal.fire({
      title: 'Xác nhận',
      text: 'Duyệt comment này?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Approve',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#4caf50',
    }).then(async r => {
      if (!r.value) return;
      try {
        dispatch(setLoading(true));
        const url = `${process.env.REACT_APP_API_URL}/api/RequestApproval/approve/${id}`;
        await axios.get(url, { headers: { ...HeadersUtil.getHeadersAuth?.() } });
        toast.success('Đã approve.');
        setSearch(prev => ({ ...prev, timer: Date.now() })); // reload
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Approve thất bại.');
      } finally {
        dispatch(setLoading(false));
      }
    });
  };

  const reject = (id: number) => {
    Swal.fire({
      title: 'Xác nhận',
      text: 'Từ chối comment này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Reject',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#e53935',
    }).then(async r => {
      if (!r.value) return;
      try {
        dispatch(setLoading(true));
        const url = `${process.env.REACT_APP_API_URL}/api/RequestApproval/reject/${id}`;
        await axios.get(url, { headers: { ...HeadersUtil.getHeadersAuth?.() } });
        toast.success('Đã reject.');
        setSearch(prev => ({ ...prev, timer: Date.now() })); // reload
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Reject thất bại.');
      } finally {
        dispatch(setLoading(false));
      }
    });
  };

  // === Render ===
  return (
    <div>
      <div className="mb-9">
        <div className="card mx-n4 px-4 mx-lg-n6 px-lg-6 bg-white">
          <div className="row g-2 mb-4">
            <div className="col-auto">
              <h2 className="mt-4">Danh sách Xử lý Bình luận</h2>
            </div>
          </div>

          {/* Filters */}
          <div className="row g-3 align-items-end">
            <div className="col-md-3">
              <label className="form-label">Ngày bắt đầu</label>
              <input
                type="text"
                placeholder="dd/mm/yyyy"
                className="form-control"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                onKeyUp={onEnter}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Ngày kết thúc</label>
              <input
                type="text"
                placeholder="dd/mm/yyyy"
                className="form-control"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                onKeyUp={onEnter}
              />
            </div>
            <div className="col-md-2">
              <button className="btn btn-primary mt-4" onClick={doSearch}>Search</button>
            </div>
          </div>

          {/* Table */}
          <div className="border-bottom border-200 position-relative top-1">
            <div className="table-responsive scrollbar-overlay mx-n1 px-1">
              <table className="table table-bordered fs--1 mb-2 mt-5">
                <thead>
                  <tr>
                    <th className="align-middle text-center" style={{ width: '6%' }}>#</th>
                    <th className="align-middle text-center" style={{ width: '32%' }}>Nội dụng bình luận</th>
                    <th className="align-middle text-center" style={{ width: '18%' }}>Ngày tạo</th>
                    <th className="align-middle text-center" style={{ width: '34%' }}>Người tạo</th>
                    <th className="align-middle text-center" style={{ width: '10%' }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((r, idx) => (
                    <tr key={r.id}>
                      <td className="align-middle text-center">
                        {(search.pageNumber - 1) * PAGE_SIZE + idx + 1}
                      </td>
                      <td className="align-middle">{safe(r.commentContent)}</td>
                      <td className="align-middle text-center">
                        {r.createdAt ? format(new Date(r.createdAt), 'dd-MM-yyyy HH:mm:ss') : 'N/A'}
                      </td>
                      <td className="align-middle">{safe(r.postName)}</td>
                      <td className="align-middle text-center">
                        <div className="btn-group" role="group" aria-label="Actions">
                          <button className="btn btn-phoenix-secondary me-1 mb-1" title="View" onClick={() => viewDetail(r.id)}>
                            <i className="far fa-eye" />
                          </button>
                          <button className="btn btn-phoenix-primary me-1 mb-1" title="Approve" onClick={() => approve(r.id)}>
                            <i className="fa-solid fa-check" />
                          </button>
                          <button className="btn btn-phoenix-danger me-1 mb-1" title="Reject" onClick={() => reject(r.id)}>
                            <i className="fa-solid fa-ban" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {list.length === 0 && (
                    <tr>
                      <td className="text-center text-700 py-4" colSpan={5}>Không có dữ liệu</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer + Pagination */}
            <div className="row align-items-center justify-content-between py-2 pe-0 fs--1">
              <div className="col-auto d-flex">
                <p className="mb-0 d-none d-sm-block me-3 fw-semi-bold text-900">
                  <span className="fw-bold">Tổng số yêu cầu: </span>{totalItems}
                </p>
              </div>
              <div className="col-auto d-flex">
                <Pagination
                  totalPage={totalPages}
                  currentPage={search.pageNumber}
                  handlePageClick={handlePageClick}
                  prev={prev}
                  next={next}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View dialog */}
      <Dialog
        visible={openView}
        onHide={() => setOpenView(false)}
        style={{ width: 800 }}
        baseZIndex={12000}
        modal
        appendTo={document.body}
      >
        {detailRef.current ? (
          <div>
            <h4 className="mb-3">Chi tiết Request Comment</h4>
            <div className="mb-2"><b>Comment:</b> {safe(detailRef.current.commentContent)}</div>
            <div className="mb-2">
              <b>Created at:</b>{' '}
              {detailRef.current.createdAt
                ? format(new Date(detailRef.current.createdAt), 'dd-MM-yyyy HH:mm:ss')
                : 'N/A'}
            </div>
            <div className="mb-2"><b>Post name:</b> {safe(detailRef.current.postName)}</div>
            <div className="mb-2"><b>Status:</b> {safe(detailRef.current.status)}</div>
          </div>
        ) : (
          <div className="p-3">Không có dữ liệu.</div>
        )}
      </Dialog>
            <footer className="footer position-absolute">
        <div className="row g-0 justify-content-between align-items-center h-100">
          <div className="col-12 col-sm-auto text-center">
            <p className="mb-0 mt-2 mt-sm-0 text-900">
              Admin<span className="d-none d-sm-inline-block" />
              <span className="d-none d-sm-inline-block mx-1">|</span>
              <br className="d-sm-none" />2025 ©
            </p>
          </div>
          <div className="col-12 col-sm-auto text-center">
            <p className="mb-0 text-600">v1.1.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
