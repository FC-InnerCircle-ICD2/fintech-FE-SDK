# Pay200 SDK

Pay200 SDK는 웹 애플리케이션에서 결제 기능을 쉽게 통합할 수 있는 JavaScript/TypeScript 라이브러리입니다.

## 설치 방법

### CloudFront CDN을 통한 설치

Pay200 SDK는 AWS S3에 업로드되고 CloudFront를 통해 배포되어 있어 전 세계 어디서나 빠르게 접근할 수 있습니다.

```html
<!-- UMD 형식 (브라우저에서 바로 사용 가능) -->
<!-- 최신 버전 사용 -->
<script src="https://cdn.pay200.com/sdk/latest/index.umd.js"></script>

<!-- 특정 버전 사용 (권장) -->
<script src="https://cdn.pay200.com/sdk/v1.0.0/index.umd.js"></script>
```

### ES 모듈 형식 (ESM)

```html
<!-- ES 모듈 형식 (import 구문 사용) -->
<script type="module">
  import { Pay200 } from 'https://cdn.pay200.com/sdk/latest/index.es.js';

  // SDK 사용
  const pay200 = new Pay200();
</script>
```

### NPM을 통한 설치

```bash
npm install @pay200/sdk
```

### Yarn을 통한 설치

```bash
yarn add @pay200/sdk
```

## TypeScript 지원

Pay200 SDK는 TypeScript 정의 파일을 제공합니다. CDN을 통해 TypeScript 정의 파일을 사용하려면:

```typescript
// TypeScript 정의 파일 참조
/// <reference path="https://cdn.pay200.com/sdk/latest/index.d.ts" />

// 또는 직접 import
import type { Pay200Options } from 'https://cdn.pay200.com/sdk/latest/index.d.ts';
```

## 기본 사용법

### CDN 방식 사용 예시

```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pay200 SDK 예제</title>
    <!-- Pay200 SDK 스크립트 추가 -->
    <script src="https://cdn.pay200.com/sdk/v1.0.0/pay200-sdk.js"></script>
  </head>
  <body>
    <button id="pay-button">결제하기</button>

    <script>
      document
        .getElementById('pay-button')
        .addEventListener('click', async () => {
          // SDK 초기화
          const requestPayment = pay200SDK({
            apiKey: 'YOUR_API_KEY',
          });

          try {
            // 결제 요청
            await requestPayment({
              orderId: 'order_12345',
              amount: 15000,
              orderName: '프리미엄 구독',
              successUrl: 'https://your-website.com/success',
            });

            // 결제 창이 닫히고 성공 URL로 리다이렉트되면
            // successUrl 페이지에서 결제 결과를 처리해야 합니다.
          } catch (error) {
            console.error('결제 중 오류가 발생했습니다:', error);
          }
        });
    </script>
  </body>
</html>
```

### NPM/Yarn 방식 사용 예시 (TypeScript)

```typescript
import { pay200SDK } from '@pay200/sdk';

const handlePayment = async () => {
  // SDK 초기화
  const requestPayment = pay200SDK({
    apiKey: 'YOUR_API_KEY',
  });

  try {
    // 결제 요청
    await requestPayment({
      orderId: 'order_12345',
      amount: 15000,
      orderName: '프리미엄 구독',
      successUrl: 'https://your-website.com/success',
    });

    // 결제가 성공적으로 완료되면 successUrl로 리다이렉트됩니다.
    // 이후 처리는 successUrl 페이지에서 진행해야 합니다.
  } catch (error) {
    console.error('결제 중 오류가 발생했습니다:', error);
  }
};

// 결제 버튼에 이벤트 리스너 추가
document.getElementById('pay-button')?.addEventListener('click', handlePayment);
```

### 실제 구현 예시 (React)

```tsx
import React from 'react';
import { pay200SDK } from '@pay200/sdk';

interface PaymentButtonProps {
  productName: string;
  amount: number;
  orderId: string;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  productName,
  amount,
  orderId,
}) => {
  const handlePayment = async () => {
    // SDK 초기화
    const requestPayment = pay200SDK({
      apiKey: process.env.REACT_APP_PAY200_API_KEY || 'YOUR_API_KEY',
    });

    try {
      // 결제 요청
      await requestPayment({
        orderId,
        amount,
        orderName: productName,
        successUrl: `${window.location.origin}/payment/success`,
      });
    } catch (error: any) {
      // 에러 처리
      if (error.name === 'INVALID_PARAMS') {
        alert('결제 정보가 올바르지 않습니다.');
      } else if (error.name === 'INVALID_AMOUNT') {
        alert('결제 금액이 올바르지 않습니다.');
      } else {
        alert('결제 중 오류가 발생했습니다.');
        console.error('결제 에러:', error);
      }
    }
  };

  return (
    <button onClick={handlePayment} className='payment-button'>
      {productName} 결제하기 ({amount.toLocaleString()}원)
    </button>
  );
};

export default PaymentButton;
```

### 성공 페이지 구현 예시 (React)

```tsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentSuccessPage: React.FC = () => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // URL에서 결제 토큰 추출
    const params = new URLSearchParams(location.search);
    const paymentToken = params.get('token');

    if (!paymentToken) {
      alert('유효하지 않은 접근입니다.');
      navigate('/');
      return;
    }

    // 서버에 결제 검증 요청
    const verifyPayment = async () => {
      try {
        const response = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ paymentToken }),
        });

        const result = await response.json();

        if (result.success) {
          setPaymentResult(result.data);
        } else {
          alert('결제 검증에 실패했습니다.');
          navigate('/');
        }
      } catch (error) {
        console.error('결제 검증 에러:', error);
        alert('결제 검증 중 오류가 발생했습니다.');
        navigate('/');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [location.search, navigate]);

  if (isVerifying) {
    return <div>결제 확인 중...</div>;
  }

  return (
    <div className='payment-success-container'>
      <h1>결제가 완료되었습니다!</h1>
      {paymentResult && (
        <div className='payment-details'>
          <p>주문명: {paymentResult.orderName}</p>
          <p>결제 금액: {paymentResult.amount.toLocaleString()}원</p>
          <p>주문 번호: {paymentResult.orderId}</p>
          <p>결제 시간: {new Date(paymentResult.paidAt).toLocaleString()}</p>
        </div>
      )}
      <button onClick={() => navigate('/')}>홈으로 돌아가기</button>
    </div>
  );
};

export default PaymentSuccessPage;
```

## API 레퍼런스

### pay200SDK

SDK 초기화 함수입니다.

#### 매개변수

| 이름   | 타입   | 필수 | 설명                              |
| ------ | ------ | ---- | --------------------------------- |
| apiKey | string | 예   | Pay200 서비스에서 발급받은 API 키 |

#### 반환값

`requestPayment` 함수를 반환합니다.

### requestPayment(paymentOptions)

결제 요청을 처리하는 함수입니다.

#### 매개변수

| 이름       | 타입   | 필수 | 설명                                                      |
| ---------- | ------ | ---- | --------------------------------------------------------- |
| orderId    | string | 예   | 주문 ID (고유값)                                          |
| amount     | number | 예   | 결제 금액 (원 단위)                                       |
| orderName  | string | 예   | 주문명                                                    |
| successUrl | string | 예   | 결제 성공 후 리다이렉트될 URL (현재 도메인과 동일해야 함) |

#### 반환값

결제 처리 결과를 담은 Promise를 반환합니다.

## 결제 프로세스 흐름

1. **SDK 초기화**: `pay200SDK` 함수를 호출하여 SDK를 초기화합니다.
2. **결제 요청**: `requestPayment` 함수를 호출하여 결제를 요청합니다.
3. **결제 창 표시**: 사용자에게 결제 창이 표시됩니다.
4. **결제 진행**: 사용자가 결제 수단을 선택하고 결제를 진행합니다.
5. **결제 완료**: 결제가 완료되면 `successUrl`로 리다이렉트됩니다.
6. **결제 검증**: 서버에서 결제 정보를 검증합니다.

## 에러 처리

SDK는 다음과 같은 오류를 발생시킬 수 있습니다:

### 결제 관련 에러 (PaymentError)

| 에러 이름                   | 설명                                           |
| --------------------------- | ---------------------------------------------- |
| PAYMENT_INVALID_PARAMS      | 필수 매개변수가 누락되었을 때 발생             |
| PAYMENT_INVALID_AMOUNT      | 결제 금액이 0 이하일 때 발생                   |
| PAYMENT_INVALID_SUCCESS_URL | 성공 URL이 현재 도메인과 일치하지 않을 때 발생 |
| PAYMENT_INVALID_FAIL_URL    | 실패 URL이 현재 도메인과 일치하지 않을 때 발생 |
| PAYMENT_INVALID_DATE        | 만료 시간 형식이 올바르지 않을 때 발생         |
| PAYMENT_EXPIRED             | 결제 정보가 이미 만료되었을 때 발생            |
| PAYMENT_REJECTED            | 결제가 거절되었을 때 발생                      |
| PAYMENT_CONNECTION_FAILED   | 결제 이벤트 연결에 실패했을 때 발생            |
| PAYMENT_UNKNOWN_ERROR       | 결제 처리 중 알 수 없는 오류가 발생했을 때     |

### API 관련 에러 (PaymentApiError)

| 에러 이름                   | 설명                                          | 코드 |
| --------------------------- | --------------------------------------------- | ---- |
| CARD_AUTH_FAILED            | 카드 인증 과정에서 오류가 발생했을 때         | 400  |
| BAD_PAYMENT_REQUEST         | 잘못된 결제 요청일 때                         | 400  |
| INVALID_CLAIM_AMOUNT        | 주문 ID와 관련된 요청 금액이 유효하지 않을 때 | 400  |
| CLAIM_ALREADY_EXISTS        | 주문 ID로 결제가 이미 진행 중일 때            | 409  |
| PAYMENT_REQUEST_NOT_FOUND   | 결제 요청을 확인할 수 없을 때                 | 404  |
| PAYMENT_NOT_SAVED           | 결제 처리 중 오류가 발생했을 때               | 500  |
| CARD_NOT_FOUND              | 유효한 결제수단을 찾을 수 없을 때             | 404  |
| PAYMENT_METHOD_NOT_VERIFIED | 결제수단이 승인되지 못했을 때                 | 403  |
| INVALID_ORDER_STATUS        | 주문 상태에서 처리될 수 없는 요청일 때        | 400  |
| TOKEN_NOT_FOUND             | 토큰 정보를 확인할 수 없을 때                 | 404  |
| TOKEN_EXPIRED               | 요청한 토큰이 만료되었을 때                   | 410  |
| TOKEN_INVALID               | 토큰이 유효하지 않을 때                       | 401  |
| CONNECTION_NOT_FOUND        | SSE 연결 정보를 확인할 수 없을 때             | 404  |

### 렌더링 관련 에러 (PaymentRenderError)

| 에러 이름                   | 설명                                            |
| --------------------------- | ----------------------------------------------- |
| RENDER_FAILED               | 결제 창 렌더링에 실패했을 때 발생               |
| WINDOW_OPEN_FAILED          | 새 창 열기에 실패했을 때 발생                   |
| BUTTON_NOT_FOUND            | '다음' 버튼 요소가 존재하지 않을 때 발생        |
| DISABLED_NOT_FOUND          | 텍스트 요소가 존재하지 않을 때 발생             |
| QR_CODE_CONTAINER_NOT_FOUND | QR 코드를 렌더링할 컨테이너 요소가 없을 때 발생 |
| QR_CODE_RENDER_FAILED       | QR 코드 렌더링에 실패했을 때 발생               |

에러 처리 예시:

```typescript
try {
  await requestPayment({
    orderId: 'order_12345',
    amount: 15000,
    orderName: '프리미엄 구독',
    successUrl: 'https://your-website.com/success',
    failUrl: 'https://your-website.com/fail',
  });
} catch (error) {
  // 결제 관련 에러 처리
  if (error.name === 'PAYMENT_INVALID_PARAMS') {
    console.error('필수 매개변수가 누락되었습니다.');
  } else if (error.name === 'PAYMENT_INVALID_AMOUNT') {
    console.error('결제 금액이 올바르지 않습니다.');
  } else if (error.name === 'PAYMENT_INVALID_SUCCESS_URL') {
    console.error('성공 URL이 현재 도메인과 일치하지 않습니다.');
  } else if (error.name === 'PAYMENT_INVALID_FAIL_URL') {
    console.error('실패 URL이 현재 도메인과 일치하지 않습니다.');
  } else if (error.name === 'PAYMENT_EXPIRED') {
    console.error('결제 정보가 만료되었습니다.');
  }
  // API 관련 에러 처리
  else if (error.name === 'CARD_AUTH_FAILED') {
    console.error('카드 인증에 실패했습니다.');
  } else if (error.name === 'TOKEN_EXPIRED') {
    console.error('결제 토큰이 만료되었습니다.');
  }
  // 렌더링 관련 에러 처리
  else if (error.name === 'WINDOW_OPEN_FAILED') {
    console.error('결제창을 열 수 없습니다. 팝업 차단을 확인해주세요.');
  } else if (error.name === 'QR_CODE_RENDER_FAILED') {
    console.error('QR 코드 생성에 실패했습니다.');
  }
  // 기타 에러 처리
  else {
    console.error('결제 중 오류가 발생했습니다:', error);
  }
}
```

## 배포 및 버전 관리

Pay200 SDK는 AWS S3에 업로드되고 CloudFront를 통해 배포됩니다. 이를 통해 다음과 같은 이점을 제공합니다:

1. **글로벌 엣지 로케이션**: CloudFront의 글로벌 엣지 로케이션을 통해 전 세계 어디서나 빠른 속도로 SDK를 로드할 수 있습니다.
2. **버전 관리**: 특정 버전의 SDK를 사용할 수 있어 안정적인 서비스 운영이 가능합니다.
3. **캐싱**: 효율적인 캐싱을 통해 로딩 시간을 최소화합니다.

### 버전별 접근 방법

```html
<!-- 최신 버전 (자동 업데이트, 주의 필요) -->
<script src="https://cdn.pay200.com/sdk/latest/pay200-sdk.js"></script>

<!-- 메이저 버전 (1.x.x 중 최신 버전) -->
<script src="https://cdn.pay200.com/sdk/v1/pay200-sdk.js"></script>

<!-- 특정 버전 (권장) -->
<script src="https://cdn.pay200.com/sdk/v1.0.0/pay200-sdk.js"></script>
```

### 버전 정책

Pay200 SDK는 시맨틱 버저닝(Semantic Versioning)을 따릅니다:

- **메이저 버전(x.0.0)**: 하위 호환성이 없는 변경사항
- **마이너 버전(0.x.0)**: 하위 호환성이 있는 기능 추가
- **패치 버전(0.0.x)**: 버그 수정

프로덕션 환경에서는 특정 버전을 지정하여 사용하는 것을 권장합니다.

## 보안 고려사항

- API 키는 노출되지 않도록 주의하세요.
- 프로덕션 환경에서는 HTTPS를 사용하세요.
- 결제 금액과 주문 정보는 서버에서 검증하는 것이 좋습니다.
- CloudFront를 통해 제공되는 SDK는 항상 HTTPS를 통해 로드됩니다.

## 브라우저 호환성

Pay200 SDK는 다음 브라우저를 지원합니다:

- Chrome 60 이상
- Firefox 55 이상
- Safari 11 이상
- Edge 79 이상

## 라이선스

이 SDK는 [MIT 라이선스](/LICENSE) 하에 배포됩니다.
