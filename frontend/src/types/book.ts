export interface Book {
  id: number;
  name: string;
  description: string;
}

export interface CreateBookInput {
  name: string;
  description: string;
}

export interface UpdateBookInput {
  name?: string;
  description?: string;
}
