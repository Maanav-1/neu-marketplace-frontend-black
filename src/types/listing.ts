export type Category = 'FURNITURE' | 'ELECTRONICS' | 'TEXTBOOKS' | 'CLOTHING' | 'BIKES' | 'KITCHEN' | 'FREE_STUFF' | 'OTHER';
export type Condition = 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR' | 'POOR';

export interface ListingRequest {
  title: string;
  description: string;
  price: number;
  category: Category;
  condition: Condition;
}

export interface ImageResponse {
  id: number;
  imageUrl: string;
  displayOrder: number;
}