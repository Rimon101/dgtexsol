/** Database row types — will be refined when Supabase is connected */

export interface Category {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  image_url: string | null;
  category_id: string | null;
  is_active: boolean;
  is_sold_out: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/** Product with its category joined */
export interface ProductWithCategory extends Product {
  category: Category | null;
}

/** Shape used in create/edit forms (before DB defaults are applied) */
export interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  image_url: string | null;
  category_id: string | null;
  is_active: boolean;
  is_sold_out: boolean;
  sort_order: number;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  sort_order: number;
}

