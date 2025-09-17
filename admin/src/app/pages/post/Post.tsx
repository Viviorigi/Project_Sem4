// src/pages/post/Post.tsx
import React, { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { useAppDispatch } from "../../store/hook";
import { setLoading } from "../../reducers/spinnerSlice";
import { Dialog } from "primereact/dialog";
import Pagination from "../../comp/common/Pagination";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { PostService, PostItem } from "../../services/post/PostService";
import PostForm from "./PostForm";
import PostInfo from "./PostInfo";

// 👇 import thêm service danh mục
import {
  PostCategoryService,
  PostCategoryItem,
} from "../../services/postCategory/PostCategoryService";

type SearchState = {
  keyword: string;
  page: number;
  limit: number;
  sortBy: string;
  sortDir: "asc" | "desc";
  timer: number;
  status?: string;
  postCategoryId?: string; // BE string
  isPublish?: string;      // BE string: "", "true", "false"
};

export default function Post() {
  const dispatch = useAppDispatch();
  const [list, setList] = useState<PostItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const refCurrent = useRef<PostItem | null>(null);

  // 👇 state bộ lọc
  const [search, setSearch] = useState<SearchState>({
    keyword: "",
    page: 1,
    limit: 5,
    sortBy: "CreatedAt",
    sortDir: "desc",
    timer: Date.now(),
    status: "",         // không lọc theo status
    postCategoryId: "", // không lọc cate
    isPublish: "",      // không lọc publish
  });

  // 👇 danh mục cho dropdown
  const [categories, setCategories] = useState<PostCategoryItem[]>([]);
  const [loadingCats, setLoadingCats] = useState(false);

  const indexOfLastItem = search.page * search.limit;
  const indexOfFirstItem = indexOfLastItem - search.limit;
  const formatDate = (d?: string) => (d ? format(new Date(d), "dd/MM/yyyy, HH:mm") : "");

  const prev = () => search.page > 1 && setSearch((s) => ({ ...s, page: s.page - 1 }));
  const next = () => search.page < totalPage && setSearch((s) => ({ ...s, page: s.page + 1 }));
  const handlePageClick = (p: number) => setSearch((s) => ({ ...s, page: p }));

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearch((s) => ({ ...s, [name]: value, page: 1 }));
  };
  const handleKeyUpSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") setSearch((s) => ({ ...s, page: 1, timer: Date.now() }));
  };

  // 🔹 load danh mục cho dropdown
  useEffect(() => {
    setLoadingCats(true);
    const body = { pageNumber: 1, pageSize: 5, keyword: "", sortBy: "CreatedAt", sortDir: "desc" as const };
    PostCategoryService.getInstance()
      .search(body)
      .then(({ data }) => {
        const items = (data?.data ?? data?.items ?? []).map((x: any) => ({
          id: x.id,
          postCategoryName: x.postCategoryName ?? "",
          active: x.active ? "1" : (x.active === "1" ? "1" : "0"),
          createdAt: x.createdAt ?? undefined,
        })) as PostCategoryItem[];
        // chỉ lấy danh mục active (tuỳ ý)
        setCategories(items.filter(c => c.active === "1"));
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message ?? "Không tải được danh mục");
      })
      .finally(() => setLoadingCats(false));
  }, []);

  // 🔎 fetch danh sách Post
  useEffect(() => {
    const ZERO_BASED = false; // đổi true nếu BE 0-based
    const pageNumber = ZERO_BASED ? Math.max(0, search.page - 1) : search.page;

    const body = {
      pageNumber,
      pageSize: search.limit,
      keyword: search.keyword,
      status: search.status ?? "",
      sortBy: search.sortBy,
      sortDir: search.sortDir,
      postCategoryId: search.postCategoryId ?? "",
      isPublish: search.isPublish ?? "",
    };

    PostService.getInstance()
  .search(body)
  .then(({ data }) => {
    // GIỮ nguyên object gốc
    const payload = data;

    // lấy mảng rows bên trong
    const raw =
      payload?.data ??
      payload?.items ??
      payload?.records ??
      payload?.rows ??
      payload?.list ??
      [];

    const items: PostItem[] = (Array.isArray(raw) ? raw : []).map((x: any) => ({
      id: x.id,
      title: x.title ?? "",
      description: x.description ?? "",
      postCategoryId: x.postCategoryId ?? 0,
      content: x.content ?? "",
      status: x.status ?? "",
      imageUrl: x.imageUrl ?? x.image ?? undefined,
      createdAt: x.createdAt ?? x.createAt ?? x.created_at ?? undefined,
    }));
    setList(items);

    // đọc tổng từ envelope, không dùng items.length
    const total =
      payload?.totalRecords ??
      payload?.totalItems ??
      payload?.total ??
      payload?.count ??
      0;

    const totalNum = Number(total) || 0;
    setTotalItems(totalNum);
    setTotalPage(Math.max(1, Math.ceil(totalNum / search.limit)));
  })
  .catch((err) => {
    console.error(err);
    toast.error(err?.response?.data?.message ?? "Không tải được dữ liệu");
  });

  }, [
    search.timer,
    search.page,
    search.limit,
    search.sortBy,
    search.sortDir,
    search.keyword,
    search.status,
    search.postCategoryId,
    search.isPublish
  ]);

  const addPost = () => {
    refCurrent.current = null;
    setOpen(true);
  };
  const editPost = (row: PostItem) => {
    refCurrent.current = row;
    setOpen(true);
  };
  const info = (row: PostItem) => {
    refCurrent.current = row;
    setOpenDetail(true);
  };

  const deletePost = (id: number) => {
    Swal.fire({
      title: "Confirm",
      text: "Xác nhận xóa bài viết?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#89B449",
      cancelButtonColor: "#E68A8C",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((res) => {
      if (!res.isConfirmed) return;
      dispatch(setLoading(true));
      PostService.getInstance()
        .delete(id)
        .then((r) => {
          dispatch(setLoading(false));
          toast.success(r?.data?.message ?? "Đã xóa");
          setSearch((s) => ({ ...s, page: 1, timer: Date.now() })); // refresh + về trang 1
        })
        .catch((err) => {
          dispatch(setLoading(false));
          toast.error(err?.response?.data?.message ?? err?.message ?? "Xóa thất bại");
        });
    });
  };

  // 👇 handler đổi filter isPublish / category
  const onChangeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearch((s) => ({ ...s, [name]: value, page: 1, timer: Date.now() }));
  };

  const clearFilters = () => {
    setSearch((s) => ({
      ...s,
      status: "",
      postCategoryId: "",
      isPublish: "",
      page: 1,
      timer: Date.now(),
    }));
  };

  return (
    <div className="mb-9">
      <div className="card mx-n4 px-4 mx-lg-n6 px-lg-6 bg-white">
        <div className="row g-2 mb-4">
          <div className="col-auto">
            <h2 className="mt-4">Bài viết</h2>
          </div>
        </div>

        <div className="row g-3 align-items-end">
          {/* Search keyword */}
          <div className="col-md-4">
            <label className="form-label">Tìm kiếm</label>
            <div className="d-flex">
              <input
                className="form-control"
                type="search"
                placeholder="Tìm theo tiêu đề"
                name="keyword"
                value={search.keyword}
                onChange={handleChangeSearch}
                onKeyUp={handleKeyUpSearch}
              />
              <button
                className="btn btn-primary ms-2"
                onClick={() => setSearch((s) => ({ ...s, page: 1, timer: Date.now() }))}
              >
                <span className="fas fa-search" />
              </button>
            </div>
          </div>

          {/* Filter isPublish */}
          <div className="col-md-3">
            <label className="form-label">Xuất bản</label>
            <select
              name="isPublish"
              className="form-control"
              value={search.isPublish}
              onChange={onChangeFilter}
            >
              <option value="">-- Tất cả --</option>
              <option value="true">Đã xuất bản</option>
              <option value="false">Chưa xuất bản</option>
            </select>
          </div>

          {/* Filter Category */}
          <div className="col-md-3">
            <label className="form-label">Danh mục</label>
            <select
              name="postCategoryId"
              className="form-control"
              value={search.postCategoryId}
              onChange={onChangeFilter}
              disabled={loadingCats}
            >
              <option value="">{loadingCats ? "Đang tải..." : "-- Tất cả --"}</option>
              {categories.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.postCategoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2 d-flex gap-2">
            <button className="btn btn-outline-secondary w-100" onClick={clearFilters}>
              Xóa lọc
            </button>
            <button className="btn btn-primary w-100" onClick={addPost}>
              <span className="fas fa-plus me-2" />
              Thêm
            </button>
          </div>
        </div>

        <div className="border-bottom border-200 position-relative top-1 mt-3">
          <div className="table-responsive scrollbar-overlay mx-n1 px-1">
            <table className="table table-bordered fs--1 mb-2 mt-4">
              <thead>
                <tr>
                  <th className="text-center" style={{ width: "5%" }}>#</th>
                  <th className="text-center" style={{ width: "8%" }}>ID</th>
                  <th style={{ width: "25%" }}>Tiêu đề</th>
                  <th className="text-center" style={{ width: "10%" }}>Danh mục</th>
                  <th className="text-center" style={{ width: "12%" }}>Trạng thái</th>
                  <th className="text-center" style={{ width: "20%" }}>Ngày tạo</th>
                  <th className="text-center" style={{ width: "20%" }}>Hành động</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {list.map((u, idx) => (
                  <tr key={u.id}>
                    <td className="align-middle text-end">{indexOfFirstItem + idx + 1}</td>
                    <td className="align-middle">{u.id}</td>
                    <td className="align-middle text-start">{u.title}</td>
                    <td className="align-middle">{u.postCategoryId}</td>
                    <td className="align-middle">
                      <span className={`badge ${u.status?.toUpperCase() === "PUBLISH" || u.status === "Published" ? "bg-success" : "bg-secondary"}`}>
                        {u.status || "N/A"}
                      </span>
                    </td>
                    <td className="align-middle">{formatDate(u.createdAt)}</td>
                    <td className="align-middle">
                      <button className="btn btn-phoenix-secondary me-1 mb-1" onClick={() => info(u)}>
                        <i className="far fa-eye"></i>
                      </button>
                      <button className="btn btn-phoenix-primary me-1 mb-1" onClick={() => editPost(u)}>
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button className="btn btn-phoenix-danger me-1 mb-1" onClick={() => deletePost(u.id)}>
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
                {list.length === 0 && (
                  <tr>
                    <td className="text-center" colSpan={7}>Không có dữ liệu</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="row align-items-center justify-content-between py-2 pe-0 fs--1">
            <div className="col-auto d-flex">
              <p className="mb-0 fw-semi-bold text-900">
                <span className="fw-bold">Tổng bài viết: </span> {totalItems}
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

        <Dialog baseZIndex={2000} style={{ width: "860px" }} visible={open} onHide={() => setOpen(false)}>
          <PostForm
            post={refCurrent.current}
            closeForm={() => setOpen(false)}
            onSave={() => setSearch((s) => ({ ...s, page: 1, timer: Date.now() }))}
          />
        </Dialog>

        <Dialog baseZIndex={2000} style={{ width: "720px" }} visible={openDetail} onHide={() => setOpenDetail(false)}>
          {refCurrent.current && (
            <PostInfo
              info={refCurrent.current}
              closeDetail={() => setOpenDetail(false)}
              setUserSearchParams={setSearch as any}
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
