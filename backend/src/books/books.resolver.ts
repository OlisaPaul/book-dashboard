import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from './book.entity';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { AuthGuard } from '../auth/auth.guard';

@Resolver(() => Book)
@UseGuards(AuthGuard)
export class BooksResolver {
  constructor(private readonly booksService: BooksService) {}

  @Query(() => [Book], { name: 'books' })
  async findAll(): Promise<Book[]> {
    return this.booksService.findAll();
  }

  @Query(() => Book, { name: 'book' })
  async findOne(@Args('id', { type: () => Int }) id: number): Promise<Book> {
    return this.booksService.findOne(id);
  }

  @Mutation(() => Book)
  async createBook(
    @Args('input') createBookInput: CreateBookInput,
  ): Promise<Book> {
    return this.booksService.create(createBookInput);
  }

  @Mutation(() => Book)
  async updateBook(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') updateBookInput: UpdateBookInput,
  ): Promise<Book> {
    return this.booksService.update(id, updateBookInput);
  }

  @Mutation(() => Boolean)
  async deleteBook(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.booksService.remove(id);
  }
}
