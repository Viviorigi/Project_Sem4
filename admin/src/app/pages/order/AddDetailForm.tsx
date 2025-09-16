import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckoutDetailDTO } from "../../model/CheckoutDetailDTO";
import { BookSearch } from "../product/book-search";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const BASE_URL = process.env.REACT_APP_API_URL + "/api/checkoutdt";

interface AddDetailFormProps {
  checkoutId: number;
  detail?: CheckoutDetailDTO | null;
  onClose: (status: boolean) => void;
  mode: "add" | "edit";
}

const AddDetailForm: React.FC<AddDetailFormProps> = ({
  checkoutId,
  detail,
  onClose,
  mode,
}) => {
  const [searchDto, setSearchDto] = useState(
    new BookSearch("", 1, 0, new Date().getTime())
  );
  const [categories, setCategories] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>(
    detail?.cate_id || 0
  );
  const [selectedBook, setSelectedBook] = useState<number>(detail?.bookId || 0);
  const [quantity, setQuantity] = useState<number>(detail?.quantity || 0);
  const [errors, setErrors] = useState({
    category: "",
    book: "",
    quantity: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchBooks(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL + `/category/list/all`);
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching categories", error);
      setCategories([]);
    }
  };

  const fetchBooks = async (cate_id: number) => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL + `/book/list`, {
        params: {
          page: 1,
          keySearch: '',
          cateId: cate_id,
        },
      });
      setBooks(response.data.content || []);
    } catch (error) {
      console.error("Error fetching books", error);
    }
  };

  const validateForm = () => {
    let valid = true;
    let errors = { category: "", book: "", quantity: "" };
  
    if (mode === "add") {
      if (!selectedCategory) {
        errors.category = "Hãy chọn một danh mục";
        valid = false;
      }
  
      if (!selectedBook) {
        errors.book = "Hãy chọn một sách";
        valid = false;
      }
    }
  
    if (!quantity || quantity <= 0) {
      errors.quantity = "Số lượng phải lớn hơn 0";
      valid = false;
    }
  
    setErrors(errors);
    return valid;
  };

  const checkIfBookExists = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/details/${checkoutId}`);
      const existingDetails: CheckoutDetailDTO[] = response.data;
  
      const bookExists = existingDetails.some(detail => detail.bookId === selectedBook);
  
      return bookExists;
    } catch (error) {
      console.error("Error checking if book exists", error);
      return false;
    }
  };

  const handleAdd = async () => {
    if (!validateForm()) return;

    const bookExists = await checkIfBookExists();
    if (bookExists) {
      toast.error("Sách đã tồn tại trong đơn mượn. Hãy chọn sách khác!");
      return;
    }

    Swal.fire({
      title: "Confirm Save",
      text: "Xác nhận thêm bản ghi này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Save it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const newDetail: CheckoutDetailDTO = {
          id: 0,
          bookId: selectedBook,
          bookTitle: books.find((book) => book.id === selectedBook)?.title || "",
          cate_id: selectedCategory,
          categoryName:
            categories.find((category) => category.id === selectedCategory)?.name ||
            "",
          quantity,
          checkoutId: checkoutId,
        };


          await axios.post(`${BASE_URL}/add/${checkoutId}`, newDetail)
            .then((resp) => {
              toast.success("Đã xóa thành công");
              onClose(true);
            }).catch((e) => {
              // toast.error("Failed to add detail");
            });

      }
    });
  };

  const handleEdit = async () => {
    if (!validateForm()) return;

    Swal.fire({
      title: "Confirm Save",
      text: "Lưu lại thay đổi?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Save it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const updatedDetail: CheckoutDetailDTO = {
          id: detail?.id || 0,
          bookId: selectedBook,
          bookTitle: books.find((book) => book.id === selectedBook)?.title || "",
          cate_id: selectedCategory,
          categoryName:
            categories.find((category) => category.id === selectedCategory)?.name ||
            "",
          quantity,
          checkoutId: detail?.checkoutId || 0,
        };

        try {
          await axios.put(`${BASE_URL}/update/${updatedDetail.id}`, updatedDetail);

          toast.success("Cập nhật thành công");
          onClose(true);
        } catch (error) {
          console.error("Error updating checkout detail", error);
          toast.error("Cập nhật thất bại");
        }
      }
    });
  };

  const handleSave = () => {
    if (mode === "edit") {
      handleEdit();
    } else {
      handleAdd();
    }
  };

  return (
    <div>
      <h2>{mode === "add" ? "Add Detail" : "Edit Detail"}</h2>
      <div className="form-group">
        <label htmlFor="category">Danh mục</label>
        <select
          id="category"
          className="form-control"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(Number(e.target.value))}
          disabled={mode === "edit"}
        >
          <option value="">Lựa chọn danh mục</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.category && <div className="text-danger">{errors.category}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="book">Sách</label>
        <select
          id="book"
          className="form-control"
          value={selectedBook}
          onChange={(e) => setSelectedBook(Number(e.target.value))}
          disabled={mode === "edit"}
        >
          <option value="">Lựa chọn sách</option>
          {books.map((book) => (
            <option key={book.id} value={book.id}>
              {book.title}
            </option>
          ))}
        </select>
        {errors.book && <div className="text-danger">{errors.book}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="quantity">Số lượng</label>
        <input
          id="quantity"
          type="number"
          className="form-control"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        {errors.quantity && <div className="text-danger">{errors.quantity}</div>}
      </div>
      <div className="form-group text-right">
        <button className="btn btn-primary me-2" onClick={handleSave}>
          Lưu
        </button>
        <button className="btn btn-secondary" onClick={() => onClose(false)}>
          Hủy
        </button>
      </div>
    </div>
  );
};

export default AddDetailForm;
