export type Category = 'FURNITURE' | 'ELECTRONICS' | 'TEXTBOOKS' | 'CLOTHING' | 'BIKES' | 'KITCHEN' | 'FREE_STUFF' | 'OTHER';
export type Condition = 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR' | 'POOR';
export type ListingStatus = 'ACTIVE' | 'SOLD' | 'EXPIRED' | 'DELETED';

export interface User {
  id: number;
  email: string;
  name: string;
  profilePicUrl?: string;
  emailVerified: boolean; // Added to fix User error
  role: 'USER' | 'ADMIN';
}
export interface SavedItem {
  id: number;
  listing: Listing; // Uses the ListingSummaryResponse structure
  savedAt: string;
}

export interface ListingImage {
  id: number;
  imageUrl: string;
  displayOrder: number;
}

export interface Seller {
  id: number;
  name: string;
  profilePicUrl?: string; // Added to fix Seller error
  memberSince: string;
}

export interface Listing {
  id: number;
  slug: string;
  title: string;
  description: string;
  price: number;
  category: Category;
  categoryDisplayName: string;
  condition: Condition;
  conditionDisplayName: string;
  status: ListingStatus;
  thumbnailUrl?: string;
  images: ListingImage[];
  seller: Seller; // Uses the full Seller interface above
  createdAt: string; // Added to fix Listing error
  expiresAt: string;
  isSaved: boolean; // Added to fix Listing detail error
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}