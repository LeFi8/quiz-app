import { Field, InputType } from '@nestjs/graphql';
import { QuestionType } from '../question-type.enum';
import { QuestionOptionDto } from './question-option.dto';

@InputType()
export class QuestionDto {
  @Field()
  question: string;

  @Field(() => QuestionType)
  questionType: QuestionType;

  @Field(() => [QuestionOptionDto])
  options: [QuestionOptionDto];
}
