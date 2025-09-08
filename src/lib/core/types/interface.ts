// Interface untuk promo
export interface Promo {
  idPromo: string;
  titlePromo: string;
  minTransactionPromo: number;
  tenorPromo: number;
  subsidiPromo: number;
  adminPromo: number;
  adminPromoType: "PERCENT" | "FIX";
  interestRate: number;
  voucherCode: string;
  isActive: boolean;
  startDatePromo: string;
  endDatePromo: string;
  storeIds: string[];
  freeInstallment: number;
}

// Interface untuk store
export interface Store {
  id: string;
  name: string;
  company: string;
  address: string;
  route: string;
}
