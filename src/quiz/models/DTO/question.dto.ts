import { Field, InputType } from '@nestjs/graphql';
import { QuestionType } from '../question-type.enum';
import { QuestionOptionDto } from './question-option.dto';
import { ArrayNotEmpty, Length } from 'class-validator';

@InputType()
export class QuestionDto {
  @Field()
  @Length(1, 50, {
    message: 'Question needs to have the length of 1-50 characters.',
  })
  question: string;

  @Field(() => QuestionType)
  questionType: QuestionType;

  @Field(() => [QuestionOptionDto])
  @ArrayNotEmpty({ message: 'Options cannot be empty. ' })
  options: QuestionOptionDto[];
}
