import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Question } from './question.entity';

@Entity({ name: 'Quiz' })
@ObjectType()
export class Quiz {
  @PrimaryGeneratedColumn({
    name: 'id_quiz',
  })
  @Field()
  id: number;

  @Column()
  @Field()
  quizName: string;

  @OneToMany(() => Question, (question) => question.quiz)
  @Field(() => Question)
  questions: [Question];
}
