import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { QuestionOption } from './question-option.entity';
import { QuestionType } from './question-type.enum';
import { Quiz } from './quiz.entity';

@Entity({ name: 'Question' })
@ObjectType()
export class Question {
  @PrimaryGeneratedColumn({
    name: 'id_question',
  })
  @Field()
  id: number;

  @Column()
  @Field()
  question: string;

  @Field(() => QuestionType)
  @Column({
    type: 'enum',
    enum: QuestionType,
  })
  questionType: QuestionType;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions)
  @Field(() => Quiz)
  quiz: Quiz;

  @OneToMany(
    () => QuestionOption,
    (questionOption) => questionOption.question,
    {
      cascade: true,
    },
  )
  @Field(() => [QuestionOption])
  options: QuestionOption[];
}
