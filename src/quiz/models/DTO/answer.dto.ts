import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AnswerDto {
  @Field()
  question: string;

  @Field({ nullable: true })
  answer: string;

  @Field(() => [String], { nullable: true })
  answers: string[];
}
