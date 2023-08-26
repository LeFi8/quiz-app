import { registerEnumType } from '@nestjs/graphql';

export enum Role {
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
}

registerEnumType(Role, {
  name: 'Role',
  description: 'User role, teacher or student.',
  valuesMap: {
    TEACHER: {
      description: 'Allowed to fetch all quiz info.',
    },
    STUDENT: {
      description: 'Has limited info about quiz.',
    },
  },
});
