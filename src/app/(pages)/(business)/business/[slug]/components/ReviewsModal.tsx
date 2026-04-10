import React from "react";
import { Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@components/ui/dialog";
import { Textarea } from "@components/ui/textarea";
import { Button } from "@components/ui/button";
import { useLocale } from "@global/hooks/useLocale";
import { businessDetailReviewDateLabel, businessDetailT } from "../i18n";
import type { FakeReview } from "../types/businessDetailPage";

interface ReviewsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reviews: FakeReview[];
  reviewText: string;
  onReviewTextChange: (value: string) => void;
  user: unknown;
  onLoginClick: () => void;
}

const ReviewsModal: React.FC<ReviewsModalProps> = ({
  open,
  onOpenChange,
  reviews,
  reviewText,
  onReviewTextChange,
  user,
  onLoginClick,
}) => {
  const { locale } = useLocale();
  const t = (key: Parameters<typeof businessDetailT>[1], params?: Record<string, string | number>) =>
    businessDetailT(locale, key, params);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 border-b">
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            {t("all_reviews")}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-50 p-5 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img src={review.avatar} alt={review.author} width={40} height={40} className="w-10 h-10 rounded-full" />
                  <div>
                    <h4 className="font-semibold text-sm">{review.author}</h4>
                    <p className="text-xs text-gray-500">{businessDetailReviewDateLabel(locale, review.date)}</p>
                  </div>
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={`modal-star-${review.id}-${star}`} className={`w-4 h-4 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 text-sm">{review.content}</p>
            </div>
          ))}
        </div>
        <div className="p-6 border-t bg-gray-50 relative">
          <h3 className="font-semibold mb-3">{t("leave_a_review")}</h3>
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-6 h-6 text-gray-300 cursor-pointer hover:text-yellow-400 hover:fill-yellow-400 transition-colors" />
            ))}
          </div>
          <Textarea
            placeholder={t("share_experience_placeholder")}
            className="min-h-[100px] bg-white resize-none"
            value={reviewText}
            onChange={(e) => onReviewTextChange(e.target.value)}
          />
          <div className="mt-3 flex justify-end">
            <Button>{t("post_review")}</Button>
          </div>

          {!user && (
            <div className="absolute inset-0 backdrop-blur-sm bg-white/30 flex flex-col items-center justify-center z-10">
              <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm mx-4">
                <h4 className="font-bold text-lg mb-2">{t("join_conversation")}</h4>
                <p className="text-gray-500 text-sm mb-4">{t("login_required_review_desc")}</p>
                <Button onClick={onLoginClick} className="w-full">
                  {t("login_to_review")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewsModal;
