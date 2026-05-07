import { useState } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { MonthlyCalendar } from './components/MonthlyCalendar';
import { OnDutyList } from './components/OnDutyList';
import { GroupedScheduleList } from './components/GroupedScheduleList';
import { StaffShortageAlert } from './components/StaffShortageAlert';
import { SCHEDULES } from './data/schedules';
import { Calendar, Users } from 'lucide-react';
import './App.css';

function App() {
  // 앱 실행 시 기본 선택 날짜를 2026년 6월 1일로 설정
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 5, 1));

  // 현재 진행 중인 일정 필터링
  const activeSchedules = SCHEDULES.filter((s) => {
    const start = new Date(s.startDate);
    const end = new Date(s.endDate);
    // 날짜 비교 로직 보정 (시간 무시)
    const checkDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    const sStart = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const sEnd = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    
    return checkDate >= sStart && checkDate <= sEnd;
  });

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <img src="/logo.png" alt="Seoul Dream Church" style={{ height: '9px', objectFit: 'contain' }} />
      </header>

      {/* Main Title Area */}
      <div className="content-padding" style={{ paddingBottom: '0', paddingTop: '4px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary-deep)', lineHeight: '1.3', letterSpacing: '-0.03em', marginBottom: '4px' }}>
            2026 서울드림교회 교직원 여름 스케줄
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
            Professional & Refreshing Summer
          </p>
        </div>

        <StaffShortageAlert />
        <MonthlyCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      </div>

      <div className="content-padding fade-in" style={{ paddingTop: '24px' }}>
        {/* Active Schedules */}
        <div style={{ marginBottom: '32px' }}>
          <h2 className="section-title">
            <Calendar size={20} />
            {format(selectedDate, 'M월 d일(E)', { locale: ko })} 진행 중인 일정 ({activeSchedules.length})
          </h2>
          
          <GroupedScheduleList schedules={activeSchedules} />
        </div>

        {/* On-Duty List (잔여 인원) */}
        <div>
          <h2 className="section-title">
            <Users size={20} />
            {format(selectedDate, 'M월 d일(E)', { locale: ko })} 잔여 인원 (On-Duty)
          </h2>
          <OnDutyList activeSchedules={activeSchedules} />
        </div>
      </div>
    </div>
  );
}

export default App;
