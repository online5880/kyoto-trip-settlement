# Kyoto Trip Settlement

교토 2인 여행 정산을 빠르게 기록하고, 누가 누구에게 얼마를 보내야 하는지 한눈에 확인하는 웹앱입니다.

- 모바일 퍼스트 UI
- Cloudflare Pages + Functions + D1 기반
- 로컬 저장 + 공유 링크(`sid`) 동기화 지원

## 빠른 시작

### 1) 접속
- 프로덕션: https://kyoto-trip-settlement.pages.dev

### 2) 기본 사용 흐름
1. **메인** 탭에서 지출을 입력합니다. (항목명/금액/통화/결제자)
2. 자동 계산된 **정산 요약**을 확인합니다.
3. 필요 시 공유 링크를 만들어 같은 `sid`로 동기화합니다.

### 3) 배포
```bash
npx wrangler pages deploy . --project-name kyoto-trip-settlement
```

---

## 주요 기능

### 탭 구조
- `메인` / `히스토리` / `설정`

### 지출 입력
- 항목명, 금액, 통화(엔/원), 결제자 입력
- 빠른 입력 중심 UX

### 정산 로직
- **공금 결제 분리 처리**
  - `총 지출`에는 포함
  - `남은 정산` 및 송금 가이드에서는 제외
- 요약 카드 분리
  - `총 지출`
  - `공금 지출`

### 히스토리 고급 보기
- 정렬: 최신순 / 오래된순 / 금액 큰순 / 금액 작은순
- 필터: 정산 상태, 결제자, 통화, 항목명 검색
- 필터 패널 접기/펼치기, 필터 초기화

### 통화 표기
- UI 표기: `엔/원`
- 내부 값: `JPY` / `KRW`

---

## 저장 및 동기화

### 로컬 저장
- 브라우저 `localStorage` 사용

### 공유 링크 동기화
- `POST /api/share`로 상태 저장 후 `?sid=...` 링크 생성
- 동일 `sid` 접속 시 원격 상태를 주기적으로 동기화

---

## API

### `POST /api/share`
- 입력: `{ state: <object> }`
- 출력: `{ id, url }`
- 설명: 공유용 상태 생성

### `GET /api/share/:id`
- 출력: `{ id, state, created_at, updated_at }`
- 설명: 공유 상태 조회

### `PUT /api/share/:id`
- 입력: `{ state: <object> }`
- 출력: `{ ok: true, id }`
- 설명: 기존 공유 상태 업데이트

---

## 프로젝트 구조

```text
.
├─ index.html
├─ README.md
├─ PROJECT_OVERVIEW.md
├─ wrangler.toml
└─ functions/
   └─ api/
      └─ share/
         ├─ index.js      # POST /api/share
         └─ [id].js       # GET/PUT /api/share/:id
```

---

## 환경 설정

`wrangler.toml` 예시:

```toml
name = "kyoto-trip-settlement"
compatibility_date = "2026-02-19"
pages_build_output_dir = "."

[[d1_databases]]
binding = "DB"
database_name = "kyoto_trip_settlement"
```

---

## 문서

- 상세 기획/현황 문서: [`PROJECT_OVERVIEW.md`](./PROJECT_OVERVIEW.md)
