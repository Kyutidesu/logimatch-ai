import { supabase, isSupabaseConfigured } from './supabaseClient';
import { WaybillBooking } from '../types/logistics';

// Lưu vận đơn vào Supabase Database
export async function saveWaybillToSupabase(booking: WaybillBooking): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) {
    return false;
  }

  try {
    const { error } = await supabase.from('waybills').insert([
      {
        waybill_code: booking.waybillCode,
        status: booking.status,
        origin_city: booking.order.originCity,
        destination_city: booking.order.destinationCity,
        cargo_type: booking.order.cargoType,
        chargeable_weight_kg: (booking.order.weightKg || 0) * (booking.order.quantity || 1),
        declared_value_vnd: booking.order.declaredValueVnd || 0,
        provider_id: booking.provider.id,
        provider_name: booking.provider.name,
        total_cost_vnd: booking.provider.cost.totalVnd,
        delivery_time_text: booking.provider.deliveryTimeText,
        driver_name: booking.driverName,
        truck_plate: booking.truckPlate,
        pickup_eta: booking.pickupEta,
        delivery_eta: booking.deliveryEta,
        order_data: booking.order,
        provider_data: booking.provider,
        created_at: booking.createdAt,
      }
    ]);

    if (error) {
      console.warn('Lỗi khi lưu vận đơn lên Supabase:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.warn('Supabase insert exception:', err);
    return false;
  }
}

// Lấy danh sách vận đơn từ Supabase Database
export async function fetchWaybillsFromSupabase(): Promise<WaybillBooking[] | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('waybills')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.warn('Lỗi tải danh sách từ Supabase:', error?.message);
      return null;
    }

    // Chuyển đổi dữ liệu database về định dạng WaybillBooking
    return data.map((item: any) => ({
      waybillCode: item.waybill_code,
      createdAt: item.created_at,
      order: item.order_data,
      provider: item.provider_data,
      status: item.status,
      pickupEta: item.pickup_eta,
      deliveryEta: item.delivery_eta,
      driverName: item.driver_name,
      truckPlate: item.truck_plate,
    }));
  } catch (err) {
    console.warn('Supabase fetch exception:', err);
    return null;
  }
}

