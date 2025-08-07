/// <reference types="vite/client" />
interface ApiResponse<T> {
  code: string;
  message: string;
  success: boolean;
  data: T;
}
interface SelectOption {
  value: string;
  label: string;
}

interface UserRegisterRequest {
  email: string;
  password: string;
  phone: string; // e.g. 09xxxxxxxx
  nickName: string;
  lineId: string;
  addressName?: string;
  address?: string;
}

interface UserLoginRequest {
  username: string;
  password: string;
}

interface RefreshTokenRequest {
  refreshToken: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

interface UserProfileModifyRequest {
  nickName: string;
  addressName: string;
  lineId: string;
  phone: string;
  address: string;
}

interface UserProfileResponse {
  nickName: string;
  addressName: string;
  lineId: string;
  phone: string;
  address: string;
}

interface RecordPeriodRequest {
  startTime: string; // yyyy/MM/dd
  endTime: string; // yyyy/MM/dd
}

interface RecordVO {
  date: string;
  item: string;
  content: string;
}
interface God {
  id: string;
  name: string;
  imageCode: string;
  description: string;
  sort: string;
}

interface GodInfoVO {
  name: string;
  imageCode: string;
  onshelfTime: string;
  offshelfTime: string;
  cooldownTime: string;
  golden: boolean;
  offerings: OfferingVO[];
}

interface OfferingVO {
  id: string;
  imageBase64: string;
  points: number;
  price: number;
  name: string;
}

interface GodInfoRequest {
  godCode: string;
}

interface GodExtendPeriodRequest {
  godCode: string;
  day: string; // "7" | "30"
}

interface PresentOfferingRequest {
  godCode: string;
  prevOfferingId?: string | null;
  newOfferingId: string;
}
interface CountRequest {
  count: number; // 1 ~ 20
}

interface Lantern {
  id: string;
  name: string;
  subtitle: string;
  iconName: string;
  labelRight: string;
  qaJson: string;
  sort: string;
}

interface LanternBlessingVO {
  name: string;
  message: string;
  createTime: string;
  lanternCode: string;
  blessing: number;
}

interface LanternVO {
  id: string;
  name: string;
  subtitle: string;
  iconName: string;
  labelRight: string;
  qaJson: string;
  sort: string;
  count: number;
}

interface LanternPurchaseInfo {
  name: string;
  birthday: string; // yyyy-MM-dd
  message: string;
}

interface LanternPurchaseRequest {
  userId: string;
  lanternCode: string;
  list: LanternPurchaseInfo[];
}

interface MasterVO {
  id: string;
  name: string;
  gender: string;
  expertise: string;
  photoBase64: string;
  available: boolean;
}

export interface MasterServiceRequest {
  serviceItem: string;
  masterCode: string;
  customerName: string;
  customerLine: string;
  customerEmail: string;
  customerPhone: string;
  note?: string;
}

interface PoeRankVO {
  userName: string;
  count: number;
  createTime: string;
}

interface Poem {
  sequence: string;
  title: string;
  zodiac: string;
  fortune: string;
  poem: string;
  meaning: string;
  dongponote: string;
  bixiannote: string;
  explanation: string;
  sort: string;
}
interface ProductCategoryVO {
  id: string;
  name: string;
  description: string;
}

interface ProductVO {
  id: number;
  name: string;
  originalPrice: number;
  specialPrice: number;
  mainImageUrl: string;
}

interface ProductDetailVO {
  id: number;
  categoryId: string;
  name: string;
  subtitle: string;
  description: string;
  remark: string;
  originalPrice: number;
  specialPrice: number;
  mainImageUrl: string;
  galleryImageUrls: string[];
  detailHtml: string;
  status: boolean;
}

interface ProductListRequest {
  categoryId?: string;
  count?: number;
}

interface BannerAdminVO {
  id: number;
  imageName: string;
  imageBase64: string | null;
  type: string;
  sort: number;
  availableFrom: string;
  availableUntil: string;
  description: string | null;
}

interface MasterAdminVO {
  masterId: string;
  masterName: string;
  isActive: boolean;
  sort: number;
  jobTitle?: string;
  description?: string;
}

interface MasterRequest {
  masterId?: string; // modify 會帶
  masterName: string;
  isActive: boolean;
  sort: number;
  jobTitle?: string;
  description?: string;
}
interface OfferingVO {
  offeringId?: string; // optional for add
  offeringName: string;
  offeringType: string;
  offeringDesc?: string;
  isActive: boolean;
  price: number;
  imageUrl?: string;
  sort: number;
}

interface CreateProductDraftResponse {
  productId: number;
}

interface UploadImageResponse {
  imageUrl: string;
}

interface UploadImageRequest {
  file: File;
  productId: number;
}

interface EditProductRequest {
  productId: number;
  productName: string;
  categoryCode: string;
  description?: string;
  price: number;
  quantity: number;
  sort: number;
  isPublished: boolean;
  imageUrls: string[];
}

interface DiscardProductRequest {
  productId: number;
}

interface DeleteImageRequest {
  productId: number;
  imageUrl: string;
}

interface ProductAdminVO {
  productId: number;
  productName: string;
  categoryCode: string;
  description?: string;
  price: number;
  quantity: number;
  sort: number;
  isPublished: boolean;
  imageUrls: string[];
}

// src/types/admin/reportTypes.ts

interface RecordPeriodRequest {
  startTime: string; // e.g. "2025-07-01T00:00:00"
  endTime: string; // e.g. "2025-07-03T23:59:59"
}

interface RecordVO {
  date: string;
  item: string;
  content: string;
}

interface MasterReservationFilter {
  startDate?: string;
  endDate?: string;
  masterId?: string;
  userName?: string;
}

interface MasterServiceRequestVO {
  id: string;
  userName: string;
  masterName: string;
  serviceType: string;
  reservationTime: string;
  status: string;
}

export interface SystemConfig {
  id?: string;
  configKey: string;
  configValue: string;
}
