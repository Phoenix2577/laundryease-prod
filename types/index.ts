export interface Student {
  id: string;
  student_id: string;
  full_name: string;
  email: string;
  phone: string;
  hostel_block: string;
  room_number: string;
  laundry_quota_remaining: number;
  created_at: string;
}

export interface LaundryRequest {
  id: string;
  ticket_number: number;
  student_id: string;
  student?: Student;
  pickup_date: string;
  pickup_time_slot: string;
  items: Record<string, number>;
  total_items: number;
  wash_type: string;
  detergent: string;
  special_instructions: string;
  status: 'submitted' | 'picked_up' | 'washing' | 'ready' | 'delivered' | 'cancelled';
  cost: number;
  created_at: string;
  updated_at: string;
}

export interface StatusHistory {
  id: string;
  request_id: string;
  status: string;
  changed_by: string;
  changed_at: string;
  notes: string;
}

export interface Feedback {
  id: string;
  request_id: string;
  student_id: string;
  rating: number;
  improvements: string[];
  new_features: string;
  easier_laundry: string;
  comments: string;
  created_at: string;
}

export interface Admin {
  id: string;
  email: string;
  full_name: string;
  role: 'laundry_head' | 'super_admin';
  hostel_blocks: string[];
  created_at: string;
}

export type ClothingItem = {
  id: string;
  name: string;
  icon: string;
  cost_per_item: number;
};

export const CLOTHING_ITEMS: ClothingItem[] = [
  { id: 'shirts', name: 'Shirts / T-Shirts', icon: '👕', cost_per_item: 15 },
  { id: 'pants', name: 'Pants / Jeans', icon: '👖', cost_per_item: 20 },
  { id: 'shorts', name: 'Shorts', icon: '🩳', cost_per_item: 12 },
  { id: 'underwear', name: 'Undergarments', icon: '🩲', cost_per_item: 8 },
  { id: 'socks', name: 'Socks', icon: '🧦', cost_per_item: 5 },
  { id: 'towels', name: 'Towels', icon: '🧖', cost_per_item: 18 },
  { id: 'bedsheets', name: 'Bed Sheets', icon: '🛏️', cost_per_item: 25 },
  { id: 'pillowcases', name: 'Pillow Cases', icon: '🛌', cost_per_item: 10 },
  { id: 'jackets', name: 'Jackets / Hoodies', icon: '🧥', cost_per_item: 30 },
];

export const TIME_SLOTS = [
  '7:00 AM - 9:00 AM',
  '9:00 AM - 11:00 AM',
  '11:00 AM - 1:00 PM',
  '2:00 PM - 4:00 PM',
  '4:00 PM - 6:00 PM',
];

export const WASH_TYPES = ['Regular Wash', 'Delicate Wash', 'Deep Clean', 'Eco Wash'];
export const DETERGENTS = ['Standard Detergent', 'Hypoallergenic', 'Fragrance-Free', 'Organic/Eco-friendly'];

export const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  submitted: { label: 'Submitted', color: 'text-purple-400', bg: 'bg-purple-500/20 border-purple-500/30' },
  picked_up: { label: 'Picked Up', color: 'text-amber-400', bg: 'bg-amber-500/20 border-amber-500/30' },
  washing: { label: 'Washing', color: 'text-blue-400', bg: 'bg-blue-500/20 border-blue-500/30' },
  ready: { label: 'Ready for Delivery', color: 'text-cyan-400', bg: 'bg-cyan-500/20 border-cyan-500/30' },
  delivered: { label: 'Delivered', color: 'text-emerald-400', bg: 'bg-emerald-500/20 border-emerald-500/30' },
  cancelled: { label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-500/20 border-red-500/30' },
};

export const STATUS_FLOW = ['submitted', 'picked_up', 'washing', 'ready', 'delivered'];