import { useEffect, useRef, useState } from 'react'
import { PlayerAvatar, PetAvatar, type LearnerProfile } from './WelcomeQuest'
import { heroes, companions } from '../domain/party'
import { ArrowRight, Check, X } from './PixelIcons'

type Question = { prompt: string; options: string[]; correct: number; why: string }
export const modes = [
  {id:'flag', title:'Capture the Flag', subject:'Logic', image:'0% 0%', blurb:'Follow the clues. Find a safe route to the flag.', label:'Three clues', questions:[
    {prompt:'Every blue gate is open. Your gate is blue. Can you pass?',options:['Yes','No','Only at night'],correct:0,why:'The rule applies to every blue gate, including yours.'},
    {prompt:'The flag is east of the tower. You are west of it. Which way should you go?',options:['North','East','West'],correct:1,why:'Moving east takes you toward the tower and then the flag.'},
    {prompt:'A path needs a key AND a torch. You have a key. What else do you need?',options:['Another key','A map','A torch'],correct:2,why:'AND means both conditions must be true.'}]},
  {id:'battle',title:'Team Battle',subject:'Coding',image:'50% 0%',blurb:'Power your spell with three smart coding choices.',label:'Practice duel',questions:[
    {prompt:'repeat(3) { spark() } creates how many sparks?',options:['1','3','6'],correct:1,why:'The loop runs spark() once for each of its three repetitions.'},
    {prompt:'Which command should come first to cross a closed door?',options:['walk()','openDoor()','celebrate()'],correct:1,why:'The door must be open before the hero can walk through it.'},
    {prompt:'You need 4 sparks, but repeat(5) creates too many. What should change?',options:['Change 5 to 4','Run it twice','Remove spark()'],correct:0,why:'The repetition count controls the number of sparks.'}]},
  {id:'base',title:'Base Defense',subject:'Math',image:'100% 0%',blurb:'Plan your supplies and prepare the castle defenses.',label:'Resource puzzle',questions:[
    {prompt:'Three walls need 4 blocks each. How many blocks do you need?',options:['7','12','16'],correct:1,why:'3 walls × 4 blocks = 12 blocks.'},
    {prompt:'You have 20 blocks and use 12. How many remain?',options:['8','12','32'],correct:0,why:'20 − 12 = 8 blocks left.'},
    {prompt:'Split 8 supplies equally between 2 towers. How many per tower?',options:['2','6','4'],correct:2,why:'8 ÷ 2 = 4 supplies for each tower.'}]},
  {id:'race',title:'Knowledge Race',subject:'Math',image:'0% 100%',blurb:'Spot the pattern and guide your runner to the finish.',label:'Pattern trail',questions:[
    {prompt:'Keep the trail going: 2, 4, 6, …',options:['7','8','10'],correct:1,why:'Each number increases by 2.'},
    {prompt:'Next checkpoint: 3, 6, 12, …',options:['15','18','24'],correct:2,why:'Each number doubles. 12 × 2 = 24.'},
    {prompt:'Finish the countdown: 20, 15, 10, …',options:['5','0','8'],correct:0,why:'Subtract 5 at every step.'}]},
  {id:'dungeon',title:'Dungeon Explorer',subject:'Science',image:'50% 100%',blurb:'Light the hidden rooms with careful observation.',label:'Discovery quest',questions:[
    {prompt:'Which source can power your lantern using renewable energy?',options:['Coal','Sunlight','Oil'],correct:1,why:'Sunlight is naturally replenished; coal and oil are finite resources.'},
    {prompt:'A plant bends toward the window. What is it responding to?',options:['Light','The wall color','The pot name'],correct:0,why:'Plants can grow toward light, a response called phototropism.'},
    {prompt:'To test whether light helps a plant grow, what should you change?',options:['Everything','Only the amount of light','The plant and soil together'],correct:1,why:'Changing one variable helps you identify its effect.'}]},
  {id:'survival',title:'Survival',subject:'Logic',image:'100% 100%',blurb:'Choose wisely and keep your expedition moving.',label:'Decision challenge',questions:[
    {prompt:'Your lantern works only with a battery. It is working. What must it have?',options:['A battery','A map','A flag'],correct:0,why:'The battery is a necessary condition for the lantern to work.'},
    {prompt:'You can take a bridge OR a boat. The bridge is closed. What can you use?',options:['The bridge','The boat','Neither'],correct:1,why:'OR lets you use either available route; the boat is still available.'},
    {prompt:'All safe shelters have roofs. This shelter has no roof. Is it safe under this rule?',options:['Yes','Sometimes','No'],correct:2,why:'Without a roof it does not satisfy the necessary condition.'}]},
] satisfies Array<{id:string; title:string; subject:string;image:string;blurb:string;label:string;questions:Question[]}>

export function AdventureMode({ id, profile, onClose, onFinish }: {id:string;profile:LearnerProfile;onClose:()=>void;onFinish:(id:string,score:number)=>void}) {
  const mode = modes.find(m => m.id === id)!
  const [index,setIndex] = useState(0), [choice,setChoice] = useState<number|null>(null), [score,setScore] = useState(0), [done,setDone] = useState(false)
  const panel = useRef<HTMLElement>(null)
  const [help,setHelp]=useState(false),[heroTip,setHeroTip]=useState(false),[note,setNote]=useState('')
  const helper=companions[profile.pet]
  const hiddenOption=profile.pet==='fox'&&help?questionWrong():-1
  function questionWrong(){return mode.questions[index].options.findIndex((_,n)=>n!==mode.questions[index].correct)}
  useEffect(() => { const prior=document.body.style.overflow; document.body.style.overflow='hidden';panel.current?.focus(); return()=>{document.body.style.overflow=prior} },[])
  const question = mode.questions[index]
  const next = () => { const total=score+(choice===question.correct?1:0); setScore(total); if(index===2){setDone(true);onFinish(id,total)}else{setIndex(index+1);setChoice(null);setHelp(false);setHeroTip(false);setNote('')} }
  return <div className="setup-backdrop" role="dialog" aria-modal="true" aria-labelledby="adventure-title"><section ref={panel} tabIndex={-1} className="setup-window" onKeyDown={e=>{if(e.key==='Escape')onClose();if(e.key==='Tab'){const nodes=panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled), textarea');if(!nodes?.length)return;const first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&(document.activeElement===first||document.activeElement===panel.current)){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}}}>
    <header><div><small>{mode.subject.toUpperCase()} · SOLO PRACTICE</small><b>{mode.title}</b></div><button aria-label="Close adventure" onClick={onClose}><X/></button></header>
    <div className="setup-body"><div className="mode-stage"><div className="mode-stage-art" style={{backgroundPosition:mode.image}}/><div className="mode-party" style={{left:`${10+index*22}%`}}><PlayerAvatar choice={profile.avatar} large/><PetAvatar choice={profile.pet}/></div><div className="mode-checkpoints">{[0,1,2].map(n=><i key={n} className={n<=index?'lit':''}/>)}</div></div>
      {done?<><small className="step-label">ADVENTURE COMPLETE</small><h2 id="adventure-title">{score===3?'A perfect expedition!':'Every attempt teaches you.'}</h2><p>{score} of 3 correct. Your best result is saved. Replay whenever you want to practise.</p><button className="setup-next" onClick={onClose}>Back to my world <ArrowRight/></button></>:<><small className="step-label">CHECKPOINT {index+1} OF 3</small><h2 id="adventure-title">{question.prompt}</h2><div className="adventure-helpers"><button className="hero-help" aria-expanded={heroTip} onClick={()=>setHeroTip(!heroTip)}><PlayerAvatar choice={profile.avatar}/><span>{heroes[profile.avatar].name}’s {heroes[profile.avatar].benefit.toLowerCase()}</span></button><button className="pet-help" aria-expanded={help} disabled={choice!==null} onClick={()=>setHelp(!help)}><PetAvatar choice={profile.pet}/><span>{helper.action}</span></button></div>{heroTip&&<p className="helper-note">{heroes[profile.avatar].tip}</p>}{help&&<div className="companion-help-panel" aria-live="polite"><b>{profile.petName} · {helper.benefit}</b>{profile.pet==='fox'?<p>One wrong path is hidden. Read the remaining choices carefully.</p>:profile.pet==='bot'?<label>Try a small plan. Your notes stay here for this checkpoint.<textarea maxLength={600} value={note} onChange={e=>setNote(e.target.value)} placeholder="What do I know? What should I try?"/></label>:profile.pet==='owl'?<p>{question.why}</p>:<><div className="quiet-orbit"><PetAvatar choice="turtle"/></div><p>No rush. Rest your eyes, relax your shoulders, then read one sentence at a time.</p><ul><li>What is the question asking?</li><li>Which facts matter?</li><li>Does my choice fit those facts?</li></ul><button className="text-button" onClick={()=>setHelp(false)}>I’m ready to continue <ArrowRight/></button></>}</div>}<div className="challenge-options">{question.options.map((option,n)=><button key={option} disabled={choice!==null||n===hiddenOption} onClick={()=>setChoice(n)} className={choice!==null&&n===question.correct?'correct':choice===n?'incorrect':''}><span>{String(n+1).padStart(2,'0')}</span>{n===hiddenOption?'A wrong trail — ruled out':option}{choice!==null&&n===question.correct&&<Check/>}</button>)}</div>{choice!==null&&<div className="answer-feedback" role="status"><b>{choice===question.correct?'You got it.':'Let’s figure it out.'}</b><p>{question.why}</p></div>}<button className="setup-next" disabled={choice===null} onClick={next}>{index===2?'Finish adventure':'Next checkpoint'}<ArrowRight/></button></>}
    </div></section></div>
}
