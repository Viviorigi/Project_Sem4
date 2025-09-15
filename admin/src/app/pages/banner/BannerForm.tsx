import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../store/hook";
import Swal from "sweetalert2";
import { setLoading } from "../../reducers/spinnerSlice";
import { toast } from "react-toastify";
import defaultPersonImage from "../../../assets/images/imagePerson.png"   
import { BannerDTO } from "../../model/BannerDTO";
import { BannerService } from "../../services/banner/BannerService";
export default function BannerForm(props: any) {
  const { closeForm, onSave, banner } = props;
  const [bannerSave, setBannerSave] = useState<BannerDTO>(
    new BannerDTO()
  );
  const dispatch = useAppDispatch();
  console.log(banner);

  useEffect(() => {
    if (banner) {
        setBannerSave({ ...banner });
    }
  }, []);

  const handleChangeText = (event: any) => {
    const { name, value } = event.target;
    setBannerSave((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [image, setImage] = useState<string | undefined>(undefined);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: any) => {
    const filePreview = event.target.files[0];
    setFile(filePreview);
    if (filePreview && filePreview.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(filePreview);
    } else {
      alert("Hãy chọn file ảnh tồn tại.");
    }
  };

  const setBannerState = () => {
    setBannerSave((prev: BannerDTO) => {
      return {
        ...prev,
        title: prev.title || "",
        description: prev.description || "",
        cre_dt: prev.cre_dt || "",
        upd_dt: prev.upd_dt || "",
      };
    });
  };

  const chk = () => {
    if (bannerSave.title === undefined || bannerSave.title === "") {
      setBannerState();
      return false;
    }if (bannerSave.description === undefined || bannerSave.description === "") {
      setBannerState();
      return false;
    }
    return true;
  };


  const imageSource = image? image : banner!==null ? `${process.env.REACT_APP_API_URL}/api/auth/getImage?atchFleSeqNm=${banner.image}
`: defaultPersonImage;

  const save = () => {
    
    if (!chk()) {
      return;
    }
    const formData = new FormData();
    formData.append("bannerDTO", JSON.stringify(bannerSave));
    if (file) {
      formData.append("file", file);
    }
    Swal.fire({
      title: `Confirm`,
      text:
        banner === null
          ? "Tạo một banner mới?"
          : `Cập nhật banner?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#89B449",
      cancelButtonColor: "#E68A8C",
      confirmButtonText: `Yes`,
      cancelButtonText: `No`,
    }).then((result) => {
      if (result.value) {
        if (banner === null) {
          dispatch(setLoading(true));
          BannerService.getInstance()
            .create(formData)
            .then((resp: any) => {
              if (resp) {
                setTimeout(() => {
                  dispatch(setLoading(false));
                  toast.success(resp.data.message);
                  closeForm();
                  onSave();
                }, 1000);
              }
            })
            .catch((error: any) => {
              dispatch(setLoading(false));
              closeForm();
              toast.error(error.message);
            });
        } else {
          console.log("updateeeeee");
          
          dispatch(setLoading(true));
          BannerService.getInstance()
            .update(formData)
            .then((resp: any) => {
              if (resp) {
                setTimeout(() => {
                  dispatch(setLoading(false));
                  toast.success(resp.data.message);
                  closeForm();
                  onSave();
                }, 1000);
              }
            })
            .catch((error: any) => {
              dispatch(setLoading(false));
              closeForm();
              toast.error(error.message);
            });
        }
      }
    });
  };
  return (
    <div>
      <h3>{banner === null ? "Thêm banner" : "Cập nhật banner"}</h3>
      <div className="row">
        {/* Column 1 */}
        <div className="col-md-6 mb-5">
          <div className="form-group">
            <label>
              Tiêu đề <span className="text-danger">(*)</span>
            </label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={bannerSave.title || ""}
              onChange={handleChangeText}
              placeholder="Nhập tiêu đề"
              
            />
            <div
              className={`invalid-feedback ${bannerSave?.title?.toString() === "" ? "d-block" : ""
                }`}
              style={{ fontSize: "100%", color: "red" }}
            >
              Tiêu đề không được rỗng và phải có từ 5 ký tự trở lên.
            </div>
          </div>
            <div className="form-group">
              <label>
                Miêu tả <span className="text-danger">(*)</span>
              </label>
              <input
                type="text"
                name="description"
                className="form-control"
                value={bannerSave.description || ""}
                onChange={handleChangeText}
                placeholder="Nhập miêu tả"
              />
              <div
                className={`invalid-feedback ${bannerSave.description?.toString() === "" ? "d-block" : ""
                  }`}
                style={{ fontSize: "100%", color: "red" }}
              >
                Miêu tả không được rỗng và phải có từ 5 ký tự trở lên.
              </div>
            </div>

        </div>
        {/* Column 2 */}
        <div className="col-md-6">
          <div className="form-group">
            <label>
              Ảnh banner <span className="text-danger">(*)</span>
            </label>
            <br />
            <input
              name="file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {imageSource && (
              <div
                className="preview Image"
                style={{
                  marginTop: "10px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={imageSource}
                  alt="Preview"
                  style={{ width: "200px", height: "200px" }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <button type="submit" className="btn btn-primary mt-5" onClick={save}>
        {banner ? "Cập nhật" : "Lưu"}
      </button>
    </div>
  );
}
