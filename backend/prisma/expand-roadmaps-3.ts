import * as fs from 'fs';
import * as path from 'path';

const roadmapsDir = path.join(__dirname, 'data', 'roadmaps');

function expandRoadmap(filename: string, newNodes: any[]) {
  const filePath = path.join(roadmapsDir, filename);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const existingIds = new Set(data.nodes.map((n: any) => n.id));
  
  for (const node of newNodes) {
    if (!existingIds.has(node.id)) {
      data.nodes.push(node);
      existingIds.add(node.id);
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`Updated ${filename}: total ${data.nodes.length} nodes`);
}

// 5. MOTION GRAPHIC DESIGNER (15 -> 30)
const mgAdditions = [
  {
    id: "mg-16",
    title: "موشن برای UI و میکروانیمیشن‌های تعاملی با Lottie",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "خروجی گرفتن انیمیشن‌های سبک و برداری در افترافکت با پلاگین Bodymovin برای وب اجوکاد.",
    resources: [{ title: "LottieFiles Official Docs", url: "https://airbnb.io/lottie/", type: "LINK" }],
    task: "یک آیکون لایک و تیک تایید متحرک را با لاتی خروجی گرفته و در اجوکاد پیاده‌سازی کنید.",
    prerequisites: ["mg-8"]
  },
  {
    id: "mg-17",
    title: "شبیه‌سازی ذرات و پارتیکل‌ها (Particle Simulation)",
    level: "خوب-است-بدانی",
    tier: "حرفه‌ای",
    description: "استفاده از Trapcode Particular و ذرات نوری برای تیزرهای هیجان‌انگیز رویدادهای رکاد.",
    resources: [{ title: "Red Giant Particular Tutorials", url: "https://www.maxon.net/", type: "LINK" }],
    task: "ایجاد افکت آتش‌بازی و ذرات طلایی برای تیزر اعلام برندگان مسابقه استارتاپی کافه.",
    prerequisites: ["mg-10"]
  },
  {
    id: "mg-18",
    title: "انیمیشن متنی پیشرفته و تایپوگرافی جنبشی (Kinetic Typography)",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "تطابق ریتمیک فونت‌های فارسی با صدای گوینده در ریلزهای آموزشی رکاد.",
    resources: [{ title: "Motion Design School: Kinetic Typography", url: "https://motiondesign.school/", type: "LINK" }],
    task: "تولید یک موشن ۳۰ ثانیه‌ای از سخنان یک کارآفرین مهمان در کافه رکاد با تایپوگرافی متحرک.",
    prerequisites: ["mg-4"]
  },
  {
    id: "mg-19",
    title: "ترکینگ تصویر و موشن در ویدیو (Motion Tracking & VFX)",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "ردیابی دوربین (3D Camera Tracker) و جایگذاری المان‌های گرافیکی روی میز کافه یا صحنه رویداد.",
    resources: [{ title: "Adobe After Effects: Camera Tracking", url: "https://helpx.adobe.com/after-effects/using/tracking-stabilizing-motion-cs5.html", type: "LINK" }],
    task: "تراژکتوری و استیکر قیمت دیجیتال را روی فنجان قهوه در حال حرکت در فضای کافه ترک کنید.",
    prerequisites: ["mg-6"]
  },
  {
    id: "mg-20",
    title: "انیمیشن کاراکتر با Duik Bassel یا Limber",
    level: "خوب-است-بدانی",
    tier: "حرفه‌ای",
    description: "ریگ‌بندی استخوان‌بندی و انیمیت کاراکترهای راهنمای دانش‌آموزان رکاد.",
    resources: [{ title: "RxLaboratory: Duik Bassel Guide", url: "https://rxlaboratory.org/tools/duik/", type: "LINK" }],
    task: "ریگ و ایجاد سیکل راه رفتن (Walk Cycle) برای کاراکتر دانش‌آموز هنرستان استارتاپی.",
    prerequisites: ["mg-12"]
  },
  {
    id: "mg-21",
    title: "طراحی و انیمیت اینفوگرافیک‌های ویدیویی",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "انیمیت نمودارهای دایره‌ای، آمارهای درصد رشد و گراف‌های تحلیلی پلتفرم اجوکاد.",
    resources: [{ title: "School of Motion: Infographic Animation", url: "https://www.schoolofmotion.com/", type: "LINK" }],
    task: "یک موشن آماری از پیشرفت مهارت‌های باشگاه محصول در سال گذشته تولید کنید.",
    prerequisites: ["mg-5"]
  },
  {
    id: "mg-22",
    title: "ورود به دنیای سه‌بعدی با Cinema 4D / Blender",
    level: "خوب-است-بدانی",
    tier: "حرفه‌ای",
    description: "مدلسازی اشیای ساده، متریال‌دهی و انیمیت دوربین سه‌بعدی برای تیزرهای بزرگ.",
    resources: [{ title: "Blender Fundamentals", url: "https://www.blender.org/support/tutorials/", type: "LINK" }],
    task: "مدلسازی و چرخش سه‌بعدی لوگوی برجسته رکاد برای اوپنر برنامه‌های ویدیویی.",
    prerequisites: ["mg-9"]
  },
  {
    id: "mg-23",
    title: "طراحی صدا و سان‌افکت‌های حرکتی (Motion Sound Design)",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "انتخاب ساند افکت‌های وووش (Whoosh)، کلیک و ضربه‌های موزیک برای هماهنگی با هر ترنزیشن.",
    resources: [{ title: "Freesound Project Library", url: "https://freesound.org/", type: "LINK" }],
    task: "صداگذاری کامل یک موشن گرافیک ۴۵ ثانیه‌ای از رویداد کافه رکاد با افکت‌های صوتی دقیق.",
    prerequisites: ["mg-11"]
  },
  {
    id: "mg-24",
    title: "انیمیشن استاپ‌موشن و فریم‌به‌فریم (Frame-by-Frame)",
    level: "خوب-است-بدانی",
    tier: "حرفه‌ای",
    description: "استفاده از اصول سنتی ۲۴ فریم در ثانیه برای ساخت انیمیشن‌های دست‌ساز و خلاقانه.",
    resources: [{ title: "Animator's Survival Kit", url: "https://www.theanimatorssurvivalkit.com/", type: "LINK" }],
    task: "طراحی یک انیمیشن فریم‌به‌فریم ۱۲ فریم با افکت دود قهوه برای ریلز اینستاگرام کافه.",
    prerequisites: ["mg-3"]
  },
  {
    id: "mg-25",
    title: "اسکریپت‌نویسی پیشرفته در افترافکت با Expressions",
    level: "ضروری",
    tier: "مربی",
    description: "فرمول‌های ریاضی برای پرش فنری، انیمیشن‌های خودکار و کنترلرهای پیشرفته بدون کی‌فریم.",
    resources: [{ title: "Dan Ebberts After Effects Expressions", url: "https://www.motionscript.com/", type: "LINK" }],
    task: "ساخت یک کنترلر هوشمند که با تغییر متن، کادر پس‌زمینه به طور خودکار تغییر اندازه دهد.",
    prerequisites: ["mg-7"]
  },
  {
    id: "mg-26",
    title: "طراحی پکیج هویت بصری متحرک تلویزیونی و استیج",
    level: "ضروری",
    tier: "مربی",
    description: "ساخت بسته کامل گرافیک متحرک شامل زیرنویس (Lower Third)، بک‌گراند لوپ و استینگر.",
    resources: [{ title: "Broadcast Package Design Guide", url: "https://www.artofthetitle.com/", type: "LINK" }],
    task: "طراحی بسته کامل گرافیک مانیتورهای استیج و پخش زنده همایش سالانه رکاد.",
    prerequisites: ["mg-13"]
  },
  {
    id: "mg-27",
    title: "رندرینگ بهینه و مدیریت پایپ‌لاین موشن با Media Encoder",
    level: "ضروری",
    tier: "مربی",
    description: "کدک‌های ProRes و H.264، انکودینگ سریع و مدیریت رندرفارم برای پروژه‌های سنگین.",
    resources: [{ title: "Adobe Media Encoder Guide", url: "https://helpx.adobe.com/media-encoder/using/overview.html", type: "LINK" }],
    task: "بهینه‌سازی تنظیمات رندر برای کاهش حجم ویدیوها بدون افت کیفیت برای انتشار در شبکه‌های اجتماعی.",
    prerequisites: ["mg-1"]
  },
  {
    id: "mg-28",
    title: "نورپردازی، کامپوزیت و اصلاح رنگ موشن (Compositing)",
    level: "خوب-است-بدانی",
    tier: "مربی",
    description: "افزودن بلوم، سایه‌های واقع‌گرایانه، گلو (Glow) و یکدست کردن لایه‌های موشن.",
    resources: [{ title: "Video Copilot Tutorials", url: "https://www.videocopilot.net/tutorials/", type: "LINK" }],
    task: "کامپوزیت لایه‌های سه‌بعدی و دوبعدی با تنظیمات نورپردازی طبیعی در تیزر افتتاحیه کافه.",
    prerequisites: ["mg-10"]
  },
  {
    id: "mg-29",
    title: "کارگردانی هنری موشن و سناریونویسی استوری‌بورد",
    level: "ضروری",
    tier: "مربی",
    description: "تبدیل ایده‌های خام به استوری‌بورد تصویری، تعیین ریتم و مدیریت تیم انیماتورها.",
    resources: [{ title: "Storyboard That Guide", url: "https://www.storyboardthat.com/", type: "LINK" }],
    task: "ترسیم استوری‌بورد ۶ فریمی برای ویدیوی معرفی اپلیکیشن منوی دیجیتال کافه کارآفرینی.",
    prerequisites: ["mg-2"]
  },
  {
    id: "mg-30",
    title: "تولید تیزر جامع ۳۶۰ درجه کمپین‌های تبلیغاتی رکاد",
    level: "ضروری",
    tier: "مربی",
    description: "یکپارچه‌سازی تمام تکنیک‌ها در یک تیزر ۶۰ ثانیه‌ای سطح اول برای معرفی ثبت‌نام هنرستان.",
    resources: [{ title: "Motion Design Awards Showcase", url: "https://www.motiondesignawards.com/", type: "LINK" }],
    task: "تولید تیزر رسمی کمپین جذب استعدادهای هنرستان استارتاپی رکاد با بالاترین استانداردهای بصری.",
    prerequisites: ["mg-15", "mg-26", "mg-29"]
  }
];

// 6. VIDEO EDITOR & VIDEOGRAPHER (15 -> 30)
const veAdditions = [
  {
    id: "ve-16",
    title: "اصلاح رنگ حرفه‌ای با DaVinci Resolve (Color Grading)",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "کار با Color Wheels، منحنی‌ها (Curves) و تنظیم ظاهر سینمایی رویدادهای رکاد.",
    resources: [{ title: "Blackmagic Design DaVinci Resolve Training", url: "https://www.blackmagicdesign.com/products/davinciresolve/training", type: "LINK" }],
    task: "اصلاح رنگ و ساخت لوک گرم کافه‌ای برای یک کلیپ یک‌دقیقه‌ای از کافه کارآفرینی.",
    prerequisites: ["ve-7"]
  },
  {
    id: "ve-17",
    title: "تنظیم تخصصی صدا و حذف نویز با Adobe Audition",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "حذف نویز پس‌زمینه صدای مصاحبه‌ها، اکولایزر (EQ) و مسترینگ صدا برای پادکست و ریلز.",
    resources: [{ title: "Adobe Audition Audio Cleaning Guide", url: "https://helpx.adobe.com/audition/using/noise-reduction-restoration-effects.html", type: "LINK" }],
    task: "حذف نویز صدای محیط کافه از مصاحبه با سخنران رویداد با ادوبی ادیشن.",
    prerequisites: ["ve-6"]
  },
  {
    id: "ve-18",
    title: "تدوین چند دوربینه (Multi-Camera Editing)",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "سینک کردن خودکار صدا و تصویر چند دوربین همزمان در سخنرانی‌ها و پنل‌های رکاد.",
    resources: [{ title: "Premiere Pro Multi-Cam Guide", url: "https://helpx.adobe.com/premiere-pro/using/create-multi-camera-source-sequence.html", type: "LINK" }],
    task: "تدوین یک پنل گفتگوی ۳ دوربینه از کارگاه‌های کافه کارآفرینی به صورت مالتی‌کم.",
    prerequisites: ["ve-4"]
  },
  {
    id: "ve-19",
    title: "فیلمبرداری مصاحبه و نورپردازی پرتره (Interview Lighting)",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "تکنیک‌های نورپردازی سه‌نقطه‌ای (Key, Fill, Rim) در استودیو و محیط کافه.",
    resources: [{ title: "Aputure Lighting Academy", url: "https://www.aputure.com/", type: "LINK" }],
    task: "برپایی ست نورپردازی مصاحبه در کافه و ضبط گفتگوی اختصاصی با یکی از دانش‌آموزان موفق.",
    prerequisites: ["ve-2"]
  },
  {
    id: "ve-20",
    title: "تدوین ریتمیک ریلزهای پربازدید (Fast-Paced Reels Editing)",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "کات‌های سریع همگام با ضرب‌آهنگ موسیقی، افکت‌های صوتی ترنزیشن و قلاب در ۳ ثانیه اول.",
    resources: [{ title: "Instagram Creators Video Guide", url: "https://creators.instagram.com/", type: "LINK" }],
    task: "تدوین یک ریلز اینستاگرامی پرانرژی ۳۰ ثانیه‌ای از حواشی پرشور روز رویداد رکاد.",
    prerequisites: ["ve-5"]
  },
  {
    id: "ve-21",
    title: "فیلمبرداری حرکتی با گیمبال و رونین (Gimbal Movements)",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "بالانس کردن دوربین، حرکات تعقیبی (Follow) و چرخش‌های نرم در میان جمعیت.",
    resources: [{ title: "DJI Ronin Tutorial Series", url: "https://www.dji.com/support", type: "LINK" }],
    task: "تصویربرداری پویا و بدون لرزش با گیمبال از ورود تماشاگران و تعاملات کافه.",
    prerequisites: ["ve-1"]
  },
  {
    id: "ve-22",
    title: "مستندسازی رویداد و ساخت افترمووی (Event Aftermovie)",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "ترکیب نماهای احساسی، موسیقی حماسی و صدای محیط برای ثبت حس و حال گردهمایی‌ها.",
    resources: [{ title: "Filmmaker IQ: Event Coverage", url: "https://filmmakeriq.com/", type: "LINK" }],
    task: "تولید افترمووی دو دقیقه‌ای از اختتامیه دوره شتابدهی هنرستان رکاد.",
    prerequisites: ["ve-18", "ve-16"]
  },
  {
    id: "ve-23",
    title: "تنظیمات سرعت و موشن بلور (Speed Ramping & Optical Flow)",
    level: "خوب-است-بدانی",
    tier: "حرفه‌ای",
    description: "تغییر سرعت تصویر از اسلوموشن به فست‌موشن برای جذاب کردن حرکات دوربین.",
    resources: [{ title: "Premiere Pro Time Remapping", url: "https://helpx.adobe.com/premiere-pro/using/duration-speed.html", type: "LINK" }],
    task: "اعمال اسپید رمپ روان روی ریختن قهوه توسط باریستای کافه برای ریلز تبلیغاتی.",
    prerequisites: ["ve-4"]
  },
  {
    id: "ve-24",
    title: "تولید تیزر معرفی محصول (Product Commercial)",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "نماهای ماکرو، نورپردازی دقیق و برش‌های شارپ برای نمایش کیفیت منوی کافه.",
    resources: [{ title: "Commercial Directing 101", url: "https://www.premiumbeat.com/blog/", type: "LINK" }],
    task: "ساخت تیزر تجاری ۳۰ ثانیه‌ای از یک نوشیدنی امضای کافه کارآفرینی.",
    prerequisites: ["ve-19", "ve-16"]
  },
  {
    id: "ve-25",
    title: "کارگردانی فنی و مدیریت رکورد لایواستریم (Live Production)",
    level: "ضروری",
    tier: "مربی",
    description: "سوییچ زنده با میکسر Blackmagic ATEM و استریم روی آپارات و یوتیوب رویدادهای رکاد.",
    resources: [{ title: "Blackmagic ATEM Live Production", url: "https://www.blackmagicdesign.com/products/atemmini", type: "LINK" }],
    task: "کانفیگ تجهیزات استریم زنده و ضبط همزمان مراسم ارائه نهایی استارتاپ‌ها.",
    prerequisites: ["ve-18"]
  },
  {
    id: "ve-26",
    title: "انیمیت متن و زیرنویس‌های خودکار فارسی (Auto Subtitling)",
    level: "ضروری",
    tier: "مربی",
    description: "ساخت استایل زیرنویس‌های کلمه‌به‌کلمه هایلایت‌شده برای افزایش چشمگیر واچ‌تایم.",
    resources: [{ title: "Premiere Speech-to-Text Workflow", url: "https://helpx.adobe.com/premiere-pro/using/speech-to-text.html", type: "LINK" }],
    task: "تولید زیرنویس موشن‌دار با رنگ‌بندی برند رکاد برای ۳ ویدیوی آموزشی اینستاگرام.",
    prerequisites: ["ve-8"]
  },
  {
    id: "ve-27",
    title: "فیلمبرداری در شرایط کم‌نور (Low-Light Cinematography)",
    level: "خوب-است-بدانی",
    tier: "مربی",
    description: "مدیریت Dual Native ISO، انتخاب دیافراگم باز و لنزهای پرایم برای رویدادهای عصرگاهی.",
    resources: [{ title: "Sony Alpha Low-Light Guide", url: "https://alphauniverse.com/", type: "LINK" }],
    task: "تصویربرداری سینمایی از گفتگوی دورهمی شبانه کافه رکاد با حفظ جزئیات سایه‌ها.",
    prerequisites: ["ve-1"]
  },
  {
    id: "ve-28",
    title: "مدیریت فایل و آرشیو رسانه‌ای (DIT & Data Management)",
    level: "ضروری",
    tier: "مربی",
    description: "پشتیبان‌گیری امن کارت‌های حافظه با چک‌سام، نام‌گذاری منظم و دسته‌بندی فوتیج‌ها.",
    resources: [{ title: "ShotPut Pro Data Offloading", url: "https://www.imagineproducts.com/", type: "LINK" }],
    task: "راه‌اندازی استراکچر فولدرهای آرشیو و سیستم بک‌آپ دوگانه برای تمام راش‌های سالانه رکاد.",
    prerequisites: ["ve-3"]
  },
  {
    id: "ve-29",
    title: "تولید ولاگ و محتوای پشت صحنه (Behind the Scenes)",
    level: "خوب-است-بدانی",
    tier: "مربی",
    description: "تعامل طبیعی با کاراکترها، قاب‌بندی صمیمی و داستان‌گویی در لحظه.",
    resources: [{ title: "Vlog Storytelling Essentials", url: "https://www.youtube.com/creators/", type: "LINK" }],
    task: "ضبط و تدوین یک ولاگ ۱۰ دقیقه‌ای از یک روز پرکار تیم اجرایی در آماده‌سازی ایونت بزرگ رکاد.",
    prerequisites: ["ve-12"]
  },
  {
    id: "ve-30",
    title: "تولید مستند بلند داستانی از اکوسیستم رکاد",
    level: "ضروری",
    tier: "مربی",
    description: "روایت داستان تحول دانش‌آموزان از ورود تا راه‌اندازی استارتاپ در قالب مستند حرفه‌ای.",
    resources: [{ title: "MasterClass: Documentary Filmmaking", url: "https://www.masterclass.com/", type: "LINK" }],
    task: "کارگردانی، فیلمبرداری و تدوین یک مستند کوتاه ۱۵ دقیقه‌ای از داستان موفقیت یک تیم کارآفرین.",
    prerequisites: ["ve-15", "ve-22", "ve-28"]
  }
];

// 7. CONTENT CREATOR / SOCIAL MEDIA (15 -> 30)
const ccAdditions = [
  {
    id: "cc-16",
    title: "استراتژی سناریونویسی ریلزهای وایرال (Viral Hook Framework)",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "طراحی قلاب ۳ ثانیه‌ای اول، نگارش بدنه آموزنده و فراخوان عمل (CTA) پربازده.",
    resources: [{ title: "HubSpot: Instagram Reels Guide", url: "https://blog.hubspot.com/marketing/instagram-reels", type: "LINK" }],
    task: "نگارش سناریوی ۵ ریلز با ساختار قلاب متفاوت برای معرفی رشته‌های هنرستان رکاد.",
    prerequisites: ["cc-6"]
  },
  {
    id: "cc-17",
    title: "مدیریت استوری و طراحی تعاملات روزانه (Story Engagement)",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "استفاده از کوئیز، نظرسنجی، باکس سوال و تکنیک‌های افزایش ایمپرشن استوری‌ها.",
    resources: [{ title: "Later: Instagram Stories Strategy", url: "https://later.com/blog/instagram-stories-strategy/", type: "LINK" }],
    task: "برنامه‌ریزی سناریوی یک هفته استوری کافه کارآفرینی برای افزایش فروش روزهای میانی هفته.",
    prerequisites: ["cc-4"]
  },
  {
    id: "cc-18",
    title: "تولید محتوای متنی و میکروبلاگینگ در لینکدین",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "نگارش محتوای تخصصی، دستاوردهای دانش‌آموزان و شبکه‌سازی با مدیران کسب‌وکار.",
    resources: [{ title: "LinkedIn Marketing Solutions Guide", url: "https://business.linkedin.com/marketing-solutions", type: "LINK" }],
    task: "نگارش ۳ پست تخصصی لینکدین درباره آینده مهارت‌های دیجیتال و دستاوردهای رکاد.",
    prerequisites: ["cc-5"]
  },
  {
    id: "cc-19",
    title: "تولید و تدوین پادکست صوتی با کافه رکاد",
    level: "خوب-است-بدانی",
    tier: "حرفه‌ای",
    description: "تنظیم میکروفون‌های یقه‌ای، مصاحبه چالشی و تدوین پادکست رادیویی.",
    resources: [{ title: "Anchor / Spotify for Podcasters", url: "https://podcasters.spotify.com/", type: "LINK" }],
    task: "ضبط و تدوین اپیزود اول پادکست گفتگو با بنیان‌گذاران جوان در کافه رکاد.",
    prerequisites: ["cc-8"]
  },
  {
    id: "cc-20",
    title: "تحلیل پیشرفته الگوریتم اینستاگرام و Insight",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "تحلیل Reach، Shares، Saves و بهینه‌سازی مداوم ساعات و فرمت‌های انتشار.",
    resources: [{ title: "Sprout Social: Instagram Analytics", url: "https://sproutsocial.com/insights/instagram-analytics/", type: "LINK" }],
    task: "گزارش تحلیلی ۳۰ روزه از صفحه اینستاگرام رکاد و استخراج ۳ الگوی محتوایی برتر.",
    prerequisites: ["cc-9"]
  },
  {
    id: "cc-21",
    title: "استراتژی کپشن‌نویسی و هشتگ‌گذاری هدفمند",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "اصول نگارش کپی ترغیب‌کننده، سوالات تحریک‌کننده کامنت و هشتگ‌های اختصاصی رویدادها.",
    resources: [{ title: "Copyblogger: Copywriting 101", url: "https://copyblogger.com/copywriting-101/", type: "LINK" }],
    task: "نگارش کپشن و ماتریس هشتگ برای ۱۰ پست آینده معرفی رویدادهای کافه کارآفرینی.",
    prerequisites: ["cc-5"]
  },
  {
    id: "cc-22",
    title: "اجرای پخش زنده و لایوهای تعاملی (Instagram Live)",
    level: "خوب-است-بدانی",
    tier: "حرفه‌ای",
    description: "مدیریت لایو مشترک با مهمانان، پاسخ به سوالات لحظه‌ای و پوشش زنده مسابقات رکاد.",
    resources: [{ title: "Instagram Live Best Practices", url: "https://creators.instagram.com/", type: "LINK" }],
    task: "تدوین کنداکتور و اجرای یک برنامه لایو ۳۰ دقیقه‌ای پرسش و پاسخ درباره پلتفرم اجوکاد.",
    prerequisites: ["cc-7"]
  },
  {
    id: "cc-23",
    title: "همکاری با اینفلوئنسرها و میکروکریترها (Influencer Outreach)",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "ارزیابی اینگیج‌ریت، دعوت از تولیدکنندگان محتوا به کافه و مدیریت کمپین‌های مشترک.",
    resources: [{ title: "Influencer Marketing Hub", url: "https://influencermarketinghub.com/", type: "LINK" }],
    task: "پروپوزال دعوت و میزبانی از ۵ میکروکریتر مشهدی برای معرفی کافه کارآفرینی رکاد.",
    prerequisites: ["cc-10"]
  },
  {
    id: "cc-24",
    title: "تولید محتوای مبتنی بر هوش مصنوعی (AI Content Tools)",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "استفاده از ابزارهای ChatGPT و Midjourney برای طوفان فکری سناریوها و ایده‌پردازی بصری.",
    resources: [{ title: "Prompt Engineering Guide", url: "https://www.promptingguide.ai/", type: "LINK" }],
    task: "طراحی پرامپت‌های اختصاصی برای تولید ۲۰ ایده محتوایی خلاقانه برای ریلزهای هنرستان.",
    prerequisites: ["cc-2"]
  },
  {
    id: "cc-25",
    title: "مدیریت بحران و پاسخگویی به نظرات منفی (Crisis Management)",
    level: "ضروری",
    tier: "مربی",
    description: "پروتکل پاسخ به کامنت‌ها، تبدیل مخاطب شاکی به حامی و حفظ اعتبار برند رکاد.",
    resources: [{ title: "Hootsuite: Social Media Crisis Management", url: "https://blog.hootsuite.com/social-media-crisis-management/", type: "LINK" }],
    task: "تدوین راهنمای پاسخگویی تیم پشتیبانی به ۵ سناریوی اعتراض و نقد تند در شبکه‌های اجتماعی.",
    prerequisites: ["cc-11"]
  },
  {
    id: "cc-26",
    title: "طراحی لایه‌های تعاملی گیمیفیکیشن در شبکه‌های اجتماعی",
    level: "خوب-است-بدانی",
    tier: "مربی",
    description: "چالش‌های تعاملی، قرعه‌کشی‌های هوشمند و مسابقات عکس با محصولات کافه.",
    resources: [{ title: "Social Media Examiner: Gamification Guide", url: "https://www.socialmediaexaminer.com/", type: "LINK" }],
    task: "طراحی یک کمپین مسابقه عکاسی با ماگ اختصاصی کافه همراه با کد تخفیف در پلتفرم اجوکاد.",
    prerequisites: ["cc-17"]
  },
  {
    id: "cc-27",
    title: "استراتژی توزیع محتوا در کانال‌های چندگانه (Cross-Posting)",
    level: "ضروری",
    tier: "مربی",
    description: "تطبیق یک محتوای رویداد برای فرمت‌های متفاوت بله، ایتا، تلگرام، اینستاگرام و آپارات.",
    resources: [{ title: "Content Marketing Institute: Content Repurposing", url: "https://contentmarketinginstitute.com/", type: "LINK" }],
    task: "تبدیل یک ویدیوی ۱۰ دقیقه‌ای رویداد به یک ریلز، سه اسلاید نقل‌قول و یک مقاله کوتاه کانال.",
    prerequisites: ["cc-3"]
  },
  {
    id: "cc-28",
    title: "تولید محتوای تولیدشده توسط کاربر (User-Generated Content)",
    level: "ضروری",
    tier: "مربی",
    description: "تشویق دانش‌آموزان و مشتریان کافه به اشتراک‌گذاری استوری‌ها و بازنشر رسمی آنها.",
    resources: [{ title: "Shopify: UGC Strategy", url: "https://www.shopify.com/blog/user-generated-content", type: "LINK" }],
    task: "ایجاد کمپین هشتگ #من_یک_رکادی‌ام برای تشویق دانش‌آموزان به اشتراک‌گذاری مأموریت‌ها.",
    prerequisites: ["cc-23"]
  },
  {
    id: "cc-29",
    title: "بودجه‌بندی و مدیریت تبلیغات اسپانسری شبکه‌های اجتماعی",
    level: "ضروری",
    tier: "مربی",
    description: "تخمین هزینه به ازای جذب (CPA)، تبلیغات پربازده در پیج‌های همکار و سنجش بازگشت سرمایه.",
    resources: [{ title: "HubSpot: Social Media Advertising", url: "https://blog.hubspot.com/marketing/social-media-advertising-campaign", type: "LINK" }],
    task: "برنامه‌ریزی و بودجه‌بندی کمپین تبلیغاتی معرفی ثبت‌نام ترم پاییزه هنرستان در ۵ پیج منتخب.",
    prerequisites: ["cc-20"]
  },
  {
    id: "cc-30",
    title: "تدوین سند جامع استراتژی محتوای ۳۶۰ درجه رکاد",
    level: "ضروری",
    tier: "مربی",
    description: "تعیین رسالت محتوا، پرسونای مخاطب، تقویم فصلی و متریک‌های ارزیابی عملکرد سالانه.",
    resources: [{ title: "CoSchedule: Content Strategy Guide", url: "https://coschedule.com/content-marketing/content-strategy", type: "LINK" }],
    task: "نگارش سند راهبردی سالانه تولید محتوای کل اکوسیستم رکاد (کافه، رویداد، مدرسه و پلتفرم).",
    prerequisites: ["cc-15", "cc-20", "cc-27"]
  }
];

// 8. DIGITAL MARKETING SPECIALIST (15 -> 30)
const dmAdditions = [
  {
    id: "dm-16",
    title: "تحلیل تخصصی قیف فروش (Funnel Optimization)",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "شناسایی نقاط ریزش کاربران از لحظه مشاهده لندینگ تا ثبت‌نام قطعی در دوره.",
    resources: [{ title: "CXL: Conversion Funnel Optimization", url: "https://cxl.com/blog/conversion-funnel/", type: "LINK" }],
    task: "ترسیم نمودار قیف ثبت‌نام دوره جامع رکاد و ارائه ۳ پیشنهاد برای کاهش نرخ ریزش.",
    prerequisites: ["dm-10"]
  },
  {
    id: "dm-17",
    title: "بهینه‌سازی سئوی محلی (Local SEO) برای کافه کارآفرینی",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "ثبت در نقشه گوگل، نشان و بلد، جمع‌آوری نظرات مثبت و کلمات کلیدی جغرافیایی.",
    resources: [{ title: "Moz: Local SEO Guide", url: "https://moz.com/learn/seo/local", type: "LINK" }],
    task: "بهینه‌سازی پروفایل گوگل مپ و نشان کافه کارآفرینی برای جذب مراجعین رویدادهای مشهد.",
    prerequisites: ["dm-7"]
  },
  {
    id: "dm-18",
    title: "تست A/B روی لندینگ‌پیج‌ها با Google Optimize / Microsoft Clarity",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "آزمایش دو تیتر و دکمه فراخوان متفاوت برای انتخاب بیشترین نرخ تبدیل.",
    resources: [{ title: "VWO: A/B Testing Guide", url: "https://vwo.com/ab-testing/", type: "LINK" }],
    task: "طراحی سناریوی تست A/B روی فرم پیش‌ثبت‌نام همایش کافه با دو دکمه CTA متفاوت.",
    prerequisites: ["dm-11"]
  },
  {
    id: "dm-19",
    title: "ایمیل مارکتینگ و اتوماسیون با MailerLite / نجوا",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "طراحی جریان ایمیل‌های خوش‌آمدگویی، یادآوری تکالیف و خبرنامه‌های هفتگی.",
    resources: [{ title: "MailerLite Academy", url: "https://www.mailerlite.com/academy", type: "LINK" }],
    task: "ساخت یک ایمیل خوش‌آمدگویی جذاب برای دانش‌آموزان تازه‌وارد پلتفرم اجوکاد.",
    prerequisites: ["dm-8"]
  },
  {
    id: "dm-20",
    title: "تحلیل رفتار کاربر با هیت‌مپ (Heatmaps) و Session Recording",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "مشاهده ضبط ویدیویی پیمایش کاربران، نقشه‌های حرارتی اسکرول و کلیک.",
    resources: [{ title: "Hotjar: Heatmaps Guide", url: "https://www.hotjar.com/heatmaps/", type: "LINK" }],
    task: "تحلیل نقشه حرارتی اسکرول صفحه اصلی اجوکاد و اصلاح موقعیت دکمه‌های کاتالوگ.",
    prerequisites: ["dm-6"]
  },
  {
    id: "dm-21",
    title: "تبلیغات کلیکی در گوگل (Google Ads Search & Display)",
    level: "خوب-است-بدانی",
    tier: "حرفه‌ای",
    description: "کلمات کلیدی با قصد خرید بالا (High Intent)، امتیاز کیفیت (Quality Score) و کپی ادز.",
    resources: [{ title: "Google Skillshop: Google Ads", url: "https://skillshop.withgoogle.com/", type: "LINK" }],
    task: "طراحی ساختار کمپین سرچ ادز گوگل برای کلیدواژه «هنرستان استارتاپی کامپیوتر».",
    prerequisites: ["dm-9"]
  },
  {
    id: "dm-22",
    title: "تبلیغات همسان و ریتارگتینگ (Native Ads & Retargeting)",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "کمپین‌های بازهدف‌گیری در یکتانت و مدیااد برای تبدیل بازدیدکنندگانی که ثبت‌نام نکردند.",
    resources: [{ title: "Yektanet Academy", url: "https://yektanet.com/academy/", type: "LINK" }],
    task: "طراحی یک بنر همسان و ست کردن مخاطب ریتارگتینگ برای بازدیدکنندگان صفحه دوره.",
    prerequisites: ["dm-9"]
  },
  {
    id: "dm-23",
    title: "استراتژی بازاریابی پیامکی تعاملی (SMS Automation)",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "دسته‌بندی شماره‌های کافه، ارسال لینک‌های کوتاه ردیابی‌شده و پیامک‌های مناسبتی.",
    resources: [{ title: "SMS Marketing Best Practices", url: "https://www.smsbump.com/blogs", type: "LINK" }],
    task: "طراحی متن و سناریوی ارسال پیامک تخفیف تولد مشتریان به همراه لینک منوی کافه.",
    prerequisites: ["dm-5"]
  },
  {
    id: "dm-24",
    title: "مدل‌سازی ارزش طول عمر مشتری (Customer Lifetime Value - LTV)",
    level: "خوب-است-بدانی",
    tier: "حرفه‌ای",
    description: "محاسبه هزینه جذب مشتری (CAC) در مقایسه با درآمد طول دوره حضور دانش‌آموز در رکاد.",
    resources: [{ title: "Harvard Business Review: Customer Lifetime Value", url: "https://hbr.org/", type: "LINK" }],
    task: "محاسبه نسبت LTV/CAC برای دوره‌های تخصصی هنرستان بر اساس داده‌های مالی.",
    prerequisites: ["dm-14"]
  },
  {
    id: "dm-25",
    title: "بازاریابی معارفه‌ای و گیمیفیکیشن ریفرال (Referral Marketing)",
    level: "ضروری",
    tier: "مربی",
    description: "مکانیزم دعوت دوستان با پاداش دوطرفه برای دوره‌های رکاد و سفارشات کافه.",
    resources: [{ title: "Viral Loops: Referral Marketing Guide", url: "https://viral-loops.com/blog/", type: "LINK" }],
    task: "طراحی کمپین «دعوت از دوستان»: با معرفی هر دانش‌آموز، ۵۰۰ امتیاز مهارت در اجوکاد دریافت کنید.",
    prerequisites: ["dm-4"]
  },
  {
    id: "dm-26",
    title: "سئوی تکنیکال عمیق و معماری سایت (Technical SEO)",
    level: "ضروری",
    tier: "مربی",
    description: "رفع خطاهای کدهای وضعیت، اسکیما مارک‌آپ دوره‌ها، سایت‌مپ و بهینه‌سازی سرعت سرور.",
    resources: [{ title: "Schema.org Course Markup", url: "https://schema.org/Course", type: "LINK" }],
    task: "کدهای ساختاریافته Schema.org مدل Course را برای ۹ مسیر شغلی اجوکاد پیاده کنید.",
    prerequisites: ["dm-7"]
  },
  {
    id: "dm-27",
    title: "روابط عمومی دیجیتال و رپورتاژ آگهی (Digital PR)",
    level: "ضروری",
    tier: "مربی",
    description: "نگارش اخبار دستاوردهای رکاد، انتشار در خبرگزاری‌های معتبر و دریافت بک‌لینک قدرتمند.",
    resources: [{ title: "Tebyan / Digiato Press Release Standards", url: "https://digiato.com/", type: "LINK" }],
    task: "نگارش یک رپورتاژ آگهی جذاب درباره رویکرد آموزش پروژه‌محور رکاد برای انتشار در زومیت.",
    prerequisites: ["dm-3"]
  },
  {
    id: "dm-28",
    title: "هوش مصنوعی در بازاریابی دیجیتال و چت‌بات‌ها (AI & Chatbots)",
    level: "خوب-است-بدانی",
    tier: "مربی",
    description: "پاسخگویی خودکار به مشتریان در سایت با چت‌بات‌های مجهز به مدل‌های زبانی هوش مصنوعی.",
    resources: [{ title: "Intercom: AI Chatbots Guide", url: "https://www.intercom.com/ai-chatbot", type: "LINK" }],
    task: "طراحی درخت تصمیم و پاسخ‌های هوشمند ربات پشتیبان ثبت‌نام دوره‌های کافه رکاد.",
    prerequisites: ["dm-1"]
  },
  {
    id: "dm-29",
    title: "داشبوردسازی جامع مارکتینگ در Google Looker Studio",
    level: "ضروری",
    tier: "مربی",
    description: "تجمیع داده‌های سرچ کنسول، گوگل آنالیتیکس و فروش کافه در یک صفحه گزارش زنده مدیریتی.",
    resources: [{ title: "Google Looker Studio Tutorials", url: "https://lookerstudio.google.com/", type: "LINK" }],
    task: "ساخت داشبورد مدیریتی جامع متریک‌های بازاریابی رکاد با گراف‌های مصور و مقایسه ماهانه.",
    prerequisites: ["dm-13"]
  },
  {
    id: "dm-30",
    title: "طراحی و رهبری کمپین‌های جامع بازاریابی ۳۶۰ درجه (Omnichannel)",
    level: "ضروری",
    tier: "مربی",
    description: "یکپارچه‌سازی کانال‌های آنلاین و آفلاین برای کمپین ثبت‌نام سراسری هنرستان رکاد.",
    resources: [{ title: "Kotler on Marketing: Omnichannel Strategy", url: "https://www.kotlermarketing.com/", type: "LINK" }],
    task: "تدوین پروپوزال جامع کمپین پذیرش دانش‌آموز با بودجه‌بندی تفکیکی کانال‌ها و پیش‌بینی بازگشت سرمایه.",
    prerequisites: ["dm-15", "dm-25", "dm-29"]
  }
];

// 9. EVENT & OPERATIONS COORDINATOR (15 -> 30)
const opsAdditions = [
  {
    id: "ops-16",
    title: "مدیریت امور فنی و صدای سالن رویداد (AV Tech Coordination)",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "تست میکروفون‌های بیسیم، تنظیم پروژکتور و سوئیچر تصاویر برای سخنرانی‌های بدون وقفه.",
    resources: [{ title: "AV Event Technology Handbook", url: "https://www.avixa.org/", type: "LINK" }],
    task: "چک‌لیست بررسی روز قبل تجهیزات صوت، تصویر و اتصالات لپ‌تاپ اساتید رویداد کافه.",
    prerequisites: ["ops-3"]
  },
  {
    id: "ops-17",
    title: "پذیرش الکترونیک و چاپ فوری کارت‌های حضور (Badging System)",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "سیستم اسکن بارکد بلیت‌ها، چاپ کارت شناسایی و جلوگیری از ازدحام دم در ورودی.",
    resources: [{ title: "Eventbrite: Event Check-in Best Practices", url: "https://www.eventbrite.com/blog/", type: "LINK" }],
    task: "راه‌اندازی ایستگاه پذیرش با اسکنر کیو‌آرکد برای رویداد ۲۰۰ نفره همایش کارآفرینی.",
    prerequisites: ["ops-4"]
  },
  {
    id: "ops-18",
    title: "تامین و نظارت بر کترینگ و پذیرایی خلاقانه کافه",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "منوی میان‌وعده‌های پرانرژی، سرو قهوه تازه و مدیریت زمان‌بندی تایم‌های استراحت (Break).",
    resources: [{ title: "Catering Management Guide", url: "https://www.catersource.com/", type: "LINK" }],
    task: "طراحی پکیج پذیرایی نوآورانه و ارزان‌قیمت برای کارگاه ۴ ساعته عصرگاهی کافه رکاد.",
    prerequisites: ["ops-5"]
  },
  {
    id: "ops-19",
    title: "قراردادهای پیمانکاری، اجاره و توافق‌نامه‌های حقوقی",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "تنظیم متن قرارداد با سالن‌ها، عکاسان، اساتید و شفاف‌سازی بندهای تعهدات و خسارات.",
    resources: [{ title: "Event Contracts & Legal Guide", url: "https://www.eventmanagerblog.com/event-contracts", type: "LINK" }],
    task: "نگارش پیش‌نویس قرارداد همکاری با سخنران مهمان و بندهای عدم افشا و حفظ حقوق معنوی.",
    prerequisites: ["ops-2"]
  },
  {
    id: "ops-20",
    title: "مدیریت ارتباط با حامیان مالی و پکیج‌های اسپانسری",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "طراحی پرپوزال ارزش پیشنهادی، غرفه‌های نمایشگاهی و تضمین تحقق تعهدات به اسپانسرها.",
    resources: [{ title: "Sponsorship Collective Guide", url: "https://sponsorship.com/", type: "LINK" }],
    task: "طراحی بروشور جذب حامی مالی برای مسابقه استارتاپی کافه با سه سطح برنزی، نقره‌ای و طلایی.",
    prerequisites: ["ops-6"]
  },
  {
    id: "ops-21",
    title: "هماهنگی پروتکل‌های ایمنی، بهداشت و امداد (Safety & HSE)",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "جانمایی کپسول‌های آتش‌نشانی، جعبه کمک‌های اولیه و مسیرهای خروج اضطراری در فضای کافه.",
    resources: [{ title: "HSE Event Safety Guide", url: "https://www.hse.gov.uk/event-safety/", type: "LINK" }],
    task: "تدوین نقشه ایمنی و خروج اضطراری سالن برگزاری مسابقات دانش‌آموزی رکاد.",
    prerequisites: ["ops-10"]
  },
  {
    id: "ops-22",
    title: "تسهیلگری کارگاه‌های تعاملی و بازی‌سازی تیمی (Icebreaking)",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "اجرای بازی‌های آشنایی سریع، شبکه‌سازی بین شرکت‌کنندگان و ایجاد جو صمیمی در کافه.",
    resources: [{ title: "SessionLab Library of Facilitation Games", url: "https://www.sessionlab.com/library", type: "LINK" }],
    task: "طراحی یک فعالیت یخ‌شکنی ۱۰ دقیقه‌ای برای دانش‌آموزان تازه‌وارد در اولین رویداد حضوری.",
    prerequisites: ["ops-11"]
  },
  {
    id: "ops-23",
    title: "نظرسنجی آنلاین و ارزیابی رضایت رویداد (Post-Event Survey)",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "فرم‌های نظرسنجی آنی با QR کد، تحلیل شاخص خالص مروجان (NPS) و نقاط بهبود.",
    resources: [{ title: "SurveyMonkey: Event Feedback Survey Template", url: "https://www.surveymonkey.com/mp/event-feedback-surveys/", type: "LINK" }],
    task: "ایجاد فرم نظرسنجی هوشمند پایان رویداد و ارسال گزارش تحلیل رضایت به مدیران رکاد.",
    prerequisites: ["ops-13"]
  },
  {
    id: "ops-24",
    title: "بهینه‌سازی فرایندها و لجستیک داخلی کافه کارآفرینی",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "مدیریت گردش موجودی کالا (FIFO)، کاهش ضایعات مواد مصرفی و استانداردهای باریستا.",
    resources: [{ title: "Lean Operations & Waste Reduction", url: "https://www.lean.org/", type: "LINK" }],
    task: "طراحی جدول کنترل موجودی هفتگی و کاهش ۱۰ درصدی ضایعات مواد فاسدشدنی در کافه.",
    prerequisites: ["ops-8"]
  },
  {
    id: "ops-25",
    title: "مدیریت ارتباط با مشتریان و سیستم CRM رویدادها",
    level: "ضروری",
    tier: "مربی",
    description: "ثبت تاریخچه حضور شرکت‌کنندگان، ارسال پیام‌های پیگیری و دعوت به دوره‌های تکمیلی.",
    resources: [{ title: "HubSpot CRM Guide", url: "https://www.hubspot.com/products/crm", type: "LINK" }],
    task: "دسته‌بندی بانک اطلاعاتی ۵۰۰ شرکت‌کننده رویدادهای قبلی برای دعوت هدفمند به همایش بعدی.",
    prerequisites: ["ops-7"]
  },
  {
    id: "ops-26",
    title: "مدیریت پرسنل و منتورینگ تیم‌های اجرایی داوطلب",
    level: "ضروری",
    tier: "مربی",
    description: "آموزش لیدرهای اجرایی، شیفت‌بندی کاری و انگیزش تیم‌های داوطلب دانش‌آموزی.",
    resources: [{ title: "Volunteer Leadership Best Practices", url: "https://www.energizeinc.com/", type: "LINK" }],
    task: "برگزاری جلسه توجیهی و تخصیص وظایف اجرایی به ۱۰ دانش‌آموز داوطلب برای روز ایونت.",
    prerequisites: ["ops-9"]
  },
  {
    id: "ops-27",
    title: "برنامه‌ریزی مالی و تحلیل سود و زیان رویداد (Event P&L)",
    level: "ضروری",
    tier: "مربی",
    description: "تطابق هزینه‌های واقعی با بودجه، تسویه مالی پیمانکاران و گزارش نقطه سر‌به‌سر (Break-even).",
    resources: [{ title: "Investopedia: Event Budgeting", url: "https://www.investopedia.com/", type: "LINK" }],
    task: "تهیه گزارش مالی کامل دخل و خرج رویداد کافه رکاد و محاسبه سود خالص یا یارانه دوره‌ای.",
    prerequisites: ["ops-2"]
  },
  {
    id: "ops-28",
    title: "طراحی بسته‌های اهدایی و یادبود رویداد (Welcome Pack & Swag)",
    level: "خوب-است-بدانی",
    tier: "مربی",
    description: "انتخاب هدایای کاربردی، دفترچه‌ها و استیکرهای یادبود ماندگار برای مهمانان.",
    resources: [{ title: "Swag.com: Corporate Gifting Guide", url: "https://swag.com/", type: "LINK" }],
    task: "طراحی پک خوش‌آمدگویی شامل ماگ، دفترچه اختصاصی و کارت ورود برای رویداد رکاد.",
    prerequisites: ["ops-5"]
  },
  {
    id: "ops-29",
    title: "هماهنگی پخش زنده، رسانه‌ها و پوشش خبری رویداد",
    level: "ضروری",
    tier: "مربی",
    description: "جایگاه اختصاصی خبرنگاران، ارسال بیانیه خبری و انتشار پست‌های لحظه‌ای در کانال‌ها.",
    resources: [{ title: "PRSA: Media Relations Guide", url: "https://www.prsa.org/", type: "LINK" }],
    task: "مدیریت حضور خبرنگاران حوزه استارتاپ و ضبط مصاحبه‌های حاشیه‌ای در رویداد.",
    prerequisites: ["ops-12"]
  },
  {
    id: "ops-30",
    title: "مدیریت رویدادهای هیبریدی و کلان (Mega-Events Leadership)",
    level: "ضروری",
    tier: "مربی",
    description: "هدایت رویدادهای همزمان حضوری و مجازی با بیش از ۱۰۰۰ شرکت‌کننده و هماهنگی تمام واحدها.",
    resources: [{ title: "MPI: Meeting Professionals International", url: "https://www.mpi.org/", type: "LINK" }],
    task: "طراحی برنامه جامع عملیاتی (Master Operations Plan) برای همایش ملی نوآوری و کارآفرینی رکاد.",
    prerequisites: ["ops-15", "ops-20", "ops-27"]
  }
];

expandRoadmap('motion-graphic-designer.json', mgAdditions);
expandRoadmap('video-editor.json', veAdditions);
expandRoadmap('content-creator.json', ccAdditions);
expandRoadmap('digital-marketer.json', dmAdditions);
expandRoadmap('event-ops-coordinator.json', opsAdditions);
console.log('Finished expanding all remaining roadmaps.');
