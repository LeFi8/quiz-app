import { Field, InputType } from '@nestjs/graphql';
import { AnswerDto } from './answer.dto';

@InputType()
export class AnswerInput {
  @Field()
  quizName: string;

  @Field(() => [AnswerDto])
  questionAnswers: AnswerDto[];
}
