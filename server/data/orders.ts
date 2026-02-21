export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  status: "confirmed" | "pending";
  createdAt: string;
  items: OrderItem[];
  shipping: {
    name: string;
    address: string;
    city: string;
    zip: string;
  };
  total: number;
}

export const mockOrders: Order[] = [
  {
    id: "ORD-1001",
    userId: "user-1",
    status: "confirmed",
    createdAt: "2025-01-15T10:30:00.000Z",
    items: [
      { productId: "p1", name: "White Classic Tee", quantity: 1, price: 29.99 },
      { productId: "p3", name: "Black Graphic Tee", quantity: 2, price: 34.99 },
    ],
    shipping: {
      name: "John Doe",
      address: "123 Main St",
      city: "New York",
      zip: "10001",
    },
    total: 99.97,
  },
  {
    id: "ORD-1002",
    userId: "user-1",
    status: "confirmed",
    createdAt: "2024-12-03T14:15:00.000Z",
    items: [
      { productId: "p5", name: "Navy Striped Tee", quantity: 1, price: 27.99 },
    ],
    shipping: {
      name: "John Doe",
      address: "123 Main St",
      city: "New York",
      zip: "10001",
    },
    total: 32.98,
  },
  {
    id: "ORD-1003",
    userId: "user-1",
    status: "pending",
    createdAt: "2025-02-10T09:00:00.000Z",
    items: [
      { productId: "p2", name: "Heather Grey Tee", quantity: 3, price: 24.99 },
      { productId: "p7", name: "Olive Pocket Tee", quantity: 1, price: 31.99 },
    ],
    shipping: {
      name: "John Doe",
      address: "123 Main St",
      city: "New York",
      zip: "10001",
    },
    total: 111.96,
  },
];
