export type CargoType = 
  | 'fmcg' 
  | 'electronics' 
  | 'perishable' 
  | 'bulky' 
  | 'high_value' 
  | 'fragile_chemicals';

export type PriorityGoal = 'cost' | 'speed' | 'balanced' | 'reliability';

export interface SpecialRequirements {
  coldChain?: boolean;
  cargoInsurance?: boolean;
  expressDelivery?: boolean;
  liftingSupport?: boolean;
  cod?: boolean;
}

export interface OrderInput {
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  weightKg: number;
  quantity: number;
  cargoType: CargoType;
  originCity: string;
  destinationCity: string;
  originDistrict?: string;
  destinationDistrict?: string;
  priority: PriorityGoal;
  specialRequirements: SpecialRequirements;
  declaredValueVnd?: number;
  notes?: string;
}

export interface CargoMetrics {
  volumeM3: number;
  volumetricWeightKg: number;
  chargeableWeightKg: number;
  densityKgM3: number;
  estimatedDistanceKm: number;
  routeType: 'inner_city' | 'regional' | 'north_south_axis' | 'cross_border' | 'industrial_corridor' | 'port_corridor';
}

export interface ScoreBreakdown {
  onTimeRate: number;      // 0 - 100
  costScore: number;       // 0 - 100
  fleetCapacityScore: number; // 0 - 100
  safetyScore: number;     // 0 - 100
  techCoverageScore: number; // 0 - 100
}

export interface CostBreakdown {
  baseRate: number;
  fuelSurcharge: number;
  specialHandling: number;
  insurance: number;
  vat: number;
  totalVnd: number;
}

export interface ProviderEvaluation {
  id: string;
  name: string;
  shortName: string;
  brandColor: string;
  logo: string;
  badge: 'best_choice' | 'best_price' | 'fastest' | 'safest' | 'standard';
  badgeLabel: string;
  matchScore: number; // 0 - 100
  rating: number; // e.g. 4.9
  reviewCount: number;
  
  // Specific required highlight:
  mainReason: string; // e.g. "Được gợi ý vì tỷ lệ đúng hạn cao cho tuyến này"
  
  cost: CostBreakdown;
  deliveryTimeHours: number;
  deliveryTimeText: string;
  scores: ScoreBreakdown;
  strengths: string[];
  limitations: string[];
  fleetHighlights: string;
  slaCommitment: string;
  contactHotline: string;
}

export interface AIModelMetadata {
  modelName: string;
  fileFormat: 'pkl' | 'h5';
  version: string;
  framework: string;
  featuresUsed: number;
  testAccuracy: number;
  latencyMs: number;
  featureWeights: {
    featureName: string;
    description: string;
    weight: number;
    shapValue: number;
    impact: 'positive' | 'negative' | 'neutral';
  }[];
  inputVectorPreview: Record<string, number | string>;
}

export interface RecommendationResponse {
  success: boolean;
  orderMetrics: CargoMetrics;
  topProviders: ProviderEvaluation[];
  allProviders: ProviderEvaluation[];
  modelInfo: AIModelMetadata;
  aiAnalysisSummary?: string;
}

export interface WaybillBooking {
  waybillCode: string;
  createdAt: string;
  order: OrderInput;
  provider: ProviderEvaluation;
  status: 'confirmed' | 'dispatched' | 'in_transit' | 'delivered';
  pickupEta: string;
  deliveryEta: string;
  driverName: string;
  truckPlate: string;
}
