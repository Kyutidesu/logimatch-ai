import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { 
  runFullRecommendationPipeline, 
  getAIModelMetadata, 
  calculateCargoMetrics 
} from './src/services/scoringEngine.ts';
import { OrderInput, WaybillBooking } from './src/types/logistics.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// API: Lấy kết quả chấm điểm & gợi ý Top 3 nhà cung cấp 3PL
app.post('/api/recommend-3pl', async (req: Request, res: Response) => {
  try {
    const orderInput: OrderInput = req.body;

    // Validate inputs
    if (!orderInput.originCity || !orderInput.destinationCity) {
      return res.status(400).json({
        success: false,
        error: 'Vui lòng cung cấp điểm đi (originCity) và điểm đến (destinationCity).'
      });
    }

    if (!orderInput.lengthCm || !orderInput.widthCm || !orderInput.heightCm || !orderInput.weightKg) {
      return res.status(400).json({
        success: false,
        error: 'Vui lòng cung cấp đầy đủ kích thước (Dài x Rộng x Cao) và khối lượng kiện hàng.'
      });
    }

    // Chạy mô hình AI Scoring Pipeline (.pkl / .h5 decision engine)
    const pipelineResult = runFullRecommendationPipeline(orderInput);

    // Tùy chọn: Nếu có GEMINI_API_KEY hợp lệ, bổ sung phân tích chuyên sâu của AI Dispatcher
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.length > 20) {
      try {
        const ai = new GoogleGenAI();
        const top1 = pipelineResult.topProviders[0];
        const prompt = `Bạn là chuyên gia cố vấn logistics cao cấp tại Việt Nam.
Thông tin đơn hàng:
- Tuyến đường: ${orderInput.originCity} -> ${orderInput.destinationCity} (cự ly ${pipelineResult.orderMetrics.estimatedDistanceKm} km).
- Hàng hóa: ${orderInput.cargoType}, Trọng lượng tính cước: ${pipelineResult.orderMetrics.chargeableWeightKg} kg, Thể tích: ${pipelineResult.orderMetrics.volumeM3} m3.
- Tiêu chí ưu tiên: ${orderInput.priority}.
Mô hình AI Scoring (.pkl) đã chọn Top 1 là: ${top1.name} (Điểm Match: ${top1.matchScore}/100, Lý do: ${top1.mainReason}, Cước: ${top1.cost.totalVnd.toLocaleString('vi-VN')} đ, Giao trong: ${top1.deliveryTimeText}).

Hãy viết 2-3 câu ngắn gọn phân tích vì sao đối tác này là tối ưu nhất cho tuyến này, và lưu ý vận hành (đóng gói/kiểm tra) cho chủ hàng.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        if (response.text) {
          pipelineResult.aiAnalysisSummary = response.text.trim();
        }
      } catch (geminiError) {
        // Fallback gracefully to scoring engine summary
        console.warn('Gemini optional enrichment skipped:', geminiError);
      }
    }

    res.json(pipelineResult);
  } catch (error: any) {
    console.error('Lỗi tính toán mô hình AI Scoring:', error);
    res.status(500).json({
      success: false,
      error: 'Không thể xử lý yêu cầu chấm điểm 3PL: ' + (error?.message || 'Lỗi hệ thống')
    });
  }
});

// API: Lấy thông tin metadata mô hình Machine Learning (.pkl / .h5)
app.get('/api/model-info', (req: Request, res: Response) => {
  const defaultOrder: OrderInput = {
    lengthCm: 80,
    widthCm: 60,
    heightCm: 50,
    weightKg: 45,
    quantity: 1,
    cargoType: 'fmcg',
    originCity: 'Hà Nội',
    destinationCity: 'TP. Hồ Chí Minh',
    priority: 'balanced',
    specialRequirements: {}
  };
  const metrics = calculateCargoMetrics(defaultOrder);
  const info = getAIModelMetadata(defaultOrder, metrics);
  res.json({ success: true, modelInfo: info });
});

// API: Tạo vận đơn điện tử mô phỏng khi người dùng bấm "Đặt đơn ngay"
app.post('/api/create-waybill', (req: Request, res: Response) => {
  const { order, provider } = req.body;
  if (!order || !provider) {
    return res.status(400).json({ success: false, error: 'Thiếu dữ liệu đơn hàng hoặc nhà cung cấp.' });
  }

  const prefix = provider.logo || '3PL';
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const waybillCode = `${prefix}-${new Date().getFullYear()}-${randomSuffix}`;

  const driverNames = ['Nguyễn Văn Tuấn', 'Trần Hữu Nam', 'Lê Quốc Bảo', 'Phạm Minh Đức', 'Hoàng Thái Sơn'];
  const truckPlates = ['29C-845.22', '51D-932.18', '43C-651.90', '60B-782.11', '65C-452.33'];

  const now = new Date();
  const pickupTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours later
  const deliveryHours = provider.deliveryTimeHours || 24;
  const deliveryTime = new Date(now.getTime() + (deliveryHours + 2) * 60 * 60 * 1000);

  const booking: WaybillBooking = {
    waybillCode,
    createdAt: now.toISOString(),
    order,
    provider,
    status: 'confirmed',
    pickupEta: `${pickupTime.toLocaleDateString('vi-VN')} ${pickupTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`,
    deliveryEta: `${deliveryTime.toLocaleDateString('vi-VN')} ${deliveryTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`,
    driverName: driverNames[Math.floor(Math.random() * driverNames.length)],
    truckPlate: truckPlates[Math.floor(Math.random() * truckPlates.length)]
  };

  res.json({ success: true, booking });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`LogiMatch AI Server đang chạy tại http://localhost:${PORT}`);
  });
}

startServer();
