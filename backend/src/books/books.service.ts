import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  async findAll(): Promise<Book[]> {
    return this.booksRepository.find();
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.booksRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async create(createBookInput: CreateBookInput): Promise<Book> {
    const book = this.booksRepository.create(createBookInput);
    return this.booksRepository.save(book);
  }

  async update(id: number, updateBookInput: UpdateBookInput): Promise<Book> {
    const book = await this.findOne(id);
    Object.assign(book, updateBookInput);
    return this.booksRepository.save(book);
  }

  async remove(id: number): Promise<boolean> {
    const book = await this.findOne(id);
    await this.booksRepository.remove(book);
    return true;
  }
}
