// Re-export commonly used icons from lucide-react
// This allows for easier imports and potential tree-shaking optimization

export {
  // Navigation
  Home,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Menu,
  X,
  MoreHorizontal,
  MoreVertical,
  
  // Actions
  Plus,
  Minus,
  Check,
  Copy,
  Download,
  Upload,
  Share,
  Share2,
  Edit,
  Edit2,
  Trash,
  Trash2,
  RefreshCw,
  RotateCcw,
  Search,
  Filter,
  Settings,
  Settings2,
  
  // Communication
  MessageSquare,
  MessageCircle,
  Send,
  Mail,
  Bell,
  BellRing,
  
  // User
  User,
  UserCircle,
  Users,
  LogIn,
  LogOut,
  
  // Finance
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Wallet,
  PiggyBank,
  BarChart,
  BarChart2,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Percent,
  
  // Status
  AlertCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  CheckCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Timer,
  Calendar,
  
  // Media
  Eye,
  EyeOff,
  Image,
  FileText,
  File,
  Folder,
  FolderOpen,
  
  // Layout
  Layout,
  LayoutDashboard,
  Grid,
  List,
  Columns,
  Rows,
  PanelLeft,
  PanelRight,
  PanelLeftClose,
  PanelRightClose,
  
  // Data
  Database,
  HardDrive,
  Cloud,
  Server,
  
  // Misc
  Sun,
  Moon,
  Star,
  Heart,
  Bookmark,
  Flag,
  Tag,
  Hash,
  Globe,
  Link,
  ExternalLink,
  Sparkles,
  Zap,
  Shield,
  ShieldCheck,
  Lock,
  Unlock,
  Key,
  
  // Loader
  Loader,
  Loader2,
} from 'lucide-react';

// Type for all icon names
export type IconName = 
  | 'Home' | 'ChevronLeft' | 'ChevronRight' | 'ChevronUp' | 'ChevronDown'
  | 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown'
  | 'Menu' | 'X' | 'MoreHorizontal' | 'MoreVertical'
  | 'Plus' | 'Minus' | 'Check' | 'Copy' | 'Download' | 'Upload' | 'Share'
  | 'Edit' | 'Trash' | 'RefreshCw' | 'Search' | 'Filter' | 'Settings'
  | 'MessageSquare' | 'Send' | 'Mail' | 'Bell'
  | 'User' | 'Users' | 'LogIn' | 'LogOut'
  | 'TrendingUp' | 'TrendingDown' | 'DollarSign' | 'Wallet' | 'BarChart' | 'LineChart' | 'PieChart'
  | 'AlertCircle' | 'AlertTriangle' | 'Info' | 'CheckCircle' | 'XCircle' | 'Clock'
  | 'Eye' | 'EyeOff' | 'FileText' | 'Folder'
  | 'LayoutDashboard' | 'Grid' | 'List'
  | 'Sun' | 'Moon' | 'Star' | 'Sparkles' | 'Loader2';
