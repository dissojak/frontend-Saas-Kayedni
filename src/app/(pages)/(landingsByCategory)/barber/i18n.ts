import type { LocaleCode } from '@global/lib/locales';

type ShowcaseItem = {
  title: string;
  description: string;
};

type FeatureItem = {
  title: string;
  description: string;
};

type ChecklistItem = {
  title: string;
  description: string;
};

type BarberLandingContent = {
  heroTitleTop: string;
  heroTitleBottom: string;
  watchDemo: string;
  trustedBy: string;
  statsRevenueIncrease: string;
  statsLessNoShows: string;
  statsAutomatedBooking: string;
  statsUnlimitedValue: string;
  statsStaffAndLocations: string;
  hoursBadge: string;
  builtTitleTop: string;
  builtTitleBottom: string;
  builtDescription: string;
  smartBookingTitle: string;
  smartBookingDescription: string;
  staffPayrollTitle: string;
  staffPayrollDescription: string;
  clientRetentionTitle: string;
  clientRetentionDescription: string;
  scaleTitle: string;
  scaleDescription: string;
  features: FeatureItem[];
  madeForOwnersAndStaff: string;
  controlTitle: string;
  checklist: ChecklistItem[];
  pocketTitle: string;
  showcase: ShowcaseItem[];
  craftTitleTop: string;
  craftTitleAccent: string;
  zeroSetupFees: string;
  startInFiveMinutes: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaButton: string;
};

const BARBER_CONTENT: Record<LocaleCode, BarberLandingContent> = {
  en: {
    heroTitleTop: 'RUN YOUR BARBERSHOP',
    heroTitleBottom: 'EFFORTLESSLY!',
    watchDemo: 'Watch Demo',
    trustedBy: 'Trusted by 50+ Barbershops',
    statsRevenueIncrease: 'Revenue Increase',
    statsLessNoShows: 'Less No-Shows',
    statsAutomatedBooking: 'Automated Booking',
    statsUnlimitedValue: 'Unlimited',
    statsStaffAndLocations: 'Staff & Locations',
    hoursBadge: '9AM - 9PM, Mon-Sat',
    builtTitleTop: 'Built Specifically',
    builtTitleBottom: 'For Barbershops',
    builtDescription:
      'Kayedni provides the ultimate software for your barbershop. Manage appointments seamlessly, process payments effortlessly, and keep your chairs full with automated marketing tools.',
    smartBookingTitle: 'Smart Booking',
    smartBookingDescription: 'Let clients book 24/7 online without interrupting your cuts.',
    staffPayrollTitle: 'Staff & Payroll',
    staffPayrollDescription: 'Calculate commissions automatically, manage tips, and organize shift schedules.',
    clientRetentionTitle: 'Client Retention',
    clientRetentionDescription: 'Automated SMS reminders and campaigns that bring clients back.',
    scaleTitle: 'Everything You Need To Scale Your Business',
    scaleDescription:
      'Replace 5 different tools with one seamless barbershop operating system. From chair rentals to commission splits, we handle the heavy lifting.',
    features: [
      {
        title: 'Client Retention & Marketing',
        description:
          'Automated SMS reminders and Telegram campaigns to fill slow days and bring back lost clients.',
      },
      {
        title: 'Business Analytics',
        description:
          'Track highest-earning days, most requested barbers, and revenue growth from one dashboard.',
      },
      {
        title: 'Team Management',
        description:
          'Handle payroll logic, tiered commissions, tips tracking, and staff schedules in one place.',
      },
      {
        title: 'Smart Waitlist',
        description:
          'Fill last-minute cancellations automatically and keep chairs occupied all day.',
      },
    ],
    madeForOwnersAndStaff: 'Made for Owners & Staff',
    controlTitle: 'Total Control Over Your Shop',
    checklist: [
      {
        title: 'Online Brand Presence',
        description:
          'Stand out with a branded booking page that showcases your portfolio and services.',
      },
      {
        title: 'Flexible Commissions',
        description: 'Automate logic for booth renters or commissioned staff effortlessly.',
      },
      {
        title: 'Instant Sync',
        description: 'Sync your calendar instantly across platforms and eliminate double bookings.',
      },
    ],
    pocketTitle: 'Run Your Shop From Your Pocket',
    showcase: [
      {
        title: 'Live Schedule',
        description: 'Check your daily bookings at a glance between cuts.',
      },
      {
        title: 'Instant Updates',
        description: 'Get notified instantly when a client books or cancels.',
      },
      {
        title: 'Earnings Tracking',
        description: 'Review your daily, weekly, and monthly revenue on the go.',
      },
    ],
    craftTitleTop: 'Your Craft.',
    craftTitleAccent: 'Our System.',
    zeroSetupFees: 'Zero Setup Fees',
    startInFiveMinutes: 'Start in 5 Mins',
    ctaTitle: 'Upgrade Your Shop Today',
    ctaDescription:
      'Join the next generation of barbershop owners taking back their time and increasing margins. Set up your workspace in minutes.',
    ctaButton: 'Create Your Free Account',
  },
  fr: {
    heroTitleTop: 'FAITES TOURNER VOTRE BARBERSHOP',
    heroTitleBottom: 'SANS EFFORT !',
    watchDemo: 'Voir la demo',
    trustedBy: 'Adopte par plus de 50 barbershops',
    statsRevenueIncrease: 'Hausse du chiffre d affaires',
    statsLessNoShows: 'Moins de no-shows',
    statsAutomatedBooking: 'Reservation automatisee',
    statsUnlimitedValue: 'Illimite',
    statsStaffAndLocations: 'Equipe & emplacements',
    hoursBadge: '9h - 21h, Lun-Sam',
    builtTitleTop: 'Concu specialement',
    builtTitleBottom: 'Pour les barbershops',
    builtDescription:
      'Kayedni fournit le logiciel ideal pour votre barbershop. Gerez les rendez-vous, les paiements et le remplissage de vos fauteuils avec des outils marketing automatises.',
    smartBookingTitle: 'Reservation intelligente',
    smartBookingDescription: 'Laissez vos clients reserver en ligne 24h/24 sans interrompre votre travail.',
    staffPayrollTitle: 'Equipe & paie',
    staffPayrollDescription: 'Calculez les commissions, gerez les pourboires et organisez les plannings.',
    clientRetentionTitle: 'Fidelisation client',
    clientRetentionDescription: 'Rappels SMS et campagnes automatiques pour faire revenir les clients.',
    scaleTitle: 'Tout ce qu il faut pour faire grandir votre business',
    scaleDescription:
      'Remplacez 5 outils differents par un seul systeme. De la location de chaise aux commissions, tout est centralise.',
    features: [
      {
        title: 'Fidelisation & marketing',
        description:
          'Rappels SMS et campagnes Telegram pour remplir les jours creux et relancer les clients.',
      },
      {
        title: 'Analyses business',
        description:
          'Suivez vos meilleurs jours, les barbiers les plus demandes et la croissance du revenu.',
      },
      {
        title: 'Gestion d equipe',
        description:
          'Gerez paie, commissions, pourboires et planning du staff depuis un seul espace.',
      },
      {
        title: 'Liste d attente intelligente',
        description: 'Comblez automatiquement les annulations de derniere minute.',
      },
    ],
    madeForOwnersAndStaff: 'Concu pour les proprietaires et le staff',
    controlTitle: 'Controle total sur votre salon',
    checklist: [
      {
        title: 'Presence en ligne',
        description: 'Mettez en avant votre image avec une page de reservation a votre marque.',
      },
      {
        title: 'Commissions flexibles',
        description: 'Automatisez facilement les regles de commission selon votre modele.',
      },
      {
        title: 'Synchronisation instantanee',
        description: 'Synchronisez votre agenda partout et evitez les doubles reservations.',
      },
    ],
    pocketTitle: 'Pilotez votre salon depuis votre poche',
    showcase: [
      {
        title: 'Planning en direct',
        description: 'Consultez vos reservations du jour entre deux coupes.',
      },
      {
        title: 'Mises a jour instantanees',
        description: 'Recevez une alerte immediate a chaque reservation ou annulation.',
      },
      {
        title: 'Suivi des revenus',
        description: 'Suivez vos revenus quotidiens, hebdomadaires et mensuels en mobilite.',
      },
    ],
    craftTitleTop: 'Votre savoir-faire.',
    craftTitleAccent: 'Notre systeme.',
    zeroSetupFees: 'Aucun frais d installation',
    startInFiveMinutes: 'Pret en 5 min',
    ctaTitle: 'Faites evoluer votre salon des aujourd hui',
    ctaDescription:
      'Rejoignez la nouvelle generation de proprietaires qui gagnent du temps et augmentent leurs marges.',
    ctaButton: 'Creer un compte gratuit',
  },
  ar: {
    heroTitleTop: 'شغّل محل الحلاقة',
    heroTitleBottom: 'بكل سهولة!',
    watchDemo: 'شاهد العرض',
    trustedBy: 'موثوق من +50 محل حلاقة',
    statsRevenueIncrease: 'زيادة الايرادات',
    statsLessNoShows: 'تقليل عدم الحضور',
    statsAutomatedBooking: 'حجز تلقائي',
    statsUnlimitedValue: 'غير محدود',
    statsStaffAndLocations: 'الموظفون والفروع',
    hoursBadge: '9 صباحا - 9 مساء، الاثنين-السبت',
    builtTitleTop: 'مصمم خصيصا',
    builtTitleBottom: 'لمحلات الحلاقة',
    builtDescription:
      'Kayedni يوفر برنامج متكامل لمحل الحلاقة: ادارة المواعيد، معالجة الدفع، وملء الكراسي عبر ادوات تسويق تلقائية.',
    smartBookingTitle: 'حجز ذكي',
    smartBookingDescription: 'دع العملاء يحجزون 24/7 اونلاين بدون مقاطعة عملك.',
    staffPayrollTitle: 'الموظفون والرواتب',
    staffPayrollDescription: 'احسب العمولات تلقائيا ونظم البقشيش وجداول الدوام.',
    clientRetentionTitle: 'الحفاظ على العملاء',
    clientRetentionDescription: 'رسائل تذكير وحملات تسويقية تلقائية لاعادة العملاء.',
    scaleTitle: 'كل ما تحتاجه لتوسيع نشاطك',
    scaleDescription:
      'استبدل 5 ادوات مختلفة بنظام واحد متكامل. من كراء الكراسي الى تقسيم العمولات، كل شيء في مكان واحد.',
    features: [
      {
        title: 'الاحتفاظ بالعملاء والتسويق',
        description: 'حملات SMS وTelegram تلقائية لملء الاوقات الهادئة واسترجاع العملاء.',
      },
      {
        title: 'تحليلات النشاط',
        description: 'تابع افضل الايام، اكثر الحلاقين طلبا، ونمو الايرادات من لوحة واحدة.',
      },
      {
        title: 'ادارة الفريق',
        description: 'ادارة الرواتب والعمولات والبقشيش وجداول الموظفين من مكان واحد.',
      },
      {
        title: 'قائمة انتظار ذكية',
        description: 'املأ مواعيد الالغاءات اللحظية تلقائيا وحافظ على امتلاء الكراسي.',
      },
    ],
    madeForOwnersAndStaff: 'مصمم للمالكين والموظفين',
    controlTitle: 'تحكم كامل في محلك',
    checklist: [
      {
        title: 'حضور قوي اونلاين',
        description: 'تميز بصفحة حجز تحمل هويتك وتعرض خدماتك واعمالك.',
      },
      {
        title: 'عمولات مرنة',
        description: 'أتمتة منطق العمولات سواء للكراء او للموظفين بسهولة.',
      },
      {
        title: 'مزامنة فورية',
        description: 'مزامنة فورية للتقويم عبر كل المنصات ومنع الحجز المكرر.',
      },
    ],
    pocketTitle: 'ادِر محلك من هاتفك',
    showcase: [
      {
        title: 'جدول مباشر',
        description: 'اطلع على مواعيد اليوم بسرعة بين كل قصة وقصة.',
      },
      {
        title: 'تحديثات فورية',
        description: 'استقبل تنبيه فوري عند كل حجز او الغاء.',
      },
      {
        title: 'تتبع الارباح',
        description: 'راجع ايراداتك اليومية والاسبوعية والشهرية من اي مكان.',
      },
    ],
    craftTitleTop: 'حرفتك.',
    craftTitleAccent: 'نظامنا.',
    zeroSetupFees: 'بدون رسوم اعداد',
    startInFiveMinutes: 'ابدأ في 5 دقائق',
    ctaTitle: 'طوّر محلك اليوم',
    ctaDescription:
      'انضم الى الجيل الجديد من اصحاب محلات الحلاقة الذين يسترجعون وقتهم ويرفعون هامش الربح.',
    ctaButton: 'انشئ حسابك المجاني',
  },
};

export function getBarberLandingContent(locale: LocaleCode): BarberLandingContent {
  return BARBER_CONTENT[locale] ?? BARBER_CONTENT.en;
}
