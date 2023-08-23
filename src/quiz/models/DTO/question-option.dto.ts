import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class QuestionOptionDto {
  @Field()
  option: string;

  @Field({ defaultValue: false })
  isCorrect: boolean;
}
