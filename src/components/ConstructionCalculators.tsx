/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Layers, Wrench, Coins, HelpCircle, Plus } from 'lucide-react';
import { EstimateCategory } from '../types';

interface ConstructionCalculatorsProps {
  onAddItem: (name: string, category: EstimateCategory, quantity: number, unit: string, price: number) => void;
  currency: string;
}

export default function ConstructionCalculators({ onAddItem, currency }: ConstructionCalculatorsProps) {
  const [activeCalc, setActiveCalc] = useState<'brick' | 'concrete' | 'plaster'>('brick');

  // Brick Wall Calculator State
  const [wallLength, setWallLength] = useState<number>(12);
  const [wallHeight, setWallHeight] = useState<number>(3);
  const [brickThickness, setBrickThickness] = useState<number>(1.5); // 0.5, 1, 1.5, 2 bricks

  // Concrete Calculator State
  const [concLength, setConcLength] = useState<number>(10);
  const [concWidth, setConcWidth] = useState<number>(0.4);
  const [concDepth, setConcDepth] = useState<number>(0.8);

  // Plaster & Area Calculator State
  const [roomLength, setRoomLength] = useState<number>(5);
  const [roomWidth, setRoomWidth] = useState<number>(4);
  const [roomHeight, setRoomHeight] = useState<number>(3);
  const [plasterThick, setPlasterThick] = useState<number>(15); // mm

  // Formulas & Calculations
  const calculatedBricks = (() => {
    const area = wallLength * wallHeight;
    // Standard brick layout multipliers (Standard brick size: 250 x 120 x 65 mm)
    // Bricks per sq.meter of wall according to thickness of brick laying:
    // 0.5 brick (12cm) ~ 51 bricks
    // 1 brick (25cm) ~ 102 bricks
    // 1.5 bricks (38cm) ~ 153 bricks
    // 2 bricks (51cm) ~ 204 bricks
    let multiplier = 102;
    if (brickThickness === 0.5) multiplier = 51;
    else if (brickThickness === 1) multiplier = 102;
    else if (brickThickness === 1.5) multiplier = 153;
    else if (brickThickness === 2) multiplier = 204;

    return Math.ceil(area * multiplier);
  })();

  const calculatedConcrete = (() => {
    return parseFloat((concLength * concWidth * concDepth).toFixed(2));
  })();

  const cementAndSandOfConcrete = (() => {
    // Assuming Standard M200 Concrete per cubic meter:
    // Cement: ~350 kg (approx 7 bags of 50kg)
    // Send: ~0.5 cubic meter
    // Gravel: ~0.8 cubic meter
    const volume = calculatedConcrete;
    const cementBags = Math.ceil(volume * 7);
    const sandCubic = parseFloat((volume * 0.5).toFixed(1));
    return { cementBags, sandCubic };
  })();

  const calculatedPlaster = (() => {
    // Perimeters of 4 walls = (Length + Width) * 2 * Height minus guestimate doors/windows (about 10% reduction)
    const wallArea = (roomLength + roomWidth) * 2 * roomHeight * 0.9;
    
    // Plaster standard rotband consumption: ~8.5 kg per sq.m for 10mm thickness
    // For custom thickness: consumption = 8.5 * (customThick / 10) * wallArea
    const kgNeeded = 8.5 * (plasterThick / 10) * wallArea;
    const bagsNeeded = Math.ceil(kgNeeded / 30); // 30kg bags

    return { 
      wallArea: parseFloat(wallArea.toFixed(1)), 
      bags: bagsNeeded 
    };
  })();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-indigo-50 mb-4">
        <div className="flex items-center gap-1.5">
          <Layers className="w-5 h-5 text-indigo-600 animate-pulse" />
          <h3 className="font-extrabold text-slate-800 text-sm md:text-base">Тез Курулуш Калькулятору</h3>
        </div>
        <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-mono font-bold">
          Авто-Эсептөө
        </span>
      </div>

      {/* Tabs list inside Calculator widget */}
      <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl mb-4">
        <button
          type="button"
          onClick={() => setActiveCalc('brick')}
          className={`py-1.5 text-[11px] md:text-xs font-bold rounded-lg cursor-pointer transition-all duration-150 ${
            activeCalc === 'brick' ? 'bg-white text-indigo-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🧱 Кыш тизүү
        </button>
        <button
          type="button"
          onClick={() => setActiveCalc('concrete')}
          className={`py-1.5 text-[11px] md:text-xs font-bold rounded-lg cursor-pointer transition-all duration-150 ${
            activeCalc === 'concrete' ? 'bg-white text-indigo-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🎛️ Бетон куюу
        </button>
        <button
          type="button"
          onClick={() => setActiveCalc('plaster')}
          className={`py-1.5 text-[11px] md:text-xs font-bold rounded-lg cursor-pointer transition-all duration-150 ${
            activeCalc === 'plaster' ? 'bg-white text-indigo-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          💨 Шыбак & Шпатлевка
        </button>
      </div>

      {/* 1. BRICK WALL ESTIMATOR TAB PANEL */}
      {activeCalc === 'brick' && (
        <div className="space-y-3.5">
          <p className="text-[11px] text-slate-500 italic pb-1">
            * Дубалдын узундугун жана бийиктигин жазып, канча бышкан кыш кетерин дароо чыгарыңыз (эшик-терезелерди эске алат).
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Дубал узундугу (метр)</label>
              <input
                type="number"
                min="1"
                value={wallLength}
                onChange={(e) => setWallLength(parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-center"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Дубал бийиктиги (метр)</label>
              <input
                type="number"
                min="0.5"
                value={wallHeight}
                onChange={(e) => setWallHeight(parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-center"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">Кыш калыңдыгы (Тизүү тиби)</label>
            <select
              value={brickThickness}
              onChange={(e) => setBrickThickness(parseFloat(e.target.value))}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
            >
              <option value="0.5">Жарым кыш - 12 см (Аралык бөлмөлөр үчүн)</option>
              <option value="1">1 кыш басымы - 25 см (Ички жүк ташуучу дубал)</option>
              <option value="1.5">1.5 кыш басымы - 38 см (Сырткы негизги дубалдар)</option>
              <option value="2">2 кыш басымы - 51 см (Өтө калың сырткы дубал)</option>
            </select>
          </div>

          {/* Results Block */}
          <div className="bg-indigo-50/50 rounded-xl p-3 border border-indigo-100 flex items-center justify-between text-xs font-semibold">
            <div>
              <span className="text-slate-500 block text-[10px]">Жалпы орточо бышкан кыш саны:</span>
              <span className="text-sm font-extrabold text-indigo-950 font-mono">{calculatedBricks.toLocaleString('ru-RU')} даана</span>
            </div>
            <button
              type="button"
              onClick={() => {
                onAddItem(
                  `Бышкан кыш (${wallLength}м х ${wallHeight}м дубалга, калыңдыгы: ${brickThickness} кыш)`,
                  'material',
                  calculatedBricks,
                  'даана',
                  10
                );
              }}
              className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold cursor-pointer transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Кошуу</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. CONCRETE ESTIMATOR TAB PANEL */}
      {activeCalc === 'concrete' && (
        <div className="space-y-3.5">
          <p className="text-[11px] text-slate-500 italic pb-1">
            * Фундаменттин, стяжканын же мамылардын бетон көлөмүн жана зарыл цемент каптарынын санын эсептеңиз.
          </p>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Узундугу (м)</label>
              <input
                type="number"
                min="0.1"
                step="any"
                value={concLength}
                onChange={(e) => setConcLength(parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-center"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Туурасы (м)</label>
              <input
                type="number"
                min="0.1"
                step="any"
                value={concWidth}
                onChange={(e) => setConcWidth(parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-center"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Тереңдиги (м)</label>
              <input
                type="number"
                min="0.1"
                step="any"
                value={concDepth}
                onChange={(e) => setConcDepth(parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-center"
              />
            </div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] space-y-1.5 text-slate-600">
            <div className="flex justify-between font-medium">
              <span>Бетондун жалпы суммалык көлөмү:</span>
              <strong className="text-slate-800 font-mono">{calculatedConcrete} куб.м</strong>
            </div>
            <div className="flex justify-between font-medium">
              <span>Болжолдуу цемент М400 (50кг каптарда):</span>
              <strong className="text-slate-800 font-mono">{cementAndSandOfConcrete.cementBags} кап</strong>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                onAddItem(
                  `Даяр Бетон аралашмасы (${concLength}м х ${concWidth}м х ${concDepth}м фундаментке)`,
                  'material',
                  calculatedConcrete,
                  'куб.м',
                  3600
                );
              }}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 border border-indigo-200 hover:bg-indigo-50 text-indigo-700 rounded-lg text-[11px] font-bold cursor-pointer transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Бетон кошуу</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onAddItem(
                  `Цемент М400 Канты (Бетон куюуга кошумча сатылып алынат)`,
                  'material',
                  cementAndSandOfConcrete.cementBags,
                  'кап',
                  450
                );
              }}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[11px] font-bold cursor-pointer transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Цемент кошуу</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. PLASTER TAB PANEL */}
      {activeCalc === 'plaster' && (
        <div className="space-y-3.5">
          <p className="text-[11px] text-slate-500 italic pb-1">
            * Бөлмөнүн бийиктигин, туурасын жана узундугун жазыңыз. Бир эле убакта дубал аянты жана Ротбанд шпаклевка каптарынын эсебин чыгарат.
          </p>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Узундук (м)</label>
              <input
                type="number"
                min="1"
                value={roomLength}
                onChange={(e) => setRoomLength(parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-center"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Туурасы (м)</label>
              <input
                type="number"
                min="1"
                value={roomWidth}
                onChange={(e) => setRoomWidth(parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-center"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Бийиктик (м)</label>
              <input
                type="number"
                min="1.5"
                value={roomHeight}
                onChange={(e) => setRoomHeight(parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-center"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">Орточо шыбак калыңдыгы (миллиметр)</label>
            <input
              type="range"
              min="5"
              max="40"
              step="5"
              value={plasterThick}
              onChange={(e) => setPlasterThick(parseInt(e.target.value) || 10)}
              className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-400 mt-1">
              <span>Ичке (5мм)</span>
              <span className="font-bold text-indigo-700 font-mono">{plasterThick} мм шыбак</span>
              <span>Калың (40мм)</span>
            </div>
          </div>

          <div className="bg-indigo-50/40 rounded-xl p-3 border border-indigo-100 space-y-2 text-xs">
            <div className="flex justify-between text-[11px] font-semibold text-indigo-950">
              <span>Шыбала турган дубал аянты:</span>
              <span className="font-mono">{calculatedPlaster.wallArea} кв.м</span>
            </div>
            <div className="flex justify-between text-[11px] font-semibold text-indigo-950">
              <span>Зарыл болгон Ротбанд каптары (30кг):</span>
              <span className="font-mono text-amber-600 font-black">{calculatedPlaster.bags} кап</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                onAddItem(
                  `Ротбанд гипс шыбагы (30кг) (${calculatedPlaster.wallArea} кв.м дубалга)`,
                  'material',
                  calculatedPlaster.bags,
                  'кап',
                  460
                );
              }}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold cursor-pointer transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Шыбак кошуу</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onAddItem(
                  `Дубалдарды шыбап маяк менен тегиздөө (Уста акысы)`,
                  'labor',
                  calculatedPlaster.wallArea,
                  'кв.м',
                  350
                );
              }}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 border border-slate-350 hover:bg-slate-100 text-slate-700 rounded-lg text-[11px] font-semibold cursor-pointer transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Уста акысын кошуу</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
