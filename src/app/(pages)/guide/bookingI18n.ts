import type { LocaleCode } from '@global/lib/locales';

export type BookingGuideSegment = 'discovery' | 'flow' | 'checkout' | 'telegram';

export type BookingChecklistScreen = string | string[] | null;

type BookingGuideStepId =
  | 'b1'
  | 'b2'
  | 'b3'
  | 'b4'
  | 'b5'
  | 'b6'
  | 'b7'
  | 'b8'
  | 'b9'
  | 'b10';

export interface BookingGuideStep {
  id: BookingGuideStepId;
  segment: BookingGuideSegment;
  order: number;
  numberLabel: string;
  title: string;
  description: string;
  searchTerms: string[];
  imagePaths: string[];
  flowSteps?: string[];
  flowStepScreens?: string[];
  checklist?: string[];
  checklistScreens?: BookingChecklistScreen[];
  isOptional?: boolean;
}

export interface BookingGuideCopy {
  pageTitle: string;
  pageSubtitle: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchCountLabel: string;
  noResultsTitle: string;
  noResultsDescription: string;
  searchPageButtonLabel: string;
  sectionDiscoveryTitle: string;
  sectionDiscoveryDescription: string;
  sectionFlowTitle: string;
  sectionFlowDescription: string;
  sectionCheckoutTitle: string;
  sectionCheckoutDescription: string;
  sectionTelegramTitle: string;
  sectionTelegramDescription: string;
  loginButtonLabel: string;
  noAccountButtonLabel: string;
  openSearchButtonLabel: string;
  optionalBadgeLabel: string;
  flowStepLabel: string;
  telegramChecklistTitle: string;
  imageReferenceLabel: string;
  missingScreenLabel: string;
}

interface BookingGuideStepMeta {
  id: BookingGuideStepId;
  segment: BookingGuideSegment;
  order: number;
  searchTerms: string[];
  imagePaths: string[];
  flowStepScreens?: string[];
  checklistScreens?: BookingChecklistScreen[];
}

interface BookingGuideStepText {
  numberLabel: string;
  title: string;
  description: string;
  flowSteps?: string[];
  checklist?: string[];
  isOptional?: boolean;
}

const BOOKING_STEP_META: BookingGuideStepMeta[] = [
  {
    id: 'b1',
    segment: 'discovery',
    order: 1,
    searchTerms: ['screen 1', 'login', 'personal account', 'register'],
    imagePaths: ['/guides/booking-flow/1.png'],
  },
  {
    id: 'b2',
    segment: 'discovery',
    order: 2,
    searchTerms: ['screen 2', 'screen 3', 'screen 4', 'screen 5', 'search', 'time', 'date'],
    imagePaths: [
      '/guides/booking-flow/2.png',
      '/guides/booking-flow/3.png',
      '/guides/booking-flow/4.png',
      '/guides/booking-flow/5.png',
    ],
  },
  {
    id: 'b3',
    segment: 'discovery',
    order: 3,
    searchTerms: ['screen 6', 'business', 'staff', 'select'],
    imagePaths: ['/guides/booking-flow/6.png'],
  },
  {
    id: 'b4',
    segment: 'discovery',
    order: 4,
    searchTerms: ['screen 7', 'book appointment button', 'start booking session'],
    imagePaths: ['/guides/booking-flow/7.png'],
  },
  {
    id: 'b5',
    segment: 'flow',
    order: 5,
    searchTerms: ['screen 8', 'booking flow', 'steps'],
    imagePaths: ['/guides/booking-flow/8.png'],
  },
  {
    id: 'b6',
    segment: 'flow',
    order: 6,
    searchTerms: ['step by step', 'staff', 'service', 'date', 'time', 'review', 'checkout'],
    imagePaths: [],
    flowStepScreens: [
      '/guides/booking-flow/9.png',
      '/guides/booking-flow/10.png',
      '/guides/booking-flow/11.png',
      '/guides/booking-flow/13.png',
      '/guides/booking-flow/14.png',
      '/guides/booking-flow/15.png',
      '/guides/booking-flow/16.png',
      '/guides/booking-flow/18.png',
      '/guides/booking-flow/17.png',
    ],
  },
  {
    id: 'b7',
    segment: 'checkout',
    order: 7,
    searchTerms: ['screen 19', 'note', 'special request', 'optional'],
    imagePaths: ['/guides/booking-flow/19.png'],
  },
  {
    id: 'b8',
    segment: 'checkout',
    order: 8,
    searchTerms: ['screen 20', 'confirm checkout', 'finish booking'],
    imagePaths: ['/guides/booking-flow/20.png'],
  },
  {
    id: 'b9',
    segment: 'checkout',
    order: 9,
    searchTerms: ['screen 21', 'screen 22', 'toast', 'pending', 'success'],
    imagePaths: ['/guides/booking-flow/21.png', '/guides/booking-flow/22.png'],
  },
  {
    id: 'b10',
    segment: 'telegram',
    order: 10,
    searchTerms: ['screen 23', 'screen 24', 'screen 25', 'screen 26', 'screen 27', 'telegram'],
    imagePaths: ['/guides/booking-flow/23.png'],
    checklistScreens: [
      '/guides/booking-flow/24.png',
      ['/guides/booking-flow/27.png', '/guides/booking-flow/26.png'],
      null,
      null,
      null,
      '/guides/booking-flow/25.png',
    ],
  },
];

const BOOKING_STEP_TEXT: Record<LocaleCode, Record<BookingGuideStepId, BookingGuideStepText>> = {
  en: {
    b1: {
      numberLabel: 'Screen 1',
      title: 'Login with your personal account',
      description: 'Sign in with your personal account before starting the booking journey.',
    },
    b2: {
      numberLabel: 'Screens 2 to 5',
      title: 'Search for business, category, and time',
      description:
        'Use search to find a business or category, and use date/time filters to find valid availability.',
    },
    b3: {
      numberLabel: 'Screen 6',
      title: 'Select the business and preferred staff',
      description: 'Choose the business you want and the staff member you want to book with.',
    },
    b4: {
      numberLabel: 'Screen 7',
      title: 'Click Book Appointment',
      description: 'Click one of the Book Appointment buttons to start the booking session.',
    },
    b5: {
      numberLabel: 'Screen 8',
      title: 'Start booking flow',
      description: 'Follow the booking flow from step to step in order.',
    },
    b6: {
      numberLabel: 'Flow Steps',
      title: 'Follow the step-by-step booking sequence',
      description: 'Complete each step in sequence. The flow should be followed one-by-one from left to right.',
      flowSteps: [
        'Choose a staff member',
        'Choose one service',
        'Click the confirmation button',
        'Pick the appointment date',
        'Pick a specific start time',
        'Click Review Booking',
        'Check and review booking details',
        'Optional: go back and correct choices',
        'Click Checkout to continue',
      ],
    },
    b7: {
      numberLabel: 'Screen 19',
      title: 'Add a note for staff (optional)',
      description:
        'On checkout, you can add a note or special request related to the service you are booking.',
      isOptional: true,
    },
    b8: {
      numberLabel: 'Screen 20',
      title: 'Confirm checkout and finish booking',
      description: 'Use the confirm button to finish the booking process.',
    },
    b9: {
      numberLabel: 'Screens 21 and 22',
      title: 'See success toast and pending booking',
      description:
        'You will see a success toast, and the new booking appears with pending status until staff acceptance.',
    },
    b10: {
      numberLabel: 'Screens 23 to 27',
      title: 'Enable Telegram notifications (optional but recommended)',
      description:
        'Enable Telegram notifications to receive booking confirmations and reminders for your appointment.',
      isOptional: true,
      checklist: [
        'Click the Setup button.',
        'Click Open @KayedniBot.',
        'Press Start in the bot chat.',
        'Accept and share your phone number.',
        'Wait for the bot confirmation message.',
        'Return to Kayedni and confirm setup from the app button.',
      ],
    },
  },
  fr: {
    b1: {
      numberLabel: 'Ecran 1',
      title: 'Se connecter avec un compte personnel',
      description: 'Connectez-vous avec votre compte personnel avant de commencer la reservation.',
    },
    b2: {
      numberLabel: 'Ecrans 2 a 5',
      title: 'Rechercher business, categorie et horaire',
      description:
        'Utilisez la recherche pour trouver un business ou une categorie, puis filtrez par date/heure disponible.',
    },
    b3: {
      numberLabel: 'Ecran 6',
      title: 'Choisir le business et le staff',
      description: 'Selectionnez le business voulu et le membre du staff avec qui vous voulez reserver.',
    },
    b4: {
      numberLabel: 'Ecran 7',
      title: 'Cliquer sur Book Appointment',
      description: 'Cliquez sur le bouton Book Appointment pour demarrer la session de reservation.',
    },
    b5: {
      numberLabel: 'Ecran 8',
      title: 'Demarrer le flux de reservation',
      description: 'Suivez le flux de reservation et avancez etape par etape.',
    },
    b6: {
      numberLabel: 'Etapes du flux',
      title: 'Suivre la sequence pas a pas',
      description: 'Completez la sequence de gauche a droite, une etape apres l autre.',
      flowSteps: [
        'Choisir un membre du staff',
        'Choisir un service',
        'Cliquer sur le bouton de confirmation',
        'Choisir la date du rendez-vous',
        'Choisir une heure de debut',
        'Cliquer sur Review Booking',
        'Verifier les details de reservation',
        'Optionnel: revenir et corriger',
        'Cliquer sur Checkout pour continuer',
      ],
    },
    b7: {
      numberLabel: 'Ecran 19',
      title: 'Ajouter une note pour le staff (optionnel)',
      description: 'Sur checkout, vous pouvez ajouter une note ou demande speciale pour le service reserve.',
      isOptional: true,
    },
    b8: {
      numberLabel: 'Ecran 20',
      title: 'Confirmer checkout et terminer',
      description: 'Utilisez le bouton de confirmation pour finaliser la reservation.',
    },
    b9: {
      numberLabel: 'Ecrans 21 et 22',
      title: 'Voir le toast de succes et le statut pending',
      description:
        'Un toast de succes apparait, puis la reservation est ajoutee en statut pending en attente du staff.',
    },
    b10: {
      numberLabel: 'Ecrans 23 a 27',
      title: 'Activer Telegram (optionnel mais recommande)',
      description:
        'Activez les notifications Telegram pour recevoir confirmation et rappels de reservation.',
      isOptional: true,
      checklist: [
        'Cliquez sur le bouton Setup.',
        'Cliquez sur Open @KayedniBot.',
        'Appuyez sur Start dans le bot.',
        'Acceptez et partagez votre numero de telephone.',
        'Attendez le message de confirmation du bot.',
        'Revenez dans Kayedni et confirmez la configuration.',
      ],
    },
  },
  ar: {
    b1: {
      numberLabel: 'الشاشة 1',
      title: 'سجل الدخول بحسابك الشخصي',
      description: 'ابدأ بتسجيل الدخول باستخدام حسابك الشخصي قبل بدء الحجز.',
    },
    b2: {
      numberLabel: 'الشاشات 2 الى 5',
      title: 'ابحث عن النشاط او الفئة او الوقت',
      description:
        'استخدم البحث للعثور على النشاط او الفئة المناسبة، ثم استخدم التاريخ والوقت للعثور على المواعيد المتاحة.',
    },
    b3: {
      numberLabel: 'الشاشة 6',
      title: 'اختر النشاط والموظف',
      description: 'اختر النشاط الذي تريد الحجز لديه ثم اختر الموظف المناسب.',
    },
    b4: {
      numberLabel: 'الشاشة 7',
      title: 'اضغط على Book Appointment',
      description: 'اضغط زر Book Appointment لبدء جلسة الحجز.',
    },
    b5: {
      numberLabel: 'الشاشة 8',
      title: 'ابدأ مسار الحجز',
      description: 'اتبع خطوات الحجز بالتسلسل من خطوة الى خطوة.',
    },
    b6: {
      numberLabel: 'خطوات المسار',
      title: 'اتبع التسلسل خطوة بخطوة',
      description: 'نفّذ الخطوات بالترتيب من اليسار الى اليمين خطوة تلو الاخرى.',
      flowSteps: [
        'اختر موظف',
        'اختر خدمة واحدة',
        'اضغط زر التأكيد',
        'اختر تاريخ الموعد',
        'اختر وقت البداية',
        'اضغط Review Booking',
        'راجع تفاصيل الحجز',
        'اختياري: ارجع وصحح اختياراتك',
        'اضغط Checkout للمتابعة',
      ],
    },
    b7: {
      numberLabel: 'الشاشة 19',
      title: 'اضف ملاحظة للموظف (اختياري)',
      description: 'في صفحة الدفع يمكنك اضافة ملاحظة او طلب خاص متعلق بالخدمة.',
      isOptional: true,
    },
    b8: {
      numberLabel: 'الشاشة 20',
      title: 'اكد الدفع وانهِ الحجز',
      description: 'اضغط زر التأكيد لإنهاء عملية الحجز.',
    },
    b9: {
      numberLabel: 'الشاشات 21 و22',
      title: 'شاهد رسالة النجاح والحالة Pending',
      description: 'ستظهر رسالة نجاح ويظهر الحجز الجديد بحالة Pending بانتظار موافقة الموظف.',
    },
    b10: {
      numberLabel: 'الشاشات 23 الى 27',
      title: 'فعّل اشعارات تيليجرام (اختياري ويفضل)',
      description: 'فعّل اشعارات تيليجرام لتصلك تأكيدات الحجز والتذكيرات.',
      isOptional: true,
      checklist: [
        'اضغط زر Setup.',
        'اضغط Open @KayedniBot.',
        'اضغط Start داخل محادثة البوت.',
        'وافق وشارك رقم هاتفك.',
        'انتظر رسالة التأكيد من البوت.',
        'ارجع الى Kayedni واكد الاعداد من الزر داخل التطبيق.',
      ],
    },
  },
};

const BOOKING_COPY: Record<LocaleCode, BookingGuideCopy> = {
  en: {
    pageTitle: 'Booking Flow Guide',
    pageSubtitle:
      'Step-by-step SOP for booking a service from search to confirmation, with optional Telegram notifications.',
    searchLabel: 'Search booking guide steps',
    searchPlaceholder: 'Search by step, action, or keyword (example: checkout, telegram, confirm)',
    searchCountLabel: 'steps shown',
    noResultsTitle: 'No matching booking steps found',
    noResultsDescription: 'Try broader terms like login, search, staff, checkout, or telegram.',
    searchPageButtonLabel: 'Open Find Services',
    sectionDiscoveryTitle: 'Discovery and Selection',
    sectionDiscoveryDescription: 'Login, search, and choose the business before starting booking.',
    sectionFlowTitle: 'Booking Session Flow',
    sectionFlowDescription: 'Follow the internal booking sequence exactly as guided.',
    sectionCheckoutTitle: 'Checkout and Confirmation',
    sectionCheckoutDescription: 'Finalize checkout and verify booking success.',
    sectionTelegramTitle: 'Telegram Notifications',
    sectionTelegramDescription: 'Optional but recommended setup for booking updates and reminders.',
    loginButtonLabel: 'Open Login',
    noAccountButtonLabel: 'No account yet? Create one',
    openSearchButtonLabel: 'Open Find Services',
    optionalBadgeLabel: 'Optional',
    flowStepLabel: 'Flow Step',
    telegramChecklistTitle: 'Telegram setup steps',
    imageReferenceLabel: 'Screen reference',
    missingScreenLabel: 'Screenshot missing in source guide pack',
  },
  fr: {
    pageTitle: 'Guide du flux de reservation',
    pageSubtitle:
      'SOP pas a pas pour reserver un service, de la recherche a la confirmation, avec Telegram optionnel.',
    searchLabel: 'Rechercher dans les etapes de reservation',
    searchPlaceholder: 'Rechercher par etape, action ou mot-cle (ex: checkout, telegram, staff)',
    searchCountLabel: 'etapes affichees',
    noResultsTitle: 'Aucune etape correspondante',
    noResultsDescription: 'Essayez: login, recherche, staff, checkout, telegram.',
    searchPageButtonLabel: 'Ouvrir Find Services',
    sectionDiscoveryTitle: 'Decouverte et selection',
    sectionDiscoveryDescription: 'Connectez-vous, cherchez, puis choisissez le business cible.',
    sectionFlowTitle: 'Flux de reservation',
    sectionFlowDescription: 'Suivez la sequence interne de reservation exactement.',
    sectionCheckoutTitle: 'Checkout et confirmation',
    sectionCheckoutDescription: 'Finalisez checkout et verifiez le succes de reservation.',
    sectionTelegramTitle: 'Notifications Telegram',
    sectionTelegramDescription: 'Optionnel mais recommande pour confirmations et rappels.',
    loginButtonLabel: 'Ouvrir Login',
    noAccountButtonLabel: 'Pas de compte? Creer un compte',
    openSearchButtonLabel: 'Ouvrir la recherche',
    optionalBadgeLabel: 'Optionnel',
    flowStepLabel: 'Etape',
    telegramChecklistTitle: 'Etapes de configuration Telegram',
    imageReferenceLabel: 'Reference ecran',
    missingScreenLabel: 'Capture manquante dans le pack source du guide',
  },
  ar: {
    pageTitle: 'دليل مسار الحجز',
    pageSubtitle:
      'دليل SOP خطوة بخطوة لحجز خدمة من البحث حتى التأكيد، مع اشعارات تيليجرام الاختيارية.',
    searchLabel: 'ابحث داخل خطوات دليل الحجز',
    searchPlaceholder: 'ابحث بالخطوة او الاجراء او كلمة مفتاحية (مثال: checkout, telegram, confirm)',
    searchCountLabel: 'خطوات معروضة',
    noResultsTitle: 'لا توجد خطوات مطابقة',
    noResultsDescription: 'جرّب كلمات اوسع مثل login او search او staff او checkout او telegram.',
    searchPageButtonLabel: 'افتح Find Services',
    sectionDiscoveryTitle: 'الاستكشاف والاختيار',
    sectionDiscoveryDescription: 'سجل الدخول ثم ابحث واختر النشاط قبل بدء الحجز.',
    sectionFlowTitle: 'مسار جلسة الحجز',
    sectionFlowDescription: 'اتبع تسلسل الحجز الداخلي كما هو موضح.',
    sectionCheckoutTitle: 'الدفع والتأكيد',
    sectionCheckoutDescription: 'انهِ الدفع وتأكد من نجاح الحجز.',
    sectionTelegramTitle: 'اشعارات تيليجرام',
    sectionTelegramDescription: 'اختياري لكنه مفيد لتحديثات الحجز والتذكيرات.',
    loginButtonLabel: 'افتح صفحة Login',
    noAccountButtonLabel: 'ما عندكش حساب؟ اعمل حساب',
    openSearchButtonLabel: 'افتح Find Services',
    optionalBadgeLabel: 'اختياري',
    flowStepLabel: 'خطوة',
    telegramChecklistTitle: 'خطوات تفعيل تيليجرام',
    imageReferenceLabel: 'مرجع الشاشة',
    missingScreenLabel: 'صورة الشاشة غير متوفرة في حزمة الدليل المصدرية',
  },
};

export function getBookingGuideCopy(locale: LocaleCode): BookingGuideCopy {
  return BOOKING_COPY[locale] ?? BOOKING_COPY.en;
}

export function getBookingGuideSteps(locale: LocaleCode): BookingGuideStep[] {
  const localizedText = BOOKING_STEP_TEXT[locale] ?? BOOKING_STEP_TEXT.en;

  return BOOKING_STEP_META.map((stepMeta) => {
    const stepText = localizedText[stepMeta.id] ?? BOOKING_STEP_TEXT.en[stepMeta.id];

    return {
      id: stepMeta.id,
      segment: stepMeta.segment,
      order: stepMeta.order,
      numberLabel: stepText.numberLabel,
      title: stepText.title,
      description: stepText.description,
      searchTerms: stepMeta.searchTerms,
      imagePaths: stepMeta.imagePaths,
      flowSteps: stepText.flowSteps,
      flowStepScreens: stepMeta.flowStepScreens,
      checklist: stepText.checklist,
      checklistScreens: stepMeta.checklistScreens,
      isOptional: stepText.isOptional,
    };
  });
}
