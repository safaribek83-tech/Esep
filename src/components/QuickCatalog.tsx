/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Search, Grid, Plus, Check } from 'lucide-react';
import { EstimateCategory } from '../types';

interface CatalogPreset {
  name: string;
  category: EstimateCategory;
  price: number;
  unit: string;
  emoji: string;
}

interface QuickCatalogProps {
  onAddItem: (name: string, category: EstimateCategory, quantity: number, unit: string, price: number) => void;
  currency: string;
}

const PRESET_CATALOG: CatalogPreset[] = [
  // MATERIALS
  { name: 'Цемент Кант М400', category: 'material', price: 440, unit: 'кап', emoji: '📦' },
  { name: 'Цемент Кант М500', category: 'material', price: 510, unit: 'кап', emoji: '📦' },
  { name: 'Бышкан бышык кыш (Куршаб/Чүй)', category: 'material', price: 10, unit: 'даана', emoji: '🧱' },
  { name: 'Пескоблок стандарттык', category: 'material', price: 45, unit: 'даана', emoji: '🧱' },
  { name: 'Арматура негизги 12мм', category: 'material', price: 85, unit: 'метр', emoji: '🪵' },
  { name: 'Арматура негизги 14мм', category: 'material', price: 110, unit: 'метр', emoji: '🪵' },
  { name: 'Ротбанд гипс шыбагы (30кг)', category: 'material', price: 460, unit: 'кап', emoji: '🎒' },
  { name: 'Алинекс Глаат шпатлевка (25кг)', category: 'material', price: 520, unit: 'кап', emoji: '🎒' },
  { name: 'Карьер жуулган куму', category: 'material', price: 6500, unit: 'Камаз', emoji: '⏳' },
  { name: 'Щебень таза таштары', category: 'material', price: 7000, unit: 'Камаз', emoji: '🪨' },
  { name: 'ГИПСОКАРТОН Кнауф (9.5мм)', category: 'material', price: 410, unit: 'даана', emoji: '📄' },
  { name: 'Чатыр үчүн жыгач устун (Брус)', category: 'material', price: 850, unit: 'даана', emoji: '🪵' },
  { name: 'Кафель клейи (Керамогранит үчүн)', category: 'material', price: 450, unit: 'кап', emoji: '🥛' },
  { name: 'Үй ичине ламинат 33-класс', category: 'material', price: 750, unit: 'кв.м', emoji: '🪵' },
  { name: 'Дубал обоилору жакшы сапатта', category: 'material', price: 1800, unit: 'рулон', emoji: '🗞️' },
  { name: 'Электр зымы үч кабат ВВГ 3х2.5', category: 'material', price: 85, unit: 'метр', emoji: '⚡' },
  { name: 'Профнастил калыңдыгы 0.45', category: 'material', price: 450, unit: 'кв.м', emoji: '🛡️' },

  // LABOR
  { name: 'Дубалдарды шыбап маяк менен тегиздөө', category: 'labor', price: 350, unit: 'кв.м', emoji: '👷' },
  { name: 'Бышкан кыш калоо усталарга', category: 'labor', price: 6, unit: 'даана', emoji: '👷' },
  { name: 'Кафель чаптоо кызматы', category: 'labor', price: 800, unit: 'кв.м', emoji: '👷' },
  { name: 'Ламинат төшөө эмгеги', category: 'labor', price: 180, unit: 'кв.м', emoji: '👷' },
  { name: 'Обой чаптоо уста акысы', category: 'labor', price: 150, unit: 'кв.м', emoji: '👷' },
  { name: 'Сантехника монтаждоо иши', category: 'labor', price: 15000, unit: 'комплект', emoji: '🔧' },
  { name: 'Электр зымдарын куруу иши', category: 'labor', price: 12000, unit: 'комплект', emoji: '🔌' },
  { name: 'Бөлмөлөргө гипсокартон шып куруу', category: 'labor', price: 400, unit: 'кв.м', emoji: '👷' },
  { name: 'Бетон куюу уста эмгеги', category: 'labor', price: 3000, unit: 'куб.м', emoji: '👷' },

  // TRANSPORT
  { name: 'Портер шаар ичинде жүк ташуу', category: 'transport', price: 1200, unit: 'рейс', emoji: '🚚' },
  { name: 'Портер шаар тышы же айылга жеткирүү', category: 'transport', price: 1800, unit: 'рейс', emoji: '🚚' },
  { name: 'Камаз менен чоң жүк ташуу кызматы', category: 'transport', price: 4500, unit: 'рейс', emoji: '🚚' },
  { name: 'Экскаватор жалдап жер казуу акысы', category: 'transport', price: 1800, unit: 'саат', emoji: '🚜' },
  { name: 'Курулуш таштандыларын Портерге жүктөп чыгаруу', category: 'transport', price: 1500, unit: 'рейс', emoji: '🧹' },

  // OTHER
  { name: 'Тойдо тамадалык кызмат (Алып баруучу)', category: 'labor', price: 30000, unit: 'киши', emoji: '🎤' },
  { name: 'Музыканттар жана Ырчылар тобу', category: 'labor', price: 25000, unit: 'комплект', emoji: '🎻' },
  { name: 'Кафе аренда коноктор акысы', category: 'labor', price: 1800, unit: 'киши', emoji: '🍽️' },
  { name: 'Суусундуктар (ширелер, Кола, суулар)', category: 'material', price: 65, unit: 'бөтөлкө', emoji: '🥤' }
];

export default function QuickCatalog({ onAddItem, currency }: QuickCatalogProps) {
  const [catSearch, setCatSearch] = useState('');
  const [filterCat, setFilterCat] = useState<'all' | EstimateCategory>('all');
  const [addedFlags, setAddedFlags] = useState<Record<string, boolean>>({});

  const filteredPresets = PRESET_CATALOG.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(catSearch.toLowerCase());
    const matchesCategory = filterCat === 'all' || item.category === filterCat;
    return matchesSearch && matchesCategory;
  });

  const handleSelectPreset = (preset: CatalogPreset) => {
    onAddItem(preset.name, preset.category, 1, preset.unit, preset.price);
    
    // Quick success animation visual feedback
    const key = `${preset.name}_${preset.price}`;
    setAddedFlags(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setAddedFlags(prev => ({ ...prev, [key]: false }));
    }, 1500);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
      <div className="flex items-center gap-1.5 pb-3 border-b border-sky-50 mb-3">
        <Grid className="w-5 h-5 text-sky-600" />
        <h3 className="font-extrabold text-slate-800 text-sm md:text-base">Даяр Чыгымдар Каталогу</h3>
      </div>
      
      <p className="text-[11px] text-slate-500 mb-3">
        Жазуу менен убара болбой, эң популярдуу курулуш материалдарын жана уста акыларын <strong>бир басуу менен кошуңуз</strong>.
      </p>

      {/* Internal Search Bar for Catalog */}
      <div className="relative mb-3">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        <input
          type="text"
          value={catSearch}
          onChange={(e) => setCatSearch(e.target.value)}
          placeholder="Каталогдон тез издөө..."
          className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
        />
        {catSearch && (
          <button onClick={() => setCatSearch('')} className="absolute right-2 px-1 text-slate-400 font-bold hover:text-slate-600 text-xs">
            ✖
          </button>
        )}
      </div>

      {/* Quick category filter tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        <button
          type="button"
          onClick={() => setFilterCat('all')}
          className={`px-2 py-1 rounded text-[10px] font-bold ${
            filterCat === 'all' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Баары ({PRESET_CATALOG.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterCat('material')}
          className={`px-2 py-1 rounded text-[10px] font-bold ${
            filterCat === 'material' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          📦 Материал
        </button>
        <button
          type="button"
          onClick={() => setFilterCat('labor')}
          className={`px-2 py-1 rounded text-[10px] font-bold ${
            filterCat === 'labor' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          🛠️ Эмгек
        </button>
        <button
          type="button"
          onClick={() => setFilterCat('transport')}
          className={`px-2 py-1 rounded text-[10px] font-bold ${
            filterCat === 'transport' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          🚚 Жеткирүү
        </button>
      </div>

      {/* PRESETS LIST WITH INJECT ACTIONS */}
      <div className="max-h-[350px] overflow-y-auto pr-1 space-y-1.5 divide-y divide-slate-100">
        {filteredPresets.length === 0 ? (
          <p className="text-[11px] text-slate-400 text-center py-4 italic">Шайкеш чыгымдар табылган жок.</p>
        ) : (
          filteredPresets.map((preset, idx) => {
            const key = `${preset.name}_${preset.price}`;
            const isAdded = addedFlags[key];

            return (
              <div 
                key={idx} 
                className="flex items-center justify-between pt-1.5 first:pt-0 group hover:bg-slate-50/50 p-1 rounded-md transition"
              >
                <div className="flex items-start gap-1.5 max-w-[70%]">
                  <span className="text-sm mt-0.5">{preset.emoji}</span>
                  <div>
                    <span className="text-xs font-semibold text-slate-700 block line-clamp-1">{preset.name}</span>
                    <span className="text-[9px] text-slate-400 font-medium">
                      Орточо: {preset.price} {currency === 'USD' ? '$' : currency === 'RUB' ? 'руб.' : 'сом'} / {preset.unit}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`flex items-center gap-1 px-3 py-1 text-[10px] font-bold rounded-lg cursor-pointer transition ${
                    isAdded 
                      ? 'bg-emerald-500 text-white shadow-sm' 
                      : 'bg-slate-100 hover:bg-sky-600 hover:text-white text-slate-700'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Кошулду</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3 h-3" />
                      <span>Кошуу</span>
                    </>
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
