import { Test, TestingModule } from '@nestjs/testing';
import { QuizService } from './quiz.service';
import { Quiz } from './models/quiz.entity';
import { QuestionType } from './models/question-type.enum';
import { QuestionOption } from './models/question-option.entity';
import { EntityManager, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Question } from './models/question.entity';
import { QuizSubmissionResults } from './models/DTO/quiz-submission-results';

describe('QuizService', () => {
  let quizService: QuizService;
  let quizRepository: Repository<Quiz>;

  const mockQuiz: Quiz = {
    id: 0,
    quizName: 'Jest Quiz',
    questions: [
      {
        id: 0,
        questionType: QuestionType.SINGLE_CHOICE_QUESTION,
        question: 'Is this a Quiz App?',
        options: [
          {
            id: 0,
            option: 'Yes',
            isCorrect: true,
            question: this,
          },
          {
            id: 1,
            option: 'No',
            isCorrect: false,
            question: this,
          },
        ],
        quiz: this,
      },
    ],
  };

  const mockQuizRepository = {};
  const mockQuestionsRepository = {};
  const mockOptionsRepository = {};
  const entityManager = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuizService,
        {
          provide: getRepositoryToken(Quiz),
          useValue: mockQuizRepository,
        },
        {
          provide: getRepositoryToken(Question),
          useValue: mockQuestionsRepository,
        },
        {
          provide: getRepositoryToken(QuestionOption),
          useValue: mockOptionsRepository,
        },
        {
          provide: EntityManager,
          useValue: entityManager,
        },
      ],
    }).compile();

    quizService = module.get<QuizService>(QuizService);
    quizRepository = module.get<Repository<Quiz>>(getRepositoryToken(Quiz));
  });

  it('should be defined', () => {
    expect(quizService).toBeDefined();
    expect(quizRepository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of all quizzes', async () => {
      jest
        .spyOn(quizService, 'findAll')
        .mockResolvedValue(Promise.resolve([mockQuiz]));

      const result = await quizService.findAll();

      expect(result).toEqual([mockQuiz]);
    });
  });

  describe('findQuizByName', () => {
    it('should return a quiz', async () => {
      jest
        .spyOn(quizService, 'findQuizByName')
        .mockResolvedValue(Promise.resolve(mockQuiz));

      const result = await quizService.findQuizByName(mockQuiz.quizName);

      expect(result).toBe(mockQuiz);
    });
  });

  describe('fetchQuizForAStudent', () => {
    it(
      'should return a quiz ' +
        'with empty options, question type is plain text question, ',
      async () => {
        const mockQuizPlainTextQuestion = structuredClone(mockQuiz);
        const mockOptionPlainTextQuestion = {
          id: 0,
          option: 'Yes',
          isCorrect: true,
          question: this,
        };

        mockQuizPlainTextQuestion.questions = [];
        mockQuizPlainTextQuestion.questions.push({
          id: 0,
          quiz: mockQuizPlainTextQuestion,
          questionType: QuestionType.PLAIN_TEXT_QUESTION,
          question: 'Is this working?',
          options: [mockOptionPlainTextQuestion],
        });

        jest
          .spyOn(quizService, 'findQuizByName')
          .mockResolvedValue(Promise.resolve(mockQuizPlainTextQuestion));

        const result = await quizService.fetchQuizForAStudent(
          mockQuizPlainTextQuestion.quizName,
        );

        expect(result.questions[0].options).toEqual([]);
      },
    );

    it(
      'should return a quiz ' +
        'with shuffled options, question type is sorting question, ',
      async () => {
        const mockQuizSortingQuestion = structuredClone(mockQuiz);

        mockQuizSortingQuestion.questions = [];
        mockQuizSortingQuestion.questions.push({
          id: 0,
          quiz: mockQuizSortingQuestion,
          questionType: QuestionType.SORTING_QUESTION,
          question: 'Sort in right order:',
          options: [],
        });

        mockQuizSortingQuestion.questions[0].options = [
          {
            id: 0,
            option: '1',
            question: mockQuizSortingQuestion.questions[0],
            isCorrect: false,
          },
          {
            id: 0,
            option: '2',
            question: mockQuizSortingQuestion.questions[0],
            isCorrect: false,
          },
          {
            id: 0,
            option: '3',
            question: mockQuizSortingQuestion.questions[0],
            isCorrect: false,
          },
        ];

        jest
          .spyOn(quizService, 'findQuizByName')
          .mockResolvedValue(Promise.resolve(mockQuizSortingQuestion));

        const result = await quizService.fetchQuizForAStudent(
          mockQuizSortingQuestion.quizName,
        );

        expect(result.questions[0].options).not.toBe(mockQuizSortingQuestion);
      },
    );
  });

  const correctSubmission = new QuizSubmissionResults();
  correctSubmission.score = 1;
  correctSubmission.totalQuestions = 1;
  correctSubmission.correctAnswers = 1;

  describe('submitQuizAnswers', () => {
    it(
      'should correctly calculate correct answers, total questions ' +
        'and overall score of the submitted answers to the quiz ' +
        'for single choice question',
      async () => {
        jest.spyOn(quizService, 'findQuizByName').mockResolvedValue(mockQuiz);

        const mockAnswerInput = {
          quizName: mockQuiz.quizName,
          questionAnswers: [
            {
              question: mockQuiz.questions[0].question,
              answer: mockQuiz.questions[0].options[0].option,
              answers: [],
            },
          ],
        };

        const result = await quizService.submitQuizAnswers(mockAnswerInput);
        expect(result).toEqual(correctSubmission);
      },
    );

    it(
      'should correctly calculate correct answers, total questions ' +
        'and overall score of the submitted answers to the quiz ' +
        'for multi choice question',
      async () => {
        mockQuiz.questions = [];
        mockQuiz.questions.push({
          id: 1,
          questionType: QuestionType.MULTIPLE_CHOICE_QUESTION,
          question: 'Choose both',
          options: [
            {
              id: 3,
              option: 'yes',
              isCorrect: true,
              question: this,
            },
            {
              id: 4,
              option: 'true',
              isCorrect: true,
              question: this,
            },
          ],
          quiz: mockQuiz,
        });

        jest.spyOn(quizService, 'findQuizByName').mockResolvedValue(mockQuiz);

        const mockAnswerInput = {
          quizName: mockQuiz.quizName,
          questionAnswers: [
            {
              question: 'Choose both',
              answer: undefined,
              answers: ['yes', 'true'],
            },
          ],
        };

        const result = await quizService.submitQuizAnswers(mockAnswerInput);
        expect(result).toEqual(correctSubmission);
      },
    );
  });
});
