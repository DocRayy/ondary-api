export type AuthenticatedUser = {
  id: number;
  username: string;
  email: string;
  name: string;
  role: string;
  status: string;
  photo?: string | null;
  photo_url?: string | null;
};
