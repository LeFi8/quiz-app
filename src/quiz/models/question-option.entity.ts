import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Question } from './question.entity';

@Entity({ name: 'Option' })
@ObjectType()
export class QuestionOption {
  @PrimaryGeneratedColumn({
    name: 'id_option',
  })
  @Field()
  id: number;

  @Column()
  @Field()
  option: string;

  @Column({ nullable: true })
  @Field()
  isCorrect?: boolean;

  @ManyToOne(() => Question, (question) => question.options)
  @Field(() => Question)
  question: Question;
}
