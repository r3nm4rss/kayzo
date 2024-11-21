import { LucideIcon } from "lucide-react";

// types.ts
export interface User {
  id: number;
  username: string;
  name: string;
  description: string,
  email: string;
  profileImage?: string
  backgroundImage?: string;
  bio?: string;
  totalVisit?: number;
}

export interface Link {
  id: number;
  userId?: number;
  title: string;
  url: string;
  platform: string;
  order?: number;
}

export interface ProfileSettings {
  bio: string;
  profilePicture?: File;
  backgroundMedia?: File;
}


export interface SocialPlatform {
  id: string;
  name: string;
  icon: LucideIcon;
  placeholder: string;
  baseUrl: string;
}

export interface LinkFormData {
  title: string;
  url: string;
}