<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest  


## Used tools and technologies

- NestJS
- GraphQL API
- TypeScript 
- PostreSQL with *Docker integration*
- TypeORM
- Jest

## Installation

```bash
# Cloning the repository
$ git clone https://github.com/LeFi8/quiz-app.git

# From project path
$ npm install
```

## Running the app

```bash
# First initialize docker from the project path
$ docker compose up -d

# Then start 
$ npm run start
```

## Test

```bash
# Unit tests
$ npm run test
```


## Features/How to

#### Create a quiz
To create a new quiz, teachers need to provide: 
- Name of the quiz
- List of the questions
	- The question
	- Question type
		- Single choice question
		- Multi choice question
		- Sorting question
		- Plain text question
	- List of options
		- Option
		- Whether the option is correct or not (by default its *false* if this field is not provided)

```graphql
# Example of how can quiz creation query look like
mutation {
  createQuiz(createQuizInput: {
    quizName: "Geography Knowledge Quiz"
    questions: [
      {
        question: "What is the capital of Poland?"
        questionType: SINGLE_CHOICE_QUESTION
        options: [
          { 
            option: "London" 
          },
          { 
            option: "Paris" 
          },
          { 
            option: "Warsaw", 
            isCorrect: true 
          },
          { 
            option: "Madrid" 
          },
        ]
      },
      {
        question: "Which continent is home to the Sahara Desert?"
        questionType: SINGLE_CHOICE_QUESTION
        options: [
          { 
            option: "Asia" 
          },
          { 
            option: "Africa", 
            isCorrect: true 
          },
          { 
            option: "South America" 
          },
          { 
            option: "Australia" 
          },
        ]
      },
      {
        question: "Which countires are in Europe?"
        questionType: MULTIPLE_CHOICE_QUESTION
        options: [
          { ,
            option: "Spain", 
            isCorrect: true 
          },
          { 
            option: "South Korea"
          },
          { 
            option: "Poland", 
            isCorrect: true 
          },
          { 
            option: "Germany", 
            isCorrect: true 
          }
        ]
      },
      {
        question: "Sort the following countries by their population in descending order:"
        questionType: SORTING_QUESTION
        options: [
          { 
            option: "China" 
          },
          { 
            option: "India" 
          },
          { 
            option: "United States" 
          },
          { 
            option: "Poland" 
          },
        ]
      },
      {
        question: "What is the capital of France?"
        questionType: PLAIN_TEXT_QUESTION
        options: [
          { 
            option: "Paris" 
          }
        ]
      }
    ]
  }) {
    quizName
    questions {
      question
      questionType
      options {
        option
        isCorrect
      }
    }
  }
}


```

#### Get list of quizzes

```graphql
# Just the name of quizzes
{
  quizzes {
    quizName
  }
}

# Quizzes with questions
{
  quizzes {
    quizName
    questions {
      question
    }
  }
}

# Quizzes with questions and options
{
  quizzes {
    quizName
    questions {
      question
      options {
        option
        isCorrect
      }
    }
  }
}


```

#### Fetch a specific quiz

When fetching a quiz as Student some fields may be returned as undifined, such as *isCorrect*, or *option* in Plain Text questions.

```graphql
# As teacher
{
  quiz(quizName: "Geography Knowledge Quiz", role: "TEACHER") {
    quizName
    questions {
      question
      questionType
      options {
        option
        isCorrect
      }
    }
  }
}

# As student
{
  quiz(quizName: "Geography Knowledge Quiz", role: "STUDENT") {
    quizName
    questions {
      question
      options {
        option
      }
    }
  }
}
```

#### Submit answers to the quiz

Answers to the questions *must be* in the same order as the fetched questions. 

```graphql
mutation {
  submitQuizAnswers(answerInput: {
    quizName: "Geography Knowledge Quiz"
    questionAnswers: [
      {
        question: "What is the capital of Poland?"
        answer: "Warsaw"
      },
      {
        question: "Which continent is home to the Sahara Desert?"
        answer: "Africa"
      },
      {
        question: "Which countires are in Europe?"
        answers: ["Spain", "Poland", "Germany"]
      },
      {
        question: "Sort the following countries by their population in descending order:"
        answers: ["China", "India", "United States", "Poland"]
      },
      {
        question: "What is the capital of France?"
        answer: "Paris"
      }
    ]
  }) {
    correctAnswers
    totalQuestions
    score
  }
}

```
