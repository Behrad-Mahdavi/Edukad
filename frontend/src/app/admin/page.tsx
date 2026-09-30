'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { RoadmapBuilder } from '@/components/admin/RoadmapBuilder';
import { toPersianDigits, formatToJalali } from '@/lib/utils';
import { RokadLoader } from '@/components/ui/Loading';
import {
  ShieldCheck,
  UserPlus,
  Users,
  Layers,
  Award,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Workflow,
  GraduationCap,
  Calendar,
} from 'lucide-react';

export default function AdminPage() {
  const { user, isSuperAdmin, loading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'studio' | 'enrollments' | 'users'>('studio');

  const [users, setUsers] = useState<any[]>([]);
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  // Enrollment Form State
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedRoadmap, setSelectedRoadmap] = useState('');
  const [selectedMentor, setSelectedMentor] = useState('');
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [enrollMsg, setEnrollMsg] = useState<string | null>(null);
  const [enrollError, setEnrollError] = useState<string | null>(null);

  // Level / Role update modal
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [updateRole, setUpdateRole] = useState<string>('STUDENT');
  const [updateLevel, setUpdateLevel] = useState<string>('NOVICE');
  const [updateLoading, setUpdateLoading] = useState(false);

  const loadData = async () => {
    setFetching(true);
    try {
      const [uList, rList, eList] = await Promise.all([
        api.users.getAll(),
        api.roadmaps.getAll(),
        api.enrollments.getAll(),
      ]);
      setUsers(uList);
      setRoadmaps(rList);
      setEnrollments(eList);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (!loading && (!user || !isSuperAdmin)) {
      router.push('/');
      return;
    }
    if (user && isSuperAdmin) {
      loadData();
    }
  }, [user, isSuperAdmin, loading, router]);

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !selectedRoadmap) {
      setEnrollError('انتخاب دانش‌آموز و مسیر مهارتی الزامی است.');
      return;
    }

    setEnrollLoading(true);
    setEnrollMsg(null);
    setEnrollError(null);

    try {
      await api.enrollments.enrollStudent({
        studentId: selectedStudent,
        roadmapId: selectedRoadmap,
        mentorId: selectedMentor || undefined,
      });
      setEnrollMsg('ثبت‌نام با موفقیت انجام شد و گره‌های اولیه برای دانش‌آموز باز شدند.');
      setSelectedStudent('');
      setSelectedRoadmap('');
      setSelectedMentor('');
      loadData();
    } catch (err: any) {
      setEnrollError(err.message);
    } finally {
      setEnrollLoading(false);
    }
  };

  const handleUpdateUser = async (userId: string) => {
    setUpdateLoading(true);
    try {
      await api.users.update(userId, {
        role: updateRole,
        level: updateLevel,
      });
      setUpdatingUserId(null);
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading || fetching) {
    return (
      <RokadLoader
        title="در حال بارگذاری پنل راهبری و مدیریت کل..."
        subtitle="دریافت کاربران، استودیو گراف مسیرها و داده‌های سیستمی"
        type="admin"
      />
    );
  }


  const students = users.filter((u) => u.role === 'STUDENT');
  const mentors = users.filter((u) => u.role === 'MENTOR' || u.role === 'SUPER_ADMIN');

  return (
    <div className="space-y-6 pb-16 text-right">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-female-light dark:bg-female-darker/60 text-female-darker dark:text-female-light text-xs font-bold mb-2 border border-female-normal/30">
            <ShieldCheck className="w-3.5 h-3.5 text-female-normal" />
            <span>پنل راهبری ارشد Edukad</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-sec dark:text-white">
            استودیو مسیرها، ثبت‌نام و سطوح مهارتی
          </h1>
          <p className="text-xs text-ink-normal/70 dark:text-gray-400 mt-1">
            طراحی و ویرایش مسیرهای یادگیری، ترسیم گره‌ها و پیش‌نیازها، ثبت‌نام و تخصیص منتور
          </p>
        </div>

        <button
          onClick={loadData}
          className="rokad-btn-outline px-3.5 py-2 text-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>بروزرسانی داده‌ها</span>
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('studio')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer border ${
            activeTab === 'studio'
              ? 'bg-sec text-white border-sec shadow-male dark:bg-primary dark:border-primary dark:shadow-ecosystem'
              : 'bg-white dark:bg-[#151C28] text-ink-normal dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50'
          }`}
        >
          <Workflow className="w-4 h-4" />
          <span>استودیو طراحی گراف و مسیرها</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 font-bold">
            {toPersianDigits(roadmaps.length)} مسیر
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('enrollments')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer border ${
            activeTab === 'enrollments'
              ? 'bg-primary text-white border-primary shadow-ecosystem'
              : 'bg-white dark:bg-[#151C28] text-ink-normal dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>ثبت‌نام دانش‌آموزان و منتور</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 font-bold">
            {toPersianDigits(enrollments.length)} ثبت‌نام
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer border ${
            activeTab === 'users'
              ? 'bg-female-normal text-white border-female-normal shadow-female'
              : 'bg-white dark:bg-[#151C28] text-ink-normal dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>مدیریت نقش‌ها و سطوح</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 font-bold">
            {toPersianDigits(users.length)} کاربر
          </span>
        </button>
      </div>

      {/* TAB 1: ROADMAP BUILDER STUDIO */}
      {activeTab === 'studio' && (
        <div className="space-y-4">
          <RoadmapBuilder roadmaps={roadmaps} onRefresh={loadData} />
        </div>
      )}

      {/* TAB 2: ENROLLMENTS */}
      {activeTab === 'enrollments' && (
        <div className="space-y-8">
          {/* Enrollment Form */}
          <div className="rokad-card p-6 bg-white dark:bg-[#151C28] border border-gray-200 dark:border-gray-800 shadow-male dark:shadow-ecosystem">
            <h2 className="font-black text-lg text-sec dark:text-white mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              <span>ثبت‌نام دانش‌آموز در مسیر جدید و تخصیص منتور</span>
            </h2>

            {enrollError && (
              <div className="mb-4 p-3 rounded-xl bg-female-light dark:bg-female-darker/40 border border-female-normal/40 text-female-darker dark:text-female-light text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{enrollError}</span>
              </div>
            )}

            {enrollMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{enrollMsg}</span>
              </div>
            )}

            <form onSubmit={handleEnrollSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block font-bold text-xs text-sec dark:text-white">
                  انتخاب دانش‌آموز *
                </label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAFAFA] dark:bg-[#1C2536] text-xs font-medium focus:border-primary focus:outline-none transition-all cursor-pointer"
                >
                  <option value="">-- انتخاب کنید --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-xs text-sec dark:text-white">
                  انتخاب مسیر یادگیری *
                </label>
                <select
                  value={selectedRoadmap}
                  onChange={(e) => setSelectedRoadmap(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAFAFA] dark:bg-[#1C2536] text-xs font-medium focus:border-primary focus:outline-none transition-all cursor-pointer"
                >
                  <option value="">-- انتخاب کنید --</option>
                  {roadmaps.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({r.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-xs text-sec dark:text-white">
                  تخصیص منتور ناظر (اختیاری)
                </label>
                <select
                  value={selectedMentor}
                  onChange={(e) => setSelectedMentor(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAFAFA] dark:bg-[#1C2536] text-xs font-medium focus:border-primary focus:outline-none transition-all cursor-pointer"
                >
                  <option value="">-- بدون منتور اختصاصی --</option>
                  {mentors.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.fullName} ({m.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-3 pt-2">
                <button
                  type="submit"
                  disabled={enrollLoading}
                  className="rokad-btn-primary px-6 py-2.5 text-xs"
                >
                  {enrollLoading ? 'در حال ثبت‌نام...' : 'تایید ثبت‌نام و باز شدن گره‌های ریشه'}
                </button>
              </div>
            </form>
          </div>

          {/* Existing Enrollments Table */}
          <div className="rokad-card p-6 bg-white dark:bg-[#151C28] border border-gray-200 dark:border-gray-800 shadow-male dark:shadow-ecosystem">
            <h2 className="font-black text-lg text-sec dark:text-white mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-female-normal" />
              <span>فهرست دانش‌آموزان ثبت‌نام شده ({toPersianDigits(enrollments.length)})</span>
            </h2>

            {enrollments.length === 0 ? (
              <p className="text-xs text-ink-normal/60 dark:text-gray-400 py-4 text-center">هنوز هیچ ثبت‌نامی انجام نشده است.</p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1C2536] text-sec dark:text-white font-bold">
                      <th className="p-3">دانش‌آموز</th>
                      <th className="p-3">شماره تماس</th>
                      <th className="p-3">مسیر یادگیری</th>
                      <th className="p-3">دپارتمان</th>
                      <th className="p-3">منتور ناظر</th>
                      <th className="p-3">وضعیت</th>
                      <th className="p-3">تاریخ ثبت‌نام</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-ink-normal/80 dark:text-gray-300">
                    {enrollments.map((e) => (
                      <tr key={e.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors">
                        <td className="p-3 font-bold text-sec dark:text-white">{e.student?.fullName}</td>
                        <td className="p-3 ltr text-right font-mono text-gray-500">{toPersianDigits(e.student?.phone)}</td>
                        <td className="p-3 font-bold text-primary">{e.roadmap?.title}</td>
                        <td className="p-3">{e.roadmap?.department}</td>
                        <td className="p-3">
                          {e.mentor ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-ecosystem-light dark:bg-ecosystem-darker/60 text-ecosystem-darker dark:text-ecosystem-light font-bold border border-primary/30">
                              {e.mentor.fullName}
                            </span>
                          ) : (
                            <span className="text-gray-400">بدون منتور</span>
                          )}
                        </td>
                        <td className="p-3">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-bold text-[11px]">
                            {e.status}
                          </span>
                        </td>
                        <td className="p-3 text-[11px] text-gray-500">
                          {formatToJalali(e.enrolledAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: USERS & RBAC / LEVEL MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="rokad-card p-6 bg-white dark:bg-[#151C28] border border-gray-200 dark:border-gray-800 shadow-male dark:shadow-ecosystem">
          <h2 className="font-black text-lg text-sec dark:text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-female-normal" />
            <span>مدیریت نقش‌های سیستمی و سطح‌های مهارتی</span>
          </h2>

          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1C2536] text-sec dark:text-white font-bold">
                  <th className="p-3">نام و نام خانوادگی</th>
                  <th className="p-3">شماره تماس</th>
                  <th className="p-3">دپارتمان</th>
                  <th className="p-3">نقش دسترسی (Role)</th>
                  <th className="p-3">سطح مهارتی (Level)</th>
                  <th className="p-3">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-ink-normal/80 dark:text-gray-300">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="p-3 font-bold text-sec dark:text-white">{u.fullName}</td>
                    <td className="p-3 ltr text-right font-mono text-gray-500">{toPersianDigits(u.phone)}</td>
                    <td className="p-3">{u.department}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/15 text-primary dark:text-ecosystem-light font-bold">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-college-light dark:bg-college-darker/60 text-college-darker dark:text-college-light font-bold border border-college-normal/30">
                        {u.level || '—'}
                      </span>
                    </td>
                    <td className="p-3">
                      {updatingUserId === u.id ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={updateRole}
                            onChange={(e) => setUpdateRole(e.target.value)}
                            className="px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1C2536] text-[11px]"
                          >
                            <option value="STUDENT">STUDENT</option>
                            <option value="MENTOR">MENTOR</option>
                            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                          </select>
                          <select
                            value={updateLevel}
                            onChange={(e) => setUpdateLevel(e.target.value)}
                            className="px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1C2536] text-[11px]"
                          >
                            <option value="NOVICE">NOVICE</option>
                            <option value="PRACTITIONER">PRACTITIONER</option>
                            <option value="TEAM_LEAD">TEAM_LEAD</option>
                            <option value="MENTOR_CANDIDATE">MENTOR_CANDIDATE</option>
                          </select>
                          <button
                            onClick={() => handleUpdateUser(u.id)}
                            disabled={updateLoading}
                            className="rokad-btn-primary px-2.5 py-1 text-[10px]"
                          >
                            ذخیره
                          </button>
                          <button
                            onClick={() => setUpdatingUserId(null)}
                            className="rokad-btn-outline px-2 py-1 text-[10px]"
                          >
                            لغو
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setUpdatingUserId(u.id);
                            setUpdateRole(u.role);
                            setUpdateLevel(u.level || 'NOVICE');
                          }}
                          className="text-primary font-bold hover:underline cursor-pointer"
                        >
                          ویرایش سطح / نقش
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
