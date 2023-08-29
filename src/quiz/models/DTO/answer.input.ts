import { Field, InputType } from '@nestjs/graphql';
import { AnswerDto } from './answer.dto';
import { ArrayNotEmpty, Length } from 'class-validator';

@InputType()
export class AnswerInput {
  @Field()
  @Length(4, 50, {
    message: 'Valid quiz name has between 4 and 50 characters. ',
  })
  quizName: string;

  @Field(() => [AnswerDto])
  @ArrayNotEmpty({ message: 'Cannot submit empty answers. ' })
  questionAnswers: AnswerDto[];
}
