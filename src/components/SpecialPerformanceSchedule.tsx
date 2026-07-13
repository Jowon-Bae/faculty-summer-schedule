import { useMemo } from 'react';
import { format, nextSunday, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { SCHEDULES, type Schedule } from '../data/schedules';
import { STAFF_LIST } from '../data/staff';
import { Music } from 'lucide-react';

export function SpecialPerformanceSchedule() {
  const groupedSchedules = useMemo(() => {
    const outreaches = SCHEDULES.filter(s => s.type === '아웃리치');
    
    // Group by next Sunday
    const groups: Record<string, Schedule[]> = {};
    
    outreaches.forEach(s => {
      let endDate = parseISO(s.endDate);
      let targetSunday = nextSunday(endDate);
      
      const dateKey = format(targetSunday, 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(s);
    });

    // Convert to sorted array
    return Object.entries(groups)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([date, schedules]) => ({
        date: parseISO(date),
        schedules
      }));
  }, []);

  const getStaffNames = (ids: string[]) => {
    return ids
      .map(id => STAFF_LIST.find(s => s.id === id)?.name || '')
      .filter(Boolean)
      .join(', ');
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h2 className="section-title">
          <Music size={20} />
          특순 스케줄
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
          아웃리치 복귀 후 맞이하는 첫 주일에 배정됩니다.
        </p>
        
        <div className="flex-col gap-4">
          {groupedSchedules.length === 0 ? (
            <div className="card flex-center text-muted" style={{ minHeight: '120px' }}>
              예정된 특순이 없습니다.
            </div>
          ) : (
            groupedSchedules.map(({ date, schedules }) => (
              <div key={date.toISOString()} className="card">
                <div style={{ 
                  borderBottom: '1px solid var(--color-border)', 
                  paddingBottom: '12px', 
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-primary-deep)' }}>
                    {format(date, 'M월 d일', { locale: ko })} 특순
                  </span>
                  <span className="tag tag-아웃리치">{schedules.length}팀</span>
                </div>
                
                <div className="flex-col gap-4">
                  {schedules.map((s, idx) => (
                    <div key={s.id}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                            {s.customLabel || s.location} 아웃리치팀
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                            ({format(parseISO(s.startDate), 'M/d')}~{format(parseISO(s.endDate), 'M/d')})
                          </span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-main)' }}>
                          참가자: {getStaffNames(s.participants)}
                        </div>
                      </div>
                      {idx < schedules.length - 1 && (
                        <div style={{ margin: '12px 0 0 0', borderBottom: '1px dashed var(--color-border)' }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
