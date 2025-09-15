
import { CheckoutDetailBookDTO } from "./CheckoutDetailsBookDTO";
import { CheckoutStatus } from "./CheckoutStatus";

export interface CheckoutBookDTO {
  userUid: number;
  expiredTime: string;
  fine: number;
  status: CheckoutStatus;
  checkoutDetails: CheckoutDetailBookDTO[];
}

export { CheckoutStatus };