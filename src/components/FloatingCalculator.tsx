/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Calculator, Check, ArrowDownToLine, Copy } from 'lucide-react';

interface FloatingCalculatorProps {
  lastFocusedField: { id: string; name: string; field: 'quantity' | 'price' } | null;
  onInjectValue: (id: string, field: 'quantity' | 'price', value: number) => void;
  currency: string;
}

export default function FloatingCalculator({ lastFocusedField, onInjectValue, currency }: FloatingCalculatorProps) {
  const [formula, setFormula] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [errorState, setErrorState] = useState(false);
  const [copied, setCopied] = useState(false);

  // Evaluate formula in real-time securely
  useEffect(() => {
    if (!formula.trim()) {
      setResult(null);
      setErrorState(false);
      return;
    }

    try {
      // Keep only math friendly characters to prevent safety risks
      const sanitized = formula.replace(/[^0-9+\-*/().\s]/g, '');
      if (sanitized.trim() === '') {
        setResult(null);
        setErrorState(false);
        return;
      }

      // Safe evaluation using Function
      const evaluated = new Function(`return (${sanitized})`)();
      if (typeof evaluated === 'number' && !isNaN(evaluated) && isFinite(evaluated)) {
        // Round to 3 decimals max
        setResult(parseFloat(evaluated.toFixed(3)));
        setErrorState(false);
      } else {
        setResult(null);
        setErrorState(true);
      }
    } catch (e) {
      setResult(null);
      setErrorState(true);
    }
  }, [formula]);

  const handleCopy = () => {
    if (result !== null) {
      navigator.clipboard.writeText(result.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleInject = () => {
    if (result !== null && lastFocusedField) {
      onInjectValue(lastFocusedField.id, lastFocusedField.field, result);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-purple-50 mb-3">
        <div className="flex items-center gap-1.5">
          <Calculator className="w-5 h-5 text-purple-600" />
          <h3 className="font-extrabold text-slate-800 text-sm md:text-base">Формулалык Эсептегич</h3>
        </div>
        <span className="text-[9px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-bold">
          Мат-Ноутбук
        </span>
      </div>

      <p className="text-[11px] text-slate-500 mb-2">
        Аянттарды же чыгымдарды кылдат эсептөө үчүн математикалык формула жазыңыз (мисалы: <code className="bg-slate-100 text-slate-700 font-bold px-1 rounded">5.4 * 3.2 * 2</code>).
      </p>

      {/* Input Field */}
      <div className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
            placeholder="Формуланы бул жерге жазып баштаңыз..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition text-purple-950 placeholder-slate-400"
          />
          {formula && (
            <button
              onClick={() => setFormula('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-black cursor-pointer"
            >
              ✖
            </button>
          )}
        </div>

        {/* Live Result Field */}
        <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200">
          <div className="text-[10px] text-slate-500 font-semibold uppercase">Чыккан жыйынтык:</div>
          <div className="text-right">
            {result !== null ? (
              <span className="text-sm font-black font-mono text-purple-700 select-all">{result}</span>
            ) : errorState ? (
              <span className="text-[10px] text-red-500 font-bold italic">Формулада ката бар...</span>
            ) : (
              <span className="text-[10px] text-slate-400 italic">Сандарды гана күтүүдө</span>
            )}
          </div>
        </div>

        {/* Selected row target details info */}
        {lastFocusedField ? (
          <div className="text-[10px] bg-emerald-50 text-emerald-800 p-2 rounded border border-emerald-100 flex items-start gap-1">
            <span className="text-base leading-none">🎯</span>
            <div>
              Тандалган сап: <strong className="text-emerald-950">{lastFocusedField.name || 'Аталышсыз чыгым'}</strong> 
              <br />
              Секция: <span className="bg-emerald-100 font-black px-1 rounded capitalize">{lastFocusedField.field === 'quantity' ? 'Саны талаасы' : 'Баасы талаасы'}</span>
            </div>
          </div>
        ) : (
          <div className="text-[10px] bg-amber-50 text-amber-700 p-2 rounded border border-amber-100">
            ℹ️ Смета таблицасындагы каалаган саптын <strong>Саны</strong> же <strong>Баасы</strong> ячейкасын бассаңыз, ушул жерден чыккан санды ошол ячейкага дароо киргизе аласыз!
          </div>
        )}

        {/* Active Buttons Panel */}
        <div className="flex gap-2">
          <button
            type="button"
            disabled={result === null}
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 border border-slate-300 hover:bg-slate-50 disabled:opacity-50 text-slate-700 rounded-lg text-[11px] font-bold cursor-pointer transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Көчүрүлдү!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Жыйынтыкты Көчүрүү</span>
              </>
            )}
          </button>

          <button
            type="button"
            disabled={result === null || !lastFocusedField}
            onClick={handleInject}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 text-[11px] font-extrabold rounded-lg cursor-pointer transition shadow-sm"
            title="Таблицадагы тандалган сапка бул сандык жыйынтыкты жазуу"
          >
            <ArrowDownToLine className="w-3.5 h-3.5" />
            <span>Санды Орнотуу ✍️</span>
          </button>
        </div>
      </div>
    </div>
  );
}
