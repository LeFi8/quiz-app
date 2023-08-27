import { Field, InputType } from '@nestjs/graphql';
import { QuestionDto } from './question.dto';
import { ArrayNotEmpty, Length } from 'class-validator';

@InputType()
export class CreateQuizInput {
  @Field()
  @Length(4, 50, {
    message: 'Quiz name needs to have the length of 4-50 characters. ',
  })
  quizName: string;

  @Field(() => [QuestionDto])
  @ArrayNotEmpty({ message: 'Quiz cannot be empty. ' })
  questions: QuestionDto[];
}
