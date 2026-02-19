# Kyoto Trip Settlement 프로젝트 문서

## 1) 프로젝트 목적
교토 2인 여행의 지출을 빠르게 기록하고, 누가 누구에게 얼마를 송금해야 하는지 직관적으로 정산하기 위한 모바일 퍼스트 웹앱입니다.

- 대상: 2인 여행 정산
- 핵심 가치: 빠른 입력, 명확한 정산, 공유 링크 기반 동기화

---

## 2) 현재 구현 범위

### UI/UX
- 하단 3탭 구조: **메인 / 히스토리 / 설정**
- 지출 입력: 항목명, 금액, 통화(엔/원), 결제자
- 히스토리 고급 보기
  - 정렬: 최신순 / 오래된순 / 금액 큰순 / 금액 작은순
  - 필터: 정산 상태, 결제자, 통화, 항목명 검색
  - 필터 패널 접기/펼치기, 필터 초기화

### 정산 로직
- **공금 결제 분리 처리**
  - 총 지출에는 포함
  - 남은 정산/송금 가이드에서는 제외
- 요약 카드 분리
  - 총 지출
  - 공금 지출

### 저장/동기화
- 기본 저장: `localStorage`
- 공유 동기화: `sid` 기반 원격 상태 저장/조회
  - `POST /api/share`로 새 공유 상태 생성
  - `GET /api/share/:id`로 상태 조회
  - `PUT /api/share/:id`로 상태 갱신

---

## 3) 기술 스택
- 프론트엔드: 정적 단일 페이지(`index.html` 중심)
- 호스팅: Cloudflare Pages
- 서버리스 API: Cloudflare Pages Functions
- DB: Cloudflare D1 (SQLite)

`wrangler.toml` 핵심 설정:
- `name = "kyoto-trip-settlement"`
- `pages_build_output_dir = "."`
- D1 바인딩: `binding = "DB"`, `database_name = "kyoto_trip_settlement"`

---

## 4) 코드 구조(현재)

```text
kyoto-trip-settlement/
├─ index.html
├─ README.md
├─ wrangler.toml
└─ functions/
   └─ api/
      └─ share/
         ├─ index.js      # POST /api/share
         └─ [id].js       # GET/PUT /api/share/:id
```

---

## 5) API 상세

### POST `/api/share`
- 입력: `{ state: <object> }`
- 동작: 상태 JSON 저장 + 12자리 공유 ID 생성
- 응답: `{ id, url }`

### GET `/api/share/:id`
- 동작: 해당 ID의 저장 상태 조회
- 응답: `{ id, state, created_at, updated_at }`
- 예외: 미존재 시 404

### PUT `/api/share/:id`
- 입력: `{ state: <object> }`
- 동작: 기존 공유 상태 업데이트
- 응답: `{ ok: true, id }`
- 예외: 미존재 시 404

---

## 6) 배포 정보
- Production URL: `https://kyoto-trip-settlement.pages.dev`
- 배포 예시:

```bash
npx wrangler pages deploy . --project-name kyoto-trip-settlement
```

---

## 7) 현재 저장소 상태(점검 시점)
- 브랜치: `main` (원격 대비 ahead 1)
- 변경 사항:
  - 수정: `README.md`, `index.html`
  - 신규: `.gitignore`

즉, 아직 원격에 반영되지 않은 로컬 작업이 존재합니다.

---

## 8) 운영/개선 제안

### 단기
1. README에 **사용 시나리오(입력→정산→공유)**를 예시 데이터와 함께 추가
2. `sid` 동기화 충돌 시 동작 규칙(마지막 저장 우선 등) 명문화
3. 에러 메시지 사용자 친화화(네트워크 실패/ID 없음/권한 문제)

### 중기
1. 정산 계산 로직을 함수 단위로 분리(테스트 가능 구조)
2. 히스토리/정산 계산 유닛 테스트 추가
3. 백업/내보내기(JSON) 및 복원 UX 제공

### 장기
1. 다인(3명 이상) 정산 확장 옵션 검토
2. 환율 기준 시점/수동 환율 잠금 기능
3. 오프라인-온라인 동기화 충돌 해결 전략 고도화

---

## 9) 빠른 온보딩 체크리스트
- [ ] `wrangler.toml`의 D1 바인딩 확인
- [ ] 로컬에서 기능 점검(입력/히스토리/정산/공유)
- [ ] `POST/GET/PUT /api/share` 정상 응답 확인
- [ ] Pages 배포 후 `?sid=` 링크 동기화 검증
- [ ] 로컬 변경 커밋/푸시 반영

---

작성일: 2026-02-19
