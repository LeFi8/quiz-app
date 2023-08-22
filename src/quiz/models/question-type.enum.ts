import { registerEnumType } from '@nestjs/graphql';

export enum QuestionType {
  SINGLE_CHOICE_QUESTION,
  MULTIPLE_CHOICE_QUESTION,
  SORTING_QUESTION,
  PLAIN_TEXT_QUESTION,
}

registerEnumType(QuestionType, {
  name: 'QuestionType',
  description: 'Types of questions in the quiz.',
  valuesMap: {
    SINGLE_CHOICE_QUESTION: {
      description: 'Only one answer is correct.',
    },
    MULTIPLE_CHOICE_QUESTION: {
      description: 'More than one answer is correct.',
    },
    SORTING_QUESTION: {
      description: 'You need to sort the question in correct order.',
    },
    PLAIN_TEXT_QUESTION: {
      description: 'Provide an answer in plain text.',
    },
  },
});
