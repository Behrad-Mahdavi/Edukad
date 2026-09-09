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

// 3. UI/UX DESIGNER (Currently 15 -> Add 15 to make 30)
const uiuxAdditions = [
  {
    id: "uiux-16",
    title: "میکرو تعاملات (Micro-interactions) در رابط کاربری",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "طراحی فیدبک‌های تعاملی ظریف، هاورها و واکنش المان‌ها به لمس کاربر.",
    resources: [{ title: "Nielsen Norman: Micro-interactions", url: "https://www.nngroup.com/articles/microinteractions/", type: "LINK" }],
    task: "برای دکمه‌های سفارش منوی دیجیتال کافه سه حالت هاور، لودینگ و موفقیت طراحی کنید.",
    prerequisites: ["uiux-8"]
  },
  {
    id: "uiux-17",
    title: "معماری اطلاعات و طراحی نقشه سایت (Sitemap)",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "دسته‌بندی منطقی صفحات و منوهای محصولات برای دسترسی سریع کاربر.",
    resources: [{ title: "Interaction Design Foundation: Information Architecture", url: "https://www.interaction-design.org/literature/topics/information-architecture", type: "LINK" }],
    task: "نقشه دسته‌بندی آیتم‌های کافه و سفارش آنلاین رویدادهای رکاد را ترسیم کنید.",
    prerequisites: ["uiux-4"]
  },
  {
    id: "uiux-18",
    title: "طراحی دسترسی‌پذیری و استانداردهای WCAG",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "اطمینان از کنتراست رنگ‌ها، سایز مناسب فونت و خوانایی المان‌ها.",
    resources: [{ title: "WebAIM Contrast Checker", url: "https://webaim.org/resources/contrastchecker/", type: "LINK" }],
    task: "پالت رنگی پلتفرم ادوکاد را از نظر کنتراست متن‌ها بررسی و اصلاح کنید.",
    prerequisites: ["uiux-5"]
  },
  {
    id: "uiux-19",
    title: "طراحی برای حالت تاریک (Dark Mode)",
    level: "خوب-است-بدانی",
    tier: "حرفه‌ای",
    description: "قواعد نورپردازی، کنتراست خاکستری‌ها و متغیرهای رنگی تم تیره.",
    resources: [{ title: "Material Design: Dark Theme", url: "https://m3.material.io/foundations/color/dark-theme", type: "LINK" }],
    task: "تم دارک برای داشبورد درخت مهارت ادوکاد را با حفظ سلسله‌مراتب بصری طراحی کنید.",
    prerequisites: ["uiux-7"]
  },
  {
    id: "uiux-20",
    title: "تست کاربردپذیری (Usability Testing) و کارد سورتینگ",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "ارزیابی تجربی محصول با کاربران واقعی و کشف موانع تجربه کاربری.",
    resources: [{ title: "Maze: Remote Testing Guide", url: "https://maze.co/guides/usability-testing/", type: "LINK" }],
    task: "۵ تست کاربردپذیری با دانش‌آموزان رکاد روی سناریوی تحویل مأموریت اجرا و نتایج را تحلیل کنید.",
    prerequisites: ["uiux-11"]
  },
  {
    id: "uiux-21",
    title: "تحلیل رقبا و بنچمارک محصول (Benchmarking)",
    level: "خوب-است-بدانی",
    tier: "حرفه‌ای",
    description: "بررسی الگوهای پلتفرم‌های برتر آموزشی و دلیوری دنیا و استخراج بینش‌های کلیدی.",
    resources: [{ title: "UX Design Institute: Competitive Analysis", url: "https://www.uxdesigninstitute.com/blog/competitive-analysis-ux/", type: "LINK" }],
    task: "گزارش ماتریس مقایسه‌ای بین پلتفرم ادوکاد و سه محصول برتر درخت مهارت جهانی تهیه کنید.",
    prerequisites: ["uiux-3"]
  },
  {
    id: "uiux-22",
    title: "طراحی فرم‌های بدون اصطکاک (Frictionless Forms)",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "بهینه‌سازی فیلدهای ورودی، اعتبارسنجی آنی و پیشگیری از خطای کاربر.",
    resources: [{ title: "Smashing Magazine: Form Design Best Practices", url: "https://www.smashingmagazine.com/2018/08/best-practices-for-mobile-form-design/", type: "LINK" }],
    task: "فرم ثبت سفارش رویدادهای کافه رکاد را بازطراحی کرده و تعداد فیلدها را به حداقل برسانید.",
    prerequisites: ["uiux-6"]
  },
  {
    id: "uiux-23",
    title: "گیمیفیکیشن و قلاب تعاملی (Hook Model)",
    level: "خوب-است-بدانی",
    tier: "حرفه‌ای",
    description: "استفاده از نشان‌ها، سطوح و میله‌های پیشرفت برای ترغیب یادگیری مداوم.",
    resources: [{ title: "Nir Eyal: Hooked Model Summary", url: "https://www.nirandfar.com/how-to-manufacture-desire/", type: "LINK" }],
    task: "مکانیزم مدال‌های افتخار و لول‌آپ دانش‌آموزان در ادوکاد را ترسیم کنید.",
    prerequisites: ["uiux-12"]
  },
  {
    id: "uiux-24",
    title: "طراحی واکنش‌گرا و تجربه موبایل‌فرست (Mobile-First UX)",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "الگوهای دسترسی شست (Thumb Zone)، ژست‌های لمسی و اسکرول نرم.",
    resources: [{ title: "Smashing Magazine: Mobile Thumb Zone", url: "https://www.smashingmagazine.com/2016/09/the-thumb-zone-designing-for-mobile-users/", type: "LINK" }],
    task: "ناوبری موبایل سایت کافه رکاد را بر اساس دسترسی آسان یک‌دستی بازطراحی کنید.",
    prerequisites: ["uiux-7"]
  },
  {
    id: "uiux-25",
    title: "اصول روانشناسی در طراحی (Laws of UX)",
    level: "ضروری",
    tier: "مربی",
    description: "قانون فیتس، قانون هیک، اثر میله پیشرفت و سوگیری‌های شناختی کاربر.",
    resources: [{ title: "Laws of UX", url: "https://lawsofux.com/", type: "LINK" }],
    task: "صفحه لندینگ مدرسه رکاد را تحلیل کرده و ۵ اصل از قوانین UX به کار رفته در آن را مستند کنید.",
    prerequisites: ["uiux-2"]
  },
  {
    id: "uiux-26",
    title: "مستندسازی و تحویل به توسعه‌دهندگان (Design Handoff)",
    level: "ضروری",
    tier: "مربی",
    description: "اسپک‌گذاری کامپوننت‌ها، نام‌گذاری متغیرها و هماهنگی دقیق با تیم فرانت‌اند.",
    resources: [{ title: "Figma: Guide to Developer Mode", url: "https://help.figma.com/hc/en-us/articles/15023124644247-Guide-to-Dev-Mode", type: "LINK" }],
    task: "پروژه فیگما کامپوننت‌های ادوکاد را برای توسعه‌دهندگان با مستندات کامل و Dev Mode آماده کنید.",
    prerequisites: ["uiux-9"]
  },
  {
    id: "uiux-27",
    title: "متریک‌های تجربه کاربری و تحلیل آماری (UX Metrics)",
    level: "خوب-است-بدانی",
    tier: "مربی",
    description: "شاخص‌های SUS، نرخ تکمیل تسک (Task Success Rate) و Time on Task.",
    resources: [{ title: "Nielsen Norman: UX Metrics", url: "https://www.nngroup.com/articles/ux-metrics/", type: "LINK" }],
    task: "داشبورد ارزیابی متریک‌های تجربه کاربری پلتفرم ادوکاد را تدوین کنید.",
    prerequisites: ["uiux-20"]
  },
  {
    id: "uiux-28",
    title: "نوشتار تجربه کاربری (UX Writing) و میکروکپی‌ها",
    level: "ضروری",
    tier: "مربی",
    description: "نگارش پیام‌های خطا، اعلان‌ها و متن دکمه‌ها با لحن صمیمی و هدایتگر برند رکاد.",
    resources: [{ title: "UX Writing Hub", url: "https://uxwritinghub.com/", type: "LINK" }],
    task: "تمام پیغام‌های خطای احراز هویت و موفقیت تحویل مأموریت ادوکاد را بازنویسی کنید.",
    prerequisites: ["uiux-10"]
  },
  {
    id: "uiux-29",
    title: "طراحی خدمات و نقشه سفر جامع (Service Blueprint)",
    level: "خوب-است-بدانی",
    tier: "مربی",
    description: "هماهنگی فرایندهای جلوی صحنه (Frontstage) و پشت صحنه (Backstage) رویدادها.",
    resources: [{ title: "Nielsen Norman: Service Blueprints", url: "https://www.nngroup.com/articles/service-blueprints-definition/", type: "LINK" }],
    task: "بلوپرینت کامل خدمات یک رویداد حضوری کافه کارآفرینی رکاد را ترسیم کنید.",
    prerequisites: ["uiux-4"]
  },
  {
    id: "uiux-30",
    title: "راهبری استراتژیک محصول و تفکر دیزاین (Design Leadership)",
    level: "ضروری",
    tier: "مربی",
    description: "تسهیلگری کارگاه‌های طوفان فکری، دیزاین اسپرینت و اتصال دیزاین به اهداف کسب‌وکار.",
    resources: [{ title: "Google Ventures: Design Sprint", url: "https://www.gv.com/sprint/", type: "LINK" }],
    task: "برنامه‌ریزی یک کارگاه دیزاین اسپرینت دو روزه برای افزودن فیچر جدید به پلتفرم ادوکاد.",
    prerequisites: ["uiux-15"]
  }
];

// 4. GRAPHIC & BRAND DESIGNER (Currently 15 -> Add 15 to make 30)
const graphicAdditions = [
  {
    id: "gd-16",
    title: "طراحی سیستم بسته‌بندی (Packaging Design)",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "طراحی بسته‌بندی لیوان‌های بیرون‌بر و پک‌های پذیرایی کافه کارآفرینی رکاد.",
    resources: [{ title: "Dieline: Packaging Design Inspiration", url: "https://thedieline.com/", type: "LINK" }],
    task: "طراحی گرافیکی دو مدل لیوان قهوه و جعبه ساندویچ برای کافه کارآفرینی.",
    prerequisites: ["gd-4"]
  },
  {
    id: "gd-17",
    title: "تولید موکاپ‌های واقع‌گرایانه (Realistic Mockups)",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "نمایش پروژه‌های هویت بصری روی آبجکت‌های فیزیکی در فتوشاپ با اسمارت‌آبجکت.",
    resources: [{ title: "Adobe Photoshop Smart Objects Guide", url: "https://helpx.adobe.com/photoshop/using/create-smart-objects.html", type: "LINK" }],
    task: "طراحی پرزنتیشن موکاپ ۳ بعدی از استیکرها و تی‌شرت سازمانی رکاد.",
    prerequisites: ["gd-2"]
  },
  {
    id: "gd-18",
    title: "تایپوگرافی تجربی و ساخت فونت‌های نمایشی",
    level: "خوب-است-بدانی",
    tier: "حرفه‌ای",
    description: "دستکاری و ترکیب حروف فارسی برای سرتیتر پوسترهای رویداد رکاد.",
    resources: [{ title: "Type Directors Club", url: "https://www.tdc.org/", type: "LINK" }],
    task: "یک عنوان تایپوگرافی خلاقانه برای رویداد استارتاپی «شب ایده‌ها» طراحی کنید.",
    prerequisites: ["gd-5"]
  },
  {
    id: "gd-19",
    title: "طراحی بروشور و اقلام چاپی رویداد",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "صفحه‌آرایی، تنظیم خط تا، حاشیه برش (Bleed) و خروجی مناسب چاپخانه.",
    resources: [{ title: "Adobe InDesign Print Setup Guide", url: "https://helpx.adobe.com/indesign/using/create-new-document.html", type: "LINK" }],
    task: "طراحی بروشور سه لت معرفی دوره‌های هنرستان استارتاپی رکاد با استانداردهای چاپ.",
    prerequisites: ["gd-9"]
  },
  {
    id: "gd-20",
    title: "اینفوگرافیک و بصری‌سازی داده‌های آماری",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "تبدیل اعداد و آمار فارغ‌التحصیلان رکاد به نمودارها و گرافیک‌های جذاب.",
    resources: [{ title: "Information is Beautiful", url: "https://informationisbeautiful.net/", type: "LINK" }],
    task: "طراحی پوستر اینفوگرافیک عملکرد یک‌ساله کافه و باشگاه دانش‌آموزی رکاد.",
    prerequisites: ["gd-6"]
  },
  {
    id: "gd-21",
    title: "طراحی نمادهای گرافیکی و آیکون‌ست اختصاصی",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "طراحی آیکون‌های متوازن روی گرید برای استفاده در وب و بروشورهای رکاد.",
    resources: [{ title: "The Noun Project Guide", url: "https://thenounproject.com/", type: "LINK" }],
    task: "طراحی یک ست ۱۰ عددی آیکون اختصاصی برای دسته‌بندی‌های مهارتی ادوکاد.",
    prerequisites: ["gd-3"]
  },
  {
    id: "gd-22",
    title: "تصویرسازی تبلیغاتی و کاراکتر دیزاین",
    level: "خوب-است-بدانی",
    tier: "حرفه‌ای",
    description: "خلق ماسکوت و کاراکترهای راهنمای دانش‌آموزان در ادوکاد.",
    resources: [{ title: "Character Design References", url: "https://characterdesignreferences.com/", type: "LINK" }],
    task: "طراحی کاراکتر ربات دستیار آموزشی برای استیکرهای پلتفرم ادوکاد.",
    prerequisites: ["gd-11"]
  },
  {
    id: "gd-23",
    title: "طراحی گرافیک محیطی و ساینیج (Wayfinding)",
    level: "خوب-است-بدانی",
    tier: "حرفه‌ای",
    description: "تابلوهای راهنمای محیطی و استیکرهای دیواری فضای فیزیکی کافه و مدرسه رکاد.",
    resources: [{ title: "SEGD Environmental Graphic Design", url: "https://segd.org/", type: "LINK" }],
    task: "طراحی تابلوهای راهنمای بخش‌های مختلف کافه کارآفرینی و کلاس‌های کارگاهی.",
    prerequisites: ["gd-8"]
  },
  {
    id: "gd-24",
    title: "طراحی ارائه‌های حرفه‌ای و اسلایدهای سرمایه‌گذاری (Pitch Deck)",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "چیدمان اسلایدهای سرمایه‌گذاری استارتاپ‌ها با هویت بصری منسجم.",
    resources: [{ title: "Pitch Deck Design Guide", url: "https://slidebean.com/pitch-deck", type: "LINK" }],
    task: "طراحی قالب اسلایدهای معرفی کسب‌وکارهای دانش‌آموزی برای روز دمو (Demo Day).",
    prerequisites: ["gd-7"]
  },
  {
    id: "gd-25",
    title: "روانشناسی رنگ‌ها و تدوین پالت‌های هویت‌ساز",
    level: "ضروری",
    tier: "مربی",
    description: "انتخاب رنگ‌های هارمونیک و انتقال حس پویایی، خلاقیت و اعتماد در برندینگ.",
    resources: [{ title: "Adobe Color Wheel", url: "https://color.adobe.com/", type: "LINK" }],
    task: "تدوین مستند راهنمای پالت رنگی ۵ محصول زیرمجموعه اکوسیستم رکاد.",
    prerequisites: ["gd-4"]
  },
  {
    id: "gd-26",
    title: "طراحی برای شبکه‌های اجتماعی و کیت گرافیکی اینستاگرام",
    level: "ضروری",
    tier: "مربی",
    description: "طراحی قالب‌های اسلایدی، کاور ریلز و استوری‌های با نرخ تعامل بالا.",
    resources: [{ title: "Canva Design School", url: "https://www.canva.com/designschool/", type: "LINK" }],
    task: "طراحی قالب ۳ استوری و یک پست کاروسل برای معرفی ورکشاپ جدید رکاد.",
    prerequisites: ["gd-10"]
  },
  {
    id: "gd-27",
    title: "مدیریت چاپ و ناظر چاپ (Print Production)",
    level: "ضروری",
    tier: "مربی",
    description: "کنترل کیفیت رنگ تفکیکی (Spot Colors)، روکش‌های سلفون و یووی موضعی.",
    resources: [{ title: "Print Production Handbook", url: "https://www.printindustry.com/", type: "LINK" }],
    task: "چک‌لیست بررسی فنی فایل‌های چاپی قبل از ارسال به لیتوگرافی برای تیم طراحی.",
    prerequisites: ["gd-9"]
  },
  {
    id: "gd-28",
    title: "عکاسی از محصولات و ادیت کاتالوگ (Product Photography)",
    level: "خوب-است-بدانی",
    tier: "مربی",
    description: "نورپردازی محصول، حذف پس‌زمینه و روتوش آیتم‌های کافه رکاد.",
    resources: [{ title: "Photoshop Product Retouching Tutorial", url: "https://helpx.adobe.com/photoshop/how-to/retouch-photos.html", type: "LINK" }],
    task: "عکاسی و روتوش ۵ نوشیدنی کافه کارآفرینی برای منوی چاپی و سایت.",
    prerequisites: ["gd-2"]
  },
  {
    id: "gd-29",
    title: "ری‌برندینگ و نوسازی هویت سازمانی (Rebranding)",
    level: "ضروری",
    tier: "مربی",
    description: "مراحل تحلیل وضعیت فعلی برند، بازآفرینی لوگو و پیاده‌سازی برندینگ جدید.",
    resources: [{ title: "Brand New: UnderConsideration", url: "https://www.underconsideration.com/brandnew/", type: "LINK" }],
    task: "سناریوی بازطراحی هویت بصری یکی از رویدادهای فصلی رکاد با حفظ ارزش‌های بنیادین.",
    prerequisites: ["gd-8"]
  },
  {
    id: "gd-30",
    title: "توسعه کتابچه جامع هویت بصری (Brand Style Guide)",
    level: "ضروری",
    tier: "مربی",
    description: "تدوین سند جامع برندبوک شامل تمام قوانین لوگو، لحن، چاپ و استفاده آنلاین.",
    resources: [{ title: "Brand Identity Guidelines Examples", url: "https://brandingstyleguides.com/", type: "LINK" }],
    task: "نگارش دفترچه راهنمای کامل هویت بصری (برندبوک ۲۰ صفحه‌ای) اکوسیستم رکاد.",
    prerequisites: ["gd-14", "gd-25"]
  }
];

expandRoadmap('uiux-designer.json', uiuxAdditions);
expandRoadmap('graphic-brand-designer.json', graphicAdditions);
console.log('Finished expanding UI/UX and Graphic Designer tracks.');
