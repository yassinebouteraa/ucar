"use client"

import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, LucideIcon, Shield, GraduationCap, UserCircle2, Info, ArrowRight, Briefcase } from "lucide-react";
import { useRouter, useSearchParams } from 'next/navigation';

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
    <div className="bg-primary mx-auto w-16 h-16 rounded-2xl flex items-center justify-center text-primary-foreground font-black text-2xl shadow-xl shadow-primary/20 mb-6">
      UC
    </div>
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
          <img src="/logo.png" alt="Logo UCAR" className="h-16 w-auto object-contain" />
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

type Role = 'Institution' | 'UCAR' | 'Président';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [role, setRole] = useState<Role>('Institution');
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isRegistering, setIsRegistering] = useState(searchParams?.get("register") === "true");
  const [authStatus, setAuthStatus] = useState<'idle' | 'pending'>('idle');
  const [loginError, setLoginError] = useState("");
  const [fullName, setFullName] = useState("");
  const [institution, setInstitution] = useState("");
  const [jobTitle, setJobTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (isRegistering) {
      // Simulate account creation
      setAuthStatus('pending');
      setIsRegistering(false);
      setEmail("");
      setPassword("");
      setFullName("");
      setInstitution("");
      setJobTitle("");
    } else {
      if (authStatus === 'pending') {
        setLoginError("Accès refusé : Votre compte est en attente de vérification et d'autorisation par le Président.");
        return;
      }
      localStorage.setItem('userRole', role);
      router.push('/dashboard');
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
              {(['Institution', 'UCAR', 'Président'] as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 flex flex-col items-center py-3 rounded-lg transition-all ${
                    role === r
                      ? 'bg-white text-primary shadow-sm scale-[1.02] font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {r === 'Institution' ? <GraduationCap size={18} className="mb-1" /> : r === 'UCAR' ? <Shield size={18} className="mb-1" /> : <UserCircle2 size={18} className="mb-1" />}
                  <span className="text-[10px] uppercase tracking-wider">{r === 'Institution' ? 'Staff' : r === 'UCAR' ? 'Admin' : 'Président'}</span>
                </button>
              ))}
            </div>

            {/* Role hint */}
            <div className="mb-6 px-4 py-3 bg-primary/5 border border-primary/10 rounded-xl flex items-start gap-2">
              <Info size={14} className="text-primary mt-0.5 flex-shrink-0" />
              <p className="text-xs text-primary/80 font-medium leading-relaxed">
                {role === 'Institution'
                  ? 'Trésorier, Chef Personnel, Scolarité ou Recherche — accès limité aux KPIs de votre institution.'
                  : role === 'UCAR'
                    ? 'Présidente, Vice-Président ou SG — vue consolidée sur les 30+ établissements.'
                    : 'Président d\'institution — consulte tous les KPIs de son établissement.'}
              </p>
            </div>

            {authStatus === 'pending' && !isRegistering && (
              <div className="mb-6 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2">
                <Info size={14} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                  Votre demande a été envoyée avec succès. Vous devez attendre la vérification et l'autorisation du Président pour vous connecter.
                </p>
              </div>
            )}

            {loginError && (
              <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                <Info size={14} className="text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-800 font-medium leading-relaxed">
                  {loginError}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {isRegistering && (
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
              )}
              {isRegistering && (
                <InputField
                  id="jobTitle"
                  type="text"
                  label="Poste / Fonction"
                  placeholder="ex: Trésorier, Directeur..."
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  icon={Briefcase}
                  required
                />
              )}
              {isRegistering && (role === 'Institution' || role === 'Président') && (
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
                      <option value="" disabled>Sélectionnez votre établissement</option>
                      <option value="ENSTAB">ENSTAB</option>
                      <option value="ENICarthage">ENICarthage</option>
                      <option value="SUP'COM">SUP'COM</option>
                      <option value="IHEC Carthage">IHEC Carthage</option>
                      <option value="ISG Tunis">ISG Tunis</option>
                      <option value="FSB">FSB</option>
                      <option value="INAT">INAT</option>
                      <option value="Autre">Autre Établissement UCAR</option>
                    </select>
                  </div>
                </div>
              )}
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
                {!isRegistering && <Link href="#">Mot de passe oublié ?</Link>}
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
                  setIsRegistering(!isRegistering);
                  setLoginError("");
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
