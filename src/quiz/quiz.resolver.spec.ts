import { Test, TestingModule } from '@nestjs/testing';
import { QuizResolver } from './quiz.resolver';
import { QuizService } from './quiz.service';
import { Role } from './models/role.enum';
import { Quiz } from './models/quiz.entity';

describe('QuizResolver', () => {
  let resolver: QuizResolver;
  let quizService: QuizService;

  const mockQuizService = {
    findQuizByName: jest.fn(),
    fetchQuizForAStudent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuizResolver,
        {
          provide: QuizService,
          useValue: mockQuizService,
        },
      ],
    }).compile();

    resolver = module.get<QuizResolver>(QuizResolver);
    quizService = module.get<QuizService>(QuizService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('quiz', () => {
    const mockQuiz: Quiz = {
      id: 0,
      quizName: 'Mock Quiz',
      questions: [],
    };
    mockQuizService.findQuizByName.mockResolvedValue(mockQuiz);
    mockQuizService.fetchQuizForAStudent.mockResolvedValue(mockQuiz);

    it('should call the right method for role teacher', async () => {
      await resolver.quiz(mockQuiz.quizName, Role.TEACHER);
      expect(quizService.findQuizByName).toHaveBeenCalled();
    });

    it('should call the right method for role student', async () => {
      await resolver.quiz(mockQuiz.quizName, Role.STUDENT);
      expect(quizService.fetchQuizForAStudent).toHaveBeenCalled();
    });
  });
});
