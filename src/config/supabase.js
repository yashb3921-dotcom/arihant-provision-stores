import { createClient } from '@supabase/supabase-js';

// Cleaned URLs - No Markdown brackets
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "[https://fcszshzymowhebrtrltl.supabase.co](https://fcszshzymowhebrtrltl.supabase.co)";
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjc3pzaHp5bW93aGVicnRybHRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MjI4MjMsImV4cCI6MjA4NjI5ODgyM30._-xnb38vx7Z5gAZeQSy-SRoU7RYGXRStT9Bi1nttzu4";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const STORE_INFO = {
  name: "Arihant Provision Stores",
  phone: "9881469046",
  address: "Behind K.K. Hospital, Markal Road, Alandi Devachi, Pune",
  logo: "[https://i.postimg.cc/8cJbrYQc/Screenshot_2026_02_16_202002.png](https://i.postimg.cc/8cJbrYQc/Screenshot_2026_02_16_202002.png)"
};

export const CATEGORIES = ["All", "Grains", "Spices", "Pulses", "Dairy", "Essentials", "Snacks"];
export const ORDER_STATUSES = ["Pending", "Accepted", "Packed", "Out for Delivery", "Ready for Pickup", "Completed", "Cancelled"];
export const ADMIN_EMAIL = 'bhandari.devichand9@gmail.com';

export const calculateDiscount = (price, discountPercent) => {
  if (!discountPercent || discountPercent <= 0) return price;
  return Math.floor(price - (price * (discountPercent / 100)));
};
