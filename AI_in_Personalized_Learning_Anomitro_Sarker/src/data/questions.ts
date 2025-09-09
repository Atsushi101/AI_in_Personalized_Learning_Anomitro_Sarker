import { Question } from '@/types/quiz';

export const questions: Question[] = [
  // Easy Questions
  {
    id: 'e1',
    difficulty: 'easy',
    topic: 'Python Basics',
    question: 'What is the correct way to print "Hello World" in Python?',
    choices: ['print("Hello World")', 'echo "Hello World"', 'console.log("Hello World")', 'printf("Hello World")'],
    answer: 'print("Hello World")',
    hint: 'Python uses the print() function to display output.',
    explanation: 'In Python, the print() function is used to output text to the console.'
  },
  {
    id: 'e2',
    difficulty: 'easy',
    topic: 'Variables',
    question: 'Which of these is a valid variable name in Python?',
    choices: ['my_variable', '2variable', 'my-variable', 'class'],
    answer: 'my_variable',
    hint: 'Variable names can contain letters, numbers, and underscores, but cannot start with a number.',
    explanation: 'Variable names in Python must start with a letter or underscore, and can contain letters, numbers, and underscores.'
  },
  {
    id: 'e3',
    difficulty: 'easy',
    topic: 'Data Types',
    question: 'What data type is the value 42 in Python?',
    choices: ['int', 'float', 'string', 'boolean'],
    answer: 'int',
    hint: 'Whole numbers without decimal points are integers.',
    explanation: '42 is an integer (int) because it is a whole number without a decimal point.'
  },
  {
    id: 'e4',
    difficulty: 'easy',
    topic: 'Strings',
    question: 'How do you get the length of a string "python" in Python?',
    choices: ['len("python")', 'length("python")', 'size("python")', '"python".length()'],
    answer: 'len("python")',
    hint: 'Python has a built-in function to find the length of objects.',
    explanation: 'The len() function returns the number of characters in a string.'
  },
  {
    id: 'e5',
    difficulty: 'easy',
    topic: 'Lists',
    question: 'How do you create an empty list in Python?',
    choices: ['[]', '{}', '()', 'list()'],
    answer: '[]',
    hint: 'Lists use square brackets in Python.',
    explanation: 'Empty lists are created using square brackets [] or the list() constructor.'
  },

  // Medium Questions
  {
    id: 'm1',
    difficulty: 'medium',
    topic: 'Control Flow',
    question: 'What will this code output?\nif 5 > 3:\n    print("Yes")\nelse:\n    print("No")',
    choices: ['Yes', 'No', 'Error', 'Nothing'],
    answer: 'Yes',
    hint: 'Check if the condition 5 > 3 is true or false.',
    explanation: 'Since 5 is greater than 3, the condition is True, so "Yes" is printed.'
  },
  {
    id: 'm2',
    difficulty: 'medium',
    topic: 'Loops',
    question: 'What does range(3) generate?',
    choices: ['[0, 1, 2]', '[1, 2, 3]', '[0, 1, 2, 3]', '[1, 2]'],
    answer: '[0, 1, 2]',
    hint: 'range() starts from 0 by default and goes up to (but not including) the specified number.',
    explanation: 'range(3) generates numbers from 0 up to (but not including) 3: 0, 1, 2.'
  },
  {
    id: 'm3',
    difficulty: 'medium',
    topic: 'Functions',
    question: 'What keyword is used to define a function in Python?',
    choices: ['def', 'function', 'func', 'define'],
    answer: 'def',
    hint: 'It\'s a three-letter keyword that\'s short for "define".',
    explanation: 'The "def" keyword is used to define functions in Python.'
  },
  {
    id: 'm4',
    difficulty: 'medium',
    topic: 'Lists',
    question: 'What will fruits[1] return if fruits = ["apple", "banana", "orange"]?',
    choices: ['"banana"', '"apple"', '"orange"', 'Error'],
    answer: '"banana"',
    hint: 'Python uses zero-based indexing for lists.',
    explanation: 'List indexing starts at 0, so fruits[1] returns the second element: "banana".'
  },
  {
    id: 'm5',
    difficulty: 'medium',
    topic: 'Dictionaries',
    question: 'How do you access the value associated with key "name" in a dictionary called person?',
    choices: ['person["name"]', 'person.name', 'person(name)', 'person->name'],
    answer: 'person["name"]',
    hint: 'Dictionaries use square brackets with the key to access values.',
    explanation: 'Dictionary values are accessed using square brackets with the key: person["name"].'
  },
  {
    id: 'm6',
    difficulty: 'medium',
    topic: 'String Methods',
    question: 'What does "hello".upper() return?',
    choices: ['"HELLO"', '"Hello"', '"hello"', 'Error'],
    answer: '"HELLO"',
    hint: 'The upper() method converts all characters to uppercase.',
    explanation: 'The upper() method returns a new string with all characters converted to uppercase.'
  },

  // Hard Questions
  {
    id: 'h1',
    difficulty: 'hard',
    topic: 'List Comprehension',
    question: 'What does [x**2 for x in range(4)] create?',
    choices: ['[0, 1, 4, 9]', '[1, 4, 9, 16]', '[0, 1, 2, 3]', '[2, 4, 6, 8]'],
    answer: '[0, 1, 4, 9]',
    hint: 'This is a list comprehension that squares each number from range(4).',
    explanation: 'List comprehension squares each number: 0²=0, 1²=1, 2²=4, 3²=9, resulting in [0, 1, 4, 9].'
  },
  {
    id: 'h2',
    difficulty: 'hard',
    topic: 'Exception Handling',
    question: 'Which block is used to handle exceptions in Python?',
    choices: ['try/except', 'try/catch', 'handle/error', 'exception/handle'],
    answer: 'try/except',
    hint: 'Python uses different keywords than Java or JavaScript for exception handling.',
    explanation: 'Python uses try/except blocks for exception handling, unlike try/catch in other languages.'
  },
  {
    id: 'h3',
    difficulty: 'hard',
    topic: 'Classes',
    question: 'What method is automatically called when creating a new instance of a class?',
    choices: ['__init__', '__new__', '__create__', '__start__'],
    answer: '__init__',
    hint: 'It\'s a special method (dunder method) that initializes the object.',
    explanation: 'The __init__ method is the constructor that automatically runs when creating a new instance.'
  },
  {
    id: 'h4',
    difficulty: 'hard',
    topic: 'Lambda Functions',
    question: 'What does lambda x: x * 2 create?',
    choices: ['An anonymous function that doubles its input', 'A variable named lambda', 'A syntax error', 'A list with doubled values'],
    answer: 'An anonymous function that doubles its input',
    hint: 'Lambda creates small, anonymous functions in Python.',
    explanation: 'Lambda functions are anonymous functions. This lambda takes x and returns x * 2.'
  }
];