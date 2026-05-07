import { useMemo } from 'react';
import { format, eachDayOfInterval } from 'date-fns';
import { ko } from 'date-fns/locale';
import { AlertTriangle } from 'lucide-react';
import { STAFF_LIST } from '../data/staff';
import { SCHEDULES } from '../data/schedules';

export function StaffShortageAlert() {
  const { minStaffCount, shortageDaysStr } = useMemo(() => {
    const startDate = new Date(2026, 5, 1); // June 1, 2026
    const endDate = new Date(2026, 8, 5); // Sept 5, 2026
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const targetDays = days.filter(d => d.getDay() === 5 || d.getDay() === 0);

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

    const formattedDays = minDays.map(d => {
      const formatted = format(d, 'M/d(E)', { locale: ko });
      return formatted.replace('(일)', '(주일)');
    }).join(', ');

    return { minStaffCount: minCount, shortageDaysStr: formattedDays };
  }, []);

  if (minStaffCount === STAFF_LIST.length) return null; // No one is ever absent

  return (
    <div className="fade-in" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      backgroundColor: '#FEF2F2',
      border: '1px solid #FCA5A5',
      borderRadius: '8px',
      padding: '12px 16px',
      marginBottom: '16px',
      color: '#991B1B'
    }}>
      <AlertTriangle size={24} style={{ flexShrink: 0 }} />
      <div style={{ fontSize: '0.875rem', lineHeight: '1.4' }}>
        <strong>⚠️ 금/주일 교직원 공백 알림</strong><br/>
        여름 일정 중 금요일과 주일 중 가장 인원이 적은 날은 <strong>{shortageDaysStr}</strong> (잔여 {minStaffCount}명) 입니다.
      </div>
    </div>
  );
}
