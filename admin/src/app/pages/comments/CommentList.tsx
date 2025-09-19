import React, { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { useAppDispatch } from "../../store/hook";
import { setLoading } from "../../reducers/spinnerSlice";
import Pagination from "../../comp/common/Pagination";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Dialog } from "primereact/dialog";
import { CommentService } from "../../services/comment/CommentService";
import defaultPersonImage from "../../../assets/images/imagePerson.png";

type CommentItem = {
  id: number;
  postName: string;
  username: string;
  content?: string;
  createdAt: string | Date;
  raw?: any;
};

type SearchParams = {
  page: number;            // 1-based
  limit: number;
  startDate?: string;      // "dd/MM/yyyy"
  endDate?: string;        // "dd/MM/yyyy"
  timer: number;           // trigger reload
};

// ---- Date helpers: dd/MM/yyyy -> ISO ----
const isValidDDMMYYYY = (v?: string) => {
  if (!v) return true;
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v);
  if (!m) return false;
  const [_, dd, mm, yyyy] = m;
  const d = new Date(`${yyyy}-${mm}-${dd}T00:00:00`);
  return d.getFullYear() === +yyyy && d.getMonth() + 1 === +mm && d.getDate() === +dd;
};


const formatDate = (d: any) => format(new Date(d), "dd/MM/yyyy");

export default function CommentList() {
  const [listComments, setListComments] = useState<CommentItem[]>([]);
  const [totalComments, setTotalComments] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  const [openDetail, setOpenDetail] = useState(false);
  const commentRef = useRef<CommentItem | null>(null);

  const [params, setParams] = useState<SearchParams>({
    page: 1,
    limit: 10,
    timer: Date.now(),
  });

  const dispatch = useAppDispatch();
  const indexOfLastItem = params.page * params.limit;
  const indexOfFirstItem = indexOfLastItem - params.limit;

  // Điều khiển phân trang
  const prev = () => params.page > 1 && setParams({ ...params, page: params.page - 1 });
  const next = () => params.page < totalPage && setParams({ ...params, page: params.page + 1 });
  const handlePageClick = (p: number) => setParams({ ...params, page: p });

  // Áp filter và xóa filter
  const applyFilter = () => {
    if (!isValidDDMMYYYY(params.startDate) || !isValidDDMMYYYY(params.endDate)) {
      toast.error("Ngày không đúng định dạng dd/MM/yyyy");
      return;
    }
    setParams((p) => ({ ...p, page: 1, timer: Date.now() }));
  };

  const clearFilter = () =>
    setParams((p) => ({ ...p, startDate: undefined, endDate: undefined, page: 1, timer: Date.now() }));

  // Xem chi tiết
  const openInfo = (c: CommentItem) => {
    commentRef.current = c;
    setOpenDetail(true);
  };

  // Xóa
  const remove = (id: number) => {
    Swal.fire({
      title: "Xác nhận",
      text: "Xóa bình luận này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#89B449",
      cancelButtonColor: "#E68A8C",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((rs) => {
      if (rs.value) {
        dispatch(setLoading(true));
        CommentService.getInstance()
          .delete(id)
          .then((resp: any) => {
            dispatch(setLoading(false));
            toast.success(resp?.data?.message || "Đã xóa");
            setParams((p) => ({ ...p, timer: Date.now() }));
          })
          .catch((err: any) => {
            dispatch(setLoading(false));
            toast.error(err?.response?.data?.message || err.message);
          });
      }
    });
  };

  // Load data
  useEffect(() => {
    const body = {
      pageNumber: params.page,             
      pageSize: params.limit,
      sortBy: "",
      sortDir: "",
      // Không có keyword — chỉ ngày
      startDate: params.startDate,
      endDate: params.endDate,
    };

    CommentService.getInstance()
      .search(body) // POST /api/Comment/search
      .then((resp: any) => {
        const data = resp?.data ?? {};
        const items = Array.isArray(data.data) ? data.data : [];
        const total = data.totalRecords ?? 0;

        const mapped: CommentItem[] = items.map((it: any) => ({
          id: it.id,
          postName: it.post?.title ?? "—",
          username: it.account?.email ?? it.account?.userName ?? "—",
          content: it.content,
          createdAt: it.createdAt,
          raw: it,
        }));

        setListComments(mapped);
        setTotalComments(total);
        setTotalPage(Math.ceil(total / params.limit));
      })
      .catch((err: any) => console.error(err));
  }, [params.timer, params.page, params.limit, params.startDate, params.endDate]);

  // Enter để apply filter
  const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") applyFilter();
  };

  return (
    <div className="mb-9">
      <div className="card mx-n4 px-4 mx-lg-n6 px-lg-6 bg-white">
        <div className="row g-2 mb-4">
          <div className="col-auto d-flex align-items-center gap-2 mt-4">
            <i className="fa-solid fa-comments" />
            <h2 className="m-0">List Comments</h2>
          </div>
        </div>

        {/* Filter theo ngày (dd/MM/yyyy) */}
        <div className="row g-3 align-items-end">
          <div className="col-auto">
            <label className="form-label mb-1">Start Date (dd/MM/yyyy)</label>
            <input
              type="text"
              className="form-control"
              placeholder="dd/MM/yyyy"
              value={params.startDate || ""}
              onChange={(e) => setParams({ ...params, startDate: e.target.value })}
              onKeyDown={onEnter}
            />
          </div>
          <div className="col-auto">
            <label className="form-label mb-1">End Date (dd/MM/yyyy)</label>
            <input
              type="text"
              className="form-control"
              placeholder="dd/MM/yyyy"
              value={params.endDate || ""}
              onChange={(e) => setParams({ ...params, endDate: e.target.value })}
              onKeyDown={onEnter}
            />
          </div>
          <div className="col-auto">
            <button className="btn btn-primary" onClick={applyFilter}>
              <i className="fas fa-filter me-1" /> Lọc
            </button>
          </div>
          <div className="col-auto">
            <button className="btn btn-outline-secondary" onClick={clearFilter}>
              <i className="fas fa-rotate-left me-1" /> Clear
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="border-bottom border-200 position-relative top-1 mt-3">
          <div className="table-responsive scrollbar-overlay mx-n1 px-1">
            <table className="table table-bordered fs--1 mb-2 mt-4">
              <thead>
                <tr>
                  <th className="align-middle text-center" style={{ width: "5%" }}>#</th>
                  <th className="align-middle text-start" style={{ width: "25%" }}>Bài viết</th>
                  <th className="align-middle text-start" style={{ width: "25%" }}>Bình luận</th>
                  <th className="align-middle text-start" style={{ width: "20%" }}>Người bình luận</th>
                  <th className="align-middle text-center" style={{ width: "15%" }}>Ngày tạo</th>
                  <th className="align-middle text-center" style={{ width: "10%" }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {listComments.map((c, idx) => (
                  <tr key={c.id} className="hover-actions-trigger btn-reveal-trigger position-static">
                    <td className="align-middle text-end">{indexOfFirstItem + idx + 1}</td>
                    <td className="align-middle text-start">{c.postName}</td>
                    <td className="align-middle text-start">{c.content}</td>
                    <td className="align-middle text-start">{c.username}</td>
                    <td className="align-middle text-center">{formatDate(c.createdAt)}</td>
                    <td className="align-middle text-center">
                      <button className="btn btn-phoenix-secondary me-1 mb-1" type="button" onClick={() => openInfo(c)}>
                        <i className="far fa-eye" />
                      </button>
                      <button className="btn btn-phoenix-danger me-1 mb-1" type="button" onClick={() => remove(c.id)}>
                        <i className="fa-solid fa-trash" />
                      </button>
                    </td>
                  </tr>
                ))}
                {!listComments.length && (
                  <tr>
                    <td className="text-center" colSpan={6}>Không có bình luận</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="row align-items-center justify-content-between py-2 pe-0 fs--1">
            <div className="col-auto d-flex">
              <p className="mb-0 me-3 fw-semi-bold text-900">
                <span className="fw-bold">Tổng số bình luận: </span> {totalComments}
              </p>
            </div>
            <div className="col-auto d-flex">
              <Pagination
                totalPage={totalPage}
                currentPage={params.page}
                handlePageClick={handlePageClick}
                prev={prev}
                next={next}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Detail Dialog: Comment + Info người comment */}
      <Dialog baseZIndex={2000} style={{ width: "1100px" }} visible={openDetail} onHide={() => setOpenDetail(false)}>
        {commentRef.current ? (
          <div className="p-3">
            <div className="row align-items-center justify-content-between g-3 mb-4">
              <div className="col-auto">
                <h2 className="mb-0">Chi tiết bình luận</h2>
              </div>
              <div className="col-auto">
                <button className="btn btn-phoenix-danger" onClick={() => remove(commentRef.current!.id)}>
                  <i className="fa-solid fa-trash"></i> Xóa bình luận
                </button>
              </div>
            </div>

            <div className="row g-3 mb-6">
              {/* Left: Comment content & meta */}
              <div className="col-12 col-lg-8">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="border-bottom border-dashed border-300 pb-3 mb-3">
                      <h4 className="mb-1">Bài viết: {commentRef.current.raw?.post?.title || "—"}</h4>
                      <div className="text-800">Tạo lúc: {formatDate(commentRef.current.createdAt)}</div>
                    </div>
                    <div>
                      <h5 className="mb-2">Nội dung bình luận</h5>
                      <p className="mb-0">{commentRef.current.content || "(không có nội dung)"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Commenter info */}
              <div className="col-12 col-lg-4">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="border-bottom border-dashed border-300 pb-4">
                      <div className="row align-items-center g-3 g-sm-5 text-center text-sm-start">
                        <div className="col-12 col-sm-auto">
                          <div className="avatar avatar-5xl">
                            <img
                              className="rounded-circle"
                              src={
                                commentRef.current.raw?.account?.avatar
                                  ? `${process.env.REACT_APP_API_URL}/api/Account/getImage/${commentRef.current.raw.account.avatar}`
                                  : defaultPersonImage
                              }
                              alt="Avatar"
                              onError={(e) => {
                                const img = e.target as HTMLImageElement;
                                img.onerror = null;
                                img.src = defaultPersonImage;
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-sm-auto mb-3">
                          <h3 className="mb-1">
                            {commentRef.current.raw?.account?.userName ||
                              commentRef.current.raw?.account?.email ||
                              "N/A"}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex flex-between-center pt-4">
                      <div className="text-end">
                        <h6 className="mb-2 text-800">Ngày tạo</h6>
                        <h4 className="fs-1 text-1000 mb-0">
                          {commentRef.current.raw?.account?.createdAt
                            ? formatDate(commentRef.current.raw.account.createdAt)
                            : "N/A"}
                        </h4>
                      </div>
                    </div>

                    <div className="border-bottom border-dashed border-300 mt-4 mb-3" />

                    <div className="pt-2">
                      <div className="row justify-content-between mb-2">
                        <div className="col-auto">
                          <h5 className="text-1000 mb-0">Địa chỉ</h5>
                        </div>
                        <div className="col-auto">
                          <p className="text-800 mb-0">{commentRef.current.raw?.account?.address || "N/A"}</p>
                        </div>
                      </div>
                      <div className="row justify-content-between mb-2">
                        <div className="col-auto">
                          <h5 className="text-1000 mb-0">Email</h5>
                        </div>
                        <div className="col-auto">
                          <p className="mb-0">{commentRef.current.raw?.account?.email || "N/A"}</p>
                        </div>
                      </div>
                      <div className="row justify-content-between">
                        <div className="col-auto">
                          <h5 className="text-1000 mb-0">SĐT</h5>
                        </div>
                        <div className="col-auto">
                          <p className="mb-0">{commentRef.current.raw?.account?.phoneNumber || "N/A"}</p>
                        </div>
                      </div>
                      {/* Thêm Role nếu backend trả */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Dialog>
    </div>
  );
}
