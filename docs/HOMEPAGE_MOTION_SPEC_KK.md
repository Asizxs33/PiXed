# Басты бет анимациясының спецификациясы

## Мақсат

Анимация баланы әрекетке шақырады, бірақ мәтін мен оқу мақсатын басып кетпейді. Сондықтан қозғалыс тек басты бетте, дыбыссыз және баяу жүреді. Сабақ, карта, шеберхана мен кубоктар бетінде cinematic фон қолданылмайды.

## Қазіргі іске асыру

- `public/assets/archipelago-loop.mp4` — 8 секунд, 1280×640, H.264, дыбыссыз.
- Камера қозғалысы периодтық формуламен бастапқы орнына қайтады, сондықтан loop түйіскені байқалмайды.
- CSS қабаттары жел сызықтарын, жарықтың баяу өзгерісін, кейіпкердің «тынысын» және UI карточкаларының idle-қимылын қосады.
- `prefers-reduced-motion` қосылғанда видео DOM-ға салынбайды, статикалық постер қалады.
- Видео `preload="metadata"` арқылы тек басты бетте жүктеледі.

## Higgsfield-ке дайын prompt

Негізгі сурет: `public/assets/archipelago-campaign.png`.

```text
Animate this exact 16-bit pixel-art educational fantasy archipelago as a calm seamless 8-second idle loop. Locked wide camera with only a very subtle breathing push-in and return. Gentle wind moves the tree crowns, grass, small flags and the explorer's clothes by a few pixels. The child explorer and friendly fox robot pet have subtle idle breathing and blinking. Waterfalls and tiny lighthouse glows move softly. Preserve every island, bridge, character design, color palette and pixel-art geometry. Keep the left third calm and readable for UI text. No cuts, no new objects, no morphing, no camera orbit, no text, no logo, no audio. First and last frame must visually match for an invisible loop.
```

## Генерация шектеуі

Higgsfield-тегі ағымдағы Seedance 2.5 параметрі 5 секундтық 1080p генерацияға интерфейсте 60 credit көрсетеді. Генерацияны жібермес бұрын аккаунтқа кіру және Terms/18+ келісімін пайдаланушының өзі растауы қажет. Осы себепті репозиторийде қазір нөл credit жұмсайтын, дәл циклденетін жергілікті нұсқа бар; кейін Higgsfield нәтижесі сол файл атымен алмастырылады.

## Қабылдау шарттары

1. Басты бетте видео автоматты ойнайды, muted және `playsInline`.
2. 8.0 секундтан кейін қайта басталғанда секіру байқалмайды.
3. Мобильді бетте көлденең overflow жоқ.
4. Қозғалысты азайту баптауы қосылса, статикалық сурет көрсетіледі.
5. CTA мәтіні мен прогресс карточкасы кез келген кадрда оқылады.
