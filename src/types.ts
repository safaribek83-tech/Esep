/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type EstimateCategory = 'material' | 'labor' | 'transport' | 'other';

export interface EstimateItem {
  id: string;
  name: string;
  category: EstimateCategory;
  quantity: number;
  unit: string;
  price: number;
}

export type Currency = 'KGS' | 'USD' | 'RUB';

export interface EstimateProject {
  id: string;
  title: string;
  clientName: string;
  currency: Currency;
  discountPercent: number;
  taxPercent: number;
  contingencyPercent: number; // For unexpected expenses
  items: EstimateItem[];
  updatedAt: string;
}
