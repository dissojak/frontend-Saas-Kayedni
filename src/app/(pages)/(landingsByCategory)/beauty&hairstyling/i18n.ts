import type { LocaleCode } from '@global/lib/locales';

type FeatureCard = {
  tag: string;
  title: string;
  description: string;
  action: string;
};

type WhyPoint = {
  title: string;
  description: string;
};

type BeautyContent = {
  trustedBy: string;
  heroTitleMain: string;
  heroTitleAccent: string;
  heroDescription: string;
  freeTrialCta: string;
  newBooking: string;
  bookingExample: string;
  justNow: string;
  todaysRevenue: string;
  partnerTrust: string;
  statOnlineBooking: string;
  statLessNoShows: string;
  statCustomizable: string;
  row1Title: string;
  row1Description: string;
  row1PrimaryCta: string;
  row1SecondaryCta: string;
  row2Title: string;
  row2Description: string;
  row2Cta: string;
  row3Title: string;
  row3Description: string;
  row3Cta: string;
  featuresTitle: string;
  featuresDescription: string;
  featureCards: FeatureCard[];
  readMore: string;
  suiteTitle: string;
  suiteDescription: string;
  bentoStaffTitle: string;
  bentoStaffDescription: string;
  bentoNotificationsTitle: string;
  bentoNotificationsDescription: string;
  bentoPresenceTitle: string;
  bentoPresenceDescription: string;
  bentoCustomizationTitle: string;
  bentoCustomizationDescription: string;
  whyTitle: string;
  whyPoints: WhyPoint[];
  lovedByOwners: string;
  testimonialQuote: string;
  testimonialFounderRole: string;
  worksWhereTitle: string;
  worksWhereDescription: string;
  appCalendar: string;
  appInstagram: string;
  appTelegram: string;
  appEmailSync: string;
  bottomTitle: string;
  bottomDescription: string;
  bottomCta: string;
};

const BEAUTY_CONTENT: Record<LocaleCode, BeautyContent> = {
  en: {
    trustedBy: 'Trusted by 50+ Beauty Centres',
    heroTitleMain: 'Beauty',
    heroTitleAccent: 'Business',
    heroDescription:
      'The all-in-one clinic and salon management software. Streamline bookings, automate marketing, and command your revenue with elegance.',
    freeTrialCta: 'Start 14-Day Free Trial',
    newBooking: 'New Booking',
    bookingExample: 'Balayage & Cut - 185 DT',
    justNow: 'Just Now',
    todaysRevenue: "Today's Revenue",
    partnerTrust: '30+ thriving partner salons trust our platform.',
    statOnlineBooking: 'Online Booking',
    statLessNoShows: 'Less No-Shows',
    statCustomizable: 'Customizable',
    row1Title: 'Your Digital Receptionist',
    row1Description:
      'Say goodbye to phone tags and direct messages. Let clients reserve slots, choose add-ons, and receive instant confirmations while you focus on service.',
    row1PrimaryCta: 'Create Account',
    row1SecondaryCta: 'Contact Sales',
    row2Title: 'Precision & Care in Your Operations',
    row2Description:
      'From formula tracking to profit analysis, every tool is built to give you actionable insights and total control.',
    row2Cta: 'Go To Features',
    row3Title: 'Long-Lasting Growth & Loyalty',
    row3Description:
      'Automated reminders and promo campaigns improve retention and keep your schedule full all week long.',
    row3Cta: 'Explore my software',
    featuresTitle: 'Platform Features',
    featuresDescription:
      'Premium SaaS tools designed to optimize and automate day-to-day salon operations so your team can focus on artistry.',
    featureCards: [
      {
        tag: 'Core',
        title: 'Smart Scheduling',
        description:
          'A branded booking link for clients with advanced gap-booking and full calendar sync.',
        action: 'View Demo',
      },
      {
        tag: 'Growth',
        title: 'Client CRM',
        description:
          'Detailed profiles, visit history, and targeted SMS campaigns for stronger retention.',
        action: 'Try CRM',
      },
      {
        tag: 'Scale',
        title: 'Business Analytics',
        description:
          'Track popular services, staff performance, and retention metrics to grow revenue faster.',
        action: 'View Dashboard',
      },
    ],
    readMore: 'Read more',
    suiteTitle: 'The Complete Management Suite',
    suiteDescription:
      'Kayedni replaces up to 5 software tools, from staff scheduling to inventory visibility, in one workflow.',
    bentoStaffTitle: 'Staff Management',
    bentoStaffDescription:
      'Set hours, handle shift swaps, and keep appointments synced with Telegram and email alerts.',
    bentoNotificationsTitle: 'Automated Telegram Notifications',
    bentoNotificationsDescription:
      'Automatic email and Telegram alerts for both clients and staff to reduce missed appointments.',
    bentoPresenceTitle: 'Online Presence',
    bentoPresenceDescription:
      'Stand out with a branded booking page that showcases your salon, services, and portfolio 24/7.',
    bentoCustomizationTitle: 'Coming Soon: Deep Customization',
    bentoCustomizationDescription:
      'Soon you will control page layout, colors, fonts, and brand tone directly inside Kayedni.',
    whyTitle: 'Why Kayedni?',
    whyPoints: [
      {
        title: 'Built For Teams & Solos',
        description: 'Run multi-staff commissions or solo workflows with equal efficiency.',
      },
      {
        title: 'Instant Notifications',
        description: 'Automatic Telegram and email updates keep staff and clients aligned.',
      },
      {
        title: 'Reliable Data & Support',
        description: 'Secure backups, stable uptime, and responsive human support when needed.',
      },
    ],
    lovedByOwners: 'Loved by Owners',
    testimonialQuote:
      'I am beyond impressed. My salon schedule has never looked this organized, and reporting finally gives me clear visibility into real revenue.',
    testimonialFounderRole: 'Founder, The Hair Studio',
    worksWhereTitle: 'Works Where You Work',
    worksWhereDescription:
      'Kayedni connects with platforms you already rely on, so your data stays in sync.',
    appCalendar: 'Calendar',
    appInstagram: 'Instagram',
    appTelegram: 'Telegram',
    appEmailSync: 'Email Sync',
    bottomTitle: 'Simplify Your Salon Operations',
    bottomDescription:
      'Join successful salon owners who upgraded operations with Kayedni and accelerated sustainable growth.',
    bottomCta: 'Create Free Account',
  },
  fr: {
    trustedBy: 'Adopte par plus de 50 centres beaute',
    heroTitleMain: 'Beauty',
    heroTitleAccent: 'Business',
    heroDescription:
      'Le logiciel tout-en-un pour instituts et salons. Simplifiez les reservations, automatisez le marketing et pilotez vos revenus.',
    freeTrialCta: 'Essai gratuit 14 jours',
    newBooking: 'Nouvelle reservation',
    bookingExample: 'Balayage & coupe - 185 DT',
    justNow: 'A l instant',
    todaysRevenue: 'Revenus du jour',
    partnerTrust: 'Plus de 30 salons partenaires performants nous font confiance.',
    statOnlineBooking: 'Reservation en ligne',
    statLessNoShows: 'Moins de no-shows',
    statCustomizable: 'Personnalisable',
    row1Title: 'Votre receptionniste digitale',
    row1Description:
      'Fini les appels repetes et les messages disperses. Vos clients reservent, choisissent les options et recoivent une confirmation immediate.',
    row1PrimaryCta: 'Creer un compte',
    row1SecondaryCta: 'Contacter les ventes',
    row2Title: 'Precision et maitrise de vos operations',
    row2Description:
      'Du suivi des formules a l analyse de rentabilite, chaque outil vous donne des decisions claires.',
    row2Cta: 'Voir les fonctionnalites',
    row3Title: 'Croissance durable et fidelite',
    row3Description:
      'Rappels automatiques et campagnes promo pour renforcer la fidelite et remplir votre planning.',
    row3Cta: 'Explorer le logiciel',
    featuresTitle: 'Fonctionnalites de la plateforme',
    featuresDescription:
      'Des outils SaaS premium pour automatiser vos operations quotidiennes et liberer du temps pour votre equipe.',
    featureCards: [
      {
        tag: 'Essentiel',
        title: 'Planning intelligent',
        description: 'Lien de reservation a votre image, gestion avancee des trous et synchronisation agenda.',
        action: 'Voir la demo',
      },
      {
        tag: 'Croissance',
        title: 'CRM client',
        description: 'Profils detailles, historique et campagnes SMS ciblees pour mieux fideliser.',
        action: 'Tester le CRM',
      },
      {
        tag: 'Scale',
        title: 'Analyses business',
        description: 'Suivez services, performance equipe et retention pour faire croitre vos revenus.',
        action: 'Voir le dashboard',
      },
    ],
    readMore: 'En savoir plus',
    suiteTitle: 'La suite de gestion complete',
    suiteDescription:
      'Kayedni remplace jusqu a 5 logiciels: planning equipe, inventaire et pilotage dans un seul flux.',
    bentoStaffTitle: 'Gestion du staff',
    bentoStaffDescription:
      'Definissez les horaires, gerez les echanges de shifts et synchronisez les rendez-vous avec alertes Telegram et e-mail.',
    bentoNotificationsTitle: 'Notifications Telegram automatiques',
    bentoNotificationsDescription:
      'Alertes automatiques par email et Telegram pour vos clients et votre staff.',
    bentoPresenceTitle: 'Presence en ligne',
    bentoPresenceDescription:
      'Mettez en valeur votre salon avec une page de reservation a votre image, disponible 24/7.',
    bentoCustomizationTitle: 'Bientot: personnalisation avancee',
    bentoCustomizationDescription:
      'Bientot, controle total du layout, des couleurs, des polices et du style de marque dans Kayedni.',
    whyTitle: 'Pourquoi Kayedni ?',
    whyPoints: [
      {
        title: 'Pense pour equipes et independants',
        description: 'Adaptez-vous facilement aux structures multi-staff ou solo.',
      },
      {
        title: 'Notifications instantanees',
        description: 'Mises a jour Telegram et e-mail pour garder clients et equipe synchronises.',
      },
      {
        title: 'Donnees fiables et support humain',
        description: 'Sauvegardes securisees, haute disponibilite et assistance reactive.',
      },
    ],
    lovedByOwners: 'Adore par les proprietaires',
    testimonialQuote:
      'Organisation parfaite, meilleur suivi des revenus et beaucoup moins de stress administratif au quotidien.',
    testimonialFounderRole: 'Fondatrice, The Hair Studio',
    worksWhereTitle: 'Fonctionne la ou vous travaillez',
    worksWhereDescription:
      'Kayedni se connecte a vos plateformes habituelles pour conserver vos donnees synchronisees.',
    appCalendar: 'Calendrier',
    appInstagram: 'Instagram',
    appTelegram: 'Telegram',
    appEmailSync: 'Synchronisation email',
    bottomTitle: 'Simplifiez les operations de votre salon',
    bottomDescription:
      'Rejoignez les proprietaires qui ont modernise leur gestion avec Kayedni.',
    bottomCta: 'Creer un compte gratuit',
  },
  ar: {
    trustedBy: 'موثوق من +50 مركز تجميل',
    heroTitleMain: 'Beauty',
    heroTitleAccent: 'Business',
    heroDescription:
      'برنامج متكامل لادارة العيادات وصالونات التجميل. نظم الحجوزات، اتمت التسويق، وتحكم في الايرادات بأناقة.',
    freeTrialCta: 'ابدأ تجربة مجانية 14 يوم',
    newBooking: 'حجز جديد',
    bookingExample: 'بالياج وقص - 185 د.ت',
    justNow: 'الآن',
    todaysRevenue: 'ايرادات اليوم',
    partnerTrust: 'اكثر من 30 صالون شريك ناجح يثق بمنصتنا.',
    statOnlineBooking: 'حجز اونلاين',
    statLessNoShows: 'تقليل عدم الحضور',
    statCustomizable: 'قابل للتخصيص',
    row1Title: 'موظف الاستقبال الرقمي الخاص بك',
    row1Description:
      'وداعا لفوضى الاتصالات والرسائل. عملاؤك يحجزون ويختارون الخدمات الاضافية ويتلقون تأكيدا فوريا.',
    row1PrimaryCta: 'انشئ حسابا',
    row1SecondaryCta: 'تواصل مع المبيعات',
    row2Title: 'دقة وعناية في ادارة التشغيل',
    row2Description:
      'من تتبع التركيبات الى تحليل الربحية، كل ادواتك تمنحك قرارات عملية وتحكم كامل.',
    row2Cta: 'اذهب الى المزايا',
    row3Title: 'نمو مستدام وولاء اقوى',
    row3Description:
      'التذكيرات التلقائية والحملات الترويجية تزيد الاحتفاظ بالعملاء وتحافظ على جدول ممتلئ.',
    row3Cta: 'استكشف البرنامج',
    featuresTitle: 'مزايا المنصة',
    featuresDescription:
      'ادوات SaaS متقدمة لأتمتة عمليات الصالون اليومية وتركز فريقك على جودة الخدمة.',
    featureCards: [
      {
        tag: 'اساسي',
        title: 'جدولة ذكية',
        description: 'رابط حجز بهوية الصالون مع ادارة الفجوات ومزامنة كاملة للتقويم.',
        action: 'شاهد العرض',
      },
      {
        tag: 'نمو',
        title: 'CRM العملاء',
        description: 'ملفات تفصيلية وسجل زيارات وحملات SMS موجهة لرفع الولاء.',
        action: 'جرّب CRM',
      },
      {
        tag: 'توسّع',
        title: 'تحليلات النشاط',
        description: 'راقب الخدمات الاكثر طلبا واداء الفريق ومعدلات الاحتفاظ لزيادة الايراد.',
        action: 'عرض لوحة التحليل',
      },
    ],
    readMore: 'اقرأ المزيد',
    suiteTitle: 'منظومة الادارة الكاملة',
    suiteDescription:
      'Kayedni يعوض حتى 5 ادوات مختلفة: جداول الموظفين، المخزون، والمتابعة التشغيلية في مسار واحد.',
    bentoStaffTitle: 'ادارة الموظفين',
    bentoStaffDescription:
      'حدد ساعات العمل، نظم تبديل الورديات، وزامن المواعيد مع تنبيهات Telegram والبريد.',
    bentoNotificationsTitle: 'تنبيهات Telegram تلقائية',
    bentoNotificationsDescription:
      'تنبيهات فورية بالبريد وTelegram للموظفين والعملاء لتقليل تفويت المواعيد.',
    bentoPresenceTitle: 'حضور قوي اونلاين',
    bentoPresenceDescription:
      'اظهر صالونك بصفحة حجز احترافية تعرض خدماتك واعمالك على مدار الساعة.',
    bentoCustomizationTitle: 'قريبا: تخصيص متقدم',
    bentoCustomizationDescription:
      'قريبا ستتحكم في التخطيط والالوان والخطوط وهوية العلامة مباشرة داخل Kayedni.',
    whyTitle: 'لماذا Kayedni؟',
    whyPoints: [
      {
        title: 'مصمم للفرق وللعمل الفردي',
        description: 'يدعم بيئات متعددة الموظفين او ادارة فردية بنفس الكفاءة.',
      },
      {
        title: 'تنبيهات فورية',
        description: 'اشعارات Telegram والبريد تبقي الفريق والعملاء على نفس الصفحة.',
      },
      {
        title: 'بيانات موثوقة ودعم حقيقي',
        description: 'نسخ احتياطية امنة، استقرار عال، ودعم بشري سريع عند الحاجة.',
      },
    ],
    lovedByOwners: 'محبوب من اصحاب الصالونات',
    testimonialQuote:
      'تنظيم افضل بكثير، وضوح اكبر في الايرادات، وتخفيف كبير لضغط المهام الادارية اليومية.',
    testimonialFounderRole: 'مؤسسة، The Hair Studio',
    worksWhereTitle: 'يعمل حيث تعمل',
    worksWhereDescription:
      'Kayedni يتكامل مع المنصات التي تستخدمها بالفعل حتى تبقى البيانات متزامنة.',
    appCalendar: 'التقويم',
    appInstagram: 'Instagram',
    appTelegram: 'Telegram',
    appEmailSync: 'مزامنة البريد',
    bottomTitle: 'بسّط عمليات صالونك',
    bottomDescription:
      'انضم الى اصحاب الصالونات الذين طوروا ادارتهم مع Kayedni وحققوا نموا مستداما.',
    bottomCta: 'انشئ حسابا مجانا',
  },
};

export function getBeautyLandingContent(locale: LocaleCode): BeautyContent {
  return BEAUTY_CONTENT[locale] ?? BEAUTY_CONTENT.en;
}
