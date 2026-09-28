import type { SVGProps } from 'react'

const paths = {
  ArrowRight: 'M2 7h9V4h2v2h2v2h2v2h-2v2h-2v2h-2v-3H2Z',
  Gamepad2: 'M4 3h12v2h2v10h-5v-3H7v3H2V5h2Zm1 3v2H3v2h2v2h2v-2h2V8H7V6Zm8 1v2h2V7Zm2 3v2h2v-2Z',
  Home: 'M8 2h4v2h2v2h2v2h2v2h-2v8h-5v-6H9v6H4v-8H2V8h2V6h2V4h2Zm-2 8v6h1v-6h6v6h1v-6Z',
  Coins: 'M5 2h8v2h2v2h2v8h-2v2h-2v2H5v-2H3v-2H1V6h2V4h2Zm0 4v8h8V6Zm3 1h2v6H8Z',
  Star: 'M8 1h4v5h6v4h-3v3h1v5h-4v-3H8v3H4v-5h1v-3H2V6h6Zm0 7H5v2h3v3h4v-3h3V8h-3V5H8Z',
  UserRound: 'M6 1h8v2h2v6h-2v2H6V9H4V3h2Zm0 3v4h8V4ZM4 12h12v2h2v5h-3v-4H5v4H2v-5h2Z',
  Play: 'M5 2h3v2h3v2h3v2h3v4h-3v2h-3v2H8v2H5Z',
  LockKeyhole: 'M6 1h8v2h2v5h2v11H2V8h2V3h2Zm1 3v4h6V4Zm2 7v5h2v-5Z',
  Sparkles: 'M8 1h3v5h5v3h-5v5H8V9H3V6h5Zm7 12h2v2h2v2h-2v2h-2v-2h-2v-2h2Z',
  Code2: 'M5 4h3v3H5v2H3v2h2v2h3v3H5v-2H3v-2H1V8h2V6h2Zm8 0h3v2h2v2h2v4h-2v2h-2v2h-3v-3h3v-2h2V9h-2V7h-3ZM10 2h2v16h-2Z',
  BrainCircuit: 'M5 2h4v2h2V2h4v2h2v3h2v7h-2v3h-4v2H7v-2H3v-3H1V7h2V4h2Zm0 4v3H3v3h3v3h2V5H5Zm7-1v10h2v-3h3V9h-2V6h-3Z',
  Check: 'M15 4h3v3h-3v3h-3v3H9v3H6v-3H3v-3H1V7h3v3h3v2h2V9h3V6h3Z',
  X: 'M3 2h3v3h3v3h2V5h3V2h3v3h-3v3h-3v4h3v3h3v3h-3v-3h-3v-3H9v3H6v3H3v-3h3v-3h3V8H6V5H3Z',
  Compass: 'M5 1h10v2h3v3h1v8h-1v3h-3v2H5v-2H2v-3H1V6h1V3h3Zm0 3v2H4v8h2v2h8v-2h2V6h-2V4Zm6 2h3v3h-3v3H8v2H6v-3h2V8h3Z',
  Lightbulb: 'M6 1h8v2h3v3h1v5h-3v4H5v-4H2V6h1V3h3Zm0 4v6h2v2h4v-2h2V5ZM6 17h8v2H6Z',
  Users: 'M3 2h5v6H3ZM12 2h5v6h-5ZM1 10h9v8H7v-5H4v5H1ZM11 10h8v8h-3v-5h-2v5h-3Z',
  WandSparkles: 'M13 1h2v3h3v2h-3v3h-2V6h-3V4h3ZM3 14h2v-2h2v-2h2V8h3v3h-2v2H8v2H6v3H3Z',
} as const
function makeIcon(name: keyof typeof paths) {
  return function PixelIcon(props: SVGProps<SVGSVGElement>) { return <svg {...props} viewBox="0 0 20 20" fill="currentColor" shapeRendering="crispEdges" aria-hidden="true" className={`pixel-icon ${props.className ?? ''}`}><path fillRule="evenodd" d={paths[name]}/></svg> }
}
export const ArrowRight = makeIcon('ArrowRight'), Gamepad2 = makeIcon('Gamepad2'), Home = makeIcon('Home'), Coins = makeIcon('Coins'), Star = makeIcon('Star'), UserRound = makeIcon('UserRound'), Play = makeIcon('Play'), LockKeyhole = makeIcon('LockKeyhole'), Sparkles = makeIcon('Sparkles'), Code2 = makeIcon('Code2'), BrainCircuit = makeIcon('BrainCircuit'), Check = makeIcon('Check'), X = makeIcon('X'), Compass = makeIcon('Compass'), Lightbulb = makeIcon('Lightbulb'), Users = makeIcon('Users'), WandSparkles = makeIcon('WandSparkles')
