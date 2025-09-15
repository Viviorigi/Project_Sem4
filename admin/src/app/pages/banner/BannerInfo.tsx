import { format } from "date-fns/format";
import { useAppDispatch } from "../../store/hook";
import Swal from "sweetalert2";
import { setLoading } from "../../reducers/spinnerSlice";
import { BannerService } from "../../services/banner/BannerService";
import { toast } from "react-toastify";
import defaultPersonImage from "../../../assets/images/imagePerson.png"

export default function BannerInfo(props: any) {
    const { info, setUserSearchParams, closeDetail } = props;
    const formatDOB = (date: any) => {
      return format(new Date(date), "dd/MM/yyyy");
    };
    const formatDate = (date: any) => {
      return format(new Date(date), 'dd/MM/yyyy, hh:mm');
    };
    const dispatch = useAppDispatch();
  
    const deleteBanner = (b_id: number) => {
      Swal.fire({
        title: `Confirm`,
        text: `Xóa banner này?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#89B449",
        cancelButtonColor: "#E68A8C",
        confirmButtonText: `Yes`,
        cancelButtonText: `No`,
      }).then((result) => {
        if (result.value) {
          dispatch(setLoading(true));
          BannerService.getInstance()
            .delete({ id: b_id })
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
        <div className="row align-items-center justify-content-between g-3 mb-4 ">
          <div className="col-auto">
            <h2 className="mb-0">Banner</h2>
          </div>
          <div className="col-auto">
            <div className="row g-2 g-sm-3">
              <div className="col-auto"><button className="btn btn-phoenix-danger" onClick={() => deleteBanner(info.id)}><i className="fa-solid fa-trash"></i> Xóa Banner</button></div>
            </div>
          </div>
        </div>
        <div className="row g-3 mb-6">
          <div className="col-12 col-lg-12">
            <div className="card h-100">
              <div className="card-body">
                <div className="border-bottom border-dashed border-300 pb-4">
                  <div className="row align-items-center g-3 g-sm-5 text-center text-sm-start">
                    <div className="col-12 col-sm-auto">
                      <label className="cursor-pointer avatar avatar-5xl img-fluid " htmlFor="avatarFile">
                        <img className="img-fluid" src={info.image ? `${process.env.REACT_APP_API_URL}/api/auth/getImage?atchFleSeqNm=${info.image}
` : defaultPersonImage} alt="" /></label>
                    </div>
                  </div>
                </div>
                <div className="d-flex flex-between-center pt-4">
                  <div>
                    <h6 className="mb-2 text-800">Tiêu Đề</h6>
                    <h4 className="fs-1 text-1000 mb-0">{info.title}</h4>
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
                <div className="d-flex flex-between-center pt-4">
                  <div>
                    <h6 className="mb-2 text-800">Miêu tả</h6>
                    <h4 className="fs-1 text-1000 mb-0">{info.description}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
      </div>
    )
  }