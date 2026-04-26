"use client"

import { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, LucideIcon, Shield, GraduationCap, UserCircle2, Info, ArrowRight, Briefcase } from "lucide-react";
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from "@/lib/supabase";

// Google Icon Component
interface GoogleIconProps {
  className?: string;
}

const GoogleIcon = ({ className }: GoogleIconProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    width="24"
    height="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

// Card Component
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className = "" }: CardProps) => (
  <div className={`bg-card border border-border rounded-lg ${className}`}>
    {children}
  </div>
);

// Form Header Component
interface FormHeaderProps {
  title: string;
  subtitle: string;
}

const FormHeader = ({ title, subtitle }: FormHeaderProps) => (
  <div className="text-center space-y-2">
    <img src="/web-logo.jpg" alt="Logo UCAR" className="mx-auto w-16 h-16 object-contain rounded-2xl shadow-xl shadow-primary/20 mb-6" />
    <h1 className="text-3xl font-bold tracking-tight text-foreground">
      {title}
    </h1>
    <p className="text-muted-foreground">
      {subtitle}
    </p>
  </div>
);

// Input Field Component
interface InputFieldProps {
  id: string;
  type: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: LucideIcon;
  required?: boolean;
  className?: string;
}

const InputField = ({
  id,
  type,
  label,
  placeholder,
  value,
  onChange,
  icon: Icon,
  required = false,
  className = ""
}: InputFieldProps) => (
  <div className="space-y-2">
    <label
      htmlFor={id}
      className="text-sm font-medium text-foreground"
    >
      {label}
    </label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full h-11 pl-10 pr-3 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-300 ${className}`}
        required={required}
      />
    </div>
  </div>
);

// Password Field Component
interface PasswordFieldProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  onTogglePassword: () => void;
  required?: boolean;
  className?: string;
}

const PasswordField = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  showPassword,
  onTogglePassword,
  required = false,
  className = ""
}: PasswordFieldProps) => (
  <div className="space-y-2">
    <label
      htmlFor={id}
      className="text-sm font-medium text-foreground"
    >
      {label}
    </label>
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        id={id}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full h-11 pl-10 pr-10 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-300 ${className}`}
        required={required}
      />
      <button
        type="button"
        onClick={onTogglePassword}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-300"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  </div>
);

// Checkbox Component
interface CheckboxProps {
  id: string;
  label: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox = ({ id, label, checked, onChange }: CheckboxProps) => (
  <label htmlFor={id} className="flex items-center space-x-2 cursor-pointer">
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 rounded border-input text-primary focus:ring-primary focus:ring-offset-background"
    />
    <span className="text-muted-foreground select-none text-sm">{label}</span>
  </label>
);

// Link Component
interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const Link = ({ href, children, className = "" }: LinkProps) => (
  <a
    href={href}
    className={`text-primary hover:opacity-80 font-medium transition-opacity duration-300 ${className}`}
  >
    {children}
  </a>
);

// Button Component
interface ButtonProps {
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline";
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

const Button = ({
  type = "button",
  variant = "primary",
  onClick,
  children,
  className = "",
  fullWidth = false
}: ButtonProps) => {
  const baseStyles = "h-11 rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background flex items-center justify-center gap-2";

  const variants = {
    primary: "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98]",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-border bg-background hover:bg-secondary text-foreground"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
    >
      {children}
    </button>
  );
};

// Divider Component
interface DividerProps {
  text: string;
}

const Divider = ({ text }: DividerProps) => (
  <div className="relative my-6">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-border"></div>
    </div>
    <div className="relative flex justify-center text-xs uppercase">
      <span className="bg-card px-2 text-muted-foreground font-semibold">
        {text}
      </span>
    </div>
  </div>
);

// Social Button Component
interface SocialButtonProps {
  provider: "google" | "github" | "facebook";
  onClick: () => void;
  children: React.ReactNode;
}

const SocialButton = ({ provider, onClick, children }: SocialButtonProps) => {
  const icons = {
    google: <GoogleIcon className="h-5 w-5" />,
    github: null,
    facebook: null
  };

  return (
    <Button variant="outline" onClick={onClick} fullWidth>
      {icons[provider]}
      {children}
    </Button>
  );
};

// Animated Blob Component
interface AnimatedBlobProps {
  color: string;
  position: string;
  delay?: string;
}

const AnimatedBlob = ({ color, position, delay = "" }: AnimatedBlobProps) => (
  <div className={`absolute ${position} w-72 h-72 ${color} rounded-full mix-blend-screen filter blur-xl opacity-70 animate-blob ${delay}`} />
);

// Gradient Wave Component
const GradientWave = () => (
  <div className="absolute inset-0 opacity-20">
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 560">
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <path fill="url(#gradient1)" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,218.7C672,235,768,245,864,234.7C960,224,1056,192,1152,186.7C1248,181,1344,203,1392,213.3L1440,224L1440,560L1392,560C1344,560,1248,560,1152,560C1056,560,960,560,864,560C768,560,672,560,576,560C480,560,384,560,288,560C192,560,96,560,48,560L0,560Z" />
    </svg>
  </div>
);

// Progress Dots Component
interface ProgressDotsProps {
  count?: number;
  activeIndex?: number;
  color?: string;
}

const ProgressDots = ({ count = 3, activeIndex = 2, color = "white" }: ProgressDotsProps) => (
  <div className="flex justify-center gap-2 pt-4">
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className={`w-2 h-2 rounded-full bg-${color}/${index <= activeIndex ? (100 - (activeIndex - index) * 20) : 40}`}
      />
    ))}
  </div>
);

// Icon Badge Component
interface IconBadgeProps {
  icon: React.ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
}

const IconBadge = ({ icon, size = "md", variant = "light" }: IconBadgeProps) => {
  const sizes = {
    sm: "p-2",
    md: "p-3",
    lg: "p-4"
  };

  const variants = {
    light: "bg-white/10 backdrop-blur-sm text-white",
    dark: "bg-black/10 backdrop-blur-sm text-foreground"
  };

  return (
    <div className={`inline-flex rounded-full ${sizes[size]} ${variants[variant]} mb-4`}>
      {icon}
    </div>
  );
};

// Hero Section Component
interface HeroSectionProps {
  title: string;
  description: string;
  showProgress?: boolean;
}

const HeroSection = ({ title, description, showProgress = true }: HeroSectionProps) => (
  <div className="space-y-6">
    <div className="inline-flex rounded-full px-4 py-1.5 bg-cyan-500/20 text-cyan-100 border border-cyan-500/30 backdrop-blur-md text-[10px] font-black tracking-widest uppercase">
      Portail Administratif
    </div>
    <h2 className="text-4xl lg:text-5xl font-black text-white leading-[1.1] tracking-tight">
      {title}
    </h2>
    <p className="text-lg text-slate-300 font-medium leading-relaxed max-w-md">
      {description}
    </p>
    {showProgress && (
      <div className="pt-4 flex gap-2">
        <div className="w-8 h-1.5 rounded-full bg-cyan-500"></div>
        <div className="w-2 h-1.5 rounded-full bg-white/20"></div>
        <div className="w-2 h-1.5 rounded-full bg-white/20"></div>
      </div>
    )}
  </div>
);

// Gradient Background Component
interface GradientBackgroundProps {
  children: React.ReactNode;
  variant?: "default" | "dark" | "light";
}

const GradientBackground = ({ children }: GradientBackgroundProps) => {
  return (
    <div className="hidden lg:flex flex-1 relative overflow-hidden bg-slate-950">
      {/* Background Image */}
      <img
        src="/bg.jpg"
        alt="Université de Carthage"
        className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity"
      />

      {/* Gradient Overlays for depth and text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
      <div className="absolute inset-0 bg-cyan-900/20 mix-blend-multiply" />

      {/* Decorative Cinematic Blobs */}
      <div className="absolute inset-0">
        <AnimatedBlob color="bg-cyan-500/20" position="top-0 -left-4" />
        <AnimatedBlob color="bg-blue-500/20" position="top-0 -right-4" delay="animation-delay-2000" />
      </div>

      <div className="relative z-10 flex flex-col p-12 w-full h-full">
        {/* Logo at the top */}
        <div className="bg-white/95 p-4 rounded-3xl shadow-2xl backdrop-blur-sm self-start mb-auto">
          <img src="/web-logo.jpg" alt="Logo UCAR" className="h-16 w-auto object-contain rounded-xl" />
        </div>

        {/* Hero Content at the bottom */}
        <div className="w-full max-w-lg mb-12">
          {children}
        </div>
      </div>
    </div>
  );
};

// Form Footer Component
interface FormFooterProps {
  text: string;
  linkText: string;
  linkHref: string;
}

const FormFooter = ({ text, linkText, linkHref }: FormFooterProps) => (
  <p className="mt-6 text-center text-sm text-muted-foreground">
    {text}{" "}
    <Link href={linkHref}>
      {linkText}
    </Link>
  </p>
);

// ============================================================================
// MAIN SIGNIN COMPONENT
// ============================================================================

type Role = 'Staff Institut' | 'Directeur Institut' | 'Directeur UCAR';

const ROLE_MAPPING = {
  'Directeur UCAR': 'ucar_president',
  'Directeur Institut': 'inst_president',
  'Staff Institut': 'staff'
} as const;

const getInternalRole = (displayRole: string) => ROLE_MAPPING[displayRole as keyof typeof ROLE_MAPPING] || displayRole;

const STAFF_FUNCTIONS = [
  { value: 'academic', label: 'Responsable Scolarité', domain: 'Académique' },
  { value: 'employment', label: 'Responsable Insertion Professionnelle', domain: 'Insertion Pro' },
  { value: 'finance', label: 'Trésorier / Responsable Financier', domain: 'Finance' },
  { value: 'esg', label: 'Responsable ESG / RSE', domain: 'ESG / RSE' },
  { value: 'hr', label: 'Chef du Personnel / RH', domain: 'Ressources Humaines' },
  { value: 'research', label: 'Responsable Recherche', domain: 'Recherche' },
  { value: 'infrastructure', label: 'Responsable Infrastructure', domain: 'Infrastructures' },
  { value: 'partnerships', label: 'Responsable Partenariats & Relations Internationales', domain: 'Partenariats' },
];

// Accepted email domains for institute staff and directors
const VALID_INSTITUTE_DOMAINS = [
  'insat.tn', 'insat.rnu.tn',
  'supcom.tn', 'supcom.rnu.tn',
  'ihec.tn', 'ihec.rnu.tn',
  'enstab.tn', 'enstab.rnu.tn',
  'isste.tn', 'isste.rnu.tn',
  'ucar.tn', 'rnu.tn',
];

const isValidInstituteDomain = (email: string) => {
  const domain = email.split('@')[1]?.toLowerCase() ?? '';
  return VALID_INSTITUTE_DOMAINS.some(d => domain === d);
};

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<Role>('Staff Institut');
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isRegistering, setIsRegistering] = useState(searchParams?.get("register") === "true");
  const [loginError, setLoginError] = useState("");
  const [authStatus, setAuthStatus] = useState<'idle' | 'pending' | 'approved'>('idle');
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [loadingInstitutions, setLoadingInstitutions] = useState(true);

  // Hardcoded institutions list — used as primary source until RLS policy is added
  // to the Supabase 'institutions' table. Once the policy is applied, this will
  // be replaced by the DB fetch automatically.
  const FALLBACK_INSTITUTIONS = [
    { id: 'inst-insat-0000-0001', name: 'INSAT' },
    { id: 'inst-supcom-0000-0001', name: "SUP'COM" },
    { id: 'inst-ihec-0000-0001', name: 'IHEC' },
    { id: 'inst-enstab-0000-0001', name: 'ENSTAB' },
    { id: 'inst-isste-0000-0001', name: 'ISSTE' },
  ];

  useEffect(() => {
    // Restore remembered email
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }

    const fetchInstitutions = async () => {
      setLoadingInstitutions(true);
      try {
        const { data, error: selectError } = await supabase.from('institutions').select('id, name');

        if (selectError || !data || data.length === 0) {
          console.warn("[institutions] DB fetch failed or empty, using fallback list.", selectError?.message);
          setInstitutions(FALLBACK_INSTITUTIONS);
        } else {
          setInstitutions(data);
        }
      } catch {
        console.warn("[institutions] Network error, using fallback list.");
        setInstitutions(FALLBACK_INSTITUTIONS);
      } finally {
        setLoadingInstitutions(false);
      }
    };
    fetchInstitutions();
  }, []);

  const [institution, setInstitution] = useState("");
  const [jobTitle, setJobTitle] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setAuthStatus('idle');

    try {
      if (isRegistering) {
        // --- REGISTRATION FLOW ---
        const trimmedEmail = email.trim();

        // Email validation per role
        if (role === 'Directeur UCAR') {
          if (trimmedEmail !== 'president@ucar.tn') {
            setLoginError("Cette adresse email n'est pas autorisée pour ce rôle.");
            return;
          }
        } else {
          if (!isValidInstituteDomain(trimmedEmail)) {
            setLoginError("Cette adresse email n'est pas autorisée pour ce rôle. Utilisez votre email professionnel d'établissement.");
            return;
          }
        }

        const internalRole = getInternalRole(role);
        // Directeur UCAR and Directeur Institut are auto-approved; only Staff Institut requires approval
        const isActive = internalRole === 'ucar_president' || internalRole === 'inst_president';
        const profilePayload = {
          full_name: fullName,
          role: internalRole,
          institution_id: internalRole === 'ucar_president' ? null : (institution || null),
          job_title: internalRole === 'staff' ? jobTitle : null,
          status: isActive ? 'active' : 'pending'
        };

        // Embed profile data in auth metadata so it's always readable regardless of RLS
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: { data: profilePayload }
        });
        if (authError) throw authError;
        if (!authData.user) return;

        // Best-effort insert into users table — silently skipped if RLS not yet configured
        await supabase.from('users').insert({ id: authData.user.id, email: trimmedEmail, ...profilePayload });

        if (isActive) {
          localStorage.setItem('userRole', role);
          router.push('/dashboard');
          return;
        }

        setAuthStatus('pending');
        localStorage.setItem('hasPendingAuthRequest', 'true');
        localStorage.setItem('pendingAuthName', fullName);
        localStorage.setItem('pendingAuthInst', institution);
        localStorage.setItem('pendingAuthRole', role);
        setIsRegistering(false);
        setEmail("");
        setPassword("");
      } else {
        // --- SIGN IN FLOW ---
        const trimmedEmail = email.trim();
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email: trimmedEmail, password });
        if (authError) throw authError;
        if (!authData.user) return;

        // Try users table first; fall back to auth user_metadata if RLS blocks the read
        const { data: tableProfile } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        const profile = tableProfile ?? (authData.user.user_metadata as any);

        if (!profile?.role) {
          setLoginError("Profil introuvable. Veuillez contacter l'administrateur.");
          await supabase.auth.signOut();
          return;
        }

        if (profile.status !== 'active') {
          const isDenied = profile.status === 'rejected';
          setLoginError(
            isDenied
              ? "Accès refusé : votre demande a été rejetée par le Directeur UCAR."
              : "Accès en attente : votre compte Staff Institut est en cours de validation par le Directeur UCAR."
          );
          await supabase.auth.signOut();
          return;
        }

        // Persist or clear remembered email
        if (rememberMe) {
          localStorage.setItem('savedEmail', trimmedEmail);
        } else {
          localStorage.removeItem('savedEmail');
        }

        const displayRole = Object.keys(ROLE_MAPPING).find(key => ROLE_MAPPING[key as keyof typeof ROLE_MAPPING] === profile.role) || profile.role;

        localStorage.setItem('userRole', displayRole);
        if (profile.institution_id) localStorage.setItem('userInstitution', profile.institution_id);

        const activeFunction = (role === 'Staff Institut' && jobTitle) ? jobTitle : profile.job_title;
        if (activeFunction) localStorage.setItem('userFunction', activeFunction);

        router.push('/dashboard');
      }
    } catch (error: any) {
      setLoginError(error.message || "Une erreur est survenue lors de l'authentification.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row w-full bg-background">
      {/* Left Side - Sign In Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md space-y-6">
          <FormHeader
            title={isRegistering ? "Créer un compte" : "UCAR Pulse"}
            subtitle={isRegistering ? "Rejoignez l'écosystème UCAR" : "Système d'Exploitation · Enseignement Supérieur"}
          />

          <Card className="p-6 sm:p-8 shadow-sm border-slate-100">
            {/* Role Tabs */}
            <div className="flex bg-slate-50 p-1 rounded-xl mb-6 border border-slate-100">
              {(['Staff Institut', 'Directeur Institut', 'Directeur UCAR'] as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 flex flex-col items-center py-3 rounded-lg transition-all ${role === r
                      ? 'bg-white text-primary shadow-sm scale-[1.02] font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  {r === 'Staff Institut' ? <GraduationCap size={18} className="mb-1" /> : r === 'Directeur Institut' ? <UserCircle2 size={18} className="mb-1" /> : <Shield size={18} className="mb-1" />}
                  <span className="text-[10px] uppercase tracking-wider text-center leading-tight">
                    {r === 'Staff Institut' ? 'Staff Institut' : r === 'Directeur Institut' ? 'Directeur Institut' : 'Directeur UCAR'}
                  </span>
                </button>
              ))}
            </div>

            {/* Role hint */}
            <div className="mb-6 px-4 py-3 bg-primary/5 border border-primary/10 rounded-xl flex items-start gap-2">
              <Info size={14} className="text-primary mt-0.5 flex-shrink-0" />
              <p className="text-xs text-primary/80 font-medium leading-relaxed">
                {role === 'Staff Institut'
                  ? 'Trésorier, Chef du Personnel, Scolarité ou Recherche — accès limité aux KPIs selon votre fonction.'
                  : role === 'Directeur Institut'
                    ? 'Directeur d\'établissement — vue complète de tous les KPIs de votre institution.'
                    : 'Directeur UCAR — vue consolidée sur les 30+ établissements du réseau.'}
              </p>
            </div>

            {authStatus === 'pending' && !isRegistering && role === 'Staff Institut' ? (
              <div className="mb-6 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2">
                <Info size={14} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                  Votre demande a été envoyée avec succès. En tant que Staff Institut, votre accès doit être approuvé par le Directeur de votre établissement. Vous recevrez une confirmation une fois votre compte activé.
                </p>
              </div>
            ) : null}

            {loginError ? (
              <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                <Info size={14} className="text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-800 font-medium leading-relaxed">
                  {loginError}
                </p>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-5">
              {isRegistering ? (
                <InputField
                  id="fullName"
                  type="text"
                  label="Nom et Prénom"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  icon={UserCircle2}
                  required
                />
              ) : null}

              {/* Staff role selection grid */}
              {isRegistering && role === 'Staff Institut' ? (
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Shield size={16} className="text-primary" />
                    Votre rôle administratif
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {STAFF_FUNCTIONS.map((fn) => (
                      <button
                        key={fn.value}
                        type="button"
                        onClick={() => setJobTitle(fn.value)}
                        className={`text-left p-3 rounded-lg border transition-all duration-200 ${jobTitle === fn.value
                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                            : 'border-border hover:border-primary/50 bg-card'
                          }`}
                      >
                        <p className="text-xs font-bold leading-tight">{fn.label}</p>
                        <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tighter">{fn.domain}</p>
                      </button>
                    ))}
                  </div>
                  {/* Hidden select for form validation if needed */}
                  <select
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="sr-only"
                    required
                  >
                    <option value="">Sélectionnez un rôle</option>
                    {STAFF_FUNCTIONS.map((fn) => (
                      <option key={fn.value} value={fn.value}>{fn.label}</option>
                    ))}
                  </select>
                </div>
              ) : null}

              {/* Institution dropdown — for Staff Institut and Directeur Institut */}
              {isRegistering && (role === 'Staff Institut' || role === 'Directeur Institut') ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Établissement</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <select
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      className="w-full h-11 pl-10 pr-10 rounded-md border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-300"
                      required
                    >
                      <option value="" disabled>
                        {loadingInstitutions ? "Chargement des établissements..." : "Sélectionnez votre établissement"}
                      </option>
                      {institutions.map((inst) => (
                        <option key={inst.id} value={inst.id}>{inst.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : null}

              <InputField
                id="email"
                type="email"
                label="Email professionnel"
                placeholder="nom@ucar.tn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Mail}
                required
              />

              <PasswordField
                id="password"
                label="Mot de passe"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                required
              />

              <div className="flex items-center justify-between text-sm py-1">
                <Checkbox
                  id="remember"
                  label="Se souvenir de moi"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                {!isRegistering ? <Link href="#">Mot de passe oublié ?</Link> : null}
              </div>

              <Button type="submit" variant="primary" fullWidth className="group">
                {isRegistering ? "Créer le compte" : "Se connecter"}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Button>


            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {isRegistering ? "Vous avez déjà un compte ?" : "Vous n'avez pas de compte ?"}
              {" "}
              <button
                type="button"
                onClick={() => {
                  import('react').then(React => {
                    React.startTransition(() => {
                      setIsRegistering(!isRegistering);
                      setLoginError("");
                    });
                  });
                }}
                className="text-primary hover:underline font-medium"
              >
                {isRegistering ? "Se connecter" : "Créer un compte"}
              </button>
            </p>
          </Card>

          <p className="text-center text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-8">
            UCAR Pulse · HACK4UCAR 2025 · ACM ENSTAB
          </p>
        </div>
      </div>

      {/* Right Side - Hero Section with Image Background */}
      <GradientBackground>
        <HeroSection
          title="Université Orientée Données"
          description="Accédez aux indicateurs clés de performance, gérez vos ressources et optimisez les processus administratifs en temps réel."
          showProgress
        />
      </GradientBackground>
    </div>
  );
};

export default SignIn;
