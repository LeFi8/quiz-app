import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, Length } from 'class-validator';

@InputType()
export class QuestionOptionDto {
  @Field()
  @Length(1, 50, {
    message: 'Option needs to have the length of 1-50 characters.',
  })
  option: string;

  @Field({ defaultValue: false })
  @IsBoolean({ message: 'Have to be boolean type' })
  isCorrect: boolean;
}
