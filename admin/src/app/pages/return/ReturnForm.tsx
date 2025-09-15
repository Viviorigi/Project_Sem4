import React, { useState, useEffect } from "react";
import { CheckoutDTO } from "../../model/CheckoutDTO";
import { CheckoutStatus } from "../../model/CheckoutStatus";
import { toast } from "react-toastify";
import { CheckoutService } from "../../services/checkout/CheckoutService";
import axios from "axios";
import Swal from "sweetalert2";

interface ReturnFormProps {
  returnData: CheckoutDTO | null;
  onClose: (status: boolean) => void;
  onSave: (updatedReturn: CheckoutDTO) => void;
  fines: Map<number, number>;
}

const ReturnForm: React.FC<ReturnFormProps> = ({
  returnData,
  onClose,
  onSave,
  fines,
}) => {
  const [currentReturn, setCurrentReturn] = useState<CheckoutDTO | null>(
    returnData
  );
  const [status, setStatus] = useState<CheckoutStatus>(
    CheckoutStatus.REQUESTED
  );
  const [fine, setFine] = useState<number>(0);
  const [returnDate, setReturnDate] = useState<string>("");

  useEffect(() => {
    if (returnData) {
      setCurrentReturn(returnData);
      setStatus(returnData.status);
      setFine(fines.get(returnData.id!) || 0);
      setReturnDate(returnData.expiredTime || "");
    }
  }, [returnData, fines]);

  const validate = (): boolean => {
    if (!currentReturn) return false;

    // if (
    //   status !== CheckoutStatus.RETURNED &&
    //   status !== CheckoutStatus.PENALTY
    // ) {
    //   toast.error("Status must be either RETURNED or PENALTY.");
    //   return false;
    // }

    // if (status === CheckoutStatus.PENALTY && fine <= 0) {
    //   toast.error("Fine must be greater than 0 for PENALTY status.");
    //   return false;
    // }

    return true;
  };

  const handleConfirm = async () => {
    if (!currentReturn) return;

    if (!validate()) return;

    Swal.fire({
      title: "Confirm",
      text: "Do you want to save changes?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#89B449",
      cancelButtonColor: "#E68A8C",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then(async (result) => {
      if(result.isConfirmed){
        const updatedReturn: CheckoutDTO = {
          ...currentReturn,
          status,
          fine,
          expiredTime: returnDate,
          id: currentReturn.id!,
        };
    
        try {
          if (status === CheckoutStatus.RETURNED) {
            await CheckoutService.returnedCheckout(updatedReturn.id);
          } else if (status === CheckoutStatus.EXPIRED) {
            await CheckoutService.expiredCheckout(updatedReturn.id);
          } else {
            await CheckoutService.update(updatedReturn.id, updatedReturn);
          }
    
          // Update fine
          // await axios.put(`http://localhost:8080/api/userfine/update/${currentReturn.id}`, null, {
          //   params: {
          //     amount: fine,
          //   },
          // });
    
          toast.success("Return saved successfully");
          onSave(updatedReturn);
          onClose(true);
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            const errorMessage = error.response.data?.message || "Failed to save return";
            toast.error(errorMessage);
          } else {
            toast.error("Failed to save return");
          }
        }
      }
      
    });

    
  };

  const handleStatusOptions = (currentStatus: CheckoutStatus): CheckoutStatus[] => {
    switch (currentStatus) {
      case CheckoutStatus.BORROWED:
        return [CheckoutStatus.BORROWED,CheckoutStatus.RETURNED, CheckoutStatus.EXPIRED];
      case CheckoutStatus.RETURNED:
        return [CheckoutStatus.RETURNED];
      case CheckoutStatus.EXPIRED:
        return [CheckoutStatus.EXPIRED,CheckoutStatus.RETURNED];
      default:
        return [];
    }
  };

  const statusOptions = handleStatusOptions(status);

  return (
    <div className=" row container-fluid w-100">
      <div className="row mb-3">
        <div className="">
          <div className="">
            <h5 className="modal-title">Chỉnh sửa đơn trả</h5>
          </div>
          <div className="col-12">
            <div className="mb-3">
              <label className="form-label">Học tên</label>
              <input
                type="text"
                className="form-control"
                value={currentReturn?.user.fullName || ""}
                disabled
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Trạng thái</label>
              <select
                className="form-control"
                value={status}
                onChange={(e) => setStatus(e.target.value as CheckoutStatus)}
              >
                {statusOptions.map((statusOption) => (
                  <option key={statusOption} value={statusOption}>
                    {statusOption}
                  </option>
                ))}
              </select>
            </div>
            {/* {status === CheckoutStatus.PENALTY && (
              <div className="mb-3">
                <label className="form-label">Fine</label>
                <input
                  type="number"
                  className="form-control"
                  value={fine}
                  onChange={(e) => setFine(parseFloat(e.target.value))}
                />
              </div>
            )} */}
            {/* {status === CheckoutStatus.RETURNED && (
              <div className="mb-3">
                <label className="form-label">Return Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
              </div>
            )} */}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onClose(false)}
            >
              Đóng
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleConfirm}
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnForm;
