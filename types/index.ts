// 지원 통화 타입
export type Currency = 'KRW' | 'USD' | 'EUR' | 'JPY' | 'TWD' | 'THB' | 'PHP';

// 통화 정보
export interface CurrencyInfo {
  code: Currency;
  name: string;
  symbol: string;
  decimals: number; // 통화가 지원하는 소수점 자리수
}

// 통화별 입력값
export interface CurrencyInput {
  minProductPrice: number; // 최소 상품 금액
  minUsageUnit: number; // 최소 사용 가능한 포인트 단위
}

// 계산 결과
export interface CalculationResult {
  currency: Currency;
  minProductPrice: number;
  earnRate: number;
  
  // 계산 결과들
  rawValue: number; // 적립률 적용한 그대로의 값
  systemValue: number; // 시스템 상 적립되는 값 (소수점 셋째자리까지)
  userDisplayValue: number; // 유저에게 출력되는 값 (소수점 둘째자리까지)
  lossRate: number; // 유저 체감 손해율 (%)
}
