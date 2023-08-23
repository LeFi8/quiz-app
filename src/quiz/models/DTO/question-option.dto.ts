import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class QuestionOptionDto {
  @Field()
  option: string;

  @Field({ nullable: true })
  isCorrect?: boolean;
}
