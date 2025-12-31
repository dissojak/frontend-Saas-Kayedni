"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog';
import { Button } from '@components/ui/button';
import { Textarea } from '@components/ui/textarea';
import { Label } from '@components/ui/label';
import { createOrUpdateRating, getRatingForBooking } from '@/(pages)/(business)/actions/backend';
import { Star, Scissors, Building2, Loader2 } from 'lucide-react';

// Star Rating Component
interface StarRatingProps {
  readonly rating: number;
  readonly onRatingChange: (rating: number) => void;
  readonly disabled?: boolean;
}

export function StarRating({ rating, onRatingChange, disabled = false }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          className={`p-1 transition-all ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-110'}`}
          onMouseEnter={() => !disabled && setHoverRating(star)}
          onMouseLeave={() => !disabled && setHoverRating(0)}
          onClick={() => !disabled && onRatingChange(star)}
        >
          <Star 
            className={`h-8 w-8 transition-colors ${
              (hoverRating || rating) >= star 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            }`} 
          />
        </button>
      ))}
    </div>
  );
}

// Types for the booking info needed by ReviewDialog
export interface ReviewBookingInfo {
  id: string;
  businessName: string;
  serviceName: string;
  staffName: string;
}

interface ReviewDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly booking: ReviewBookingInfo | null;
  readonly token: string | null;
  readonly onSuccess?: () => void;
}

export default function ReviewDialog({ 
  open, 
  onOpenChange, 
  booking, 
  token,
  onSuccess 
}: ReviewDialogProps) {
  // Review form states
  const [reviewRating, setReviewRating] = useState(0);
  const [businessRating, setBusinessRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [businessComment, setBusinessComment] = useState('');
  const [isEditingRating, setIsEditingRating] = useState(false);
  const [loadingExistingRating, setLoadingExistingRating] = useState(false);
  const [ratingTab, setRatingTab] = useState<'service' | 'business'>('service');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Load existing rating when dialog opens
  const loadExistingRating = useCallback(async () => {
    if (!booking || !token) return;
    
    setLoadingExistingRating(true);
    try {
      const existingRating = await getRatingForBooking(Number.parseInt(booking.id, 10), token);
      if (existingRating.hasExistingRating) {
        setIsEditingRating(true);
        setReviewRating(existingRating.serviceRating || 0);
        setBusinessRating(existingRating.businessRating || 0);
        setReviewComment(existingRating.serviceComment || '');
        setBusinessComment(existingRating.businessComment || '');
      }
    } catch (err) {
      // No existing rating, that's fine
      console.log('No existing rating found');
    } finally {
      setLoadingExistingRating(false);
    }
  }, [booking, token]);

  // Reset state when dialog opens/closes or booking changes
  useEffect(() => {
    if (open && booking) {
      // Reset states
      setReviewRating(0);
      setBusinessRating(0);
      setReviewComment('');
      setBusinessComment('');
      setSubmitError(null);
      setIsEditingRating(false);
      setRatingTab('service');
      
      // Load existing rating
      loadExistingRating();
    }
  }, [open, booking, loadExistingRating]);

  const getRatingLabel = (rating: number) => {
    switch (rating) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return '';
    }
  };

  const submitReview = async () => {
    if (!booking || !token || (reviewRating === 0 && businessRating === 0)) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const payload: any = {
        bookingId: Number.parseInt(booking.id, 10),
      };
      
      if (reviewRating > 0) {
        payload.serviceRating = reviewRating;
        if (reviewComment) {
          payload.serviceComment = reviewComment;
        }
      }
      
      if (businessRating > 0) {
        payload.businessRating = businessRating;
        if (businessComment) {
          payload.businessComment = businessComment;
        }
      }
      
      await createOrUpdateRating(payload, token);
      
      // Call success callback
      onSuccess?.();
      
      // Close dialog
      onOpenChange(false);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit rating');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditingRating ? 'Edit Your Review' : 'Leave a Review'}
          </DialogTitle>
          <DialogDescription>
            {isEditingRating 
              ? 'Update your rating for ' 
              : 'Share your experience at '}
            <span className="font-semibold">{booking?.businessName}</span>
          </DialogDescription>
        </DialogHeader>
        
        {loadingExistingRating ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-client" />
            <span className="ml-2 text-gray-500">Loading your rating...</span>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {/* Service Info */}
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="font-medium">{booking?.serviceName}</p>
              <p className="text-sm text-gray-500">with {booking?.staffName}</p>
            </div>

            {/* Tab Switch Buttons */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
              <button
                type="button"
                onClick={() => setRatingTab('service')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
                  ratingTab === 'service' 
                    ? 'bg-white text-client shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Scissors className="h-4 w-4" />
                Rate Service
                {reviewRating > 0 && (
                  <span className="flex items-center text-yellow-500">
                    <Star className="h-3 w-3 fill-current" />
                    <span className="text-xs ml-0.5">{reviewRating}</span>
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setRatingTab('business')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
                  ratingTab === 'business' 
                    ? 'bg-white text-client shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Building2 className="h-4 w-4" />
                Rate Business
                {businessRating > 0 && (
                  <span className="flex items-center text-yellow-500">
                    <Star className="h-3 w-3 fill-current" />
                    <span className="text-xs ml-0.5">{businessRating}</span>
                  </span>
                )}
              </button>
            </div>

            {/* Service Rating Tab */}
            {ratingTab === 'service' && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-3">How was the service quality?</p>
                  <div className="flex justify-center py-2">
                    <StarRating 
                      rating={reviewRating} 
                      onRatingChange={setReviewRating}
                      disabled={isSubmitting}
                    />
                  </div>
                  {reviewRating > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      {getRatingLabel(reviewRating)}
                    </p>
                  )}
                </div>
                
                {reviewRating > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="service-comment" className="text-sm">Comment (Optional)</Label>
                    <Textarea
                      id="service-comment"
                      placeholder="Tell us about your experience with the service..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      disabled={isSubmitting}
                      rows={3}
                      maxLength={1000}
                    />
                    <p className="text-xs text-gray-400 text-right">
                      {reviewComment.length}/1000
                    </p>
                  </div>
                )}

                {reviewRating === 0 && (
                  <p className="text-center text-sm text-gray-400 py-4">
                    Click the stars above to rate this service
                  </p>
                )}
              </div>
            )}

            {/* Business Rating Tab */}
            {ratingTab === 'business' && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-3">How was the overall business experience?</p>
                  <div className="flex justify-center py-2">
                    <StarRating 
                      rating={businessRating} 
                      onRatingChange={setBusinessRating}
                      disabled={isSubmitting}
                    />
                  </div>
                  {businessRating > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      {getRatingLabel(businessRating)}
                    </p>
                  )}
                </div>
                
                {businessRating > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="business-comment" className="text-sm">Comment (Optional)</Label>
                    <Textarea
                      id="business-comment"
                      placeholder="Tell us about your overall experience with the business..."
                      value={businessComment}
                      onChange={(e) => setBusinessComment(e.target.value)}
                      disabled={isSubmitting}
                      rows={3}
                      maxLength={1000}
                    />
                    <p className="text-xs text-gray-400 text-right">
                      {businessComment.length}/1000
                    </p>
                  </div>
                )}

                {businessRating === 0 && (
                  <p className="text-center text-sm text-gray-400 py-4">
                    Click the stars above to rate this business
                  </p>
                )}
              </div>
            )}

            {/* Summary of ratings */}
            {(reviewRating > 0 || businessRating > 0) && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-xs font-medium text-green-800 mb-2">Your Ratings:</p>
                <div className="flex gap-4 text-sm">
                  {reviewRating > 0 && (
                    <div className="flex items-center gap-1">
                      <Scissors className="h-3 w-3 text-green-600" />
                      <span className="text-green-700">Service: {reviewRating}★</span>
                    </div>
                  )}
                  {businessRating > 0 && (
                    <div className="flex items-center gap-1">
                      <Building2 className="h-3 w-3 text-green-600" />
                      <span className="text-green-700">Business: {businessRating}★</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {submitError && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {submitError}
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting || loadingExistingRating}
          >
            Cancel
          </Button>
          <Button 
            onClick={submitReview}
            disabled={isSubmitting || (reviewRating === 0 && businessRating === 0) || loadingExistingRating}
            className="bg-client hover:bg-client-dark"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isEditingRating ? 'Updating...' : 'Submitting...'}
              </>
            ) : (
              isEditingRating ? 'Update Review' : 'Submit Review'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
