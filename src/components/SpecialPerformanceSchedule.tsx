import { useMemo } from 'react';
import { format, nextSunday, previousSunday, isSunday, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { SCHEDULES, type Schedule } from '../data/schedules';
import { STAFF_LIST } from '../data/staff';
import { Music } from 'lucide-react';

type DerivedEvent = {
  id: string;
  date: Date;
  outreach: Schedule;
  eventType: '파송' | '특순' | '간증';
};

export function SpecialPerformanceSchedule() {
  const groupedEvents = useMemo(() => {
    const outreaches = SCHEDULES.filter(s => s.type === '아웃리치');
    const events: DerivedEvent[] = [];

    outreaches.forEach(s => {
      // 1. 국내/해외 분류
      // 장소에 '공동체' 또는 '드림'이 포함되면 국내 아웃리치로 간주
      const isDomestic = s.location.includes('공동체') || s.location.includes('드림');

      // 2. 출발 전 이벤트 (파송/특순)
      const startDate = parseISO(s.startDate);
      // 시작일이 일요일이면 당일, 아니면 이전 일요일
      const beforeSunday = isSunday(startDate) ? startDate : previousSunday(startDate);
      
      events.push({
        id: `${s.id}-before`,
        date: beforeSunday,
        outreach: s,
        eventType: isDomestic ? '특순' : '파송'
      });

      // 3. 복귀 후 이벤트 (간증)
      const endDate = parseISO(s.endDate);
      // 종료일 기준 다음 일요일 (일요일에 끝나면 그다음 주일)
      const afterSunday = nextSunday(endDate);

      events.push({
        id: `${s.id}-after`,
        date: afterSunday,
        outreach: s,
        eventType: '간증'
      });
    });

    // 날짜별로 그룹화
    const groups: Record<string, DerivedEvent[]> = {};
    events.forEach(e => {
      const dateKey = format(e.date, 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(e);
    });

    // 정렬하여 반환
    return Object.entries(groups)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([date, eventList]) => ({
        date: parseISO(date),
        events: eventList
      }));
  }, []);

  const getStaffNames = (ids: string[]) => {
    return ids
      .map(id => STAFF_LIST.find(s => s.id === id)?.name || '')
      .filter(Boolean)
      .join(', ');
  };

  const getEventTagColor = (type: string) => {
    switch(type) {
      case '파송': return { bg: '#DBEAFE', text: '#1E40AF' }; // blue
      case '특순': return { bg: '#FEF3C7', text: '#92400E' }; // yellow/orange
      case '간증': return { bg: '#DCFCE7', text: '#166534' }; // green
      default: return { bg: '#F3F4F6', text: '#374151' };
    }
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h2 className="section-title">
          <Music size={20} />
          특순/파송/간증 스케줄
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '16px', lineHeight: '1.4' }}>
          해외 출발 전엔 파송, 국내 출발 전엔 특순,<br/>복귀 후엔 간증이 배정됩니다.
        </p>
        
        <div className="flex-col gap-4">
          {groupedEvents.length === 0 ? (
            <div className="card flex-center text-muted" style={{ minHeight: '120px' }}>
              예정된 일정이 없습니다.
            </div>
          ) : (
            groupedEvents.map(({ date, events }) => (
              <div key={date.toISOString()} className="card">
                <div style={{ 
                  borderBottom: '2px solid var(--color-border)', 
                  paddingBottom: '8px', 
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-primary-deep)' }}>
                    {format(date, 'M월 d일', { locale: ko })}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    {events.length}건
                  </span>
                </div>
                
                <div className="flex-col gap-4">
                  {events.map((e, idx) => {
                    const tagStyle = getEventTagColor(e.eventType);
                    return (
                      <div key={e.id}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span 
                              className="tag" 
                              style={{ backgroundColor: tagStyle.bg, color: tagStyle.text }}
                            >
                              {e.eventType}
                            </span>
                            <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-primary-deep)' }}>
                              {e.outreach.customLabel || e.outreach.location} 아웃리치팀
                            </span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', gap: '4px' }}>
                            <span>일정:</span>
                            <span>{format(parseISO(e.outreach.startDate), 'M/d')} ~ {format(parseISO(e.outreach.endDate), 'M/d')}</span>
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-main)' }}>
                            참가자: {getStaffNames(e.outreach.participants)}
                          </div>
                        </div>
                        {idx < events.length - 1 && (
                          <div style={{ margin: '14px 0 0 0', borderBottom: '1px dashed var(--color-border)' }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
