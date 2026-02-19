# Kyoto Trip Settlement

여행 경비 정산용 정적 웹앱 (Cloudflare Pages).

## 저장 방식
- 기본: 브라우저 localStorage (로컬 DB처럼 동작)
- 공유: URL에 상태를 인코딩한 공유 링크

## 기능
- 참여자 추가/삭제
- 지출 추가 (카테고리: 식비/교통/숙소/관광/쇼핑/기타)
- 통화 입력 (JPY/KRW)
- 환율 설정 (JPY→KRW)
- 영수증 메모 저장
- 자동 정산(누가 누구에게 얼마 송금)
- 공유 링크 복사/불러오기

## 배포
- Cloudflare Pages: https://kyoto-trip-settlement.pages.dev

