import React from "react";
import { MessageSquare, Star, ThumbsUp } from "lucide-react";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Textarea } from "@components/ui/textarea";
import { useLocale } from "@global/hooks/useLocale";
import InlinePhotoGallery from "./InlinePhotoGallery";
import { businessDetailReviewDateLabel, businessDetailT } from "../i18n";
import type {
  BusinessDetailBusiness,
  BusinessImage,
  BusinessStaff,
  FakeReview,
} from "../types/businessDetailPage";

interface BusinessProfileContentProps {
  business: BusinessDetailBusiness;
  images: BusinessImage[];
  staff: BusinessStaff[];
  reviews: FakeReview[];
  reviewText: string;
  onReviewTextChange: (value: string) => void;
  user: unknown;
  onOpenReviews: () => void;
  onStartBooking: () => void;
  onLoginToReview: () => void;
}

const BusinessProfileContent: React.FC<BusinessProfileContentProps> = ({
  business,
  images,
  staff,
  reviews,
  reviewText,
  onReviewTextChange,
  user,
  onOpenReviews,
  onStartBooking,
  onLoginToReview,
}) => {
  const { locale } = useLocale();

  const t = (key: Parameters<typeof businessDetailT>[1], params?: Record<string, string | number>) =>
    businessDetailT(locale, key, params);

  return (
    <>
      <InlinePhotoGallery
        images={images}
        businessName={business.name ?? ""}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-4">{t("about_business", { name: business.name ?? "" })}</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{business.description}</p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold mb-6">{t("meet_our_team")}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {staff.map((member) => (
                <div key={member.id ?? member.name} className="flex flex-col items-center text-center group">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-3 ring-4 ring-transparent group-hover:ring-primary/20 transition-all">
                    <img src={member.avatar} alt={member.name} width={96} height={96} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-gray-200" />

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                {t("reviews")}
              </h2>
              <Button variant="outline" onClick={onOpenReviews}>
                {t("view_all_reviews")}
              </Button>
            </div>

            <div className="space-y-6 mb-6">
              {reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
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
                        <Star key={`star-${review.id}-${star}`} className={`w-4 h-4 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm mb-4">{review.content}</p>
                  <div className="flex items-center gap-4 text-gray-500 text-sm">
                    <button type="button" className="flex items-center gap-1 hover:text-primary transition-colors">
                      <ThumbsUp className="w-4 h-4" /> {review.likes}
                    </button>
                    <button type="button" className="flex items-center gap-1 hover:text-primary transition-colors">
                      <MessageSquare className="w-4 h-4" /> {t("reply")}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 relative overflow-hidden">
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
                    <Button onClick={onLoginToReview} className="w-full">
                      {t("login_to_review")}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <Card className="border-primary/20 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">{t("ready_to_book")}</h3>
                <p className="text-gray-500 text-sm mb-6">{t("schedule_quick_desc")}</p>
                <Button size="lg" className="w-full text-lg h-14" onClick={onStartBooking}>
                  {t("book_now")}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("business_hours")}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between items-center"><span className="text-gray-600">{t("weekday_monday_friday")}</span><span className="font-medium">9:00 AM - 7:00 PM</span></li>
                  <li className="flex justify-between items-center"><span className="text-gray-600">{t("weekday_saturday")}</span><span className="font-medium">10:00 AM - 5:00 PM</span></li>
                  <li className="flex justify-between items-center"><span className="text-gray-600">{t("weekday_sunday")}</span><span className="font-medium text-red-500">{t("closed")}</span></li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default BusinessProfileContent;
