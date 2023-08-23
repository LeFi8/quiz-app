import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from './models/quiz.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateQuizInput } from './models/DTO/create-quiz.input';
import { Question } from './models/question.entity';
import { QuestionOption } from './models/question-option.entity';
@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz) private quizRepository: Repository<Quiz>,
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,
    @InjectRepository(QuestionOption)
    private optionsRepository: Repository<QuestionOption>,
    private readonly entityManager: EntityManager,
  ) {}

  async findAll(): Promise<Quiz[]> {
    return this.quizRepository
      .createQueryBuilder('quiz')
      .innerJoinAndSelect('quiz.questions', 'question')
      .innerJoinAndSelect('question.options', 'option')
      .getMany();
  }

  async findQuizByName(quizName: string): Promise<Quiz> {
    const quiz = await this.quizRepository.findOneBy({ quizName: quizName });
    if (!quiz) {
      throw new Error('No quiz found with given name.');
    }
    return quiz;
  }

  async createQuiz(createQuizInput: CreateQuizInput): Promise<Quiz> {
    try {
      return this.entityManager.transaction(async (transactionManager) => {
        const newQuiz = this.quizRepository.create(createQuizInput);

        for (const questionInput of createQuizInput.questions) {
          const question = this.questionsRepository.create(questionInput);

          for (const optionInput of questionInput.options) {
            const option = this.optionsRepository.create(optionInput);
            option.question = question;
          }
          question.quiz = newQuiz;
        }
        await transactionManager.save(newQuiz);

        return newQuiz;
      });
    } catch (error) {
      throw new Error('An error has occurred while creating the quiz.');
    }
  }
}
