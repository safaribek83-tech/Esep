/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EstimateProject } from '../types';

export const TEMPLATES: { [key: string]: EstimateProject } = {
  renovation: {
    id: 'template_renovation',
    title: '1 бөлмөлүү батирди оңдоп-түзөө (Ремонт)',
    clientName: 'Асан Усупов',
    currency: 'KGS',
    discountPercent: 5,
    taxPercent: 0,
    contingencyPercent: 10,
    updatedAt: new Date().toISOString(),
    items: [
      { id: 'ren_1', name: 'Ротбанд штукатурка (30кг)', category: 'material', quantity: 15, unit: 'кап', price: 460 },
      { id: 'ren_2', name: 'Алинекс шпаклевка Glatt (25кг)', category: 'material', quantity: 12, unit: 'кап', price: 520 },
      { id: 'ren_3', name: 'Кнауф гипсокартон (9.5мм)', category: 'material', quantity: 20, unit: 'даана', price: 410 },
      { id: 'ren_4', name: 'Кафель клейи (Керамогранит үчүн)', category: 'material', quantity: 8, unit: 'кап', price: 450 },
      { id: 'ren_5', name: 'Дубал обоилору (винил)', category: 'material', quantity: 6, unit: 'рулон', price: 1800 },
      { id: 'ren_6', name: 'Ламинат (33-класс, 8мм)', category: 'material', quantity: 45, unit: 'кв.м', price: 750 },
      { id: 'ren_7', name: 'Плинтус жана аксессуарлар', category: 'material', quantity: 18, unit: 'коробка', price: 220 },
      { id: 'ren_8', name: 'Электр зымдары (ВВГнг 3х2.5)', category: 'material', quantity: 100, unit: 'метр', price: 85 },
      { id: 'ren_9', name: 'Дубалдарды шыбап тегиздөө (Жумуш)', category: 'labor', quantity: 45, unit: 'кв.м', price: 350 },
      { id: 'ren_10', name: 'Кафель чаптоо жумуштары', category: 'labor', quantity: 15, unit: 'кв.м', price: 800 },
      { id: 'ren_11', name: 'Ламинат төшөө кызматы', category: 'labor', quantity: 45, unit: 'кв.м', price: 180 },
      { id: 'ren_12', name: 'Электрика куруу жумушу', category: 'labor', quantity: 1, unit: 'комплект', price: 12000 },
      { id: 'ren_13', name: 'Материалдарды жеткирүү (Портер)', category: 'transport', quantity: 3, unit: 'рейс', price: 1200 },
      { id: 'ren_14', name: 'Курулуш таштандыларын чыгаруу', category: 'transport', quantity: 2, unit: 'рейс', price: 1500 }
    ]
  },
  houseBuild: {
    id: 'template_house',
    title: 'Кыштан 1 кабаттуу үй куруу (100 кв.м)',
    clientName: 'Бакыт Мамытов',
    currency: 'KGS',
    discountPercent: 3,
    taxPercent: 0,
    contingencyPercent: 12,
    updatedAt: new Date().toISOString(),
    items: [
      { id: 'hs_1', name: 'Бышкан кыш (Чүй же Куршаб)', category: 'material', quantity: 24000, unit: 'даана', price: 9.5 },
      { id: 'hs_2', name: 'Цемент М400 (Кант цемент)', category: 'material', quantity: 250, unit: 'кап', price: 440 },
      { id: 'hs_3', name: 'Арматура 16мм (Фундамент үчүн)', category: 'material', quantity: 1.5, unit: 'тонна', price: 72000 },
      { id: 'hs_4', name: 'Карьер куму', category: 'material', quantity: 4, unit: 'Камаз', price: 6500 },
      { id: 'hs_5', name: 'Щебень (орто өлчөмдөгү)', category: 'material', quantity: 2, unit: 'Камаз', price: 7000 },
      { id: 'hs_6', name: 'Жыгач устундар (Брус 10х15)', category: 'material', quantity: 60, unit: 'даана', price: 850 },
      { id: 'hs_7', name: 'Чатыр жапкыч (Металлочерепица)', category: 'material', quantity: 140, unit: 'кв.м', price: 480 },
      { id: 'hs_8', name: 'Фундамент куюу жумуштары', category: 'labor', quantity: 28, unit: 'куб.м', price: 3200 },
      { id: 'hs_9', name: 'Бышкан кыш тизүү (Дубал өрүү)', category: 'labor', quantity: 24000, unit: 'даана', price: 6 },
      { id: 'hs_10', name: 'Чатыр орнотуу жана жыгач жумуштары', category: 'labor', quantity: 130, unit: 'кв.m', price: 450 },
      { id: 'hs_11', name: 'Камаз менен материалдарды ташуу', category: 'transport', quantity: 6, unit: 'рейс', price: 4500 },
      { id: 'hs_12', name: 'Экскаватор жалдап топурак казуу', category: 'transport', quantity: 8, unit: 'саат', price: 1800 }
    ]
  },
  toiWedding: {
    id: 'template_toi',
    title: 'Шайыр-Той мааракеси (200 кишиге)',
    clientName: 'Айзада Токтогулова',
    currency: 'KGS',
    discountPercent: 0,
    taxPercent: 0,
    contingencyPercent: 8,
    updatedAt: new Date().toISOString(),
    items: [
      { id: 'toi_1', name: 'Кафе арендасы (Тамактар, устукан, чай)', category: 'labor', quantity: 200, unit: 'киши', price: 1800 },
      { id: 'toi_2', name: 'Ири мүйүздүү мал (Тай же Уй)', category: 'material', quantity: 1, unit: 'баш', price: 85000 },
      { id: 'toi_3', name: 'Кой (Устуканга кошумча)', category: 'material', quantity: 2, unit: 'баш', price: 16000 },
      { id: 'toi_4', name: 'Суусундуктар (ширелер, кола, минерал суу)', category: 'material', quantity: 300, unit: 'бөтөлкө', price: 65 },
      { id: 'toi_5', name: 'Той коногу үчүн момпосуй жана жер-жемиштер', category: 'material', quantity: 1, unit: 'комплект', price: 25000 },
      { id: 'toi_6', name: 'Боорсок бышыруу үчүн ун жана май', category: 'material', quantity: 2, unit: 'кап', price: 1800 },
      { id: 'toi_7', name: 'Тойдун башкы тамадасы (Алып баруучу)', category: 'labor', quantity: 1, unit: 'киши', price: 30000 },
      { id: 'toi_8', name: 'Музыканттар жана Ырчылар тобу', category: 'labor', quantity: 1, unit: 'комплект', price: 25000 },
      { id: 'toi_9', name: 'Фото жана видео тартуу (Дрон менен)', category: 'labor', quantity: 1, unit: 'комплект', price: 20000 },
      { id: 'toi_10', name: 'Бийчилер тобу же Каскадерлор шоусу', category: 'labor', quantity: 1, unit: 'топ', price: 12000 },
      { id: 'toi_11', name: 'Той кортежи үчүн унаа тизмеси', category: 'transport', quantity: 4, unit: 'унаа', price: 3500 },
      { id: 'toi_12', name: 'Малды жеткирүү жана башка ташуулар', category: 'transport', quantity: 1, unit: 'рейс', price: 2500 }
    ]
  },
  empty: {
    id: 'empty_project',
    title: 'Жаңы таза долбоор',
    clientName: '',
    currency: 'KGS',
    discountPercent: 0,
    taxPercent: 0,
    contingencyPercent: 5,
    updatedAt: new Date().toISOString(),
    items: [
      { id: 'empty_1', name: 'Өзүңүздүн биринчи чыгымыңызды жазыңыз', category: 'material', quantity: 1, unit: 'даана', price: 0 }
    ]
  }
};

export const COMMON_ITEMS_SUGGESTIONS = [
  // Курулуш материалдары
  'Бышкан кыш (даана)',
  'Цемент М400 (кап)',
  'Арматура 12мм (тонна)',
  'Кам кум (Камаз)',
  'Щебень (Камаз)',
  'Жыгач устун (брус)',
  'Штукатурка (кап)',
  'Шпаклевка (кап)',
  'Гипсокартон Кнауф (барак)',
  'Кафель клейи (кап)',
  'Дубал обои (рулон)',
  'Ламинат төшөмү (кв.м)',
  'Керамогранит кафели (кв.м)',
  'Профнастил чатыр (кв.м)',
  'Металлочерепица (кв.м)',
  'Плинтус дубал үчүн (кол)',
  'Электр кабели МГ (метр)',
  'Розетка жана өчүргүч (даана)',
  'Жылуулоочу пенопласт (куб.м)',
  'Минералдык кебез (рулон)',
  
  // Жумушчу күчү
  'Фундамент куюу (жумуш)',
  'Кыш тизүү усталарга (даана)',
  'Дубал шыбап тегиздөө (кв.м)',
  'Кафель чаптоо кызматы (кв.м)',
  'Ламинат төшөө жумушу (кв.м)',
  'Сантехника тартуу (толук)',
  'Электр зымдарын түзөө (толук)',
  'Чатырын куруу жумушу (кв.м)',
  'Дубалды обойлоо жумуштары (кв.м)',
  'Шыпты сырдоо/Тартуу (кв.м)',
  'Демонтаж эски дубал (саат)',
  
  // Транспорт
  'Портер жеткирүү кызматы (рейс)',
  'Камаз жүк ташуу кызматы',
  'Кран унаасын ижарага алуу (саат)',
  'Курулуш таштандыларын чыгаруу',
  'Жумушчуларды ташуу акысы(унаа)',
  
  // Той маараке
  'Кафе акысы (киши башына)',
  'Тойго мал (Кой/Уй/Тай)',
  'Тамада Алып баруучу акысы',
  'Музыкалык топ кызматы',
  'Видео/Фото студия (комплект)',
  'Суусундук тизмеси (бөтөлкө)',
  'Конокторго таркатуучу таттуулар',
  'Боорсок бышыруу үчүн ун/май'
];
