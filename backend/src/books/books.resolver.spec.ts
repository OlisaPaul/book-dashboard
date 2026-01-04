import { Test, TestingModule } from '@nestjs/testing';
import { BooksResolver } from './books.resolver';
import { BooksService } from './books.service';
import { Book } from './book.entity';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';

describe('BooksResolver', () => {
  let resolver: BooksResolver;
  let service: BooksService;

  const mockBook: Book = {
    id: 1,
    name: 'Test Book',
    description: 'Test Description',
  };

  const mockBooksService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksResolver,
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
      ],
    })
      .overrideGuard(require('../auth/auth.guard').AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    resolver = module.get<BooksResolver>(BooksResolver);
    service = module.get<BooksService>(BooksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const books = [mockBook];
      mockBooksService.findAll.mockResolvedValue(books);

      const result = await resolver.findAll();

      expect(result).toEqual(books);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single book', async () => {
      mockBooksService.findOne.mockResolvedValue(mockBook);

      const result = await resolver.findOne(1);

      expect(result).toEqual(mockBook);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('createBook', () => {
    it('should create and return a new book', async () => {
      const createBookInput: CreateBookInput = {
        name: 'New Book',
        description: 'New Description',
      };

      mockBooksService.create.mockResolvedValue(mockBook);

      const result = await resolver.createBook(createBookInput);

      expect(result).toEqual(mockBook);
      expect(service.create).toHaveBeenCalledWith(createBookInput);
    });
  });

  describe('updateBook', () => {
    it('should update and return the book', async () => {
      const updateBookInput: UpdateBookInput = {
        name: 'Updated Book',
      };

      const updatedBook = { ...mockBook, ...updateBookInput };
      mockBooksService.update.mockResolvedValue(updatedBook);

      const result = await resolver.updateBook(1, updateBookInput);

      expect(result).toEqual(updatedBook);
      expect(service.update).toHaveBeenCalledWith(1, updateBookInput);
    });
  });

  describe('deleteBook', () => {
    it('should delete a book and return true', async () => {
      mockBooksService.remove.mockResolvedValue(true);

      const result = await resolver.deleteBook(1);

      expect(result).toBe(true);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
