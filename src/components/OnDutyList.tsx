import { STAFF_LIST } from '../data/staff';
import type { Schedule } from '../data/schedules';

interface OnDutyListProps {
  activeSchedules: Schedule[];
}

export function OnDutyList({ activeSchedules }: OnDutyListProps) {
  // 1. 바쁜 사람 추려내기
  const busyStaffIds = new Set<string>();
  activeSchedules.forEach(s => {
    s.participants.forEach(pid => busyStaffIds.add(pid));
  });

  // 2. 대상 교직원 중 가능한 사람 필터링 (교역자 및 간사 한정)
  const availableStaff = STAFF_LIST.filter(staff => {
    const isTarget = staff.department === '교역자' || staff.department === '담임목사' || staff.role.includes('간사');
    return isTarget && !busyStaffIds.has(staff.id);
  });

  // 3. 직분(Role) 기준으로 그룹화 (담임목사 제외)
  const onDutyStaffByRole = availableStaff.reduce((acc, staff) => {
    if (staff.department === '담임목사') return acc; // 담임목사는 별도 섹션 처리
    const role = staff.role;
    if (!acc[role]) {
      acc[role] = [];
    }
    acc[role].push(staff);
    return acc;
  }, {} as Record<string, typeof STAFF_LIST>);

  if (!onDutyStaffByRole['전도사']) {
    onDutyStaffByRole['전도사'] = [];
  }

  // 4. 각 그룹 내에서 이름 '가나다' 순 정렬
  Object.keys(onDutyStaffByRole).forEach(role => {
    onDutyStaffByRole[role].sort((a, b) => a.name.localeCompare(b.name, 'ko-KR'));
  });

  // 5. 표시할 직분 순서 (담임목사 -> 목사 -> 전도사 -> 간사)
  const SENIOR_PASTOR_LABEL = '담임목사';
  const roleOrder = ['목사', '전도사', '간사'];

  // 담임목사 분리
  const seniorPastorStaff = availableStaff.filter(s => s.department === SENIOR_PASTOR_LABEL);

  // 나머지 교역자 역할별 그룹
  const existingRoles = Object.keys(onDutyStaffByRole).filter(r => r !== SENIOR_PASTOR_LABEL);
  const sortedRoles = [
    ...roleOrder.filter(r => existingRoles.includes(r)),
    ...existingRoles.filter(r => !roleOrder.includes(r)).sort()
  ];

  // 최종 렌더링 목록: 담임목사 → 일반 그룹
  const allGroupEntries: [string, typeof STAFF_LIST][] = [
    ...(seniorPastorStaff.length > 0 ? [[SENIOR_PASTOR_LABEL, seniorPastorStaff] as [string, typeof STAFF_LIST]] : []),
    ...sortedRoles.map(r => [r, onDutyStaffByRole[r]] as [string, typeof STAFF_LIST]),
  ];

  if (availableStaff.length === 0) {
    return (
      <div className="card flex-center text-muted" style={{ minHeight: '120px' }}>
        해당 날짜에 잔여 인원이 없습니다.
      </div>
    );
  }

  return (
    <div className="card fade-in" style={{ padding: '20px 16px' }}>
      <div className="flex-column gap-4">
        {allGroupEntries.map(([label, staffList], idx) => {
          return (
            <div key={label}>
              {/* 직분 타이틀 */}
              <div 
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '10px'
                }}
              >
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-primary-deep)' }}>
                  {label}
                </h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  ({staffList.length}명)
                </span>
              </div>
              
              {/* 이름 가로 나열 (공간 절약) */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 14px', alignContent: 'flex-start' }}>
                {staffList.map((staff) => (
                  <span 
                    key={staff.id} 
                    style={{ 
                      fontSize: '0.95rem', 
                      fontWeight: 500,
                      color: 'var(--color-text-main)',
                      lineHeight: '1.4'
                    }}
                  >
                    {staff.name}
                  </span>
                ))}
              </div>
              
              {/* 구분선 (마지막 항목 제외) */}
              {idx < allGroupEntries.length - 1 && (
                <div style={{ margin: '18px 0 14px 0', borderBottom: '1px solid var(--color-border)' }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
