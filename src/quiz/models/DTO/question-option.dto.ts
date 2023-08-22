import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class QuestionOptionDto {
  @Field()
  text: string;

  @Field({ nullable: true })
  isCorrect?: boolean;
}
