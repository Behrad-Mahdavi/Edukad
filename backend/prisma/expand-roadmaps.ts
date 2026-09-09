import * as fs from 'fs';
import * as path from 'path';

const roadmapsDir = path.join(__dirname, 'data', 'roadmaps');

// Helper to expand roadmap
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

// 1. FRONTEND DEVELOPER (Currently 20 -> Add 10)
const feAdditions = [
  {
    id: "fe-21",
    title: "سیستم طراحی (Design System) و توکن‌های بصری",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "پیاده‌سازی کتابخانه کامپوننت و مدیریت متغیرهای تم سازمانی برای پلتفرم ادوکاد.",
    resources: [
      { title: "Storybook Official Guide", url: "https://storybook.js.org/docs", type: "LINK" },
      { title: "Design Systems Handbook", url: "https://www.designbetter.co/design-systems-handbook", type: "LINK" }
    ],
    task: "کامپوننت دکمه‌های استیکری و کارت‌های نئوبروتالیست ادوکاد را در یک کاتالوگ استوری‌بوک مستقل مستند کنید.",
    prerequisites: ["fe-17", "fe-9"]
  },
  {
    id: "fe-22",
    title: "دسترس‌پذیری وب (Web Accessibility - a11y)",
    level: "خوب-است-بدانی",
    tier: "حرفه‌ای",
    description: "استانداردهای WCAG، تگ‌های ARIA و پیمایش کامل سایت کافه رکاد با کیبورد.",
    resources: [
      { title: "W3C Web Accessibility Initiative", url: "https://www.w3.org/WAI/", type: "LINK" },
      { title: "A11y Project Checklist", url: "https://www.a11yproject.com/checklist/", type: "LINK" }
    ],
    task: "منوی دیجیتال کافه کارآفرینی را از نظر تگ‌های ARIA و کنتراست رنگی بررسی و نمره ۱۰۰ لایت‌هاوس را کسب کنید.",
    prerequisites: ["fe-1"]
  },
  {
    id: "fe-23",
    title: "تست‌نویسی واحد و کامپوننت با Vitest و RTL",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "تست کامپوننت‌های ری‌اکت با React Testing Library و اطمینان از عملکرد صحیح لاجیک‌ها.",
    resources: [
      { title: "Vitest Official Docs", url: "https://vitest.dev/", type: "LINK" },
      { title: "Testing Library for React", url: "https://testing-library.com/docs/react-testing-library/intro/", type: "LINK" }
    ],
    task: "برای کامپوننت محاسبه درصد پیشرفت مهارت‌ها در ادوکاد سه سناریوی تست کامل بنویسید.",
    prerequisites: ["fe-13", "fe-17"]
  },
  {
    id: "fe-24",
    title: "تست سرتاسری (E2E Testing) با Playwright",
    level: "خوب-است-بدانی",
    tier: "حرفه‌ای",
    description: "شبیه‌سازی تعامل واقعی کاربر، تست ورود به سیستم و ثبت سفارش منوی کافه.",
    resources: [
      { title: "Playwright Documentation", url: "https://playwright.dev/", type: "LINK" },
      { title: "E2E Testing Best Practices", url: "https://kentcdodds.com/blog/write-tests", type: "LINK" }
    ],
    task: "یک سناریوی تست E2E بنویسید که کاربر فرم لاگین ادوکاد را پر کرده و پس از ورود به صفحه داشبورد برسد.",
    prerequisites: ["fe-23"]
  },
  {
    id: "fe-25",
    title: "انیمیشن‌های تعاملی پیشرفته با Framer Motion",
    level: "خوب-است-بدانی",
    tier: "حرفه‌ای",
    description: "موشن‌های روان، انیمیشن باز شدن مدال‌ها و ترنزیشن صفحات در ادوکاد.",
    resources: [
      { title: "Framer Motion Guide", url: "https://www.framer.com/motion/", type: "LINK" }
    ],
    task: "انیمیشن باز شدن کشویی دراور جزئیات گره را با افکت فنری (Spring) پیاده‌سازی کنید.",
    prerequisites: ["fe-11"]
  },
  {
    id: "fe-26",
    title: "مدیریت داده‌های سرور با TanStack Query",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "کشینگ هوشمند اطلاعات، مدیریت stale time و آپدیت‌های خوش‌بینانه (Optimistic Updates).",
    resources: [
      { title: "TanStack Query Official Docs", url: "https://tanstack.com/query/latest", type: "LINK" }
    ],
    task: "واکشی لیست اعلانات کاربر در ادوکاد را با استفاده از TanStack Query کش کرده و دکمه خوانده شدن را با آپدیت خوش‌بینانه پیاده کنید.",
    prerequisites: ["fe-16"]
  },
  {
    id: "fe-27",
    title: "ارتباطات بلادرنگ با WebSockets و SSE",
    level: "خوب-است-بدانی",
    tier: "مربی",
    description: "دریافت نوتیفیکیشن‌های آنی و تغییرات زنده وضعیت بازبینی مأموریت‌ها توسط منتور.",
    resources: [
      { title: "MDN: WebSockets API", url: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API", type: "LINK" }
    ],
    task: "سیستم دریافت اعلان آنی در نوبار ادوکاد را با اتصال به وب‌سوکت شبیه‌سازی کنید.",
    prerequisites: ["fe-8"]
  },
  {
    id: "fe-28",
    title: "اپلیکیشن تحت وب پیش‌رونده (PWA) و Service Workers",
    level: "خوب-است-بدانی",
    tier: "مربی",
    description: "قابلیت نصب روی گوشی هوشمند، کارکرد آفلاین منوی کافه و مانیفست وب.",
    resources: [
      { title: "web.dev: Progressive Web Apps", url: "https://web.dev/explore/progressive-web-apps", type: "LINK" }
    ],
    task: "سایت منوی دیجیتال کافه کارآفرینی را به یک PWA قابل نصب با قابلیت نمایش آفلاین منو تبدیل کنید.",
    prerequisites: ["fe-18"]
  },
  {
    id: "fe-29",
    title: "امنیت فرانت‌اند و جلوگیری از حملات XSS و CSRF",
    level: "ضروری",
    tier: "مربی",
    description: "پاکسازی ورودی‌های کاربر (Sanitization)، سیاست امنیتی محتوا (CSP) و کوکی‌های HttpOnly.",
    resources: [
      { title: "OWASP Front-end Security Cheat Sheet", url: "https://cheatsheetseries.owasp.org/", type: "LINK" }
    ],
    task: "ورودی یادداشت مأموریت در ادوکاد را در برابر تزریق کدهای مخرب اسکریپتی (XSS) محافظت کنید.",
    prerequisites: ["fe-15"]
  },
  {
    id: "fe-30",
    title: "بین‌المللی‌سازی (i18n) و مدیریت پیشرفته راست‌چین (RTL/LTR)",
    level: "ضروری",
    tier: "مربی",
    description: "تسلط بر تایپوگرافی دوجهته (BiDi)، استانداردهای RTL و پشتیبانی چندزبانه در پلتفرم.",
    resources: [
      { title: "W3C: Structural markup and right-to-left text in HTML", url: "https://www.w3.org/International/articles/inline-bidi-markup/", type: "LINK" }
    ],
    task: "تمام بلوک‌های متنی ادوکاد را طوری بازآرایی کنید که اصطلاحات انگلیسی درون متون فارسی هرگز ترتیب پاراگراف را به هم نریزند.",
    prerequisites: ["fe-2", "fe-18"]
  }
];

// 2. BACKEND DEVELOPER (Currently 18 -> Add 12)
const beAdditions = [
  {
    id: "be-19",
    title: "کشینگ پیشرفته با Redis",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "بهبود سرعت کوئری‌های تکراری درخت مهارت با ذخیره در حافظه Redis.",
    resources: [
      { title: "Redis University", url: "https://university.redis.com/", type: "LINK" }
    ],
    task: "پاسخ روت دریافت کل مسیرهای یادگیری را به مدت ۶۰ ثانیه در ردیس کش کنید.",
    prerequisites: ["be-9", "be-12"]
  },
  {
    id: "be-20",
    title: "صف پردازش ناهمگام با BullMQ",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "پردازش ارسال پیامک و اعلان‌ها خارج از چرخه اصلی درخواست و پاسخ.",
    resources: [
      { title: "BullMQ Guide", url: "https://docs.bullmq.io/", type: "LINK" }
    ],
    task: "سیستم ارسال پیامک به منتور هنگام تحویل کار دانش‌آموز را به یک صف پس‌زمینه BullMQ منتقل کنید.",
    prerequisites: ["be-19"]
  },
  {
    id: "be-21",
    title: "مستندسازی استاندارد با Swagger / OpenAPI",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "تولید خودکار سند تعاملی APIها در آدرس /api/docs.",
    resources: [
      { title: "NestJS OpenAPI Swagger", url: "https://docs.nestjs.com/openapi/introduction", type: "LINK" }
    ],
    task: "تمام اندپوینت‌های ماژول رادمپ‌ها و نودها را با دکوراتورهای Swagger کامل مستند کنید.",
    prerequisites: ["be-12"]
  },
  {
    id: "be-22",
    title: "تست‌نویسی یکپارچه‌سازی (Integration Testing) در NestJS",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "اجرای تست‌های سرتاسری کنترلرها و دیتابیس با Jest و Supertest.",
    resources: [
      { title: "NestJS Testing Docs", url: "https://docs.nestjs.com/fundamentals/testing", type: "LINK" }
    ],
    task: "یک فایل تست e2e برای فرایند ورود کاربر و اعتبارسنجی توکن jwt بنویسید.",
    prerequisites: ["be-14"]
  },
  {
    id: "be-23",
    title: "کانتینرسازی سرویس با Docker و Docker Compose",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "ایجاد ایمیج کانتینر برای بک‌اند و راه‌اندازی دیتابیس پستگرس و ردیس در محیط ایزوله.",
    resources: [
      { title: "Docker Get Started", url: "https://docs.docker.com/get-started/", type: "LINK" }
    ],
    task: "یک فایل docker-compose.yml برای راه‌اندازی دیتابیس، ردیس و بک‌اند ادوکاد آماده کنید.",
    prerequisites: ["be-1"]
  },
  {
    id: "be-24",
    title: "لاگینگ و رصد خطاها با Winston و Sentry",
    level: "خوب-است-بدانی",
    tier: "حرفه‌ای",
    description: "ثبت ساختاریافته وقایع سرور و ارسال لاگ‌های کرش به پنل مانیتورینگ.",
    resources: [
      { title: "Sentry for Node.js", url: "https://docs.sentry.io/platforms/node/", type: "LINK" }
    ],
    task: "یک Exception Filter سراسری در نست بنویسید که تمام خطاهای کد ۵۰۰ را در فایل لاگ ثبت کند.",
    prerequisites: ["be-13"]
  },
  {
    id: "be-25",
    title: "پایگاه‌های داده NoSQL و کاربرد MongoDB در محصولات رکاد",
    level: "خوب-است-بدانی",
    tier: "حرفه‌ای",
    description: "ذخیره لاگ‌ها و داده‌های بدون ساختار در پایگاه داده سندی.",
    resources: [
      { title: "MongoDB University", url: "https://university.mongodb.com/", type: "LINK" }
    ],
    task: "یک ساختار برای ثبت فعالیت‌های کلیک کاربران رویدادهای رکاد در کالکشن مونگو طراحی کنید.",
    prerequisites: ["be-9"]
  },
  {
    id: "be-26",
    title: "محدودسازی درخواست‌ها (Rate Limiting) و Throttling",
    level: "ضروری",
    tier: "حرفه‌ای",
    description: "جلوگیری از حملات Brute Force و سوءاستفاده از API با تروتلینگ هوشمند.",
    resources: [
      { title: "NestJS Throttler", url: "https://docs.nestjs.com/security/rate-limiting", type: "LINK" }
    ],
    task: "اندپوینت ارسال رمز عبور را طوری محدود کنید که حداکثر ۵ بار در دقیقه از یک آی‌پی قابل فراخوانی باشد.",
    prerequisites: ["be-14"]
  },
  {
    id: "be-27",
    title: "ارتباطات بین‌سرویسی با gRPC و Microservices",
    level: "خوب-است-بدانی",
    tier: "مربی",
    description: "استفاده از پروتکل باینری gRPC برای ارتباط با تاخیر کم بین میکروسرویس‌ها.",
    resources: [
      { title: "gRPC Official Docs", url: "https://grpc.io/docs/", type: "LINK" }
    ],
    task: "سرویس پیامکی را به عنوان یک میکروسرویس مجزا با قرارداد proto تعریف و به سیستم متصل کنید.",
    prerequisites: ["be-20"]
  },
  {
    id: "be-28",
    title: "مدیریت فایل و اتصال به Storage ابری",
    level: "ضروری",
    tier: "مربی",
    description: "آپلود امن فایل‌های تحویل مأموریت در باکت‌های ابری سازگار با S3 یا Supabase Storage.",
    resources: [
      { title: "AWS S3 SDK for JavaScript", url: "https://docs.aws.amazon.com/sdk-for-javascript/", type: "LINK" }
    ],
    task: "سرویس آپلود فایل فشرده پروژه تحویلی دانش‌آموزان به باکت ابری سوپابیس را پیاده کنید.",
    prerequisites: ["be-13"]
  },
  {
    id: "be-29",
    title: "اتصال به درگاه‌های پرداخت آنلاین (Payment Gateways)",
    level: "ضروری",
    tier: "مربی",
    description: "تولید توکن پرداخت، وریفای کردن تراکنش و مدیریت وب‌هوک‌های تسویه‌حساب سفارشات کافه رکاد.",
    resources: [
      { title: "ZarinPal API Documentation", url: "https://www.zarinpal.com/docs/", type: "LINK" }
    ],
    task: "اندپوینت ارسال کاربر به درگاه پرداخت و متد اعتبارسنجی بازگشت از درگاه برای منوی کافه را بنویسید.",
    prerequisites: ["be-10", "be-14"]
  },
  {
    id: "be-30",
    title: "خط لوله CI/CD و استقرار بدون وقفه (Zero-Downtime)",
    level: "ضروری",
    tier: "مربی",
    description: "اجرای خودکار تست‌ها و دیپلوی روی سرور پروداکشن با GitHub Actions و PM2.",
    resources: [
      { title: "GitHub Actions Guide", url: "https://docs.github.com/en/actions", type: "LINK" }
    ],
    task: "یک فایل workflow در گیت‌هاب بسازید که با هر پوش روی برنچ main، تست‌ها اجرا شده و نسخه جدید روی سرور بیلد شود.",
    prerequisites: ["be-22", "be-23"]
  }
];

// Execute expansions
expandRoadmap('frontend-dev.json', feAdditions);
expandRoadmap('backend-dev.json', beAdditions);
console.log('Finished updating frontend and backend roadmaps.');
