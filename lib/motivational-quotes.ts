export interface MotivationalQuote {
  id: string
  text: string
  author: string
  category: 'motivation' | 'discipline' | 'success' | 'perseverance' | 'mindset'
}

export const MOTIVATIONAL_QUOTES: MotivationalQuote[] = [
  {
    id: '1',
    text: 'The secret of getting ahead is getting started.',
    author: 'Mark Twain',
    category: 'motivation',
  },
  {
    id: '2',
    text: 'Your limitation—it is only your imagination.',
    author: 'Unknown',
    category: 'mindset',
  },
  {
    id: '3',
    text: 'Small daily improvements over time lead to stunning results.',
    author: 'Robin Sharma',
    category: 'discipline',
  },
  {
    id: '4',
    text: 'Success is the sum of small efforts repeated day in and day out.',
    author: 'Robert Collier',
    category: 'success',
  },
  {
    id: '5',
    text: "You don't have to be great to start, but you have to start to be great.",
    author: 'Zig Ziglar',
    category: 'motivation',
  },
  {
    id: '6',
    text: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
    category: 'success',
  },
  {
    id: '7',
    text: 'Discipline is choosing between what you want now and what you want most.',
    author: 'Abraham Lincoln',
    category: 'discipline',
  },
  {
    id: '8',
    text: 'It does not matter how slowly you go as long as you do not stop.',
    author: 'Confucius',
    category: 'perseverance',
  },
  {
    id: '9',
    text: "The difference between who you are and who you want to be is what you do.",
    author: 'Bill Phillips',
    category: 'mindset',
  },
  {
    id: '10',
    text: "Don't watch the clock; do what it does. Keep going.",
    author: 'Sam Levenson',
    category: 'perseverance',
  },
  {
    id: '11',
    text: 'A journey of a thousand miles begins with a single step.',
    author: 'Lao Tzu',
    category: 'motivation',
  },
  {
    id: '12',
    text: 'Excellence is not a destination; it is a continuous journey that never ends.',
    author: 'Brian Tracy',
    category: 'success',
  },
  {
    id: '13',
    text: 'We are what we repeatedly do. Excellence, then, is not an act but a habit.',
    author: 'Aristotle',
    category: 'discipline',
  },
  {
    id: '14',
    text: 'The best time to plant a tree was 20 years ago. The second best time is now.',
    author: 'Chinese Proverb',
    category: 'motivation',
  },
  {
    id: '15',
    text: "You miss 100% of the shots you don't take.",
    author: 'Wayne Gretzky',
    category: 'motivation',
  },
  {
    id: '16',
    text: 'Fall seven times and stand up eight.',
    author: 'Japanese Proverb',
    category: 'perseverance',
  },
  {
    id: '17',
    text: 'The only impossible journey is the one you never begin.',
    author: 'Tony Robbins',
    category: 'motivation',
  },
  {
    id: '18',
    text: "Your time is limited, don't waste it living someone else's life.",
    author: 'Steve Jobs',
    category: 'mindset',
  },
  {
    id: '19',
    text: 'Consistency is the key to achieving and maintaining momentum.',
    author: 'Darren Hardy',
    category: 'discipline',
  },
  {
    id: '20',
    text: "The harder you work for something, the greater you'll feel when you achieve it.",
    author: 'Unknown',
    category: 'success',
  },
  {
    id: '21',
    text: "Don't be pushed by your problems. Be led by your dreams.",
    author: 'Ralph Waldo Emerson',
    category: 'mindset',
  },
  {
    id: '22',
    text: 'What you get by achieving your goals is not as important as what you become.',
    author: 'Zig Ziglar',
    category: 'success',
  },
  {
    id: '23',
    text: 'Motivation gets you started. Habit keeps you going.',
    author: 'Jim Ryun',
    category: 'discipline',
  },
  {
    id: '24',
    text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
    author: 'Winston Churchill',
    category: 'perseverance',
  },
  {
    id: '25',
    text: 'Believe you can and you're halfway there.',
    author: 'Theodore Roosevelt',
    category: 'mindset',
  },
]

export function getDailyQuote(): MotivationalQuote {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
  )
  return MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length]
}

export function getRandomQuote(): MotivationalQuote {
  return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]
}

export function getQuotesByCategory(category: MotivationalQuote['category']): MotivationalQuote[] {
  return MOTIVATIONAL_QUOTES.filter(q => q.category === category)
}
