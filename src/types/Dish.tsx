export interface Dish {
  id: number;
  name: string;
  image_path: string;
  genre_id: number;
  category_id: number;
  description: string;
  reference_url: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  dishes: Dish[];
}