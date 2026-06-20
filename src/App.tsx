/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { 
  Calculator, 
  Plus, 
  Trash2, 
  Printer, 
  Save, 
  FileText, 
  CheckCircle2, 
  Copy, 
  Check, 
  X, 
  Coins, 
  TrendingUp, 
  Wrench, 
  Truck, 
  Sliders, 
  Download, 
  Upload,
  Layers,
  Sparkles,
  Search,
  HelpCircle
} from 'lucide-react';
import { TEMPLATES } from './data/templates';
import { EstimateItem, EstimateProject, EstimateCategory, Currency } from './types';

// Import our newly created modular sub-components
import ConstructionCalculators from './components/ConstructionCalculators';
import QuickCatalog from './components/QuickCatalog';
import FloatingCalculator from './components/FloatingCalculator';
import BulkModifier from './components/BulkModifier';

export default function App() {
  // Store all estimates in local storage to prevent data loss.
  const [project, setProject] = useState<EstimateProject>(() => {
    const saved = localStorage.getItem('smeta_active_project');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.items) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse saved project, loading default', e);
      }
    }
    return JSON.parse(JSON.stringify(TEMPLATES.renovation));
  });

  const [activeTab, setActiveTab] = useState<'all' | EstimateCategory>('all');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [activeSuggestionRowId, setActiveSuggestionRowId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Track focused field coordinates so calculator knows where to insert formulas
  const [lastFocusedField, setLastFocusedField] = useState<{ id: string; name: string; field: 'quantity' | 'price' } | null>(null);

  // Custom categories translations config
  const categoryConfig: Record<EstimateCategory, { label: string; icon: any; color: string; bg: string; border: string }> = {
    material: { 
      label: 'Материалдар', 
      icon: Layers, 
      color: 'text-sky-600', 
      bg: 'bg-sky-50', 
      border: 'border-sky-200' 
    },
    labor: { 
      label: 'Жумушчулар / Кызматтар', 
      icon: Wrench, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50', 
      border: 'border-amber-200' 
    },
    transport: { 
      label: 'Транспорт кызматы', 
      icon: Truck, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50', 
      border: 'border-indigo-200' 
    },
    other: { 
      label: 'Башка чыгымдар', 
      icon: Coins, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50', 
      border: 'border-emerald-200' 
    }
  };

  // For confirmations
  const [confirmTemplate, setConfirmTemplate] = useState<string | null>(null);
  // Manual JSON import/export panel
  const [showImportExport, setShowImportExport] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [copiedState, setCopiedState] = useState(false);

  // Auto save when project state changes
  useEffect(() => {
    localStorage.setItem('smeta_active_project', JSON.stringify(project));
  }, [project]);

  // Handle template selection
  const handleLoadTemplate = (templateKey: string, force = false) => {
    if (!force) {
      setConfirmTemplate(templateKey);
      return;
    }

    const template = TEMPLATES[templateKey];
    if (template) {
      const newPrj = JSON.parse(JSON.stringify(template));
      newPrj.updatedAt = new Date().toISOString();
      setProject(newPrj);
      setActiveTab('all');
      setConfirmTemplate(null);
      showTemporaryBanner('Жаңы шаблон ийгиликтүү жүктөлдү!');
    }
  };

  const showTemporaryBanner = (text: string) => {
    setSaveSuccessMessage(text);
    setTimeout(() => {
      setSaveSuccessMessage(null);
    }, 3000);
  };

  // Quick manual save feedback
  const handleManualSave = () => {
    const updatedPrj = {
      ...project,
      updatedAt: new Date().toISOString()
    };
    setProject(updatedPrj);
    localStorage.setItem('smeta_active_project', JSON.stringify(updatedPrj));
    showTemporaryBanner('Смета браузердин эсинде сакталды!');
  };

  // Currency Formatter helper
  const formatMoney = (amount: number, curr: Currency) => {
    const suffix = curr === 'KGS' ? ' сом' : curr === 'USD' ? ' $' : ' руб.';
    return amount.toLocaleString('ru-RU', { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 2 
    }) + suffix;
  };

  // Items manipulation (Add empty row)
  const handleAddItem = (categoryType: EstimateCategory = 'material') => {
    const newItem: EstimateItem = {
      id: 'custom_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      name: '',
      category: categoryType,
      quantity: 1,
      unit: categoryType === 'material' ? 'кап' : categoryType === 'labor' ? 'кв.м' : 'рейс',
      price: 0
    };

    setProject(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));

    // Scroll to input after creation is handled smoothly
    setTimeout(() => {
      const container = document.getElementById('items-table-container');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  };

  // Add item with explicit catalog/calculator values
  const handleAddItemWithValues = (
    name: string,
    categoryType: EstimateCategory,
    quantity: number,
    unit: string,
    price: number
  ) => {
    const newItem: EstimateItem = {
      id: 'custom_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      name,
      category: categoryType,
      quantity,
      unit,
      price
    };

    setProject(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));

    showTemporaryBanner(`"${name.slice(0, 22)}..." сметага кошулду.`);

    setTimeout(() => {
      const container = document.getElementById('items-table-container');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 120);
  };

  const handleUpdateItem = (id: string, field: keyof EstimateItem, value: any) => {
    setProject(prev => {
      const updatedItems = prev.items.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity') {
            updated.quantity = value === '' ? 0 : parseFloat(value) || 0;
          }
          if (field === 'price') {
            updated.price = value === '' ? 0 : parseFloat(value) || 0;
          }
          return updated;
        }
        return item;
      });
      return { ...prev, items: updatedItems };
    });
  };

  const handleDeleteItem = (id: string) => {
    setProject(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const handleClearAllItems = () => {
    if (window.confirm('Сметадагы бардык саптарды өчүрүүгө макулсузбу?')) {
      setProject(prev => ({
        ...prev,
        items: []
      }));
    }
  };

  // Autocomplete support
  const filteredSuggestions = (query: string) => {
    if (!query) return [];
    // Standard suggestions list
    const suggestions = [
      'Цемент М400 (кап)', 'Цемент М500 (кап)', 'Бышкан кыш (даана)', 'Жуулган кум (Камаз)',
      'Щебень шагыл (Камаз)', 'Арматура 12мм (метр)', 'Ротбанд штукатурка (кап)',
      'Кафель клейи (кап)', 'Гипсокартон Кнауф (даана)', 'Дубал обоилору (рулон)',
      'Штукатурка жасоо уста акысы', 'Стяжка куюу уста акысы', 'Кафель чаптоо устасы',
      'Портер такси кызматы', 'Курулуш таштандыларын чыгаруу'
    ];
    return suggestions.filter(item => 
      item.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  };

  // Total Calculations
  const calculatedTotals = useMemo(() => {
    let subtotalMaterials = 0;
    let subtotalLabor = 0;
    let subtotalTransport = 0;
    let subtotalOther = 0;

    project.items.forEach(item => {
      const total = item.quantity * item.price;
      if (item.category === 'material') subtotalMaterials += total;
      else if (item.category === 'labor') subtotalLabor += total;
      else if (item.category === 'transport') subtotalTransport += total;
      else subtotalOther += total;
    });

    const netSubtotal = subtotalMaterials + subtotalLabor + subtotalTransport + subtotalOther;
    const contingencyAmount = (netSubtotal * project.contingencyPercent) / 100;
    const subtotalWithBuffer = netSubtotal + contingencyAmount;
    const taxAmount = (subtotalWithBuffer * project.taxPercent) / 100;
    const discountAmount = (subtotalWithBuffer * project.discountPercent) / 100;
    const grandTotal = subtotalWithBuffer + taxAmount - discountAmount;

    return {
      material: subtotalMaterials,
      labor: subtotalLabor,
      transport: subtotalTransport,
      other: subtotalOther,
      netSubtotal,
      contingencyAmount,
      taxAmount,
      discountAmount,
      grandTotal
    };
  }, [project]);

  // Project item filter by category AND search input
  const filteredItems = useMemo(() => {
    return project.items.filter(item => {
      const matchesTab = activeTab === 'all' || item.category === activeTab;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.unit.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [project.items, activeTab, searchTerm]);

  // JSON Import & Export handlers
  const handleExportJson = () => {
    navigator.clipboard.writeText(JSON.stringify(project, null, 2));
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(importJsonText);
      if (!parsed.title || !Array.isArray(parsed.items)) {
        throw new Error('Ката: Файлдын түзүмү "title" талаасын жана "items" тизмесин камтышы керек.');
      }
      const sanitisedItems = parsed.items.map((item: any, idx: number) => ({
        id: item.id || `imported_${idx}_${Date.now()}`,
        name: String(item.name || ''),
        category: (item.category as EstimateCategory) || 'material',
        quantity: typeof item.quantity === 'number' ? item.quantity : 1,
        unit: String(item.unit || 'даана'),
        price: typeof item.price === 'number' ? item.price : 0,
      }));

      const importedProject: EstimateProject = {
        id: parsed.id || 'imported_' + Date.now(),
        title: String(parsed.title),
        clientName: String(parsed.clientName || ''),
        currency: (parsed.currency as Currency) || 'KGS',
        discountPercent: isNaN(Number(parsed.discountPercent)) ? 0 : Number(parsed.discountPercent),
        taxPercent: isNaN(Number(parsed.taxPercent)) ? 0 : Number(parsed.taxPercent),
        contingencyPercent: isNaN(Number(parsed.contingencyPercent)) ? 5 : Number(parsed.contingencyPercent),
        items: sanitisedItems,
        updatedAt: new Date().toISOString()
      };

      setProject(importedProject);
      setJsonError(null);
      setShowImportExport(false);
      setImportJsonText('');
      showTemporaryBanner('Смета сырттан ийгиликтүү жүктөлдү!');
    } catch (err: any) {
      setJsonError(err.message || 'Ката: Туура эмес форматтагы JSON тексти.');
    }
  };

  // Inject computed math result from notepad directly into table row
  const handleInjectValue = (id: string, field: 'quantity' | 'price', value: number) => {
    handleUpdateItem(id, field, value);
    showTemporaryBanner(`Тандалган сапка ${value} саны ийгиликтүү орнотулду!`);
  };

  const triggerPrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 antialiased selection:bg-emerald-100 pb-16">
      
      {/* GLOBAL BANNER NOTIFICATION */}
      {saveSuccessMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs md:text-sm animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 stroke-[2.5]" />
          <span className="font-bold">{saveSuccessMessage}</span>
        </div>
      )}

      {/* HEADER BAR */}
      <header className="print:hidden sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200/80 px-4 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 rounded-xl text-white shadow-md shadow-emerald-600/30">
              <Calculator className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-sm md:text-base font-black text-slate-900 tracking-tight">ЫҢГАЙЛУУ СМЕТА ЭСЕПТЕГИЧ</h1>
              <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-wider">Курулуш & Оңдоо Чыгымдарын Калькуляциялоо</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleManualSave}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              title="Долбоорду сактоо"
            >
              <Save className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Сактоо</span>
            </button>

            <button
              onClick={() => setShowImportExport(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              title="Смета импорт же экспорт"
            >
              <FileText className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Импорт / Экспорт</span>
            </button>

            <button
              onClick={triggerPrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/10 active:translate-y-[1px] text-white text-xs font-black rounded-xl transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Басып чыгаруу / PDF</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-6">
        
        {/* TOP METADATA PANEL & SHABLONS BAR */}
        <div className="print:hidden bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-3.5 flex-1 max-w-2xl">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
              Тез баштоо үчүн даяр Смета Шаблондору:
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleLoadTemplate('renovation')}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition cursor-pointer ${
                  project.id.startsWith('template_renovation')
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                🏠 Бөлмө Ремонту
              </button>
              <button
                onClick={() => handleLoadTemplate('houseBuild')}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition cursor-pointer ${
                  project.id.startsWith('template_houseBuild')
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                🧱 Үй Куруу Чыгымдары
              </button>
              <button
                onClick={() => handleLoadTemplate('toiWedding')}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition cursor-pointer ${
                  project.id.startsWith('template_toi')
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                🎤 Той же Чоң Иш-Чара
              </button>
              <button
                onClick={() => handleLoadTemplate('empty')}
                className="px-3 py-1.5 text-xs font-bold rounded-xl border bg-slate-50 border-slate-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-slate-600 transition cursor-pointer"
              >
                🧹 Жаңы таза барак
              </button>
            </div>
          </div>

          {/* PROJECT CORE SPECIFICATION */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:w-auto w-full md:border-l border-slate-200 md:pl-5">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Смета темасы</label>
              <input
                type="text"
                value={project.title}
                onChange={(e) => setProject({ ...project, title: e.target.value })}
                placeholder="Мисалы: 3 бөлмөлүү үй оңдоо"
                className="w-full px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs font-bold text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Буйрутмачы (Кардар)</label>
              <input
                type="text"
                value={project.clientName}
                onChange={(e) => setProject({ ...project, clientName: e.target.value })}
                placeholder="Мисалы: Асан Салиев"
                className="w-full px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs font-bold text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Валюта</label>
              <select
                value={project.currency}
                onChange={(e) => setProject({ ...project, currency: e.target.value as Currency })}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 focus:outline-none rounded-lg text-xs font-bold text-slate-700 cursor-pointer"
              >
                <option value="KGS">KGS (сом)</option>
                <option value="USD">USD ($)</option>
                <option value="RUB">RUB (руб)</option>
              </select>
            </div>
          </div>
        </div>

        {/* CONFIRM TEMPLATE DIALOG MODAL */}
        {confirmTemplate && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
              <h3 className="text-sm font-black text-slate-950 uppercase">Баракты тазалоо</h3>
              <p className="text-xs text-slate-500 mt-2">
                Жаңы шаблонду жүктөгөндө азыркы жазылып жаткан баардык эсептөөлөр өчүрүлөт. 
                Улантууну каалайсызбы?
              </p>
              <div className="mt-4 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setConfirmTemplate(null)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 bg-slate-50 rounded-lg"
                >
                  Артка кайтуу
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadTemplate(confirmTemplate, true)}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow cursor-pointer"
                >
                  Ооба, жаңыртуу
                </button>
              </div>
            </div>
          </div>
        )}

        {/* IMPORT / EXPORT CODES MODAL */}
        {showImportExport && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100">
              <div className="flex justify-between items-center pb-3 border-b border-slate-150">
                <h3 className="text-sm md:text-base font-black text-slate-900 uppercase">Смета файлдарын Импорт & Экспорт</h3>
                <button onClick={() => { setShowImportExport(false); setJsonError(null); }} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <p className="text-xs text-slate-500">
                  Башка телефон же компьютерге смета дайындарын өткөрүү үчүн кодду көчүрүп алыңыз, же даяр кодду төмөнкү талаага жабыштырып <strong>"Күчүнө киргизүү"</strong> баскычын басыңыз.
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleExportJson}
                    className="flex items-center justify-center gap-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{copiedState ? 'Код көчүрүлдү!' : 'Смета кодун көчүрүү'}</span>
                  </button>
                  <button
                    onClick={handleImportJson}
                    className="flex items-center justify-center gap-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Импорт кодун киргизүү</span>
                  </button>
                </div>

                <textarea
                  rows={8}
                  placeholder='Бул жерге Смета структуралык кодун (JSON форматында) жабыштырыңыз же экспортту басканда код ушул жерден көчүрүлөт...'
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-mono text-[11px] focus:ring-1 focus:ring-emerald-500"
                />

                {jsonError && (
                  <p className="text-[11px] text-red-500 font-bold bg-red-50 p-2.5 rounded-lg border border-red-200">{jsonError}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MAIN ROW WORKSPACE COOP */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT PANEL: Responsive Item Editor & Category Tabs */}
          <div className="lg:col-span-8 print:w-full bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
            
            {/* Category Filter Tabs & Actions Area */}
            <div className="print:hidden border-b border-slate-100 bg-slate-50/50 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'all' 
                      ? 'bg-slate-800 text-white shadow-sm' 
                      : 'hover:bg-slate-200/70 text-slate-600'
                  }`}
                >
                  <span>Баардыгы</span>
                  <span className="bg-slate-200/60 text-slate-800 font-mono text-[9px] px-1.5 py-0.5 rounded-full inline-block">
                    {project.items.length}
                  </span>
                </button>

                {Object.entries(categoryConfig).map(([key, cfg]) => {
                  const Icon = cfg.icon;
                  const count = project.items.filter(i => i.category === key).length;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key as EstimateCategory)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        activeTab === key 
                          ? `bg-slate-800 text-white shadow-sm` 
                          : `hover:${cfg.bg} text-slate-600`
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5`} />
                      <span>{cfg.label}</span>
                      <span className="bg-slate-200/60 text-slate-800 font-mono text-[9px] px-1.5 py-0.5 rounded-full inline-block">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* SEARCH FIELD BAR */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Сметадан издөө..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-48 pl-7 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
                {searchTerm ? (
                  <button 
                    onClick={() => setSearchTerm('')} 
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                ) : null}
              </div>
            </div>

            {/* MAIN DATA EDITOR - COMPACT & INTUITIVE TABLE */}
            <div id="items-table-container" className="overflow-x-auto max-h-[580px] min-h-[300px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-4 py-3 min-w-[200px]">Чыгымдардын аталышы жана бирдиги</th>
                    <th className="px-3 py-3 w-[120px]">Категориясы</th>
                    <th className="px-3 py-3 w-[80px] text-center">Саны</th>
                    <th className="px-3 py-3 w-[80px] text-center">Бирдиги</th>
                    <th className="px-3 py-3 w-[110px] text-right">Баасы ({project.currency === 'KGS' ? 'сом' : project.currency === 'USD' ? '$' : 'руб'})</th>
                    <th className="px-4 py-3 w-[120px] text-right">Жалпысы</th>
                    <th className="px-3 py-3 w-[50px] text-center print:hidden"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-16 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center">
                          <CheckCircle2 className="w-10 h-10 text-slate-300 stroke-1 mb-2" />
                          <p className="font-semibold text-slate-500 text-sm">Бул жер бош калды</p>
                          <p className="text-xs text-slate-400 mt-1">Тандалган категорияда бир дагы эсеп жок же тапкан жоксуз.</p>
                          <div className="mt-4 flex gap-2">
                            <button
                              onClick={() => handleAddItem(activeTab === 'all' ? 'material' : activeTab)}
                              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 hover:shadow text-white text-xs font-bold rounded-lg transition cursor-pointer"
                            >
                              Биринчи сапты кошуу
                            </button>
                            <button
                              onClick={() => handleLoadTemplate('renovation', true)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition"
                            >
                              Ремонт шаблонун жүктөө
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map(item => {
                      const computedRowTotal = item.quantity * item.price;
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition duration-150">
                          
                          {/* Item Name Column with suggestions helper */}
                          <td className="px-4 py-2.5 relative">
                            <div className="relative">
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                                onFocus={() => {
                                  setActiveSuggestionRowId(item.id);
                                }}
                                onBlur={() => setTimeout(() => {
                                  setActiveSuggestionRowId(null);
                                }, 220)}
                                placeholder="Мисалы: Бышкан курулуш кышы"
                                className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-sm font-semibold text-slate-700 placeholder-slate-400/80 px-2.5 py-1.5 border border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:outline-none rounded-lg transition"
                              />

                              {/* Autocomplete Suggestions Popup */}
                              {activeSuggestionRowId === item.id && item.name && filteredSuggestions(item.name).length > 0 && (
                                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-30 divide-y divide-slate-100 max-h-56 overflow-y-auto">
                                  {filteredSuggestions(item.name).map((suggestion, sIdx) => (
                                    <button
                                      key={sIdx}
                                      type="button"
                                      onClick={() => {
                                        let cleanName = suggestion;
                                        let guessedUnit = 'даана';
                                        
                                        if (suggestion.includes('(кап)')) {
                                          cleanName = suggestion.replace('(кап)', '').trim();
                                          guessedUnit = 'кап';
                                        } else if (suggestion.includes('(кв.м)')) {
                                          cleanName = suggestion.replace('(кв.м)', '').trim();
                                          guessedUnit = 'кв.м';
                                        } else if (suggestion.includes('(Камаз)')) {
                                          cleanName = suggestion.replace('(Камаз)', '').trim();
                                          guessedUnit = 'Камаз';
                                        } else if (suggestion.includes('(метр)')) {
                                          cleanName = suggestion.replace('(метр)', '').trim();
                                          guessedUnit = 'метр';
                                        }
                                        
                                        handleUpdateItem(item.id, 'name', cleanName);
                                        handleUpdateItem(item.id, 'unit', guessedUnit);
                                      }}
                                      className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-emerald-50 hover:text-emerald-950 transition flex items-center justify-between"
                                    >
                                      <span>{suggestion}</span>
                                      <span className="text-[9px] bg-slate-100 text-slate-400 px-1 py-0.5 rounded uppercase">Тандоо</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Category Column */}
                          <td className="px-3 py-2.5">
                            <select
                              value={item.category}
                              onChange={(e) => handleUpdateItem(item.id, 'category', e.target.value as EstimateCategory)}
                              className="w-full bg-slate-50 border border-slate-200 hover:bg-slate-100/60 focus:bg-white focus:outline-none rounded-lg p-1.5 text-xs font-semibold text-slate-650 cursor-pointer"
                            >
                              <option value="material">📦 Материал</option>
                              <option value="labor">🛠️ Эмгек/Уста акы</option>
                              <option value="transport">🚚 Транспорт</option>
                              <option value="other">🪙 Башка чыгым</option>
                            </select>
                          </td>

                          {/* Quantity Column */}
                          <td className="px-3 py-2.5">
                            <input
                              type="number"
                              min="0"
                              step="any"
                              value={item.quantity === 0 ? '' : item.quantity}
                              onFocus={() => {
                                setLastFocusedField({ id: item.id, name: item.name, field: 'quantity' });
                              }}
                              onChange={(e) => handleUpdateItem(item.id, 'quantity', e.target.value)}
                              placeholder="0"
                              className="w-full text-center bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-sm font-bold text-slate-700 p-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                          </td>

                          {/* Unit Column */}
                          <td className="px-3 py-2.5">
                            <input
                              type="text"
                              value={item.unit}
                              onChange={(e) => handleUpdateItem(item.id, 'unit', e.target.value)}
                              placeholder="кв.м"
                              className="w-full text-center bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-xs font-medium text-slate-600 p-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              list="units-datalist"
                            />
                          </td>

                          {/* Unit Price Column */}
                          <td className="px-3 py-2.5">
                            <input
                              type="number"
                              min="0"
                              step="any"
                              value={item.price === 0 ? '' : item.price}
                              onFocus={() => {
                                setLastFocusedField({ id: item.id, name: item.name, field: 'price' });
                              }}
                              onChange={(e) => handleUpdateItem(item.id, 'price', e.target.value)}
                              placeholder="0"
                              className="w-full text-right bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-sm font-bold text-slate-700 p-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                          </td>

                          {/* Subtotal Calculated Column */}
                          <td className="px-4 py-2.5 text-right font-bold font-mono text-slate-800 text-sm">
                            {formatMoney(computedRowTotal, project.currency)}
                          </td>

                          {/* Line item delete button */}
                          <td className="px-3 py-2.5 text-center print:hidden">
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Өчүрүү"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Datalist for Unit Autocompletion */}
            <datalist id="units-datalist">
              <option value="даана" />
              <option value="кв.м" />
              <option value="куб.м" />
              <option value="кап" />
              <option value="кг" />
              <option value="тонна" />
              <option value="метр" />
              <option value="саат" />
              <option value="рейс" />
              <option value="комплект" />
            </datalist>

            {/* Bottom table helper workspace */}
            <div className="print:hidden border-t border-slate-100 p-4 bg-slate-50/20 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleAddItem(activeTab === 'all' ? 'material' : activeTab)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-md text-xs font-extrabold rounded-xl transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Жаңы чыгаша кошуу</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAddItem('labor')}
                  className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Уста акысын кошуу</span>
                </button>
              </div>

              {project.items.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllItems}
                  className="px-3 py-1.5 text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  Баарын тазалоо
                </button>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: Budget Adjusters & Bento-Grid Live Summary cards */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* ADJUSTERS GROUP - TAXES, CONTINGENCIES, DISCOUNT SLIDERS */}
            <div className="print:hidden bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Sliders className="w-5 h-5 text-emerald-600 animate-pulse" />
                <h3 className="font-bold text-slate-800 text-sm md:text-base">Резерв & Арзандатуу</h3>
              </div>

              <div className="space-y-4">
                {/* 1. Unexpected Expenses contingency slider */}
                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-600 mb-1">
                    <span>Күтүлбөгөн чыгым кошумчасы (Запас)</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono font-black">{project.contingencyPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    step="1"
                    value={project.contingencyPercent}
                    onChange={(e) => setProject({ ...project, contingencyPercent: parseInt(e.target.value) || 0 })}
                    className="w-full accent-emerald-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                  />
                  <span className="text-[9px] text-slate-400 mt-0.5 block italic">
                    * Оңдоо иштеринде 10% - 15% запас кармоо өтө маанилүү.
                  </span>
                </div>

                {/* 2. Custom Discount % slider */}
                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-600 mb-1">
                    <span>Кардарга берилүүчү арзандатуу (Скидка)</span>
                    <span className="text-orange-700 bg-orange-50 px-2 py-0.5 rounded font-mono font-black">{project.discountPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    step="1"
                    value={project.discountPercent}
                    onChange={(e) => setProject({ ...project, discountPercent: parseInt(e.target.value) || 0 })}
                    className="w-full accent-orange-500 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                  />
                </div>

                {/* 3. Custom Tax % input */}
                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-600 mb-1">
                    <span>Мамлекеттик НДС / Салыктар</span>
                    <span className="text-sky-700 bg-sky-50 px-2 py-0.5 rounded font-mono font-black">{project.taxPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="1"
                    value={project.taxPercent}
                    onChange={(e) => setProject({ ...project, taxPercent: parseInt(e.target.value) || 0 })}
                    className="w-full accent-sky-500 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* DYNAMIC CALCULATION BREAKDOWN PANEL */}
            <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-44 h-44 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-extrabold text-slate-200">Эсептөөлөрдүн Жыйынтыгы</h3>
                  </div>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2.5 py-1 rounded font-mono">
                    {project.items.length} сап чыгым
                  </span>
                </div>

                {/* Subtotals breakdown list */}
                <div className="py-5 space-y-3.5 border-b border-slate-800/80 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-sky-400" />
                      Материалдардын жалпы чыгымы:
                    </span>
                    <span className="font-bold font-mono">
                      {formatMoney(calculatedTotals.material, project.currency)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      Жумушчулар / устун кызматы:
                    </span>
                    <span className="font-bold font-mono">
                      {formatMoney(calculatedTotals.labor, project.currency)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-400" />
                      Жеткирүү акысы (Транспорт):
                    </span>
                    <span className="font-bold font-mono">
                      {formatMoney(calculatedTotals.transport, project.currency)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Кошумча зарыл чыгымдар:
                    </span>
                    <span className="font-bold font-mono">
                      {formatMoney(calculatedTotals.other, project.currency)}
                    </span>
                  </div>

                  {project.contingencyPercent > 0 && (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/40 text-slate-400">
                      <span>Күтүлбөгөн чыгым запасы (+{project.contingencyPercent}%):</span>
                      <span className="font-semibold font-mono text-amber-300">
                        +{formatMoney(calculatedTotals.contingencyAmount, project.currency)}
                      </span>
                    </div>
                  )}

                  {project.taxPercent > 0 && (
                    <div className="flex items-center justify-between text-slate-400">
                      <span>НДС / Салыктар (+{project.taxPercent}%):</span>
                      <span className="font-semibold font-mono text-sky-300">
                        +{formatMoney(calculatedTotals.taxAmount, project.currency)}
                      </span>
                    </div>
                  )}

                  {project.discountPercent > 0 && (
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-orange-400">🏷️ Кардар арзандатуусу (-{project.discountPercent}%):</span>
                      <span className="font-bold font-mono text-orange-400 bg-orange-950/40 px-1 py-0.5 rounded">
                        -{formatMoney(calculatedTotals.discountAmount, project.currency)}
                      </span>
                    </div>
                  )}
                </div>

                {/* PRESTIGE GRAND TOTAL */}
                <div className="pt-5 pb-2 text-center">
                  <span className="text-[11px] font-black tracking-widest text-slate-400 uppercase block mb-1">акыркы төлөнүүчү сумма:</span>
                  <div className="text-3xl md:text-4xl font-black text-emerald-400 tracking-tight font-mono">
                    {formatMoney(calculatedTotals.grandTotal, project.currency)}
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-2 italic font-light">
                    * Баардык салыктарды жана скидканы эске алуу менен.
                  </span>
                </div>

                <button
                  onClick={triggerPrint}
                  className="print:hidden w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs md:text-sm rounded-xl transition cursor-pointer shadow-lg shadow-emerald-500/10"
                >
                  <Printer className="w-4 h-4" />
                  <span>Басып чыгаруу / PDF сактоо</span>
                </button>
              </div>
            </div>

            {/* EXPENSES PERCENT BAR */}
            {project.items.length > 0 && (
              <div className="print:hidden bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">
                  Чыгымдардын бөлүнүшү:
                </h4>
                
                <div className="space-y-4 text-xs font-bold text-slate-650">
                  {Object.entries(categoryConfig).map(([key, cfg]) => {
                    const amt = calculatedTotals[key as keyof typeof calculatedTotals] || 0;
                    const pct = calculatedTotals.netSubtotal > 0 ? (amt / calculatedTotals.netSubtotal) * 100 : 0;
                    
                    return (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-600 font-bold">{cfg.label}</span>
                          <span className="text-slate-400 font-mono font-bold">
                            {formatMoney(amt, project.currency)} ({pct.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div 
                            style={{ width: `${pct}%` }}
                            className={`h-full rounded-full transition-all duration-500 ${
                              key === 'material' ? 'bg-sky-500' :
                              key === 'labor' ? 'bg-amber-500' :
                              key === 'transport' ? 'bg-indigo-500' : 'bg-emerald-500'
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ======================================================================= */}
        {/* NEW ADDITIONS: HIGH-UTILITY CONTEXT EXTENSIONS BENTO GRID               */}
        {/* ======================================================================= */}
        <div className="print:hidden mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Quick Item Presets Catalog Panel */}
          <div className="lg:col-span-1">
            <QuickCatalog onAddItem={handleAddItemWithValues} currency={project.currency} />
          </div>

          {/* Constructive Area & Volumes Calculator Widget Panel */}
          <div className="lg:col-span-1">
            <ConstructionCalculators onAddItem={handleAddItemWithValues} currency={project.currency} />
          </div>

          {/* Interactive Calculator Formula Injector Panel & Bulk Modifier */}
          <div className="lg:col-span-1 space-y-6">
            <FloatingCalculator 
              lastFocusedField={lastFocusedField} 
              onInjectValue={handleInjectValue} 
              currency={project.currency} 
            />

            <BulkModifier 
              items={project.items} 
              onUpdateAllItems={(updated) => setProject(prev => ({ ...prev, items: updated }))} 
              currency={project.currency} 
            />
          </div>
        </div>

        {/* BRIEF ADVICE CARD */}
        <div className="print:hidden mt-8 bg-slate-800 text-slate-300 rounded-2xl p-5 border border-slate-700">
          <h4 className="text-xs md:text-sm font-black text-slate-100 flex items-center gap-1.5 uppercase tracking-wide">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Смета Түзүүдө зарыл кеңештер (Кытай-Кыргыз кулак кагыш):
          </h4>
          <ul className="mt-3.5 space-y-2 text-xs md:text-sm list-disc pl-5 text-slate-300 font-light leading-relaxed">
            <li>
              <strong>Материалдардын запасы:</strong> Курулушта бышкан кыш тизүүдө, устундарды кесүүдө жана плитка чаптоодо орточо <span className="text-amber-400 font-bold">5% - 7% ашыкча</span> сатып алуу сунушталат.
            </li>
            <li>
              <strong>Уста акысынын бекемдиги:</strong> Жумушту баштаардан мурун усталар менен баа сунушун ушул калькулятор боюнча так сүйлөшүп, кагазга басып алып кол койдуруп алганыңыз эң коопсуз.
            </li>
            <li>
              <strong>Санри ташуу акысы (Транспорт):</strong> Жеткирүү унаалары (Портер, Камаз) башында кичине чыгымдай көрүнгөнү менен, жалпы чыгымдарды 10% чейин көбөйтүп жибериши толук мүмкүн.
            </li>
          </ul>
        </div>
      </main>

      {/* ======================================================================= */}
      {/* EXQUISITE PRINT-ONLY CONTAINER COMPLIANT WITH INVOICING/ESTIMATE STANDARDS */}
      {/* ======================================================================= */}
      <div className="hidden print:block bg-white text-black p-8 font-sans leading-relaxed text-xs">
        
        {/* PRINT HEADER */}
        <div className="border-b-2 border-slate-800 pb-5 mb-5 flex justify-between items-start">
          <div>
            <h1 className="text-xl font-black uppercase text-slate-900 tracking-tight">чыгымдар сметасы</h1>
            <p className="text-[10px] text-slate-500 italic mt-0.5">Документ Смета Эсептегичи системасында даярдалган</p>
          </div>
          <div className="text-right">
            <h2 className="text-xs font-bold text-slate-800">Смета # {project.id.replace('template_', '').toUpperCase().slice(0, 8)}</h2>
            <p className="text-[9px] text-slate-500 mt-1">Түзүлгөн күнү: {new Date(project.updatedAt).toLocaleDateString('ru-RU')}</p>
          </div>
        </div>

        {/* METADATA */}
        <div className="grid grid-cols-2 gap-4 mb-6 bg-slate-50 p-4 border border-slate-200">
          <div>
            <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold">кардар жөнүндө маалымат:</span>
            <p className="text-sm font-bold text-slate-900 mt-1">{project.clientName || 'Белгисиз орнотулган кардар'}</p>
            <p className="text-[9px] text-slate-500 mt-0.5">Бекитилген оңдоо/курулуш долбоордук сметасы.</p>
          </div>
          <div>
            <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold">долбоор / иш-чара темасы:</span>
            <p className="text-sm font-bold text-slate-900 mt-1">{project.title || 'Жаңы смета долбоору'}</p>
            <p className="text-[9px] text-slate-500 mt-0.5">Кардар валюта тиби: {project.currency}</p>
          </div>
        </div>

        {/* ITEMS PRINT TABLE */}
        <div className="mb-6">
          <table className="w-full text-left border-collapse border border-slate-350">
            <thead>
              <tr className="bg-slate-150 text-[10px] font-bold text-slate-700 uppercase border-b border-slate-350">
                <th className="px-3 py-2 border border-slate-300">Чыгым аталышы</th>
                <th className="px-3 py-2 border border-slate-300 w-[120px]">Категориясы</th>
                <th className="px-3 py-2 border border-slate-300 w-[70px] text-center">Саны</th>
                <th className="px-3 py-2 border border-slate-300 w-[70px] text-center">Бирдиги</th>
                <th className="px-3 py-2 border border-slate-300 w-[100px] text-right">Баасы</th>
                <th className="px-3 py-2 border border-slate-300 w-[120px] text-right">Жалпы акысы</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-[11px]">
              {project.items.map((item, index) => {
                const subTotal = item.quantity * item.price;
                return (
                  <tr key={item.id || index} className="align-middle">
                    <td className="px-3 py-2 border border-slate-300 font-semibold">{item.name || 'Аталышсыз чыгаша сабы'}</td>
                    <td className="px-3 py-2 border border-slate-300 text-[9px] uppercase text-slate-500">
                      {item.category === 'material' ? '📦 материал' :
                       item.category === 'labor' ? '🛠️ кызмат/эмгек' :
                       item.category === 'transport' ? '🚚 транспорт' : '🪙 кошумча чыгым'}
                    </td>
                    <td className="px-3 py-2 border border-slate-300 text-center font-mono">{item.quantity}</td>
                    <td className="px-3 py-2 border border-slate-300 text-center">{item.unit || 'даана'}</td>
                    <td className="px-3 py-2 border border-slate-300 text-right font-mono">{formatMoney(item.price, project.currency)}</td>
                    <td className="px-3 py-2 border border-slate-300 text-right font-bold font-mono">{formatMoney(subTotal, project.currency)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* PRINT BREAKDOWN TOTALS SHEET AT BOTTOM RIGHT */}
        <div className="flex justify-end mb-10">
          <div className="w-[300px] border border-slate-350 divide-y divide-slate-200 p-3 bg-slate-50">
            <div className="flex justify-between py-1 text-[10px]">
              <span className="text-slate-500">Материалдар суммасы:</span>
              <span className="font-bold">{formatMoney(calculatedTotals.material, project.currency)}</span>
            </div>
            <div className="flex justify-between py-1 text-[10px]">
              <span className="text-slate-500">Кызматтар акысы:</span>
              <span className="font-bold">{formatMoney(calculatedTotals.labor, project.currency)}</span>
            </div>
            <div className="flex justify-between py-1 text-[10px]">
              <span className="text-slate-500">Транспорт/Башкалар:</span>
              <span className="font-bold">{formatMoney(calculatedTotals.transport + calculatedTotals.other, project.currency)}</span>
            </div>
            
            {project.contingencyPercent > 0 && (
              <div className="flex justify-between py-1 text-[10px] text-amber-800">
                <span>Резервдик запас (+{project.contingencyPercent}%):</span>
                <span className="font-bold">+{formatMoney(calculatedTotals.contingencyAmount, project.currency)}</span>
              </div>
            )}

            {project.taxPercent > 0 && (
              <div className="flex justify-between py-1 text-[10px] text-sky-800">
                <span>НДС Салыгы (+{project.taxPercent}%):</span>
                <span className="font-bold">+{formatMoney(calculatedTotals.taxAmount, project.currency)}</span>
              </div>
            )}

            {project.discountPercent > 0 && (
              <div className="flex justify-between py-1 text-[10px] text-orange-700 font-bold">
                <span>Берилген скидка ({-project.discountPercent}%):</span>
                <span>-{formatMoney(calculatedTotals.discountAmount, project.currency)}</span>
              </div>
            )}

            <div className="flex justify-between py-2 text-xs font-black text-slate-950 border-t border-slate-900">
              <span>АКЫРКЫ СУММАСЫ:</span>
              <span className="font-mono">{formatMoney(calculatedTotals.grandTotal, project.currency)}</span>
            </div>
          </div>
        </div>

        {/* PRINT SIGNATURE FOOTER */}
        <div className="mt-16 pt-10 border-t border-dashed border-slate-300 grid grid-cols-2 gap-8 text-center text-[10px] text-slate-500">
          <div>
            <p className="border-b border-slate-400 w-44 mx-auto mb-1 h-6"></p>
            <p className="font-bold text-slate-800">Смета Түзүүчү / Жооптуу Уста</p>
            <p className="text-[9px] text-slate-400">(Колу, күнү жана аты-жөнү)</p>
          </div>
          <div>
            <p className="border-b border-slate-400 w-44 mx-auto mb-1 h-6"></p>
            <p className="font-bold text-slate-800">Буйрутма берүүчү / Кардар</p>
            <p className="text-[9px] text-slate-400">(Колу, күнү жана макулдугу)</p>
          </div>
        </div>

      </div>

    </div>
  );
}
