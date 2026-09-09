import { PrismaClient, EnrollmentStatus, NodeProgressStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Enrolling students into the 9 roadmaps...');

  const amir = await prisma.user.findFirst({ where: { username: 'amir_student' } });
  const fatemeh = await prisma.user.findFirst({ where: { username: 'fatemeh_student' } });
  const aliMentor = await prisma.user.findFirst({ where: { username: 'ali_mentor' } });
  const saraMentor = await prisma.user.findFirst({ where: { username: 'sara_mentor' } });

  const pairs = [
    { student: amir, mentor: aliMentor, slug: 'frontend-dev' },
    { student: amir, mentor: aliMentor, slug: 'backend-dev' },
    { student: amir, mentor: aliMentor, slug: 'uiux-designer' },
    { student: amir, mentor: aliMentor, slug: 'digital-marketer' },
    { student: fatemeh, mentor: saraMentor, slug: 'graphic-brand-designer' },
    { student: fatemeh, mentor: saraMentor, slug: 'video-editor' },
    { student: fatemeh, mentor: saraMentor, slug: 'motion-graphic-designer' },
    { student: fatemeh, mentor: saraMentor, slug: 'content-creator' },
    { student: fatemeh, mentor: saraMentor, slug: 'event-ops-coordinator' },
  ];

  for (const item of pairs) {
    if (!item.student || !item.mentor) continue;
    const rm = await prisma.roadmap.findUnique({
      where: { slug: item.slug },
      include: { nodes: { include: { prerequisites: true } } },
    });
    if (!rm) continue;

    const existing = await prisma.userRoadmap.findUnique({
      where: {
        studentId_roadmapId: {
          studentId: item.student.id,
          roadmapId: rm.id,
        },
      },
    });

    if (!existing) {
      await prisma.userRoadmap.create({
        data: {
          studentId: item.student.id,
          roadmapId: rm.id,
          mentorId: item.mentor.id,
          status: EnrollmentStatus.IN_PROGRESS,
          roadmapVersionAtEnrollment: rm.version,
        },
      });
      console.log(`Enrolled ${item.student.username} in ${rm.slug}`);
    }

    // Initialize NodeProgress
    for (const node of rm.nodes) {
      const hasPrereq = node.prerequisites.length > 0;
      await prisma.nodeProgress.upsert({
        where: {
          userId_nodeId: {
            userId: item.student.id,
            nodeId: node.id,
          },
        },
        create: {
          userId: item.student.id,
          nodeId: node.id,
          status: hasPrereq ? NodeProgressStatus.LOCKED : NodeProgressStatus.UNLOCKED,
        },
        update: {},
      });
    }
  }

  console.log('Enrollment & NodeProgress sync complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
