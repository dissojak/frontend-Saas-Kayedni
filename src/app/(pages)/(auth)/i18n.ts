import { type LocaleCode } from "@global/lib/locales";

export type AuthKey =
    | "common_loading"
    | "common_go_to_login"
    | "common_return_home"
    | "common_create_account"
    | "auth_brand_os"
    | "auth_hero_title"
    | "auth_trusted_title"
    | "auth_trusted_desc"
    | "login_welcome_back"
    | "login_hero_desc"
    | "login_live_updates"
    | "login_role_control"
    | "login_secure_design"
    | "login_sign_in"
    | "login_welcome_title"
    | "login_new_here"
    | "login_email"
    | "login_email_placeholder"
    | "login_password"
    | "login_forgot"
    | "login_sign_in_as"
    | "login_role_client"
    | "login_role_business"
    | "login_submitting"
    | "login_submit"
    | "login_quick_secure"
    | "login_no_account"
    | "register_hero_title"
    | "register_start_confidence"
    | "register_hero_desc"
    | "register_step_owner"
    | "register_step_business"
    | "register_step_optional"
    | "register_step_request"
    | "register_step_flow"
    | "register_fast_onboarding"
    | "register_create_account"
    | "register_join_kayedni"
    | "register_have_one"
    | "register_steps_completed"
    | "register_owner_details_complete"
    | "register_check_email"
    | "register_verify_email"
    | "register_sent_to"
    | "register_home"
    | "register_account_type"
    | "register_personal"
    | "register_business"
    | "register_full_name"
    | "register_name_placeholder"
    | "register_confirm"
    | "register_terms_prefix"
    | "register_terms"
    | "register_and"
    | "register_privacy"
    | "register_business_name"
    | "register_business_name_placeholder"
    | "register_business_location"
    | "register_business_location_placeholder"
    | "register_business_category"
    | "register_select_category"
    | "register_other_not_listed"
    | "register_preselected_prefix"
    | "register_preselected_suffix"
    | "register_category_not_found"
    | "register_phone_optional"
    | "register_phone_placeholder"
    | "register_business_email_optional"
    | "register_business_email_placeholder"
    | "register_description_optional"
    | "register_description_placeholder"
    | "register_actual_industry_name"
    | "register_actual_industry_placeholder"
    | "register_describe_industry"
    | "register_describe_industry_placeholder"
    | "register_phone_required_followup"
    | "register_back"
    | "register_continue_business_details"
    | "register_continue_optional_details"
    | "register_continue_industry_request"
    | "register_creating_account"
    | "register_create_owner_business"
    | "register_smooth_onboarding"
    | "register_already_have_account"
    | "forgot_title"
    | "forgot_hero_title"
    | "forgot_hero_desc"
    | "forgot_secure_process"
    | "forgot_fast_recovery"
    | "forgot_email_verification"
    | "forgot_recovery_title"
    | "forgot_recovery_desc"
    | "forgot_reset_password"
    | "forgot_recover_account"
    | "forgot_success_title"
    | "forgot_success_desc"
    | "forgot_email_address"
    | "forgot_email_help"
    | "forgot_sending"
    | "forgot_sent"
    | "forgot_send"
    | "forgot_security_note"
    | "forgot_remember_password"
    | "reset_hero_title"
    | "reset_hero_desc"
    | "reset_secure_password"
    | "reset_code_verification"
    | "reset_account_recovery"
    | "reset_strong_password_title"
    | "reset_strong_password_desc"
    | "reset_verify_and_reset"
    | "reset_set_new_password"
    | "reset_success_title"
    | "reset_success_desc"
    | "reset_code_sent_to"
    | "reset_code_label"
    | "reset_code_help"
    | "reset_new_password"
    | "reset_password_help"
    | "reset_confirm_password"
    | "reset_password_mismatch"
    | "reset_submitting"
    | "reset_success_button"
    | "reset_submit"
    | "reset_security_note"
    | "reset_no_code"
    | "reset_request_again"
    | "reset_remember_password"
    | "activation_success_title"
    | "activation_success_desc"
    | "activation_failed_title"
    | "activation_failed_desc"
    | "error_login_failed"
    | "error_forgot_email_required"
    | "error_forgot_send_failed"
    | "error_unknown_try_again"
    | "error_reset_email_missing"
    | "error_reset_invalid_code"
    | "error_reset_password_length"
    | "error_passwords_mismatch"
    | "error_reset_failed"
    | "error_register_passwords_mismatch"
    | "error_register_accept_terms"
    | "error_register_business_name_required"
    | "error_register_business_location_required"
    | "error_register_business_category_required"
    | "error_register_phone_length"
    | "error_register_industry_name_required"
    | "error_register_industry_description_required"
    | "error_register_phone_required_other"
    | "error_register_no_fallback_category"
    | "error_register_failed"
    | "register_success_check_email";

const MESSAGES: Record<LocaleCode, Record<AuthKey, string>> = {
    en: {
        common_loading: "Loading...",
        common_go_to_login: "Go to Login",
        common_return_home: "Return Home",
        common_create_account: "Create Account",
        auth_brand_os: "Kayedni OS",
        auth_hero_title: "Scheduling that feels smooth",
        auth_trusted_title: "Trusted by busy teams",
        auth_trusted_desc: "Optimized for mobile and desktop.",
        login_welcome_back: "Welcome back.",
        login_hero_desc: "Keep bookings, clients, and staff in sync. Fast, focused, and ready for your next busy day.",
        login_live_updates: "Live updates",
        login_role_control: "Role-based control",
        login_secure_design: "Secure by design",
        login_sign_in: "Sign in",
        login_welcome_title: "Welcome to Kayedni",
        login_new_here: "New here?",
        login_email: "Email",
        login_email_placeholder: "Adem@gmail.com",
        login_password: "Password",
        login_forgot: "Forgot?",
        login_sign_in_as: "Sign in as",
        login_role_client: "Client",
        login_role_business: "Business",
        login_submitting: "Signing in...",
        login_submit: "Sign in",
        login_quick_secure: "Quick, responsive, and secure for every role.",
        login_no_account: "Don't have an account?",
        register_hero_title: "Launch your account in minutes",
        register_start_confidence: "Start with confidence.",
        register_hero_desc: "Personal users register in one step. Business owners follow 3 simple steps, with an extra industry request step only when needed.",
        register_step_owner: "Owner",
        register_step_business: "Business",
        register_step_optional: "Optional",
        register_step_request: "Request",
        register_step_flow: "Step-based flow",
        register_fast_onboarding: "Fast onboarding",
        register_create_account: "Create account",
        register_join_kayedni: "Join Kayedni",
        register_have_one: "Have one?",
        register_steps_completed: "Registration steps completed",
        register_owner_details_complete: "Owner account and business details are complete.",
        register_check_email: "Check your email",
        register_verify_email: "Please verify your email to activate your account.",
        register_sent_to: "Sent to",
        register_home: "Home",
        register_account_type: "Account type",
        register_personal: "Personal",
        register_business: "Business",
        register_full_name: "Full Name",
        register_name_placeholder: "Lahbib Bourguiba",
        register_confirm: "Confirm",
        register_terms_prefix: "I agree to the",
        register_terms: "Terms of Service",
        register_and: "and",
        register_privacy: "Privacy Policy",
        register_business_name: "Business name",
        register_business_name_placeholder: "Downtown Barber Studio",
        register_business_location: "Business location",
        register_business_location_placeholder: "Cairo, Nasr City",
        register_business_category: "Business category",
        register_select_category: "Select your category",
        register_other_not_listed: "Other (not listed)",
        register_preselected_prefix: "We preselected",
        register_preselected_suffix: "from your landing page.",
        register_category_not_found: "Category not found. You will submit an industry request in step 4.",
        register_phone_optional: "Phone",
        register_phone_placeholder: "+216 00 000 000",
        register_business_email_optional: "Business email ",
        register_business_email_placeholder: "business@example.com",
        register_description_optional: "Description ",
        register_description_placeholder: "Describe your services",
        register_actual_industry_name: "Your actual industry name",
        register_actual_industry_placeholder: "e.g. Barber Shop",
        register_describe_industry: "Describe your industry",
        register_describe_industry_placeholder: "Tell us what you do so we can prioritize this niche",
        register_phone_required_followup: "Phone (required for follow-up)",
        register_back: "Back",
        register_continue_business_details: "Continue to business details",
        register_continue_optional_details: "Continue to complete details",
        register_continue_industry_request: "Continue to industry request",
        register_creating_account: "Creating account...",
        register_create_owner_business: "Create owner + business",
        register_smooth_onboarding: "Smooth onboarding for clients and business owners.",
        register_already_have_account: "Already have an account?",
        forgot_title: "Password reset.",
        forgot_hero_title: "Password reset.",
        forgot_hero_desc: "Don't worry, we'll help you reset your password and get back to booking. Enter your email and we'll send you a reset code.",
        forgot_secure_process: "Secure process",
        forgot_fast_recovery: "Fast recovery",
        forgot_email_verification: "Email verification",
        forgot_recovery_title: "Account recovery made easy",
        forgot_recovery_desc: "Your account security is our priority.",
        forgot_reset_password: "Reset password",
        forgot_recover_account: "Recover your account",
        forgot_success_title: "Reset code sent successfully!",
        forgot_success_desc: "Check your inbox and spam folder. Redirecting to reset password...",
        forgot_email_address: "Email address",
        forgot_email_help: "We'll send a 6-digit reset code to this email address.",
        forgot_sending: "Sending code...",
        forgot_sent: "Code sent! ✓",
        forgot_send: "Send reset code",
        forgot_security_note: "We protect your account with secure verification.",
        forgot_remember_password: "Remember your password?",
        reset_hero_title: "Create new password.",
        reset_hero_desc: "Enter the 6-digit reset code we sent to your email, then create a new password for your account.",
        reset_secure_password: "Secure password",
        reset_code_verification: "Code verification",
        reset_account_recovery: "Account recovery",
        reset_strong_password_title: "Strong passwords protect your data",
        reset_strong_password_desc: "Your new password is encrypted and secure.",
        reset_verify_and_reset: "Verify and reset",
        reset_set_new_password: "Set your new password",
        reset_success_title: "Password reset successfully!",
        reset_success_desc: "Redirecting to sign in...",
        reset_code_sent_to: "Reset code sent to:",
        reset_code_label: "Reset code (6 digits)",
        reset_code_help: "Check your email for the 6-digit code we sent you.",
        reset_new_password: "New password",
        reset_password_help: "At least 8 characters",
        reset_confirm_password: "Confirm password",
        reset_password_mismatch: "Passwords do not match",
        reset_submitting: "Resetting password...",
        reset_success_button: "Password reset! ✓",
        reset_submit: "Reset password",
        reset_security_note: "Your account is now more secure with your new password.",
        reset_no_code: "Didn't receive a code?",
        reset_request_again: "Request again",
        reset_remember_password: "Remember your password?",
        activation_success_title: "Account Activated",
        activation_success_desc: "Your account has been successfully activated. You can now log in and start booking services.",
        activation_failed_title: "Activation Failed",
        activation_failed_desc: "We couldn't activate your account. This may be due to an expired or invalid activation link.",
        error_login_failed: "Login failed",
        error_forgot_email_required: "Please enter your email address",
        error_forgot_send_failed: "Failed to send reset code. Please try again.",
        error_unknown_try_again: "An error occurred. Please try again.",
        error_reset_email_missing: "Email not found. Please go back to forgot password page.",
        error_reset_invalid_code: "Please enter a valid 6-digit reset code",
        error_reset_password_length: "Password must be at least 8 characters",
        error_passwords_mismatch: "Passwords do not match",
        error_reset_failed: "Failed to reset password. Please try again.",
        error_register_passwords_mismatch: "Passwords do not match",
        error_register_accept_terms: "Please accept the terms and conditions",
        error_register_business_name_required: "Please enter your business name",
        error_register_business_location_required: "Please enter your business location",
        error_register_business_category_required: "Please select a business category",
        error_register_phone_length: "Phone must be between 8 and 20 characters",
        error_register_industry_name_required: "Please enter your actual industry name",
        error_register_industry_description_required: "Please describe your industry so we can review it",
        error_register_phone_required_other: "Phone number is required for Other industry requests",
        error_register_no_fallback_category: "No fallback category is configured. Please contact support.",
        error_register_failed: "Registration failed",
        register_success_check_email: "Registration successful. Please check your email to activate your account.",
    },
    fr: {
        common_loading: "Chargement...",
        common_go_to_login: "Aller a la connexion",
        common_return_home: "Retour a l'accueil",
        common_create_account: "Creer un compte",
        auth_brand_os: "Kayedni OS",
        auth_hero_title: "Une planification fluide",
        auth_trusted_title: "Adopte par les equipes professionnelles",
        auth_trusted_desc: "Optimise pour mobile et ordinateur.",
        login_welcome_back: "Bon retour.",
        login_hero_desc: "Gardez reservations, clients et equipe synchronises. Rapide et efficace pour vos journees chargees.",
        login_live_updates: "Mises a jour en direct",
        login_role_control: "Controle par role",
        login_secure_design: "Securite integree",
        login_sign_in: "Connexion",
        login_welcome_title: "Bienvenue sur Kayedni",
        login_new_here: "Nouveau ici ?",
        login_email: "E-mail",
        login_email_placeholder: "Adem@gmail.com",
        login_password: "Mot de passe",
        login_forgot: "Oublie ?",
        login_sign_in_as: "Se connecter en tant que",
        login_role_client: "Client",
        login_role_business: "Entreprise",
        login_submitting: "Connexion...",
        login_submit: "Se connecter",
        login_quick_secure: "Rapide, reactive et securisee pour chaque role.",
        login_no_account: "Vous n'avez pas de compte ?",
        register_hero_title: "Lancez votre compte en quelques minutes",
        register_start_confidence: "Commencez en toute confiance.",
        register_hero_desc: "Les particuliers s'inscrivent en une etape. Les proprietaires suivent 3 etapes simples, avec une etape supplementaire uniquement si necessaire.",
        register_step_owner: "Proprietaire",
        register_step_business: "Business",
        register_step_optional: "Optionnel",
        register_step_request: "Demande",
        register_step_flow: "Parcours par etapes",
        register_fast_onboarding: "Onboarding rapide",
        register_create_account: "Creer un compte",
        register_join_kayedni: "Rejoindre Kayedni",
        register_have_one: "Vous en avez deja un ?",
        register_steps_completed: "Etapes d'inscription terminees",
        register_owner_details_complete: "Le compte proprietaire et les details du business sont complets.",
        register_check_email: "Verifiez votre e-mail",
        register_verify_email: "Veuillez verifier votre e-mail pour activer votre compte.",
        register_sent_to: "Envoye a",
        register_home: "Accueil",
        register_account_type: "Type de compte",
        register_personal: "Particulier",
        register_business: "Business",
        register_full_name: "Nom complet",
        register_name_placeholder: "Lahbib Bourguiba",
        register_confirm: "Confirmer",
        register_terms_prefix: "J'accepte les",
        register_terms: "Conditions d'utilisation",
        register_and: "et",
        register_privacy: "Politique de confidentialite",
        register_business_name: "Nom du business",
        register_business_name_placeholder: "Downtown Barber Studio",
        register_business_location: "Adresse du business",
        register_business_location_placeholder: "Tunis, Les Berges du Lac 2",
        register_business_category: "Categorie du business",
        register_select_category: "Selectionnez votre categorie",
        register_other_not_listed: "Autre (non liste)",
        register_preselected_prefix: "Nous avons preselectionne",
        register_preselected_suffix: "depuis votre page d'arrivee.",
        register_category_not_found: "Categorie introuvable. Vous pourrez envoyer une demande de nouvelle categorie a l'etape 4.",
        register_phone_optional: "Telephone (optionnel)",
        register_phone_placeholder: "+216 00 000 000",
        register_business_email_optional: "E-mail professionnel (optionnel)",
        register_business_email_placeholder: "business@exemple.com",
        register_description_optional: "Description (optionnel)",
        register_description_placeholder: "Decrivez vos services",
        register_actual_industry_name: "Nom reel de votre secteur",
        register_actual_industry_placeholder: "ex. Salon de beauté",
        register_describe_industry: "Decrivez votre secteur",
        register_describe_industry_placeholder: "Decrivez clairement votre activite pour accelerer la validation de cette categorie",
        register_phone_required_followup: "Telephone (obligatoire pour le suivi)",
        register_back: "Retour",
        register_continue_business_details: "Continuer vers les details du business",
        register_continue_optional_details: "Continuer vers les details a completer",
        register_continue_industry_request: "Continuer vers la demande de categorie",
        register_creating_account: "Creation du compte...",
        register_create_owner_business: "Creer proprietaire + business",
        register_smooth_onboarding: "Onboarding fluide pour clients et businesses.",
        register_already_have_account: "Vous avez deja un compte ?",
        forgot_title: "Reinitialisation du mot de passe.",
        forgot_hero_title: "Reinitialisation du mot de passe.",
        forgot_hero_desc: "Pas d'inquietude, nous allons vous aider a reinitialiser votre mot de passe. Entrez votre e-mail et recevez un code.",
        forgot_secure_process: "Processus securise",
        forgot_fast_recovery: "Recuperation rapide",
        forgot_email_verification: "Verification par e-mail",
        forgot_recovery_title: "Recuperation de compte simplifiee",
        forgot_recovery_desc: "La securite de votre compte est notre priorite.",
        forgot_reset_password: "Reinitialiser le mot de passe",
        forgot_recover_account: "Recuperer votre compte",
        forgot_success_title: "Code envoye avec succes !",
        forgot_success_desc: "Consultez votre boite de reception et vos spams. Redirection en cours...",
        forgot_email_address: "Adresse e-mail",
        forgot_email_help: "Nous enverrons un code a 6 chiffres a cette adresse e-mail.",
        forgot_sending: "Envoi du code...",
        forgot_sent: "Code envoye ! ✓",
        forgot_send: "Envoyer le code",
        forgot_security_note: "Nous protégeons votre compte avec une verification securisee.",
        forgot_remember_password: "Vous vous souvenez du mot de passe ?",
        reset_hero_title: "Creez un nouveau mot de passe.",
        reset_hero_desc: "Entrez le code a 6 chiffres recu par e-mail puis choisissez un nouveau mot de passe.",
        reset_secure_password: "Mot de passe securise",
        reset_code_verification: "Verification du code",
        reset_account_recovery: "Recuperation du compte",
        reset_strong_password_title: "Des mots de passe forts protègent vos donnees",
        reset_strong_password_desc: "Votre nouveau mot de passe est chiffre et securise.",
        reset_verify_and_reset: "Verifier et reinitialiser",
        reset_set_new_password: "Definir votre nouveau mot de passe",
        reset_success_title: "Mot de passe reinitialise avec succes !",
        reset_success_desc: "Redirection vers la connexion...",
        reset_code_sent_to: "Code envoye a :",
        reset_code_label: "Code de reinitialisation (6 chiffres)",
        reset_code_help: "Consultez votre e-mail pour le code a 6 chiffres.",
        reset_new_password: "Nouveau mot de passe",
        reset_password_help: "Au moins 8 caracteres",
        reset_confirm_password: "Confirmer le mot de passe",
        reset_password_mismatch: "Les mots de passe ne correspondent pas",
        reset_submitting: "Reinitialisation...",
        reset_success_button: "Mot de passe reinitialise ! ✓",
        reset_submit: "Reinitialiser le mot de passe",
        reset_security_note: "Votre compte est maintenant plus securise.",
        reset_no_code: "Vous n'avez pas recu de code ?",
        reset_request_again: "Demander a nouveau",
        reset_remember_password: "Vous vous souvenez du mot de passe ?",
        activation_success_title: "Compte active",
        activation_success_desc: "Votre compte a ete active avec succes. Vous pouvez maintenant vous connecter.",
        activation_failed_title: "Activation echouee",
        activation_failed_desc: "Nous n'avons pas pu activer votre compte. Le lien peut etre invalide ou expire.",
        error_login_failed: "Echec de connexion",
        error_forgot_email_required: "Veuillez saisir votre adresse e-mail",
        error_forgot_send_failed: "Impossible d'envoyer le code. Veuillez reessayer.",
        error_unknown_try_again: "Une erreur s'est produite. Veuillez reessayer.",
        error_reset_email_missing: "E-mail introuvable. Revenez a la page de recuperation.",
        error_reset_invalid_code: "Veuillez saisir un code valide a 6 chiffres",
        error_reset_password_length: "Le mot de passe doit contenir au moins 8 caracteres",
        error_passwords_mismatch: "Les mots de passe ne correspondent pas",
        error_reset_failed: "Echec de reinitialisation. Veuillez reessayer.",
        error_register_passwords_mismatch: "Les mots de passe ne correspondent pas",
        error_register_accept_terms: "Veuillez accepter les conditions",
        error_register_business_name_required: "Veuillez saisir le nom du business",
        error_register_business_location_required: "Veuillez saisir l'adresse du business",
        error_register_business_category_required: "Veuillez selectionner une categorie",
        error_register_phone_length: "Le telephone doit contenir entre 8 et 20 caracteres",
        error_register_industry_name_required: "Veuillez saisir le nom reel de votre secteur",
        error_register_industry_description_required: "Veuillez decrire votre secteur pour revue",
        error_register_phone_required_other: "Le telephone est obligatoire pour les demandes de secteur",
        error_register_no_fallback_category: "Aucune categorie de secours n'est configuree. Contactez le support.",
        error_register_failed: "Echec de l'inscription",
        register_success_check_email: "Inscription reussie. Verifiez votre e-mail pour activer votre compte.",
    },
    ar: {
        common_loading: "جاري التحميل...",
        common_go_to_login: "الانتقال الى تسجيل الدخول",
        common_return_home: "العودة إلى الصفحة الرئيسية",
        common_create_account: "انشاء حساب",
        auth_brand_os: "نظام قيدني",
        auth_hero_title: "تجربة الحجز الأفضل",
        auth_trusted_title: "موثوق من قبل الشركات",
        auth_trusted_desc:"تجربة مثالية و سلاسة على كل الأجهزة",
        login_welcome_back: "مرحبا بعودتك.",
        login_hero_desc: "حافظ على مزامنة الحجوزات والعملاء والموظفين بسرعة وتركيز.",
        login_live_updates: "تحديثات مستمرة",
        login_role_control: "نظام تحكم ذكي",
        login_secure_design: "مصمم ليكون آمنًا",
        login_sign_in: "تسجيل الدخول",
        login_welcome_title: "مرحبا بك في قيدني",
        login_new_here: "جديد هنا؟",
        login_email: "البريد الالكتروني",
        login_email_placeholder: "Adem@gmail.com",
        login_password: "كلمة المرور",
        login_forgot: "نسيت؟",
        login_sign_in_as: "تسجيل الدخول كـ",
        login_role_client: "عميل",
        login_role_business: "صاحب شركة",
        login_submitting: "جاري تسجيل الدخول...",
        login_submit: "تسجيل الدخول",
        login_quick_secure: "سريع وآمن لكل الحسابات.",
        login_no_account: "ليس لديك حساب؟",
        register_hero_title: "أنشئ حسابك خلال دقائق",
        register_start_confidence: "ارتقِ بتجربتك نحو الأفضل.",
        register_hero_desc: "المستخدم الشخصي يسجل بخطوة واحدة. صاحب العمل يتبع 3 خطوات بسيطة مع خطوة اضافية فقط عند الحاجة.",
        register_step_owner: "المدير",
        register_step_business: "الشركة",
        register_step_optional: "اختياري",
        register_step_request: "طلب",
        register_step_flow: "تدفق على خطوات",
        register_fast_onboarding: "تهيئة سريعة",
        register_create_account: "انشاء حساب",
        register_join_kayedni: "انضم الى قيدني",
        register_have_one: "لديك حساب؟",
        register_steps_completed: "اكتملت خطوات التسجيل",
        register_owner_details_complete: "اكتملت بيانات حساب المدير والشركة.",
        register_check_email: "تحقق من بريدك",
        register_verify_email: "يرجى التحقق من بريدك لتفعيل الحساب.",
        register_sent_to: "تم الارسال الى",
        register_home: "الرئيسية",
        register_account_type: "نوع الحساب",
        register_personal: "شخصي",
        register_business: "تجاري",
        register_full_name: "الاسم الكامل",
        register_name_placeholder: "Lahbib Bourguiba",
        register_confirm: "تأكيد",
        register_terms_prefix: "اوافق على",
        register_terms: "شروط الخدمة",
        register_and: "و",
        register_privacy: "سياسة الخصوصية",
        register_business_name: "اسم الشركة",
        register_business_name_placeholder: "Downtown Barber Studio",
        register_business_location: "عنوان الشركة",
        register_business_location_placeholder: "تونس، البحيرة 2، شارع الهادي نويرة",
        register_business_category: "فئة الشركة",
        register_select_category: "اختر فئة الشركة",
        register_other_not_listed: "اخرى (غير موجودة)",
        register_preselected_prefix: "قمنا باختيار",
        register_preselected_suffix: "مسبقا من صفحة الهبوط.",
        register_category_not_found: "الفئة غير متاحة حاليا. يمكنك ارسال طلب فئة جديدة في الخطوة الرابعة.",
        register_phone_optional: "رقم الهاتف ",
        register_phone_placeholder: "000 000 00 +216",
        register_business_email_optional: "بريد الشركة ",
        register_business_email_placeholder: "business@example.com",
        register_description_optional: "نبذة عن الشركة",
        register_description_placeholder: "قدّم وصفا مختصرا وواضحا لخدمات شركتك",
        register_actual_industry_name: "الاسم الفعلي لمجال شركتك",
        register_actual_industry_placeholder: "مثال: حلاقة، مقهى، عيادة طبية",
        register_describe_industry: "عرّف بمجال شركتك",
        register_describe_industry_placeholder: "اشرح مجال عمل شركتك لنتمكن من مراجعته واعتماده بسرعة",
        register_phone_required_followup: "الهاتف الشخصي (مطلوب للمتابعة)",
        register_back: "رجوع",
        register_continue_business_details: "المتابعة لبيانات الشركة",
        register_continue_optional_details: "المتابعة لإكمال البيانات",
        register_continue_industry_request: "المتابعة لطلب الفئة",
        register_creating_account: "جار انشاء الحساب...",
        register_create_owner_business: "إنشاء حساب المدير والشركة",
        register_smooth_onboarding: "تجربة انطلاق سلسة للعملاء واصحاب الشركات.",
        register_already_have_account: "لديك حساب بالفعل؟",
        forgot_title: "اعادة تعيين كلمة المرور.",
        forgot_hero_title: "اعادة تعيين كلمة المرور.",
        forgot_hero_desc: "لا تقلق، سنساعدك على اعادة تعيين كلمة المرور. ادخل بريدك وسنرسل رمز الاستعادة.",
        forgot_secure_process: "عملية آمنة",
        forgot_fast_recovery: "استعادة سريعة",
        forgot_email_verification: "تحقق عبر البريد",
        forgot_recovery_title: "استعادة الحساب بسهولة",
        forgot_recovery_desc: "امان حسابك هو اولويتنا.",
        forgot_reset_password: "اعادة تعيين كلمة المرور",
        forgot_recover_account: "استعادة حسابك",
        forgot_success_title: "تم ارسال الرمز بنجاح!",
        forgot_success_desc: "تحقق من البريد الوارد والرسائل غير المرغوبة. سيتم تحويلك الان...",
        forgot_email_address: "عنوان البريد الالكتروني",
        forgot_email_help: "سنرسل رمز مكون من 6 ارقام الى هذا البريد.",
        forgot_sending: "جاري ارسال الرمز...",
        forgot_sent: "تم ارسال الرمز! ✓",
        forgot_send: "ارسال رمز الاستعادة",
        forgot_security_note: "نحمي حسابك عبر تحقق آمن.",
        forgot_remember_password: "تتذكر كلمة المرور؟",
        reset_hero_title: "انشئ كلمة مرور جديدة.",
        reset_hero_desc: "ادخل رمز الاستعادة المكون من 6 ارقام ثم انشئ كلمة مرور جديدة.",
        reset_secure_password: "كلمة مرور آمنة",
        reset_code_verification: "تحقق من الرمز",
        reset_account_recovery: "استعادة الحساب",
        reset_strong_password_title: "كلمات المرور القوية تحمي بياناتك",
        reset_strong_password_desc: "كلمة المرور الجديدة مشفرة وآمنة.",
        reset_verify_and_reset: "تحقق واعادة التعيين",
        reset_set_new_password: "تعيين كلمة مرور جديدة",
        reset_success_title: "تمت اعادة تعيين كلمة المرور بنجاح!",
        reset_success_desc: "جاري التحويل الى تسجيل الدخول...",
        reset_code_sent_to: "تم ارسال الرمز الى:",
        reset_code_label: "رمز الاستعادة (6 ارقام)",
        reset_code_help: "تحقق من بريدك للعثور على رمز 6 ارقام.",
        reset_new_password: "كلمة المرور الجديدة",
        reset_password_help: "على الاقل 8 احرف",
        reset_confirm_password: "تأكيد كلمة المرور",
        reset_password_mismatch: "كلمتا المرور غير متطابقتين",
        reset_submitting: "جاري اعادة التعيين...",
        reset_success_button: "تمت الاعادة! ✓",
        reset_submit: "اعادة تعيين كلمة المرور",
        reset_security_note: "اصبح حسابك اكثر امانا الان.",
        reset_no_code: "لم يصلك الرمز؟",
        reset_request_again: "اطلب مرة اخرى",
        reset_remember_password: "تتذكر كلمة المرور؟",
        activation_success_title: "تم تفعيل الحساب",
        activation_success_desc: "تم تفعيل حسابك بنجاح. يمكنك الان تسجيل الدخول.",
        activation_failed_title: "فشل التفعيل",
        activation_failed_desc: "تعذر تفعيل حسابك. قد يكون الرابط غير صالح او منتهي الصلاحية.",
        error_login_failed: "فشل تسجيل الدخول",
        error_forgot_email_required: "يرجى ادخال البريد الالكتروني",
        error_forgot_send_failed: "فشل ارسال الرمز. حاول مرة اخرى.",
        error_unknown_try_again: "حدث خطأ. حاول مرة اخرى.",
        error_reset_email_missing: "البريد غير موجود. ارجع الى صفحة الاستعادة.",
        error_reset_invalid_code: "يرجى ادخال رمز صالح مكون من 6 ارقام",
        error_reset_password_length: "يجب ان تكون كلمة المرور 8 احرف على الاقل",
        error_passwords_mismatch: "كلمتا المرور غير متطابقتين",
        error_reset_failed: "فشلت اعادة التعيين. حاول مرة اخرى.",
        error_register_passwords_mismatch: "كلمتا المرور غير متطابقتين",
        error_register_accept_terms: "يرجى الموافقة على الشروط",
        error_register_business_name_required: "يرجى ادخال اسم الشركة",
        error_register_business_location_required: "يرجى ادخال عنوان الشركة",
        error_register_business_category_required: "يرجى اختيار فئة الشركة",
        error_register_phone_length: "يجب ان يكون رقم الهاتف بين 8 و20 حرفا",
        error_register_industry_name_required: "يرجى ادخال الاسم الفعلي لمجال الشركة",
        error_register_industry_description_required: "يرجى وصف مجال الشركة حتى نتمكن من مراجعته",
        error_register_phone_required_other: "رقم الهاتف مطلوب عند طلب فئة جديدة",
        error_register_no_fallback_category: "لا توجد فئة بديلة مضبوطة حاليا. تواصل مع الدعم.",
        error_register_failed: "فشل التسجيل",
        register_success_check_email: "تم التسجيل بنجاح. يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب.",
    },
};

export function authT(locale: LocaleCode, key: AuthKey): string {
    return MESSAGES[locale]?.[key] ?? MESSAGES.en[key];
}
