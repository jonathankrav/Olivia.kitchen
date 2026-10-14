export type Language = 'en' | 'he' | 'ru'

export const contact = {
  email: 'chef@olivia.kitchen',
  whatsappNumber: '+972587217215',
}

export const content = {
  en: {
    skip: 'Skip to content', stamp: ['Three kitchens.', 'One beautiful table.'],
    nav: ['The experience', 'My kitchens', 'Gallery'], book: 'Let’s plan your table',
    eyebrow: 'PRIVATE CHEF · HAIFA & THE NORTH', hero: ['A big soul.', 'A lot of flavour.'],
    intro: 'Three culinary traditions. One unforgettable table. Beautiful food, made with care, in the comfort of your home.',
    explore: 'Discover my kitchens', scroll: 'A taste of what’s to come', photoNote: 'GOOD FOOD. GOOD COMPANY.',
    ribbon: ['Made with love', 'Seasonal ingredients', 'Your home, your occasion', 'Always a personal touch'],
    experienceLabel: 'WELCOME TO MY TABLE', experienceTitle: 'More than a meal.\nA moment to remember.',
    experienceText: 'The best evenings begin around a table. I’m Olivia, and I bring the warmth of Israeli, Italian, and Azerbaijani cooking to yours. A menu shaped around you, thoughtfully prepared, and made for sharing.',
    experienceEnd: 'You bring the people. I’ll bring the flavour.', signature: 'With love, Olivia',
    kitchensLabel: 'THREE ROOTS. ONE KITCHEN.', kitchensTitle: 'A world of flavour,\nclose to home.',
    kitchensIntro: 'Different traditions, the same love for bringing people together. Pick a favourite, or let us create a menu that crosses borders.',
    cuisineNames: ['Israeli', 'Italian', 'Azerbaijani'],
    cuisineNotes: ['Fresh, vibrant & generous', 'Simple, soulful & seasonal', 'Warm, aromatic & heartfelt'],
    cuisineDescriptions: ['Colourful mezze, bright herbs, and beautiful ingredients. A sun-filled table made for sharing.', 'Handmade pasta, seasonal produce, and the joy of a long, unhurried meal. A little taste of la dolce vita.', 'Fragrant saffron rice, fresh herbs, and comforting flavours. A rich tradition of welcoming people to the table.'],
    galleryLabel: 'FROM THE KITCHEN', galleryTitle: 'A feast for the eyes.', galleryText: 'A little inspiration for your next gathering.', all: 'All flavours', savoury: 'Starters & mains', desserts: 'Desserts',
    imageDisclosure: 'Photographs of dishes prepared by Olivia. © JonathanKrav', viewImage: 'View image', close: 'Close',
    contactLabel: 'LET’S MAKE SOMETHING SPECIAL', contactTitle: 'Your next beautiful\nevening starts here.',
    contactText: 'An intimate dinner, a family celebration, or simply a reason to gather. Tell me a little about your plans, and we’ll take it from there.',
    emailLabel: 'WRITE TO ME', whatsapp: 'Connect on WhatsApp', whatsappUnavailable: 'Leave your WhatsApp number in the form and request a reply there, or reach Olivia by email.', share: 'Share on WhatsApp',
    name: 'Your name', email: 'Email address', phone: 'Phone / WhatsApp', date: 'Preferred date', guests: 'Number of guests', cuisine: 'Your favourite kitchen', choose: 'Let Olivia inspire me', message: 'Tell me about your occasion',
    namePlaceholder: 'How should I call you?', phonePlaceholder: 'Include country code', messagePlaceholder: 'The occasion, your ideas, dietary needs…',
    optional: 'optional', send: 'Send my inquiry', sending: 'Sending your inquiry…', privacy: 'Your details are only used to respond to your inquiry.',
    success: 'Your inquiry is on its way!', successText: 'Thank you for inviting me to your table. I’ll be in touch by email to talk about your plans.', another: 'Send another inquiry', error: 'Your inquiry couldn’t be sent. Please try again or email chef@olivia.kitchen.',
    footer: 'Good food brings us together.', rights: 'Olivia Kitchen. Made with love.', menu: 'Open menu', language: 'Choose language', top: 'Back to top',
  },
  he: {
    skip: 'דילוג לתוכן', stamp: ['שלושה מטבחים.', 'שולחן יפה אחד.'],
    nav: ['החוויה', 'המטבחים שלי', 'גלריה'], book: 'נתכנן את הארוחה שלכם',
    eyebrow: 'שפית פרטית · חיפה והצפון', hero: ['הרבה נשמה.', 'הרבה טעם.'],
    intro: 'שלוש מסורות קולינריות. שולחן אחד בלתי נשכח. אוכל יפהפה, שמוכן באהבה, בנוחות של הבית שלכם.',
    explore: 'גלו את המטבחים שלי', scroll: 'טעימה ממה שמחכה לכם', photoNote: 'אוכל טוב. חברה טובה.',
    ribbon: ['עשוי באהבה', 'חומרי גלם עונתיים', 'הבית שלכם, האירוע שלכם', 'תמיד עם נגיעה אישית'],
    experienceLabel: 'ברוכים הבאים לשולחן שלי', experienceTitle: 'יותר מארוחה.\nרגע לזכור.',
    experienceText: 'הערבים הכי יפים מתחילים סביב שולחן. אני אוליביה, ואני מביאה אליכם את החום של המטבח הישראלי, האיטלקי והאזרבייג׳ני. תפריט שמותאם לכם, מוכן בתשומת לב ונועד לחלוק יחד.',
    experienceEnd: 'אתם מביאים את האנשים. אני אביא את הטעם.', signature: 'באהבה, אוליביה',
    kitchensLabel: 'שלושה שורשים. מטבח אחד.', kitchensTitle: 'עולם של טעמים,\nקרוב לבית.',
    kitchensIntro: 'מסורות שונות, אותה אהבה לחיבור בין אנשים. בחרו מטבח אהוב, או ניצור יחד תפריט שחוצה גבולות.',
    cuisineNames: ['ישראלי', 'איטלקי', 'אזרבייג׳ני'],
    cuisineNotes: ['טרי, צבעוני ונדיב', 'פשוט, מלא נשמה ועונתי', 'חם, ארומטי ומכל הלב'],
    cuisineDescriptions: ['מזטים צבעוניים, עשבי תיבול רעננים וחומרי גלם נהדרים. שולחן מלא שמש שנועד לחלוק.', 'פסטה בעבודת יד, תוצרת עונתית והנאה מארוחה ארוכה ונינוחה. טעימה קטנה מהחיים הטובים.', 'אורז זעפרן ריחני, עשבי תיבול טריים וטעמים מנחמים. מסורת עשירה של אירוח סביב השולחן.'],
    galleryLabel: 'מהמטבח', galleryTitle: 'חגיגה לעיניים.', galleryText: 'קצת השראה למפגש הבא שלכם.', all: 'כל הטעמים', savoury: 'פתיחות ועיקריות', desserts: 'קינוחים',
    imageDisclosure: 'צילומי מנות שהוכנו על ידי אוליביה. © JonathanKrav', viewImage: 'הצגת תמונה', close: 'סגירה',
    contactLabel: 'בואו ניצור משהו מיוחד', contactTitle: 'הערב היפה הבא שלכם\nמתחיל כאן.',
    contactText: 'ארוחת ערב אינטימית, חגיגה משפחתית או סתם סיבה להיפגש. ספרו לי קצת על התוכניות שלכם ונמשיך משם.',
    emailLabel: 'כתבו לי', whatsapp: 'יצירת קשר בוואטסאפ', whatsappUnavailable: 'השאירו בטופס את מספר הוואטסאפ שלכם ובקשו מענה שם, או פנו לאוליביה במייל.', share: 'שיתוף בוואטסאפ',
    name: 'השם שלכם', email: 'כתובת אימייל', phone: 'טלפון / וואטסאפ', date: 'תאריך מועדף', guests: 'מספר אורחים', cuisine: 'המטבח המועדף', choose: 'תנו לאוליביה להפתיע', message: 'ספרו לי על האירוע שלכם',
    namePlaceholder: 'איך לקרוא לכם?', phonePlaceholder: 'כולל קידומת מדינה', messagePlaceholder: 'האירוע, הרעיונות שלכם, צרכים תזונתיים…',
    optional: 'לא חובה', send: 'שליחת פנייה', sending: 'הפנייה נשלחת…', privacy: 'הפרטים שלכם ישמשו רק למענה לפנייה.',
    success: 'הפנייה שלכם בדרך!', successText: 'תודה שהזמנתם אותי לשולחן שלכם. אצור קשר באימייל כדי לדבר על התוכניות.', another: 'שליחת פנייה נוספת', error: 'לא ניתן לשלוח את הפנייה. נסו שוב או כתבו לכתובת chef@olivia.kitchen.',
    footer: 'אוכל טוב מחבר בינינו.', rights: 'אוליביה קיטשן. נוצר באהבה.', menu: 'פתיחת תפריט', language: 'בחירת שפה', top: 'חזרה לראש העמוד',
  },
  ru: {
    skip: 'Перейти к содержимому', stamp: ['Три кухни.', 'Один прекрасный стол.'],
    nav: ['Впечатления', 'Мои кухни', 'Галерея'], book: 'Спланируем ваш вечер',
    eyebrow: 'ЛИЧНЫЙ ШЕФ · ХАЙФА И СЕВЕР', hero: ['Много души.', 'Много вкуса.'],
    intro: 'Три кулинарные традиции. Один незабываемый стол. Прекрасная еда, приготовленная с заботой, у вас дома.',
    explore: 'Откройте мои кухни', scroll: 'Вкус того, что вас ждёт', photoNote: 'ХОРОШАЯ ЕДА. ПРИЯТНАЯ КОМПАНИЯ.',
    ribbon: ['Приготовлено с любовью', 'Сезонные продукты', 'Ваш дом, ваш праздник', 'Всегда индивидуально'],
    experienceLabel: 'ДОБРО ПОЖАЛОВАТЬ К МОЕМУ СТОЛУ', experienceTitle: 'Больше, чем ужин.\nМомент на память.',
    experienceText: 'Лучшие вечера начинаются за общим столом. Я Оливия, и я приношу в ваш дом тепло израильской, итальянской и азербайджанской кухни. Меню именно для вас, приготовленное с вниманием и созданное для близких.',
    experienceEnd: 'Вы приглашаете гостей. Я добавляю вкус.', signature: 'С любовью, Оливия',
    kitchensLabel: 'ТРИ ТРАДИЦИИ. ОДНА КУХНЯ.', kitchensTitle: 'Целый мир вкусов,\nсовсем рядом.',
    kitchensIntro: 'Разные традиции и одна любовь к тёплым встречам. Выберите любимую кухню или создадим меню без границ.',
    cuisineNames: ['Израильская', 'Итальянская', 'Азербайджанская'],
    cuisineNotes: ['Свежая, яркая и щедрая', 'Простая, душевная и сезонная', 'Тёплая, ароматная и искренняя'],
    cuisineDescriptions: ['Разноцветные мезе, свежая зелень и прекрасные продукты. Солнечный стол для дружной компании.', 'Паста ручной работы, сезонные продукты и радость неспешного ужина. Немного итальянской dolce vita.', 'Ароматный шафрановый плов, свежая зелень и уютные вкусы. Богатая традиция гостеприимства.'],
    galleryLabel: 'ИЗ КУХНИ', galleryTitle: 'Праздник для глаз.', galleryText: 'Немного вдохновения для вашей следующей встречи.', all: 'Все вкусы', savoury: 'Закуски и горячее', desserts: 'Десерты',
    imageDisclosure: 'Фотографии блюд, приготовленных Оливией. © JonathanKrav', viewImage: 'Открыть изображение', close: 'Закрыть',
    contactLabel: 'СОЗДАДИМ ЧТО-ТО ОСОБЕННОЕ', contactTitle: 'Ваш прекрасный вечер\nначинается здесь.',
    contactText: 'Камерный ужин, семейный праздник или просто повод собраться. Расскажите немного о ваших планах, и мы всё обсудим.',
    emailLabel: 'НАПИШИТЕ МНЕ', whatsapp: 'Связаться в WhatsApp', whatsappUnavailable: 'Оставьте в форме номер WhatsApp и попросите ответить там или напишите Оливии по электронной почте.', share: 'Поделиться в WhatsApp',
    name: 'Ваше имя', email: 'Электронная почта', phone: 'Телефон / WhatsApp', date: 'Желаемая дата', guests: 'Количество гостей', cuisine: 'Любимая кухня', choose: 'Доверюсь Оливии', message: 'Расскажите о вашем событии',
    namePlaceholder: 'Как к вам обращаться?', phonePlaceholder: 'С кодом страны', messagePlaceholder: 'Повод, ваши идеи, пожелания по питанию…',
    optional: 'необязательно', send: 'Отправить запрос', sending: 'Отправляем запрос…', privacy: 'Ваши данные используются только для ответа на запрос.',
    success: 'Ваш запрос отправлен!', successText: 'Спасибо за приглашение к вашему столу. Я свяжусь с вами по электронной почте, чтобы обсудить планы.', another: 'Отправить ещё один запрос', error: 'Не удалось отправить запрос. Попробуйте ещё раз или напишите на chef@olivia.kitchen.',
    footer: 'Хорошая еда объединяет.', rights: 'Olivia Kitchen. Создано с любовью.', menu: 'Открыть меню', language: 'Выбрать язык', top: 'Наверх',
  },
}

export const galleryPhotos = [
  { file: 'grilled-rib-steak', width: 1600, height: 1600, smWidth: 800, smHeight: 800, group: 'savoury', captions: { en: 'Grilled rib steak with roasted vegetables', he: 'סטייק צלעות על האש עם ירקות צלויים', ru: 'Стейк на кости на гриле с запечёнными овощами' } },
  { file: 'tropical-millefeuille', width: 1600, height: 1200, smWidth: 800, smHeight: 600, group: 'desserts', captions: { en: 'Layered dessert with tropical fruit and raspberries', he: 'קינוח שכבות עם פירות טרופיים ופטל', ru: 'Слоёный десерт с тропическими фруктами и малиной' } },
  { file: 'lamb-and-beef-platter', width: 1600, height: 1200, smWidth: 800, smHeight: 600, group: 'savoury', captions: { en: 'Lamb chops and beef medallions with roasted vegetables', he: 'צלעות טלה ומדליוני בקר עם ירקות צלויים', ru: 'Бараньи рёбрышки и медальоны из говядины с овощами' } },
  { file: 'eggplant-rolls', width: 1200, height: 1214, smWidth: 800, smHeight: 809, group: 'savoury', captions: { en: 'Eggplant rolls with tomato filling, tahini and grated cheese', he: 'רולדות חצילים במילוי עגבניות, טחינה וגבינה מגורדת', ru: 'Рулеты из баклажана с томатной начинкой, тахини и тёртым сыром' } },
  { file: 'chocolate-glaze-cake', width: 1280, height: 1600, smWidth: 800, smHeight: 1000, group: 'desserts', captions: { en: 'Glazed chocolate cake with strawberries and passion fruit', he: 'עוגת שוקולד מצופה עם תותים ופסיפלורה', ru: 'Шоколадный торт с глазурью, клубникой и маракуйей' } },
  { file: 'seared-salmon-puree', width: 1280, height: 1600, smWidth: 800, smHeight: 1000, group: 'savoury', captions: { en: 'Seared salmon with silky purée', he: 'סלמון צרוב עם פירה קטיפתי', ru: 'Лосось с нежным пюре' } },
  { file: 'strawberry-cheesecake', width: 1600, height: 1200, smWidth: 800, smHeight: 600, group: 'desserts', captions: { en: 'Cheesecake with strawberries and passion fruit', he: 'עוגת גבינה עם תותים ופסיפלורה', ru: 'Чизкейк с клубникой и маракуйей' } },
  { file: 'burrata-heirloom-tomatoes', width: 1600, height: 1200, smWidth: 800, smHeight: 600, group: 'savoury', captions: { en: 'Burrata with heirloom tomatoes and basil', he: 'בוראטה עם עגבניות צבעוניות ובזיליקום', ru: 'Буррата с разноцветными томатами и базиликом' } },
  { file: 'sorbet-meringue-dessert', width: 1600, height: 1600, smWidth: 800, smHeight: 800, group: 'desserts', captions: { en: 'Plated dessert with sorbet, meringue and an edible flower', he: 'קינוח מצופה עם סורבה, מרנג ופרח אכיל', ru: 'Десерт с сорбетом, меренгой и съедобным цветком' } },
  { file: 'beef-carpaccio', width: 1600, height: 1600, smWidth: 800, smHeight: 800, group: 'savoury', captions: { en: 'Beef carpaccio with pine nuts and radish', he: 'קרפצ׳יו בקר עם צנוברים וצנונית', ru: 'Карпаччо из говядины с кедровыми орешками и редисом' } },
  { file: 'three-chocolate-mousse-cake', width: 1600, height: 1200, smWidth: 800, smHeight: 600, group: 'desserts', captions: { en: 'Three-layer chocolate mousse cake', he: 'עוגת מוס שוקולד בשלוש שכבות', ru: 'Трёхслойный шоколадный муссовый торт' } },
  { file: 'crispy-skin-fish', width: 1600, height: 1200, smWidth: 800, smHeight: 600, group: 'savoury', captions: { en: 'Fish with crisp skin and fresh salad', he: 'דג עם עור פריך וסלט טרי', ru: 'Рыба с хрустящей кожицей и свежим салатом' } },
  { file: 'chocolate-plated-dessert', width: 1600, height: 1200, smWidth: 800, smHeight: 600, group: 'desserts', captions: { en: 'Chocolate plated dessert with an edible flower', he: 'קינוח שוקולד מצופה עם פרח אכיל', ru: 'Шоколадный десерт с съедобным цветком' } },
  { file: 'carpaccio-radish-microherbs', width: 1600, height: 1200, smWidth: 800, smHeight: 600, group: 'savoury', captions: { en: 'Beef carpaccio with radish and micro herbs', he: 'קרפצ׳יו בקר עם צנונית ועלי מיקרו', ru: 'Карпаччо из говядины с редисом и микрозеленью' } },
  { file: 'strawberry-tartlets', width: 1600, height: 1200, smWidth: 800, smHeight: 600, group: 'desserts', captions: { en: 'Strawberry tartlets', he: 'טארטלטים תותים', ru: 'Тарталетки с клубникой' } },
  { file: 'warm-starter-red-currants', width: 1600, height: 1200, smWidth: 800, smHeight: 600, group: 'savoury', captions: { en: 'Warm starter with red currants and micro herbs', he: 'מנה ראשונה חמה עם דומדמניות אדומות ועלי מיקרו', ru: 'Тёплая закуска с красной смородиной и микрозеленью' } },
  { file: 'chocolate-strawberry-tart', width: 1280, height: 1600, smWidth: 800, smHeight: 1000, group: 'desserts', captions: { en: 'Chocolate cream tart with strawberries and gilded hazelnuts', he: 'טארט קרם שוקולד עם תותים ואגוזי לוז מוזהבים', ru: 'Шоколадный тарт с клубникой и позолоченным фундуком' } },
  { file: 'raspberry-macarons', width: 1280, height: 1600, smWidth: 800, smHeight: 1000, group: 'desserts', captions: { en: 'Raspberry macarons', he: 'מקרונים בטעם פטל', ru: 'Малиновые макаруны' } },
  { file: 'peanut-caramel-bars', width: 1280, height: 1600, smWidth: 800, smHeight: 1000, group: 'desserts', captions: { en: 'Chocolate bars with peanut caramel', he: 'חטיפי שוקולד עם קרמל בוטנים', ru: 'Шоколадные батончики с арахисовой карамелью' } },
] as const

export const siteUrl = 'https://olivia.kitchen'

export const seo = {
  en: {
    path: '/en',
    locale: 'en_US',
    title: 'Private Chef in Haifa & Northern Israel | Olivia Kitchen',
    description: 'Olivia is a private chef in Haifa and Northern Israel. Israeli, Italian and Azerbaijani menus cooked at your home for intimate dinners and family celebrations. Request a menu.',
    serviceType: 'Private chef',
  },
  he: {
    path: '/',
    locale: 'he_IL',
    title: 'שפית פרטית בחיפה ובצפון | Olivia Kitchen',
    description: 'אוליביה, שפית פרטית בחיפה ובצפון. מטבח ישראלי, איטלקי ואזרבייג׳ני שמוכן אצלכם בבית, לארוחות אינטימיות ולאירועים משפחתיים. השאירו פנייה לתפריט מותאם.',
    serviceType: 'שפית פרטית',
  },
  ru: {
    path: '/ru',
    locale: 'ru_RU',
    title: 'Частный шеф в Хайфе и на севере Израиля | Olivia Kitchen',
    description: 'Оливия — частный шеф в Хайфе и на севере Израиля. Израильская, итальянская и азербайджанская кухня у вас дома: камерные ужины и семейные праздники. Оставьте запрос на меню.',
    serviceType: 'Частный шеф',
  },
}

export const sections = {
  en: {
    alts: ['Lamb chops, beef medallions and roasted vegetables on a platter', 'Seared salmon with silky purée', 'Burrata with heirloom tomatoes and basil', 'Grilled rib steak with roasted vegetables'],
    kashrut: {
      label: 'KASHRUT', title: 'A kitchen that fits\nyour home.',
      intro: 'Every home keeps its own rules, so the menu is built around yours. There are three options.',
      options: [
        { title: 'Kosher', text: 'A menu planned around the kashrut rules of your home, including the separation of meat and dairy.' },
        { title: 'Kosher-style', text: 'No pork or shellfish and no mixing of meat and dairy.' },
        { title: 'Not kosher', text: 'Full freedom with the menu, including ingredients that a kosher kitchen leaves out, such as seafood.' },
      ],
    },
    areas: {
      label: 'WHERE I WORK', title: 'Haifa and\nthe North.',
      text: 'Olivia comes to your home in Haifa and across Northern Israel. If you are somewhere else in the north, write and we will check together.',
      cities: ['Haifa', 'The Krayot', 'Nesher', 'Karmiel', 'Nahariya', 'Akko'],
      links: [] as { label: string; to: string }[],
    },
    faq: {
      label: 'GOOD TO KNOW', title: 'Frequently\nasked questions.',
      items: [
        { q: 'Where does Olivia work?', a: 'In Haifa and Northern Israel: Haifa, the Krayot, Nesher, Karmiel, Nahariya, Akko and the surrounding area. If your home is elsewhere in the north, write and we will check.' },
        { q: 'Is kosher food available?', a: 'Yes. There are three options: kosher, kosher-style and not kosher. Tell us in your inquiry what suits your home.' },
        { q: 'Which cuisines can I choose?', a: 'Israeli, Italian and Azerbaijani. Pick one kitchen or combine them in a single menu.' },
        { q: 'What kind of occasions is this for?', a: 'Intimate dinners, family celebrations and gatherings at home.' },
        { q: 'What about allergies and dietary needs?', a: 'Mention them in the inquiry form and the menu will be adapted in a personal conversation.' },
        { q: 'How much does it cost?', a: 'The price depends on the menu, the number of guests and the date. Send an inquiry and you will receive a personal offer.' },
        { q: 'How do I book?', a: 'Fill in the inquiry form, write to chef@olivia.kitchen or message on WhatsApp. Olivia will get back to you to plan the details.' },
      ],
    },
  },
  he: {
    alts: ['צלעות טלה, מדליוני בקר וירקות צלויים על מגש', 'סלמון צרוב עם פירה קטיפתי', 'בוראטה עם עגבניות צבעוניות ובזיליקום', 'סטייק צלעות על האש עם ירקות צלויים'],
    kashrut: {
      label: 'כשרות', title: 'מטבח שמתאים\nלבית שלכם.',
      intro: 'כל בית שומר על כללים משלו, ולכן התפריט נבנה לפי מה שמתאים לכם. יש שלוש אפשרויות.',
      options: [
        { title: 'מטבח כשר', text: 'תפריט שמתוכנן לפי כללי הכשרות של הבית שלכם, כולל הפרדה בין בשרי לחלבי.' },
        { title: 'בסגנון כשר', text: 'בלי בשר חזיר ופירות ים ובלי ערבוב בשר וחלב.' },
        { title: 'לא כשר', text: 'חופש מלא בתפריט, כולל חומרי גלם שמטבח כשר משאיר בחוץ, כמו פירות ים.' },
      ],
    },
    areas: {
      label: 'אזורי שירות', title: 'חיפה\nוהצפון.',
      text: 'אוליביה מגיעה אליכם הביתה בחיפה ובצפון הארץ. אם אתם במקום אחר בצפון, כתבו ונבדוק יחד.',
      cities: ['חיפה', 'הקריות', 'נשר', 'כרמיאל', 'נהריה', 'עכו'],
      links: [{ label: 'שף פרטי בחיפה', to: '/haifa' }, { label: 'שף פרטי לאירועים בצפון', to: '/north' }],
    },
    faq: {
      label: 'טוב לדעת', title: 'שאלות\nנפוצות.',
      items: [
        { q: 'באילו אזורים אוליביה עובדת?', a: 'בחיפה ובצפון: חיפה, הקריות, נשר, כרמיאל, נהריה, עכו והסביבה. אם הבית שלכם במקום אחר בצפון, כתבו ונבדוק.' },
        { q: 'האם אפשר לקבל אוכל כשר?', a: 'כן. יש שלוש אפשרויות: מטבח כשר, בסגנון כשר ולא כשר. כתבו בפנייה מה מתאים לבית שלכם.' },
        { q: 'אילו מטבחים אפשר לבחור?', a: 'ישראלי, איטלקי ואזרבייג׳ני. אפשר לבחור מטבח אחד או לשלב ביניהם בתפריט אחד.' },
        { q: 'לאילו אירועים זה מתאים?', a: 'ארוחות ערב אינטימיות, חגיגות משפחתיות ומפגשים בבית.' },
        { q: 'מה לגבי אלרגיות והעדפות תזונתיות?', a: 'ציינו אותן בטופס הפנייה, והתפריט יותאם בשיחה אישית.' },
        { q: 'כמה זה עולה?', a: 'המחיר תלוי בתפריט, במספר האורחים ובמועד האירוע. השאירו פנייה ותקבלו הצעה אישית.' },
        { q: 'איך מזמינים?', a: 'ממלאים את טופס הפנייה באתר, כותבים ל־chef@olivia.kitchen או פונים בוואטסאפ. אוליביה תחזור אליכם לתיאום הפרטים.' },
      ],
    },
  },
  ru: {
    alts: ['Бараньи рёбрышки, медальоны из говядины и запечённые овощи на блюде', 'Лосось с нежным пюре', 'Буррата с разноцветными томатами и базиликом', 'Стейк на кости на гриле с запечёнными овощами'],
    kashrut: {
      label: 'КАШРУТ', title: 'Кухня, которая подходит\nвашему дому.',
      intro: 'В каждом доме свои правила, поэтому меню строится под ваши. Есть три варианта.',
      options: [
        { title: 'Кошерная кухня', text: 'Меню по правилам кашрута вашего дома, включая разделение мясного и молочного.' },
        { title: 'Кошер-стайл', text: 'Без свинины и морепродуктов и без смешивания мясного с молочным.' },
        { title: 'Некошерная кухня', text: 'Полная свобода в меню, включая продукты, которых нет на кошерной кухне, например морепродукты.' },
      ],
    },
    areas: {
      label: 'ГДЕ Я РАБОТАЮ', title: 'Хайфа\nи север.',
      text: 'Оливия приезжает к вам домой в Хайфе и на севере Израиля. Если вы в другом месте на севере, напишите, и мы вместе проверим.',
      cities: ['Хайфа', 'Крайот', 'Нешер', 'Кармиэль', 'Нагария', 'Акко'],
      links: [] as { label: string; to: string }[],
    },
    faq: {
      label: 'ПОЛЕЗНО ЗНАТЬ', title: 'Частые\nвопросы.',
      items: [
        { q: 'Где работает Оливия?', a: 'В Хайфе и на севере Израиля: Хайфа, Крайот, Нешер, Кармиэль, Нагария, Акко и окрестности. Если ваш дом в другом месте на севере, напишите, и мы проверим.' },
        { q: 'Можно ли заказать кошерное меню?', a: 'Да. Есть три варианта: кошерная кухня, кошер-стайл и некошерная. Напишите в запросе, что подходит вашему дому.' },
        { q: 'Какие кухни можно выбрать?', a: 'Израильская, итальянская и азербайджанская. Можно выбрать одну или объединить их в одном меню.' },
        { q: 'Для каких событий это подходит?', a: 'Камерные ужины, семейные праздники и встречи дома.' },
        { q: 'Что с аллергиями и пожеланиями по питанию?', a: 'Укажите их в форме запроса, и меню подберут в личном разговоре.' },
        { q: 'Сколько это стоит?', a: 'Цена зависит от меню, количества гостей и даты. Отправьте запрос, и вы получите индивидуальное предложение.' },
        { q: 'Как заказать?', a: 'Заполните форму запроса, напишите на chef@olivia.kitchen или в WhatsApp. Оливия свяжется с вами, чтобы обсудить детали.' },
      ],
    },
  },
}

export const localPages = {
  haifa: {
    path: '/haifa',
    title: 'שף פרטי בחיפה | שפית פרטית לארוחות ואירועים בבית | Olivia Kitchen',
    description: 'שף פרטי בחיפה: אוליביה מבשלת אצלכם בבית מטבח ישראלי, איטלקי ואזרבייג׳ני. אפשרויות כשר, בסגנון כשר ולא כשר. השאירו פנייה לתפריט מותאם.',
    eyebrow: 'שפית פרטית · חיפה',
    heading: 'שף פרטי\nבחיפה',
    paragraphs: [
      'אוליביה היא שפית פרטית בחיפה. היא מגיעה אליכם הביתה ומכינה ארוחה שמותאמת לאירוע, לאורחים ולטעם שלכם: ארוחת ערב אינטימית, חגיגה משפחתית או סתם סיבה להיפגש.',
      'התפריט נבנה מהמטבח הישראלי, האיטלקי והאזרבייג׳ני, בנפרד או בשילוב ביניהם. אפשר לבחור מטבח כשר, בסגנון כשר או לא כשר, ולציין אלרגיות והעדפות תזונתיות.',
      'אוליביה עובדת בחיפה, בקריות, בנשר ובסביבה.',
    ],
    otherLabel: 'שף פרטי לאירועים בצפון',
    otherTo: '/north',
  },
  north: {
    path: '/north',
    title: 'שף פרטי לאירועים בצפון | כרמיאל, נהריה, עכו | Olivia Kitchen',
    description: 'שפית פרטית לאירועים בבית בצפון: כרמיאל, נהריה, עכו והסביבה. מטבח ישראלי, איטלקי ואזרבייג׳ני, עם אפשרויות כשר, בסגנון כשר ולא כשר.',
    eyebrow: 'שפית פרטית · הצפון',
    heading: 'שף פרטי\nלאירועים בצפון',
    paragraphs: [
      'אוליביה, שפית פרטית מחיפה, מגיעה לאירועים בבית גם בצפון הארץ: בכרמיאל, בנהריה, בעכו ובסביבה.',
      'ארוחת ערב אינטימית או חגיגה משפחתית: מתכננים יחד תפריט ישראלי, איטלקי או אזרבייג׳ני, או שילוב ביניהם. יש אפשרות למטבח כשר, בסגנון כשר או לא כשר.',
      'אם הבית שלכם במקום אחר בצפון, כתבו ונבדוק יחד.',
    ],
    otherLabel: 'שף פרטי בחיפה',
    otherTo: '/haifa',
  },
}

export type LocalPageKey = keyof typeof localPages

const cityNames = ['Haifa', 'Krayot', 'Nesher', 'Karmiel', 'Nahariya', 'Akko']

function faqSchema(language: Language) {
  return {
    '@type': 'FAQPage',
    inLanguage: language,
    mainEntity: sections[language].faq.items.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}

function foodService(serviceType: string) {
  return {
    '@type': 'FoodService',
    name: 'Olivia Kitchen',
    url: siteUrl,
    email: contact.email,
    description: seo.en.description,
    serviceType,
    inLanguage: ['en', 'he', 'ru'],
    areaServed: [
      ...cityNames.map(name => ({ '@type': 'City', name })),
      { '@type': 'AdministrativeArea', name: 'Northern Israel' },
    ],
    keywords: 'private chef, Haifa, Northern Israel, kosher, kosher-style, Israeli cuisine, Italian cuisine, Azerbaijani cuisine',
  }
}

function buildHead(page: { path: string; title: string; description: string; locale: string }, serviceType: string, language: Language, alternates: boolean) {
  const url = `${siteUrl}${page.path === '/' ? '/' : page.path}`
  const graph = { '@context': 'https://schema.org', '@graph': [foodService(serviceType), faqSchema(language)] }
  return {
    meta: [
      { title: page.title },
      { name: 'description', content: page.description },
      { property: 'og:title', content: page.title },
      { property: 'og:description', content: page.description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: url },
      { property: 'og:site_name', content: 'Olivia Kitchen' },
      { property: 'og:locale', content: page.locale },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: page.title },
      { name: 'twitter:description', content: page.description },
    ],
    links: [
      { rel: 'canonical', href: url },
      ...(alternates ? [
        { rel: 'alternate', hrefLang: 'en', href: `${siteUrl}/en` },
        { rel: 'alternate', hrefLang: 'he', href: `${siteUrl}/` },
        { rel: 'alternate', hrefLang: 'ru', href: `${siteUrl}/ru` },
        { rel: 'alternate', hrefLang: 'x-default', href: `${siteUrl}/` },
      ] : []),
    ],
    scripts: [{ type: 'application/ld+json', children: JSON.stringify(graph) }],
  }
}

export function seoHead(language: Language) {
  const page = seo[language]
  return buildHead(page, page.serviceType, language, true)
}

export function localSeoHead(key: LocalPageKey) {
  const page = localPages[key]
  return buildHead({ ...page, locale: 'he_IL' }, seo.he.serviceType, 'he', false)
}
