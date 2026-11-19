import { Injectable } from '@nestjs/common';

export interface NormalizedPriceInput {
  price: number;
  quantity?: number;
  unit?: string;
  vat?: boolean;
  deliveryFee?: number;
  targetUnit?: string;
}

@Injectable()
export class PriceNormalizationService {
  normalizePrice(input: NormalizedPriceInput): {
    total: number;
    perUnit: number;
    unit: string;
    valid: boolean;
    message?: string;
  } {
    const quantity = Number(input.quantity ?? 1);
    const unit = input.unit ?? 'piece';
    const targetUnit = input.targetUnit ?? unit;
    const total = Number((input.price + (input.vat ? input.price * 0.05 : 0) + (input.deliveryFee ?? 0)).toFixed(2));
    const baseUnits = this.parseUnitToBase(unit);
    const targetBaseUnits = this.parseUnitToBase(targetUnit);

    if (baseUnits <= 0 || targetBaseUnits <= 0) {
      return { total, perUnit: total, unit: targetUnit, valid: false, message: 'Unsupported unit. Use a standard unit such as piece, g, kg, ml or l.' };
    }

    if (unit !== targetUnit && this.isMismatchedUnit(unit, targetUnit)) {
      return {
        total,
        perUnit: total,
        unit: targetUnit,
        valid: false,
        message: `Mismatched units: ${unit} cannot be converted to ${targetUnit} without a clear quantity conversion.`,
      };
    }

    const perUnit = total / (quantity * (baseUnits / targetBaseUnits));

    return {
      total: Number(total.toFixed(2)),
      perUnit: Number(perUnit.toFixed(2)),
      unit: targetUnit,
      valid: true,
    };
  }

  private parseUnitToBase(unit: string): number {
    const normalized = unit.toLowerCase().trim();
    if (normalized.includes('kg')) return 1000;
    if (normalized.includes('g')) return 1;
    if (normalized.includes('l')) return 1000;
    if (normalized.includes('ml')) return 1;
    if (normalized.includes('pack') || normalized.includes('box') || normalized.includes('piece') || normalized.includes('pcs')) return 1;
    return 1;
  }

  private isMismatchedUnit(currentUnit: string, targetUnit: string): boolean {
    const current = currentUnit.toLowerCase();
    const target = targetUnit.toLowerCase();
    const sameGroup = (current.includes('g') && target.includes('g')) || (current.includes('kg') && target.includes('kg')) || (current.includes('ml') && target.includes('ml')) || (current.includes('l') && target.includes('l')) || (current.includes('piece') && target.includes('piece'));
    return !sameGroup && current !== target;
  }
}
