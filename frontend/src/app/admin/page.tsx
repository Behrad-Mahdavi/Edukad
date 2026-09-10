'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { RoadmapBuilder } from '@/components/admin/RoadmapBuilder';
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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center font-bold text-slate-500 animate-pulse flex items-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-secondary" />
          <span>در حال بارگذاری پنل راهبری ارشد...</span>
        </div>
      </div>
    );
  }

  const students = users.filter((u) => u.role === 'STUDENT');
  const mentors = users.filter((u) => u.role === 'MENTOR' || u.role === 'SUPER_ADMIN');

  return (
    <div className="space-y-6 pb-16 text-right">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-black mb-2 border border-accent/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            پنل راهبری ارشد Edukad
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-primary">
            استودیو مسیرها، ثبت‌نام و سطوح مهارتی
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            طراحی و ویرایش مسیرهای یادگیری، ترسیم گره‌ها و پیش‌نیازها، ثبت‌نام و تخصیص منتور
          </p>
        </div>

        <button
          onClick={loadData}
          className="px-3.5 py-2 rounded-xl border-2 border-primary bg-white text-primary text-xs font-bold shadow-[2px_3px_0_0_#21295a] hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          بروزرسانی داده‌ها
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b-2 border-primary/20 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('studio')}
          className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'studio'
              ? 'bg-primary text-white border-2 border-primary shadow-[3px_4px_0_0_#58bdaf]'
              : 'bg-white text-primary border-2 border-transparent hover:bg-slate-100'
          }`}
        >
          <Workflow className="w-4 h-4" />
          استودیو طراحی گراف و مسیرها (Visual Builder)
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 font-bold">
            {roadmaps.length} مسیر
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('enrollments')}
          className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'enrollments'
              ? 'bg-secondary text-white border-2 border-primary shadow-[3px_4px_0_0_#21295a]'
              : 'bg-white text-primary border-2 border-transparent hover:bg-slate-100'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          ثبت‌نام دانش‌آموزان و تخصیص منتور
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 font-bold">
            {enrollments.length} ثبت‌نام
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'users'
              ? 'bg-accent text-white border-2 border-primary shadow-[3px_4px_0_0_#21295a]'
              : 'bg-white text-primary border-2 border-transparent hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          مدیریت نقش‌ها و سطوح (RBAC)
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 font-bold">
            {users.length} کاربر
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
          <div className="sticker-card p-6 bg-white border-2 border-primary">
            <h2 className="font-black text-lg text-primary mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-secondary" />
              ثبت‌نام دانش‌آموز در مسیر جدید و تخصیص منتور
            </h2>

            {enrollError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border-2 border-rose-400 text-rose-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {enrollError}
              </div>
            )}

            {enrollMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border-2 border-emerald-400 text-emerald-700 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                {enrollMsg}
              </div>
            )}

            <form onSubmit={handleEnrollSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-xs text-primary mb-1.5">
                  انتخاب دانش‌آموز *
                </label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-primary bg-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="">-- انتخاب کنید --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-xs text-primary mb-1.5">
                  انتخاب مسیر یادگیری *
                </label>
                <select
                  value={selectedRoadmap}
                  onChange={(e) => setSelectedRoadmap(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-primary bg-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="">-- انتخاب کنید --</option>
                  {roadmaps.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({r.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-xs text-primary mb-1.5">
                  تخصیص منتور ناظر (اختیاری)
                </label>
                <select
                  value={selectedMentor}
                  onChange={(e) => setSelectedMentor(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-primary bg-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-secondary"
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
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary text-white font-black text-xs shadow-[3px_4px_0_0_#58bdaf] hover:-translate-y-0.5 transition-transform disabled:opacity-50 cursor-pointer"
                >
                  {enrollLoading ? 'در حال ثبت‌نام...' : 'تایید ثبت‌نام و باز شدن گره‌های ریشه'}
                </button>
              </div>
            </form>
          </div>

          {/* Existing Enrollments Table */}
          <div className="sticker-card p-6 bg-white border-2 border-primary">
            <h2 className="font-black text-lg text-primary mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-accent" />
              فهرست دانش‌آموزان ثبت‌نام شده در مسیرها ({enrollments.length})
            </h2>

            {enrollments.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">هنوز هیچ ثبت‌نامی انجام نشده است.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b-2 border-primary bg-bg-lavender text-primary font-black">
                      <th className="p-3">دانش‌آموز</th>
                      <th className="p-3">شماره تماس</th>
                      <th className="p-3">مسیر یادگیری</th>
                      <th className="p-3">دپارتمان</th>
                      <th className="p-3">منتور ناظر</th>
                      <th className="p-3">وضعیت</th>
                      <th className="p-3">تاریخ ثبت‌نام</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {enrollments.map((e) => (
                      <tr key={e.id} className="hover:bg-slate-50">
                        <td className="p-3 font-extrabold text-primary">{e.student?.fullName}</td>
                        <td className="p-3 ltr text-right font-mono">{e.student?.phone}</td>
                        <td className="p-3 font-bold text-secondary-dark">{e.roadmap?.title}</td>
                        <td className="p-3">{e.roadmap?.department}</td>
                        <td className="p-3">
                          {e.mentor ? (
                            <span className="px-2 py-0.5 rounded bg-bg-mint text-secondary-dark font-bold">
                              {e.mentor.fullName}
                            </span>
                          ) : (
                            <span className="text-slate-400">بدون منتور</span>
                          )}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold text-[11px]">
                            {e.status}
                          </span>
                        </td>
                        <td className="p-3 text-[11px] text-slate-500 ltr text-right font-mono">
                          {new Date(e.enrolledAt).toLocaleDateString('fa-IR')}
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
        <div className="sticker-card p-6 bg-white border-2 border-primary">
          <h2 className="font-black text-lg text-primary mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-accent" />
            مدیریت نقش‌های سیستمی و سطح‌های مهارتی
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b-2 border-primary bg-bg-lavender text-primary font-black">
                  <th className="p-3">نام و نام خانوادگی</th>
                  <th className="p-3">شماره تماس</th>
                  <th className="p-3">دپارتمان</th>
                  <th className="p-3">نقش دسترسی (Role)</th>
                  <th className="p-3">سطح مهارتی (Level)</th>
                  <th className="p-3">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="p-3 font-extrabold text-primary">{u.fullName}</td>
                    <td className="p-3 ltr text-right font-mono">{u.phone}</td>
                    <td className="p-3">{u.department}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-secondary/20 text-secondary-dark font-bold">
                        {u.level || '—'}
                      </span>
                    </td>
                    <td className="p-3">
                      {updatingUserId === u.id ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={updateRole}
                            onChange={(e) => setUpdateRole(e.target.value)}
                            className="px-2 py-1 rounded border border-primary text-[11px]"
                          >
                            <option value="STUDENT">STUDENT</option>
                            <option value="MENTOR">MENTOR</option>
                            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                          </select>
                          <select
                            value={updateLevel}
                            onChange={(e) => setUpdateLevel(e.target.value)}
                            className="px-2 py-1 rounded border border-primary text-[11px]"
                          >
                            <option value="NOVICE">NOVICE</option>
                            <option value="PRACTITIONER">PRACTITIONER</option>
                            <option value="TEAM_LEAD">TEAM_LEAD</option>
                            <option value="MENTOR_CANDIDATE">MENTOR_CANDIDATE</option>
                          </select>
                          <button
                            onClick={() => handleUpdateUser(u.id)}
                            disabled={updateLoading}
                            className="px-2.5 py-1 rounded bg-emerald-600 text-white font-bold text-[10px] cursor-pointer"
                          >
                            ذخیره
                          </button>
                          <button
                            onClick={() => setUpdatingUserId(null)}
                            className="px-2 py-1 rounded bg-slate-200 text-slate-600 text-[10px] cursor-pointer"
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
                          className="text-secondary font-bold hover:underline cursor-pointer"
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
