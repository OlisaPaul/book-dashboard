import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateBookInput } from './create-book.input';

@InputType()
export class UpdateBookInput extends PartialType(CreateBookInput) {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;
}
