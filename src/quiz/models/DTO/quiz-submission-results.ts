import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class QuizSubmissionResults {
  @Field(() => Int)
  correctAnswers: number;

  @Field(() => Int)
  totalQuestions: number;

  @Field(() => Float)
  score: number;
}
