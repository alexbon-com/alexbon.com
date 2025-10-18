export type LocaleKey = "ru" | "ua" | "en";

export type DetailIconKey = "video" | "donate" | "lock";

export interface LandingContent {
  locale: LocaleKey;
  brandName: string;
  tagline: string;
  metaTitle: string;
  metaDescription: string;
  hero: {
    title: string;
    paragraphs: string[];
  };
  introduction: {
    heading: string;
    image: string;
    imageAlt: string;
    paragraphs: string[];
    highlight?: {
      title: string;
      paragraphs: string[];
    };
  };
  process: {
    heading: string;
    intro: string;
    steps: Array<{
      title: string;
      description: string;
    }>;
  };
  details: {
    heading: string;
    items: Array<{
      icon: DetailIconKey;
      title: string;
      description: string;
    }>;
  };
  faq: {
    heading: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
  invitation: {
    heading: string;
    body: string;
    buttons: Array<{
      label: string;
      href: string;
    }>;
  };
  testimonials: {
    heading: string;
    intro?: string;
    items: string[];
    cta?: {
      text: string;
      button: {
        label: string;
        href: string;
      };
    };
  };
  story: {
    heading: string;
    image: string;
    imageAlt: string;
    paragraphs: string[];
  };
  footerNote: string;
  blog: {
    badge: string;
    heroTitle: string;
    heroDescription: string;
  };
}

export const languageLinks: Array<{
  label: string;
  locale: LocaleKey;
  href: string;
}> = [
  { label: "UA", locale: "ua", href: "/" },
  { label: "RU", locale: "ru", href: "/ru" },
  { label: "EN", locale: "en", href: "/en" },
];

export const contentByLocale: Record<LocaleKey, LandingContent> = {
  ru: {
    locale: "ru",
    brandName: "Алекс Бон",
    tagline: "Просто место, чтобы выдохнуть и разобраться",
    metaTitle: "Психолог онлайн Алекс Бон | Человек, который слушает и слышит",
    metaDescription:
      "Запутался(ась), устал(а) или просто хочешь выдохнуть? Я не лечу, а слушаю. Предлагаю безопасное пространство для разговора и бесплатную 20-минутную встречу, чтобы познакомиться.",
    hero: {
      title: "Просто место, чтобы выдохнуть и разобраться.",
      paragraphs: [
        "Возможно, ты здесь из любопытства или потому, что чувствуешь, что запутался(ась). Или устал(а). Или просто хочешь, чтобы тебя кто-то выслушал. Без оценок и советов о том, как \"правильно жить\".",
      ],
    },
    introduction: {
      heading: "Знакомство",
      image: "/images/about-portrait-hero.webp",
      imageAlt: "Александр, психолог онлайн",
      paragraphs: [
        "Привет, меня зовут Александр.",
        "Я психолог. Но если отбросить термины, я - человек, который помогает другим распутывать клубки мыслей и чувств.",
        "Моя работа - не ставить тебе диагнозы и не рассказывать, как нужно жить. Моя работа - создать пространство, в котором ты сам(а) сможешь услышать себя. Возможно, впервые за долгое время.",
      ],
      highlight: {
        title: "Что я делаю?",
        paragraphs: [
          "Помогаю распутать тот самый клубок в голове. Без заумных терминов, нравоучений, эзотерической пыли и копания в твоих детских обидах (разве что это действительно важно сейчас).",
          "Мы просто берем твою конкретную ситуацию, твой затык, твою боль — и работаем с этим. Практически. Честно. Эффективно.",
          "Я не буду тебя \"лечить\" — я буду разговаривать. Как человек с человеком.",
        ],
      },
    },
    process: {
      heading: "Как всё проходит? Очень просто.",
      intro:
        "Я верю, что исцеление начинается не с диагнозов, а с честного разговора. Поэтому я убрал все лишние сложности, чтобы твой путь к себе оставался понятным и спокойным. Вот карта нашего возможного путешествия.",
      steps: [
        {
          title: "Шаг 1. Встреча-знакомство (бесплатно)",
          description:
            "**Что это?** 20 минут онлайн. Это не консультация, а простой человеческий разговор, чтобы мы познакомились.\n\n**Зачем это?** Чтобы ты мог(ла) задать любые вопросы, почувствовать, комфортно ли тебе со мной, и понять, тот ли я человек, которому ты готов(а) доверять.\n\n**Какие обязательства?** Никаких. Если почувствуешь, что это \"не твоё\", это нормально. Моя задача — помочь тебе встретить своего проводника.",
        },
        {
          title: "Шаг 2. Глубокая работа (если ты решишь)",
          description:
            "**Что это?** Если после знакомства ты почувствуешь: \"да, это оно\", договоримся о полноценных встречах. Обычно они проходят раз в неделю, но мы подберём ритм, комфортный именно тебе.\n\n**Зачем это?** Чтобы не просто \"поговорить\", а спокойно, шаг за шагом распутывать твой клубок и приближаться к жизни, которую ты хочешь для себя построить.",
        },
      ],
    },
    details: {
      heading: "Более подробно о наших встречах",
      items: [
        {
          icon: "video",
          title: "Формат",
          description:
            "Онлайн (Zoom, Telegram, WhatsApp, Viber). Тебе достаточно найти уютное место, где тебя никто не потревожит.",
        },
        {
          icon: "donate",
          title: "Стоимость",
          description:
            "Я не хочу, чтобы цена становилась преградой для тех, кому нужна помощь. Поэтому работаю на основе добровольного пожертвования: после каждой нашей встречи ты сам(а) выбираешь сумму, которая кажется справедливой и посильной. Твоё желание меняться — главная валюта.",
        },
        {
          icon: "lock",
          title: "Конфиденциальность",
          description:
            "Это — нерушимое правило. Всё, о чем мы говорим, остаётся только между нами. Это не просто обещание, это этический кодекс моей профессии. Ты можешь быть уверен(а), что находишься в безопасном пространстве.",
        },
      ],
    },
    faq: {
      heading: "Частые вопросы, которые нормально задавать",
      items: [
        {
          question: "А вдруг моя проблема слишком мелкая?",
          answer:
            "Не бывает мелких проблем. Если это болит у тебя, значит, это важно.",
        },
        {
          question: "А что, если я не смогу ничего сказать?",
          answer:
            "Это абсолютно нормально. Мы не будем сидеть в неловкой тишине. Разговор — это моя работа. Я помогу.",
        },
        {
          question: "Ты будешь меня анализировать?",
          answer:
            "Моя цель не \"разгадать\" тебя, как ребус, а помочь тебе услышать и понять себя.",
        },
      ],
    },
    invitation: {
      heading: "Готов(а) сделать первый, самый маленький шаг?",
      body:
        "Просто напиши мне, чтобы договориться о нашей бесплатной 20-минутной встрече-знакомстве. Это тебя ни к чему не обязывает.",
      buttons: [
        { label: "Написать в Telegram", href: "https://t.me/alexbon_com" },
        { label: "Написать в WhatsApp", href: "https://wa.me/+380986552222" },
        { label: "Написать в Viber", href: "viber://chat?number=+380986552222" },
      ],
    },
    testimonials: {
      heading: "Голоса тех, кого услышали",
      items: [
        "Хочу поблагодарить Александра за профессионализм и отзывчивость. Он помог мне разобраться с моими внутренними переживаниями: я перестала зацикливаться в будущем и стала ценить момент \"здесь и сейчас\". Благодаря нашей работе я избавилась от чрезмерной самокритики, страхов и чувства вины, которое долго меня тяготило. Появилось больше уверенности в себе и в покое. Александр создает безопасное пространство, где можно честно взглянуть на свои проблемы и найти решение. Очень рада, что обратилась именно к нему.",
        "Благодарю Александра за столь быстрый поиск путей решения моего вопроса. После сеанса исчезло напряжение и переживание. Начали появляться новые идеи и ушли сомнения по многим аспектам. Александр чётко увидел мои проблемы и описал всё, что происходило внутри, чего я не могла объяснить сама.",
        "Александр прекрасный специалист. После консультации стало гораздо легче и спокойнее, мысли прояснились. С ним легко общаться, он располагает к себе. Благодарна за помощь и с уверенностью рекомендую.",
      ],
      cta: {
        text: "Почитать другие отзывы на Google Картах или оставить свой можно здесь:",
        button: {
          label: "Отзывы на Google Картах",
          href: "https://g.page/AlexBon?share",
        },
      },
    },
    story: {
      heading: "Моя история (для тех, кто остался до конца)",
      image: "/images/about-story-portrait.webp",
      imageAlt: "Алекс Бон смотрит в камеру, опершись руками на стол",
      paragraphs: [
        "Я не из тех, кто всю жизнь мечтал копаться в чужих душах. Мой путь начался неожиданно - в армии. Среди берцев и строевой подготовки я понял простую и важную вещь: внутренняя гармония не зависит от внешних обстоятельств. Вселенная любит шутить, подбрасывая озарения в самых неожиданных местах.",
        "Я много путешествовал, жил в Йемене, Индии и Англии, получил высшее экономическое и высшее психологическое образование, поработал в разных сферах и на разных должностях - от \"принеси-подай\" до учредителя и руководителя собственной компании.",
        "Был женат, развелся, сохранил хорошие отношения и последние десять лет живу сам. Ну, если быть точным, не совсем сам - со мной кошка. Этот опыт не сделал меня гуру, но научил замечать в чужих историях ниточки, которые когда-то проходили через мою собственную. И понимать, что любой клубок можно распутать.",
      ],
    },
    footerNote:
      "P.S. \"Алекс Бон\" - это мой псевдоним, так проще. А настоящее имя пусть остается для скучных бумаг.",
    blog: {
      badge: "Мысли",
      heroTitle: "Просто место, чтобы выдохнуть и разобраться",
      heroDescription:
        "Здесь ты найдёшь статьи о психологии и осознанности, маленькие истории о больших озарениях, заметки о том, как найти покой, не избегая бури, рассказы и притчи о внутреннем хаосе и тишине, о наших драконах и наших котах, и мысли разрывающие шаблоны. Создано в содружестве с ИИ.",
    },
  },
  ua: {
    locale: "ua",
    brandName: "Алекс Бон",
    tagline: "Просто простір, щоб видихнути і розібратися",
    metaTitle: "Психолог онлайн Алекс Бон | Людина, яка слухає та чує",
    metaDescription:
      "Заплутався/заплуталася, втомився/втомилася чи просто хочеш видихнути? Я не лікую, а слухаю. Пропоную безпечний простір для розмови та безкоштовну 20-хвилинну зустріч, щоб познайомитися.",
    hero: {
      title: "Просто простір, щоб видихнути і розібратися.",
      paragraphs: [
        "Можливо, ти тут із цікавості або тому, що відчуваєш, що заплутався/заплуталася. Або втомився/втомилася. Або просто хочеш, щоб тебе хтось вислухав. Без оцінок і порад, як \"правильно жити\".",
      ],
    },
    introduction: {
      heading: "Знайомство",
      image: "/images/about-portrait-hero.webp",
      imageAlt: "Олександр, психолог онлайн",
      paragraphs: [
        "Привіт, мене звати Олександр.",
        "Я психолог. Але якщо відкинути терміни, я - людина, яка допомагає іншим розплутувати клубки думок і почуттів.",
        "Моя робота - не ставити тобі діагнози і не розповідати, як слід жити. Моя робота - створити простір, у якому ти зможеш почути себе. Можливо, вперше за довгий час.",
      ],
      highlight: {
        title: "Що я роблю?",
        paragraphs: [
          "Допомагаю розплутати той самий клубок у голові. Без заумних термінів, моралізаторства, езотеричного пилу й копирсання у твоїх дитячих образах (хіба що це справді важливо саме зараз).",
          "Ми просто беремо твою конкретну ситуацію, твій глухий кут, твій біль — і працюємо з цим. Практично. Чесно. Ефективно.",
          "Я не буду тебе \"лікувати\" — я буду розмовляти. Як людина з людиною.",
        ],
      },
    },
    process: {
      heading: "Як усе відбувається? Дуже просто.",
      intro:
        "Я вірю, що зцілення починається не з діагнозів, а з чесної розмови. Тому прибрав усе зайве, щоб твій шлях до себе був простим і не лякав. Ось мапа нашої можливої подорожі.",
      steps: [
        {
          title: "Крок 1. Зустріч-знайомство (безкоштовно)",
          description:
            "**Що це?** 20 хвилин онлайн. Це не консультація, а тепла розмова, щоб ми могли познайомитися.\n\n**Навіщо це?** Щоб ти міг(ла) поставити будь-які запитання, відчути, чи комфортно тобі зі мною, і зрозуміти, чи готовий(а) довіряти саме мені.\n\n**Які зобов'язання?** Жодних. Якщо відчуєш, що це \"не твоє\", — це нормально. Моя мета — щоб ти знайшов(знайшла) свого провідника.",
        },
        {
          title: "Крок 2. Глибока робота (якщо вирішиш)",
          description:
            "**Що це?** Якщо після знайомства ти відчуєш: \"так, воно\", домовимося про повноцінні зустрічі. Зазвичай це раз на тиждень, але ми підберемо ритм, що буде комфортний саме тобі.\n\n**Навіщо це?** Щоб не просто \"поговорити\", а лагідно, крок за кроком розплутувати твій клубок і рухатися до життя, яке ти хочеш для себе створити.",
        },
      ],
    },
    details: {
      heading: "Детальніше про наші зустрічі",
      items: [
        {
          icon: "video",
          title: "Формат",
          description:
            "Онлайн (Zoom, Telegram, WhatsApp, Viber). Тобі достатньо знайти затишне місце, де тебе ніхто не потурбує.",
        },
        {
          icon: "donate",
          title: "Вартість",
          description:
            "Я не хочу, щоб вартість ставала бар'єром для тих, кому потрібна підтримка. Тому працюю на принципах добровільної пожертви: після кожної зустрічі ти сам(а) визначаєш суму, що здається чесною й посильною. Твоє бажання змінюватися — головна валюта.",
        },
        {
          icon: "lock",
          title: "Конфіденційність",
          description:
            "Це — непорушне правило. Усе, про що ми говоримо, залишається лише між нами. Це не просто обіцянка, а етичний кодекс моєї професії. Можеш бути певен(а): ти в безпечному просторі.",
        },
      ],
    },
    faq: {
      heading: "Питання, які нормально ставити",
      items: [
        {
          question: "А раптом моя проблема надто дрібна?",
          answer:
            "Не буває дрібних проблем. Якщо воно болить у тобі, значить, це важливо.",
        },
        {
          question: "А що, якщо я нічого не зможу сказати?",
          answer:
            "Це абсолютно нормально. Ми не сидітимемо в незручній тиші. Розмова — моя робота. Я підхоплю.",
        },
        {
          question: "Ти будеш мене аналізувати?",
          answer:
            "Моя мета не \"розгадати\" тебе, мов ребус, а допомогти почути й зрозуміти себе.",
        },
      ],
    },
    invitation: {
      heading: "Готовий(а) зробити перший, зовсім невеликий крок?",
      body:
        "Просто напиши мені, щоб домовитися про нашу безкоштовну 20-хвилинну зустріч-знайомство. Це ні до чого тебе не зобов'язує.",
      buttons: [
        { label: "Написати в Telegram", href: "https://t.me/alexbon_com" },
        { label: "Написати в WhatsApp", href: "https://wa.me/+380986552222" },
        { label: "Написати у Viber", href: "viber://chat?number=+380986552222" },
      ],
    },
    testimonials: {
      heading: "Голоси тих, кого почули",
      items: [
        "Хочу подякувати Олександра за професіоналізм і чуйність. Він допоміг мені розібратися зі своїми внутрішніми переживаннями: я перестала жити лише майбутнім і навчилася цінувати момент \"тут і зараз\". Завдяки нашій роботі я позбулася надмірної самокритики, страхів і давнього почуття провини. З'явилося більше впевненості у собі та спокою. Олександр створює безпечний простір, де можна чесно подивитися на свої труднощі й знайти рішення. Я дуже рада, що звернулася саме до нього.",
        "Дякую Олександрові за швидкий пошук шляхів вирішення мого запиту. Після сеансу зникло напруження і хвилювання. З'явилися нові ідеї і зникли сумніви в багатьох аспектах. Олександр чітко побачив мої проблеми і описав усе, що відбувалося всередині, чого я не могла пояснити сама.",
        "Олександр чудовий фахівець. Після консультації стало значно легше і спокійніше, думки прояснилися. З ним легко спілкуватися, він викликає довіру. Вдячна за допомогу і із задоволенням рекомендую.",
      ],
      cta: {
        text: "Інші відгуки у Google Картах можна почитати або залишити свій тут:",
        button: {
          label: "Відгуки у Google Картах",
          href: "https://g.page/AlexBon?share",
        },
      },
    },
    story: {
      heading: "Моя історія (для тих, хто залишився до кінця)",
      image: "/images/about-story-portrait.webp",
      imageAlt: "Олександр у затишній студії, облокотившись на стіл",
      paragraphs: [
        "Я не з тих, хто все життя мріяв копатися в чужих душах. Мій шлях почався несподівано - в армії. Серед берців і стройової підготовки я зрозумів просту і важливу річ: внутрішня гармонія не залежить від зовнішніх обставин. Всесвіт любить жартувати, підкидаючи осяяння у найнеочікуваніших місцях.",
        "Я багато подорожував, жив у Ємені, Індії та Англії, здобув вищу економічну та вищу психологічну освіту, працював у різних сферах і на різних посадах - від \"принеси-подай\" до засновника і керівника власної компанії.",
        "Був одружений, розлучився, зберіг добрі стосунки і останні десять років живу сам. Якщо точніше, не зовсім сам - зі мною кішка. Цей досвід не зробив мене гуру, але навчив помічати в чужих історіях ниточки, які колись проходили через мою власну. І розуміти, що будь-який клубок можна розплутати.",
      ],
    },
    footerNote:
      "P.S. \"Алекс Бон\" - це мій псевдонім, так простіше. А справжнє ім'я нехай залишається для нудних паперів.",
    blog: {
      badge: "Думки",
      heroTitle: "Просто простір, щоб видихнути і розібратися",
      heroDescription:
        "Тут ти знайдеш статті про психологію й усвідомленість, маленькі історії про великі осяяння, нотатки про те, як знаходити спокій, не оминаючи бурю, оповідання й притчі про внутрішній хаос і тишу, про наших драконів і наших котів, та думки, що розривають шаблони. Створено у співтворенні з ШІ.",
    },
  },
  en: {
    locale: "en",
    brandName: "Alex Bon",
    tagline: "Just a space to take a breath and figure things out",
    metaTitle: "Online counsellor Alex Bon | A space to be read and understood",
    metaDescription:
      "Feeling tangled or exhausted, or just wanting a quiet place where someone will read your words with care? I hold space through writing and offer a free first exchange so we can begin gently.",
    hero: {
      title: "Just a space to take a breath and figure things out.",
      paragraphs: [
        "Maybe you're here out of curiosity, or because life feels confusing. Or you're exhausted. Or you simply want a quiet space where someone will read what you write — carefully, without judging or teaching you how to live.",
      ],
    },
    introduction: {
      heading: "Getting acquainted",
      image: "/images/about-portrait-hero.webp",
      imageAlt: "Oleksandr, online psychologist",
      paragraphs: [
        "Hi, my name is Oleksandr.",
        "I am a psychologist. If we drop the formalities, I'm someone who helps untangle knots of thoughts and feelings through the art of writing.",
        "My work is to create a safe, quiet space where you can see your own thoughts clearly — perhaps for the first time in a while.",
      ],
      highlight: {
        title: "What do I do?",
        paragraphs: [
          "I help you find language for what's happening inside. No lofty jargon, no moralising, no pressure to respond before you're ready.",
          "We take your specific situation, your stuck point, your quiet ache — and we work with it in writing. Patiently. Honestly. With care.",
          "I won't rush you or dissect you. I'll respond thoughtfully, word by word, human to human.",
        ],
      },
    },
    process: {
      heading: "How does it work? Thoughtfully.",
      intro:
        "I believe healing begins with an honest exchange of words. That's why our whole process happens in writing: it gives you time to reflect, space to be vulnerable without being seen, and the chance to find the exact words for what you feel.",
      steps: [
        {
          title: "Step 1. The first exchange (free)",
          description:
            "**What is it?** This isn’t a live chat or instant back-and-forth. It’s one thoughtful written exchange. You take your time, write to me about what’s on your mind, and I’ll send a considered reply in return.\n\n**Why do it?** It lets you see how I think, feel my style of communication, and decide whether it resonates before committing to anything.\n\n**Any commitments?** None at all. If it doesn’t feel right, that’s completely fine. My aim is for you to find the guide who fits you.",
        },
        {
          title: "Step 2. Ongoing correspondence (if you choose)",
          description:
            "**What is it?** If you feel a quiet \"yes\" after our first exchange, we can begin a regular correspondence — usually one deep letter or message each week — creating a steady, reflective rhythm.\n\n**Why do it?** Not just to send messages, but to gently untangle your knots and move toward the life you want to build, one written thought at a time.",
        },
      ],
    },
    details: {
      heading: "A closer look at our work",
      items: [
        {
          icon: "video",
          title: "Format",
          description:
            "We work exclusively through writing (via a secure private channel or email). You can write whenever you're ready — day or night — free from the pressure of a scheduled appointment.",
        },
        {
          icon: "donate",
          title: "Contribution",
          description:
            "I don’t want cost to stand between someone and the help they need. That’s why I work on a pay-what-feels-right donation basis: after each exchange you choose the amount that feels fair and manageable. Your willingness to change is the currency that matters most.",
        },
        {
          icon: "lock",
          title: "Confidentiality",
          description:
            "This is non-negotiable. Everything we write stays between us. It isn’t just a promise — it’s the ethical backbone of my work. You can trust that this space is completely safe.",
        },
      ],
    },
    faq: {
      heading: "Questions that are absolutely okay to ask",
      items: [
        {
          question: "What if I'm not a good writer?",
          answer:
            "This isn’t about beautiful prose — it’s about honesty. Messy, fragmented, simple words carry just as much weight. My job is to understand the feeling behind them.",
        },
        {
          question: "What if I have nothing to say?",
          answer:
            "That’s absolutely okay. The blank page can be intimidating. Begin with a single word, a question, or even a bullet list. I’ll help from there.",
        },
        {
          question: "Will you be analysing me?",
          answer:
            "My goal isn’t to solve you like a puzzle, but to help you see and understand the patterns that emerge in your own writing.",
        },
      ],
    },
    invitation: {
      heading: "Ready to write the first word?",
      body:
        "Just message me to begin our free, no-obligation first exchange. Take all the time you need.",
      buttons: [
        { label: "Begin Our First Exchange", href: "https://t.me/alexbon_com" },
      ],
    },
    testimonials: {
      heading: "Voices of those who felt heard",
      intro:
        "These are voices from my journey, from both spoken and written conversations. The method may change, but the feeling of being understood remains the same.",
      items: [
        "I’d like to thank Oleksandr for his professionalism and warmth. He helped me make sense of what was happening inside: I stopped spiralling into the future and started noticing the here and now. Through our work I let go of the harsh self-criticism, the fears, and that long-standing sense of guilt. I feel steadier, calmer, more confident. Oleksandr creates a safe space where you can look at your challenges honestly and find a way forward. I’m genuinely glad I reached out to him.",
        "Thank you, Oleksandr, for helping me find answers so quickly. After the session the tension was gone and there was room for new ideas. Oleksandr saw the essence of my situation and described everything that was happening inside — things I couldn’t explain myself.",
        "Oleksandr is a wonderful specialist. After the consultation I felt lighter and clearer. It’s easy to talk to him — he inspires trust. I’m grateful for the support and gladly recommend him.",
      ],
      cta: {
        text: "You can read more reviews on Google Maps or share your own here:",
        button: {
          label: "Google Maps Reviews",
          href: "https://g.page/AlexBon?share",
        },
      },
    },
    story: {
      heading: "My story (for those who stayed till the end)",
      image: "/images/about-story-portrait.webp",
      imageAlt: "Alex Bon leaning on a table in a calm studio setting",
      paragraphs: [
        "I’m not someone who always dreamt of untangling other people’s inner worlds. My path began unexpectedly — in the army. Among boots and drills I realised something simple and important: inner balance doesn’t depend on outer circumstances. The universe has a sense of humour and throws insights into the most unexpected places.",
        "I travelled a lot, lived in Yemen, India and England, earned degrees in economics and psychology, worked in different spheres — from entry-level roles to running my own company.",
        "I was married, went through a divorce, kept a good relationship and have lived on my own for the last ten years. Well, not entirely on my own — my cat lives with me. This experience didn’t make me a guru, but it taught me to notice threads in other people’s stories that once ran through mine. And to see that any knot can be untied.",
      ],
    },
    footerNote:
      "P.S. “Alex Bon” is my pseudonym — it makes things easier. My legal name can remain for boring paperwork.",
    blog: {
      badge: "Thoughts",
      heroTitle: "Just a place to exhale and figure things out",
      heroDescription:
        "Here you’ll find essays on psychology and mindfulness, little stories about big revelations, notes on how to find calm without dodging the storm, tales and parables about inner chaos and quiet, about our dragons and our cats, and thoughts that break the mold. Co-created with AI.",
    },
  },
};

export const getContent = (locale: LocaleKey): LandingContent => contentByLocale[locale];
