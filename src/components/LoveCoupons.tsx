import React from "react";
import { motion } from "motion/react";
import { Sparkles, Calendar, Heart, Gift, Coffee, Flame, Bike, Ticket } from "lucide-react";
import { LoveCoupon } from "../types";

interface LoveCouponsProps {
  coupons: LoveCoupon[];
  onRedeem: (couponId: string) => void;
}

// Map of string icons to lucide icons
const iconMap: Record<string, React.ComponentType<any>> = {
  Gift: Gift,
  Coffee: Coffee,
  Flame: Flame,
  Bike: Bike,
  Heart: Heart,
  Ticket: Ticket,
};

export const LoveCoupons: React.FC<LoveCouponsProps> = ({ coupons, onRedeem }) => {
  return (
    <div id="love-coupons-section" className="w-full">
      <div className="text-center mb-6">
        <h3 className="font-serif font-bold text-2xl text-[#5d4037]">
          Your Romantic Love Coupons
        </h3>
        <p className="text-xs text-[#8d6e63] font-sans mt-0.5">
          Redeem these special vouchers whenever you like! I will honor them immediately.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {coupons.map((coupon) => {
          const IconComponent = iconMap[coupon.iconName] || Gift;

          return (
            <motion.div
              key={coupon.id}
              whileHover={{ scale: 1.02, y: -2 }}
              className={`relative overflow-hidden rounded-2xl p-5 border-2 shadow-md flex flex-col justify-between h-40 transition-all ${
                coupon.isRedeemed
                  ? "bg-[#f5ebe0]/40 border-[#d5bdaf] opacity-80"
                  : "bg-gradient-to-br from-white to-[#efebe9]/20 border-[#e3d5ca] hover:border-[#d5bdaf]"
              }`}
            >
              {/* Decorative dash line inside borders to look like a real coupon */}
              <div className="absolute inset-2 border border-dashed border-[#d5bdaf]/30 rounded-xl pointer-events-none" />

              {/* Header */}
              <div className="flex justify-between items-start z-10">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl ${coupon.isRedeemed ? "bg-[#efebe9] text-[#8d6e63]" : "bg-[#8d6e63] text-white animate-gentle-bounce"}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-[#5d4037] text-sm">{coupon.title}</h4>
                    <span className="text-[9px] uppercase font-mono text-[#a1887f]">Voucher ID: {coupon.id.substring(0, 8)}</span>
                  </div>
                </div>

                {coupon.isRedeemed ? (
                  <span className="bg-[#efebe9] text-[#8d6e63] text-[10px] font-sans font-bold px-2 py-0.5 rounded-full border border-[#d5bdaf]">
                    Redeemed!
                  </span>
                ) : (
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-sans font-bold px-2 py-0.5 rounded-full border border-emerald-200 animate-pulse">
                    Valid
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-[#5d4037]/85 italic font-sans my-2 pl-1 z-10 leading-snug">
                "{coupon.description}"
              </p>

              {/* Footer Actions */}
              <div className="flex justify-between items-end z-10">
                {coupon.isRedeemed ? (
                  <div className="flex items-center gap-1.5 text-[#8d6e63]/80">
                    <Calendar className="w-3 h-3" />
                    <span className="text-[10px] font-mono">
                      Redeemed on {coupon.redeemedDate ? new Date(coupon.redeemedDate).toLocaleDateString() : "Just Now"}
                    </span>
                  </div>
                ) : (
                  <span className="text-[9px] uppercase tracking-wider font-mono text-[#a1887f]">
                    Valid Anytime ❤️
                  </span>
                )}

                {!coupon.isRedeemed && (
                  <button
                    id={`redeem-coupon-btn-${coupon.id}`}
                    onClick={() => onRedeem(coupon.id)}
                    className="px-3.5 py-1 bg-[#8d6e63] hover:bg-[#5d4037] text-white font-semibold text-xs rounded-full shadow-sm cursor-pointer hover:scale-105 active:scale-95 transition-all"
                  >
                    Redeem Pass
                  </button>
                )}
              </div>

              {/* Coupon Notch cutouts on the left/right margins to make it look authentic */}
              <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-6 bg-[#fdfaf6] rounded-full border-r-2 border-[#efebe9]" />
              <div className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 bg-[#fdfaf6] rounded-full border-l-2 border-[#efebe9]" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
