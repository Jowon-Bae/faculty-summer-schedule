export type ScheduleType = '휴가' | '아웃리치' | '수련회' | '캠프' | '기타 사역';

export interface Schedule {
  id: string;
  type: ScheduleType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  participants: string[]; // staff ids
  location: string;
  customLabel?: string;
}

export const SCHEDULES: Schedule[] = [
  // 휴가
  { id: 'v1', type: '휴가', startDate: '2026-06-29', endDate: '2026-07-11', participants: ['1', '19'], location: '개인일정' },
  { id: 'v2', type: '휴가', startDate: '2026-07-06', endDate: '2026-07-18', participants: ['2'], location: '개인일정' },
  { id: 'v3', type: '휴가', startDate: '2026-07-06', endDate: '2026-07-18', participants: ['3'], location: '개인일정' },
  { id: 'v4', type: '휴가', startDate: '2026-07-27', endDate: '2026-08-08', participants: ['4', '5', '6', '7', '22'], location: '개인일정' },
  { id: 'v5', type: '휴가', startDate: '2026-08-03', endDate: '2026-08-15', participants: ['10'], location: '개인일정' },
  { id: 'v6', type: '휴가', startDate: '2026-08-10', endDate: '2026-08-22', participants: ['11'], location: '개인일정' },
  { id: 'v12', type: '휴가', startDate: '2026-08-17', endDate: '2026-08-22', participants: ['12'], location: '개인일정' },
  { id: 'v13', type: '휴가', startDate: '2026-09-07', endDate: '2026-09-15', participants: ['12'], location: '개인일정', customLabel: '9/15(화)은 월차' },
  { id: 'v7', type: '휴가', startDate: '2026-08-17', endDate: '2026-08-29', participants: ['13', '14'], location: '개인일정' },
  { id: 'v8', type: '휴가', startDate: '2026-08-24', endDate: '2026-09-05', participants: ['15', '16', '17', '8'], location: '개인일정' },
  { id: 'v9', type: '휴가', startDate: '2026-07-20', endDate: '2026-08-01', participants: ['18', '21'], location: '개인일정' },
  { id: 'v10', type: '휴가', startDate: '2026-07-27', endDate: '2026-08-15', participants: ['23'], location: '개인일정' },
  { id: 'v11', type: '휴가', startDate: '2026-08-10', endDate: '2026-08-19', participants: ['24'], location: '개인일정' },

  // 아웃리치
  { id: 'o1', type: '아웃리치', startDate: '2026-06-25', endDate: '2026-07-01', participants: ['10'], location: '태국' },
  { id: 'o2', type: '아웃리치', startDate: '2026-07-16', endDate: '2026-07-23', participants: ['7', '13'], location: '르완다' },
  { id: 'o3', type: '아웃리치', startDate: '2026-08-11', endDate: '2026-08-19', participants: ['8'], location: '네팔' },
  { id: 'o4', type: '아웃리치', startDate: '2026-08-14', endDate: '2026-08-19', participants: ['1', '6', '21', '15'], location: '필리핀, 캄보디아', customLabel: '필리핀(배주원, 최광식), 캄보디아(김강림, 장은혜)' },
  { id: 'o5', type: '아웃리치', startDate: '2026-07-17', endDate: '2026-07-19', participants: ['21'], location: '누가공동체' },
  { id: 'o6', type: '아웃리치', startDate: '2026-07-17', endDate: '2026-07-19', participants: ['11'], location: '마태공동체' },
  { id: 'o7', type: '아웃리치', startDate: '2026-07-31', endDate: '2026-08-02', participants: ['1'], location: '마가공동체' },
  { id: 'o8', type: '아웃리치', startDate: '2026-10-09', endDate: '2026-10-11', participants: ['8'], location: '다니엘공동체' },
  { id: 'o9', type: '아웃리치', startDate: '2026-08-14', endDate: '2026-08-16', participants: ['17'], location: '요한공동체' },
  { id: 'o10', type: '아웃리치', startDate: '2026-08-28', endDate: '2026-08-30', participants: ['3', '7', '10', '2'], location: '넥스트드림' },

  // 기타 사역
  { id: 'r1', type: '기타 사역', startDate: '2026-06-01', endDate: '2026-06-03', participants: ['24', '3', '7'], location: '제주걷기묵상' },
  { id: 'r2', type: '기타 사역', startDate: '2026-06-12', endDate: '2026-06-12', participants: ['23', '11'], location: '결혼식 주례' },
  { id: 'r3', type: '기타 사역', startDate: '2026-06-19', endDate: '2026-06-21', participants: ['23'], location: '필리핀 선교지 방문' },
  { id: 'r4', type: '기타 사역', startDate: '2026-06-19', endDate: '2026-06-21', participants: ['11', '21'], location: '남성 사역 리트릿' },
  { id: 'r5', type: '기타 사역', startDate: '2026-08-24', endDate: '2026-09-04', participants: ['23'], location: '아프리카 선교지 방문' },
  { id: 'r6', type: '기타 사역', startDate: '2026-07-06', endDate: '2026-07-11', participants: ['24', '21'], location: '백두산 여행' },
  { id: 'r7', type: '기타 사역', startDate: '2026-07-13', endDate: '2026-07-17', participants: ['23'], location: '일본 일정' },
  { id: 'r8', type: '기타 사역', startDate: '2026-07-30', endDate: '2026-08-01', participants: ['8'], location: '코너스톤' },

  // 캠프
  { id: 'c1', type: '캠프', startDate: '2026-07-17', endDate: '2026-07-18', participants: ['5', '8', '16', '17', '15', '13', '6', '20', '4', '14'], location: '성수연합차세대' },
  { id: 'c2_1', type: '캠프', startDate: '2026-07-24', endDate: '2026-07-26', participants: ['8', '15', '4'], location: '드림키즈' },
  { id: 'c2_2', type: '캠프', startDate: '2026-07-24', endDate: '2026-07-26', participants: ['17', '6', '20', '5'], location: '드림틴즈' },
  { id: 'c3', type: '캠프', startDate: '2026-08-07', endDate: '2026-08-09', participants: ['17', '16', '13', '14'], location: '올스타' },
];
