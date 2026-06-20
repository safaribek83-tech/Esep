/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { RefreshCw, TrendingUp, TrendingDown, ArrowRightLeft } from 'lucide-react';
import { EstimateItem, EstimateCategory } from '../types';

interface BulkModifierProps {
  items: EstimateItem[];
  onUpdateAllItems: (updatedItems: EstimateItem[]) => void;
  currency: string;
}

export default function BulkModifier({ items, onUpdateAllItems, currency }: BulkModifierProps) {
  const [percentValue, setPercentValue] = useState<number>(10);
  const [multiplier, setMultiplier] = useState<number>(88); // Default approximate USD to KGS exchange multiplier

  const handleAdjustPrices = (multiplierPercent: number, targetCategory: 'all' | 'material' | 'labor') => {
    if (items.length === 0) return;
    
    const factor = 1 + (multiplierPercent / 100);
    const updated = items.map(item => {
      const isTarget = targetCategory === 'all' || item.category === targetCategory;
      if (isTarget) {
        // Round to nearest integer for clean presentation
        const newPrice = Math.max(0, Math.round(item.price * factor * 10) / 10);
        return { ...item, price: newPrice };
      }
      return item;
    });

    onUpdateAllItems(updated);
  };

  const handleMultiplyAllPrices = (factor: number) => {
    if (items.length === 0 || factor <= 0) return;

    const updated = items.map(item => {
      const newPrice = Math.max(0, Math.round(item.price * factor * 10) / 10);
      return { ...item, price: newPrice };
    });

    onUpdateAllItems(updated);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-rose-50 mb-3">
        <div className="flex items-center gap-1.5">
          <RefreshCw className="w-4 h-4 text-rose-500 animate-spin" style={{ animationDuration: '6s' }} />
          <h3 className="font-extrabold text-slate-800 text-sm md:text-base">Тез Баа Өзгөрткүч</h3>
        </div>
        <span className="text-[9px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded font-bold">
          Пакеттик Өзгөртүү
        </span>
      </div>

      <p className="text-[11px] text-slate-500 mb-4">
        Баанын өсүшүнө же инфляцияга карап, ушул сметадагы материалдардын же кызматтардын жалпы баасын бир заматта автоматтык түрдө өзгөртүңүз.
      </p>

      {/* Percentage triggers layout */}
      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 mb-1">
            <span>Өзгөртүү коэффициенти (%)</span>
            <span className="text-rose-700 font-mono font-black">{percentValue}%</span>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            step="1"
            value={percentValue}
            onChange={(e) => setPercentValue(parseInt(e.target.value) || 10)}
            className="w-full accent-rose-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
          />
        </div>

        {/* Buttons to mutate */}
        <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
          <button
            type="button"
            onClick={() => handleAdjustPrices(percentValue, 'material')}
            className="flex items-center justify-center gap-1 py-2 bg-slate-55 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer transition"
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Материалдарды +{percentValue}%</span>
          </button>
          
          <button
            type="button"
            onClick={() => handleAdjustPrices(-percentValue, 'material')}
            className="flex items-center justify-center gap-1 py-1.5 bg-slate-55 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer transition"
          >
            <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
            <span>Материалдарды -{percentValue}%</span>
          </button>

          <button
            type="button"
            onClick={() => handleAdjustPrices(percentValue, 'labor')}
            className="flex items-center justify-center gap-1 py-1.5 bg-slate-55 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer transition"
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Уста акысын +{percentValue}%</span>
          </button>

          <button
            type="button"
            onClick={() => handleAdjustPrices(-percentValue, 'labor')}
            className="flex items-center justify-center gap-1 py-1.5 bg-slate-55 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer transition"
          >
            <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
            <span>Уста акысын -{percentValue}%</span>
          </button>
        </div>

        {/* Currency or Exchange multiplier */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
          <div className="flex-1">
            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-tight mb-1">Валюта көбөйткүчү (мис: $) </label>
            <div className="flex rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
              <span className="px-2.5 py-1 text-slate-400 font-bold text-[10px] bg-slate-100 flex items-center">х</span>
              <input
                type="number"
                step="any"
                value={multiplier}
                onChange={(e) => setMultiplier(parseFloat(e.target.value) || 1)}
                className="w-full text-center py-1 w-12 font-bold font-mono text-xs focus:outline-none bg-transparent"
                placeholder="88"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleMultiplyAllPrices(multiplier)}
            className="self-end flex items-center justify-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-black cursor-pointer transition shadow-xs"
            title="Баардык саптардын баасын ушул санга көбөйтөт"
          >
            <ArrowRightLeft className="w-3 h-3 text-white" />
            <span>Баарын Көбөйтүү</span>
          </button>
        </div>
      </div>
    </div>
  );
}
