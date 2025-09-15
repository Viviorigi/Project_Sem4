import React, { useEffect, useState } from "react";
import { UserDTORequest } from "../../model/auth/UserDTORequest";
import { useAppDispatch } from "../../store/hook";
import Swal from "sweetalert2";
import { setLoading } from "../../reducers/spinnerSlice";
import { AuthService } from "../../services/auth/AuthService";
import { toast } from "react-toastify";
import defaultPersonImage from "../../../assets/images/imagePerson.png"
import noImageAvailable from "../../../assets/images/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg"
import { ContactDTO } from "../../model/ContactDTO";
import { ContactService } from "../../services/contact/ContactService";
export default function ContactForm(props: any) {
  const { closeForm, onSave, contact } = props;
  const [contactSave, setContactSave] = useState<ContactDTO>(
    new ContactDTO()
  );
  const dispatch = useAppDispatch();
  console.log(contact);

  useEffect(() => {
    if (contact) {
        setContactSave({ ...contact });
    }
  }, []);

  const handleChangeText = (event: any) => {
    const { name, value } = event.target;
    setContactSave((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleChangeNumber = (event: any) => {
    const { name, value } = event.target;
    setContactSave((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleActiveChange = (e: any) => {
    setContactSave({
      ...contactSave,
      [e.target.name]: e.target.value,
    });
  };

  const [image, setImage] = useState<string | undefined>(undefined);
  const [file, setFile] = useState<File | null>(null);

  const setUserState = () => {
    setContactSave((prev: ContactDTO) => {
      return {
        ...prev,
        email: prev.email || "",
        firstName: prev.firstName || "",
        lastName: prev.lastName || "",
        question: prev.question || "",
        response: prev.response || "",
      };
    });
  };

  const chk = () => {
    if (contactSave.email === undefined || contactSave.email === "") {
      setUserState();
      return false;
    }
    if (contactSave.firstName === undefined || contactSave.firstName === "") {
      setUserState();
      return false;
    }
    if (contactSave.lastName === undefined || contactSave.lastName === "") {
      setUserState();
      return false;
    }
    if (contactSave.question === undefined || contactSave.question === "") {
      setUserState();
      return false;
    }
    if (contactSave.response === undefined || contactSave.response.toString() === "") {
      setUserState();
      return false;
    }
    return true;
  };

  const save = () => {
    if (!chk()) {
      return;
    }
    Swal.fire({
      title: `Confirm`,
      text:
      contact === null
          ? "Tạo liên hệ mới?"
          : `Cập nhật liên hệ này?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#89B449",
      cancelButtonColor: "#E68A8C",
      confirmButtonText: `Yes`,
      cancelButtonText: `No`,
    }).then((result) => {
      if (result.value) {
        if (contact === null) {
          dispatch(setLoading(true));
          ContactService.getInstance()
            .create(contactSave)
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
          dispatch(setLoading(true));
          ContactService.getInstance()
            .update(contactSave)
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
              toast.error(error.response.data.message);
            });
        }
      }
    });
  };
  return (
    <div>
      <h3>{contact === null ? "Tạo liên hệ" : "Cập nhật liên hệ"}</h3>
      <div className="row">
        {/* Column 1 */}
        <div className="col-md-12 mb-5">
          <div className="form-group">
            <label>
              Họ <span className="text-danger">(*)</span>
            </label>
            <input
              type="text"
              name="firstName"
              className="form-control"
              value={contactSave?.firstName || ""}
              onChange={handleChangeText}
              placeholder="Nhập họ"
              readOnly={contact !== null ? true : false}
            />
            <div
              className={`invalid-feedback ${contactSave?.firstName?.toString() === "" ? "d-block" : ""
                }`}
              style={{ fontSize: "100%", color: "red" }}
            >
              Họ không được rỗng!
            </div>
          </div>

            <div className="form-group">
              <label>
                Tên <span className="text-danger">(*)</span>
              </label>
              <input
                type="text"
                name="lastName"
                className="form-control"
                value={contactSave?.lastName || ""}
                onChange={handleChangeText}
                placeholder="Nhập tên"
              />
              <div
                className={`invalid-feedback ${contactSave?.lastName?.toString() === "" ? "d-block" : ""
                  }`}
                style={{ fontSize: "100%", color: "red" }}
              >
                Tên không được rỗng!
              </div>
            </div>


          <div className="form-group">
            <label>
              Email <span className="text-danger">(*)</span>
            </label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={contactSave?.email || ""}
              onChange={handleChangeText}
              placeholder="Nhập email"
            />
            <div
              className={`invalid-feedback ${contactSave?.email?.toString() === "" ? "d-block" : ""
                }`}
              style={{ fontSize: "100%", color: "red" }}
            >
              Email không được rỗng!
            </div>
          </div>

          <div className="form-group">
            <label>
              Câu hỏi <span className="text-danger">(*)</span>
            </label>
            <input
              type="text"
              name="question"
              className="form-control"
              value={contactSave?.question || ""}
              onChange={handleChangeText}
              placeholder="Nhập câu hỏi"
            />
            <div
              className={`invalid-feedback ${contactSave?.question?.toString() === "" ? "d-block" : ""
                }`}
              style={{ fontSize: "100%", color: "red" }}
            >
              Câu hỏi không được rỗng!
            </div>
          </div>

          <div className="form-group">
            <label>
              Phản hổi <span className="text-danger">(*)</span>
            </label>
            <textarea
              name="response"
              className="form-control"
              value={contactSave?.response || ""}
              onChange={handleChangeNumber}
              placeholder="Nhập phản hồi"
            />
            <div
              className={`invalid-feedback ${contactSave?.response?.toString() === "" ? "d-block" : ""
                }`}
              style={{ fontSize: "100%", color: "red" }}
            >
                Phản hổi không được rỗng!
            </div>
          </div>


        </div>
        {/* Column 2 */}
      </div>

      <button type="submit" className="btn btn-primary mt-5" onClick={save}>
        {contact ? "Cập nhật" : "Lưu"}
      </button>
    </div>
  );
}
