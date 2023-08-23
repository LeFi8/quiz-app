import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from './models/quiz.entity';
import { Repository } from 'typeorm';
@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz) private quizRepository: Repository<Quiz>,
  ) {}

  async findAll(): Promise<Quiz[]> {
    return this.quizRepository
      .createQueryBuilder('quiz')
      .innerJoinAndSelect('quiz.questions', 'question')
      .innerJoinAndSelect('question.options', 'option')
      .getMany();
  }
}
