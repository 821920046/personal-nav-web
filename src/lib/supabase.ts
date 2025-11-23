import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('缺少 Supabase 环境变量，请检查 .env 文件');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 数据库类型定义
export interface Category {
  id: string;
  user_id: string;
  name: string;
  order_index: number;
  created_at: string;
}

export interface Site {
  id: string;
  category_id: string;
  user_id: string;
  name: string;
  url: string;
  logo: string;
  visits: number;
  order_index: number;
  created_at: string;
}

export interface Settings {
  id: string;
  user_id: string;
  site_title: string;
  logo_type: 'url' | 'upload' | 'emoji';
  logo_content: string;
  default_search_engine: string;
  created_at: string;
  updated_at: string;
}

