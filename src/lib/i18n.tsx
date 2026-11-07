"use client";
import { createContext, useContext, useEffect, useState } from "react";

const en: Record<string, string> = {
  brand: "PROPERTYHUB",
  brandSub: "PREMIER",
  buy: "Buy",
  rent: "Rent",
  all: "All Properties",
  sell: "List Property",
  favorites: "Favorites",
  dashboard: "Dashboard",
  logout: "Logout",
  login: "Sign In",
  admin: "Admin Console",
  lang: "اردو",

  // Hero & Showcase
  h1: "Architectural Excellence",
  h2: "Redefined Luxury Residences.",
  sub: "Experience an exclusive collection of luxury villas, penthouses, and prime commercial estates across Pakistan with interactive 3D and intelligent AI guidance.",
  exploreNow: "Explore Estates",
  bookConsultation: "Book VIP Viewing",
  exterior: "Exterior",
  amenities: "Amenities",
  residences: "Residences",
  location: "Locations",
  viewProject: "View Estate",
  showMore: "Explore Feature",
  infinityPool: "Heated Infinity Pool",
  skyLounge: "Skyline Lounge",
  oceanfrontViews: "Panoramic Vista",
  degreesView: "270° Panoramic Views",

  // Search & Filters
  searchPlaceholder: "Search city, society or project (e.g. DHA Phase 6, Clifton, F-7)...",
  allTypes: "All Property Types",
  allCities: "All Cities",
  buyRent: "Buy & Rent",
  filter: "Filter Properties",
  clearFilters: "Reset Filters",
  props: "exclusive properties found",
  none: "No properties match your current criteria. Try adjusting your filters or ask our AI Concierge.",
  prev: "Previous",
  next: "Next",
  page: "Page",
  priceRange: "Price Range",
  budget: "Budget (PKR)",
  minP: "Min Price",
  maxP: "Max Price",
  bedrooms: "Bedrooms",
  baths: "Bathrooms",
  anyBeds: "Any Bedrooms",
  anyBaths: "Any Bathrooms",
  minSize: "Min Size (sqft)",
  sortL: "Sort By",
  sortNew: "Newest Additions",
  sortLow: "Price: Low to High",
  sortHigh: "Price: High to Low",

  // Property Details & Cards
  forSale: "For Sale",
  forRent: "For Rent",
  perMonth: "/month",
  beds: "Beds",
  sqft: "sqft",
  marla: "Marla",
  kanal: "Kanal",
  pendingNote: "Pending Admin Approval — Visible only to you",
  save: "Save to Wishlist",
  saved: "Saved to Wishlist",
  share: "Share Property",
  copied: "Link copied to clipboard",
  related: "Similar Premier Properties",
  specifications: "Property Specifications",
  verifiedListing: "Verified PropertyHub Listing",

  // Calculators & Tools
  tools: "Tools & Calculators",
  toolsSub: "Pakistani real estate engineering, land conversion, and mortgage financing tools.",
  priceCalc: "Property Price & Land Calculator",
  areaConverter: "Land Measurement Converter",
  constructionCalc: "Construction Cost Estimator",
  mortgageCalc: "Home Finance & EMI Simulator",
  areaL: "Area Size",
  unitL: "Measurement Unit",
  rateL: "Rate per Unit (PKR)",
  totalL: "Estimated Property Value",
  perSqft: "Price per Sq. Ft.",
  marlaStandard: "Regional Marla Convention",
  marlaNote: "Marla size is configurable: LDA & Lahore standard (225 sqft), CDA & Bahria (250 sqft), or Board of Revenue (272.25 sqft).",
  down: "Down Payment %",
  interest: "Bank Profit / Interest Rate %",
  years: "Loan Tenure (Years)",
  monthly: "Estimated Monthly Installment",
  loanAmount: "Total Loan Amount",
  totalInterest: "Total Markup / Profit Payable",
  totalPayable: "Total Payment Over Tenure",
  disclaimer: "Estimates only. Actual financing terms, taxes, and valuations are subject to bank approval and current KIBOR rates.",

  // Contact & Inquiries
  yourName: "Your Full Name",
  phone: "Phone / WhatsApp",
  msgOpt: "Message or preferred viewing time",
  contact: "Schedule Private Tour / Inquire",
  thanks: "Inquiry received. A senior PropertyHub portfolio manager will contact you shortly.",
  myInquiries: "Inquiries Received",

  // Auth & Account
  welcome: "Welcome to PropertyHub Premier",
  create: "Create a Premier Account",
  email: "Email Address",
  password: "Password",
  signup: "Create Account",
  newHere: "New to PropertyHub? Create an account",
  haveAcc: "Already have an account? Sign In",
  profile: "Profile & Account",
  fullName: "Full Name",
  saveBtn: "Save Changes",
  profileSaved: "Profile updated successfully.",
  forgot: "Forgot your password?",
  sendLink: "Send Reset Link",
  linkSent: "Check your email for password reset instructions.",
  newPass: "New Password",
  updatePass: "Update Password",
  passUpdated: "Password updated. Redirecting to dashboard...",

  // Listing Management
  listTitle: "Publish an Exclusive Listing",
  titleF: "Property Title",
  desc: "Property Description & Highlights",
  area: "Locality / Sector (e.g. DHA Phase 5)",
  price: "Price (PKR)",
  size: "Total Area (sqft)",
  publish: "Submit for Verification",
  saving: "Saving Listing...",
  myListings: "My Managed Listings",
  newListing: "+ Add New Property",
  del: "Delete",
  edit: "Edit Details",
  closeL: "Mark as Sold / Close",
  reopen: "Reactivate Listing",
  confirmDel: "Permanently remove this property from the marketplace?",
  editNote: "Updating details will re-submit this listing for admin quality verification.",
  noListings: "You have not listed any properties yet.",
  yourFav: "Saved Premier Estates",
  nothingSaved: "You haven't saved any properties to your wishlist yet.",
  photos: "Gallery & Photos",
  uploadPhotos: "Upload High-Resolution Photos",
  uploading: "Uploading",
  coverL: "Primary Cover",
  setCover: "Make Cover",
  maxImgs: "Maximum 8 high-resolution photos allowed per listing.",
  badType: "Allowed formats: JPG, PNG, or WebP.",
  tooBig: "File size exceeds the 5 MB limit.",

  // Home Sections & Trust
  commercial: "Commercial Hubs",
  browseBy: "Curated Architectural Collections",
  popular: "Prestigious Destinations Across Pakistan",
  sayings: "Verified Client Experiences",
  why: "The PropertyHub Premier Distinction",
  why1: "Vetted & Authenticated Listings",
  why1d: "Every property undergoes rigorous verification of deeds, registry, and location by our compliance team.",
  why2: "AI-Powered Real Estate Concierge",
  why2d: "Describe your dream estate in plain English or Urdu and let our neural search find verified matches.",
  why3: "Precision Engineering Calculators",
  why3d: "Regional Marla/Kanal land converters, construction estimates, and bank-grade EMI simulations.",
  cta: "Looking to Market an Exceptional Architectural Estate?",
  ctaBtn: "List Your Property with Premier",
  footerTag: "Pakistan's premier marketplace for luxury estates, penthouses, and prime commercial investments.",
  ai: "AI Property Concierge",
  close: "Close",
  ask: "Ask about properties, areas, prices (e.g., 10 marla house in DHA Lahore under 4 crore)...",
  send: "Send",
  mapNote: "Approximate geolocation. Exact coordinates shared upon appointment.",
};

const ur: Record<string, string> = {
  brand: "پراپرٹی ہب",
  brandSub: "پریمیئر",
  buy: "خریدیں",
  rent: "کرائے پر",
  all: "تمام پراپرٹیز",
  sell: "پراپرٹی لسٹ کریں",
  favorites: "پسندیدہ",
  dashboard: "ڈیش بورڈ",
  logout: "لاگ آؤٹ",
  login: "لاگ اِن",
  admin: "ایڈمن پینل",
  lang: "English",

  // Hero & Showcase
  h1: "معماری کا شاہکار",
  h2: "پرتعیش رہائش کا نیا معیار۔",
  sub: "پاکستان بھر میں شاندار ولاز، پینٹ ہاؤسز اور اعلیٰ کمرشل جائیدادیں۔ تھری ڈی ویژولائزیشن اور اے آئی رہنمائی کے ساتھ۔",
  exploreNow: "پراپرٹیز دیکھیں",
  bookConsultation: "وی آئی پی وزٹ بک کریں",
  exterior: "بیرونی منظر",
  amenities: "سہولیات",
  residences: "رہائش گاہیں",
  location: "مواقع",
  viewProject: "پروجیکٹ دیکھیں",
  showMore: "مزید تفصیلات",
  infinityPool: "انفینٹی پول",
  skyLounge: "اسکائی لاؤنج",
  oceanfrontViews: "قدرتی نظارہ",
  degreesView: "270 ڈگری وسیع نظارہ",

  // Search & Filters
  searchPlaceholder: "شہر، سوسائٹی یا سیکٹر تلاش کریں (مثلاً ڈی ایچ اے فیز 6، کلفٹن، ایف-7)...",
  allTypes: "تمام اقسام",
  allCities: "تمام شہر",
  buyRent: "خرید و کرایہ",
  filter: "فلٹر لگائیں",
  clearFilters: "فلٹر صاف کریں",
  props: "شاندار پراپرٹیز دستیاب ہیں",
  none: "آپ کے مطلوبہ معیار کے مطابق کوئی پراپرٹی نہیں ملی۔ فلٹرز تبدیل کر کے دیکھیں یا اے آئی سے رہنمائی لیں۔",
  prev: "پچھلا",
  next: "اگلا",
  page: "صفحہ",
  priceRange: "قیمت کی حد",
  budget: "بجٹ (پاکستانی روپے)",
  minP: "کم از کم قیمت",
  maxP: "زیادہ سے زیادہ قیمت",
  bedrooms: "بیڈ رومز",
  baths: "باتھ رومز",
  anyBeds: "کوئی بھی بیڈ",
  anyBaths: "کوئی بھی باتھ",
  minSize: "کم از کم رقبہ (مربع فٹ)",
  sortL: "ترتیب دیں",
  sortNew: "تازہ ترین",
  sortLow: "قیمت: کم سے زیادہ",
  sortHigh: "قیمت: زیادہ سے کم",

  // Property Details & Cards
  forSale: "برائے فروخت",
  forRent: "برائے کرایہ",
  perMonth: "/ماہانہ",
  beds: "بیڈ",
  sqft: "مربع فٹ",
  marla: "مرلہ",
  kanal: "کنال",
  pendingNote: "ایڈمن کی تصدیق کا انتظار ہے — صرف آپ دیکھ سکتے ہیں",
  save: "محفوظ کریں",
  saved: "محفوظ کر لیا گیا",
  share: "شیئر کریں",
  copied: "لنک کاپی ہو گیا ہے",
  related: "ملتی جلتی پریمیئر پراپرٹیز",
  specifications: "پراپرٹی کی تفصیلات",
  verifiedListing: "تصدیق شدہ پراپرٹی ہب لسٹنگ",

  // Calculators & Tools
  tools: "ٹولز اور کیلکولیٹرز",
  toolsSub: "پاکستانی ریئل اسٹیٹ پیمائش، اراضی کنورٹر، اور بینک قسط کیلکولیٹرز۔",
  priceCalc: "پراپرٹی قیمت اور رقبہ کیلکولیٹر",
  areaConverter: "اراضی پیمائش کنورٹر",
  constructionCalc: "تعمیراتی لاگت کا تخمینہ",
  mortgageCalc: "ہوم فنانس اور قسط کیلکولیٹر",
  areaL: "رقبہ",
  unitL: "اکائی",
  rateL: "ریٹ فی اکائی (روپے)",
  totalL: "اندازاً کل مالیت",
  perSqft: "فی مربع فٹ قیمت",
  marlaStandard: "علاقائی مرلہ پیمائش",
  marlaNote: "مرلہ سائز منتخب کریں: ایل ڈی اے و لاہور (225 مربع فٹ)، سی ڈی اے و بحریہ (250 مربع فٹ)، یا بورڈ آف ریونیو (272.25 مربع فٹ)۔",
  down: "ڈاؤن پیمنٹ %",
  interest: "بینک منافع / سود کی شرح %",
  years: "مدت (سال)",
  monthly: "ماہانہ قسط",
  loanAmount: "کل لون رقم",
  totalInterest: "کل اضافی منافع",
  totalPayable: "مدت میں کل قابلِ ادائیگی رقم",
  disclaimer: "یہ صرف تخمینہ ہے۔ اصل فنانسنگ، ٹیکس اور بینک کی شرائط موجودہ کائبور ریٹ کے مطابق ہوں گی۔",

  // Contact & Inquiries
  yourName: "آپ کا پورا نام",
  phone: "فون نمبر / واٹس ایپ",
  msgOpt: "پیغام یا معائنے کا مناسب وقت",
  contact: "نجی وزٹ شیڈول کریں",
  thanks: "آپ کی درخواست موصول ہو گئی۔ ہمارے پورٹ فولیو مینیجر جلد رابطہ کریں گے۔",
  myInquiries: "موصول شدہ انکوائریز",

  // Auth & Account
  welcome: "پراپرٹی ہب پریمیئر میں خوش آمدید",
  create: "نیا اکاؤنٹ بنائیں",
  email: "ای میل ایڈریس",
  password: "پاس ورڈ",
  signup: "اکاؤنٹ بنائیں",
  newHere: "نئے ہیں؟ سائن اپ کریں",
  haveAcc: "پہلے سے اکاؤنٹ ہے؟ لاگ اِن کریں",
  profile: "پروفائل اور سیٹنگز",
  fullName: "پورا نام",
  saveBtn: "تبدیلیاں محفوظ کریں",
  profileSaved: "پروفائل کامیابی سے اپڈیٹ ہو گیا۔",
  forgot: "پاس ورڈ بھول گئے؟",
  sendLink: "ری سیٹ لنک بھیجیں",
  linkSent: "پاس ورڈ ری سیٹ کے لیے اپنی ای میل چیک کریں۔",
  newPass: "نیا پاس ورڈ",
  updatePass: "پاس ورڈ تبدیل کریں",
  passUpdated: "پاس ورڈ تبدیل ہو گیا۔ ڈیش بورڈ پر منتقل کیا جا رہا ہے...",

  // Listing Management
  listTitle: "نئی پراپرٹی لسٹ کریں",
  titleF: "پراپرٹی کا عنوان",
  desc: "تفصیل اور اہم خصوصیات",
  area: "علاقہ یا فیز (مثلاً ڈی ایچ اے فیز 5)",
  price: "قیمت (روپے)",
  size: "کل رقبہ (مربع فٹ)",
  publish: "تصدیق کے لیے جمع کروائیں",
  saving: "محفوظ ہو رہا ہے...",
  myListings: "میری لسٹنگز",
  newListing: "+ نئی پراپرٹی شامل کریں",
  del: "حذف کریں",
  edit: "ترمیم کریں",
  closeL: "لسٹنگ بند کریں",
  reopen: "دوبارہ کھولیں",
  confirmDel: "کیا آپ واقعی اس پراپرٹی کو مارکیٹ سے حذف کرنا چاہتے ہیں؟",
  editNote: "تبدیلیوں کے بعد لسٹنگ دوبارہ تصدیق کے لیے جائے گی۔",
  noListings: "آپ نے ابھی تک کوئی پراپرٹی لسٹ نہیں کی۔",
  yourFav: "محفوظ کردہ پراپرٹیز",
  nothingSaved: "آپ کی محفوظ کردہ لسٹ خالی ہے۔",
  photos: "تصاویر اور گیلری",
  uploadPhotos: "اعلیٰ معیار کی تصاویر اپلوڈ کریں",
  uploading: "اپلوڈ ہو رہی ہیں",
  coverL: "مین کور تصویر",
  setCover: "کور تصویر بنائیں",
  maxImgs: "ہر لسٹنگ میں زیادہ سے زیادہ 8 تصاویر کی اجازت ہے۔",
  badType: "صرف JPG، PNG یا WebP تصاویر کی اجازت ہے۔",
  tooBig: "فائل کا سائز 5 ایم بی سے کم ہونا چاہیے۔",

  // Home Sections & Trust
  commercial: "کمرشل ہبس",
  browseBy: "منتخب کردہ تعمیراتی مجموعے",
  popular: "پاکستان کے اہم اور پروقار مقامات",
  sayings: "ہمارے معزز صارفین کی آراء",
  why: "پراپرٹی ہب پریمیئر کے فوائد",
  why1: "مکمل جانچ شدہ لسٹنگز",
  why1d: "ہر پراپرٹی کی رجسٹری، دستاویزات اور مقام کی انتظامیہ مکمل تصدیق کرتی ہے۔",
  why2: "ذہین اے آئی پراپرٹی اسسٹنٹ",
  why2d: "اپنی پسندیدہ پراپرٹی کا تذکرہ اردو یا انگریزی میں کریں، ہمارا اسسٹنٹ فوراً مدد کرے گا۔",
  why3: "درست پیمائش اور مالیاتی ٹولز",
  why3d: "علاقائی مرلہ و کنال کنورٹرز، تعمیراتی لاگت اور بینک اقساط کا حساب کتاب۔",
  cta: "کیا آپ کسی شاہکار پراپرٹی کو فروخت یا کرایہ پر دینا چاہتے ہیں؟",
  ctaBtn: "پریمیئر پر لسٹ کریں",
  footerTag: "پاکستان کا پریمیئر ریئل اسٹیٹ پلیٹ فارم برائے لگژری ولاز، پینٹ ہاؤسز اور کمرشل اثاثہ جات۔",
  ai: "اے آئی کونسیرج",
  close: "بند کریں",
  ask: "پراپرٹی، مقام یا قیمت کے بارے میں کچھ بھی پوچھیں (مثلاً لاہور ڈی ایچ اے میں 10 مرلہ گھر 4 کروڑ میں)...",
  send: "ارسال کریں",
  mapNote: "تقریباً لوکیشن۔ نجی وزٹ پر حتمی ایڈریس فراہم کیا جائے گا۔",
};

const dict = { en, ur };
type Lang = "en" | "ur";

interface LangContextType {
  lang: Lang;
  t: (k: string) => string;
  toggle: () => void;
  isUrdu: boolean;
}

const Ctx = createContext<LangContextType>({
  lang: "en",
  t: (k) => en[k] ?? k,
  toggle: () => {},
  isUrdu: false,
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("propertyhub_lang") as Lang | null;
      if (stored === "ur" || stored === "en") setLang(stored);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.dir = lang === "ur" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    try {
      localStorage.setItem("propertyhub_lang", lang);
    } catch {}
  }, [lang]);

  return (
    <Ctx.Provider
      value={{
        lang,
        t: (k) => dict[lang][k] ?? en[k] ?? k,
        toggle: () => setLang((prev) => (prev === "en" ? "ur" : "en")),
        isUrdu: lang === "ur",
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useLang = () => useContext(Ctx);
