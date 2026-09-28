import { useEffect, useState } from 'react'
import { ArrowRight, BookOpen, BrainCircuit, Code2, Gamepad2, Medal, PawPrint, ShieldCheck, Sparkles, Swords, Users } from 'lucide-react'
import type { PlayerProgress, View } from '../domain/game'
import { missions } from '../domain/game'
import { PixelHero, PixelPet } from './PixelCharacter'

export function HomePage({ progress, onNavigate, onStartMission }: { progress: PlayerProgress; onNavigate: (view: View) => void; onStartMission: (id: string) => void }) {
  const nextMission = missions.find(mission => !progress.completed.includes(mission.id)) ?? missions[missions.length - 1]
  const completePercent = Math.round((progress.completed.length / missions.length) * 100)
  const [reduceMotion, setReduceMotion] = useState(true)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduceMotion(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return <main>
    <section className="campaign-hero">
      {!reduceMotion && <video className="campaign-film" autoPlay muted loop playsInline preload="metadata" poster="/assets/archipelago-campaign.png" aria-hidden="true">
        <source src="/assets/archipelago-loop.mp4" type="video/mp4" />
      </video>}
      <div className="campaign-wind" aria-hidden="true"><i /><i /><i /><i /><i /></div>
      <div className="campaign-light" aria-hidden="true" />
      <div className="campaign-scrim" />
      <div className="campaign-copy">
        <span className="eyebrow"><Sparkles /> Біліммен әлемді өзгерт</span>
        <h1>Оқы. Құр.<br/><em>Әлемді оят.</em></h1>
        <p>Код жаз, жұмбақтарды шеш және Архипелагтың өшкен маяктарын қайта жақ.</p>
        <div className="hero-ctas">
          <button className="primary-cta" onClick={() => onStartMission(nextMission.id)}><Gamepad2 />Оқиғаны жалғастыру <ArrowRight /></button>
          <button className="ghost-cta" onClick={() => onNavigate('map')}><BookOpen />Тараулар картасы</button>
        </div>
        <div className="hero-progress-card">
          <span><b>1-ТАРАУ</b><small>Циклдер аралы</small></span>
          <i><u style={{ width: `${completePercent}%` }} /></i>
          <strong>{progress.completed.length}/{missions.length}</strong>
        </div>
      </div>
      <div className="hero-party" aria-hidden="true">
        <PixelHero avatar={progress.avatar} large />
        <PixelPet pet={progress.pet} />
      </div>
      <div className="floating-note note-one"><Code2 /><span><b>repeat(4)</b><small>көпірді іске қос</small></span></div>
      <div className="floating-note note-two"><Medal /><span><b>Сирек кубок</b><small>нақты шеберлік үшін</small></span></div>
    </section>

    <section className="promise-section">
      <div className="section-lead"><span>PIxED ЖҮЙЕСІ</span><h2>Ойын мен оқу — бір әрекет</h2><p>Әр тапсырмада алған білімің бірден ойын әлемінде жұмыс істейді.</p></div>
      <div className="promise-grid">
        <article><i className="promise-icon cyan"><BrainCircuit /></i><small>01 • ҮЙРЕН</small><h3>Түсін және болжам жаса</h3><p>Қысқа түсіндіру, тірі мысал және өз қарқыныңмен берілетін көмек.</p></article>
        <article><i className="promise-icon violet"><Code2 /></i><small>02 • ҚОЛДАН</small><h3>Код әлемді басқарады</h3><p>Жазған циклің көпірді, роботты және жарық жүйесін іске қосады.</p></article>
        <article><i className="promise-icon gold"><ShieldCheck /></i><small>03 • ДӘЛЕЛДЕ</small><h3>Жаңа есепте бекіт</h3><p>Кубок бір жауап үшін емес, білімді жаңа жағдайда қолданғаның үшін беріледі.</p></article>
      </div>
    </section>

    <section className="feature-band">
      <div><PawPrint /><span><b>Өз питомецің</b><small>Кодпен басқар және бірге дамыт</small></span></div>
      <div><Gamepad2 /><span><b>Сюжеттік миссиялар</b><small>Жалғыз ойнап толық оқуға болады</small></span></div>
      <div><Medal /><span><b>Мәнді жетістіктер</b><small>XP, коллекция және шеберлік кубоктары</small></span></div>
    </section>

    <section className="mode-section">
      <div className="section-lead"><span>БІР ЖҮЙЕ • БІР ПРОГРЕСС</span><h2>Әр режим білімді алға жылжытады</h2><p>Аватар, питомец, XP және шеберлік барлық режимде ортақ сақталады.</p></div>
      <div className="mode-grid">
        <article className="mode-card mode-card--live"><span><BookOpen /></span><small>ҚАЗІР ОЙНАУҒА БОЛАДЫ</small><h3>Сюжеттік сапар</h3><p>Жаңа ұғымды оқиға ішінде үйреніп, кодпен әлемге әсер ет.</p><button onClick={() => onStartMission(nextMission.id)}>Миссияға кіру <ArrowRight /></button></article>
        <article className="mode-card"><span><Users /></span><small>КЕЛЕСІ ТАРАУ</small><h3>Бірлескен экспедиция</h3><p>Екі оқушы рөлдерді бөлісіп, шешімді бір-біріне түсіндіреді.</p><b>Командалық шеберлік</b></article>
        <article className="mode-card"><span><Swords /></span><small>ЖОСПАРДА</small><h3>Білім аренасы</h3><p>MMR жылдамдыққа ғана емес, дәлдік пен тұрақты білімге сүйенеді.</p><b>Әділ рейтинг</b></article>
      </div>
    </section>
  </main>
}
