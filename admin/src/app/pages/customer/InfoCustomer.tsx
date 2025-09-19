import React from 'react';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../../store/hook';
import { setLoading } from '../../reducers/spinnerSlice';
import { AuthService } from '../../services/auth/AuthService';
import defaultPersonImage from '../../../assets/images/imagePerson.png';

type ApiUser = {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string | null;
  address: string | null;
  avatar: string | null;
  createdAt: string | null;
  lockoutEnd: string | null;
  roleName: string | null;
};

type Props = {
  info: ApiUser;
  setUserSearchParams: React.Dispatch<React.SetStateAction<any>>;
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

const getStatus = (u: ApiUser) => {
  const isLocked = !!u.lockoutEnd;
  return isLocked
    ? { label: 'Locked', className: 'badge badge-phoenix fs--2 badge-phoenix-danger' }
    : { label: 'Active', className: 'badge badge-phoenix fs--2 badge-phoenix-success' };
};

export default function InfoStudent({ info, setUserSearchParams, closeDetail }: Props) {
  const dispatch = useAppDispatch();
  const status = getStatus(info);

  const deleteUser = (id: string) => {
    Swal.fire({
      title: 'Confirm',
      text: 'Do you want to delete this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#89B449',
      cancelButtonColor: '#E68A8C',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        dispatch(setLoading(true));
        AuthService.getInstance()
          .delete(id) // id là GUID string
          .then((resp: any) => {
            dispatch(setLoading(false));
            setUserSearchParams((prev: any) => ({ ...prev, timer: Date.now() }));
            closeDetail();
            toast.success(resp?.data?.message ?? 'Deleted');
          })
          .catch((err: any) => {
            dispatch(setLoading(false));
            toast.error(err?.message ?? 'Delete failed');
          });
      }
    });
  };

  return (
    <div>
      <div className="row align-items-center justify-content-between g-3 mb-4">
        <div className="col-auto">
          <h2 className="mb-0">Chi tiết Khách hàng</h2>
        </div>
        <div className="col-auto">
          <div className="row g-2 g-sm-3">
            <div className="col-auto">
              <span className={status.className}>
                <span className="badge-label">{status.label}</span>
              </span>
            </div>
            <div className="col-auto">
              <button className="btn btn-phoenix-danger" onClick={() => deleteUser(info.id)}>
                <i className="fa-solid fa-trash"></i> Xóa Khách hàng
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-6">
        <div className="col-12 col-lg-8">
          <div className="card h-100">
            <div className="card-body">
              <div className="border-bottom border-dashed border-300 pb-4">
                <div className="row align-items-center g-3 g-sm-5 text-center text-sm-start">
                  <div className="col-12 col-sm-auto">
                    <div className="avatar avatar-5xl">
                      <img
                        className="rounded-circle"
                        src={
                          info.avatar
                            ? `${process.env.REACT_APP_API_URL}/api/Account/getImage/${info.avatar}`
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
                    <h3 className="mb-1">{info.userName || info.email || 'N/A'}</h3>
                  </div>
                </div>
              </div>

              <div className="d-flex flex-between-center pt-4">
                <div className="text-end">
                  <h6 className="mb-2 text-800">Ngày tạo</h6>
                  <h4 className="fs-1 text-1000 mb-0">{formatDate(info.createdAt)}</h4>
                </div>
                <div className="text-end">
                  <h6 className="mb-2 text-800">Ngày cập nhật</h6>
                  <h4 className="fs-1 text-1000 mb-0">N/A</h4>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="border-bottom border-dashed border-300">
                <h4 className="mb-3 lh-sm lh-xl-1">
                  Thông tin liên hệ
                </h4>
              </div>

              <div className="pt-4 mb-7 mb-lg-4 mb-xl-7">
                <div className="row justify-content-between mb-2">
                  <div className="col-auto">
                    <h5 className="text-1000 mb-0">Địa chỉ</h5>
                  </div>
                  <div className="col-auto">
                    <p className="text-800 mb-0">{info.address || 'N/A'}</p>
                  </div>
                </div>

                <div className="row justify-content-between mb-2">
                  <div className="col-auto">
                    <h5 className="text-1000 mb-0">Email</h5>
                  </div>
                  <div className="col-auto">
                    <p className="mb-0">{info.email || 'N/A'}</p>
                  </div>
                </div>

                <div className="row justify-content-between">
                  <div className="col-auto">
                    <h5 className="text-1000 mb-0">SĐT</h5>
                  </div>
                  <div className="col-auto">
                    <p className="mb-0">{info.phoneNumber || 'N/A'}</p>
                  </div>
                </div>
              </div>
              <div className="row justify-content-between">
                <div className="col-auto">
                  <h5 className="text-1000 mb-0">Vai trò</h5>
                </div>
                <div className="col-auto">
                  <p className="mb-0">{info.roleName || 'N/A'}</p>
                </div>
              </div>
              {/* Có thể thêm các trường khác nếu backend bổ sung */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
