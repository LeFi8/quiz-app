import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { QuizService } from './quiz.service';
import { Quiz } from './models/quiz.entity';
import { CreateQuizInput } from './models/DTO/create-quiz.input';
import { Role } from './models/role.enum';
import { AnswerInput } from './models/DTO/answer.input';
import { QuizSubmissionResults } from './models/DTO/quiz-submission-results';

@Resolver()
export class QuizResolver {
  constructor(private quizService: QuizService) {}

  @Query(() => [Quiz])
  async quizzes(): Promise<Quiz[]> {
    return this.quizService.findAll();
  }

  @Query(() => Quiz)
  async quiz(@Args('quizName') quizName: string, @Args('role') role: Role) {
    if (role === Role.TEACHER) return this.quizService.findQuizByName(quizName);
    else if (role === Role.STUDENT)
      return this.quizService.fetchQuizForAStudent(quizName);
  }

  @Mutation(() => Quiz)
  async createQuiz(
    @Args('createQuizInput') createQuizInput: CreateQuizInput,
  ): Promise<Quiz> {
    return this.quizService.createQuiz(createQuizInput);
  }

  @Mutation(() => QuizSubmissionResults)
  async submitQuizAnswers(
    @Args('answerInput') answerInput: AnswerInput,
  ): Promise<QuizSubmissionResults> {
    return this.quizService.submitQuizAnswers(answerInput);
  }
}
