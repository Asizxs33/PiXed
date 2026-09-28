type Hero = 'girl' | 'boy'
type Pet = 'fox' | 'bot' | 'owl'

// Whole-body artwork on a shared 64px grid; movable parts retain their pixel edges.
export function HeroSprite({ choice, large = false }: { choice: Hero; large?: boolean }) {
  const girl = choice === 'girl'
  return <span className={`sprite sprite-hero ${large ? 'sprite-large' : ''}`} role="img" aria-label={girl ? 'Luna, a teal-cloaked explorer with boots and a satchel' : 'Max, a violet-cloaked explorer with boots and a satchel'}>
    <svg viewBox="0 0 64 80" shapeRendering="crispEdges" aria-hidden="true">
      <ellipse cx="32" cy="75" rx="19" ry="3" fill="#071426" opacity=".5"/>
      <g className="sprite-breathe">
        <path className="sprite-cape" d="M22 32H42V46H47V56H43V61H19V53H16V43H22Z" fill={girl ? '#247d82' : '#665899'}/>
        <path d="M24 54H31V69H22V62H24ZM34 54H41V63H43V69H34Z" fill="#28364b"/>
        <path d="M21 67H31V73H18V70H21ZM34 67H43V70H46V73H34Z" fill="#513c3e"/>
        <path d="M18 73H31V75H18ZM34 73H46V75H34Z" fill="#bf9671"/>
        <path d="M23 31H41V37H44V54H40V58H24V54H20V37H23Z" fill={girl ? '#52b9ad' : '#8c82c5'}/>
        <path d="M24 36H28V53H24ZM38 37H42V53H38Z" fill={girl ? '#318d90' : '#696296'}/>
        <path d="M20 38H24V52H17V45H18V40H20ZM41 38H45V42H47V51H41Z" fill={girl ? '#7ad5ba' : '#aea2df'}/>
        <path d="M17 51H24V57H18V55H17ZM41 51H47V56H45V58H41Z" fill="#efb78a"/>
        <path d="M25 32H39V36H35V42H30V36H25Z" fill="#f5d48c"/>
        <path d="M22 52H42V56H22Z" fill="#62494a"/><path d="M30 51H35V57H30Z" fill="#e4b966"/>
        <path d="M37 34H40V52H37Z" fill="#b98758"/><path d="M37 45H46V55H37Z" fill="#a46d4e"/><path d="M38 45H45V48H38Z" fill="#e0ac71"/>
        <g className="sprite-head">
          <path d={girl ? 'M20 11H43V17H47V37H41V30H21V39H16V19H20Z' : 'M20 10H39V13H44V18H47V28H19V24H16V16H20Z'} fill="#3e303e"/>
          <path d="M22 18H42V30H39V34H26V31H22Z" fill="#efb78a"/>
          <path d="M23 27H26V31H39V33H27V34H25V31H23Z" fill="#ce8a70"/>
          <path d="M20 15H43V19H35V22H29V18H23V23H20Z" fill="#65434a"/>
          <path d="M23 13H37V16H23Z" fill="#97604f"/>
          <g className="sprite-eyes"><path d="M27 24H30V28H27ZM36 24H39V28H36Z" fill="#293349"/><path d="M27 24H28V25H27ZM36 24H37V25H36Z" fill="#fff4d4"/></g>
          <path d="M31 30H35V31H31Z" fill="#a26464"/>
          {girl && <><path d="M17 27H21V43H16V38H15V32H17Z" fill="#775052"/><path d="M16 36H21V39H16Z" fill="#e8bd68"/><path d="M39 17H46V20H39Z" fill="#f1d08d"/></>}
        </g>
      </g>
    </svg>
  </span>
}

export function CompanionSprite({ choice, large = false }: { choice: Pet; large?: boolean }) {
  return <span className={`sprite sprite-pet pet-${choice} ${large ? 'sprite-large' : ''}`} role="img" aria-label={{fox:'Nova, an orange fox with a cream tail',bot:'Byte, a floating teal robot',owl:'Orbit, a purple owl with golden eyes'}[choice]}>
    <svg viewBox="0 0 64 64" shapeRendering="crispEdges" aria-hidden="true">
      <ellipse cx="32" cy="58" rx="20" ry="3" fill="#071426" opacity=".5"/>
      {choice === 'fox' ? <g className="sprite-breathe">
        <g className="sprite-tail"><path d="M39 43H47V37H51V26H58V44H54V51H43Z" fill="#d78049"/><path d="M51 26H58V38H54V41H49V34H51Z" fill="#fff0cc"/></g>
        <path d="M20 36H42V49H39V55H32V50H25V55H18V47H16V41H20Z" fill="#d78049"/><path d="M25 39H37V48H25Z" fill="#f6dab0"/>
        <g className="sprite-head"><path d="M14 14H18V18H23V24H38V18H43V14H47V34H43V40H36V44H25V41H18V36H14Z" fill="#ec9c57"/><path d="M17 21H20V30H17ZM41 21H44V30H41Z" fill="#78494d"/>
        <path d="M17 34H25V37H37V34H44V38H39V42H24V40H19Z" fill="#ffedc7"/><g className="sprite-eyes"><path d="M22 30H26V34H22ZM36 30H40V34H36Z" fill="#343044"/></g><path d="M29 36H34V39H29Z" fill="#343044"/></g>
        <path d="M22 43H40V46H22Z" fill="#378d95"/><path d="M29 44H33V49H29Z" fill="#f1cc78"/>
      </g> : choice === 'bot' ? <g className="sprite-float">
        <path d="M30 9H34V18H30Z" fill="#6ea4b0"/><path d="M28 7H36V11H28Z" fill="#edca78"/>
        <path d="M15 18H49V23H53V42H48V47H16V42H11V24H15Z" fill="#8fd5d0"/><path d="M15 22H49V38H45V42H19V38H15Z" fill="#253c54"/>
        <g className="sprite-eyes" fill="#9bf0cd"><path d="M21 28H26V34H21ZM38 28H43V34H38Z"/></g><path d="M28 36H36V38H28Z" fill="#9bf0cd"/>
        <path d="M23 45H41V52H23Z" fill="#5d9ea9"/><path d="M28 51H36V56H28Z" fill="#ffe0a1"/>
        <path className="sprite-wing" d="M7 29H12V42H7V39H4V32H7ZM52 29H57V32H60V39H57V42H52Z" fill="#d5e9da"/>
        <path d="M18 19H28V21H18Z" fill="#d7f0df"/>
      </g> : <g className="sprite-breathe">
        <path d="M17 14H22V19H42V14H47V24H50V44H45V51H38V55H25V52H19V47H14V26H17Z" fill="#8f80b6"/>
        <path className="sprite-wing" d="M13 30H19V47H23V51H16V46H11V36H13ZM45 30H51V36H54V46H49V51H42V47H45Z" fill="#605888"/>
        <path d="M23 37H41V49H37V53H27V50H23Z" fill="#d1bcdc"/><path d="M27 43H30V46H27ZM35 43H38V46H35ZM31 48H34V51H31Z" fill="#a08dbb"/>
        <path d="M18 24H29V37H18ZM35 24H46V37H35Z" fill="#f2d9a3"/><g className="sprite-eyes"><path d="M23 27H27V33H23ZM37 27H41V33H37Z" fill="#30334c"/></g><path d="M29 35H35V38H32V41H29Z" fill="#dda65d"/>
        <path d="M23 54H29V58H21V56H23ZM36 54H42V56H44V58H36Z" fill="#e7b86d"/>
      </g>}
    </svg>
  </span>
}
