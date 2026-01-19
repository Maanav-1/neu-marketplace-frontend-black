// Matches AdminUserResponse.java and DashboardStatsResponse.java
export interface DashboardStats {
  totalUsers: number;
  verifiedUsers: number;
  blockedUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  totalListings: number;
  activeListings: number;
  soldListings: number;
  newListingsToday: number;
  newListingsThisWeek: number;
  averageListingPrice: number;
  listingsByCategory: Record<string, number>;
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  totalConversations: number;
  totalMessages: number;
}

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  phone?: string;
  profilePicUrl?: string;
  role: 'USER' | 'ADMIN';
  emailVerified: boolean;
  blocked: boolean;
  blockReason?: string;
  blockedAt?: string;
  createdAt: string;
  listingsCount: number;
  conversationsCount: number;
}