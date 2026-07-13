import { useMemo } from 'react';
import { format, nextSunday, previousSunday, isSunday, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { SCHEDULES, type Schedule } from '../data/schedules';
import { STAFF_LIST } from '../data/staff';
import { Music } from 'lucide-react';

type ServiceType = '1부 예배' | '2부 예배' | '3부 예배' | '성수 예배';

type DerivedEvent = {
  id: string;
  date: Date;
  outreach?: Schedule;
  customTitle?: string;
  eventType: '파송' | '특순' | '간증';
  services: ServiceType[];
};

export function SpecialPerformanceSchedule() {
  const groupedEvents = useMemo(() => {
    const outreaches = SCHEDULES.filter(s => s.type === '아웃리치');
    const events: DerivedEvent[] = [];
    const ALL_SERVICES: ServiceType[] = ['1부 예배', '2부 예배', '3부 예배', '성수 예배'];

    outreaches.forEach(s => {
      if (s.location === '넥스트드림') return;

      const isDomestic = s.location.includes('공동체') || s.location.includes('드림');

      const startDate = parseISO(s.startDate);
      const beforeSunday = isSunday(startDate) ? startDate : previousSunday(startDate);
      
      let sendingServices: ServiceType[] = ['3부 예배'];
      if (s.location === '마태공동체') {
        sendingServices = ['2부 예배'];
      }
      
      events.push({
        id: `${s.id}-before`,
        date: beforeSunday,
        outreach: s,
        eventType: isDomestic ? '특순' : '파송',
        services: sendingServices
      });

      const endDate = parseISO(s.endDate);
      const afterSunday = nextSunday(endDate);

      events.push({
        id: `${s.id}-after`,
        date: afterSunday,
        outreach: s,
        eventType: '간증',
        services: ALL_SERVICES
      });
    });

    const manualEvents: DerivedEvent[] = [
      { id: 'm1', date: parseISO('2026-07-26'), customTitle: '드림콰이어 2부', eventType: '특순', services: ['2부 예배'] },
      { id: 'm2', date: parseISO('2026-08-09'), customTitle: '드림콰이어 2부', eventType: '특순', services: ['2부 예배'] },
      { id: 'm3', date: parseISO('2026-08-16'), customTitle: '드림콰이어 2부', eventType: '특순', services: ['2부 예배'] },
      { id: 'm4', date: parseISO('2026-08-16'), customTitle: '드림콰이어 3부', eventType: '특순', services: ['3부 예배'] },
      { id: 'm5', date: parseISO('2026-08-23'), customTitle: '드림콰이어 3부', eventType: '특순', services: ['3부 예배'] },
      { id: 'm6', date: parseISO('2026-08-30'), customTitle: '드림콰이어 3부', eventType: '특순', services: ['3부 예배'] },
    ];
    events.push(...manualEvents);

    const groups: Record<string, Record<ServiceType, DerivedEvent[]>> = {};
    
    const createEmptyServiceMap = () => ({
      '1부 예배': [],
      '2부 예배': [],
      '3부 예배': [],
      '성수 예배': []
    } as Record<ServiceType, DerivedEvent[]>);

    events.forEach(e => {
      const dateKey = format(e.date, 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = createEmptyServiceMap();
      }
      e.services.forEach(svc => {
        groups[dateKey][svc].push(e);
      });
    });

    return Object.entries(groups)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([date, serviceMap]) => ({
        date: parseISO(date),
        serviceMap
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
      case '파송': return { bg: '#DBEAFE', text: '#1E40AF' };
      case '특순': return { bg: '#FEF3C7', text: '#92400E' };
      case '간증': return { bg: '#DCFCE7', text: '#166534' };
      default: return { bg: '#F3F4F6', text: '#374151' };
    }
  };

  const SERVICE_ORDER: ServiceType[] = ['1부 예배', '2부 예배', '3부 예배', '성수 예배'];

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h2 className="section-title">
          <Music size={20} />
          특순/파송/간증 스케줄
        </h2>
        
        <div className="flex-col gap-4">
          {groupedEvents.length === 0 ? (
            <div className="card flex-center text-muted" style={{ minHeight: '120px' }}>
              예정된 일정이 없습니다.
            </div>
          ) : (
            groupedEvents.map(({ date, serviceMap }) => {
              const hasAnyEvents = SERVICE_ORDER.some(svc => serviceMap[svc].length > 0);
              if (!hasAnyEvents) return null;

              return (
                <div key={date.toISOString()} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                  <div style={{ 
                    backgroundColor: 'var(--color-primary-deep)',
                    color: 'white',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>
                      {format(date, 'M월 d일', { locale: ko })}
                    </span>
                  </div>
                  
                  <div className="flex-col" style={{ padding: '16px', gap: '20px' }}>
                    {SERVICE_ORDER.map(svc => {
                      const events = serviceMap[svc];
                      if (events.length === 0) return null;
                      
                      return (
                        <div key={svc}>
                          <div style={{ 
                            fontSize: '0.95rem', 
                            fontWeight: 700, 
                            color: 'var(--color-text-main)',
                            borderBottom: '2px solid var(--color-border)',
                            paddingBottom: '6px',
                            marginBottom: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            <span style={{ 
                              display: 'inline-block', 
                              width: '4px', 
                              height: '14px', 
                              backgroundColor: 'var(--color-primary-sky)', 
                              borderRadius: '2px' 
                            }} />
                            {svc}
                          </div>
                          
                          <div className="flex-col gap-4">
                            {events.map((e, idx) => {
                              const tagStyle = getEventTagColor(e.eventType);
                              const titleText = e.customTitle 
                                ? e.customTitle 
                                : e.outreach 
                                  ? (e.outreach.customLabel || e.outreach.location).replace(/\), /g, ')\n') + ' 아웃리치팀'
                                  : '';

                              return (
                                <div key={`${e.id}-${svc}`}>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                      <span 
                                        className="tag" 
                                        style={{ backgroundColor: tagStyle.bg, color: tagStyle.text, flexShrink: 0, whiteSpace: 'nowrap' }}
                                      >
                                        {e.eventType}
                                      </span>
                                      <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-primary-deep)', whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>
                                        {titleText}
                                      </span>
                                    </div>
                                    {e.outreach && (
                                      <>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', gap: '4px' }}>
                                          <span>일정:</span>
                                          <span>{format(parseISO(e.outreach.startDate), 'M/d')} ~ {format(parseISO(e.outreach.endDate), 'M/d')}</span>
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-main)' }}>
                                          참가자: {getStaffNames(e.outreach.participants)}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                  {idx < events.length - 1 && (
                                    <div style={{ margin: '14px 0 0 0', borderBottom: '1px dashed var(--color-border)' }} />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
