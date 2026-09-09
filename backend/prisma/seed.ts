import {
  PrismaClient,
  Role,
  Level,
  Department,
  RoadmapStatus,
  ResourceType,
  NodeProgressStatus,
  SubmissionOutcome,
  NotificationType,
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Edukad database seed...');

  // 1. Clean existing data in reverse order
  await prisma.notification.deleteMany();
  await prisma.nodeSubmission.deleteMany();
  await prisma.nodeProgress.deleteMany();
  await prisma.userRoadmap.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.nodePrerequisite.deleteMany();
  await prisma.node.deleteMany();
  await prisma.roadmap.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  // 2. Create Users
  const superAdmin = await prisma.user.create({
    data: {
      fullName: 'مدیر سیستم رکاد',
      phone: '+989120000001',
      username: 'admin',
      email: 'admin@rokad.ir',
      passwordHash,
      role: Role.SUPER_ADMIN,
      level: null,
      department: Department.ENGINEERS,
    },
  });

  const frontendMentor = await prisma.user.create({
    data: {
      fullName: 'علی کاظمی',
      phone: '+989120000002',
      username: 'ali_mentor',
      email: 'ali@rokad.ir',
      passwordHash,
      role: Role.MENTOR,
      level: Level.TEAM_LEAD,
      department: Department.ENGINEERS,
    },
  });

  const mediaMentor = await prisma.user.create({
    data: {
      fullName: 'سارا حسینی',
      phone: '+989120000003',
      username: 'sara_mentor',
      email: 'sara@rokad.ir',
      passwordHash,
      role: Role.MENTOR,
      level: Level.TEAM_LEAD,
      department: Department.ARTISTS,
    },
  });

  const studentAmir = await prisma.user.create({
    data: {
      fullName: 'امیررضا رضایی',
      phone: '+989120000004',
      username: 'amir_student',
      email: 'amir@rokad.ir',
      passwordHash,
      role: Role.STUDENT,
      level: Level.NOVICE,
      department: Department.ENGINEERS,
    },
  });

  const studentFatemeh = await prisma.user.create({
    data: {
      fullName: 'فاطمه نوری',
      phone: '+989120000005',
      username: 'fatemeh_student',
      email: 'fatemeh@rokad.ir',
      passwordHash,
      role: Role.STUDENT,
      level: Level.NOVICE,
      department: Department.ARTISTS,
    },
  });

  console.log('✅ Users created.');

  // 3. Create Roadmap 1: Frontend Engineering
  const frontendRoadmap = await prisma.roadmap.create({
    data: {
      title: 'مهندسی فرانت‌اند وب',
      slug: 'frontend-engineering',
      description: 'مسیر جامع تبدیل شدن به فرانت‌اند دولوپر برای پروژه‌های نرم‌افزاری رکاد (کافه، ایونت، پلتفرم)',
      department: Department.ENGINEERS,
      status: RoadmapStatus.PUBLISHED,
      version: 1,
    },
  });

  const feNode1 = await prisma.node.create({
    data: {
      roadmapId: frontendRoadmap.id,
      title: 'اصول وب و HTML/CSS مدرن',
      description: 'درک ساختار صفحات وب، تگ‌های سمانتیک، فلکس‌باکس و گرید برای پیاده‌سازی ظاهر تمیز.',
      positionX: 100,
      positionY: 200,
      hasDeliverable: true,
      resources: {
        create: [
          {
            title: 'مستندات سمانتیک HTML در MDN',
            type: ResourceType.LINK,
            content: 'https://developer.mozilla.org/en-US/docs/Glossary/Semantics',
          },
          {
            title: 'راهنمای تعاملی Flexbox Froggy',
            type: ResourceType.LINK,
            content: 'https://flexboxfroggy.com/',
          },
          {
            title: 'شرح مأموریت کافه رکاد',
            type: ResourceType.MARKDOWN_TEXT,
            content: `### مأموریت: طراحی منوی دیجیتال کافه رکاد
یک صفحه وب تک‌صفحه‌ای با HTML و CSS بسازید که:
1. دسته‌بندی نوشیدنی‌های گرم، سرد و دسرها را به صورت مرتب با Grid نمایش دهد.
2. کاملاً رسپانسیو باشد و روی موبایل به زیبایی کار کند.
3. کد را در گیت‌هاب یا لینک پیش‌نمایش قرار دهید.`,
          },
        ],
      },
    },
  });

  const feNode2 = await prisma.node.create({
    data: {
      roadmapId: frontendRoadmap.id,
      title: 'جاوااسکریپت کاربردی و DOM',
      description: 'تعامل با صفحه، رویدادها (Events)، فیلتر کردن داده‌ها و کار با آرایه‌ها.',
      positionX: 400,
      positionY: 100,
      hasDeliverable: true,
      resources: {
        create: [
          {
            title: 'آموزش جاوااسکریپت در javascript.info',
            type: ResourceType.LINK,
            content: 'https://javascript.info/',
          },
          {
            title: 'شرح مأموریت فیلتر منو',
            type: ResourceType.MARKDOWN_TEXT,
            content: 'به منوی مرحله قبل فیلتر جستجوی زنده بر اساس نام آیتم و محاسبه مجموع قیمت آیتم‌های انتخابی اضافه کنید.',
          },
        ],
      },
    },
  });

  const feNode3 = await prisma.node.create({
    data: {
      roadmapId: frontendRoadmap.id,
      title: 'گیت و گیت‌هاب تیمی',
      description: 'آشنایی با شاخه‌بندی (Branching)، پول ریکوئست (PR) و رفع تعارض‌ها در پروژه تیمی.',
      positionX: 400,
      positionY: 300,
      hasDeliverable: false,
      resources: {
        create: [
          {
            title: 'مستندات Git Handbook',
            type: ResourceType.LINK,
            content: 'https://guides.github.com/introduction/git-handbook/',
          },
          {
            title: 'چک‌لیست استانداردهای گیت رکاد',
            type: ResourceType.MARKDOWN_TEXT,
            content: 'این گره فاقد تحویل کار است. پس از مطالعه چک‌لیست و بررسی قوانین commit در تیم، گره را تکمیل کنید.',
          },
        ],
      },
    },
  });

  const feNode4 = await prisma.node.create({
    data: {
      roadmapId: frontendRoadmap.id,
      title: 'مبانی React و هوک‌های پایه',
      description: 'یادگیری ساختار کامپوننتی، State، Props و هوک‌های useState و useEffect.',
      positionX: 700,
      positionY: 100,
      hasDeliverable: true,
      resources: {
        create: [
          {
            title: 'مستندات رسمی React',
            type: ResourceType.LINK,
            content: 'https://react.dev/learn',
          },
          {
            title: 'مأموریت: بازنویسی اپلیکیشن منو با React',
            type: ResourceType.MARKDOWN_TEXT,
            content: 'منوی کافه را به صورت یک SPA با React و کامپوننت‌های مجزا برای کارت محصول و سبد خرید بازنویسی کنید.',
          },
        ],
      },
    },
  });

  const feNode5 = await prisma.node.create({
    data: {
      roadmapId: frontendRoadmap.id,
      title: 'مدیریت استیت و اتصال به API',
      description: 'ارسال درخواست با fetch/axios، مدیریت لودینگ، خطاها و فرم‌های پویا.',
      positionX: 1000,
      positionY: 200,
      hasDeliverable: true,
      resources: {
        create: [
          {
            title: 'راهنمای Fetch API در MDN',
            type: ResourceType.LINK,
            content: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API',
          },
        ],
      },
    },
  });

  // Prerequisites for Frontend
  await prisma.nodePrerequisite.createMany({
    data: [
      { nodeId: feNode2.id, prerequisiteNodeId: feNode1.id },
      { nodeId: feNode3.id, prerequisiteNodeId: feNode1.id },
      { nodeId: feNode4.id, prerequisiteNodeId: feNode2.id },
      { nodeId: feNode5.id, prerequisiteNodeId: feNode4.id },
      { nodeId: feNode5.id, prerequisiteNodeId: feNode3.id },
    ],
  });

  console.log('✅ Frontend Roadmap & Nodes created.');

  // 4. Create Roadmap 2: Event Media & Editing
  const mediaRoadmap = await prisma.roadmap.create({
    data: {
      title: 'عکاسی و تدوین رویداد',
      slug: 'event-media-editing',
      description: 'مسیر تخصصی پوشش تصویری و تولید محتوای ویدیویی رویدادها، همایش‌ها و کارگاه‌های رکاد',
      department: Department.ARTISTS,
      status: RoadmapStatus.PUBLISHED,
      version: 1,
    },
  });

  const mediaNode1 = await prisma.node.create({
    data: {
      roadmapId: mediaRoadmap.id,
      title: 'مثلث نوردهی و عکاسی دستی',
      description: 'تسلط بر ISO، سرعت شاتر، و دیافراگم در دوربین‌های عکاسی در شرایط نوری سالن‌های ایونت.',
      positionX: 100,
      positionY: 200,
      hasDeliverable: true,
      resources: {
        create: [
          {
            title: 'ویدیوی آموزشی مثلث نوردهی',
            type: ResourceType.LINK,
            content: 'https://youtube.com/watch?v=exposure-triangle-guide',
          },
          {
            title: 'مأموریت: ثبت ۵ فریم در ایونت کافه',
            type: ResourceType.MARKDOWN_TEXT,
            content: 'با دوربین سالن ۵ فریم از سخنران، حضار، و تعاملات دوستانه با دیافراگم باز (f/2.8 یا f/1.8) ثبت و در درایو آپلود کنید.',
          },
        ],
      },
    },
  });

  const mediaNode2 = await prisma.node.create({
    data: {
      roadmapId: mediaRoadmap.id,
      title: 'اصلاح رنگ و ادیت عکس رویداد',
      description: 'استفاده از Lightroom برای تنظیم تراز سفیدی، کنتراست، و اعمال پریست‌های استاندارد رکاد.',
      positionX: 420,
      positionY: 100,
      hasDeliverable: true,
      resources: {
        create: [
          {
            title: 'پریست‌های رنگی برند رکاد',
            type: ResourceType.LINK,
            content: 'https://drive.google.com/rokad-presets',
          },
        ],
      },
    },
  });

  const mediaNode3 = await prisma.node.create({
    data: {
      roadmapId: mediaRoadmap.id,
      title: 'اصول صدابرداری محیطی و یقه‌ای',
      description: 'نصب میکروفون بیسیم برای مصاحبه‌شونده و کنترل لول‌های ورودی برای جلوگیری از دیستورت.',
      positionX: 420,
      positionY: 300,
      hasDeliverable: false,
      resources: {
        create: [
          {
            title: 'چک‌لیست صدا قبل از رکورد',
            type: ResourceType.MARKDOWN_TEXT,
            content: 'همیشه قبل از شروع مراسم ۲ دقیقه تست صدا در محیط با اسپیکرهای روشن انجام شود.',
          },
        ],
      },
    },
  });

  const mediaNode4 = await prisma.node.create({
    data: {
      roadmapId: mediaRoadmap.id,
      title: 'تدوین ریلز و تیزر رویداد',
      description: 'تدوین ریتمیک ویدیو متناسب با موزیک برای اینستاگرام و شبکه‌های اجتماعی رکاد.',
      positionX: 740,
      positionY: 200,
      hasDeliverable: true,
      resources: {
        create: [
          {
            title: 'راهنمای ریتم تدوین واید و کلوزآپ',
            type: ResourceType.LINK,
            content: 'https://youtube.com/watch?v=editing-rhythm',
          },
        ],
      },
    },
  });

  await prisma.nodePrerequisite.createMany({
    data: [
      { nodeId: mediaNode2.id, prerequisiteNodeId: mediaNode1.id },
      { nodeId: mediaNode3.id, prerequisiteNodeId: mediaNode1.id },
      { nodeId: mediaNode4.id, prerequisiteNodeId: mediaNode2.id },
      { nodeId: mediaNode4.id, prerequisiteNodeId: mediaNode3.id },
    ],
  });

  console.log('✅ Media Roadmap & Nodes created.');

  // 5. Enroll Student Amir in Frontend Roadmap with Mentor Ali
  const userRoadmapAmir = await prisma.userRoadmap.create({
    data: {
      studentId: studentAmir.id,
      roadmapId: frontendRoadmap.id,
      mentorId: frontendMentor.id,
      status: 'IN_PROGRESS',
      roadmapVersionAtEnrollment: 1,
    },
  });

  // Eagerly unlock root node for Amir
  const amirNode1Progress = await prisma.nodeProgress.create({
    data: {
      userId: studentAmir.id,
      nodeId: feNode1.id,
      status: NodeProgressStatus.SUBMITTED,
    },
  });

  // And Amir has already submitted work on feNode1 for mentor review!
  const amirSubmission = await prisma.nodeSubmission.create({
    data: {
      nodeProgressId: amirNode1Progress.id,
      submissionUrl: 'https://github.com/rokad-student/cafe-menu-responsive',
      submissionNote: 'سلام استاد، منوی دیجیتال کافه رکاد با فلکس‌باکس و گرید پیاده‌سازی شد و روی سایزهای مختلف تست شد. ممنون میشم نظرتون رو بفرمایید.',
      outcome: SubmissionOutcome.PENDING,
    },
  });

  await prisma.nodeProgress.update({
    where: { id: amirNode1Progress.id },
    data: { currentSubmissionId: amirSubmission.id },
  });

  // Create notification for Mentor Ali
  await prisma.notification.create({
    data: {
      userId: frontendMentor.id,
      type: NotificationType.NEW_SUBMISSION_FOR_REVIEW,
      title: 'تحویل کار جدید در انتظار بررسی',
      message: `${studentAmir.fullName} مأموریت گره «${feNode1.title}» را ارسال کرد.`,
      link: `/mentor`,
      relatedEntityId: amirSubmission.id,
      relatedEntityType: 'NodeSubmission',
    },
  });

  // 6. Enroll Student Fatemeh in Media Roadmap with Mentor Sara
  await prisma.userRoadmap.create({
    data: {
      studentId: studentFatemeh.id,
      roadmapId: mediaRoadmap.id,
      mentorId: mediaMentor.id,
      status: 'IN_PROGRESS',
      roadmapVersionAtEnrollment: 1,
    },
  });

  await prisma.nodeProgress.create({
    data: {
      userId: studentFatemeh.id,
      nodeId: mediaNode1.id,
      status: NodeProgressStatus.UNLOCKED,
    },
  });

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
