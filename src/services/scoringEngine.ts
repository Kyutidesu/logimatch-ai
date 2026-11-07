import { 
  OrderInput, 
  CargoMetrics, 
  ProviderEvaluation, 
  AIModelMetadata, 
  RecommendationResponse,
  PriorityGoal,
  CargoType
} from '../types/logistics';

// Khoảng cách ước tính giữa các trung tâm logistics chính tại Việt Nam (km)
export interface CityHubInfo {
  lat: number;
  lng: number;
  region: 'Bac' | 'Trung' | 'Nam' | 'TayNguyen';
  regionLabel: string;
  specialtyTag: string;
  icon: string;
}

// Danh mục các tỉnh thành và trung tâm logistics hàng đầu tại Việt Nam
export const CITY_COORDINATES: Record<string, CityHubInfo> = {
  // === MIỀN BẮC ===
  'Hà Nội': { 
    lat: 21.0285, lng: 105.8542, region: 'Bac', regionLabel: 'Miền Bắc',
    specialtyTag: 'Đại trung tâm phân phối miền Bắc & Hub hàng không Nội Bài', icon: '🏛️' 
  },
  'Hải Phòng': { 
    lat: 20.8449, lng: 106.6881, region: 'Bac', regionLabel: 'Miền Bắc',
    specialtyTag: 'Cụm Cảng biển quốc tế Đình Vũ, Lạch Huyện & Cát Hải', icon: '🚢' 
  },
  'Bắc Ninh': { 
    lat: 21.1861, lng: 106.0763, region: 'Bac', regionLabel: 'Miền Bắc',
    specialtyTag: 'Thủ phủ công nghiệp điện tử, KCN Yên Phong & VSIP Bắc Ninh', icon: '💻' 
  },
  'Hưng Yên': { 
    lat: 20.6560, lng: 106.0510, region: 'Bac', regionLabel: 'Miền Bắc',
    specialtyTag: 'Đại trung tâm kho vận TMĐT, KCN Thăng Long II & Yên Mỹ', icon: '📦' 
  },
  'Hải Dương': { 
    lat: 20.9373, lng: 106.3146, region: 'Bac', regionLabel: 'Miền Bắc',
    specialtyTag: 'Hành lang công nghiệp liên vùng Hà Nội - Hải Phòng', icon: '🏭' 
  },
  'Quảng Ninh': { 
    lat: 21.0069, lng: 107.2925, region: 'Bac', regionLabel: 'Miền Bắc',
    specialtyTag: 'Cảng nước sâu Cái Lân & Cửa khẩu quốc tế Móng Cái', icon: '⚓' 
  },
  'Lạng Sơn': { 
    lat: 21.8537, lng: 106.7620, region: 'Bac', regionLabel: 'Miền Bắc',
    specialtyTag: 'Cửa khẩu quốc tế Hữu Nghị & Tân Thanh (Xuất nhập khẩu đường bộ TQ)', icon: '🛂' 
  },
  'Vĩnh Phúc': { 
    lat: 21.3090, lng: 105.6049, region: 'Bac', regionLabel: 'Miền Bắc',
    specialtyTag: 'Trung tâm công nghiệp chế tạo cơ khí, ô tô & xe máy', icon: '🚗' 
  },
  'Hà Nam': { 
    lat: 20.5835, lng: 105.9242, region: 'Bac', regionLabel: 'Miền Bắc',
    specialtyTag: 'Cảng cạn ICD Tân Cảng Đồng Văn & Cửa ngõ phía Nam Hà Nội', icon: '🏗️' 
  },
  'Thái Nguyên': { 
    lat: 21.5942, lng: 105.8482, region: 'Bac', regionLabel: 'Miền Bắc',
    specialtyTag: 'Cứ điểm sản xuất công nghệ cao, KCN Yên Bình & Sông Công', icon: '📱' 
  },

  // === MIỀN TRUNG & TÂY NGUYÊN ===
  'Đà Nẵng': { 
    lat: 16.0544, lng: 108.2022, region: 'Trung', regionLabel: 'Miền Trung',
    specialtyTag: 'Cảng biển Tiên Sa, Liên Chiểu & Hub trung chuyển trục Bắc - Nam', icon: '🌊' 
  },
  'Bình Định (Quy Nhơn)': { 
    lat: 13.7820, lng: 109.2194, region: 'Trung', regionLabel: 'Miền Trung',
    specialtyTag: 'Cảng quốc tế Quy Nhơn - Cửa ngõ logistics hướng biển của Tây Nguyên', icon: '🚢' 
  },
  'Khánh Hòa (Nha Trang)': { 
    lat: 12.2388, lng: 109.1967, region: 'Trung', regionLabel: 'Miền Trung',
    specialtyTag: 'Cảng quốc tế Cam Ranh & Hub kho bãi Nam Trung Bộ', icon: '⚓' 
  },
  'Quảng Nam (Chu Lai)': { 
    lat: 15.5394, lng: 108.7067, region: 'Trung', regionLabel: 'Miền Trung',
    specialtyTag: 'Khu kinh tế mở & Cảng biển Chu Lai (Thế mạnh cơ khí ô tô Thaco)', icon: '🚛' 
  },
  'Nghệ An (Vinh)': { 
    lat: 18.6796, lng: 105.6813, region: 'Trung', regionLabel: 'Miền Trung',
    specialtyTag: 'Cảng Cửa Lò & Trung tâm logistics trung chuyển Bắc Trung Bộ', icon: '🏢' 
  },
  'Lâm Đồng (Đà Lạt)': { 
    lat: 11.9404, lng: 108.4583, region: 'TayNguyen', regionLabel: 'Tây Nguyên',
    specialtyTag: 'Thủ phủ chuỗi lạnh: Rau củ quả, hoa tươi & nông sản xuất khẩu', icon: '🥦' 
  },
  'Đắk Lắk (Buôn Ma Thuột)': { 
    lat: 12.6667, lng: 108.0500, region: 'TayNguyen', regionLabel: 'Tây Nguyên',
    specialtyTag: 'Trung tâm giao nhận cà phê, hồ tiêu & nông sản xuất khẩu Tây Nguyên', icon: '☕' 
  },

  // === MIỀN NAM & ĐBSCL ===
  'TP. Hồ Chí Minh': { 
    lat: 10.8231, lng: 106.6297, region: 'Nam', regionLabel: 'Miền Nam',
    specialtyTag: 'Đầu tàu kinh tế, Cụm cảng Cát Lái, Hiệp Phước & Sân bay Tân Sơn Nhất', icon: '🏙️' 
  },
  'Bình Dương': { 
    lat: 11.1600, lng: 106.6500, region: 'Nam', regionLabel: 'Miền Nam',
    specialtyTag: 'Thủ phủ kho bãi Đông Nam Bộ: ICD Sóng Thần, VSIP 1-2-3, Bến Cát', icon: '🏭' 
  },
  'Đồng Nai': { 
    lat: 10.9574, lng: 106.8427, region: 'Nam', regionLabel: 'Miền Nam',
    specialtyTag: 'Cảng cạn ICD Long Bình, KCN Biên Hòa, Nhơn Trạch & Cửa ngõ Long Thành', icon: '🏗️' 
  },
  'Bà Rịa - Vũng Tàu': { 
    lat: 10.5369, lng: 107.0673, region: 'Nam', regionLabel: 'Miền Nam',
    specialtyTag: 'Cụm cảng nước sâu quốc tế Cái Mép - Thị Vải (Tàu mẹ đi Mỹ/Châu Âu)', icon: '🚢' 
  },
  'Long An': { 
    lat: 10.5432, lng: 106.4116, region: 'Nam', regionLabel: 'Miền Nam',
    specialtyTag: 'Cửa ngõ logistics kết nối TP.HCM với ĐBSCL & Cảng Quốc tế Long An', icon: '🌉' 
  },
  'Tây Ninh': { 
    lat: 11.3100, lng: 106.0983, region: 'Nam', regionLabel: 'Miền Nam',
    specialtyTag: 'Cửa khẩu quốc tế Mộc Bài & Xa Mát (Logistics biên mậu Campuchia)', icon: '🛂' 
  },
  'Tiền Giang (Mỹ Tho)': { 
    lat: 10.3600, lng: 106.3600, region: 'Nam', regionLabel: 'Miền Nam',
    specialtyTag: 'Trung tâm phân loại, đóng gói & chuỗi lạnh trái cây xuất khẩu', icon: '🥭' 
  },
  'Cần Thơ': { 
    lat: 10.0452, lng: 105.7469, region: 'Nam', regionLabel: 'Miền Nam',
    specialtyTag: 'Cảng biển Cái Cui & Trung tâm logistics tổng hợp vùng ĐBSCL', icon: '🌾' 
  },
  'Đồng Tháp': { 
    lat: 10.4578, lng: 105.6331, region: 'Nam', regionLabel: 'Miền Nam',
    specialtyTag: 'Cụm logistics thủy sản cá tra xuất khẩu & Cửa khẩu Thường Phước', icon: '🐟' 
  },
  'Kiên Giang (Rạch Giá)': { 
    lat: 10.0125, lng: 105.0809, region: 'Nam', regionLabel: 'Miền Nam',
    specialtyTag: 'Hub vận tải đường biển ven bờ & kết nối đảo ngọc Phú Quốc', icon: '⛵' 
  },
  'Cà Mau': { 
    lat: 9.1769, lng: 105.1500, region: 'Nam', regionLabel: 'Miền Nam',
    specialtyTag: 'Thủ phủ chuỗi lạnh tôm & thủy hải sản đông lạnh xuất khẩu Cực Nam', icon: '🦐' 
  }
};

// Hàm chuẩn hóa tên tỉnh thành tìm kiếm (hỗ trợ alias cũ)
export function resolveCityHub(cityName: string): CityHubInfo | undefined {
  if (CITY_COORDINATES[cityName]) return CITY_COORDINATES[cityName];
  if (cityName === 'Nha Trang') return CITY_COORDINATES['Khánh Hòa (Nha Trang)'];
  if (cityName === 'Vinh') return CITY_COORDINATES['Nghệ An (Vinh)'];
  if (cityName === 'Vũng Tàu') return CITY_COORDINATES['Bà Rịa - Vũng Tàu'];
  if (cityName === 'Quy Nhơn') return CITY_COORDINATES['Bình Định (Quy Nhơn)'];
  if (cityName === 'Chu Lai') return CITY_COORDINATES['Quảng Nam (Chu Lai)'];
  if (cityName === 'Đà Lạt') return CITY_COORDINATES['Lâm Đồng (Đà Lạt)'];
  if (cityName === 'Buôn Ma Thuột') return CITY_COORDINATES['Đắk Lắk (Buôn Ma Thuột)'];
  if (cityName === 'Mỹ Tho') return CITY_COORDINATES['Tiền Giang (Mỹ Tho)'];
  if (cityName === 'Rạch Giá') return CITY_COORDINATES['Kiên Giang (Rạch Giá)'];
  return undefined;
}

// Bảng cự ly đường bộ tham chiếu (km)
const DISTANCE_MATRIX: Record<string, Record<string, number>> = {
  'Hà Nội': {
    'Hà Nội': 25,
    'TP. Hồ Chí Minh': 1720,
    'Đà Nẵng': 765,
    'Hải Phòng': 120,
    'Cần Thơ': 1890,
    'Bình Dương': 1690,
    'Đồng Nai': 1680,
    'Bắc Ninh': 35,
    'Hưng Yên': 45,
    'Hải Dương': 60,
    'Lạng Sơn': 155,
    'Khánh Hòa (Nha Trang)': 1290,
    'Nha Trang': 1290,
    'Nghệ An (Vinh)': 300,
    'Vinh': 300,
    'Quảng Ninh': 160,
    'Bà Rịa - Vũng Tàu': 1740,
    'Vũng Tàu': 1740
  },
  'TP. Hồ Chí Minh': {
    'Hà Nội': 1720,
    'TP. Hồ Chí Minh': 20,
    'Đà Nẵng': 960,
    'Hải Phòng': 1780,
    'Cần Thơ': 170,
    'Bình Dương': 35,
    'Đồng Nai': 40,
    'Long An': 45,
    'Bà Rịa - Vũng Tàu': 95,
    'Vũng Tàu': 105,
    'Tây Ninh': 90,
    'Tiền Giang (Mỹ Tho)': 70,
    'Bắc Ninh': 1740,
    'Khánh Hòa (Nha Trang)': 435,
    'Nha Trang': 435,
    'Nghệ An (Vinh)': 1420,
    'Vinh': 1420,
    'Quảng Ninh': 1820
  },
  'Đà Nẵng': {
    'Hà Nội': 765,
    'TP. Hồ Chí Minh': 960,
    'Đà Nẵng': 20,
    'Hải Phòng': 840,
    'Cần Thơ': 1130,
    'Bình Dương': 930,
    'Đồng Nai': 920,
    'Bắc Ninh': 790,
    'Khánh Hòa (Nha Trang)': 530,
    'Nha Trang': 530,
    'Nghệ An (Vinh)': 470,
    'Vinh': 470,
    'Quảng Ninh': 880,
    'Bà Rịa - Vũng Tàu': 980,
    'Vũng Tàu': 980
  }
};

export function estimateDistanceKm(origin: string, destination: string): number {
  if (origin === destination) return 25; // Nội thành
  if (DISTANCE_MATRIX[origin]?.[destination]) return DISTANCE_MATRIX[origin][destination];
  if (DISTANCE_MATRIX[destination]?.[origin]) return DISTANCE_MATRIX[destination][origin];

  const origCoord = resolveCityHub(origin);
  const destCoord = resolveCityHub(destination);

  if (!origCoord || !destCoord) return 450; // default fallback

  // Haversine formula * 1.35 factor for road detour
  const R = 6371;
  const dLat = ((destCoord.lat - origCoord.lat) * Math.PI) / 180;
  const dLon = ((destCoord.lng - origCoord.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((origCoord.lat * Math.PI) / 180) *
      Math.cos((destCoord.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const directDist = R * c;
  return Math.round(directDist * 1.35);
}

export function calculateCargoMetrics(order: OrderInput): CargoMetrics {
  const singleVolumeM3 = (order.lengthCm * order.widthCm * order.heightCm) / 1_000_000;
  const totalVolumeM3 = singleVolumeM3 * order.quantity;

  // Tiêu chuẩn tính trọng lượng quy đổi đường bộ nội địa VN: (Dài x Rộng x Cao cm) / 5000
  const singleVolumetricWeight = (order.lengthCm * order.widthCm * order.heightCm) / 5000;
  const totalVolumetricWeightKg = singleVolumetricWeight * order.quantity;

  const totalActualWeightKg = order.weightKg * order.quantity;
  const chargeableWeightKg = Math.max(totalActualWeightKg, totalVolumetricWeightKg);

  const densityKgM3 = totalVolumeM3 > 0 ? totalActualWeightKg / totalVolumeM3 : 250;

  const distance = estimateDistanceKm(order.originCity, order.destinationCity);
  
  const origHub = resolveCityHub(order.originCity);
  const destHub = resolveCityHub(order.destinationCity);

  let routeType: CargoMetrics['routeType'] = 'regional';
  
  if (distance <= 45) {
    routeType = 'inner_city';
  } else if (
    (order.originCity.includes('Hồ Chí Minh') && (order.destinationCity.includes('Bình Dương') || order.destinationCity.includes('Đồng Nai') || order.destinationCity.includes('Long An'))) ||
    (order.originCity.includes('Hà Nội') && (order.destinationCity.includes('Bắc Ninh') || order.destinationCity.includes('Hưng Yên') || order.destinationCity.includes('Hải Dương') || order.destinationCity.includes('Vĩnh Phúc')))
  ) {
    routeType = 'industrial_corridor';
  } else if (
    order.originCity.includes('Hải Phòng') || order.destinationCity.includes('Hải Phòng') ||
    order.originCity.includes('Vũng Tàu') || order.destinationCity.includes('Vũng Tàu') ||
    (order.destinationCity.includes('Hồ Chí Minh') && order.originCity.includes('Bình Dương'))
  ) {
    routeType = 'port_corridor';
  } else if (
    distance > 1000 ||
    (origHub?.region === 'Bac' && destHub?.region === 'Nam') ||
    (origHub?.region === 'Nam' && destHub?.region === 'Bac') ||
    (order.originCity.includes('Hồ Chí Minh') && order.destinationCity.includes('Hà Nội')) ||
    (order.originCity.includes('Hà Nội') && order.destinationCity.includes('Hồ Chí Minh'))
  ) {
    routeType = 'north_south_axis';
  }

  return {
    volumeM3: Number(totalVolumeM3.toFixed(3)),
    volumetricWeightKg: Number(totalVolumetricWeightKg.toFixed(1)),
    chargeableWeightKg: Number(chargeableWeightKg.toFixed(1)),
    densityKgM3: Number(densityKgM3.toFixed(1)),
    estimatedDistanceKm: distance,
    routeType
  };
}

// Dữ liệu profile gốc của các nhà cung cấp 3PL hàng đầu
interface Raw3PLProfile {
  id: string;
  name: string;
  shortName: string;
  brandColor: string;
  logo: string;
  baseCostPerTonKm: number; // VNĐ / kg / 100km
  handlingFeeBase: number;
  averageSpeedKmh: number;
  routeReliabilityBias: Record<string, number>; // Điểm đúng hạn theo tuyến
  coldChainTier: 0 | 1 | 2 | 3; // 3: Chuyên gia hàng đầu
  bulkyHandlingTier: 1 | 2 | 3;
  fragileHandlingTier: 1 | 2 | 3;
  techCoverageRating: number;
  ratingBase: number;
  reviewCount: number;
  contactHotline: string;
  fleetDescription: string;
  standardSla: string;
}

const RAW_PROVIDERS: Raw3PLProfile[] = [
  {
    id: 'viettel_post',
    name: 'Viettel Post Logistics',
    shortName: 'Viettel Post',
    brandColor: '#EE0033',
    logo: 'VTP',
    baseCostPerTonKm: 380,
    handlingFeeBase: 45_000,
    averageSpeedKmh: 48,
    routeReliabilityBias: {
      'Hà Nội-TP. Hồ Chí Minh': 99.2,
      'TP. Hồ Chí Minh-Hà Nội': 99.1,
      'TP. Hồ Chí Minh-Đà Nẵng': 98.8,
      'Hà Nội-Đà Nẵng': 98.9,
      'default': 98.4
    },
    coldChainTier: 2,
    bulkyHandlingTier: 3,
    fragileHandlingTier: 3,
    techCoverageRating: 98,
    ratingBase: 4.88,
    reviewCount: 14200,
    contactHotline: '1900 8095',
    fleetDescription: 'Hơn 8.000 xe tải thùng kín, GPS thời gian thực, bưu cục 100% xã phường',
    standardSla: 'Bồi thường 100% giá trị theo hóa đơn trong 24h, hỗ trợ POD số'
  },
  {
    id: 'vnpost',
    name: 'Tổng Công ty Bưu điện Việt Nam (VNPost Logistics)',
    shortName: 'VNPost Logistics',
    brandColor: '#FFB800',
    logo: 'VNPost',
    baseCostPerTonKm: 310,
    handlingFeeBase: 35_000,
    averageSpeedKmh: 42,
    routeReliabilityBias: {
      'Hà Nội-TP. Hồ Chí Minh': 97.6,
      'TP. Hồ Chí Minh-Hà Nội': 97.4,
      'TP. Hồ Chí Minh-Cần Thơ': 98.5,
      'default': 97.2
    },
    coldChainTier: 1,
    bulkyHandlingTier: 3,
    fragileHandlingTier: 2,
    techCoverageRating: 91,
    ratingBase: 4.75,
    reviewCount: 21500,
    contactHotline: '1900 545481',
    fleetDescription: 'Mạng lưới vận chuyển đường sắt và đường bộ lớn nhất VN, xe tải 2.5 - 15 tấn',
    standardSla: 'Cam kết giá cước tiết kiệm nhất thị trường cho hàng trọng lượng lớn'
  },
  {
    id: 'ghtk',
    name: 'Giao Hàng Tiết Kiệm (GHTK Cargo)',
    shortName: 'GHTK Cargo',
    brandColor: '#008848',
    logo: 'GHTK',
    baseCostPerTonKm: 330,
    handlingFeeBase: 38_000,
    averageSpeedKmh: 52,
    routeReliabilityBias: {
      'Hà Nội-Hải Phòng': 99.4,
      'TP. Hồ Chí Minh-Bình Dương': 99.5,
      'Hà Nội-TP. Hồ Chí Minh': 98.1,
      'default': 98.0
    },
    coldChainTier: 1,
    bulkyHandlingTier: 2,
    fragileHandlingTier: 2,
    techCoverageRating: 99,
    ratingBase: 4.82,
    reviewCount: 38900,
    contactHotline: '1900 6092',
    fleetDescription: 'Trung tâm chia chọn tự động hóa 100% bằng robot, app cập nhật từng phút',
    standardSla: 'Giao nhanh liên tỉnh trọng điểm, tối ưu chi phí cho hàng bán lẻ và thương mại điện tử'
  },
  {
    id: 'transimex',
    name: 'Transimex Cold Chain & Logistics',
    shortName: 'Transimex',
    brandColor: '#0284C7',
    logo: 'TMS',
    baseCostPerTonKm: 460,
    handlingFeeBase: 90_000,
    averageSpeedKmh: 49,
    routeReliabilityBias: {
      'TP. Hồ Chí Minh-Hà Nội': 99.5,
      'TP. Hồ Chí Minh-Cần Thơ': 99.4,
      'Cần Thơ-Hà Nội': 99.3,
      'default': 98.9
    },
    coldChainTier: 3,
    bulkyHandlingTier: 2,
    fragileHandlingTier: 3,
    techCoverageRating: 95,
    ratingBase: 4.93,
    reviewCount: 4200,
    contactHotline: '028 3824 4567',
    fleetDescription: 'Chuyên gia chuỗi lạnh: xe tải lạnh -25°C đến +15°C, kho lạnh đạt chuẩn GDP/HACCP',
    standardSla: 'Kiểm soát nhiệt độ liên tục qua cảm biến IoT, bồi hoàn 100% nếu đứt gãy nhiệt độ'
  },
  {
    id: 'dhl_supply',
    name: 'DHL Supply Chain Vietnam',
    shortName: 'DHL Express/Logistics',
    brandColor: '#D40511',
    logo: 'DHL',
    baseCostPerTonKm: 580,
    handlingFeeBase: 120_000,
    averageSpeedKmh: 65, // Bay kết hợp xe chuyên dụng
    routeReliabilityBias: {
      'Hà Nội-TP. Hồ Chí Minh': 99.8,
      'TP. Hồ Chí Minh-Hà Nội': 99.8,
      'default': 99.5
    },
    coldChainTier: 2,
    bulkyHandlingTier: 2,
    fragileHandlingTier: 3,
    techCoverageRating: 99,
    ratingBase: 4.96,
    reviewCount: 8800,
    contactHotline: '1800 1530',
    fleetDescription: 'Đội xe chuẩn quốc tế kết hợp khoang vận tải hàng không chuyên tuyến',
    standardSla: 'SLA hỏa tốc cam kết giờ chính xác, an ninh tối đa cho hàng công nghệ cao và giá trị cao'
  },
  {
    id: 'sotrans',
    name: 'Sotrans Logistics (Kho vận Miền Nam)',
    shortName: 'Sotrans',
    brandColor: '#0F766E',
    logo: 'STR',
    baseCostPerTonKm: 350,
    handlingFeeBase: 70_000,
    averageSpeedKmh: 44,
    routeReliabilityBias: {
      'TP. Hồ Chí Minh-Đà Nẵng': 98.7,
      'Hà Nội-Hải Phòng': 99.1,
      'default': 98.2
    },
    coldChainTier: 1,
    bulkyHandlingTier: 3,
    fragileHandlingTier: 2,
    techCoverageRating: 92,
    ratingBase: 4.81,
    reviewCount: 6500,
    contactHotline: '028 3829 0447',
    fleetDescription: 'Chuyên gia hàng container, xe đầu kéo tải trọng 30 tấn, hệ thống cảng cạn ICD',
    standardSla: 'Thế mạnh hàng nặng, máy móc công nghiệp, thiết bị dự án siêu trọng'
  },
  {
    id: 'kerry_logistics',
    name: 'Kerry Logistics Vietnam',
    shortName: 'Kerry Express',
    brandColor: '#EA580C',
    logo: 'KRY',
    baseCostPerTonKm: 395,
    handlingFeeBase: 50_000,
    averageSpeedKmh: 50,
    routeReliabilityBias: {
      'Hà Nội-TP. Hồ Chí Minh': 98.9,
      'Bắc Ninh-TP. Hồ Chí Minh': 99.0,
      'Bình Dương-Đà Nẵng': 98.8,
      'default': 98.5
    },
    coldChainTier: 2,
    bulkyHandlingTier: 3,
    fragileHandlingTier: 3,
    techCoverageRating: 96,
    ratingBase: 4.86,
    reviewCount: 9700,
    contactHotline: '1900 6966',
    fleetDescription: 'Trung tâm logistics đạt chuẩn ISO, xe tải phân phối hiện đại theo chuẩn tập đoàn quốc tế',
    standardSla: 'Tỷ lệ đúng hạn ổn định tuyến liên vùng, hỗ trợ quản lý chuỗi cung ứng B2B'
  },
  {
    id: 'jt_cargo',
    name: 'J&T Cargo Vietnam',
    shortName: 'J&T Cargo',
    brandColor: '#E11D48',
    logo: 'J&T',
    baseCostPerTonKm: 340,
    handlingFeeBase: 40_000,
    averageSpeedKmh: 47,
    routeReliabilityBias: {
      'TP. Hồ Chí Minh-Hà Nội': 98.2,
      'Hà Nội-Đà Nẵng': 98.0,
      'default': 97.9
    },
    coldChainTier: 1,
    bulkyHandlingTier: 3,
    fragileHandlingTier: 2,
    techCoverageRating: 94,
    ratingBase: 4.79,
    reviewCount: 16400,
    contactHotline: '1900 1088',
    fleetDescription: 'Đội xe tải phân khối lớn nhận hàng tận kho, hỗ trợ đa dạng mặt hàng cồng kềnh',
    standardSla: 'Giá cước bậc thang ưu đãi cho sản lượng lớn, chiết khấu trực tiếp'
  }
];

// Mô phỏng AI Model Inference Engine (mô phỏng mô hình ML đã train .pkl / .h5)
export function evaluate3PLWithAIModel(order: OrderInput, metrics: CargoMetrics): ProviderEvaluation[] {
  const routeKey = `${order.originCity}-${order.destinationCity}`;
  const isColdRequired = order.cargoType === 'perishable' || order.specialRequirements.coldChain;
  const isBulky = order.cargoType === 'bulky' || metrics.chargeableWeightKg > 400;
  const isFragileOrHighValue = order.cargoType === 'fragile_chemicals' || order.cargoType === 'electronics' || order.cargoType === 'high_value';

  const evaluated: ProviderEvaluation[] = RAW_PROVIDERS.map(provider => {
    // 1. Tỷ lệ đúng hạn tuyến này (Route On-Time Rate)
    const routeReliability = provider.routeReliabilityBias[routeKey] || 
                             provider.routeReliabilityBias['default'] || 
                             98.0;

    // 2. Tính toán cước phí ước tính (VND)
    // Cước cơ bản = Phí mở cửa + (Trọng lượng tính cước kg * Đơn giá cước theo cự ly)
    const distance100Km = Math.max(0.3, metrics.estimatedDistanceKm / 100);
    
    // Đơn giá tính theo kg giảm dần theo trọng lượng (tính chất logistics quy mô)
    let ratePerKgPer100Km = provider.baseCostPerTonKm / 10; // ~31 - 58 VND / kg / 100km
    if (metrics.chargeableWeightKg < 10) {
      ratePerKgPer100Km *= 2.2; // Gói nhỏ chi phí quản lý bưu kiện cao hơn
    } else if (metrics.chargeableWeightKg > 500) {
      ratePerKgPer100Km *= 0.75; // Hàng lô / pallet chiết khấu
    }

    let baseRate = 45_000 + (metrics.chargeableWeightKg * ratePerKgPer100Km * distance100Km);
    
    // Phụ phí bốc xếp và xử lý đặc thù
    let specialHandling = provider.handlingFeeBase;
    if (isColdRequired) {
      specialHandling += 150_000;
      baseRate *= 1.25; // Chi phí làm lạnh
    }
    if (isBulky) {
      specialHandling += 180_000;
    }
    if (order.specialRequirements.liftingSupport) {
      specialHandling += 150_000;
    }

    // Phụ phí nhiên liệu (10%)
    const fuelSurcharge = Math.round(baseRate * 0.10);

    // Bảo hiểm hàng hóa
    let insurance = 0;
    if (order.specialRequirements.cargoInsurance || isFragileOrHighValue) {
      const declaredValue = order.declaredValueVnd || Math.max(5_000_000, metrics.chargeableWeightKg * 300_000);
      insurance = Math.round(declaredValue * 0.003); // 0.3%
      insurance = Math.max(insurance, 30_000);
    }

    const subTotal = baseRate + fuelSurcharge + specialHandling + insurance;
    const vat = Math.round(subTotal * 0.08); // VAT 8%
    const totalCostVnd = Math.round((subTotal + vat) / 1000) * 1000;

    // 3. Thời gian giao hàng (Lead Time Hours)
    let transitHours = Math.round(metrics.estimatedDistanceKm / provider.averageSpeedKmh);
    if (metrics.estimatedDistanceKm > 1000) {
      transitHours += 12; // Luân chuyển hub liên miền
    } else if (metrics.estimatedDistanceKm > 200) {
      transitHours += 5;
    } else {
      transitHours += 2;
    }

    if (order.specialRequirements.expressDelivery && provider.id === 'dhl_supply') {
      transitHours = 18; // Đường bay kết nối hỏa tốc
    } else if (order.specialRequirements.expressDelivery && (provider.id === 'viettel_post' || provider.id === 'ghtk')) {
      transitHours = Math.min(transitHours, 28);
    }

    let deliveryTimeText = `${transitHours} - ${transitHours + 6} giờ`;
    if (transitHours > 48) {
      const days = Math.round(transitHours / 24);
      deliveryTimeText = `${days} - ${days + 1} ngày`;
    }

    // 4. Feature Scoring (Tương đương output tensor của model ML .pkl / .h5)
    const onTimeScore = routeReliability; // 97 - 99.8

    // Chi phí điểm số (chuẩn hóa tương đối theo chi phí thị trường)
    // Thị trường trung bình
    const avgMarketRate = 50_000 + (metrics.chargeableWeightKg * 38 * distance100Km);
    const costRatio = totalCostVnd / Math.max(avgMarketRate, 50_000);
    let costScore = Math.round(100 - (costRatio - 0.75) * 55);
    costScore = Math.max(45, Math.min(99, costScore));

    // Fleet capacity score
    let fleetCapacityScore = 85;
    if (isBulky && provider.bulkyHandlingTier === 3) fleetCapacityScore = 98;
    if (isColdRequired) {
      fleetCapacityScore = provider.coldChainTier === 3 ? 99 : (provider.coldChainTier === 2 ? 80 : 35);
    }

    // Safety score
    let safetyScore = 90;
    if (provider.id === 'dhl_supply') safetyScore = 99.5;
    if (provider.id === 'transimex' && isColdRequired) safetyScore = 99.0;
    if (provider.fragileHandlingTier === 3) safetyScore = Math.max(safetyScore, 95);

    // Tech coverage score
    const techCoverageScore = provider.techCoverageRating;

    // Điểm tốc độ giao hàng (transit speed score: càng ít giờ càng cao)
    const baselineHours = metrics.estimatedDistanceKm > 1000 ? 52 : (metrics.estimatedDistanceKm > 300 ? 28 : 8);
    const speedScore = Math.max(40, Math.min(100, Math.round(100 - ((transitHours - 16) / Math.max(12, baselineHours)) * 45)));

    // 5. Tính Composite Match Score dựa trên User Priority
    // Trọng số mô hình Machine Learning:
    let wTime = 0.28;
    let wCost = 0.28;
    let wFleet = 0.16;
    let wSafety = 0.16;
    let wTech = 0.12;

    let priorityAdjustedScore = 0;

    switch (order.priority) {
      case 'speed':
        // Ưu tiên tốc độ: on-time 30%, tốc độ giao nhanh (lead time) 35%, fleet 15%, safety 10%, cost 10%
        priorityAdjustedScore = (
          onTimeScore * 0.30 +
          speedScore * 0.35 +
          fleetCapacityScore * 0.15 +
          safetyScore * 0.10 +
          costScore * 0.10
        );
        break;
      case 'cost':
        // Ưu tiên giá rẻ: chi phí 50%, đúng hạn 20%, fleet 15%, an toàn 10%, tech 5%
        priorityAdjustedScore = (
          costScore * 0.50 +
          onTimeScore * 0.20 +
          fleetCapacityScore * 0.15 +
          safetyScore * 0.10 +
          techCoverageScore * 0.05
        );
        break;
      case 'reliability':
        priorityAdjustedScore = (
          safetyScore * 0.35 +
          onTimeScore * 0.35 +
          fleetCapacityScore * 0.15 +
          techCoverageScore * 0.10 +
          costScore * 0.05
        );
        break;
      case 'balanced':
      default:
        priorityAdjustedScore = (
          onTimeScore * 0.28 +
          costScore * 0.28 +
          fleetCapacityScore * 0.18 +
          safetyScore * 0.14 +
          techCoverageScore * 0.12
        );
        break;
    }

    // Phạt nghiêm ngặt nếu đơn yêu cầu kho lạnh mà 3PL không đáp ứng
    let penalty = 0;
    if (isColdRequired && provider.coldChainTier < 2) {
      penalty += 35; // Rớt đài nếu không có chuỗi lạnh
    }

    let rawScore = priorityAdjustedScore - penalty;
    const matchScore = Number(Math.max(10, Math.min(99.4, rawScore)).toFixed(1));

    // 6. Xây dựng lý do gợi ý nổi bật (Main Reason) theo yêu cầu bài toán
    // Ví dụ mẫu: "Được gợi ý vì tỷ lệ đúng hạn cao cho tuyến này"
    let mainReason = `Được gợi ý vì tỷ lệ đúng hạn cao cho tuyến ${order.originCity} - ${order.destinationCity} (đạt ${routeReliability.toFixed(1)}%)`;

    if (order.priority === 'cost' && costScore >= 88) {
      mainReason = `Được gợi ý vì tối ưu chi phí tốt nhất cho tuyến này, tiết kiệm cước vượt trội`;
    } else if (order.priority === 'speed' && transitHours <= 28) {
      mainReason = `Được gợi ý vì thời gian vận chuyển nhanh nhất (${deliveryTimeText}) với cam kết hỏa tốc`;
    } else if (isColdRequired && provider.coldChainTier === 3) {
      mainReason = `Được gợi ý vì sở hữu chuỗi vận tải lạnh đạt chuẩn GDP/HACCP và tỷ lệ đúng hạn ${routeReliability.toFixed(1)}%`;
    } else if (isBulky && provider.bulkyHandlingTier === 3) {
      mainReason = `Được gợi ý vì năng lực đội xe siêu tải và trạm hạ nâng chuyên dụng cho hàng cồng kềnh`;
    } else if (routeReliability >= 99.0) {
      mainReason = `Được gợi ý vì tỷ lệ đúng hạn cao cho tuyến này (${routeReliability.toFixed(1)}%) cùng độ an toàn 99.2%`;
    }

    // Điểm mạnh chi tiết
    const strengths: string[] = [
      `Tỷ lệ giao hàng đúng hẹn tuyến đạt ${routeReliability.toFixed(1)}%`,
      `Đội xe chuyên trách ${provider.fleetDescription.split(',')[0]}`,
      provider.standardSla
    ];

    if (techCoverageScore >= 97) {
      strengths.push('Hệ thống API Tracking thời gian thực & thông báo Telegram/Zalo');
    }

    const limitations: string[] = [];
    if (costScore < 60) {
      limitations.push('Đơn giá cước thuộc phân khúc cao cấp');
    }
    if (transitHours > 48) {
      limitations.push('Thời gian trung chuyển đường bộ tiêu chuẩn (không hỏa tốc)');
    }
    if (provider.coldChainTier < 2 && !isColdRequired) {
      limitations.push('Chưa hỗ trợ bảo quản đông lạnh sâu');
    }

    return {
      id: provider.id,
      name: provider.name,
      shortName: provider.shortName,
      brandColor: provider.brandColor,
      logo: provider.logo,
      badge: 'standard',
      badgeLabel: 'Đối tác tin cậy',
      matchScore,
      rating: provider.ratingBase,
      reviewCount: provider.reviewCount,
      mainReason,
      cost: {
        baseRate: Math.round(baseRate),
        fuelSurcharge,
        specialHandling,
        insurance,
        vat,
        totalVnd: totalCostVnd
      },
      deliveryTimeHours: transitHours,
      deliveryTimeText,
      scores: {
        onTimeRate: Number(onTimeScore.toFixed(1)),
        costScore: Number(costScore.toFixed(1)),
        fleetCapacityScore: Number(fleetCapacityScore.toFixed(1)),
        safetyScore: Number(safetyScore.toFixed(1)),
        techCoverageScore: Number(techCoverageScore.toFixed(1))
      },
      strengths,
      limitations,
      fleetHighlights: provider.fleetDescription,
      slaCommitment: provider.standardSla,
      contactHotline: provider.contactHotline
    };
  });

  // Sắp xếp theo matchScore giảm dần
  evaluated.sort((a, b) => b.matchScore - a.matchScore);

  // Gán nhãn Badge cho Top 3 nhà cung cấp
  if (evaluated.length >= 1) {
    evaluated[0].badge = 'best_choice';
    evaluated[0].badgeLabel = 'Top 1 - Phù hợp nhất';
  }
  if (evaluated.length >= 2) {
    // Tìm đơn vị có chi phí rẻ nhất trong top để gán badge Best Price nếu phù hợp, hoặc gán cho top 2
    const cheapest = [...evaluated].slice(0, 3).sort((a, b) => a.cost.totalVnd - b.cost.totalVnd)[0];
    if (cheapest && cheapest.id !== evaluated[0].id) {
      cheapest.badge = 'best_price';
      cheapest.badgeLabel = 'Top 2 - Giá tốt nhất';
    } else {
      evaluated[1].badge = 'best_price';
      evaluated[1].badgeLabel = 'Top 2 - Giá tốt nhất';
    }
  }
  if (evaluated.length >= 3) {
    const fastest = [...evaluated].slice(0, 3).sort((a, b) => a.deliveryTimeHours - b.deliveryTimeHours)[0];
    const candidate = evaluated[2];
    if (fastest && fastest.id !== evaluated[0].id && fastest.badge === 'standard') {
      fastest.badge = 'fastest';
      fastest.badgeLabel = 'Top 3 - Tốc độ cao';
    } else {
      candidate.badge = 'fastest';
      candidate.badgeLabel = 'Top 3 - Tốc độ cao';
    }
  }

  return evaluated;
}

// Trả về thông tin chi tiết của mô hình AI Scoring (.pkl / .h5)
export function getAIModelMetadata(order: OrderInput, metrics: CargoMetrics): AIModelMetadata {
  return {
    modelName: '3pl_scoring_ensemble_xgboost_v2.4.pkl',
    fileFormat: 'pkl',
    version: '2.4.19 (Weights checksum: a8f9c1e7)',
    framework: 'Scikit-learn / XGBoost + TensorFlow Embedding',
    featuresUsed: 14,
    testAccuracy: 96.8,
    latencyMs: 38,
    featureWeights: [
      {
        featureName: 'route_on_time_historical',
        description: 'Tỷ lệ đúng hạn lịch sử trên tuyến cụ thể',
        weight: 0.36,
        shapValue: +0.28,
        impact: 'positive'
      },
      {
        featureName: 'total_cost_efficiency_ratio',
        description: 'Tỷ suất chi phí / giá tham chiếu thị trường',
        weight: 0.28,
        shapValue: order.priority === 'cost' ? +0.35 : +0.18,
        impact: 'positive'
      },
      {
        featureName: 'cargo_specialization_fit',
        description: 'Độ khớp phân loại hàng (Lạnh/Cồng kềnh/Điện tử)',
        weight: 0.18,
        shapValue: +0.21,
        impact: 'positive'
      },
      {
        featureName: 'fleet_availability_hub_capacity',
        description: 'Năng lực điều xe và phân loại bưu cục tại điểm gửi/nhận',
        weight: 0.12,
        shapValue: +0.14,
        impact: 'positive'
      },
      {
        featureName: 'damage_loss_claims_rate',
        description: 'Tỷ lệ khiếu nại thất thoát / hư hỏng hàng',
        weight: 0.06,
        shapValue: -0.05,
        impact: 'negative'
      }
    ],
    inputVectorPreview: {
      'x0_volumetric_weight_kg': metrics.volumetricWeightKg,
      'x1_chargeable_weight_kg': metrics.chargeableWeightKg,
      'x2_density_kg_m3': metrics.densityKgM3,
      'x3_route_distance_km': metrics.estimatedDistanceKm,
      'x4_cargo_type_encoded': order.cargoType,
      'x5_priority_weight_cost': order.priority === 'cost' ? 1.0 : (order.priority === 'balanced' ? 0.5 : 0.2),
      'x6_priority_weight_speed': order.priority === 'speed' ? 1.0 : (order.priority === 'balanced' ? 0.5 : 0.2),
      'x7_cold_chain_flag': order.cargoType === 'perishable' || order.specialRequirements.coldChain ? 1 : 0,
      'x8_fragile_insurance_flag': order.specialRequirements.cargoInsurance ? 1 : 0
    }
  };
}

export function generateDispatcherInsight(
  order: OrderInput, 
  metrics: CargoMetrics, 
  topProvider: ProviderEvaluation
): string {
  const routeDesc = `${order.originCity} ➔ ${order.destinationCity} (cự ly ~${metrics.estimatedDistanceKm} km)`;
  const cargoDesc = `${order.cargoType.toUpperCase()} - trọng lượng tính cước ${metrics.chargeableWeightKg} kg`;
  
  let reasonDetail = topProvider.mainReason;
  let operationalAdvice = 'Kiểm tra niêm phong seal và đối chiếu phiếu cân đo kích thước trước khi bàn giao xe.';
  
  if (order.specialRequirements.coldChain || order.cargoType === 'perishable') {
    operationalAdvice = 'Yêu cầu tài xế kích hoạt máy lạnh thùng xe đạt dải nhiệt độ tiêu chuẩn trước khi xếp hàng 30 phút.';
  } else if (order.specialRequirements.expressDelivery || order.priority === 'speed') {
    operationalAdvice = 'Ưu tiên xếp hàng tại kho trung chuyển để kịp chuyến bay / xe liên tỉnh chuyến sớm nhất trong ngày.';
  } else if (order.cargoType === 'fragile' || order.cargoType === 'electronics') {
    operationalAdvice = 'Đóng gói màng xốp khí bóng khí 3 lớp, chèn góc mút xốp chống va đập và dán nhãn Hàng Dễ Vỡ song ngữ.';
  } else if (order.cargoType === 'bulky') {
    operationalAdvice = 'Sắp xếp xe cẩu chuyên dụng hoặc xe nâng hạ tải trọng lớn tại cả điểm bốc và điểm dỡ hàng.';
  }

  return `Phân tích tuyến: ${routeDesc} với mặt hàng ${cargoDesc}. Đề xuất tối ưu nhất là ${topProvider.name} (Điểm Match: ${topProvider.matchScore}/100, giao trong ${topProvider.deliveryTimeText}). ${reasonDetail} Khuyến nghị vận hành: ${operationalAdvice}`;
}

export function runFullRecommendationPipeline(order: OrderInput): RecommendationResponse {
  const metrics = calculateCargoMetrics(order);
  const allRanked = evaluate3PLWithAIModel(order, metrics);
  const top3 = allRanked.slice(0, 3);
  const modelInfo = getAIModelMetadata(order, metrics);
  const top1 = top3[0];

  const insight = top1 
    ? generateDispatcherInsight(order, metrics, top1)
    : `Hệ thống mô hình AI scoring đã trích xuất 14 đặc trưng từ đơn hàng (cự ly ${metrics.estimatedDistanceKm}km, trọng lượng tính cước ${metrics.chargeableWeightKg}kg).`;

  return {
    success: true,
    orderMetrics: metrics,
    topProviders: top3,
    allProviders: allRanked,
    modelInfo,
    aiAnalysisSummary: insight
  };
}
