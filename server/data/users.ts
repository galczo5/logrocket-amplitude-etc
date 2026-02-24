export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
}

export const users: User[] = [
  {
    id: 'user-1',
    email: 'john@example.com',
    name: 'John Doe',
    avatar: null
  },
  {
    id: 'user-2',
    email: 'notjohn@example.com',
    name: 'Not John Doe',
    avatar: null
  }
];
