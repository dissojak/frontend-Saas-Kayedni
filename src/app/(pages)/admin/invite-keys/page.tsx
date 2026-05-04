"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Ban, CheckCircle2, Copy, KeyRound, Plus, RefreshCw, Search, Shield, Sparkles, Trash2, Users } from 'lucide-react';
import { Button } from '@components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Input } from '@components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { useLocale } from '@global/hooks/useLocale';
import { fetchInviteKeys, generateInviteKeys, revokeInviteKey, type AdminInviteKey, type AdminInviteKeyStatus } from './api';

type StatusFilter = 'ALL' | AdminInviteKeyStatus;

const STATUS_OPTIONS: Array<{ value: StatusFilter; label: string }> = [
  { value: 'ALL', label: 'All keys' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'USED', label: 'Used' },
  { value: 'REVOKED', label: 'Revoked' },
  { value: 'EXPIRED', label: 'Expired' },
];



function formatDate(value: string | null | undefined, locale: string): string {
  if (!value) return '—';

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsed);
}

function getStatusStyles(status: AdminInviteKeyStatus): string {
  switch (status) {
    case 'ACTIVE':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'USED':
      return 'bg-sky-50 text-sky-700 border-sky-200';
    case 'REVOKED':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'EXPIRED':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
}

export default function AdminInviteKeysPage() {
  const router = useRouter();
  const { locale } = useLocale();

  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [keys, setKeys] = useState<AdminInviteKey[]>([]);
  const [generatedKeys, setGeneratedKeys] = useState<string[]>([]);
  const [filter, setFilter] = useState<StatusFilter>('ALL');
  const [search, setSearch] = useState('');
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('accessToken');

      if (!storedUser || !token) {
        router.replace('/admin/login');
        return;
      }

      const parsedUser = JSON.parse(storedUser) as { role?: string; name?: string; email?: string };
      if (parsedUser.role !== 'ADMIN') {
        router.replace('/admin/login');
        return;
      }

      setUser({
        name: parsedUser.name ?? 'Admin User',
        email: parsedUser.email ?? 'admin@example.com',
      });
    } catch (err) {
      console.error('Invite key page auth check failed:', err);
      router.replace('/admin/login');
    }
  }, [router]);

  const loadKeys = async (status: StatusFilter = filter) => {
    setError(null);
    setLoading(true);

    try {
      const data = await fetchInviteKeys(status);
      setKeys(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load invite keys');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    void loadKeys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const visibleKeys = useMemo(() => {
    const query = search.trim().toLowerCase();
    return [...keys]
      .sort((a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)))
      .filter((item) => {
        if (!query) return true;
        return (
          String(item.id).includes(query) ||
          item.assignedEmail?.toLowerCase().includes(query) ||
          item.status.toLowerCase().includes(query) ||
          String(item.usedByUserId ?? '').includes(query)
        );
      });
  }, [keys, search]);

  const stats = useMemo(() => {
    const active = keys.filter((item) => item.status === 'ACTIVE').length;
    const used = keys.filter((item) => item.status === 'USED').length;
    const revoked = keys.filter((item) => item.status === 'REVOKED').length;
    const expired = keys.filter((item) => item.status === 'EXPIRED').length;

    return [
      { label: 'Total keys', value: keys.length, icon: KeyRound, tone: 'text-violet-600' },
      { label: 'Active', value: active, icon: CheckCircle2, tone: 'text-emerald-600' },
      { label: 'Used', value: used, icon: Users, tone: 'text-sky-600' },
      { label: 'Revoked / Expired', value: revoked + expired, icon: Ban, tone: 'text-rose-600' },
    ];
  }, [keys]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccess('Copied to clipboard');
      setTimeout(() => setSuccess(null), 1800);
    } catch {
      setError('Could not copy to clipboard');
    }
  };

  const handleGenerate = async () => {
    setError(null);
    setSuccess(null);
    setActionLoading(true);

    try {
      const rawCodes = await generateInviteKeys(count);
      setGeneratedKeys(rawCodes);
      setSuccess(`Generated ${rawCodes.length} invite code${rawCodes.length === 1 ? '' : 's'}`);
      
      // Fetch updated keys from database (no local storage)
      await new Promise((resolve) => setTimeout(resolve, 500)); // Wait a moment for backend
      await loadKeys(filter);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate invite keys');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRevoke = async (id: number) => {
    const confirmed = globalThis.window?.confirm('Revoke this invite key? It will stop working immediately.');
    if (!confirmed) return;

    setError(null);
    setActionLoading(true);

    try {
      await revokeInviteKey(id);
      setSuccess(`Invite key #${id} revoked`);
      await loadKeys(filter);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to revoke invite key');
    } finally {
      setActionLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-violet-600" />
          <p className="mt-4 text-sm text-slate-500">Checking admin session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
      <header className="border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-600">Admin tools</p>
            <h1 className="text-2xl font-bold">Invite key manager</h1>
            <p className="text-sm text-slate-500">Generate, copy, inspect usage, and revoke business invite keys.</p>
          </div>

          <div className="flex flex-col items-end gap-2 text-right">
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => void loadKeys()} disabled={loading || actionLoading}>
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin/control-panel">Back to panel</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-slate-200/70 bg-white/90 shadow-lg">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="mt-1 text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`rounded-full bg-slate-100 p-3 ${stat.tone}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {(error || success) && (
          <div className="mt-6 space-y-3">
            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {success}
              </div>
            )}
          </div>
        )}

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-slate-200/70 bg-white/90 shadow-xl">
            <CardHeader className="space-y-2 border-b border-slate-200/70 pb-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-violet-100 p-2 text-violet-700">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl">Generate new invite keys</CardTitle>
                  <CardDescription>Create one-time codes, then copy and send them outside the app.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 p-6 pt-6">
              <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">How many codes?</label>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={count}
                    onChange={(event) => setCount(Math.max(1, Math.min(100, Number(event.target.value) || 1)))}
                    className="h-12"
                  />
                </div>
                <div className="flex items-end gap-3">
                  <Button onClick={() => void handleGenerate()} disabled={actionLoading || loading} className="h-12 px-6">
                    <Plus className="h-4 w-4" />
                    Generate keys
                  </Button>
                  <p className="text-sm text-slate-500">
                    All generated keys will appear in the table below with their raw codes visible.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-dashed border-violet-200 bg-violet-50/60 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-violet-900">Generated in this session</p>
                    <p className="text-xs text-violet-700">These are the raw codes just generated. Copy them now to share with clients. All keys also appear in the table below.</p>
                  </div>
                  {generatedKeys.length > 0 && (
                    <Button variant="outline" size="sm" onClick={() => void handleCopy(generatedKeys.join('\n'))}>
                      <Copy className="h-4 w-4" />
                      Copy all
                    </Button>
                  )}
                </div>

                {generatedKeys.length === 0 ? (
                  <div className="rounded-xl border border-violet-100 bg-white px-4 py-6 text-sm text-slate-500">
                    Generate a batch to reveal the raw codes here.
                  </div>
                ) : (
                  <div className="rounded-xl border border-violet-100 bg-white overflow-hidden">
                    <div className="grid grid-cols-[1fr_140px] gap-3 border-b border-violet-100 bg-violet-50/50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-violet-700">
                      <span>Invite code</span>
                      <span className="text-right">Action</span>
                    </div>
                    <div className="max-h-60 overflow-auto">
                      {generatedKeys.map((key) => (
                        <div key={key} className="grid grid-cols-[1fr_140px] gap-3 border-b border-violet-50 px-4 py-3 items-center last:border-0">
                          <div>
                            <p className="font-mono text-sm font-bold tracking-[0.2em] text-slate-900">{key}</p>
                            <p className="text-xs text-slate-500 mt-1">Share this code with client</p>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => void handleCopy(key)} className="justify-center">
                            <Copy className="h-4 w-4" />
                            Copy
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 mt-4">
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-full bg-amber-100 p-1 text-amber-700">
                    <KeyRound className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-amber-900">All keys from database</p>
                    <p className="text-xs text-amber-700">All raw codes stored in database are displayed in the table below. Keys are persisted and accessible anytime.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/70 bg-white/90 shadow-xl">
            <CardHeader className="space-y-2 border-b border-slate-200/70 pb-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-sky-100 p-2 text-sky-700">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl">Usage and controls</CardTitle>
                  <CardDescription>See who used a key, who it was assigned to, and revoke keys that should stop working.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 p-6 pt-6">
              <div className="grid gap-3 sm:grid-cols-[180px_1fr]">
                <Select value={filter} onValueChange={(value) => {
                  const nextFilter = value as StatusFilter;
                  setFilter(nextFilter);
                  void loadKeys(nextFilter);
                }}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by id, email, user id, status"
                    className="h-12 pl-10"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/80">
                <div className="grid grid-cols-[80px_100px_150px_1fr_1fr_1fr_140px] gap-3 border-b border-slate-200 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <span>ID</span>
                  <span>Code</span>
                  <span>Status</span>
                  <span>Assigned / Used</span>
                  <span>Created / Expires</span>
                  <span>Used at</span>
                  <span className="text-right">Action</span>
                </div>

                <div className="max-h-[520px] overflow-auto">
                  {loading ? (
                    <div className="p-6 text-sm text-slate-500">Loading invite keys...</div>
                  ) : visibleKeys.length === 0 ? (
                    <div className="p-6 text-sm text-slate-500">No invite keys found for the current filter.</div>
                  ) : (
                    visibleKeys.map((item) => (
                      <div key={item.id} className="grid grid-cols-[80px_100px_150px_1fr_1fr_1fr_140px] gap-3 border-b border-slate-200 px-4 py-4 text-sm last:border-0 items-center">
                        <div className="font-semibold text-slate-900">#{item.id}</div>
                        <div className="font-mono font-bold tracking-[0.1em] text-violet-700">{item.rawToken}</div>
                        <div>
                          <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusStyles(item.status)}`}>
                            {item.status}
                          </span>
                        </div>
                        <div className="space-y-1 text-slate-600">
                          <p>
                            <span className="font-medium text-slate-900">Assigned:</span> {item.assignedEmail ?? '—'}
                          </p>
                          <p>
                            <span className="font-medium text-slate-900">Used by:</span>{' '}
                            {item.usedByUserId != null ? `User #${item.usedByUserId}` : '—'}
                          </p>
                        </div>
                        <div className="space-y-1 text-slate-600">
                          <p>
                            <span className="font-medium text-slate-900">Created:</span> {formatDate(item.createdAt, locale)}
                          </p>
                          <p>
                            <span className="font-medium text-slate-900">Expires:</span> {formatDate(item.expiresAt ?? null, locale)}
                          </p>
                        </div>
                        <div className="text-xs text-slate-600">
                          {formatDate(item.usedAt ?? null, locale)}
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => void handleCopy(item.rawToken)} className="justify-center" title="Copy code">
                            <Copy className="h-4 w-4" />
                          </Button>
                          {item.status === 'ACTIVE' ? (
                            <Button variant="destructive" size="sm" onClick={() => void handleRevoke(item.id)} disabled={actionLoading}>
                              <Trash2 className="h-4 w-4" />
                              Revoke
                            </Button>
                          ) : (
                            <span className="text-xs font-medium text-slate-500">—</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}