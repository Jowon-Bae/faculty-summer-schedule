import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { Schedule } from '../data/schedules';
import { STAFF_LIST } from '../data/staff';

interface GroupedScheduleListProps {
  schedules: Schedule[];
}

export function GroupedScheduleList({ schedules }: GroupedScheduleListProps) {
  if (schedules.length === 0) {
    return (
      <div className="card flex-center text-muted" style={{ minHeight: '100px' }}>
        진행 중인 일정이 없습니다.
      </div>
    );
  }

  // 타입별 그룹화
  const grouped = schedules.reduce((acc, schedule) => {
    if (!acc[schedule.type]) {
      acc[schedule.type] = [];
    }
    acc[schedule.type].push(schedule);
    return acc;
  }, {} as Record<string, Schedule[]>);

  // 정해진 순서대로 출력 (휴가 -> 아웃리치 -> 캠프 -> 수련회)
  const typeOrder = ['휴가', '아웃리치', '캠프', '수련회'];
  const existingTypes = Object.keys(grouped);
  const sortedTypes = [
    ...typeOrder.filter(t => existingTypes.includes(t)),
    ...existingTypes.filter(t => !typeOrder.includes(t)).sort()
  ];

  return (
    <div className="flex-column gap-3">
      {sortedTypes.map(type => {
        const typeSchedules = grouped[type];
        return (
          <div key={type} className="card fade-in" style={{ padding: '16px' }}>
            {/* 상단 태그 */}
            <div style={{ marginBottom: '14px' }}>
              <span className={`tag tag-${type}`} style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '6px', fontWeight: 600 }}>
                {type}
              </span>
            </div>
            
            {/* 세부 일정 목록 */}
            <div className="flex-column gap-3">
              {typeSchedules.map((schedule, idx) => {
                const pNames = schedule.participants
                  .map(id => STAFF_LIST.find(s => s.id === id)?.name)
                  .filter(Boolean)
                  .join(', ');

                const startDate = new Date(schedule.startDate);
                const endDate = new Date(schedule.endDate);
                const dateStr = `${format(startDate, 'M.d(E)', { locale: ko })} - ${format(endDate, 'M.d(E)', { locale: ko })}`;

                return (
                  <div key={schedule.id} style={{ display: 'flex', flexDirection: 'column', paddingLeft: '4px' }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '4px' }}>
                      {dateStr}
                      {schedule.location && schedule.location !== '개인일정' && (
                        <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>
                          {' '}• {schedule.location}
                        </span>
                      )}
                    </div>
                    
                    {pNames && (
                      <div style={{ fontSize: '0.9rem', color: 'var(--color-primary-deep)', fontWeight: 500, lineHeight: '1.4' }}>
                        {pNames}
                      </div>
                    )}
                    
                    {/* 항목 사이 구분선 */}
                    {idx < typeSchedules.length - 1 && (
                      <div style={{ margin: '12px 0 2px 0', borderBottom: '1px dashed var(--color-border)' }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
