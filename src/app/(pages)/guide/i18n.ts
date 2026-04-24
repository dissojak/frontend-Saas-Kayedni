import type { LocaleCode } from '@global/lib/locales';

export type GuideSegment = 'mainStart' | 'otherFlow' | 'mainEnd';

export interface GuideSidebarItem {
  id: string;
  title: string;
  isActive: boolean;
  isPlaceholder: boolean;
}

export interface GuideStep {
  id: GuideStepId;
  segment: GuideSegment;
  order: number;
  numberLabel: string;
  title: string;
  description: string;
  imagePaths: string[];
  searchTerms: string[];
  hasContextualHelp?: boolean;
}

export interface GuideCopy {
  pageTitle: string;
  pageSubtitle: string;
  landingButtonLabel: string;
  sidebarTitle: string;
  sidebarPlaceholderLabel: string;
  activeThemeLabel: string;
  activeThemeGeneric: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchCountLabel: string;
  imageReferenceLabel: string;
  noResultsTitle: string;
  noResultsDescription: string;
  aliasNotice: string;
  sectionMainStartTitle: string;
  sectionMainStartDescription: string;
  sectionOtherTitle: string;
  sectionOtherDescription: string;
  sectionMainEndTitle: string;
  sectionMainEndDescription: string;
  m8ContextualTitle: string;
  m8ContextualMessage: string;
  m8ContextualButtonLabel: string;
  o4NavigationLabel: string;
  o5NavigationLabel: string;
  o6NavigationLabel: string;
  sidebarItems: GuideSidebarItem[];
}

type GuideStepId =
  | 'm1'
  | 'm2'
  | 'm3'
  | 'm4'
  | 'm5'
  | 'm6'
  | 'm7'
  | 'm8'
  | 'o1'
  | 'o2'
  | 'o3'
  | 'o4'
  | 'o5'
  | 'o6'
  | 'm9'
  | 'm10'
  | 'm11'
  | 'm12'
  | 'm13';

interface GuideStepMeta {
  id: GuideStepId;
  segment: GuideSegment;
  order: number;
  imagePaths: string[];
  searchTerms: string[];
  hasContextualHelp?: boolean;
}

const GUIDE_STEP_META: GuideStepMeta[] = [
  {
    id: 'm1',
    segment: 'mainStart',
    order: 1,
    imagePaths: ['/guides/register-owner-business/main/1.png'],
    searchTerms: ['main', 'screen 1', 'sign up', 'landing'],
  },
  {
    id: 'm2',
    segment: 'mainStart',
    order: 2,
    imagePaths: ['/guides/register-owner-business/main/2.png'],
    searchTerms: ['main', 'screen 2', 'business', 'account type'],
  },
  {
    id: 'm3',
    segment: 'mainStart',
    order: 3,
    imagePaths: ['/guides/register-owner-business/main/3.png'],
    searchTerms: ['main', 'screen 3', 'steps', 'flow'],
  },
  {
    id: 'm4',
    segment: 'mainStart',
    order: 4,
    imagePaths: ['/guides/register-owner-business/main/4.png'],
    searchTerms: ['main', 'screen 4', 'profile', 'owner form'],
  },
  {
    id: 'm5',
    segment: 'mainStart',
    order: 5,
    imagePaths: ['/guides/register-owner-business/main/5.png'],
    searchTerms: ['main', 'screen 5', 'terms', 'privacy'],
  },
  {
    id: 'm6',
    segment: 'mainStart',
    order: 6,
    imagePaths: ['/guides/register-owner-business/main/6.png'],
    searchTerms: ['main', 'screen 6', 'continue', 'business details'],
  },
  {
    id: 'm7',
    segment: 'mainStart',
    order: 7,
    imagePaths: ['/guides/register-owner-business/main/7.png'],
    searchTerms: ['main', 'screen 7', 'business form', 'business name'],
  },
  {
    id: 'm8',
    segment: 'mainStart',
    order: 8,
    imagePaths: ['/guides/register-owner-business/main/8.png'],
    searchTerms: ['main', 'screen 8', 'category', 'industry'],
    hasContextualHelp: true,
  },
  {
    id: 'o1',
    segment: 'otherFlow',
    order: 9,
    imagePaths: ['/guides/register-owner-business/other/1.png'],
    searchTerms: ['other flow', 'screen 1', 'other not listed'],
  },
  {
    id: 'o2',
    segment: 'otherFlow',
    order: 10,
    imagePaths: ['/guides/register-owner-business/other/2.png'],
    searchTerms: ['other flow', 'screen 2', 'notification', 'new step'],
  },
  {
    id: 'o3',
    segment: 'otherFlow',
    order: 11,
    imagePaths: [
      '/guides/register-owner-business/other/3.png',
      '/guides/register-owner-business/other/4.png',
    ],
    searchTerms: ['other flow', 'screen 3', 'screen 4', 'updated flow'],
  },
  {
    id: 'o4',
    segment: 'otherFlow',
    order: 12,
    imagePaths: ['/guides/register-owner-business/main/9.png'],
    searchTerms: ['other flow', 'return', 'optional step', 'step 3'],
  },
  {
    id: 'o5',
    segment: 'otherFlow',
    order: 13,
    imagePaths: [
      '/guides/register-owner-business/other/6.png',
      '/guides/register-owner-business/other/5.png',
    ],
    searchTerms: ['other flow', 'request', 'industry details'],
  },
  {
    id: 'o6',
    segment: 'otherFlow',
    order: 14,
    imagePaths: ['/guides/register-owner-business/other/7.png'],
    searchTerms: ['other flow', 'submit request', 'create owner business'],
  },
  {
    id: 'm9',
    segment: 'mainEnd',
    order: 15,
    imagePaths: ['/guides/register-owner-business/main/9.png'],
    searchTerms: ['main', 'screen 9', 'step 3', 'optional'],
  },
  {
    id: 'm10',
    segment: 'mainEnd',
    order: 16,
    imagePaths: ['/guides/register-owner-business/main/10.png'],
    searchTerms: ['main', 'screen 10', 'business information', 'optional'],
  },
  {
    id: 'm11',
    segment: 'mainEnd',
    order: 17,
    imagePaths: ['/guides/register-owner-business/main/11.png'],
    searchTerms: ['main', 'screen 11', 'create account', 'create business'],
  },
  {
    id: 'm12',
    segment: 'mainEnd',
    order: 18,
    imagePaths: ['/guides/register-owner-business/main/12.png'],
    searchTerms: ['main', 'screen 12', 'success', 'check email'],
  },
  {
    id: 'm13',
    segment: 'mainEnd',
    order: 19,
    imagePaths: ['/guides/register-owner-business/main/13.png'],
    searchTerms: ['main', 'screen 13', 'verify', 'activation email'],
  },
];

interface StepText {
  numberLabel: string;
  title: string;
  description: string;
}

const GUIDE_STEP_TEXT: Record<LocaleCode, Record<GuideStepId, StepText>> = {
  en: {
    m1: {
      numberLabel: 'Screen 1',
      title: 'Click on Sign Up',
      description: 'Go to the Kayedni landing page and start by clicking the Sign Up button.',
    },
    m2: {
      numberLabel: 'Screen 2',
      title: 'Choose Business account type',
      description: 'In account type, select Business to continue with the owner + business flow.',
    },
    m3: {
      numberLabel: 'Screen 3',
      title: 'Review the registration flow',
      description: 'The flow shows the 3 steps you will complete for the standard business registration.',
    },
    m4: {
      numberLabel: 'Screen 4',
      title: 'Fill owner profile form',
      description: 'Complete the owner profile fields using the placeholders as the expected format.',
    },
    m5: {
      numberLabel: 'Screen 5',
      title: 'Accept terms and policies',
      description: 'Read and accept Terms of Service and Privacy Policy before continuing.',
    },
    m6: {
      numberLabel: 'Screen 6',
      title: 'Continue to business details',
      description: 'Click the action button to move from owner setup to business setup (step 2).',
    },
    m7: {
      numberLabel: 'Screen 7',
      title: 'Fill business form',
      description: 'Enter business information such as business name and business location.',
    },
    m8: {
      numberLabel: 'Screen 8',
      title: 'Choose business category',
      description: 'Select the category matching your industry. If missing, continue with the Other flow below.',
    },
    o1: {
      numberLabel: 'Other Flow - Screen 1',
      title: 'Select Other (not listed)',
      description: 'If your industry is unavailable, choose Other (not listed) from category options.',
    },
    o2: {
      numberLabel: 'Other Flow - Screen 2',
      title: 'Notice the extra request step',
      description: 'After selecting Other, the UI notifies you that a new request step was added.',
    },
    o3: {
      numberLabel: 'Other Flow - Screens 3 and 4',
      title: 'Review updated flow with Request step',
      description: 'The flow updates to include Request after Optional. You will complete Optional first, then Request.',
    },
    o4: {
      numberLabel: 'Other Flow - Transition',
      title: 'Return to step 3 (Optional)',
      description: 'Continue from Optional step (step 3), then move to the Request step.',
    },
    o5: {
      numberLabel: 'Other Flow - Screens 6 and 5',
      title: 'Fill industry request details',
      description: 'Provide your actual industry name and details so the team can consider adding a dedicated category.',
    },
    o6: {
      numberLabel: 'Other Flow - Screen 7',
      title: 'Submit owner + business + request',
      description: 'Use the final action button to submit account creation, business creation, and category request.',
    },
    m9: {
      numberLabel: 'Screen 9',
      title: 'Continue to final step 3',
      description: 'Proceed to the last standard step (Optional) in the main registration flow.',
    },
    m10: {
      numberLabel: 'Screen 10',
      title: 'Add optional business details',
      description: 'Complete additional optional business fields before final submission.',
    },
    m11: {
      numberLabel: 'Screen 11',
      title: 'Create owner + business',
      description: 'Click the create button to submit your registration data.',
    },
    m12: {
      numberLabel: 'Screen 12',
      title: 'Registration success screen',
      description: 'If registration succeeds, you will see a success message asking you to check your email.',
    },
    m13: {
      numberLabel: 'Screen 13',
      title: 'Verify account from email',
      description: 'Open your email and click the activation button/link to verify your new account.',
    },
  },
  fr: {
    m1: {
      numberLabel: 'Ecran 1',
      title: 'Cliquer sur Sign Up',
      description: 'Allez sur la page d accueil Kayedni puis cliquez sur Sign Up pour commencer.',
    },
    m2: {
      numberLabel: 'Ecran 2',
      title: 'Choisir le type Business',
      description: 'Dans le type de compte, choisissez Business pour continuer le flux owner + business.',
    },
    m3: {
      numberLabel: 'Ecran 3',
      title: 'Voir le flux d inscription',
      description: 'Le flux affiche les 3 etapes de l inscription business standard.',
    },
    m4: {
      numberLabel: 'Ecran 4',
      title: 'Remplir le profil owner',
      description: 'Completez les champs du profil owner en suivant les placeholders.',
    },
    m5: {
      numberLabel: 'Ecran 5',
      title: 'Accepter les conditions',
      description: 'Lisez et acceptez les conditions et la politique de confidentialite.',
    },
    m6: {
      numberLabel: 'Ecran 6',
      title: 'Continuer vers business details',
      description: 'Cliquez pour passer de la creation owner a la creation business (etape 2).',
    },
    m7: {
      numberLabel: 'Ecran 7',
      title: 'Remplir le formulaire business',
      description: 'Saisissez les informations business, comme le nom et la localisation.',
    },
    m8: {
      numberLabel: 'Ecran 8',
      title: 'Choisir la categorie business',
      description: 'Selectionnez la categorie de votre secteur. Si absente, suivez le flux Other ci-dessous.',
    },
    o1: {
      numberLabel: 'Flux Other - Ecran 1',
      title: 'Selectionner Other (not listed)',
      description: 'Si votre categorie n existe pas, choisissez Other (not listed).',
    },
    o2: {
      numberLabel: 'Flux Other - Ecran 2',
      title: 'Nouvelle etape detectee',
      description: 'Apres Other, l interface indique qu une etape Request est ajoutee.',
    },
    o3: {
      numberLabel: 'Flux Other - Ecrans 3 et 4',
      title: 'Verifier le flux mis a jour',
      description: 'Le flux passe a 4 etapes avec Request apres Optional.',
    },
    o4: {
      numberLabel: 'Flux Other - Transition',
      title: 'Revenir a l etape 3 (Optional)',
      description: 'Terminez l etape Optional puis continuez vers Request.',
    },
    o5: {
      numberLabel: 'Flux Other - Ecrans 6 et 5',
      title: 'Remplir la demande de categorie',
      description: 'Ajoutez le vrai nom de votre secteur et une description pour demander une nouvelle categorie.',
    },
    o6: {
      numberLabel: 'Flux Other - Ecran 7',
      title: 'Soumettre owner + business + request',
      description: 'Validez la creation du compte, du business et l envoi de la demande.',
    },
    m9: {
      numberLabel: 'Ecran 9',
      title: 'Continuer vers la derniere etape 3',
      description: 'Continuez vers l etape Optional finale du flux principal.',
    },
    m10: {
      numberLabel: 'Ecran 10',
      title: 'Ajouter des infos business optionnelles',
      description: 'Completez les informations optionnelles avant la soumission finale.',
    },
    m11: {
      numberLabel: 'Ecran 11',
      title: 'Creer owner + business',
      description: 'Cliquez sur le bouton de creation pour envoyer l inscription.',
    },
    m12: {
      numberLabel: 'Ecran 12',
      title: 'Ecran de succes',
      description: 'Si tout est valide, un ecran de succes vous demande de verifier votre email.',
    },
    m13: {
      numberLabel: 'Ecran 13',
      title: 'Verifier le compte par email',
      description: 'Ouvrez votre email et cliquez sur le lien/bouton d activation.',
    },
  },
  ar: {
    m1: {
      numberLabel: 'الشاشة 1',
      title: 'اضغط على Sign Up',
      description: 'اذهب الى صفحة Kayedni الرئيسية وابدأ بالنقر على زر Sign Up.',
    },
    m2: {
      numberLabel: 'الشاشة 2',
      title: 'اختر نوع حساب Business',
      description: 'في نوع الحساب اختر Business للمتابعة في مسار owner + business.',
    },
    m3: {
      numberLabel: 'الشاشة 3',
      title: 'راجع خطوات التسجيل',
      description: 'سترى 3 خطوات التسجيل القياسية لحساب business.',
    },
    m4: {
      numberLabel: 'الشاشة 4',
      title: 'املأ نموذج owner',
      description: 'املأ بيانات الحساب الشخصي للمالك باتباع الامثلة داخل الحقول.',
    },
    m5: {
      numberLabel: 'الشاشة 5',
      title: 'وافق على الشروط والسياسات',
      description: 'اقرأ الشروط وسياسة الخصوصية ثم فعّل الموافقة قبل المتابعة.',
    },
    m6: {
      numberLabel: 'الشاشة 6',
      title: 'انتقل الى تفاصيل النشاط',
      description: 'اضغط زر المتابعة للانتقال من خطوة owner الى خطوة business (الخطوة 2).',
    },
    m7: {
      numberLabel: 'الشاشة 7',
      title: 'املأ نموذج النشاط',
      description: 'ادخل بيانات النشاط مثل الاسم والموقع.',
    },
    m8: {
      numberLabel: 'الشاشة 8',
      title: 'اختر فئة النشاط',
      description: 'اختر الفئة المناسبة لنشاطك. اذا لم تجدها، اتبع مسار Other بالاسفل.',
    },
    o1: {
      numberLabel: 'مسار Other - الشاشة 1',
      title: 'اختر Other (not listed)',
      description: 'اذا لم تكن فئة نشاطك موجودة، اختر Other (not listed).',
    },
    o2: {
      numberLabel: 'مسار Other - الشاشة 2',
      title: 'ظهور خطوة اضافية',
      description: 'بعد اختيار Other ستظهر رسالة تفيد باضافة خطوة Request جديدة.',
    },
    o3: {
      numberLabel: 'مسار Other - الشاشتان 3 و4',
      title: 'راجع مسار التسجيل بعد التحديث',
      description: 'المسار يصبح 4 خطوات مع خطوة Request بعد Optional.',
    },
    o4: {
      numberLabel: 'مسار Other - انتقال',
      title: 'ارجع لاكمال الخطوة 3 (Optional)',
      description: 'اكمل Optional اولا ثم انتقل الى Request.',
    },
    o5: {
      numberLabel: 'مسار Other - الشاشتان 6 و5',
      title: 'املأ طلب الفئة الجديدة',
      description: 'اكتب الاسم الحقيقي للمجال ووصفا يساعد الفريق على اضافة فئة مناسبة.',
    },
    o6: {
      numberLabel: 'مسار Other - الشاشة 7',
      title: 'ارسال owner + business + request',
      description: 'اضغط زر الارسال النهائي لانشاء الحساب والنشاط وارسال الطلب.',
    },
    m9: {
      numberLabel: 'الشاشة 9',
      title: 'تابع الى الخطوة 3 الاخيرة',
      description: 'تابع لاكمال الخطوة الاختيارية (Optional) في المسار الرئيسي.',
    },
    m10: {
      numberLabel: 'الشاشة 10',
      title: 'اضف معلومات نشاط اضافية',
      description: 'املأ البيانات الاختيارية الخاصة بالنشاط قبل الارسال النهائي.',
    },
    m11: {
      numberLabel: 'الشاشة 11',
      title: 'انشئ owner + business',
      description: 'اضغط زر الانشاء لارسال بيانات التسجيل.',
    },
    m12: {
      numberLabel: 'الشاشة 12',
      title: 'شاشة نجاح التسجيل',
      description: 'عند نجاح العملية ستظهر شاشة تؤكد انشاء الحساب وتطلب التحقق من البريد.',
    },
    m13: {
      numberLabel: 'الشاشة 13',
      title: 'تحقق من الحساب عبر البريد',
      description: 'افتح بريدك واضغط زر/رابط التفعيل لتفعيل الحساب.',
    },
  },
};

const GUIDE_COPY: Record<LocaleCode, GuideCopy> = {
  en: {
    pageTitle: 'Create Owner and Business Guide',
    pageSubtitle:
      'Step-by-step SOP for the full business registration flow, including the Other (not listed) category branch.',
    landingButtonLabel: 'Open Kayedni Landing Page',
    sidebarTitle: 'Help Guides',
    sidebarPlaceholderLabel: 'Coming soon',
    activeThemeLabel: 'Active category theme',
    activeThemeGeneric: 'Generic',
    searchLabel: 'Search guide steps',
    searchPlaceholder: 'Search by step, screen, or action (example: screen 8, request, category)',
    searchCountLabel: 'steps shown',
    imageReferenceLabel: 'Screen reference',
    noResultsTitle: 'No matching steps found',
    noResultsDescription: 'Try broader terms like signup, business, optional, request, or screen number.',
    aliasNotice: 'This guide is available at both /guide and /help.',
    sectionMainStartTitle: 'Main Flow - Steps 1 to 8',
    sectionMainStartDescription: 'Start from landing page, create owner account, and begin business details.',
    sectionOtherTitle: 'Other (Not Listed) Branch',
    sectionOtherDescription:
      'If category is missing, follow this branch and complete the added Request step.',
    sectionMainEndTitle: 'Main Flow - Steps 9 to 13',
    sectionMainEndDescription: 'Finish optional details, create account, and verify by email.',
    m8ContextualTitle: 'Didn\'t find your category?',
    m8ContextualMessage: 'You don\'t find your business industry category? Check out the guide from Screen 1 in the Other flow section below.',
    m8ContextualButtonLabel: 'Go to Other Flow',
    o4NavigationLabel: 'Return to Step 3 (Optional)',
    o5NavigationLabel: 'Back to Business Details',
    o6NavigationLabel: 'Go to Success Screen',
    sidebarItems: [
      {
        id: 'owner-business',
        title: 'Create Owner and Business',
        isActive: true,
        isPlaceholder: false,
      },
      {
        id: 'personal-signup',
        title: 'Create Personal Account',
        isActive: false,
        isPlaceholder: true,
      },
      {
        id: 'booking-guide',
        title: 'Booking Flow Guide',
        isActive: false,
        isPlaceholder: false,
      },
      {
        id: 'dashboard-guide',
        title: 'Dashboard Basics',
        isActive: false,
        isPlaceholder: true,
      },
    ],
  },
  fr: {
    pageTitle: 'Guide: Creer Owner et Business',
    pageSubtitle:
      'SOP pas a pas pour le flux complet d inscription business, y compris le cas Other (not listed).',
    landingButtonLabel: 'Ouvrir la page d accueil Kayedni',
    sidebarTitle: 'Guides d aide',
    sidebarPlaceholderLabel: 'Bientot disponible',
    activeThemeLabel: 'Theme de categorie actif',
    activeThemeGeneric: 'Generique',
    searchLabel: 'Rechercher dans les etapes du guide',
    searchPlaceholder: 'Rechercher par etape, ecran ou action (ex: ecran 8, request, categorie)',
    searchCountLabel: 'etapes affichees',
    imageReferenceLabel: 'Reference ecran',
    noResultsTitle: 'Aucune etape correspondante',
    noResultsDescription: 'Essayez des termes plus larges: signup, business, optional, request ou numero d ecran.',
    aliasNotice: 'Ce guide est disponible via /guide et /help.',
    sectionMainStartTitle: 'Flux principal - Etapes 1 a 8',
    sectionMainStartDescription: 'Commencez depuis la landing page, creez le compte owner, puis business details.',
    sectionOtherTitle: 'Branche Other (Not Listed)',
    sectionOtherDescription: 'Si la categorie est absente, suivez cette branche et completez l etape Request.',
    sectionMainEndTitle: 'Flux principal - Etapes 9 a 13',
    sectionMainEndDescription: 'Terminez les infos optionnelles, creez le compte et verifiez l email.',
    m8ContextualTitle: 'Vous n avez pas trouve votre categorie?',
    m8ContextualMessage: 'Vous ne trouvez pas la categorie de votre secteur d activite? Consultez le guide a partir de l Ecran 1 dans la section Flux Other ci-dessous.',
    m8ContextualButtonLabel: 'Aller au flux Other',
    o4NavigationLabel: 'Retour a l etape 3 (Optional)',
    o5NavigationLabel: 'Retour aux details business',
    o6NavigationLabel: 'Aller a l ecran de succes',
    sidebarItems: [
      {
        id: 'owner-business',
        title: 'Creer Owner et Business',
        isActive: true,
        isPlaceholder: false,
      },
      {
        id: 'personal-signup',
        title: 'Creer un compte personnel',
        isActive: false,
        isPlaceholder: true,
      },
      {
        id: 'booking-guide',
        title: 'Guide du flux de reservation',
        isActive: false,
        isPlaceholder: false,
      },
      {
        id: 'dashboard-guide',
        title: 'Bases du dashboard',
        isActive: false,
        isPlaceholder: true,
      },
    ],
  },
  ar: {
    pageTitle: 'دليل انشاء Owner و Business',
    pageSubtitle:
      'دليل SOP خطوة بخطوة لمسار تسجيل النشاط بالكامل، بما في ذلك حالة Other (not listed).',
    landingButtonLabel: 'افتح الصفحة الرئيسية Kayedni',
    sidebarTitle: 'ادلة المساعدة',
    sidebarPlaceholderLabel: 'قريبا',
    activeThemeLabel: 'ثيم الفئة النشط',
    activeThemeGeneric: 'عام',
    searchLabel: 'ابحث داخل خطوات الدليل',
    searchPlaceholder: 'ابحث بالخطوة او الشاشة او الاجراء (مثال: screen 8, request, category)',
    searchCountLabel: 'خطوات معروضة',
    imageReferenceLabel: 'مرجع الشاشة',
    noResultsTitle: 'لا توجد خطوات مطابقة',
    noResultsDescription: 'جرّب كلمات اوسع مثل signup او business او optional او request او رقم الشاشة.',
    aliasNotice: 'هذا الدليل متاح عبر /guide و /help.',
    sectionMainStartTitle: 'المسار الرئيسي - من 1 الى 8',
    sectionMainStartDescription: 'ابدأ من الصفحة الرئيسية، ثم انشئ owner وابدأ بيانات business.',
    sectionOtherTitle: 'مسار Other (Not Listed)',
    sectionOtherDescription: 'اذا لم تجد الفئة، اتبع هذا المسار واكمل خطوة Request المضافة.',
    sectionMainEndTitle: 'المسار الرئيسي - من 9 الى 13',
    sectionMainEndDescription: 'اكمل البيانات الاختيارية، انشئ الحساب، ثم فعّل عبر البريد.',
    m8ContextualTitle: 'لم تجد فئتك؟',
    m8ContextualMessage: 'لا تجد فئة نشاطك الصحيحة؟ راجع الدليل من الشاشة 1 في قسم مسار Other أدناه.',
    m8ContextualButtonLabel: 'انتقل الى مسار Other',
    o4NavigationLabel: 'العودة الى الخطوة 3 (Optional)',
    o5NavigationLabel: 'العودة الى تفاصيل business',
    o6NavigationLabel: 'اذهب الى شاشة النجاح',
    sidebarItems: [
      {
        id: 'owner-business',
        title: 'انشاء Owner و Business',
        isActive: true,
        isPlaceholder: false,
      },
      {
        id: 'personal-signup',
        title: 'انشاء حساب شخصي',
        isActive: false,
        isPlaceholder: true,
      },
      {
        id: 'booking-guide',
        title: 'دليل مسار الحجوزات',
        isActive: false,
        isPlaceholder: false,
      },
      {
        id: 'dashboard-guide',
        title: 'اساسيات لوحة التحكم',
        isActive: false,
        isPlaceholder: true,
      },
    ],
  },
};

export function getGuideCopy(locale: LocaleCode): GuideCopy {
  return GUIDE_COPY[locale] ?? GUIDE_COPY.en;
}

export function getGuideSteps(locale: LocaleCode): GuideStep[] {
  const localizedText = GUIDE_STEP_TEXT[locale] ?? GUIDE_STEP_TEXT.en;

  return GUIDE_STEP_META.map((stepMeta) => {
    const stepText = localizedText[stepMeta.id] ?? GUIDE_STEP_TEXT.en[stepMeta.id];

    return {
      id: stepMeta.id,
      segment: stepMeta.segment,
      order: stepMeta.order,
      numberLabel: stepText.numberLabel,
      title: stepText.title,
      description: stepText.description,
      imagePaths: stepMeta.imagePaths,
      searchTerms: stepMeta.searchTerms,
      hasContextualHelp: stepMeta.hasContextualHelp,
    };
  });
}
