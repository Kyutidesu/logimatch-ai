import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  calculateCargoMetrics, 
  evaluate3PLWithAIModel, 
  estimateDistanceKm,
  runFullRecommendationPipeline 
} from './scoringEngine';
import { OrderInput } from '../types/logistics';

test('calculateCargoMetrics computes volumetric and chargeable weight accurately', () => {
  const sampleOrder: OrderInput = {
    lengthCm: 100,
    widthCm: 50,
    heightCm: 50, // 100 * 50 * 50 = 250,000 cm3 = 0.25 m3
    weightKg: 20, // 20 kg actual
    quantity: 2,
    cargoType: 'fmcg',
    originCity: 'Hà Nội',
    destinationCity: 'TP. Hồ Chí Minh',
    priority: 'balanced',
    specialRequirements: {}
  };

  const metrics = calculateCargoMetrics(sampleOrder);
  // Volume: 0.25 * 2 = 0.5 m3
  assert.equal(metrics.volumeM3, 0.5);
  // Volumetric weight: (250000 / 5000) * 2 = 50 * 2 = 100 kg
  assert.equal(metrics.volumetricWeightKg, 100);
  // Chargeable weight: max(20 * 2 = 40kg, 100kg) = 100kg
  assert.equal(metrics.chargeableWeightKg, 100);
  // Distance Hà Nội - TP.HCM
  assert.equal(metrics.estimatedDistanceKm, 1720);
  assert.equal(metrics.routeType, 'north_south_axis');
});

test('estimateDistanceKm returns 25 for same-city delivery', () => {
  const dist = estimateDistanceKm('Hà Nội', 'Hà Nội');
  assert.equal(dist, 25);
});

test('cold chain requirement prioritizes cold chain specialist (Transimex) over non-cold providers', () => {
  const coldOrder: OrderInput = {
    lengthCm: 60,
    widthCm: 40,
    heightCm: 40,
    weightKg: 30,
    quantity: 10,
    cargoType: 'perishable', // Thủy hải sản lạnh
    originCity: 'Cần Thơ',
    destinationCity: 'Hà Nội',
    priority: 'reliability',
    specialRequirements: {
      coldChain: true
    }
  };

  const pipelineResult = runFullRecommendationPipeline(coldOrder);
  assert.equal(pipelineResult.topProviders.length, 3);
  
  // Transimex has tier 3 cold chain capability and should rank in Top 3 with high score
  const top1 = pipelineResult.topProviders[0];
  assert.ok(top1.matchScore > 85, `Top 1 score should be high, got ${top1.matchScore}`);
  assert.ok(
    top1.id === 'transimex' || top1.scores.fleetCapacityScore >= 80,
    'Top recommendation should have strong fleet/cold chain capacity'
  );
  // Check that mainReason mentions reasons explicitly
  assert.ok(top1.mainReason.length > 10);
  assert.match(top1.mainReason, /Được gợi ý/);
});

test('speed priority ranks fastest express provider higher than standard heavy providers', () => {
  const expressOrder: OrderInput = {
    lengthCm: 30,
    widthCm: 20,
    heightCm: 15,
    weightKg: 2,
    quantity: 1,
    cargoType: 'electronics',
    originCity: 'Hà Nội',
    destinationCity: 'TP. Hồ Chí Minh',
    priority: 'speed',
    specialRequirements: {
      expressDelivery: true
    }
  };

  const result = runFullRecommendationPipeline(expressOrder);
  assert.equal(result.topProviders.length, 3);
  // In speed priority, providers with lowest delivery time hours should rank near top
  const top1 = result.topProviders[0];
  assert.ok(top1.matchScore >= 90);
  assert.ok(top1.deliveryTimeHours <= 36);
});

test('cost priority elevates cost-effective providers with best price badges', () => {
  const budgetOrder: OrderInput = {
    lengthCm: 50,
    widthCm: 40,
    heightCm: 30,
    weightKg: 50,
    quantity: 4,
    cargoType: 'fmcg',
    originCity: 'TP. Hồ Chí Minh',
    destinationCity: 'Đà Nẵng',
    priority: 'cost',
    specialRequirements: {}
  };

  const result = runFullRecommendationPipeline(budgetOrder);
  assert.equal(result.topProviders.length, 3);
  // Should have badges assigned properly
  const badges = result.topProviders.map(p => p.badge);
  assert.ok(badges.includes('best_choice'));
  assert.ok(result.modelInfo.featuresUsed > 0);
  assert.equal(result.modelInfo.fileFormat, 'pkl');
});

test('specialized logistics hubs calculate realistic distances and appropriate corridor types', () => {
  // Route from Binh Duong ICD to Ba Ria - Vung Tau Cai Mep Port (port corridor)
  const portOrder: OrderInput = {
    lengthCm: 120,
    widthCm: 100,
    heightCm: 150,
    weightKg: 400,
    quantity: 2,
    cargoType: 'bulky',
    originCity: 'Bình Dương',
    destinationCity: 'Bà Rịa - Vũng Tàu',
    priority: 'balanced',
    specialRequirements: {}
  };
  const portMetrics = calculateCargoMetrics(portOrder);
  assert.ok(portMetrics.estimatedDistanceKm > 60 && portMetrics.estimatedDistanceKm < 160);
  assert.equal(portMetrics.routeType, 'port_corridor');

  // Border gate route: Ha Noi to Lang Son Huu Nghi Border Gate
  const borderOrder: OrderInput = {
    lengthCm: 50,
    widthCm: 40,
    heightCm: 30,
    weightKg: 20,
    quantity: 5,
    cargoType: 'fmcg',
    originCity: 'Hà Nội',
    destinationCity: 'Lạng Sơn',
    priority: 'speed',
    specialRequirements: {}
  };
  const borderMetrics = calculateCargoMetrics(borderOrder);
  assert.ok(borderMetrics.estimatedDistanceKm >= 140 && borderMetrics.estimatedDistanceKm <= 180);
});
