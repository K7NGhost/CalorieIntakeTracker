export type UserProfileToken = {
  email: string;
  token: string;
};

export type UserProfile = {
  id: string;
  email: string;
  username: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
};
