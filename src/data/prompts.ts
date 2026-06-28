/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WritingModeConfig, WritingCategory } from '../types';

export const WRITING_CATEGORIES: Record<WritingCategory, WritingModeConfig> = {
  opinion_essay: {
    id: 'opinion_essay',
    name: 'Opinion Essay',
    description: 'Express a personal viewpoint on a topic supported by strong logical reasoning and examples.',
    placeholder: 'Type your opinion essay here. Start with a captivating thesis statement...',
    outline: [
      'Introduction: Hook the reader, state your main thesis, and outline supporting arguments.',
      'Body Paragraph 1: Present your strongest argument supported by concrete evidence/examples.',
      'Body Paragraph 2: Present your second argument or address a counterargument with refutation.',
      'Conclusion: Restate your thesis in a new way, summarize your points, and leave a final thought.'
    ],
    tips: [
      'Use persuasive words (e.g., "Furthermore", "Evidently", "Consequently").',
      'Avoid weak phrases like "I think" and prefer stronger statements like "It is clear that".',
      'Keep your arguments focused on a single topic.'
    ]
  },
  book_summary: {
    id: 'book_summary',
    name: 'Book Summary',
    description: 'Provide an objective overview of a book\'s main plot, key themes, characters, and major takeaways.',
    placeholder: 'Type your book summary here. Begin with the book title, author, and genre...',
    outline: [
      'Introduction: Book title, author, genre, and a high-level summary of the central premise.',
      'Key Characters & Setting: Introduce main figures and where the story takes place.',
      'Plot / Core Ideas: Describe major plot points or primary non-fiction concepts without spoilers.',
      'Key Themes & Reflection: What are the main messages of the book, and what is your overall takeaway?'
    ],
    tips: [
      'Focus on the main narrative arc rather than small side-plots.',
      'If it is non-fiction, summarize the primary arguments or lessons.',
      'Be objective; save your personal critique for the reflection section.'
    ]
  },
  official_letter: {
    id: 'official_letter',
    name: 'Official Letter',
    description: 'Draft a formal business, request, or complaint letter using correct professional structure.',
    placeholder: 'Sender Address\nDate\n\nRecipient Address\n\nSubject: [Formal Subject Line]\n\nDear [Name or Title],...',
    outline: [
      'Sender & Recipient Info: Date, sender\'s address, and recipient\'s name/address.',
      'Salutation: Formal greeting (e.g., "Dear Hiring Manager,", "To Whom It May Concern,").',
      'Opening Paragraph: Clearly state the purpose of the letter (the "Why").',
      'Body Paragraphs: Provide context, details, and necessary explanation.',
      'Call to Action: State what response or action you expect next.',
      'Sign-off: Formal closing (e.g., "Sincerely,", "Respectfully,") followed by your name.'
    ],
    tips: [
      'Keep the tone formal, polite, and direct.',
      'Avoid contractions (e.g., write "do not" instead of "don\'t").',
      'Check spacing: Leave a blank line between each section of the letter.'
    ]
  },
  daily_journal: {
    id: 'daily_journal',
    name: 'Daily Journal',
    description: 'Reflect on your day, thoughts, feelings, and experiences in an informal, expressive layout.',
    placeholder: 'Dear Diary / Today\'s Reflection:\n\nToday was an interesting day because...',
    outline: [
      'Date & Mood Indicator: Mark the date and your current emotional state.',
      'Daily Review: Describe the most impactful events or encounters of your day.',
      'Deep Reflection: Explore how those events made you feel, and why they matter.',
      'Gratitude & Intent: Jot down 1-3 things you are grateful for today, and goals for tomorrow.'
    ],
    tips: [
      'Write freely without worrying too much about grammar or structure.',
      'Be honest with yourself; a journal is your safe space.',
      'Focus on sensory details (what you saw, heard, felt).'
    ]
  },
  free_writing: {
    id: 'free_writing',
    name: 'Free Writing',
    description: 'Unleash your creativity with no structural limits. Great for creative stories or quick brainstorming.',
    placeholder: 'Let your thoughts flow freely. There are no rules in free writing...',
    outline: [
      'No fixed structure: Write whatever comes to your mind.',
      'Keep writing: If you get stuck, write about why you are stuck or re-read your last sentence.',
      'Experiment: Try a poetry piece, a short sci-fi story, or a stream-of-consciousness list.'
    ],
    tips: [
      'Do not self-edit while writing; fix spelling and grammar later.',
      'Set a high target word count to push past initial blocks.',
      'Write continuously without pausing the timer.'
    ]
  }
};
