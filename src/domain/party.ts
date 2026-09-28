export const heroes = {
  girl: { name: 'Luna', role: 'Pathfinder', color: '#73c8b1', trait: 'Notice the little things', benefit: 'Clue lens', detail: 'Separate what you know from what you need to discover.', tip: 'Read the question twice. Name one fact you know, then find what is still missing.' },
  boy: { name: 'Max', role: 'Inventor', color: '#b09cde', trait: 'One clever step at a time', benefit: 'Step planner', detail: 'Turn a tricky question into a small, clear plan.', tip: 'Make a tiny plan: 1. Find the goal. 2. Choose the rule. 3. Check the result.' },
  iris: { name: 'Iris', role: 'Star maker', color: '#edb0bd', trait: 'Imagine another way', benefit: 'Idea spark', detail: 'Try a small example or sketch a different solution.', tip: 'Imagine a smaller version of the problem. Can you draw it or test it with just two objects?' },
  kai: { name: 'Kai', role: 'Forest keeper', color: '#b6cc80', trait: 'Patient, kind and curious', benefit: 'Careful check', detail: 'Check your reasoning before you take the next step.', tip: 'Take your time. Read every choice and check whether it follows all the rules in the question.' },
} as const
export const companions = {
  fox: { name:'Nova',label:'Sky fox',color:'#e8ad73',trait:'Curious little scout',benefit:'Trail clue',detail:'Hides one incorrect option when you ask for help.',action:'Find a trail clue' },
  bot: { name:'Byte',label:'Pocket robot',color:'#91d7cf',trait:'Your tiny planning partner',benefit:'Idea pad',detail:'Opens a little notepad so you can work through an idea.',action:'Open my idea pad' },
  owl: { name:'Orbit',label:'Star owl',color:'#c2a8e0',trait:'A thoughtful night reader',benefit:'Wise hint',detail:'Explains the rule behind the question before you answer.',action:'Explain the idea' },
  turtle: { name:'Moss',label:'Garden turtle',color:'#bad391',trait:'A calm friend, always nearby',benefit:'Quiet moment',detail:'Offers a calm pause and a simple focus checklist.',action:'Take a quiet moment' },
} as const
export type HeroChoice = keyof typeof heroes
export type CompanionChoice = keyof typeof companions
