// Type untuk promo dan store
export type PromoType = "PERCENT" | "FIX";

export type PromoObject = {
  idPromo: string;
  titlePromo: string;
  minTransactionPromo: number;
  tenorPromo: number;
  subsidiPromo: number;
  adminPromo: number;
  adminPromoType: PromoType;
  interestRate: number;
  voucherCode: string;
  isActive: boolean;
  startDatePromo: string;
  endDatePromo: string;
  storeIds: string[];
  freeInstallment: number;
};

export type StoreObject = {
  id: string;
  name: string;
  company: string;
  address: string;
  route: string;
};
export type StoreCsvRow = {
  "Nama Toko": string;
  Perusahaan: string;
  Alamat: string;
  Route: string;
};

export type PromoCsvRow = {
  "Judul Promo": string;
  "Minimal Transaksi": string;
  Tenor: string;
  Subsidi: string;
  Admin: string;
  "Admin Type": string;
  Bunga: string;
  Voucher: string;
  "Tanggal Mulai": string;
  "Tanggal Selesai": string;
  "Free Cicilan": string;
};

export type StorePromoCsvRow = StoreCsvRow & PromoCsvRow;
