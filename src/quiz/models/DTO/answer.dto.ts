import { Field, InputType } from '@nestjs/graphql';
import { Length } from 'class-validator';

@InputType()
export class AnswerDto {
  @Field()
  @Length(1, 50, {
    message: 'Valid question has the length of 1-50 characters.',
  })
  question: string;

  @Field({ nullable: true })
  answer: string;

  @Field(() => [String], { nullable: true })
  answers: string[];
}
