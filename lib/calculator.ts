import { Currency, CurrencyInfo, CalculationResult } from '@/types';

// 통화 정보 상수
export const CURRENCIES: Record<Currency, CurrencyInfo> = {
  KRW: { code: 'KRW', name: '한화', symbol: '₩', decimals: 0 },
  USD: { code: 'USD', name: '달러', symbol: '$', decimals: 2 },
  EUR: { code: 'EUR', name: '유로', symbol: '€', decimals: 2 },
  JPY: { code: 'JPY', name: '엔화', symbol: '¥', decimals: 0 },
  TWD: { code: 'TWD', name: '대만달러', symbol: 'NT$', decimals: 0 },
  THB: { code: 'THB', name: '태국바트', symbol: '฿', decimals: 2 },
  PHP: { code: 'PHP', name: '필리핀페소', symbol: '₱', decimals: 2 },
};

/**
 * 소수점 n번째 자리에서 버림
 */
function floorToDecimal(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.floor(value * factor) / factor;
}

/**
 * 게임포인트 계산
 */
export function calculateGamePoint(
  currency: Currency,
  minProductPrice: number,
  earnRate: number,
  minUsageUnit: number
): CalculationResult {
  // 1. 계산값 (그대로)
  const rawValue = minProductPrice * (earnRate / 100);

  // 2. 시스템 적립값 (소수점 넷째자리 버림 → 셋째자리까지)
  const systemValue = floorToDecimal(rawValue, 3);

  // 3. 유저 출력값 (소수점 셋째자리 버림 → 둘째자리까지)
  const userDisplayValue = floorToDecimal(systemValue, 2);

  // 4. 손해율 계산
  const lossRate = systemValue > 0
    ? ((systemValue - userDisplayValue) / systemValue) * 100
    : 0;

  // 5. 사용 가능성 분석
  const isUsable = userDisplayValue >= minUsageUnit;
  const requiredPurchases = userDisplayValue > 0
    ? Math.ceil(minUsageUnit / userDisplayValue)
    : 0;
  const requiredAmount = minProductPrice * requiredPurchases;

  // 6. 전액 포인트 구매 분석
  const fullPointPurchaseAmount = userDisplayValue > 0
    ? minProductPrice * Math.ceil(minProductPrice / userDisplayValue)
    : 0;

  return {
    currency,
    minProductPrice,
    earnRate,
    minUsageUnit,
    rawValue,
    systemValue,
    userDisplayValue,
    lossRate,
    isUsable,
    requiredPurchases,
    requiredAmount,
    fullPointPurchaseAmount,
  };
}

/**
 * 숫자를 통화 형식으로 포맷
 */
export function formatCurrency(value: number, currency: Currency): string {
  const info = CURRENCIES[currency];
  return `${info.symbol}${value.toFixed(info.decimals)}`;
}

/**
 * 게임포인트를 포맷 (trailing zeros 제거)
 */
export function formatGamePoint(value: number, decimals: number = 2): string {
  const fixed = value.toFixed(decimals);
  const num = parseFloat(fixed);
  return num.toString(); // trailing zeros 자동 제거
}
