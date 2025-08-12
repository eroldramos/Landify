import type { AxiosError } from "axios";

// enums from your Prisma schema
export type Role = "REGULAR" | "ADMIN";
export type PropertyType = "APARTMENT" | "HOUSE" | "COMMERCIAL";
export type ListingStatus = "FOR_SALE" | "FOR_RENT";

// Favorite model
export type Favorite = {
  id: number;
  userId: number | null;
  listingId: number | null;
  createdAt: Date;
  user?: User | null;
  listing?: Listing | null;
};

// User model
export type User = {
  id?: number;
  email?: string;
  password?: string | undefined;
  name?: string | null;
  role?: Role;
  createdAt?: Date;
  updatedAt?: Date;
  listings?: Listing[];
  favorites?: Favorite[];
};

// Listing model
export type Listing = {
  id: number;
  ownerId: number | null;
  owner?: User | null;
  title: string;
  description: string | null;
  address: string;
  priceCents: number;
  propertyType: PropertyType;
  status: ListingStatus;
  createdAt: Date;
  updatedAt: Date;
  images: Image[];
  favorites: Favorite[];
};

// Image model
export type Image = {
  id: number;
  listingId: number | null;
  listing?: Listing | null;
  url: string;
  altText: string | null;
  position: number;
  createdAt: Date;
};

export type SuccessResponse = {
  data: MessageResponse | LoginResponse;
};

export type ErrorResponse = AxiosError & {
  data: MessageResponse;
};
export type MessageResponse = {
  message: string;
  id?: string;
};

export type AxiosErrorResponse = {
  response: ErrorResponse;
};
export type OnSuccess = (data: SuccessResponse) => void;
export type OnError = (error: AxiosErrorResponse) => void;

export type RegisterUser = {
  email: string;
  name?: string;
  password: string;
};

export type AuthStore = {
  // authPath: string;
  // setAuthPath: (value: string) => void;

  auth: LoginResponse | null;
  setAuth: (value: LoginResponse | null) => void;
};

export type LoginResponse = {
  accessToken: string;
  expireIn: number;
  expireAt: number;
  email: string;
  name: string;
  id?: number;
  role: string;
};

export type MenuItem = {
  path: string;
  onClick: () => void;
};
