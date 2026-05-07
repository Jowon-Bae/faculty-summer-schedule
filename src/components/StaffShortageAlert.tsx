import { useMemo } from 'react';
import { format, eachDayOfInterval } from 'date-fns';
import { ko } from 'date-fns/locale';
import { AlertTriangle } from 'lucide-react';
import { STAFF_LIST } from '../data/staff';
import { SCHEDULES } from '../data/schedules';

export function StaffShortageAlert() {
  const { minFridayCount, shortageFridaysStr, minSundayCount, shortageSundaysStr } = useMemo(() => {
    const startDate = new Date(2026, 5, 1); // June 1, 2026
    const endDate = new Date(2026, 8, 5); // Sept 5, 2026
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const fridays = days.filter(d => d.getDay() === 5);
    const sundays = days.filter(d => d.getDay() === 0);

    const getShortageInfo = (targetDays: Date[]) => {
      let minCount = STAFF_LIST.length;
      let minDays: Date[] = [];

      targetDays.forEach(day => {
        const activeSchedules = SCHEDULES.filter(s => {
          const sStart = new Date(s.startDate);
          const sEnd = new Date(s.endDate);
          const checkDate = new Date(day.getFullYear(), day.getMonth(), day.getDate());
          const normStart = new Date(sStart.getFullYear(), sStart.getMonth(), sStart.getDate());
          const normEnd = new Date(sEnd.getFullYear(), sEnd.getMonth(), sEnd.getDate());
          
          return checkDate >= normStart && checkDate <= normEnd;
        });

        const absentStaffIds = new Set<string>();
        activeSchedules.forEach(s => {
          s.participants.forEach(pid => absentStaffIds.add(pid));
        });

        const availableCount = STAFF_LIST.length - absentStaffIds.size;

        if (availableCount < minCount) {
          minCount = availableCount;
          minDays = [day];
        } else if (availableCount === minCount) {
          minDays.push(day);
        }
      });

      return { minCount, minDays };
    };

    const fridayInfo = getShortageInfo(fridays);
    const sundayInfo = getShortageInfo(sundays);

    const formatDays = (dates: Date[], isSunday: boolean) => dates.map(d => {
      const formatted = format(d, 'M/d(E)', { locale: ko });
      return isSunday ? formatted.replace('(일)', '(주일)') : formatted;
    }).join(', ');

    return {
      minFridayCount: fridayInfo.minCount,
      shortageFridaysStr: formatDays(fridayInfo.minDays, false),
      minSundayCount: sundayInfo.minCount,
      shortageSundaysStr: formatDays(sundayInfo.minDays, true),
    };
  }, []);

  if (minFridayCount === STAFF_LIST.length && minSundayCount === STAFF_LIST.length) return null;

  return (
    <div className="fade-in" style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '8px',
      backgroundColor: '#FEF2F2',
      border: '1px solid #FCA5A5',
      borderRadius: '8px',
      padding: '10px 12px',
      marginBottom: '12px',
      color: '#991B1B'
    }}>
      <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px', color: '#DC2626' }} />
      <div style={{ fontSize: '0.75rem', lineHeight: '1.3', letterSpacing: '-0.02em' }}>
        <strong style={{ fontSize: '0.8rem', display: 'block', marginBottom: '3px', color: '#7F1D1D' }}>주말 교직원 공백 알림</strong>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div><span style={{ opacity: 0.85 }}>금:</span> <strong>{shortageFridaysStr}</strong> (잔여 {minFridayCount}명)</div>
          <div><span style={{ opacity: 0.85 }}>주일:</span> <strong>{shortageSundaysStr}</strong> (잔여 {minSundayCount}명)</div>
        </div>
      </div>
    </div>
  );
}
