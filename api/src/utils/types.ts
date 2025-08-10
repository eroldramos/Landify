import type { JwtPayload } from "jsonwebtoken";
import type { Request } from "express";
import { access } from "node:fs";
export interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

export type CurrentUser = {
  id?: number | undefined;
  name?: string | undefined;
  role?: string | undefined;
  email?: string | undefined;
};

export type SupabaseRequest = Request & {
  currentUser?: CurrentUser | User | null;
};

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
