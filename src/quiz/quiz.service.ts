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
    const quizSubmissionResults = new QuizSubmissionResults();
    const correctAnswers = this.checkStudentsAnswer(answerInput, quiz);

    quizSubmissionResults.correctAnswers = correctAnswers;
    quizSubmissionResults.totalQuestions = quiz.questions.length;
    quizSubmissionResults.score = correctAnswers / quiz.questions.length;
    return quizSubmissionResults;
  }

  private checkStudentsAnswer(answerInput: AnswerInput, quiz: Quiz): number {
    let score = 0;

    for (let i = 0; i < answerInput.questionAnswers.length; i++) {
      switch (quiz.questions[i].questionType) {
        case QuestionType.SINGLE_CHOICE_QUESTION:
          const correctOption = quiz.questions[i].options.find(
            (option) => option.isCorrect,
          );
          if (answerInput.questionAnswers[i].answer == correctOption.option)
            score = score + 1;
          break;

        case QuestionType.MULTIPLE_CHOICE_QUESTION:
          const correctMultipleOptions = quiz.questions[i].options
            .filter((option) => option.isCorrect)
            .map((option) => option.option);

          const correctMultipleQA = this.validateAnswer(
            answerInput.questionAnswers[i].answers,
            correctMultipleOptions,
            QuestionType.MULTIPLE_CHOICE_QUESTION,
          );
          if (correctMultipleQA) score = score + 1;
          break;

        case QuestionType.SORTING_QUESTION:
          const correctOrderAnswers = quiz.questions[i].options.map(
            (option) => option.option,
          );
          const correctSortingQ = this.validateAnswer(
            answerInput.questionAnswers[i].answers,
            correctOrderAnswers,
            QuestionType.SORTING_QUESTION,
          );
          if (correctSortingQ) score = score + 1;
          break;

        case QuestionType.PLAIN_TEXT_QUESTION:
          const correctPlainAnswer = quiz.questions[i].options[0].option
            .trim()
            .toLowerCase()
            .replace(/[.,!"?;:/-]/g, '');
          const userAnswer = answerInput.questionAnswers[i].answer
            .trim()
            .toLowerCase()
            .replace(/[.,!"?;:/-]/g, '');

          if (correctPlainAnswer == userAnswer) score = score + 1;
          break;
      }
    }

    return score;
  }

  private validateAnswer(
    userAnswers: string[],
    correctAnswers: string[],
    questionType: QuestionType,
  ): boolean {
    if (userAnswers.length != correctAnswers.length) {
      return false;
    }

    if (questionType === QuestionType.MULTIPLE_CHOICE_QUESTION) {
      correctAnswers.sort();
      userAnswers.sort();
    } // else it's SORTING_QUESTION

    for (let j = 0; j < correctAnswers.length; j++) {
      if (userAnswers[j] != correctAnswers[j]) {
        return false;
      }
    }
    return true;
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
