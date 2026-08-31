import {
  UserProfile,
  CodingQuestion,
  LeaderboardEntry,
  AchievementBadge,
  DailyChallenge,
  Flashcard,
  EvaluationReport
} from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'usr_001',
  name: 'Alex Mercer',
  email: 'alex.mercer@stanford.edu',
  college: 'Stanford University',
  degree: 'B.S. Computer Science',
  branch: 'Software Systems',
  graduationYear: '2025',
  skills: [
    'Data Structures & Algorithms',
    'React & TypeScript',
    'Node.js & Express',
    'Python & PyTorch',
    'System Design',
    'PostgreSQL'
  ],
  targetCompany: 'Google',
  dreamJob: 'Senior Software Engineer',
  yearsExperience: '1-2 Years',
  github: 'https://github.com/alexmercer',
  linkedin: 'https://linkedin.com/in/alexmercer',
  portfolio: 'https://alexmercer.dev',
  resumeFileName: 'Alex_Mercer_Software_Engineer_Resume.pdf',
  resumeText: `Alex Mercer | Software Engineer | alex.mercer@stanford.edu | github.com/alexmercer
Education: B.S. in Computer Science, Stanford University (GPA 3.9/4.0, Expected Grad: 2025)
Skills: Python, C++, TypeScript, React, Express, PostgreSQL, Redis, Docker, System Design
Experience:
- Software Engineering Intern, Stripe (Summer 2024): Built real-time transaction monitoring pipeline processing 5M events/day with 99.99% uptime. Reduced API response P99 latency by 32% using Redis caching.
- Technical Lead, Stanford WebDev Club: Led 12 developers building open-source campus navigation app used by 8,000+ students.
Projects:
- IntervuAI: AI-driven interview preparation engine powered by Gemini models and custom speech processing.
- Distributed KV Store: Built RAFT consensus protocol in Go with 100% test coverage for leader election and log replication.`,
  resumeScore: 88,
  createdAt: '2026-01-15'
};

export const CODING_QUESTIONS: CodingQuestion[] = [
  {
    id: 'code_01',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Arrays & Hashing',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.`,
    starterCode: {
      python: `def twoSum(nums: list[int], target: int) -> list[int]:
    # Write your solution here
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []

# Test execution
print(twoSum([2, 7, 11, 15], 9))`,
      javascript: `function twoSum(nums, target) {
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const diff = target - nums[i];
        if (seen.has(diff)) {
            return [seen.get(diff), i];
        }
        seen.set(nums[i], i);
    }
    return [];
}

console.log(twoSum([2, 7, 11, 15], 9));`
    },
    testCases: [
      { id: 't1', input: 'nums = [2,7,11,15], target = 9', expectedOutput: '[0, 1]' },
      { id: 't2', input: 'nums = [3,2,4], target = 6', expectedOutput: '[1, 2]' },
      { id: 't3', input: 'nums = [3,3], target = 6', expectedOutput: '[0, 1]', isHidden: true }
    ]
  },
  {
    id: 'code_02',
    title: 'LRU Cache Design',
    difficulty: 'Hard',
    category: 'System Design & Data Structures',
    description: `Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.

Implement the LRUCache class:
- \`LRUCache(int capacity)\` Initialize the LRU cache with positive size capacity.
- \`int get(int key)\` Return the value of the key if key exists, otherwise return -1.
- \`void put(int key, int value)\` Update the value of the key if the key exists. Otherwise, add key-value pair. If capacity exceeded, evict the least recently used key.`,
    starterCode: {
      python: `class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {} # Use dict / OrderedDict

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        val = self.cache.pop(key)
        self.cache[key] = val
        return val

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.pop(key)
        elif len(self.cache) >= self.capacity:
            # Pop oldest
            oldest = next(iter(self.cache))
            del self.cache[oldest]
        self.cache[key] = value

# Test
cache = LRUCache(2)
cache.put(1, 1)
cache.put(2, 2)
print(cache.get(1)) # returns 1
cache.put(3, 3)     # evicts key 2
print(cache.get(2)) # returns -1`,
      javascript: `class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
    }
    get(key) {
        if (!this.cache.has(key)) return -1;
        const val = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, val);
        return val;
    }
    put(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.capacity) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, value);
    }
}`
    },
    testCases: [
      { id: 'l1', input: 'LRUCache(2); put(1,1); put(2,2); get(1); put(3,3); get(2);', expectedOutput: 'get(1)->1, get(2)->-1' },
      { id: 'l2', input: 'put(4,4); get(1);', expectedOutput: 'get(1)->-1', isHidden: true }
    ]
  }
];

export const LEADERBOARD_ENTRIES: LeaderboardEntry[] = [
  { rank: 1, name: 'Samantha Chen', college: 'MIT', score: 96, streakDays: 14, badge: 'Grand Master', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  { rank: 2, name: 'Alex Mercer (You)', college: 'Stanford University', score: 92, streakDays: 7, badge: 'Tech Wizard', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { rank: 3, name: 'David Miller', college: 'UC Berkeley', score: 89, streakDays: 11, badge: 'Code Ninja', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { rank: 4, name: 'Priya Sharma', college: 'IIT Bombay', score: 87, streakDays: 9, badge: 'System Architect', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
  { rank: 5, name: 'Lucas Rossi', college: 'Carnegie Mellon', score: 85, streakDays: 5, badge: 'Rising Star', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' }
];

export const ACHIEVEMENTS: AchievementBadge[] = [
  { id: 'ach_1', title: 'First Mock Interview', description: 'Completed your first full AI mock interview session.', icon: 'Award', unlocked: true, unlockedAt: '2026-02-01' },
  { id: 'ach_2', title: '7-Day Streak', description: 'Practiced mock interviews for 7 consecutive days.', icon: 'Flame', unlocked: true, unlockedAt: '2026-02-05' },
  { id: 'ach_3', title: 'Code Ninja', description: 'Scored 90%+ in a Technical Coding Round.', icon: 'Code', unlocked: true, unlockedAt: '2026-02-04' },
  { id: 'ach_4', title: 'System Architect', description: 'Successfully navigated a System Design interview at Hard level.', icon: 'Cpu', unlocked: false },
  { id: 'ach_5', title: 'Smooth Speaker', description: 'Achieved zero filler words in a 20-minute HR interview.', icon: 'Mic', unlocked: false }
];

export const DAILY_CHALLENGE: DailyChallenge = {
  id: 'daily_2026_08_06',
  date: 'Today',
  title: 'Google System Design Quickfire',
  company: 'Google',
  role: 'Software Engineer',
  roundType: 'System Design',
  question: 'How would you design a distributed rate limiter that handles 100,000 requests per second across multiple geographical regions with sub-5ms latency?',
  xpPoints: 150,
  completed: false
};

export const SAMPLE_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc_1',
    question: 'How does Redis achieve high performance and low latency?',
    answer: 'Redis is an in-memory data store using single-threaded asynchronous I/O multiplexing, avoiding context switching overhead while keeping data in RAM.',
    category: 'Database & System Design'
  },
  {
    id: 'fc_2',
    question: 'What is the STAR method for behavioral questions?',
    answer: 'Situation (context), Task (your goal), Action (specific steps you took), and Result (quantifiable outcomes and lessons learned).',
    category: 'Behavioral & HR'
  },
  {
    id: 'fc_3',
    question: 'Explain Virtual DOM reconciliation in React.',
    answer: 'React compares the previous virtual DOM tree with the updated virtual DOM tree using a diffing algorithm (O(n)), updating only the modified actual DOM nodes.',
    category: 'Frontend & React'
  },
  {
    id: 'fc_4',
    question: 'What is the difference between Process and Thread?',
    answer: 'A Process is an independent execution program with its own memory space. A Thread is a lightweight subset of a process sharing memory with other threads.',
    category: 'Operating Systems'
  }
];

export const RECENT_EVALUATION_SAMPLE: EvaluationReport = {
  id: 'eval_mock_101',
  config: {
    id: 'cfg_101',
    roundType: 'Technical',
    difficulty: 'Medium',
    duration: 20,
    company: 'Google',
    role: 'Software Engineer',
    useVoice: true,
    useCamera: true,
    focusAreas: ['System Design', 'React', 'Algorithms']
  },
  completedAt: '2026-08-05T14:30:00Z',
  overallScore: 88,
  metrics: {
    technicalKnowledge: 86,
    communication: 92,
    confidence: 85,
    grammar: 94,
    vocabulary: 88,
    problemSolving: 89,
    logicalThinking: 90,
    leadership: 82,
    behavior: 87,
    speakingSpeed: 84,
    fillerWords: 91,
    professionalism: 93
  },
  strengths: [
    'Excellent clarity when explaining architectural choices in system design',
    'Demonstrated strong knowledge of asynchronous React state patterns',
    'Controlled tone and energetic presentation with low filler words'
  ],
  weaknesses: [
    'Should go deeper into cache invalidation strategy edge cases',
    'Slight rush when answering algorithmic time complexity questions'
  ],
  missedConcepts: [
    'Write-through vs Write-back caching trade-offs under high concurrency',
    'Consistent hashing virtual node distribution formula'
  ],
  questionReviews: [
    {
      question: 'How do you handle API state caching and cache invalidation in a large scale React app?',
      candidateAnswer: 'I use React Query or Redux Toolkit Query to cache API responses by endpoint key, setting stale time and invalidating tags when mutations occur.',
      idealAnswer: 'Explain key caching strategies (Stale-While-Revalidate, Normalized Caching), cache eviction policies (LRU), handling concurrent mutations with optimistic UI updates, and WebSocket real-time cache sync.',
      score: 90,
      feedback: 'Very practical answer. Mentioning optimistic updates and normalized entity caching would make it top-tier.'
    },
    {
      question: 'Explain how you would design a URL shortener service like Bitly handling 1 billion links.',
      candidateAnswer: 'I would use Base62 encoding on an auto-incrementing key or MD5 hash, store mapping in PostgreSQL with Redis cache for fast lookups.',
      idealAnswer: 'Cover key generation service (KGS) to avoid collisions, database partitioning strategies (sharding by hash prefix), CDN edge caching, and analytics pipeline with Kafka.',
      score: 86,
      feedback: 'Good overview. Great mention of Base62 encoding. Could expand on DB sharding and KGS.'
    }
  ],
  improvementPlan: [
    { day: 'Day 1', task: 'Study Consistent Hashing and Database Sharding in depth' },
    { day: 'Day 2', task: 'Practice 2 Medium System Design problems on Excalidraw' },
    { day: 'Day 3', task: 'Review React Concurrent Rendering and Server Components' },
    { day: 'Day 4', task: 'Record 3 video answers focusing on slow, deliberate pacing' },
    { day: 'Day 5', task: 'Conduct a 30-min mock behavioral interview using STAR method' },
    { day: 'Day 6', task: 'Solve 2 LeetCode Medium coding challenges on Arrays & DP' },
    { day: 'Day 7', task: 'Complete IntervuAI full Google Technical Mock Round' }
  ],
  summary: 'Great mock performance! You demonstrated strong technical proficiency and polished communication suitable for a Senior Engineer loop at Google.',
  transcript: [
    {
      questionId: 'q1',
      question: 'How do you handle API state caching and cache invalidation in a large scale React app?',
      answer: 'I use React Query or Redux Toolkit Query to cache API responses by endpoint key, setting stale time and invalidating tags when mutations occur.',
      timestamp: '02:15'
    },
    {
      questionId: 'q2',
      question: 'Explain how you would design a URL shortener service like Bitly handling 1 billion links.',
      answer: 'I would use Base62 encoding on an auto-incrementing key or MD5 hash, store mapping in PostgreSQL with Redis cache for fast lookups.',
      timestamp: '07:40'
    }
  ]
};
