import React, { useMemo } from 'react';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../../store/hook';
import { setLoading } from '../../reducers/spinnerSlice';
import defaultPersonImage from '../../../assets/images/imagePerson.png';
import noImageAvailable from '../../../assets/images/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg';
import { HeadersUtil } from '../../utils/Headers.Util';

type Category = {
  id: number;
  categoryName: string;
  active: boolean;
};

type ProductInfoModel = {
  id: number;
  productName: string;
  price: number;
  salePrice: number;
  image?: string | null;
  album?: string | string[] | null;   // có thể là json string hoặc mảng
  description?: string | null;        // có thể là HTML
  active: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  category?: Category | null;
};

type Props = {
  info: ProductInfoModel;
  onRefresh?: () => void;      // để reload list sau khi xóa/sửa
  closeDetail: () => void;
};

const formatDate = (date?: string | null) => {
  if (!date) return 'N/A';
  try {
    return format(new Date(date), 'dd/MM/yyyy');
  } catch {
    return 'N/A';
  }
};

const buildImg = (file?: string | null) => {
  if (!file) return defaultPersonImage;
  if (/^https?:\/\//i.test(file)) return file;
  return `${process.env.REACT_APP_API_URL}/api/Account/getImage/${file}`;
};

export default function ProductInfo({ info, onRefresh, closeDetail }: Props) {
  const dispatch = useAppDispatch();

  // Parse album (string JSON hoặc mảng)
  const albumList: string[] = useMemo(() => {
    if (!info?.album) return [];
    if (Array.isArray(info.album)) return info.album.map((x) => String(x));
    try {
      const arr = JSON.parse(info.album);
      return Array.isArray(arr) ? arr.map((x) => String(x)) : [];
    } catch {
      return [];
    }
  }, [info]);

  const statusBadge = info.active
    ? { label: 'Đang hoạt động', className: 'badge badge-phoenix fs--2 badge-phoenix-success' }
    : { label: 'Không hoạt động', className: 'badge badge-phoenix fs--2 badge-phoenix-danger' };

  const onDelete = async (id: number) => {
    const { value } = await Swal.fire({
      title: 'Xác nhận',
      text: 'Bạn có chắc muốn xóa sản phẩm này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#89B449',
      cancelButtonColor: '#E68A8C',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    });
    if (!value) return;

    try {
      dispatch(setLoading(true));
      const url = `${process.env.REACT_APP_API_URL}/api/Product/${id}`;
      await axios.delete(url, { headers: HeadersUtil.getHeadersAuth() });
      toast.success('Đã xóa sản phẩm');
      onRefresh?.();
      closeDetail();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Xóa thất bại');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div>
      <div className="row align-items-center justify-content-between g-3 mb-4">
        <div className="col-auto">
          <h2 className="mb-0">Chi tiết Sản phẩm</h2>
        </div>
        <div className="col-auto">
          <div className="row g-2 g-sm-3">
            <div className="col-auto">
              <span className={statusBadge.className}>
                <span className="badge-label">{statusBadge.label}</span>
              </span>
            </div>
            <div className="col-auto">
              <button className="btn btn-phoenix-danger" onClick={() => onDelete(info.id)}>
                <i className="fa-solid fa-trash" /> Xóa sản phẩm
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-6">
        {/* Left */}
        <div className="col-12 col-lg-8">
          <div className="card h-100">
            <div className="card-body">
              <div className="border-bottom border-dashed border-300 pb-4">
                <div className="row align-items-center g-3 g-sm-5 text-center text-sm-start">
                  <div className="col-12 col-sm-auto">
                    <div className="avatar avatar-5xl">
                      <img
                        src={buildImg(info.image)}
                        alt="Product"
                        onError={(e) => {
                          const img = e.currentTarget as HTMLImageElement;
                          img.onerror = null;
                          img.src = defaultPersonImage;
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-12 col-sm-auto mb-3">
                    <h3 className="mb-1">{info.productName || 'N/A'}</h3>
                    <div>
                      <span className="badge bg-secondary me-2">
                        {info.category?.categoryName ?? 'Không có danh mục'}
                      </span>
                      <span className="badge bg-light text-dark">
                        ID: {info.id}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing & Dates */}
              <div className="row pt-4">
                <div className="col-6">
                  <h6 className="mb-1 text-800">Giá</h6>
                  <h4 className="fs-1 text-1000 mb-0">
                    {info.price?.toLocaleString?.('vi-VN') ?? 'N/A'}
                  </h4>
                </div>
                <div className="col-6">
                  <h6 className="mb-1 text-800">Giá khuyến mãi</h6>
                  <h4 className="fs-1 text-1000 mb-0">
                    {info.salePrice?.toLocaleString?.('vi-VN') ?? '0'}
                  </h4>
                </div>
              </div>

              <div className="d-flex flex-between-center pt-4">
                <div className="text-start">
                  <h6 className="mb-2 text-800">Ngày tạo</h6>
                  <h4 className="fs-1 text-1000 mb-0">{formatDate(info.createdAt)}</h4>
                </div>
              </div>
              {/* Description */}
              <div className="mt-4">
                <h5 className="mb-2">Mô tả</h5>
                {info.description ? (
                  <div
                    className="prose"
                    dangerouslySetInnerHTML={{ __html: info.description }}
                  />
                ) : (
                  <p className="text-800">Không có mô tả</p>
                )}
              </div>

              {/* Album */}
              {albumList.length > 0 && (
                <>
                  <h5 className="mt-4 mb-2">Album</h5>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {albumList.map((f, idx) => (
                      <img
                        key={idx}
                        src={buildImg(f)}
                        alt={`album-${idx}`}
                        style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 6 }}
                        onError={(e) => {
                          const img = e.currentTarget as HTMLImageElement;
                          img.onerror = null;
                          img.src = noImageAvailable;
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="col-12 col-lg-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="border-bottom border-dashed border-300">
                <h4 className="mb-3 lh-sm lh-xl-1">Thông tin khác</h4>
              </div>

              <div className="pt-4">
                <div className="row justify-content-between mb-2">
                  <div className="col-auto">
                    <h5 className="text-1000 mb-0">Danh mục</h5>
                  </div>
                  <div className="col-auto">
                    <p className="text-800 mb-0">{info.category?.categoryName ?? 'N/A'}</p>
                  </div>
                </div>

                <div className="row justify-content-between mb-2">
                  <div className="col-auto">
                    <h5 className="text-1000 mb-0">Trạng thái</h5>
                  </div>
                  <div className="col-auto">
                    <span className={statusBadge.className}>
                      <span className="badge-label">{statusBadge.label}</span>
                    </span>
                  </div>
                </div>

                {/* Có thể thêm các trường thuộc tính/option nếu backend có */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
