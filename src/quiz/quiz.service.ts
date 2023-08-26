import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from './models/quiz.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateQuizInput } from './models/DTO/create-quiz.input';
import { Question } from './models/question.entity';
import { QuestionOption } from './models/question-option.entity';
import { QuestionType } from './models/question-type.enum';
import { shuffleArray } from '../utils/utils';
import { AnswerInput } from './models/DTO/answer.input';
import { QuizSubmissionResults } from './models/DTO/quiz-submission-results';

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
    const quiz = await this.quizRepository
      .createQueryBuilder('quiz')
      .innerJoinAndSelect('quiz.questions', 'question')
      .innerJoinAndSelect('question.options', 'option')
      .where('quiz.quizName = :quizName', { quizName })
      .getOne();
    if (!quiz) {
      throw new Error('No quiz found with given name.');
    }
    return quiz;
  }

  async fetchQuizForAStudent(quizName: string): Promise<Quiz> {
    const quiz = await this.findQuizByName(quizName);

    quiz.questions.forEach((question) => {
      if (question.questionType == QuestionType.PLAIN_TEXT_QUESTION)
        question.options.pop();
      if (question.questionType == QuestionType.SORTING_QUESTION)
        shuffleArray(question.options);

      question.options.forEach((option) => {
        delete option.isCorrect;
      });
    });
    return quiz;
  }

  async submitQuizAnswers(
    answerInput: AnswerInput,
  ): Promise<QuizSubmissionResults> {
    const quiz = await this.findQuizByName(answerInput.quizName);

    const result = this.validateAnswers(answerInput, quiz);

    const results = new QuizSubmissionResults();
    results.correctAnswers = result;
    results.totalQuestions = quiz.questions.length;
    results.score = result / quiz.questions.length;
    return results;
  }

  private validateAnswers(answerInput: AnswerInput, quiz: Quiz): number {
    let score = 0;
    for (let i = 0; i < answerInput.answers.length; i++) {
      if (
        quiz.questions[i].questionType === QuestionType.SINGLE_CHOICE_QUESTION
      ) {
        const correctOption = quiz.questions[i].options.find(
          (option) => option.isCorrect,
        );
        if (answerInput.answers[i].answer == correctOption.option)
          score = score + 1;
      }
    }

    return score;
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
