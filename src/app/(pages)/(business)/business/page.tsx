"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Layout from "@components/layout/Layout";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Label } from "@components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@components/ui/alert-dialog";
import { useToast } from "@global/hooks/use-toast";
import {
  Building2, 
  Sparkles, 
  Edit3, 
  Save, 
  X, 
  MapPin, 
  Phone, 
  Mail, 
  TrendingUp,
  CheckCircle,
  Info,
  RefreshCw,
  Image as ImageIcon,
  Plus,
  Trash2,
  Brain,
  Lightbulb,
  Award,
  ArrowLeft,
  Calendar,
  Upload,
  GripVertical,
  Loader2,
  QrCode,
  Download,
  Printer,
  Share2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  createOwnerBusiness,
  fetchOwnerBusiness,
  updateOwnerBusiness,
  fetchOwnerBusinessImages,
  uploadBusinessImage,
  uploadBusinessImageFile,
  deleteBusinessImage,
  reorderBusinessImages,
  changeBusinessStatus,
  checkAIHealth,
  reEvaluateBusiness,
  type BusinessCreateRequest,
  type BusinessResponse,
  type BusinessUpdateRequest,
} from "../actions/backend";
import { clearPendingOwnerCategory, getPendingOwnerCategory } from "@global/lib/slices";
import { useLocale } from "@global/hooks/useLocale";
import { createBusinessSlug } from "@global/lib/businessSlug";
import { businessManageStatusT, businessManageT, businessManageWeekdayT, type BusinessManageKey } from "./i18n";
import BusinessQrDialog from "@components/business/BusinessQrDialog";
import {
  downloadImageFromUrl,
  printImageFromUrl,
} from "@global/lib/businessQr";

interface Category {
  id: number;
  name: string;
}

interface BusinessImage {
  id: number;
  imageUrl: string;
  displayOrder: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088/api/v1';

// Fetch categories with IDs
async function fetchCategoriesWithIds(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
}

export default function BusinessManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { locale } = useLocale();
  const isArabic = locale === 'ar';
  const t = useCallback(
    (key: BusinessManageKey, params?: Record<string, string | number>) => businessManageT(locale, key, params),
    [locale],
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State
  const [business, setBusiness] = useState<BusinessResponse | null>(null);
  const [images, setImages] = useState<BusinessImage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [reEvaluating, setReEvaluating] = useState(false);
  const [checkingAI, setCheckingAI] = useState(false);
  const [aiHealthy, setAiHealthy] = useState<boolean | null>(null);
  const [deleteImageId, setDeleteImageId] = useState<number | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [addingImage, setAddingImage] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [creatingBusiness, setCreatingBusiness] = useState(false);
  const [pendingCategoryName, setPendingCategoryName] = useState<string | null>(null);
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
  
  // Edit form state
  const [editForm, setEditForm] = useState<BusinessUpdateRequest>({});
  const [createForm, setCreateForm] = useState<BusinessCreateRequest>({
    name: '',
    location: '',
    phone: '',
    email: '',
    description: '',
    categoryId: 0,
  });
  
  // Get auth token
  const getToken = useCallback(() => {
    return localStorage.getItem('accessToken') || localStorage.getItem('token') || '';
  }, []);

  // Load business data
  const loadData = useCallback(async () => {
    const token = getToken();
    if (!token) {
      toast({ variant: "error", title: t('toast_login_required_view') });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [businessData, categoriesData, aiHealth] = await Promise.all([
        fetchOwnerBusiness(token),
        fetchCategoriesWithIds(),
        checkAIHealth(),
      ]);

      if (businessData) {
        setBusiness(businessData);
        setEditForm({
          name: businessData.name,
          location: businessData.location || '',
          phone: businessData.phone || '',
          email: businessData.email || '',
          description: businessData.description || '',
          categoryId: businessData.categoryId,
          weekendDay: businessData.weekendDay || '',
        });
        
        // Load images
        const imagesData = await fetchOwnerBusinessImages(businessData.id, token);
        setImages(imagesData);
      }

      setCategories(categoriesData);
      setAiHealthy(aiHealth.ok);
    } catch (error) {
      console.error('Error loading business data:', error);
      toast({ variant: "error", title: t('toast_load_failed') });
    } finally {
      setLoading(false);
    }
  }, [getToken, t, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const pending = getPendingOwnerCategory();
    if (!pending) {
      return;
    }

    setPendingCategoryName(pending.categoryName);
    setCreateForm((prev) => ({ ...prev, categoryId: pending.categoryId }));
  }, []);

  useEffect(() => {
    if (!categories.length) {
      return;
    }

    setCreateForm((prev) => {
      if (prev.categoryId) {
        return prev;
      }

      return {
        ...prev,
        categoryId: categories[0].id,
      };
    });
  }, [categories]);

  const handleCreateBusiness = async () => {
    const token = getToken();
    if (!token) {
      toast({ variant: "error", title: t('toast_login_required_create') });
      return;
    }

    if (!createForm.name.trim() || !createForm.location.trim() || !createForm.categoryId) {
      toast({
        variant: "error",
        title: t('toast_missing_fields_title'),
        description: t('toast_missing_fields_desc'),
      });
      return;
    }

    try {
      setCreatingBusiness(true);
      const created = await createOwnerBusiness(
        {
          ...createForm,
          name: createForm.name.trim(),
          location: createForm.location.trim(),
          phone: createForm.phone?.trim() || undefined,
          email: createForm.email?.trim() || undefined,
          description: createForm.description?.trim() || undefined,
        },
        token,
      );

      setBusiness(created);
      setEditForm({
        name: created.name,
        location: created.location || '',
        phone: created.phone || '',
        email: created.email || '',
        description: created.description || '',
        categoryId: created.categoryId,
        weekendDay: created.weekendDay || '',
      });

      clearPendingOwnerCategory();
      setPendingCategoryName(null);

      const rawUser = localStorage.getItem('user');
      if (rawUser) {
        try {
          const parsed = JSON.parse(rawUser);
          parsed.businessId = String(created.id);
          parsed.hasBusiness = true;
          parsed.businessCategoryName = created.categoryName ?? parsed.businessCategoryName;
          localStorage.setItem('user', JSON.stringify(parsed));
        } catch {
          // no-op
        }
      }

      toast({ variant: "success", title: t('toast_create_success') });
    } catch (error: any) {
      toast({
        variant: "error",
        title: t('toast_create_failed'),
        description: error.message,
      });
    } finally {
      setCreatingBusiness(false);
    }
  };

  // Save changes
  const handleSave = async () => {
    if (!business) return;
    
    const token = getToken();
    if (!token) return;

    try {
      setSaving(true);
      const updated = await updateOwnerBusiness(business.id, editForm, token);
      if (updated) {
        setBusiness(updated);
        setIsEditing(false);
        toast({ variant: "success", title: t('toast_update_success') });
        await loadData();
      }
    } catch (error: any) {
      toast({ variant: "error", title: t('toast_update_failed'), description: error.message });
    } finally {
      setSaving(false);
    }
  };

  // Check AI health
  const handleCheckAI = async () => {
    try {
      setCheckingAI(true);
      const health = await checkAIHealth();
      setAiHealthy(health.ok);
      toast({ 
        variant: health.ok ? "success" : "destructive", 
        title: health.ok ? t('toast_ai_available_title') : t('toast_ai_unavailable_title'), 
        description: health.message,
      });
    } catch (error: any) {
      setAiHealthy(false);
      toast({ variant: "destructive", title: t('toast_check_ai_failed'), description: error.message });
    } finally {
      setCheckingAI(false);
    }
  };

  // Re-evaluate business with AI
  const handleReEvaluate = async () => {
    if (!business) return;
    
    const token = getToken();
    if (!token) return;

    try {
      setReEvaluating(true);
      const updated = await reEvaluateBusiness(business.id, token);
      
      if (updated) {
        setBusiness(updated);
        toast({ 
          variant: "success", 
          title: t('toast_reevaluate_success_title'), 
          description: t('toast_reevaluate_success_desc', { score: updated.evaluation?.overallScore ?? 'N/A' }),
        });
      }
    } catch (error: any) {
      if (error.code === 'RATE_LIMIT_EXCEEDED') {
        toast({ 
          variant: "destructive", 
          title: t('toast_daily_limit_title'), 
          description: error.message || t('toast_daily_limit_desc'),
        });
      } else {
        toast({ 
          variant: "destructive", 
          title: t('toast_reevaluate_failed_title'), 
          description: error.message || t('toast_reevaluate_failed_desc'),
        });
      }
    } finally {
      setReEvaluating(false);
    }
  };

  // Submit or re-submit for activation review
  const handleSubmitForActivation = async () => {
    if (!business) return;
    
    const token = getToken();
    if (!token) return;

    try {
      setSaving(true);
      const result = await changeBusinessStatus(business.id, 'PENDING', token);
      const normalizedStatus = String(result.status || '').toUpperCase();
      
      toast({ 
        variant: normalizedStatus === 'ACTIVE' || normalizedStatus === 'PENDING' ? "success" : "default", 
        title: result.message,
        description: result.advice,
      });
      
      await loadData();
    } catch (error: any) {
      toast({ variant: "error", title: t('toast_submit_failed'), description: error.message });
    } finally {
      setSaving(false);
    }
  };

  // Add image by URL
  const handleAddImage = async () => {
    if (!business || !newImageUrl.trim()) return;
    
    const token = getToken();
    if (!token) return;

    try {
      setAddingImage(true);
      const newImage = await uploadBusinessImage(business.id, newImageUrl.trim(), token);
      setImages(prev => [...prev, newImage]);
      setNewImageUrl('');
      toast({ variant: "success", title: t('toast_image_add_success') });
    } catch (error: any) {
      toast({ variant: "error", title: t('toast_image_add_failed'), description: error.message });
    } finally {
      setAddingImage(false);
    }
  };

  // Upload image file to Cloudinary
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !business) return;
    
    const token = getToken();
    if (!token) return;

    if (!file.type.startsWith('image/')) {
      toast({ variant: "error", title: t('toast_invalid_file_type_title'), description: t('toast_invalid_file_type_desc') });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ variant: "error", title: t('toast_file_too_large_title'), description: t('toast_file_too_large_desc') });
      return;
    }

    if (images.length >= 6) {
      toast({ variant: "error", title: t('toast_max_images_title'), description: t('toast_max_images_desc') });
      return;
    }

    try {
      setUploadingImage(true);
      const newImage = await uploadBusinessImageFile(business.id, file, token);
      setImages(prev => [...prev, newImage]);
      toast({ variant: "success", title: t('toast_image_upload_success') });
    } catch (error: any) {
      toast({ variant: "error", title: t('toast_image_upload_failed'), description: error.message });
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex || !business) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const token = getToken();
    if (!token) return;

    const newImages = [...images];
    const [draggedItem] = newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedItem);
    setImages(newImages);
    setDraggedIndex(null);
    setDragOverIndex(null);

    try {
      const imageIds = newImages.map(img => img.id);
      await reorderBusinessImages(business.id, imageIds, token);
      toast({ variant: "success", title: t('toast_images_reordered_title'), description: t('toast_images_reordered_desc') });
    } catch (error: any) {
      const imagesData = await fetchOwnerBusinessImages(business.id, token);
      setImages(imagesData);
      toast({ variant: "error", title: t('toast_images_reorder_failed'), description: error.message });
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Delete image
  const handleDeleteImage = async () => {
    if (!business || !deleteImageId) return;
    
    const token = getToken();
    if (!token) return;

    try {
      await deleteBusinessImage(business.id, deleteImageId, token);
      setImages(prev => prev.filter(img => img.id !== deleteImageId));
      toast({ variant: "success", title: t('toast_image_delete_success') });
    } catch (error: any) {
      toast({ variant: "error", title: t('toast_image_delete_failed'), description: error.message });
    } finally {
      setDeleteImageId(null);
    }
  };

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-primary';
    if (score >= 60) return 'text-accent';
    return 'text-destructive';
  };

  // Status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="border border-primary/30 bg-primary/10 text-primary">{t('status_active')}</Badge>;
      case 'PENDING':
        return <Badge className="border border-accent/40 bg-accent/15 text-accent">{t('status_pending_review')}</Badge>;
      case 'SUSPENDED':
        return <Badge className="border border-destructive/30 bg-destructive/10 text-destructive">{t('status_suspended')}</Badge>;
      default:
        return <Badge className="border border-[#d9cfb4] bg-[#f8f4e8] text-[#4d4637]">{businessManageStatusT(locale, status)}</Badge>;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-screen items-center justify-center bg-[#f4efe1]">
          <div className="text-center">
            <div className="mx-auto mb-4 h-14 w-14 animate-spin rounded-full border-4 border-primary border-t-accent"></div>
            <p className="text-[#5c5140]">{t('loading_business')}</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!business) {
    return (
      <Layout>
        <div className="flex min-h-screen items-center justify-center bg-[#f4efe1] p-6">
          <div className="w-full max-w-xl rounded-[28px] border border-[#e6dcc1] bg-[#fdfbf6]/95 p-6 shadow-[0_14px_36px_rgba(34,26,5,0.08)]">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#e3d8bc] bg-[#f8f2df]">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-[#1a1a1a]">{t('create_title')}</h2>
              <p className="mt-1 text-sm text-[#5c5140]">
                {t('create_subtitle')}
              </p>
              {pendingCategoryName && (
                <p className="mt-2 text-xs font-medium text-primary">
                  {t('create_category_preselected', { name: pendingCategoryName })}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="create-business-name">{t('create_business_name')}</Label>
                <Input
                  id="create-business-name"
                  value={createForm.name}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder={t('placeholder_business_name')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-business-location">{t('create_location')}</Label>
                <Input
                  id="create-business-location"
                  value={createForm.location}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder={t('placeholder_location')}
                />
              </div>

              <div className="space-y-2">
                <Label>{t('create_category')}</Label>
                <Select
                  value={createForm.categoryId ? createForm.categoryId.toString() : ''}
                  onValueChange={(value) => setCreateForm((prev) => ({ ...prev, categoryId: Number.parseInt(value, 10) }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('create_select_category')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="create-business-phone">{t('create_phone_optional')}</Label>
                  <Input
                    id="create-business-phone"
                    value={createForm.phone || ''}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder={t('placeholder_phone')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-business-email">{t('create_email_optional')}</Label>
                  <Input
                    id="create-business-email"
                    type="email"
                    value={createForm.email || ''}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder={t('placeholder_email')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-business-description">{t('create_description_optional')}</Label>
                <Textarea
                  id="create-business-description"
                  value={createForm.description || ''}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder={t('placeholder_description')}
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                <Button variant="outline" className="border-[#d8cda8] text-[#4f4638]" onClick={() => router.push('/business/dashboard')}>
                  {t('create_back_dashboard')}
                </Button>
                <Button
                  onClick={handleCreateBusiness}
                  disabled={creatingBusiness || !categories.length}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {creatingBusiness ? t('create_creating') : t('create_cta')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const evaluation = business.evaluation;
  const canSubmitForReview = business.status === 'DRAFT' || business.status === 'INACTIVE' || business.status === 'PENDING';
  const isPendingReview = business.status === 'PENDING';
  const defaultBrandingDetails = t('images_default_details');
  const scoreValue = evaluation?.overallScore ?? 0;
  const scoreProgress = Math.max(0, Math.min(100, scoreValue));
  const hasContactInfo = Boolean((business.phone ?? '').trim() && (business.email ?? '').trim());
  const hasBrandingAssets = images.length >= 3;
  const hasCoreProfile = Boolean((business.name ?? '').trim() && (business.description ?? '').trim() && (business.location ?? '').trim());

  let imagesSummaryText = t('images_summary_empty');
  if (images.length > 0) {
    const params = {
      count: images.length,
      score: evaluation?.overallScore ?? 'N/A',
      details: evaluation?.brandingDetails || defaultBrandingDetails,
    };

    imagesSummaryText = images.length >= 3 ? t('images_summary_many', params) : t('images_summary_few', params);
  }

  let qrPanelContent: React.ReactNode = null;
  if (business.status === 'ACTIVE') {
    if (business.qrCodeUrl) {
      qrPanelContent = (
        // ↓ h-full + flex flex-col so this panel stretches to match the cover card
        <div className="h-full flex flex-col rounded-[28px] border border-[#e6dcc1] bg-[#fdfbf6]/95 p-6 shadow-[0_12px_26px_rgba(34,26,5,0.08)]">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1a1a1a]">{t('qr_panel_title')}</h3>
              <p className="text-xs text-[#5c5140]">{t('qr_panel_subtitle')}</p>
            </div>
          </div>

          {/* QR image — constrained so it doesn't blow up the card height */}
          <div className="mb-4 rounded-2xl border border-[#e6dcc1] bg-white p-3">
            <img
              src={business.qrCodeUrl}
              alt={`${business.name} QR`}
              className="aspect-square w-full max-h-60 mx-auto rounded-xl object-contain"
            />
          </div>

          {business.qrUpdatedAt && (
            <p className="mb-4 text-xs text-[#8a7b5d]">
              {t('qr_panel_last_updated')}: {new Date(business.qrUpdatedAt).toLocaleString(locale)}
            </p>
          )}

          {/* mt-auto pushes buttons to the bottom when the panel is taller than its content */}
          <div className="mt-auto grid grid-cols-2 gap-2 ">
            <Button
              variant="outline"
              size="sm"
              className="rounded-2/3 border-[#d8cda8] text-[#4f4638] h-16"
              onClick={() => {
                if (business.qrCodeUrl) {
                  const slug = business.name.toLowerCase().trim().replaceAll(/[^a-z0-9]+/g, '-').replaceAll(/^-|-$/g, '');
                  downloadImageFromUrl(business.qrCodeUrl, `${slug || 'business'}-qr.png`).catch(() => {
                    toast({ variant: 'error', title: 'Download failed' });
                  });
                }
              }}
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              {t('qr_panel_download')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-2/3 border-[#d8cda8] text-[#4f4638] h-16"
              onClick={() => setIsQrDialogOpen(true)}
            >
              <Share2 className="mr-1.5 h-3.5 w-3.5" />
              {t('qr_panel_share')}
            </Button>
          </div>
        </div>
      );
    } else {
      qrPanelContent = (
        <div className="rounded-[24px] border border-dashed border-[#d8cda8] bg-[#faf5e8] p-5 text-center">
          <QrCode className="mx-auto mb-2 h-8 w-8 text-[#c0b28d]" />
          <p className="text-sm text-[#5c5140]">{t('qr_panel_unavailable')}</p>
        </div>
      );
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#f4efe1] text-[#1a1a1a]">
          <div className="mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="flex items-start gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push('/business/dashboard')}
                  className="rounded-xl border border-primary/30 bg-primary/10 text-primary hover:bg-primary/15"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-[#1a1a1a]">{t('header_my_business')}</h1>
                  <p className="mt-1 text-sm text-[#5c5140]">{t('header_manage_profile')}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {getStatusBadge(business.status)}
                <Badge className="border border-accent/40 bg-accent/15 text-accent px-4 py-1.5">
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                  {t('badge_business_owner')}
                </Badge>
              </div>
            </div>

            {/* ↓ Removed lg:items-start so both columns stretch to equal height */}
            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-8 tactile-card overflow-hidden group relative rounded-[28px] md:h-[500px] sm:h-[400px] h-[400px]">
                <div className="absolute inset-0 z-0">
                  <img
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                    alt={`${business.name} cover`}
                    src={business.firstImageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzp0cyJGT6cgbRp2U2ZlPupvjS6cv5-eZ_LFy6HusvSveY9LUK4atkEEzM2uX80pE6Y0HTvqfLQO3ZiQeTm-Mfz_ydb5yVcuy-c47uzOXze2geS48kTZi8gk61F_jz4nghrG2BUcvU6bcUPpxgM9dQdqFnZ6yq_Yz6vc_wYaPIaaH3e0SPhW9Udqwto_3G9-B7pD9xGhGkOs98YRBcezRd-3s81HSbSTSEu4AbF07L2pP_9MM1paa7IK7tLemboVnwThLMRlKpFC-N'}
                  />
                  <div className={`absolute inset-0 ${isArabic ? 'bg-gradient-to-l from-black/80 via-black/40 to-transparent' : 'bg-gradient-to-r from-black/80 via-black/40 to-transparent'}`} />
                </div>
                <div className="relative z-10 p-12 h-full flex flex-col justify-between text-white">
                  <div>
                    <span className="inline-block px-4 py-1.5 rounded-full bg-[#476500] text-white text-caption-bold font-caption-bold mb-4">{businessManageStatusT(locale, business.status)}</span>
                    <h1 className="font-h1 text-h1 mb-2">{business.name}</h1>
                    <div className="flex items-center gap-2 text-white/80">
                      <span className="material-symbols-outlined text-lg" data-icon="location_on">{t('location_on')}</span>
                      <span className="font-body-md text-body-md">{business.location || t('field_not_set')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-8">
                    <button
                      type="button"
                      onClick={handleSubmitForActivation}
                      disabled={saving || !canSubmitForReview}
                      className="bg-white text-[#344b00] px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:shadow-xl active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <span>{canSubmitForReview ? (isPendingReview ? t('cta_resubmit_btn') : t('cta_submit_btn')) : t('status_active')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push(`/business/${createBusinessSlug(business.name, business.id)}`)}
                      className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/20 active:scale-95 transition-all"
                    >
                      {t('btn_view_public_page')}
                    </button>
                  </div>
                </div>
              </div>

              {/* ↓ flex flex-col so the child QR panel can use h-full */}
              <div className="lg:col-span-4 flex flex-col">
                {qrPanelContent}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <section className="space-y-6 lg:col-span-8">
                {isPendingReview && (
                  <div className="rounded-2xl border border-accent/40 bg-accent/15 px-4 py-3 text-sm text-accent">
                    {t('pending_review_info')}
                  </div>
                )}

                <div className="rounded-[28px] border border-[#e6dcc1] bg-[#fdfbf6]/95 p-6 shadow-[0_16px_32px_rgba(34,26,5,0.08)]">
                  <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a]">{t('info_title')}</h3>
                        <p className="text-sm text-[#5c5140]">{t('info_subtitle')}</p>
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            setEditForm({
                              name: business.name,
                              location: business.location || '',
                              phone: business.phone || '',
                              email: business.email || '',
                              description: business.description || '',
                              categoryId: business.categoryId,
                              weekendDay: business.weekendDay || '',
                            });
                          }}
                          className="rounded-full border-[#d8cda8] text-[#4f4638]"
                        >
                          <X className="mr-2 h-4 w-4" />
                          {t('btn_cancel')}
                        </Button>
                        <Button
                          onClick={handleSave}
                          disabled={saving}
                          className="rounded-full bg-primary px-5 text-primary-foreground hover:bg-primary/90"
                        >
                          {saving ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              {t('btn_saving')}
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              {t('btn_save_changes')}
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                        className="rounded-full border-[#d8cda8] bg-[#f8f2df] text-[#4f4638] hover:bg-[#efe5cb]"
                      >
                        <Edit3 className="mr-2 h-4 w-4" />
                        {t('btn_edit')}
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="name">{t('field_business_name')}</Label>
                          {evaluation && <InlineScore score={evaluation.nameProfessionalismScore} />}
                        </div>
                        {isEditing ? (
                          <Input
                            id="name"
                            value={editForm.name || ''}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                            className="rounded-xl border-[#ddd0ab] bg-[#fffdf8]"
                            placeholder={t('field_business_name')}
                          />
                        ) : (
                          <p className="text-base font-semibold text-[#1a1a1a]">{business.name}</p>
                        )}
                        {evaluation && (
                          <InlineEvaluation
                            details={evaluation.nameDetails}
                            suggestions={evaluation.nameSuggestions}
                          />
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="description">{t('field_description')}</Label>
                          {evaluation && <InlineScore score={evaluation.descriptionProfessionalismScore} />}
                        </div>
                        {isEditing ? (
                          <Textarea
                            id="description"
                            value={editForm.description || ''}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                            className="min-h-[120px] rounded-xl border-[#ddd0ab] bg-[#fffdf8]"
                            placeholder={t('placeholder_description')}
                          />
                        ) : (
                          <p className="text-sm leading-relaxed text-[#4f4638]">{business.description || t('field_no_description')}</p>
                        )}
                        {evaluation && (
                          <InlineEvaluation
                            details={evaluation.descriptionDetails}
                            suggestions={evaluation.descriptionSuggestions}
                          />
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="category">{t('field_category')}</Label>
                          {evaluation && <InlineScore score={evaluation.categoryScore} />}
                        </div>
                        {isEditing ? (
                          <Select
                            value={editForm.categoryId?.toString() || ''}
                            onValueChange={(value) => setEditForm((prev) => ({ ...prev, categoryId: Number.parseInt(value, 10) }))}
                          >
                            <SelectTrigger className="rounded-xl border-[#ddd0ab] bg-[#fffdf8]">
                              <SelectValue placeholder={t('field_select_category')} />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge className="border border-[#d9cfb4] bg-[#f8f4e8] text-[#4d4637]">{business.categoryName || t('field_not_set')}</Badge>
                        )}
                        {evaluation && (
                          <InlineEvaluation
                            details={evaluation.categoryDetails}
                            suggestions={null}
                          />
                        )}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-[#e6dcc1] bg-[#faf5e8] p-5">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="phone">{t('field_phone')}</Label>
                          </div>
                          {isEditing ? (
                            <Input
                              id="phone"
                              value={editForm.phone || ''}
                              onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
                              className="rounded-xl border-[#ddd0ab] bg-[#fffdf8]"
                              placeholder={t('placeholder_phone')}
                            />
                          ) : (
                            <div className="flex items-center gap-2 text-[#4f4638]">
                              <Phone className="h-4 w-4 text-[#7b6b4a]" />
                              <p className="text-sm">{business.phone || t('field_not_set')}</p>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="email">{t('field_email')}</Label>
                            {evaluation && <InlineScore score={evaluation.emailProfessionalismScore} />}
                          </div>
                          {isEditing ? (
                            <Input
                              id="email"
                              type="email"
                              value={editForm.email || ''}
                              onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                              className="rounded-xl border-[#ddd0ab] bg-[#fffdf8]"
                              placeholder={t('placeholder_email')}
                            />
                          ) : (
                            <div className="flex items-center gap-2 text-[#4f4638]">
                              <Mail className="h-4 w-4 text-[#7b6b4a]" />
                              <p className="text-sm">{business.email || t('field_not_set')}</p>
                            </div>
                          )}
                          {evaluation && (
                            <InlineEvaluation
                              details={evaluation.emailDetails}
                              suggestions={evaluation.emailSuggestions}
                            />
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="location">{t('field_location')}</Label>
                            {evaluation && <InlineScore score={evaluation.locationScore} />}
                          </div>
                          {isEditing ? (
                            <Input
                              id="location"
                              value={editForm.location || ''}
                              onChange={(e) => setEditForm((prev) => ({ ...prev, location: e.target.value }))}
                              className="rounded-xl border-[#ddd0ab] bg-[#fffdf8]"
                              placeholder={t('placeholder_location')}
                            />
                          ) : (
                            <div className="flex items-center gap-2 text-[#4f4638]">
                              <MapPin className="h-4 w-4 text-[#7b6b4a]" />
                              <p className="text-sm">{business.location || t('field_not_set')}</p>
                            </div>
                          )}
                          {evaluation && (
                            <InlineEvaluation
                              details={evaluation.locationDetails}
                              suggestions={null}
                            />
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="weekendDay">{t('field_weekend_day_closed')}</Label>
                          {isEditing ? (
                            <Select
                              value={editForm.weekendDay || 'NONE'}
                              onValueChange={(value) => setEditForm((prev) => ({ ...prev, weekendDay: value === 'NONE' ? '' : value }))}
                            >
                              <SelectTrigger className="rounded-xl border-[#ddd0ab] bg-[#fffdf8]">
                                <SelectValue placeholder={t('field_select_weekend_day')} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="NONE">{t('weekday_none')}</SelectItem>
                                <SelectItem value="MONDAY">{t('weekday_monday')}</SelectItem>
                                <SelectItem value="TUESDAY">{t('weekday_tuesday')}</SelectItem>
                                <SelectItem value="WEDNESDAY">{t('weekday_wednesday')}</SelectItem>
                                <SelectItem value="THURSDAY">{t('weekday_thursday')}</SelectItem>
                                <SelectItem value="FRIDAY">{t('weekday_friday')}</SelectItem>
                                <SelectItem value="SATURDAY">{t('weekday_saturday')}</SelectItem>
                                <SelectItem value="SUNDAY">{t('weekday_sunday')}</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <div className="flex items-center gap-2 text-[#4f4638]">
                              <Calendar className="h-4 w-4 text-[#7b6b4a]" />
                              <p className="text-sm">{businessManageWeekdayT(locale, business.weekendDay)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-[#e6dcc1] bg-[#fdfbf6]/95 p-6 shadow-[0_16px_32px_rgba(34,26,5,0.08)]">
                  <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/30 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
                        <ImageIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a]">{t('images_title')}</h3>
                        <p className="text-sm text-[#5c5140]">{t('images_subtitle')}</p>
                      </div>
                    </div>
                    {evaluation && <InlineScore score={evaluation.brandingScore} label={t('images_branding_label')} />}
                  </div>

                  <div className="mb-4 flex items-center gap-2 text-sm text-[#5c5140]">
                    <Info className="h-4 w-4 text-primary" />
                    <span>{imagesSummaryText}</span>
                  </div>

                  {evaluation?.brandingSuggestions && (
                    <div className="mb-4">
                      <InlineEvaluation details={null} suggestions={evaluation.brandingSuggestions} />
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage || images.length >= 6}
                        className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {uploadingImage ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t('images_uploading')}
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            {t('images_upload')}
                          </>
                        )}
                      </Button>

                      <div className="flex items-center text-sm text-[#8a7b5d]">
                        <span>{t('images_or')}</span>
                      </div>

                      <div className="flex flex-1 gap-2">
                        <Input
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                          placeholder={t('images_url_placeholder')}
                          className="flex-1 rounded-xl border-[#ddd0ab] bg-[#fffdf8]"
                        />
                        <Button
                          onClick={handleAddImage}
                          disabled={!newImageUrl.trim() || addingImage || images.length >= 6}
                          variant="outline"
                          className="rounded-full border-[#d8cda8] text-[#4f4638]"
                        >
                          {addingImage ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Plus className="mr-2 h-4 w-4" />
                              {t('images_add')}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {images.length > 1 && (
                      <p className="flex items-center gap-1.5 text-xs text-[#6b604b]">
                        <GripVertical className="h-3.5 w-3.5" />
                        {t('images_drag_hint')}
                      </p>
                    )}

                    {images.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {images.map((img, index) => (
                          <div
                            key={img.id}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragEnd={handleDragEnd}
                            className={`group relative aspect-square cursor-grab overflow-hidden rounded-2xl border border-[#dfd3b1] bg-[#f8f2df] transition-all duration-200 active:cursor-grabbing ${
                              draggedIndex === index ? 'scale-95 opacity-50' : ''
                            } ${
                              dragOverIndex === index && draggedIndex !== index
                                ? 'ring-2 ring-primary ring-offset-2 ring-offset-[#f4efe1] scale-105'
                                : ''
                            }`}
                          >
                            <img
                              src={img.imageUrl}
                              alt={`${business.name} gallery ${index + 1}`}
                              className="h-full w-full object-cover pointer-events-none"
                            />

                            <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                              <div className="rounded-lg bg-black/45 p-1.5 backdrop-blur-sm">
                                <GripVertical className="h-4 w-4 text-white" />
                              </div>
                            </div>

                            <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity group-hover:opacity-100">
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteImageId(img.id);
                                }}
                                className="rounded-full"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            {index === 0 && (
                              <Badge className="absolute left-2 top-2 bg-primary text-primary-foreground shadow-lg">{t('images_primary')}</Badge>
                            )}

                            {index > 0 && (
                              <div className="absolute bottom-2 left-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/45 backdrop-blur-sm">
                                <span className="text-xs font-medium text-white">{index + 1}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="rounded-2xl border-2 border-dashed border-[#d8cda8] bg-[#fbf6e8] py-12 text-center transition-colors hover:border-primary hover:bg-[#f4ecd4]"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="mx-auto mb-3 h-12 w-12 text-[#c0b28d]" />
                        <p className="font-medium text-[#4f4638]">{t('images_click_upload')}</p>
                        <p className="mt-1 text-sm text-[#7d7157]">{t('images_format_hint')}</p>
                      </button>
                    )}
                  </div>
                </div>
              </section>

              <aside className="space-y-6 lg:col-span-4">
                <div className="relative overflow-hidden rounded-[28px] border border-primary/40 bg-primary p-7 text-center text-primary-foreground shadow-[0_18px_36px_rgba(46,58,7,0.35)]">
                  <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/15 blur-3xl" />
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-white/35 bg-white/15">
                    <TrendingUp className="h-8 w-8" />
                  </div>
                  <h3 className="mb-2 text-3xl font-extrabold tracking-tight">
                    {isPendingReview ? t('cta_resubmit_title') : t('cta_submit_title')}
                  </h3>
                  <p className="mx-auto mb-6 max-w-sm text-sm leading-relaxed text-primary-foreground/85">
                    {t('cta_current_status', { status: businessManageStatusT(locale, business.status) })}
                  </p>
                  <Button
                    onClick={handleSubmitForActivation}
                    disabled={saving || !canSubmitForReview}
                    className="h-12 w-full rounded-2xl border border-accent/50 bg-accent text-base font-bold text-accent-foreground hover:bg-accent/90"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        {t('cta_submitting')}
                      </>
                    ) : canSubmitForReview ? (
                      <>{isPendingReview ? t('cta_resubmit_btn') : t('cta_submit_btn')}</>
                    ) : (
                      <>{t('status_active')}</>
                    )}
                  </Button>
                  <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#e2d7b5]">
                    {t('cta_submit_desc_line2')}
                  </p>
                </div>

                {evaluation && (
                  <div className="rounded-[28px] border border-[#e6dcc1] bg-[#fdfbf6]/95 p-6 shadow-[0_12px_26px_rgba(34,26,5,0.08)]">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="rounded bg-primary/10 px-2 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                        {t('score_overall_label')}
                      </span>
                      <Award className="h-5 w-5 text-primary" />
                    </div>

                    <div className="mb-4 flex items-end gap-2">
                      <span className={`text-5xl font-black leading-none ${getScoreColor(scoreValue)}`}>{scoreValue}</span>
                      <span className="pb-1 text-xl font-bold text-[#8c7f63]">/100</span>
                    </div>

                    <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-[#ebe2c8]">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${scoreProgress}%` }} />
                    </div>

                    <ul className="space-y-3 text-xs font-semibold text-[#4f4638]">
                      <li className="flex items-center gap-2">
                        {hasContactInfo ? <CheckCircle className="h-4 w-4 text-primary" /> : <Info className="h-4 w-4 text-accent" />}
                        <span>{t('field_email')} + {t('field_phone')}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        {hasBrandingAssets ? <CheckCircle className="h-4 w-4 text-primary" /> : <Info className="h-4 w-4 text-accent" />}
                        <span>{t('images_title')}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        {hasCoreProfile ? <CheckCircle className="h-4 w-4 text-primary" /> : <Info className="h-4 w-4 text-accent" />}
                        <span>{t('field_business_name')} + {t('field_description')}</span>
                      </li>
                    </ul>

                    <div className="mt-6 flex gap-2">
                      <Button
                        onClick={handleCheckAI}
                        disabled={checkingAI}
                        variant="outline"
                        className="flex-1 rounded-full border-[#d8cda8] text-[#4f4638]"
                      >
                        {checkingAI ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            {t('btn_checking_ai')}
                          </>
                        ) : (
                          <>
                            <Brain className="mr-2 h-4 w-4" />
                            {t('btn_check_ai')}
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={handleReEvaluate}
                        disabled={reEvaluating}
                        className="flex-1 rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
                      >
                        {reEvaluating ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            {t('btn_reevaluating')}
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            {t('btn_reevaluate')}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {aiHealthy !== null && (
                  <div className={`rounded-[24px] border p-4 text-sm ${aiHealthy ? 'border-primary/30 bg-primary/10 text-primary' : 'border-accent/40 bg-accent/15 text-accent'}`}>
                    <div className="flex items-center gap-2 font-semibold">
                      <Brain className="h-4 w-4" />
                      <span>{t('ai_evaluation_label')}</span>
                    </div>
                    <p className="mt-1">{aiHealthy ? t('ai_available') : t('ai_limited')}</p>
                  </div>
                )}

                {(evaluation?.brandingSuggestions || evaluation?.brandingDetails) && (
                  <div className="rounded-[24px] border border-[#e5d7bd] bg-[#f8f1e3] p-5">
                    <div className="mb-1 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-accent" />
                      <p className="text-sm font-bold text-[#3f372a]">AI Insight</p>
                    </div>
                    <p className="text-sm leading-relaxed text-[#5b5040]">
                      {evaluation.brandingSuggestions || evaluation.brandingDetails}
                    </p>
                  </div>
                )}
              </aside>
            </div>
          </div>
        </div>

        {/* Delete Image Confirmation */}
        <AlertDialog open={deleteImageId !== null} onOpenChange={() => setDeleteImageId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('dialog_delete_image_title')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('dialog_delete_image_desc')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('btn_cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteImage} className="bg-red-500 hover:bg-red-600">
                {t('dialog_delete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Business QR Dialog */}
        <BusinessQrDialog
          open={isQrDialogOpen}
          onOpenChange={setIsQrDialogOpen}
          business={business ? { id: String(business.id), name: business.name, qrCodeUrl: business.qrCodeUrl, qrUpdatedAt: business.qrUpdatedAt } : null}
        />
      </Layout>
    );
}

// Inline Score Badge Component
function InlineScore({ 
  score, 
  label 
}: Readonly<{ 
  score: number; 
  label?: string;
}>) {
  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-primary';
    if (s >= 60) return 'text-accent';
    return 'text-destructive';
  };

  const getScoreBg = (s: number) => {
    if (s >= 80) return 'bg-primary/10 border-primary/30';
    if (s >= 60) return 'bg-accent/15 border-accent/40';
    return 'bg-destructive/10 border-destructive/30';
  };

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${getScoreBg(score)}`}>
      {label && <span className="text-xs text-[#6b604b]">{label}:</span>}
      <span className={`text-sm font-bold ${getScoreColor(score)}`}>{score}</span>
      <span className="text-xs text-[#8c7f63]">/100</span>
    </div>
  );
}

// Inline Evaluation Component
function InlineEvaluation({ 
  details, 
  suggestions 
}: Readonly<{ 
  details?: string | null; 
  suggestions?: string | null;
}>) {
  if (!details && !suggestions) return null;

  return (
    <div className="mt-2 space-y-2">
      {details && (
        <div className="flex items-start gap-2 rounded-lg border border-[#e3d2ad] bg-[#f4ecd6] p-2.5 text-sm">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#7b6b4a]" />
          <p className="text-[#4f4638]">{details}</p>
        </div>
      )}
      
      {suggestions && (
        <div className="flex items-start gap-2 rounded-lg border border-accent/40 bg-accent/15 p-2.5">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          <p className="text-sm text-[#5b4a25]">{suggestions}</p>
        </div>
      )}
    </div>
  );
}
