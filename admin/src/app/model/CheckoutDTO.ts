import { UserDTO } from './UserDTO';
import { CheckoutStatus } from './CheckoutStatus';
import { CheckoutDetailDTO } from './CheckoutDetailDTO';

export interface CheckoutDTO {
  id: number;
  user: UserDTO;
  userUid: number;
  userFullName: string;
  startTime: string;
  endTime: string;
  expiredTime: string;
  fine: number;
  status: CheckoutStatus;
  checkoutDetails: CheckoutDetailDTO[];
}

export { CheckoutStatus };
