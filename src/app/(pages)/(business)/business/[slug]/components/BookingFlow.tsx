import React from "react";
import { AlertTriangle, ArrowRight, Check, ChevronLeft, Clock, Tag } from "lucide-react";
import { Button } from "@components/ui/button";
import { Calendar } from "@components/ui/calendar";
import { useLocale } from "@global/hooks/useLocale";
import { businessDetailDateLocale, businessDetailT } from "../i18n";
import type {
  BookingCalendarDisabledDay,
  BusinessService,
  BusinessStaff,
  BusinessTimeSlot,
  EntityId,
  TimedSlot,
} from "../types/businessDetailPage";
import { isSameLocalDate } from "../utils/date";

interface BookingFlowProps {
  bookingStep: number;
  setBookingStep: (step: number) => void;
  selectedStaff: BusinessStaff | null;
  selectedService: BusinessService | null;
  selectedDate: Date | null;
  selectedTimeSlot: BusinessTimeSlot | null;
  staff: BusinessStaff[];
  staffServices: BusinessService[];
  disabledDays: BookingCalendarDisabledDay[];
  availabilityByStatus: Record<string, Date[]>;
  onSelectDate: (date: Date | undefined) => void;
  slotsLoading: boolean;
  visibleTimeSlots: TimedSlot[];
  activeWarningSlot: TimedSlot | null;
  warningCountdown: string;
  highlightWarning: boolean;
  currentTime: Date;
  onSelectStaff: (staffMember: BusinessStaff) => void;
  onSelectService: (service: BusinessService) => void;
  onSelectTimeSlot: (slot: BusinessTimeSlot, isSoon: boolean, isDisabled: boolean) => void;
  onTriggerWarningFocus: (slotId: EntityId) => void;
  onOpenCancelAlert: () => void;
  onBackToProfile: () => void;
  formatTimeSlot: (date: Date | string) => string;
  onAdvanceToReview: () => void;
  onContinueBooking: () => void;
}

const BookingFlow: React.FC<BookingFlowProps> = ({
  bookingStep,
  setBookingStep,
  selectedStaff,
  selectedService,
  selectedDate,
  selectedTimeSlot,
  staff,
  staffServices,
  disabledDays,
  availabilityByStatus,
  onSelectDate,
  slotsLoading,
  visibleTimeSlots,
  activeWarningSlot,
  warningCountdown,
  highlightWarning,
  currentTime,
  onSelectStaff,
  onSelectService,
  onSelectTimeSlot,
  onTriggerWarningFocus,
  onOpenCancelAlert,
  onBackToProfile,
  formatTimeSlot,
  onAdvanceToReview,
  onContinueBooking,
}) => {
  const { locale } = useLocale();
  const localeTag = businessDetailDateLocale(locale);

  const t = (
    key: Parameters<typeof businessDetailT>[1],
    params?: Record<string, string | number>,
  ) => businessDetailT(locale, key, params);

  const isArabic = locale === "ar";

  return (
    <div className="mt-8 animate-in fade-in duration-500">
      <Button
        variant="ghost"
        onClick={onBackToProfile}
        className="mb-6 -ml-4 text-gray-500 hover:text-gray-900"
      >
        {isArabic ? (
          <>
            <ChevronLeft className="w-4 h-4 mr-1 -scale-x-100" /> {t("back_to_business_profile")}
          </>
        ) : (
          <>
            <ChevronLeft className="w-4 h-4 mr-1" /> {t("back_to_business_profile")}
          </>
        )}
      </Button>

      <section id="booking-section" className="-scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6">{t("book_an_appointment")}</h2>

        {bookingStep === 1 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div
                className={`p-6 transition-all duration-500 ease-in-out ${
                  selectedStaff
                    ? "md:w-1/3 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/50"
                    : "w-full"
                }`}
              >
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                    1
                  </span>
                  <span>{t("select_professional")}</span>
                </h3>
                <div
                  className={`grid gap-3 ${selectedStaff ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}
                >
                  {staff.map((member, idx: number) => (
                    <button
                      type="button"
                      key={member.id ?? `book-staff-${idx}`}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 bg-white relative overflow-hidden text-left ${
                        selectedStaff?.id === member.id
                          ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary"
                          : "border-transparent shadow-sm hover:border-gray-200"
                      }`}
                      onClick={() => onSelectStaff(member)}
                    >
                      {selectedStaff?.id === member.id && (
                        <div className="absolute top-0 right-0 bg-primary text-white p-1 rounded-bl-lg">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                      <img
                        src={member.avatar}
                        alt={member.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-medium text-sm text-gray-900">{member.name}</h4>
                        {!selectedStaff && <p className="text-xs text-gray-500">{member.role}</p>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedStaff && (
                <div className="p-6 md:w-2/3 animate-in slide-in-from-right-8 duration-500">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                      2
                    </span>
                    <span>{t("select_service")}</span>
                  </h3>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {(staffServices || []).map((service, idx: number) => (
                      <button
                        type="button"
                        key={service.id ?? `book-service-${idx}`}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all bg-white relative overflow-hidden text-left w-full ${
                          selectedService?.id === service.id
                            ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary"
                            : "border-transparent shadow-sm hover:border-gray-200"
                        }`}
                        onClick={() => onSelectService(service)}
                      >
                        {selectedService?.id === service.id && (
                          <div className="absolute top-0 right-0 bg-primary text-white p-1 rounded-bl-lg">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-gray-900">{service.name}</h4>
                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3" />{" "}
                              {t("service_duration_min", { duration: service.duration })}
                            </p>
                          </div>
                          <span className="font-bold text-lg">${service.price}</span>
                        </div>
                      </button>
                    ))}
                    {(!staffServices || staffServices.length === 0) && (
                      <div className="text-center py-8 text-gray-500">
                        {t("no_services_for_staff", { name: selectedStaff.name })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between items-center animate-in fade-in duration-300">
              <Button
                variant="outline"
                onClick={onOpenCancelAlert}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                {t("cancel")}
              </Button>
              {selectedStaff && selectedService && (
                <Button size="lg" onClick={() => setBookingStep(2)}>
                  {isArabic ? (
                    <>
                      {" "}
                      <ArrowRight className="w-4 h-4 ml-2" /> {t("confirm_and_pick_date")}{" "}
                    </>
                  ) : (
                    <>
                      {t("confirm_and_pick_date")} <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}

        {bookingStep === 2 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-in slide-in-from-right-8 duration-500">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-semibold flex items-center gap-2">
                <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                  3
                </span>
                <span>{t("choose_date_time")}</span>
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setBookingStep(1)}>
                {isArabic ? (
                  <>
                    {t("back")} <ChevronLeft className="w-4 h-4 mr-1" />
                  </>
                ) : (
                  <>
                    <ChevronLeft className="w-4 h-4 mr-1" /> {t("back")}
                  </>
                )}
              </Button>
            </div>

            <div className="p-6 flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <Calendar
                  mode="single"
                  selected={selectedDate ?? undefined}
                  onSelect={onSelectDate}
                  disabled={disabledDays}
                  modifiers={{
                    available: availabilityByStatus.AVAILABLE || [],
                    full: availabilityByStatus.FULL || [],
                    closed: availabilityByStatus.CLOSED || [],
                    sick: availabilityByStatus.SICK || [],
                    vacation: availabilityByStatus.VACATION || [],
                    dayOff: availabilityByStatus.DAY_OFF || [],
                    unavailable: availabilityByStatus.UNAVAILABLE || [],
                  }}
                  modifiersClassNames={{
                    full: "bg-orange-100 text-orange-700 hover:bg-orange-100",
                    closed: "bg-slate-200 text-slate-500 hover:bg-slate-200",
                    sick: "bg-rose-100 text-rose-700 hover:bg-rose-100",
                    vacation: "bg-amber-100 text-amber-700 hover:bg-amber-100",
                    dayOff: "bg-blue-100 text-blue-700 hover:bg-blue-100",
                    unavailable: "bg-gray-200 text-gray-500 hover:bg-gray-200",
                    available: "bg-emerald-50 text-emerald-700 hover:bg-blue-400 hover:text-white",
                  }}
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div className="flex-1">
                <h4 className="font-medium mb-4 text-gray-900">{t("available_times")}</h4>
                {selectedDate &&
                  isSameLocalDate(selectedDate, currentTime) &&
                  activeWarningSlot && (
                    <div
                      className={`booking-warning-card mb-4 text-xs ${
                        activeWarningSlot.meta.isCriticalSoon
                          ? "booking-warning-card--critical"
                          : "booking-warning-card--soon"
                      } ${highlightWarning ? "booking-warning-card--active" : ""}`}
                    >
                      <div className="booking-warning-card__content flex items-start gap-2 px-3 py-2">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                        {activeWarningSlot.meta.isCriticalSoon ? (
                          <span>{t("warning_critical_slot", { countdown: warningCountdown })}</span>
                        ) : (
                          <span>{t("warning_soon_slot", { countdown: warningCountdown })}</span>
                        )}
                      </div>
                    </div>
                  )}

                {(() => {
                  if (!selectedDate) {
                    return (
                      <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200 h-[300px] flex items-center justify-center">
                        {t("select_date_on_calendar")}
                      </div>
                    );
                  }

                  if (slotsLoading) {
                    return (
                      <div className="flex items-center justify-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200 h-[300px]">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2">
                      {visibleTimeSlots.length > 0 ? (
                        visibleTimeSlots.map(({ slot, meta }) => {
                          const isSelected = selectedTimeSlot?.id === slot.id;
                          const isDisabled = meta.isCriticalSoon;

                          return (
                            <Button
                              key={slot.id ?? `slot-${slot.startTime}`}
                              variant={isSelected ? "default" : "outline"}
                              aria-disabled={isDisabled}
                              data-slot-disabled={isDisabled ? "true" : "false"}
                              style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
                              className={`w-full min-h-12 relative overflow-hidden transition-all py-2 ${
                                isSelected
                                  ? "ring-2 ring-primary ring-offset-2 shadow-md bg-primary text-primary-foreground"
                                  : "bg-white hover:border-primary/50"
                              } ${
                                isDisabled
                                  ? "!cursor-not-allowed border-[#7a1e12]/40 bg-[#fef2f2] text-[#7a1e12] opacity-100 hover:bg-[#fef2f2] hover:shadow-[0_0_0_1px_rgba(122,30,18,0.35),0_0_16px_rgba(122,30,18,0.18)]"
                                  : "cursor-pointer"
                              } ${meta.isSoon && !isDisabled && !isSelected ? "border-amber-300 bg-amber-50 text-amber-900" : ""}`}
                              onPointerEnter={() => {
                                if (meta.isSoon) onTriggerWarningFocus(slot.id);
                              }}
                              onMouseEnter={() => {
                                if (meta.isSoon) onTriggerWarningFocus(slot.id);
                              }}
                              onTouchStart={() => {
                                if (meta.isSoon) onTriggerWarningFocus(slot.id);
                              }}
                              onFocus={() => {
                                if (meta.isSoon) onTriggerWarningFocus(slot.id);
                              }}
                              onKeyDown={(e) => {
                                if (!isDisabled) return;
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  onTriggerWarningFocus(slot.id);
                                }
                              }}
                              onClick={() => onSelectTimeSlot(slot, meta.isSoon, isDisabled)}
                            >
                              {isSelected && (
                                <div className="absolute top-0 right-0 bg-white/20 text-white p-0.5 rounded-bl-lg">
                                  <Check className="w-3 h-3" />
                                </div>
                              )}

                              <span className="flex flex-col items-center leading-tight">
                                <span>{formatTimeSlot(slot.startTime)}</span>
                                {meta.isCriticalSoon && (
                                  <span className="mt-1 text-[10px] font-medium">
                                    {t("slot_too_close_hint")}
                                  </span>
                                )}
                                {meta.isSoon && !meta.isCriticalSoon && (
                                  <span className="mt-1 text-[10px] font-medium">
                                    {t("slot_starts_in_minutes", {
                                      minutes: meta.minutesUntilStart,
                                    })}
                                  </span>
                                )}
                              </span>
                            </Button>
                          );
                        })
                      ) : (
                        <div className="col-span-2 text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                          {t("no_slots_for_date")}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between items-center animate-in fade-in duration-300">
              <Button
                variant="outline"
                onClick={onOpenCancelAlert}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                {t("cancel")}
              </Button>
              {selectedDate && selectedTimeSlot && (
                <Button size="lg" onClick={onAdvanceToReview}>
                  {isArabic ? (
                    <>
                      {" "}
                      <ArrowRight className="w-4 h-4 ml-2" /> {t("review_booking")}
                    </>
                  ) : (
                    <>
                      {t("review_booking")} <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}

        {bookingStep === 3 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-in slide-in-from-right-8 duration-500">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-semibold flex items-center gap-2">
                <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                  4
                </span>
                <span>{t("confirm_details")}</span>
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setBookingStep(2)}>
                {isArabic ? (
                  <>
                    {t("back")} <ChevronLeft className="w-4 h-4 mr-1" />
                  </>
                ) : (
                  <>
                    <ChevronLeft className="w-4 h-4 mr-1" /> {t("back")}
                  </>
                )}
              </Button>
            </div>

            {selectedService && selectedStaff && selectedDate && selectedTimeSlot && (
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                        <Tag className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">{t("service")}</p>
                        <p className="font-medium text-lg text-gray-900">{selectedService.name}</p>
                        <p className="text-gray-500">
                          {t("service_duration_min", { duration: selectedService.duration })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 shrink-0">
                        <img
                          src={selectedStaff.avatar}
                          alt={selectedStaff.name}
                          width={48}
                          height={48}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">{t("professional")}</p>
                        <p className="font-medium text-lg text-gray-900">{selectedStaff.name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-500 shrink-0">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">{t("date_time")}</p>
                        <p className="font-medium text-lg text-gray-900">
                          {selectedDate.toLocaleDateString(localeTag, {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-gray-500">
                          {formatTimeSlot(selectedTimeSlot.startTime)} -{" "}
                          {formatTimeSlot(selectedTimeSlot.endTime)}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-sm text-gray-500 mb-1">{t("total_amount")}</p>
                      <p className="text-3xl font-bold text-gray-900">${selectedService.price}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-between items-center">
              <Button
                variant="outline"
                onClick={onOpenCancelAlert}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                {t("cancel")}
              </Button>
              <Button size="lg" onClick={onContinueBooking} className="px-8">
                {isArabic ? (
                  <>
                    {" "}
                    <ArrowRight className="w-4 h-4 ml-2" /> {t("confirm_checkout")}
                  </>
                ) : (
                  <>
                    {t("confirm_checkout")} <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default BookingFlow;
