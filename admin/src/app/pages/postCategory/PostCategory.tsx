import React, { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { useAppDispatch } from "../../store/hook";
import { setLoading } from "../../reducers/spinnerSlice";
import { Dialog } from "primereact/dialog";
import Pagination from "../../comp/common/Pagination";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import {
  PostCategoryService,
  PostCategoryItem,
} from "../../services/postCategory/PostCategoryService";
import PostCategoryForm from "./PostCategoryForm";
import PostCategoryInfo from "./PostCategoryInfo";

type SearchState = {
  keyword: string;
  page: number;
  limit: number;
  sortBy: string;
  sortDir: "asc" | "desc";
  timer: number;
};

export default function PostCategory() {
  const dispatch = useAppDispatch();
  const [list, setList] = useState<PostCategoryItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const refCurrent = useRef<PostCategoryItem | null>(null);

  const [search, setSearch] = useState<SearchState>({
    keyword: "",
    page: 1,
    limit: 10,
    sortBy: "CreatedAt",
    sortDir: "desc",
    timer: Date.now(),
  });

  const indexOfLastItem = search.page * search.limit;
  const indexOfFirstItem = indexOfLastItem - search.limit;

  const formatDate = (date: string | number | Date) =>
    format(new Date(date), "dd/MM/yyyy, HH:mm");

  const prev = () => {
    if (search.page > 1) setSearch((s) => ({ ...s, page: s.page - 1 }));
  };
  const next = () => {
    if (search.page < totalPage) setSearch((s) => ({ ...s, page: s.page + 1 }));
  };
  const handlePageClick = (pageNumber: number) =>
    setSearch((s) => ({ ...s, page: pageNumber }));

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearch((s) => ({ ...s, [name]: value, page: 1 }));
  };
  const handleKeyUpSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearch((s) => ({ ...s, timer: Date.now() }));
    }
  };

  useEffect(() => {
    const body = {
      pageNumber: search.page,
      pageSize: search.limit,
      keyword: search.keyword,
      sortBy: search.sortBy,
      sortDir: search.sortDir,
    };

    PostCategoryService.getInstance()
      .search(body)
      .then(({ data }) => {
        // chuẩn hoá dữ liệu về PostCategoryItem cho FE
        const items = (data?.data ?? []).map((x: any) => ({
          id: x.id,
          postCategoryName: x.postCategoryName ?? "",
          active: x.active ? "1" : "0",        // <- bool -> "1"/"0"
          createdAt: x.createdAt ?? undefined,
        })) as PostCategoryItem[];

        setList(items);
        const total = data?.totalRecords ?? items.length;
        setTotalItems(total);
        setTotalPage(Math.max(1, Math.ceil(total / search.limit)));
      })
      .catch((err) => {
        console.error(err);
        toast.error(err?.response?.data?.message ?? "Không tải được dữ liệu");
      });
  }, [search.timer, search.page, search.limit, search.sortBy, search.sortDir]);


  const addCategory = () => {
    refCurrent.current = null;
    setOpen(true);
  };
  const editCategory = (row: PostCategoryItem) => {
    refCurrent.current = row;
    setOpen(true);
  };
  const info = (row: PostCategoryItem) => {
    refCurrent.current = row;
    setOpenDetail(true);
  };

  const deleteCategory = (id: number) => {
    Swal.fire({
      title: "Confirm",
      text: "Xác nhận xóa danh mục?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#89B449",
      cancelButtonColor: "#E68A8C",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((res) => {
      if (!res.isConfirmed) return;
      dispatch(setLoading(true));
      PostCategoryService.getInstance()
        .delete(id)
        .then((r) => {
          dispatch(setLoading(false));
          toast.success(r?.data?.message ?? "Đã xóa");
          setSearch((s) => ({ ...s, timer: Date.now() }));
        })
        .catch((err) => {
          dispatch(setLoading(false));
          toast.error(err?.response?.data?.message ?? err?.message ?? "Xóa thất bại");
        });
    });
  };

  return (
    <div className="mb-9">
      <div className="card mx-n4 px-4 mx-lg-n6 px-lg-6 bg-white">
        <div className="row g-2 mb-4">
          <div className="col-auto">
            <h2 className="mt-4">Danh mục bài viết</h2>
          </div>
        </div>

        <div>
          <div className="row g-3">
            <div className="col-auto">
              <div className="search-box d-flex">
                <input
                  className="form-control search-input search"
                  type="search"
                  placeholder="Tìm kiếm danh mục"
                  name="keyword"
                  aria-label="Search"
                  value={search.keyword}
                  onChange={handleChangeSearch}
                  onKeyUp={handleKeyUpSearch}
                />
                <button
                  className="btn btn-primary"
                  onClick={() => setSearch((s) => ({ ...s, timer: Date.now() }))}
                >
                  <span className="fas fa-search" />
                </button>
              </div>
            </div>

            <div className="col-auto ms-auto">
              <button className="btn btn-primary" onClick={addCategory}>
                <span className="fas fa-plus me-2" />
                Tạo danh mục
              </button>
            </div>
          </div>
        </div>

        <div className="border-bottom border-200 position-relative top-1">
          <div className="table-responsive scrollbar-overlay mx-n1 px-1">
            <table className="table table-bordered fs--1 mb-2 mt-5">

              <thead >
                <tr>
                  <th className="align-middle text-center" style={{ width: "5%" }}>
                    #
                  </th>
                  <th className="align-middle text-center" style={{ width: "10%" }}>
                    ID
                  </th>
                  <th className="align-middle text-center" style={{ width: "35%" }}>
                    Tên danh mục
                  </th>
                  <th className="align-middle text-center" style={{ width: "15%" }}>
                    Trạng thái
                  </th>
                  <th className="align-middle text-center" style={{ width: "20%" }}>
                    Ngày tạo
                  </th>
                  <th className="align-middle text-center" style={{ width: "15%" }}>
                    Hành động
                  </th>
                </tr>


              </thead>
              <tbody className="text-center">
                {list.map((u, idx) => (
                  <tr key={u.id}>
                    <td className="align-middle text-center">{indexOfFirstItem + idx + 1}</td>
                    <td className="align-middle text-center">{u.id}</td>
                    <td className="align-middle">{u.postCategoryName}</td>
                    <td className="align-middle text-center">
                      {u.active == "1" ? (
                        <span className="badge bg-success">Active</span>
                      ) : (
                        <span className="badge bg-secondary">Inactive</span>
                      )}
                    </td>

                    <td className="align-middle text-center">
                      {u.createdAt ? formatDate(u.createdAt) : ""}
                    </td>
                    <td className="align-middle text-center">
                      <button
                        className="btn btn-phoenix-secondary me-1 mb-1"
                        type="button"
                        onClick={() => info(u)}
                      >
                        <i className="far fa-eye"></i>
                      </button>
                      <button
                        className="btn btn-phoenix-primary me-1 mb-1"
                        type="button"
                        onClick={() => editCategory(u)}
                      >
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button
                        className="btn btn-phoenix-danger me-1 mb-1"
                        type="button"
                        onClick={() => deleteCategory(u.id)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
                {list.length === 0 && (
                  <tr>
                    <td className="text-center" colSpan={6}>
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="row align-items-center justify-content-between py-2 pe-0 fs--1">
            <div className="col-auto d-flex">
              <p className="mb-0 fw-semi-bold text-900">
                <span className="fw-bold">Tổng danh mục: </span> {totalItems}
              </p>
            </div>
            <div className="col-auto d-flex">
              <Pagination
                totalPage={totalPage}
                currentPage={search.page}
                handlePageClick={handlePageClick}
                prev={prev}
                next={next}
              />
            </div>
          </div>
        </div>

        <Dialog baseZIndex={2000} style={{ width: "720px" }} visible={open} onHide={() => setOpen(false)}>
          <PostCategoryForm
            category={refCurrent.current}
            closeForm={() => setOpen(false)}
            onSave={() => setSearch((s) => ({ ...s, timer: Date.now() }))}
          />
        </Dialog>
        <Dialog
          baseZIndex={2000}
          style={{ width: "720px" }}
          visible={openDetail}
          onHide={() => setOpenDetail(false)}
        >
          {refCurrent.current && (
            <PostCategoryInfo
              info={refCurrent.current}   // lúc này chắc chắn không null
              closeDetail={() => setOpenDetail(false)}
            />
          )}
        </Dialog>
          
      </div>
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
