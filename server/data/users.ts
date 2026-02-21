export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
}

export const mockUser: User = {
  id: "user-1",
  email: "user@example.com",
  name: "John Doe",
  avatar: null,
};
