import React, { useState } from 'react';
import { 
  TrendingUp, 
  Target, 
  Users, 
  Star, 
  MessageSquare, 
  Check, 
  Copy, 
  PoundSterling,
  Award,
  ArrowUpRight
} from 'lucide-react';
import { MarketingCampaign, TemplarAdmin } from '../../types';

interface MarketingDepartmentProps {
  marketing: MarketingCampaign[];
  activeAdmin: TemplarAdmin;
}

export const MarketingDepartment: React.FC<MarketingDepartmentProps> = ({
  marketing,
  activeAdmin
}) => {
  const [copiedReview, setCopiedReview] = useState(false);
  const reviewMessageTemplate = `Hey Templar! Thanks for battling with us at Templars Airsoft UK this weekend. If you had a blast clearing the bunkers, would you mind dropping us a quick 5-star Google review? It helps our independent woodland site massively: https://g.page/r/templars-airsoft-uk/review - Cheers, ${activeAdmin.name} & The Marshal Team`;

  const handleCopyReview = () => {
    navigator.clipboard.writeText(reviewMessageTemplate);
    setCopiedReview(true);
    setTimeout(() => setCopiedReview(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 font-bold">
            DEPARTMENT 03 • MARKETING & GROWTH
          </span>
          <span className="text-zinc-500 text-xs font-mono">Player Acquisition Funnel</span>
        </div>
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <span>Local Marketing Campaigns, Review Generation & Conversion</span>
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Optimize booking conversions from walk-ons to full equipment hire packages across the Home Counties.
        </p>
      </div>

      {/* Conversion Funnel Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 shadow-md">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Overall Booking Conversion</span>
            <Target className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400 font-mono">
            39.2%
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Enquiries converted to confirmed deposits</div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 shadow-md">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Customer Lifetime Value</span>
            <PoundSterling className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            £142.00
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Avg 4.8 game attendances/year</div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 shadow-md">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Player Satisfaction</span>
            <Star className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono flex items-center gap-1.5">
            <span>4.9</span>
            <span className="text-xs font-normal text-zinc-400">/ 5.0 (184 Google reviews)</span>
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">98% positive marshal feedback</div>
        </div>
      </div>

      {/* Active Growth Campaigns */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-5 shadow-xl">
        <h3 className="font-bold text-sm text-zinc-100 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-red-400" />
          <span>Active Marketing Outreach Channels</span>
        </h3>

        <div className="space-y-3">
          {marketing.map((camp) => (
            <div key={camp.id} className="p-4 rounded-xl bg-zinc-850/80 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                    {camp.status}
                  </span>
                  <span className="text-zinc-400 font-mono">{camp.channel}</span>
                </div>
                <h4 className="font-bold text-white text-sm">{camp.name}</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">Objective: {camp.objective}</p>
              </div>

              <div className="flex items-center gap-6 font-mono">
                <div>
                  <span className="text-zinc-500 block text-[10px]">SPEND / BUDGET</span>
                  <strong className="text-zinc-200">£{camp.spendGBP} / £{camp.budgetGBP}</strong>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px]">CONVERTED</span>
                  <strong className="text-emerald-400">{camp.bookingsConverted} Bookings</strong>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px]">CONVERSION RATE</span>
                  <strong className="text-cyan-400">{camp.conversionRate}%</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Post-Game Google Review Generator Tool */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-sm text-zinc-100">Automated Post-Game Google Review Outreach</h3>
          </div>
          <span className="text-xs font-mono text-zinc-500">SMS / WhatsApp Blast</span>
        </div>

        <p className="text-xs text-zinc-400 mb-3">
          Send this one-click personalised message to registered Sunday game players to build Templars Airsoft UK social proof:
        </p>

        <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 leading-relaxed">
          {reviewMessageTemplate}
        </div>

        <div className="mt-3 flex justify-end">
          <button
            onClick={handleCopyReview}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs transition-all active:scale-95"
          >
            {copiedReview ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedReview ? 'Copied to Clipboard' : 'Copy Outreach Message'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
