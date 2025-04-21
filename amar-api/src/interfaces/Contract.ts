import {
  ContractType,
  GeneralStatus,
  PaymentStatus,
  SignatureStatus,
} from '../../prisma/generated/prisma-client-js';

export default interface Contract {
  id?: string;
  name: string;
  type: ContractType;
  address: string;
  neighborhood: string;
  city: string;
  date: Date;
  eventStartTime: Date;
  commutingFee: number;
  discountPercentage: number;
  paymentDueDate: Date;
  observations: string;
  fileUrl?: string;
  isSigned?: SignatureStatus;
  isPaid?: PaymentStatus;
  generalStatus?: GeneralStatus;
}
