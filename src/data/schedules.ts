export type ScheduleType = '휴가' | '아웃리치' | '수련회' | '캠프';

export interface Schedule {
  id: string;
  type: ScheduleType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  participants: string[]; // staff ids
  location: string;
}

export const SCHEDULES: Schedule[] = [
  // 휴가
  { id: 'v1', type: '휴가', startDate: '2026-06-29', endDate: '2026-07-11', participants: ['1', '19'], location: '개인일정' },
  { id: 'v2', type: '휴가', startDate: '2026-07-06', endDate: '2026-07-18', participants: ['2'], location: '개인일정' },
  { id: 'v3', type: '휴가', startDate: '2026-07-13', endDate: '2026-07-25', participants: ['3'], location: '개인일정' },
  { id: 'v4', type: '휴가', startDate: '2026-07-27', endDate: '2026-08-08', participants: ['4', '5', '6', '7'], location: '개인일정' },
  { id: 'v5', type: '휴가', startDate: '2026-08-03', endDate: '2026-08-15', participants: ['8', '9', '10'], location: '개인일정' },
  { id: 'v6', type: '휴가', startDate: '2026-08-10', endDate: '2026-08-22', participants: ['11', '12'], location: '개인일정' },
  { id: 'v7', type: '휴가', startDate: '2026-08-17', endDate: '2026-08-29', participants: ['13', '14'], location: '개인일정' },
  { id: 'v8', type: '휴가', startDate: '2026-08-24', endDate: '2026-09-05', participants: ['15', '16', '17'], location: '개인일정' },
  { id: 'v9', type: '휴가', startDate: '2026-07-20', endDate: '2026-08-01', participants: ['18'], location: '개인일정' },

  // 아웃리치
  { id: 'o1', type: '아웃리치', startDate: '2026-06-25', endDate: '2026-07-01', participants: ['10'], location: '태국' },
  { id: 'o2', type: '아웃리치', startDate: '2026-07-16', endDate: '2026-07-23', participants: ['7', '13'], location: '르완다' },
  { id: 'o3', type: '아웃리치', startDate: '2026-08-11', endDate: '2026-08-19', participants: ['3'], location: '네팔' },
  { id: 'o4', type: '아웃리치', startDate: '2026-08-14', endDate: '2026-08-19', participants: ['1', '6', '15'], location: '필리핀, 캄보디아' },

  // 캠프
  { id: 'c1', type: '캠프', startDate: '2026-07-03', endDate: '2026-07-04', participants: ['5'], location: '성수연합차세대' },
  { id: 'c2_1', type: '캠프', startDate: '2026-07-24', endDate: '2026-07-26', participants: ['8', '15', '4'], location: '드림키즈' },
  { id: 'c2_2', type: '캠프', startDate: '2026-07-24', endDate: '2026-07-26', participants: ['17', '6', '20'], location: '드림틴즈' },
  { id: 'c3', type: '캠프', startDate: '2026-08-07', endDate: '2026-08-09', participants: ['17', '16', '13'], location: '올스타' },
];
