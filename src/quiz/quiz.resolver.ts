import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { QuizService } from './quiz.service';
import { Quiz } from './models/quiz.entity';
import { CreateQuizInput } from './models/DTO/create-quiz.input';

@Resolver()
export class QuizResolver {
  constructor(private quizService: QuizService) {}

  @Query(() => [Quiz])
  async quizzes(): Promise<Quiz[]> {
    return this.quizService.findAll();
  }

  @Query(() => Quiz)
  async quiz(@Args('quizName') quizName: string) {
    return this.quizService.findQuizByName(quizName);
  }

  @Mutation(() => Quiz)
  async createQuiz(
    @Args('createQuizInput') createQuizInput: CreateQuizInput,
  ): Promise<Quiz> {
    return this.quizService.createQuiz(createQuizInput);
  }
}
