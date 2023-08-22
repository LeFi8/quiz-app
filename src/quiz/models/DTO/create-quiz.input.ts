import { Field, InputType } from '@nestjs/graphql';
import { QuestionDto } from './question.dto';

@InputType()
export class CreateQuizInput {
  @Field()
  quizName: string;

  @Field(() => [QuestionDto])
  questions: [QuestionDto];
}
