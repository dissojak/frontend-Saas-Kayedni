import type { LocaleCode } from '@global/lib/locales';

export type FaqTab = 'client' | 'business';

export interface FaqItem {
    q: string;
    a: string;
}

export interface FaqCopy {
    pageTitle: string;
    pageSubtitle: string;
    tabClient: string;
    tabBusiness: string;
    clientCardTitle: string;
    clientCardDescription: string;
    clientCardCta: string;
    businessCardTitle: string;
    businessCardDescription: string;
    paymentFlowLabel: string;
    paymentFlowText: string;
    offerOneTitle: string;
    offerOneDescription: string;
    offerOneNote: string;
    offerTwoTitle: string;
    offerTwoDescription: string;
    offerTwoNote: string;
    offerSummary: string;
    businessCardCta: string;
    supportPrefix: string;
    supportLink: string;
}

const FAQ_COPY: Record<LocaleCode, FaqCopy> = {
    en: {
        pageTitle: 'Frequently Asked Questions',
        pageSubtitle:
            "Everything you need to know about using Kayedni, whether you're booking a service or growing your business.",
        tabClient: 'For Clients',
        tabBusiness: 'For Businesses',
        clientCardTitle: '100% Free for Clients',
        clientCardDescription:
            "We believe finding the right service shouldn't cost you a dime. Enjoy unlimited access to our platform, compare professionals, and book instantly without any booking fees.",
        clientCardCta: 'Start Booking Now',
        businessCardTitle: 'Powerful Tools to Grow Your Business',
        businessCardDescription:
            'Unlock premium features designed to streamline your operations and boost revenue.',
        paymentFlowLabel: 'Payment flow:',
        paymentFlowText:
            'Clients currently pay businesses directly outside Kayedni. Subscription payment support for businesses will be added later. Kayedni does not hold client funds.',
        offerOneTitle: '14-Day Free Trial',
        offerOneDescription: 'Test drive all premium features with zero commitment.',
        offerOneNote: 'Mutually exclusive: choosing this trial excludes the 50% off 3-month offer.',
        offerTwoTitle: '50% Off First 3 Months',
        offerTwoDescription: "Save big when you're ready to commit to growth.",
        offerTwoNote: 'Mutually exclusive: selecting this 50% offer means you cannot also take the 14-day free trial.',
        offerSummary:
            'New businesses can choose one of these introductory offers upon signup. They are mutually exclusive.',
        businessCardCta: 'List Your Business',
        supportPrefix: 'Still have questions?',
        supportLink: 'Contact our support team',
    },
    fr: {
        pageTitle: 'Questions frequentes',
        pageSubtitle:
            'Tout ce qu\'il faut savoir pour bien demarrer sur Kayedni, que vous reserviez un service ou que vous developpiez votre business.',
        tabClient: 'Pour les clients',
        tabBusiness: 'Pour les businesses',
        clientCardTitle: '100% gratuit pour les clients',
        clientCardDescription:
            'Trouver le bon service ne doit rien vous couter. Profitez d\'un acces illimite, comparez les professionnels et reservez instantanement sans frais de reservation.',
        clientCardCta: 'Commencer a reserver',
        businessCardTitle: 'Des outils puissants pour developper votre business',
        businessCardDescription:
            'Accedez a des fonctionnalites premium pour simplifier vos operations, ameliorer l\'experience client et augmenter vos revenus.',
        paymentFlowLabel: 'Flux de paiement :',
        paymentFlowText:
            'Les clients paient actuellement les businesses directement, en dehors de Kayedni. Le paiement des abonnements business sera ajoute plus tard. Kayedni ne conserve pas les fonds clients.',
        offerOneTitle: 'Essai gratuit de 14 jours',
        offerOneDescription: 'Testez toutes les fonctionnalites premium sans engagement.',
        offerOneNote: 'Offres exclusives : choisir cet essai exclut l\'offre -50% sur 3 mois.',
        offerTwoTitle: '50% de reduction pendant 3 mois',
        offerTwoDescription: 'Economisez davantage quand vous etes pret a accelerer votre croissance.',
        offerTwoNote: 'Offres exclusives : choisir cette reduction de 50% exclut l\'essai gratuit de 14 jours.',
        offerSummary:
            'Les nouveaux businesses choisissent une seule offre de bienvenue a l\'inscription. Les offres ne sont pas cumulables.',
        businessCardCta: 'Ajouter votre business',
        supportPrefix: 'Vous avez encore des questions ?',
        supportLink: 'Contacter notre equipe support',
    },
    ar: {
        pageTitle: 'الاسئلة الشائعة',
        pageSubtitle:
            'كل ما تحتاج معرفته للانطلاق مع قيدني، سواء كنت تحجز خدمة او تدير شركتك.',
        tabClient: 'للعملاء',
        tabBusiness: 'للشركات',
        clientCardTitle: 'مجاني 100% للعملاء',
        clientCardDescription:
            'نؤمن ان الوصول الى الخدمة المناسبة يجب ان يكون سهلا ومجانيا. قارن بين مقدمي الخدمة واحجز خلال ثوانٍ بدون رسوم حجز.',
        clientCardCta: 'ابدأ الحجز الان',
        businessCardTitle: 'ادوات قوية لنمو شركتك',
        businessCardDescription:
            'فعّل مزايا احترافية تساعدك على تنظيم المواعيد، رفع كفاءة فريقك، وزيادة الايرادات.',
        paymentFlowLabel: 'طريقة الدفع:',
        paymentFlowText: 'العميل يدفع للشركة مباشرة خارج قيدني. سيتم اطلاق دفع اشتراكات الشركات لاحقا. قيدني لا يحتفظ باموال العملاء.',
        offerOneTitle: 'تجربة مجانية لمدة 14 يوما',
        offerOneDescription: 'جرّب جميع الميزات الاحترافية بدون التزام.',
        offerOneNote: 'عرض حصري: اختيار هذه التجربة يلغي عرض خصم 50% لمدة 3 اشهر.',
        offerTwoTitle: 'خصم 50% لاول 3 اشهر',
        offerTwoDescription: 'وفر كثيرا عندما تكون مستعدا للنمو.',
        offerTwoNote: 'عرض حصري: اختيار خصم 50% يعني عدم امكانية الحصول على تجربة 14 يوما.',
        offerSummary: 'يمكن للشركات الجديدة اختيار عرض ترحيبي واحد فقط عند التسجيل، ولا يمكن الجمع بين العرضين.',
        businessCardCta: 'اضف نشاطك التجاري',
        supportPrefix: 'ما زالت لديك اسئلة؟',
        supportLink: 'تواصل مع فريق الدعم',
    },
};

const FAQ_ITEMS: Record<LocaleCode, Record<FaqTab, FaqItem[]>> = {
    en: {
        client: [
            {
                q: 'Is Kayedni really free for clients?',
                a: 'Yes. Clients can browse, search, and book appointments with local professionals completely free of charge.',
            },
            {
                q: 'Do I need to create an account to book?',
                a: 'You can browse and start booking without an account, but you need an account to complete checkout and manage bookings.',
            },
            {
                q: 'How do I cancel or reschedule an appointment?',
                a: 'Open your My Bookings dashboard, choose the appointment, then follow the cancellation or reschedule steps.',
            },
            {
                q: 'Can I leave reviews for businesses?',
                a: 'Yes. Verified reviews help other users choose the best professionals.',
            },
        ],
        business: [
            {
                q: 'What are the pricing options for businesses?',
                a: 'We provide a premium model for businesses with advanced analytics, reminders, and growth tools.',
            },
            {
                q: 'Do you offer a free trial?',
                a: 'Yes. New businesses can choose either a 14-day free full-access trial or 50% off for the first 3 months.',
            },
            {
                q: 'Can I switch my plan later?',
                a: 'Absolutely. You can upgrade or adjust your plan anytime from business settings.',
            },
            {
                q: 'How do I get paid?',
                a: 'Payment method for business subscriptions will be added later. Currently, clients pay directly or hand-to-hand outside Kayedni. Kayedni does not handle or hold client funds, while it only manages bookings.'
            },
        ],
    },
    fr: {
        client: [
            {
                q: 'Kayedni est-il vraiment gratuit pour les clients ?',
                a: 'Oui. Les clients peuvent parcourir, rechercher et reserver des rendez-vous gratuitement.',
            },
            {
                q: 'Dois-je creer un compte pour reserver ?',
                a: 'Vous pouvez parcourir sans compte, mais un compte est necessaire pour finaliser la reservation et gerer vos rendez-vous.',
            },
            {
                q: 'Comment annuler ou reporter un rendez-vous ?',
                a: 'Ouvrez votre tableau de bord Mes reservations, selectionnez le rendez-vous et suivez les etapes.',
            },
            {
                q: 'Puis-je laisser des avis sur les businesses ?',
                a: 'Oui. Les avis verifies aident les autres utilisateurs a choisir les meilleurs professionnels.',
            },
        ],
        business: [
            {
                q: 'Quelles sont les options tarifaires pour les businesses ?',
                a: 'Nous proposons un modele premium avec analyses avancees, rappels automatises et outils de croissance.',
            },
            {
                q: 'Proposez-vous un essai gratuit ?',
                a: 'Oui. Les nouveaux businesses peuvent choisir entre 14 jours d\'essai complet ou 50% de reduction pendant 3 mois.',
            },
            {
                q: 'Puis-je changer de formule plus tard ?',
                a: 'Absolument. Vous pouvez ajuster ou mettre a niveau votre formule a tout moment.',
            },
            {
                q: 'Comment suis-je payé ?',
                a: 'Les clients paient votre business directement. Kayedni se concentre actuellement sur la gestion des rendez-vous et ne conserve pas les fonds clients.'
            },
        ],
    },
    ar: {
        client: [
            {
                q: 'هل قيدني مجاني حقا للعملاء؟',
                a: 'نعم. يمكن للعملاء التصفح والبحث وحجز المواعيد مع المهنيين المحليين مجانا بالكامل.',
            },
            {
                q: 'هل احتاج الى حساب للحجز؟',
                a: 'يمكنك التصفح والبدء بالحجز بدون حساب، لكن اكمال الحجز وادارة المواعيد يتطلبان حسابا.',
            },
            {
                q: 'كيف الغي او اعيد جدولة موعد؟',
                a: 'افتح لوحة حجوزاتي، اختر الموعد، ثم اتبع خطوات الالغاء او اعادة الجدولة.',
            },
            {
                q: 'هل يمكنني ترك تقييم للشركات؟',
                a: 'نعم. التقييمات الموثقة تساعد المستخدمين على اختيار افضل المهنيين.',
            },
        ],
        business: [
            {
                q: 'ما خيارات التسعير للشركات؟',
                a: 'نوفر باقات مرنة للشركات تشمل تحليلات متقدمة، تنبيهات ذكية، وادوات عملية لدعم النمو.',
            },
            {
                q: 'هل توفرون فترة تجريبية مجانية؟',
                a: 'نعم. يمكن للشركات الجديدة اختيار تجربة كاملة 14 يوما او خصم 50% لاول 3 اشهر.',
            },
            {
                q: 'هل يمكنني تغيير الخطة لاحقا؟',
                a: 'نعم بالتأكيد. يمكنك ترقية الخطة او تعديلها في اي وقت من لوحة تحكم الشركة.',
            },
            {
                q: 'كيف تتم المدفوعات؟',
                a: 'العميل يدفع للشركة مباشرة. قيدني يدير الحجوزات والمواعيد حاليا، ولا يحتفظ باي مبالغ تخص العملاء.'
            },
        ],
    },
};

export function getFaqCopy(locale: LocaleCode): FaqCopy {
    return FAQ_COPY[locale] ?? FAQ_COPY.en;
}

export function getFaqItems(locale: LocaleCode, tab: FaqTab): FaqItem[] {
    const localeItems = FAQ_ITEMS[locale] ?? FAQ_ITEMS.en;
    return localeItems[tab];
}