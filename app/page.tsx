'use client';

import { useState } from 'react';
import { Currency, CurrencyInput, CalculationResult } from '@/types';
import { CURRENCIES, calculateGamePoint, formatCurrency, formatGamePoint } from '@/lib/calculator';

export default function Home() {
  const [earnRate, setEarnRate] = useState<number>(5);
  const [currencyInputs, setCurrencyInputs] = useState<Record<Currency, CurrencyInput>>({
    KRW: { minProductPrice: 1000, minUsageUnit: 10 },
    USD: { minProductPrice: 0.99, minUsageUnit: 1.0 },
    EUR: { minProductPrice: 0.99, minUsageUnit: 1.0 },
    JPY: { minProductPrice: 100, minUsageUnit: 10 },
    TWD: { minProductPrice: 30, minUsageUnit: 10 },
    THB: { minProductPrice: 30, minUsageUnit: 1.0 },
    PHP: { minProductPrice: 50, minUsageUnit: 1.0 },
  });

  const [results, setResults] = useState<CalculationResult[]>([]);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const handleCalculate = () => {
    const calculatedResults = Object.keys(CURRENCIES).map((curr) => {
      const currency = curr as Currency;
      const input = currencyInputs[currency];
      return calculateGamePoint(
        currency,
        input.minProductPrice,
        earnRate,
        input.minUsageUnit
      );
    });
    setResults(calculatedResults);
    setCopySuccess(false); // 새로 계산하면 복사 상태 초기화
  };

  const handleCopyResults = async () => {
    if (results.length === 0) return;

    // TSV 형식으로 변환 (엑셀 붙여넣기용)
    const header = '통화\t최소 상품 금액\t계산값\t시스템 적립\t유저 출력\t손해율';
    const rows = results.map((result) => {
      const curr = CURRENCIES[result.currency];
      return [
        curr.name,
        formatCurrency(result.minProductPrice, result.currency),
        `${formatGamePoint(result.rawValue)} GP`,
        `${formatGamePoint(result.systemValue, 3)} GP`,
        `${formatGamePoint(result.userDisplayValue)} GP`,
        `${result.lossRate.toFixed(2)}%`,
      ].join('\t');
    });

    const tsvData = [header, ...rows].join('\n');

    try {
      await navigator.clipboard.writeText(tsvData);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // 2초 후 메시지 사라짐
    } catch (err) {
      alert('복사에 실패했습니다. 브라우저 권한을 확인해주세요.');
    }
  };

  const updateCurrencyInput = (
    currency: Currency,
    field: keyof CurrencyInput,
    value: number
  ) => {
    setCurrencyInputs((prev) => ({
      ...prev,
      [currency]: {
        ...prev[currency],
        [field]: value,
      },
    }));
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          게임포인트 시뮬레이터
        </h1>
        <p className="text-gray-600 mb-8">
          통화별 최저가 상품 결제 시 적립되는 게임포인트를 미리 계산해보세요
        </p>

        {/* 적립률 입력 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            적립률 (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={earnRate}
            onChange={(e) => setEarnRate(parseFloat(e.target.value) || 0)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="5"
          />
        </div>

        {/* 통화별 입력 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            통화별 설정
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    통화
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    최소 상품 금액
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    최소 사용 단위 (GP)
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.values(CURRENCIES).map((curr) => (
                  <tr key={curr.code} className="border-b border-gray-100">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {curr.name} ({curr.code})
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        step={curr.decimals > 0 ? '0.01' : '1'}
                        value={currencyInputs[curr.code].minProductPrice}
                        onChange={(e) =>
                          updateCurrencyInput(
                            curr.code,
                            'minProductPrice',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        step="0.01"
                        value={currencyInputs[curr.code].minUsageUnit}
                        onChange={(e) =>
                          updateCurrencyInput(
                            curr.code,
                            'minUsageUnit',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 계산 버튼 */}
        <div className="mb-6">
          <button
            onClick={handleCalculate}
            className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors"
          >
            계산하기
          </button>
        </div>

        {/* 결과 테이블 */}
        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                계산 결과
              </h2>
              <button
                onClick={handleCopyResults}
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-colors flex items-center gap-2"
              >
                {copySuccess ? (
                  <>
                    <span>✓</span>
                    <span>복사 완료!</span>
                  </>
                ) : (
                  <>
                    <span>📋</span>
                    <span>엑셀 복사</span>
                  </>
                )}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="px-4 py-3 text-left font-medium text-gray-700">
                      통화
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700">
                      최소 상품 금액
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700">
                      계산값
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700">
                      시스템 적립
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700">
                      유저 출력
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700">
                      손해율
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => {
                    const curr = CURRENCIES[result.currency];
                    return (
                      <tr key={result.currency} className="border-b border-gray-100">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {curr.name}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-700">
                          {formatCurrency(result.minProductPrice, result.currency)}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-700">
                          {formatGamePoint(result.rawValue)} GP
                        </td>
                        <td className="px-4 py-3 text-right text-blue-600 font-medium">
                          {formatGamePoint(result.systemValue, 3)} GP
                        </td>
                        <td className="px-4 py-3 text-right text-green-600 font-medium">
                          {formatGamePoint(result.userDisplayValue)} GP
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span
                            className={
                              result.lossRate > 0
                                ? 'text-red-600 font-medium'
                                : 'text-gray-500'
                            }
                          >
                            {result.lossRate.toFixed(2)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* 설명 */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
              <p className="mb-2">
                <strong>계산값:</strong> 적립률 적용한 원본 값
              </p>
              <p className="mb-2">
                <strong>시스템 적립:</strong> 소수점 셋째자리까지 저장되는 값
              </p>
              <p className="mb-2">
                <strong>유저 출력:</strong> 유저에게 표시되는 값 (소수점 둘째자리)
              </p>
              <p>
                <strong>손해율:</strong> 시스템 적립 대비 유저 출력의 손실 비율
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
