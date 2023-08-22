import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizResolver } from './quiz.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './models/quiz.entity';
import { Question } from './models/question.entity';
import { QuestionOption } from './models/question-option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Quiz, Question, QuestionOption])],
  providers: [QuizService, QuizResolver],
})
export class QuizModule {}
