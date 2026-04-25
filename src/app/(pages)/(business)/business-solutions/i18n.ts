import type { LocaleCode } from '@global/lib/locales';

interface ProblemItem {
  problem: string;
  solution: string;
}

interface FeatureItem {
  icon: string;
  title: string;
  desc: string;
}

interface RoiItem {
  metric: string;
  benefit: string;
  desc: string;
}

interface PlanItem {
  name: string;
  price: string;
  period: string;
  desc: string;
  highlight: boolean;
  features: string[];
}

interface StoryItem {
  name: string;
  business: string;
  story: string;
  metric: string;
}

interface FaqItem {
  q: string;
  a: string;
}

export interface BusinessSolutionsCopy {
  badge: string;
  heroTitle: string;
  heroDescription: string;
  startTrial: string;
  viewPricing: string;
  stats: {
    revenue: string;
    businesses: string;
    rating: string;
  };
  sectionProblemsTitle: string;
  sectionProblemsSubtitle: string;
  problems: ProblemItem[];
  sectionFeaturesTitle: string;
  sectionFeaturesSubtitle: string;
  features: FeatureItem[];
  sectionRoiTitle: string;
  sectionRoiSubtitle: string;
  roi: RoiItem[];
  sectionPricingTitle: string;
  sectionPricingSubtitle: string;
  plans: PlanItem[];
  mostPopular: string;
  getStarted: string;
  allPlansInclude: string;
  includedItems: string[];
  sectionStoriesTitle: string;
  sectionStoriesSubtitle: string;
  stories: StoryItem[];
  sectionFaqTitle: string;
  sectionFaqSubtitle: string;
  faq: FaqItem[];
  finalTitle: string;
  finalDescription: string;
  talkToSales: string;
  noCardNote: string;
}

const COPY: Record<LocaleCode, BusinessSolutionsCopy> = {
  en: {
    badge: 'Business Booking Platform',
    heroTitle: 'Grow Your Company with Smarter Booking',
    heroDescription:
      'Reduce manual work, fill more slots, and deliver a premium customer experience from day one.',
    startTrial: 'Start Free Trial',
    viewPricing: 'View Pricing',
    stats: {
      revenue: 'Avg Revenue Growth',
      businesses: 'Active Companies',
      rating: 'Customer Rating',
    },
    sectionProblemsTitle: 'The Daily Challenges We Fix',
    sectionProblemsSubtitle: 'Kayedni helps service companies run smoother and grow faster.',
    problems: [
      { problem: 'Missed calls and no-shows', solution: 'Automated reminders reduce no-shows by up to 40%.' },
      { problem: 'Manual scheduling overload', solution: 'Real-time calendar sync keeps your team aligned.' },
      { problem: 'Unfilled time slots', solution: 'Smart availability helps maximize every working hour.' },
      { problem: 'Inconsistent customer journey', solution: 'Instant confirmations and simple rescheduling build trust.' },
      { problem: 'Limited business visibility', solution: 'Live dashboards show bookings, demand, and performance.' },
      { problem: 'Complex payment follow-up', solution: 'Clear booking workflow reduces payment confusion.' },
    ],
    sectionFeaturesTitle: 'Built for Service Companies',
    sectionFeaturesSubtitle: 'Everything your team needs to run operations efficiently.',
    features: [
      { icon: '📅', title: 'Smart Scheduling', desc: 'Live availability, buffer times, staff assignment, and timezone-ready booking.' },
      { icon: '💰', title: 'Revenue Tools', desc: 'Flexible pricing, bundles, and capacity optimization to increase sales.' },
      { icon: '📊', title: 'Actionable Analytics', desc: 'Track revenue, utilization, no-shows, and top-performing services.' },
      { icon: '📱', title: 'Multi-Channel Presence', desc: 'Capture bookings from web, mobile, and shared links in one place.' },
      { icon: '🔔', title: 'Smart Notifications', desc: 'Automatic confirmations, reminders, and updates for teams and clients.' },
      { icon: '🔗', title: 'Integrations', desc: 'Connect calendars and tools your company already uses.' },
    ],
    sectionRoiTitle: 'ROI You Can Measure',
    sectionRoiSubtitle: 'Most companies see meaningful impact within the first month.',
    roi: [
      { metric: '+34%', benefit: 'Average Revenue Increase', desc: 'More confirmed bookings and better capacity use.' },
      { metric: '89%', benefit: 'Admin Time Saved', desc: 'Automation replaces repetitive scheduling tasks.' },
      { metric: '-40%', benefit: 'No-Show Reduction', desc: 'Timely reminders improve attendance rates.' },
      { metric: '4.9★', benefit: 'Client Satisfaction', desc: 'A smoother booking flow improves customer confidence.' },
    ],
    sectionPricingTitle: 'Simple Pricing, Clear Value',
    sectionPricingSubtitle: 'Choose the plan that fits your company stage.',
    plans: [
      {
        name: 'Starter',
        price: '29DT',
        period: '/month',
        desc: 'Great for solo founders and small teams.',
        highlight: false,
        features: ['Up to 100 bookings/month', 'Core scheduling tools', 'Email reminders', 'Mobile access', 'Support included'],
      },
      {
        name: 'Professional',
        price: '79DT',
        period: '/month',
        desc: 'Best for growing companies.',
        highlight: true,
        features: ['Unlimited bookings', 'Staff management (up to 5)', 'SMS and email reminders', 'Analytics dashboard', 'Integrations', 'Custom branding', 'Priority support', 'API access'],
      },
      {
        name: 'Major Companies',
        price: 'Custom',
        period: 'pricing',
        desc: 'For large operations and multi-branch teams.',
        highlight: false,
        features: ['Unlimited operations', 'Unlimited staff', 'White-label experience', 'Dedicated success manager', 'Custom integrations', 'SLA support', 'Advanced reporting'],
      },
    ],
    mostPopular: 'Most Popular',
    getStarted: 'Get Started',
    allPlansInclude: 'All plans include:',
    includedItems: ['Support team access', 'Secure infrastructure', 'Automatic backups', 'Mobile access', 'Core analytics', 'Reminder notifications'],
    sectionStoriesTitle: 'Trusted by Growing Companies',
    sectionStoriesSubtitle: 'Real teams, real outcomes.',
    stories: [
      {
        name: "Sarah's Beauty Studio",
        business: 'Beauty Services',
        story: 'We doubled monthly bookings and dramatically cut no-shows thanks to automated reminders.',
        metric: '+92% Revenue',
      },
      {
        name: 'Dr. James Consulting',
        business: 'Professional Services',
        story: 'Kayedni gave us back hours every week by automating appointment operations end to end.',
        metric: '+40% Capacity',
      },
      {
        name: 'Zen Fitness Studio',
        business: 'Fitness & Wellness',
        story: 'Our members love the booking flow and our team now operates with far less pressure.',
        metric: '+3 New Staff',
      },
    ],
    sectionFaqTitle: 'Frequently Asked Questions',
    sectionFaqSubtitle: 'Answers for company owners and managers.',
    faq: [
      { q: 'How long does setup take?', a: 'Most companies get started in under 15 minutes, with guidance included.' },
      { q: 'Can I integrate this with my website?', a: 'Yes. You can embed booking on your site or use branded booking links.' },
      { q: 'Can I request features?', a: 'Absolutely. Product updates are strongly shaped by customer feedback.' },
      { q: 'Is there a long-term contract?', a: 'No. Plans are flexible and can be adjusted as your company grows.' },
      { q: 'Can you help migrate existing bookings?', a: 'Yes. We support migration so your team can move without disruption.' },
      { q: 'How secure is the platform?', a: 'Kayedni follows modern security best practices to protect company and client data.' },
    ],
    finalTitle: 'Ready to Scale Your Company?',
    finalDescription: 'Join companies using Kayedni to streamline operations and increase revenue.',
    talkToSales: 'Talk to Sales',
    noCardNote: 'No credit card required. Setup takes only a few minutes.',
  },
  fr: {
    badge: 'Plateforme de reservation pour businesses',
    heroTitle: 'Developpez votre societe avec une reservation plus intelligente',
    heroDescription:
      'Reduisez les taches manuelles, remplissez plus de creneaux et offrez une meilleure experience client.',
    startTrial: 'Essai gratuit',
    viewPricing: 'Tarifs',
    stats: {
      revenue: 'Croissance moyenne du revenu',
      businesses: 'Businesses actifs',
      rating: 'Note client',
    },
    sectionProblemsTitle: 'Les defis quotidiens que nous resolvons',
    sectionProblemsSubtitle: 'Kayedni aide les businesses de services a mieux s\'organiser et a croitre plus vite.',
    problems: [
      { problem: 'Appels manques et absences', solution: 'Les rappels automatiques peuvent reduire les absences jusqu\'a 40%.' },
      { problem: 'Planning manuel surcharge', solution: 'La synchronisation en temps reel aligne toute l\'equipe.' },
      { problem: 'Creneaux non remplis', solution: 'La disponibilite intelligente maximise vos heures de travail.' },
      { problem: 'Parcours client inconstant', solution: 'Confirmations immediates et reprogrammation simple renforcent la confiance.' },
      { problem: 'Manque de visibilite business', solution: 'Des tableaux de bord en direct suivent activite et performance.' },
      { problem: 'Suivi de paiement complexe', solution: 'Un parcours de reservation clair limite les frictions.' },
    ],
    sectionFeaturesTitle: 'Concu pour les businesses de services',
    sectionFeaturesSubtitle: 'Tout ce qu\'il faut pour piloter vos operations efficacement.',
    features: [
      { icon: '📅', title: 'Planification intelligente', desc: 'Disponibilite en direct, temps tampon, affectation equipe et gestion des fuseaux.' },
      { icon: '💰', title: 'Outils de revenu', desc: 'Tarification flexible, offres groupees et optimisation de capacite.' },
      { icon: '📊', title: 'Analyses actionnables', desc: 'Suivez revenu, occupation, absences et services les plus performants.' },
      { icon: '📱', title: 'Presence multi-canale', desc: 'Recevez les reservations depuis web, mobile et liens partages.' },
      { icon: '🔔', title: 'Notifications intelligentes', desc: 'Confirmations et rappels automatiques pour clients et equipe.' },
      { icon: '🔗', title: 'Integrations', desc: 'Connectez les outils que votre business utilise deja.' },
    ],
    sectionRoiTitle: 'Un ROI mesurable',
    sectionRoiSubtitle: 'La plupart des businesses observent des resultats des le premier mois.',
    roi: [
      { metric: '+34%', benefit: 'Hausse moyenne du revenu', desc: 'Plus de reservations confirmees et meilleure utilisation des creneaux.' },
      { metric: '89%', benefit: 'Temps administratif economise', desc: 'L\'automatisation remplace les taches repetitives.' },
      { metric: '-40%', benefit: 'Reduction des absences', desc: 'Les rappels au bon moment ameliorent la presence.' },
      { metric: '4.9★', benefit: 'Satisfaction client', desc: 'Un parcours de reservation fluide inspire confiance.' },
    ],
    sectionPricingTitle: 'Tarifs simples, valeur claire',
    sectionPricingSubtitle: 'Choisissez la formule adaptee a votre business.',
    plans: [
      {
        name: 'Starter',
        price: '29DT',
        period: '/mois',
        desc: 'Ideal pour independants et petites equipes.',
        highlight: false,
        features: ['Jusqu\'a 100 reservations/mois', 'Planification essentielle', 'Rappels email', 'Acces mobile', 'Support inclus'],
      },
      {
        name: 'Professional',
        price: '79DT',
        period: '/mois',
        desc: 'Le meilleur choix pour les businesses en croissance.',
        highlight: true,
        features: ['Reservations illimitees', 'Gestion equipe (jusqu\'a 5)', 'Rappels SMS et email', 'Tableau analytique', 'Integrations', 'Marque personnalisee', 'Support prioritaire', 'Acces API'],
      },
      {
        name: 'Enterprise',
        price: 'Sur mesure',
        period: 'tarification',
        desc: 'Pour operations larges et equipes multi-sites.',
        highlight: false,
        features: ['Operations illimitees', 'Equipe illimitee', 'Experience en marque blanche', 'Success manager dedie', 'Integrations sur mesure', 'Support SLA', 'Reporting avance'],
      },
    ],
    mostPopular: 'Populaire',
    getStarted: 'Commencer',
    allPlansInclude: 'Toutes les formules incluent :',
    includedItems: ['Acces a l\'equipe support', 'Infrastructure securisee', 'Sauvegardes automatiques', 'Acces mobile', 'Analyses essentielles', 'Notifications de rappel'],
    sectionStoriesTitle: 'Adopte par des businesses en croissance',
    sectionStoriesSubtitle: 'Des equipes reelles, des resultats concrets.',
    stories: [
      {
        name: 'Sarah Beauty Studio',
        business: 'Services beaute',
        story: 'Nous avons double nos reservations mensuelles et fortement reduit les absences grace aux rappels automatiques.',
        metric: '+92% Revenu',
      },
      {
        name: 'Dr. James Consulting',
        business: 'Services professionnels',
        story: 'Kayedni nous fait gagner plusieurs heures chaque semaine en automatisant toute la gestion des rendez-vous.',
        metric: '+40% Capacite',
      },
      {
        name: 'Zen Fitness Studio',
        business: 'Fitness et bien-etre',
        story: 'Nos clients adorent la reservation et notre equipe travaille avec beaucoup moins de pression.',
        metric: '+3 Recrutements',
      },
    ],
    sectionFaqTitle: 'Questions frequentes',
    sectionFaqSubtitle: 'Reponses pour dirigeants et responsables de businesses.',
    faq: [
      { q: 'Combien de temps prend la mise en place ?', a: 'La plupart des businesses demarrent en moins de 15 minutes, avec accompagnement.' },
      { q: 'Puis-je l\'integrer a mon site web ?', a: 'Oui. Vous pouvez integrer la reservation sur votre site ou partager des liens de reservation marques.' },
      { q: 'Puis-je demander de nouvelles fonctionnalites ?', a: 'Oui. Notre feuille de route evolue fortement grace aux retours clients.' },
      { q: 'Y a-t-il un engagement long terme ?', a: 'Non. Les formules restent flexibles et evoluent avec votre business.' },
      { q: 'Pouvez-vous migrer nos reservations existantes ?', a: 'Oui. Nous accompagnons la migration pour eviter toute interruption.' },
      { q: 'La plateforme est-elle securisee ?', a: 'Kayedni applique des standards modernes de securite pour proteger les donnees.' },
    ],
    finalTitle: 'Pret a faire grandir votre business ?',
    finalDescription: 'Rejoignez les businesses qui utilisent Kayedni pour optimiser les operations et augmenter les revenus.',
    talkToSales: 'Parler a l\'equipe commerciale',
    noCardNote: 'Sans carte bancaire. La mise en place prend quelques minutes.',
  },
  ar: {
    badge: 'منصة حجز للشركات',
    heroTitle: 'طوّر شركتك بحجوزات أذكى',
    heroDescription:
      'قلل الجهد اليدوي، املأ مواعيد اكثر، وقدم تجربة عميل احترافية من اول يوم.',
    startTrial: 'ابدأ التجربة المجانية',
    viewPricing: 'الاسعار',
    stats: {
      revenue: 'متوسط نمو الايرادات',
      businesses: 'شركة نشطة',
      rating: 'تقييم العملاء',
    },
    sectionProblemsTitle: 'تحديات يومية نساعدك على حلها',
    sectionProblemsSubtitle: 'قيدني يدعم الشركات الخدمية لتعمل بكفاءة اكبر وتنمو بشكل اسرع.',
    problems: [
      { problem: 'مكالمات فائتة وحالات عدم حضور', solution: 'التذكيرات التلقائية تساعد على خفض عدم الحضور حتى 40%.' },
      { problem: 'ضغط الجدولة اليدوية', solution: 'مزامنة التقويم الفورية تبقي فريق الشركة على نفس الخطة.' },
      { problem: 'مواعيد غير مستغلة', solution: 'توزيع المواعيد الذكي يساعدك على استثمار كل ساعة عمل.' },
      { problem: 'تجربة عميل غير متسقة', solution: 'تأكيد فوري واعادة جدولة سهلة تعززان ثقة العملاء.' },
      { problem: 'ضعف رؤية الاداء', solution: 'لوحات متابعة مباشرة توضح الحجوزات والطلب واداء الخدمات.' },
      { problem: 'تعقيد متابعة المدفوعات', solution: 'تدفق حجز واضح يقلل الالتباس ويرفع الكفاءة.' },
    ],
    sectionFeaturesTitle: 'مصمم خصيصا للشركات الخدمية',
    sectionFeaturesSubtitle: 'كل ما تحتاجه الشركة لتشغيل العمليات اليومية بسهولة.',
    features: [
      { icon: '📅', title: 'جدولة ذكية', desc: 'توفر مباشر، فواصل زمنية، توزيع على الفريق، ودعم فروق التوقيت.' },
      { icon: '💰', title: 'ادوات نمو الايرادات', desc: 'تسعير مرن، باقات خدمات، وتحسين استغلال الطاقة التشغيلية.' },
      { icon: '📊', title: 'تحليلات عملية', desc: 'تابع الايرادات، نسب الاشغال، حالات عدم الحضور، والخدمات الاكثر طلبا.' },
      { icon: '📱', title: 'حضور عبر قنوات متعددة', desc: 'استقبل الحجوزات من الويب والموبايل والروابط المباشرة في مكان واحد.' },
      { icon: '🔔', title: 'تنبيهات ذكية', desc: 'رسائل تأكيد وتذكير وتحديثات تلقائية للعملاء وفريق الشركة.' },
      { icon: '🔗', title: 'تكاملات', desc: 'اربط قيدني بالادوات التي تستخدمها شركتك يوميا.' },
    ],
    sectionRoiTitle: 'عائد واضح وقابل للقياس',
    sectionRoiSubtitle: 'معظم الشركات ترى نتائج ملموسة خلال الشهر الاول.',
    roi: [
      { metric: '+34%', benefit: 'زيادة متوسطة في الايرادات', desc: 'حجوزات مؤكدة اكثر واستغلال افضل للمواعيد.' },
      { metric: '89%', benefit: 'توفير في وقت الادارة', desc: 'الاجراءات المتكررة تتم تلقائيا بدل العمل اليدوي.' },
      { metric: '-40%', benefit: 'خفض عدم الحضور', desc: 'التذكيرات في الوقت المناسب ترفع الالتزام بالمواعيد.' },
      { metric: '4.9★', benefit: 'رضا العملاء', desc: 'رحلة حجز سلسة تمنح العميل ثقة اكبر في الشركة.' },
    ],
    sectionPricingTitle: 'اسعار واضحة وقيمة حقيقية',
    sectionPricingSubtitle: 'اختر الباقة المناسبة لمرحلة نمو شركتك.',
    plans: [
      {
        name: 'Starter',
        price: '29DT',
        period: '/شهريا',
        desc: 'مناسبة للمشاريع الصغيرة وفرق العمل المحدودة.',
        highlight: false,
        features: ['حتى 100 حجز شهريا', 'جدولة اساسية', 'تذكيرات عبر البريد', 'دعم الموبايل', 'دعم فني متاح'],
      },
      {
        name: 'احترافي',
        price: '79DT',
        period: '/شهريا',
        desc: 'الخيار الافضل للشركات التي تنمو بسرعة.',
        highlight: true,
        features: ['حجوزات غير محدودة', 'ادارة فريق (حتى 5)', 'تذكيرات SMS وبريد', 'لوحة تحليلات', 'تكاملات', 'هوية بصرية مخصصة', 'دعم اولوية', 'وصول API'],
      },
      {
        name: 'Enterprise',
        price: 'حسب الطلب',
        period: 'تسعير مخصص',
        desc: 'للعمليات الكبيرة والشركات متعددة الفروع.',
        highlight: false,
        features: ['عمليات غير محدودة', 'فريق غير محدود', 'حل بعلامتك التجارية', 'مدير نجاح مخصص', 'تكاملات خاصة', 'دعم SLA', 'تقارير متقدمة'],
      },
    ],
    mostPopular: 'الاكثر طلبا',
    getStarted: 'ابدأ الان',
    allPlansInclude: 'كل الباقات تشمل:',
    includedItems: ['الوصول لفريق الدعم', 'بنية امنية موثوقة', 'نسخ احتياطي تلقائي', 'وصول عبر الموبايل', 'تحليلات اساسية', 'تنبيهات تذكير'],
    sectionStoriesTitle: 'موثوق من شركات تنمو فعليا',
    sectionStoriesSubtitle: 'تعليقات حقيقية ونتائج يمكن قياسها.',
    stories: [
      {
        name: 'Sarah Beauty Studio',
        business: 'خدمات التجميل',
        story: 'ضاعفنا الحجوزات الشهرية وخفّضنا الغيابات بشكل واضح بفضل التذكيرات التلقائية.',
        metric: '+92% ايرادات',
      },
      {
        name: 'Dr. James Consulting',
        business: 'خدمات احترافية',
        story: 'قيدني وفر علينا ساعات عمل كل اسبوع بعد اتمتة ادارة المواعيد بالكامل.',
        metric: '+40% سعة تشغيلية',
      },
      {
        name: 'Zen Fitness Studio',
        business: 'اللياقة والعافية',
        story: 'العملاء يحبون تجربة الحجز، وفريق الشركة يعمل براحة وتنظيم افضل.',
        metric: '+3 موظفين جدد',
      },
    ],
    sectionFaqTitle: 'اسئلة شائعة',
    sectionFaqSubtitle: 'اجابات سريعة لاصحاب الشركات والمديرين.',
    faq: [
      { q: 'كم يستغرق اعداد المنصة؟', a: 'معظم الشركات تبدأ خلال اقل من 15 دقيقة مع ارشاد واضح.' },
      { q: 'هل يمكن ربطها بموقع شركتي؟', a: 'نعم. يمكنك اضافة الحجز داخل موقعك او استخدام روابط حجز باسم شركتك.' },
      { q: 'هل يمكنني طلب ميزات جديدة؟', a: 'بالتأكيد. خارطة المنتج تتطور باستمرار بناء على ملاحظات العملاء.' },
      { q: 'هل يوجد عقد طويل المدى؟', a: 'لا. الباقات مرنة ويمكن تعديلها حسب نمو شركتك.' },
      { q: 'هل تساعدون في نقل الحجوزات الحالية؟', a: 'نعم. نساعد في نقل البيانات لتنتقل شركتك بدون تعطيل.' },
      { q: 'ما مستوى الامان في المنصة؟', a: 'قيدني يطبق معايير امن حديثة لحماية بيانات الشركة والعملاء.' },
    ],
    finalTitle: 'جاهز لتوسيع شركتك؟',
    finalDescription: 'انضم الى الشركات التي تستخدم قيدني لتحسين التشغيل ورفع الايرادات.',
    talkToSales: 'تواصل مع المبيعات',
    noCardNote: 'بدون بطاقة بنكية. اعداد المنصة يتم خلال دقائق.',
  },
};

export function getBusinessSolutionsCopy(locale: LocaleCode): BusinessSolutionsCopy {
  return COPY[locale] ?? COPY.en;
}