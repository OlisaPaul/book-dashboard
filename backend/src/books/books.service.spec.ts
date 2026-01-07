import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('BooksService', () => {
  let service: BooksService;
  let repository: Repository<Book>;

  const mockBook: Book = {
    id: 1,
    name: 'Test Book',
    description: 'Test Description',
  };

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    repository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const books = [mockBook];
      mockRepository.find.mockResolvedValue(books);

      const result = await service.findAll();

      expect(result).toEqual(books);
      expect(() => repository.find()).toBeDefined();
    });

    it('should return an empty array when no books exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(() => repository.find()).toBeDefined();
    });
  });

  describe('findOne', () => {
    it('should return a book by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockBook);

      const result = await service.findOne(1);

      expect(result).toEqual(mockBook);
      expect(() => repository.findOne({ where: { id: 1 } })).toBeDefined();
    });

    it('should throw NotFoundException when book not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        'Book with ID 999 not found',
      );
    });
  });

  describe('create', () => {
    it('should create and return a new book', async () => {
      const createBookInput = {
        name: 'New Book',
        description: 'New Description',
      };

      mockRepository.create.mockReturnValue(mockBook);
      mockRepository.save.mockResolvedValue(mockBook);

      const result = await service.create(createBookInput);

      expect(result).toEqual(mockBook);
      expect(() => repository.create(createBookInput)).toBeDefined();
      expect(() => repository.save(mockBook)).toBeDefined();
    });
  });

  describe('update', () => {
    it('should update and return the book', async () => {
      const updateBookInput = {
        name: 'Updated Book',
        description: 'Updated Description',
      };

      const updatedBook = { ...mockBook, ...updateBookInput };

      mockRepository.findOne.mockResolvedValue(mockBook);
      mockRepository.save.mockResolvedValue(updatedBook);

      const result = await service.update(1, updateBookInput);

      expect(result).toEqual(updatedBook);
      expect(() => repository.findOne({ where: { id: 1 } })).toBeDefined();
      expect(() => repository.save(updatedBook)).toBeDefined();
    });

    it('should throw NotFoundException when updating non-existent book', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, { name: 'Test' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a book and return true', async () => {
      mockRepository.findOne.mockResolvedValue(mockBook);
      mockRepository.remove.mockResolvedValue(mockBook);

      const result = await service.remove(1);

      expect(result).toBe(true);
      expect(() => repository.findOne({ where: { id: 1 } })).toBeDefined();
      expect(() => repository.remove(mockBook)).toBeDefined();
    });

    it('should throw NotFoundException when removing non-existent book', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
