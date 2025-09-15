import React, { useEffect, useRef, useState } from "react";
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
import { AboutDTO } from "../../model/AboutDTO";
import { AboutService } from "../../services/about/AboutService";
import DOMPurify from 'dompurify';
import JoditEditor, { Jodit } from "jodit-react";

export default function AboutForm(props: any) {
    const { closeForm, onSave, about } = props;
    const [content, setContent] = useState<string>('');
    const [aboutSave, setAboutSave] = useState<AboutDTO>(
        new AboutDTO()
    );
    const dispatch = useAppDispatch();
    console.log(about);
    
    useEffect(() => {
        if (about) {
            setAboutSave({ ...about });
            setContent(about.answer);
        }
    }, []);

    const handleContentChange = (newContent: string) => {
        const sanitizedContent = DOMPurify.sanitize(newContent);
        setContent(sanitizedContent);

        setAboutSave((prev) => ({
            ...prev,
            answer: sanitizedContent,
        }));
    };

    const handleChangeText = (event: any) => {
        const { name, value } = event.target;
        setAboutSave((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleChangeNumber = (event: any) => {
        const { name, value } = event.target;
        setAboutSave((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleActiveChange = (e: any) => {
        setAboutSave({
            ...aboutSave,
            [e.target.name]: e.target.value,
        });
    };

    const setUserState = () => {
        setAboutSave((prev: AboutDTO) => {
            return {
                ...prev,
                question: prev.question || "",
                answer: prev.answer || "",
            };
        });
    };

    const chk = () => {
        if (aboutSave.question === undefined || aboutSave.question === "") {
            setUserState();
            return false;
        }
        if (aboutSave.answer === undefined || aboutSave.answer === "") {
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
                about === null
                    ? "Bạn có muốn tạo about?"
                    : `Bạn có muốn cập nhật about này?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#89B449",
            cancelButtonColor: "#E68A8C",
            confirmButtonText: `Yes`,
            cancelButtonText: `No`,
        }).then((result) => {
            if (result.value) {
                if (about === null) {
                    dispatch(setLoading(true));
                    AboutService.getInstance()
                        .create(aboutSave)
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
                    AboutService.getInstance()
                        .update(aboutSave)
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

    const editor = useRef<Jodit | null>(null);
    return (
        <div>
            <h3>{about === null ? "Tạo mới about" : "Cập nhật about"}</h3>
            <div className="row">
                {/* Column 1 */}
                <div className="col-md-12 mb-5">
                    <div className="form-group">
                        <label>
                            Câu hỏi <span className="text-danger">(*)</span>
                        </label>
                        <input
                            type="text"
                            name="question"
                            className="form-control"
                            value={aboutSave?.question || ""}
                            onChange={handleChangeText}
                            placeholder="Nhập câu hỏi"
                            readOnly={about !== null ? true : false}
                        />
                        <div
                            className={`invalid-feedback ${aboutSave?.question?.toString() === "" ? "d-block" : ""
                                }`}
                            style={{ fontSize: "100%", color: "red" }}
                        >
                            Câu hỏi phải không được rỗng.
                        </div>
                    </div>

                    <div className="">
                        <label>
                            Trả lời <span className="text-danger">(*)</span>
                        </label>
                        <JoditEditor
                            value={content}
                            onChange={(newContent) => handleContentChange(newContent)}
                            
                        />
                        <button onClick={() => console.log(aboutSave.answer)}>Lưu thay đổi</button>
                        <div
                            className={`invalid-feedback ${aboutSave?.answer?.toString() === "" ? "d-block" : ""
                                }`}
                            style={{ fontSize: "100%", color: "red" }}
                        >
                            Trả lời không được rỗng!
                        </div>
                    </div>

                </div>
                {/* Column 2 */}
            </div>

            <button type="submit" className="btn btn-primary mt-5" onClick={save}>
                {about ? "Cập nhật" : "Lưu"}
            </button>
        </div>
    );
}
