export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  profilePicture: string;
  googleId: string;
  description: string;
  backgroundMedia: string;
  backgroundType: 'image' | 'video';
  createdAt: Date;
  updatedAt: Date;
}


export interface Link {
  id: number;
  userId: number;
  title: string;
  url: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface JwtPayload {
  id: number;
  email: string;
}
