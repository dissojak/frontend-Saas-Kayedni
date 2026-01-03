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
  Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
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
  type BusinessResponse,
  type BusinessUpdateRequest,
} from "../actions/backend";

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
  
  // Edit form state
  const [editForm, setEditForm] = useState<BusinessUpdateRequest>({});
  
  // Get auth token
  const getToken = useCallback(() => {
    return localStorage.getItem('accessToken') || localStorage.getItem('token') || '';
  }, []);

  // Load business data
  const loadData = useCallback(async () => {
    const token = getToken();
    if (!token) {
      toast({ variant: "error", title: "Please log in to view your business" });
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
      toast({ variant: "error", title: "Failed to load business data" });
    } finally {
      setLoading(false);
    }
  }, [getToken, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
        toast({ variant: "success", title: "Business updated successfully!" });
        
        // Reload to get fresh evaluation
        await loadData();
      }
    } catch (error: any) {
      toast({ variant: "error", title: "Failed to update business", description: error.message });
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
        title: health.ok ? "AI is Available" : "AI Unavailable", 
        description: health.message,
      });
    } catch (error: any) {
      setAiHealthy(false);
      toast({ variant: "destructive", title: "Failed to check AI", description: error.message });
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
      
      // Call the dedicated re-evaluation endpoint
      const updated = await reEvaluateBusiness(business.id, token);
      
      if (updated) {
        setBusiness(updated);
        toast({ 
          variant: "success", 
          title: "Re-evaluation complete!", 
          description: `Your business has been re-evaluated. New score: ${updated.evaluation?.overallScore ?? 'N/A'}` 
        });
      }
    } catch (error: any) {
      toast({ variant: "error", title: "Failed to re-evaluate", description: error.message });
    } finally {
      setReEvaluating(false);
    }
  };

  // Submit for activation
  const handleSubmitForActivation = async () => {
    if (!business) return;
    
    const token = getToken();
    if (!token) return;

    try {
      setSaving(true);
      const result = await changeBusinessStatus(business.id, 'PENDING', token);
      
      toast({ 
        variant: result.status === 'ACTIVE' ? "success" : "default", 
        title: result.message,
        description: result.advice,
      });
      
      // Reload to get updated status
      await loadData();
    } catch (error: any) {
      toast({ variant: "error", title: "Failed to submit", description: error.message });
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
      toast({ variant: "success", title: "Image added successfully!" });
    } catch (error: any) {
      toast({ variant: "error", title: "Failed to add image", description: error.message });
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

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({ variant: "error", title: "Invalid file type", description: "Please upload an image file" });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({ variant: "error", title: "File too large", description: "Maximum file size is 5MB" });
      return;
    }

    // Check image limit
    if (images.length >= 6) {
      toast({ variant: "error", title: "Maximum images reached", description: "You can only have up to 6 images" });
      return;
    }

    try {
      setUploadingImage(true);
      const newImage = await uploadBusinessImageFile(business.id, file, token);
      setImages(prev => [...prev, newImage]);
      toast({ variant: "success", title: "Image uploaded successfully!" });
    } catch (error: any) {
      toast({ variant: "error", title: "Failed to upload image", description: error.message });
    } finally {
      setUploadingImage(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Drag and drop handlers for reordering
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

    // Reorder locally first for instant feedback
    const newImages = [...images];
    const [draggedItem] = newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedItem);
    setImages(newImages);
    setDraggedIndex(null);
    setDragOverIndex(null);

    // Save new order to backend
    try {
      const imageIds = newImages.map(img => img.id);
      await reorderBusinessImages(business.id, imageIds, token);
      toast({ variant: "success", title: "Images reordered!", description: "First image is now the primary photo" });
    } catch (error: any) {
      // Revert on error
      const imagesData = await fetchOwnerBusinessImages(business.id, token);
      setImages(imagesData);
      toast({ variant: "error", title: "Failed to reorder", description: error.message });
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
      toast({ variant: "success", title: "Image deleted successfully!" });
    } catch (error: any) {
      toast({ variant: "error", title: "Failed to delete image", description: error.message });
    } finally {
      setDeleteImageId(null);
    }
  };

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-500/10 border-emerald-500/30';
    if (score >= 60) return 'bg-amber-500/10 border-amber-500/30';
    return 'bg-rose-500/10 border-rose-500/30';
  };

  // Status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30">Active</Badge>;
      case 'PENDING':
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/30">Pending Review</Badge>;
      case 'SUSPENDED':
        return <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/30">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-background to-slate-100/50 dark:from-slate-950 dark:via-background dark:to-slate-900/50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-14 h-14 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 dark:text-slate-400">Loading your business...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!business) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-background to-slate-100/50 dark:from-slate-950 dark:via-background dark:to-slate-900/50 flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Business Found</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              You don't have a business yet. Create one to get started.
            </p>
            <Button onClick={() => router.push('/business/dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const evaluation = business.evaluation;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-background to-slate-100/50 dark:from-slate-950 dark:via-background dark:to-slate-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => router.push('/business/dashboard')}
                className="rounded-xl"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-800 dark:from-white dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent">
                  My Business
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your business profile and settings</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(business.status)}
              <Badge className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 text-violet-500 dark:text-violet-400 border border-violet-200/50 dark:border-violet-800/50 px-4 py-1.5">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Business Owner
              </Badge>
            </div>
          </div>

          {/* AI Health Status */}
          {aiHealthy !== null && (
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${aiHealthy ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50' : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50'}`}>
              <Brain className={`w-5 h-5 ${aiHealthy ? 'text-emerald-500' : 'text-amber-500'}`} />
              <span className={`text-sm ${aiHealthy ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'}`}>
                AI Evaluation: {aiHealthy ? 'Available' : 'Limited (using heuristic fallback)'}
              </span>
            </div>
          )}

          {/* Overall Score Card */}
          {evaluation && (
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-white shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-violet-500/30 via-purple-500/20 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-teal-500/20 via-cyan-500/10 to-transparent rounded-full blur-3xl"></div>
              
              <div className="relative p-6 sm:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className={`w-24 h-24 rounded-2xl ${getScoreBg(evaluation.overallScore)} flex flex-col items-center justify-center border-2`}>
                      <span className={`text-4xl font-bold ${getScoreColor(evaluation.overallScore)}`}>
                        {evaluation.overallScore}
                      </span>
                      <span className="text-xs text-slate-400">/ 100</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-5 h-5 text-violet-400" />
                        <span className="text-sm text-violet-400 font-medium uppercase tracking-wider">Overall Score</span>
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-1">Business Evaluation</h2>
                      <p className="text-slate-400 text-sm">
                        Evaluated by {evaluation.source === 'AI' ? 'AI' : 'Heuristic System'} • {new Date(evaluation.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={handleCheckAI}
                      disabled={checkingAI}
                      variant="outline"
                      className="text-white border-teal-500 bg-teal-500 hover:bg-white/10 hover:border-white/20 rounded-xl"
                    >
                      {checkingAI ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Checking...
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4 mr-2" />
                          Check AI
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleReEvaluate}
                      disabled={reEvaluating}
                      className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white shadow-lg rounded-xl"
                    >
                      {reEvaluating ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Re-evaluating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Re-evaluate
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}



          {/* Business Information Card */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-lg">Business Information</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Manage your business details</p>
                </div>
              </div>
              
              {isEditing ? (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
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
                    className="rounded-xl"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-xl"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="rounded-xl"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>

            <div className="p-6 space-y-6">
              {/* Business Name */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="name">Business Name</Label>
                  {evaluation && <InlineScore score={evaluation.nameProfessionalismScore} />}
                </div>
                {isEditing ? (
                  <Input
                    id="name"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="rounded-xl"
                    placeholder="Enter business name"
                  />
                ) : (
                  <p className="text-slate-800 dark:text-white font-medium">{business.name}</p>
                )}
                {evaluation && (
                  <InlineEvaluation
                    details={evaluation.nameDetails}
                    suggestions={evaluation.nameSuggestions}
                  />
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description">Description</Label>
                  {evaluation && <InlineScore score={evaluation.descriptionProfessionalismScore} />}
                </div>
                {isEditing ? (
                  <Textarea
                    id="description"
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    className="rounded-xl min-h-[120px]"
                    placeholder="Describe your business..."
                  />
                ) : (
                  <p className="text-slate-600 dark:text-slate-400">{business.description || 'No description'}</p>
                )}
                {evaluation && (
                  <InlineEvaluation
                    details={evaluation.descriptionDetails}
                    suggestions={evaluation.descriptionSuggestions}
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email">Email</Label>
                    {evaluation && <InlineScore score={evaluation.emailProfessionalismScore} />}
                  </div>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editForm.email || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      className="rounded-xl"
                      placeholder="business@example.com"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <p className="text-slate-600 dark:text-slate-400">{business.email || 'Not set'}</p>
                    </div>
                  )}
                  {evaluation && (
                    <InlineEvaluation
                      details={evaluation.emailDetails}
                      suggestions={evaluation.emailSuggestions}
                    />
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={editForm.phone || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="rounded-xl"
                      placeholder="+1 234 567 8900"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <p className="text-slate-600 dark:text-slate-400">{business.phone || 'Not set'}</p>
                    </div>
                  )}
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="location">Location</Label>
                    {evaluation && <InlineScore score={evaluation.locationScore} />}
                  </div>
                  {isEditing ? (
                    <Input
                      id="location"
                      value={editForm.location || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                      className="rounded-xl"
                      placeholder="City, Country"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <p className="text-slate-600 dark:text-slate-400">{business.location || 'Not set'}</p>
                    </div>
                  )}
                  {evaluation && (
                    <InlineEvaluation
                      details={evaluation.locationDetails}
                      suggestions={null}
                    />
                  )}
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="category">Category</Label>
                    {evaluation && <InlineScore score={evaluation.categoryScore} />}
                  </div>
                  {isEditing ? (
                    <Select
                      value={editForm.categoryId?.toString() || ''}
                      onValueChange={(value) => setEditForm(prev => ({ ...prev, categoryId: Number.parseInt(value, 10) }))}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Select category" />
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
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <p className="text-slate-600 dark:text-slate-400">{business.categoryName || 'Not set'}</p>
                    </div>
                  )}
                  {evaluation && (
                    <InlineEvaluation
                      details={evaluation.categoryDetails}
                      suggestions={null}
                    />
                  )}
                </div>

                {/* Weekend Day */}
                <div className="space-y-2">
                  <Label htmlFor="weekendDay">Weekend Day (Closed)</Label>
                  {isEditing ? (
                    <Select
                      value={editForm.weekendDay || 'NONE'}
                      onValueChange={(value) => setEditForm(prev => ({ ...prev, weekendDay: value === 'NONE' ? '' : value }))}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Select weekend day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NONE">None</SelectItem>
                        <SelectItem value="MONDAY">Monday</SelectItem>
                        <SelectItem value="TUESDAY">Tuesday</SelectItem>
                        <SelectItem value="WEDNESDAY">Wednesday</SelectItem>
                        <SelectItem value="THURSDAY">Thursday</SelectItem>
                        <SelectItem value="FRIDAY">Friday</SelectItem>
                        <SelectItem value="SATURDAY">Saturday</SelectItem>
                        <SelectItem value="SUNDAY">Sunday</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <p className="text-slate-600 dark:text-slate-400">
                        {business.weekendDay ? business.weekendDay.charAt(0) + business.weekendDay.slice(1).toLowerCase() : 'Not set'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Images Section with Branding Score */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                    <ImageIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-lg">Business Images & Branding</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Manage your business photos</p>
                  </div>
                </div>
                {evaluation && <InlineScore score={evaluation.brandingScore} label="Branding" />}
              </div>
              {/* Image count info */}
              <div className="mt-3 flex items-center gap-2 text-sm">
                <Info className="w-4 h-4 text-violet-500" />
                <span className="text-slate-600 dark:text-slate-400">
                  {images.length > 0 
                    ? `${images.length >= 3 ? '3+ images' : `${images.length} image${images.length > 1 ? 's' : ''}`} (${images.length} images). AI Overall: ${evaluation?.overallScore ?? 'N/A'}/100 — ${evaluation?.brandingDetails || 'Excellent profile with strong scores across all categories, particularly in branding and location.'}`
                    : 'Add images to improve your branding score. 3+ images recommended (max 6).'}
                </span>
              </div>
              {/* Branding Evaluation */}
              {evaluation && evaluation.brandingSuggestions && (
                <div className="mt-4">
                  <InlineEvaluation
                    details={null}
                    suggestions={evaluation.brandingSuggestions}
                  />
                </div>
              )}
            </div>

            <div className="p-6 space-y-6">
              {/* Upload Section */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* File Upload Button */}
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
                  className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-xl shadow-lg"
                >
                  {uploadingImage ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </>
                  )}
                </Button>

                {/* OR separator */}
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span>or</span>
                </div>

                {/* URL Input */}
                <div className="flex flex-1 gap-2">
                  <Input
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Enter image URL..."
                    className="flex-1 rounded-xl"
                  />
                  <Button
                    onClick={handleAddImage}
                    disabled={!newImageUrl.trim() || addingImage || images.length >= 6}
                    variant="outline"
                    className="rounded-xl"
                  >
                    {addingImage ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Drag hint */}
              {images.length > 1 && (
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <GripVertical className="w-3.5 h-3.5" />
                  Drag and drop to reorder. First image will be your primary photo.
                </p>
              )}

              {/* Images Grid with Drag & Drop */}
              {images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((img, index) => (
                    <div
                      key={img.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`relative group aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-grab active:cursor-grabbing transition-all duration-200 ${
                        draggedIndex === index ? 'opacity-50 scale-95' : ''
                      } ${
                        dragOverIndex === index && draggedIndex !== index
                          ? 'ring-2 ring-violet-500 ring-offset-2 scale-105'
                          : ''
                      }`}
                    >
                      <img
                        src={img.imageUrl}
                        alt={`${business.name} gallery ${index + 1}`}
                        className="w-full h-full object-cover pointer-events-none"
                      />
                      {/* Drag handle overlay */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="p-1.5 bg-black/50 backdrop-blur-sm rounded-lg">
                          <GripVertical className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      {/* Delete button overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteImageId(img.id);
                          }}
                          className="rounded-full"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      {/* Primary badge */}
                      {index === 0 && (
                        <Badge className="absolute top-2 left-2 bg-violet-500 text-white shadow-lg">Primary</Badge>
                      )}
                      {/* Order number */}
                      {index > 0 && (
                        <div className="absolute bottom-2 left-2 w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                          <span className="text-xs font-medium text-white">{index + 1}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div 
                  className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 cursor-pointer hover:border-violet-400 hover:bg-violet-50/50 dark:hover:bg-violet-900/20 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-600 dark:text-slate-400 font-medium">Click to upload your first image</p>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">PNG, JPG up to 5MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Submit for Activation */}
          {business.status !== 'ACTIVE' && (
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 border border-teal-200/50 dark:border-teal-800/50 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-white mb-1">Ready to Go Live?</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Submit your business for activation. If your overall score is above 70, it will be automatically activated!
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleSubmitForActivation}
                  disabled={saving}
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-lg rounded-xl shrink-0"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Submit for Activation
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Delete Image Confirmation */}
      <AlertDialog open={deleteImageId !== null} onOpenChange={() => setDeleteImageId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteImage} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}

// Inline Score Badge Component - Shows score next to field label
function InlineScore({ 
  score, 
  label 
}: { 
  score: number; 
  label?: string;
}) {
  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (s >= 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-rose-600 dark:text-rose-400';
  };

  const getScoreBg = (s: number) => {
    if (s >= 80) return 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/50';
    if (s >= 60) return 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800/50';
    return 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800/50';
  };

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${getScoreBg(score)}`}>
      {label && <span className="text-xs text-slate-500 dark:text-slate-400">{label}:</span>}
      <span className={`text-sm font-bold ${getScoreColor(score)}`}>{score}</span>
      <span className="text-xs text-slate-400">/100</span>
    </div>
  );
}

// Inline Evaluation Component - Shows details and suggestions under a field
function InlineEvaluation({ 
  details, 
  suggestions 
}: { 
  details?: string | null; 
  suggestions?: string | null;
}) {
  if (!details && !suggestions) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Details */}
      {details && (
        <div className="flex items-start gap-2 text-sm p-2.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/50 rounded-lg">
          <Info className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
          <p className="text-indigo-700 dark:text-indigo-200">{details}</p>
        </div>
      )}
      
      {/* Suggestions */}
      {suggestions && (
        <div className="flex items-start gap-2 p-2.5 bg-fuchsia-50 dark:bg-fuchsia-950/40 border border-fuchsia-200/60 dark:border-fuchsia-800/50 rounded-lg">
          <Lightbulb className="w-4 h-4 text-fuchsia-500 mt-0.5 shrink-0" />
          <p className="text-sm text-fuchsia-700 dark:text-fuchsia-200">{suggestions}</p>
        </div>
      )}
    </div>
  );
}
