import { format } from 'date-fns';
import React from 'react'
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth/AuthService';
import { useAppDispatch } from '../../store/hook';
import { setLoading } from '../../reducers/spinnerSlice';
import { toast } from 'react-toastify';
import defaultPersonImage from "../../../assets/images/imagePerson.png"

export default function InfoStudent(props: any) {
  const { info, setUserSearchParams, closeDetail } = props;
  const formatDOB = (date: any) => {
    return format(new Date(date), "dd/MM/yyyy");
  };
  const formatDate = (date: any) => {
    return format(new Date(date), 'dd/MM/yyyy, hh:mm');
  };
  const dispatch = useAppDispatch();

  const deleteUser = (id: number) => {
    Swal.fire({
      title: `Confirm`,
      text: `Do you want to Delete user`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#89B449",
      cancelButtonColor: "#E68A8C",
      confirmButtonText: `Yes`,
      cancelButtonText: `No`,
    }).then((result) => {
      if (result.value) {
        dispatch(setLoading(true));
        AuthService.getInstance()
          .delete({ userUid: id })
          .then((resp: any) => {
            dispatch(setLoading(false));
            setUserSearchParams({
              timer: new Date().getTime(),
            });
            closeDetail();
            toast.success(resp.data.message);
          })
          .catch((err: any) => {
            dispatch(setLoading(false));
            toast.error(err.message);
          });
      }
    });
  };
  return (
    <div>
      <div className="row align-items-center justify-content-between g-3 mb-4">
        <div className="col-auto">
          <h2 className="mb-0">Chi tiết Sinh viên</h2>
        </div>
        <div className="col-auto">
          <div className="row g-2 g-sm-3">
            <div className="col-auto"><button className="btn btn-phoenix-danger" onClick={() => deleteUser(info.userUid)}><i className="fa-solid fa-trash"></i> Xóa Sinh viên</button></div>
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
                    <label className="cursor-pointer avatar avatar-5xl" htmlFor="avatarFile">
                      <img className="rounded-circle" src={info.avatar ? `http://localhost:8080/api/auth/getImage?atchFleSeqNm=${info.avatar}` : defaultPersonImage} alt="" /></label>
                  </div>
                  <div className="col-12 col-sm-auto mb-3">
                    <h3>{info.fullName}</h3>
                    <p className="text-800">{formatDOB(info.dob)}</p>
                  </div>
                </div>
              </div>
              <div className="d-flex flex-between-center pt-4">
                <div>
                  <h6 className="mb-2 text-800">Vai trò</h6>
                  <h4 className="fs-1 text-1000 mb-0">{info.roles}</h4>
                </div>
                <div>
                  <h6 className="mb-2 text-800">Lớp</h6>
                  <h4 className="fs-1 text-1000 mb-0">{info.className}</h4>
                </div>
                <div className="text-end">
                  <h6 className="mb-2 text-800">Ngày tạo</h6>
                  <h4 className="fs-1 text-1000 mb-0">{formatDate(info.cre_dt)}</h4>
                </div>
                <div className="text-end">
                  <h6 className="mb-2 text-800">Ngày cập nhật</h6>
                  <h4 className="fs-1 text-1000 mb-0">{formatDate(info.upd_dt)}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="border-bottom border-dashed border-300">
                <h4 className="mb-3 lh-sm lh-xl-1">Địa chỉ<button className="btn btn-link p-0" type="button"> <svg className="svg-inline--fa fa-pen-to-square fs--1 ms-3 text-500" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="pen-to-square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg><path fill="currentColor" d="M490.3 40.4C512.2 62.27 512.2 97.73 490.3 119.6L460.3 149.7L362.3 51.72L392.4 21.66C414.3-.2135 449.7-.2135 471.6 21.66L490.3 40.4zM172.4 241.7L339.7 74.34L437.7 172.3L270.3 339.6C264.2 345.8 256.7 350.4 248.4 353.2L159.6 382.8C150.1 385.6 141.5 383.4 135 376.1C128.6 370.5 126.4 361 129.2 352.4L158.8 263.6C161.6 255.3 166.2 247.8 172.4 241.7V241.7zM192 63.1C209.7 63.1 224 78.33 224 95.1C224 113.7 209.7 127.1 192 127.1H96C78.33 127.1 64 142.3 64 159.1V416C64 433.7 78.33 448 96 448H352C369.7 448 384 433.7 384 416V319.1C384 302.3 398.3 287.1 416 287.1C433.7 287.1 448 302.3 448 319.1V416C448 469 405 512 352 512H96C42.98 512 0 469 0 416V159.1C0 106.1 42.98 63.1 96 63.1H192z" /></svg>{/* <span class="fas fa-edit fs--1 ms-3 text-500"></span> Font Awesome fontawesome.com */}</button></h4>
              </div>
              <div className="pt-4 mb-7 mb-lg-4 mb-xl-7">
                <div className="row justify-content-between">
                  <div className="col-auto">
                    <h5 className="text-1000">Địa chỉ</h5>
                  </div>
                  <div className="col-auto">
                    <p className="text-800">{info.address}</p>
                  </div>
                </div>
              </div>
              <div className="border-top border-dashed border-300 pt-4">
                <div className="row flex-between-center mb-2">
                  <div className="col-auto">
                    <h5 className="text-1000 mb-0">Email</h5>
                  </div>
                  <div className="col-auto">{info.email}</div>
                </div>
                <div className="row flex-between-center">
                  <div className="col-auto">
                    <h5 className="text-1000 mb-0">SĐT</h5>
                  </div>
                  <div className="col-auto">{info.phone}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
