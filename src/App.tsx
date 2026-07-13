import { useState } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { MonthlyCalendar } from './components/MonthlyCalendar';
import { OnDutyList } from './components/OnDutyList';
import { GroupedScheduleList } from './components/GroupedScheduleList';
import { StaffShortageAlert } from './components/StaffShortageAlert';
import { SpecialPerformanceSchedule } from './components/SpecialPerformanceSchedule';
import { SCHEDULES } from './data/schedules';
import { Calendar, Users, Star } from 'lucide-react';
import './App.css';

function App() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentTab, setCurrentTab] = useState<'schedule' | 'special'>('schedule');

  const activeSchedules = SCHEDULES.filter((s) => {
    const start = new Date(s.startDate);
    const end = new Date(s.endDate);
    const checkDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    const sStart = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const sEnd = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    
    return checkDate >= sStart && checkDate <= sEnd;
  });

  return (
    <div className="app-container">
      <header className="header">
        <img src="/logo.png" alt="Seoul Dream Church" style={{ height: '11.4px', objectFit: 'contain' }} />
      </header>

      <div className="content-padding" style={{ paddingBottom: '0', paddingTop: '4px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary-deep)', lineHeight: '1.3', letterSpacing: '-0.03em', marginBottom: '4px' }}>
            2026 교직원 여름 스케줄
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
            Professional & Refreshing Summer
          </p>
        </div>

        {currentTab === 'schedule' ? (
          <>
            <StaffShortageAlert />
            <MonthlyCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
          </>
        ) : null}
      </div>

      <div className="content-padding fade-in" style={{ paddingTop: currentTab === 'schedule' ? '24px' : '0' }}>
        {currentTab === 'schedule' ? (
          <>
            <div style={{ marginBottom: '32px' }}>
              <h2 className="section-title">
                <Calendar size={20} />
                {format(selectedDate, 'M월 d일(E)', { locale: ko })} 진행 중인 일정 ({activeSchedules.length})
              </h2>
              <GroupedScheduleList schedules={activeSchedules} />
            </div>

            <div>
              <h2 className="section-title">
                <Users size={20} />
                {format(selectedDate, 'M월 d일(E)', { locale: ko })} 잔여 인원 (On-Duty)
              </h2>
              <OnDutyList activeSchedules={activeSchedules} />
            </div>
          </>
        ) : (
          <SpecialPerformanceSchedule />
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button 
          className={`nav-item ${currentTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setCurrentTab('schedule')}
        >
          <Calendar size={20} />
          <span>사역 스케줄</span>
        </button>
        <button 
          className={`nav-item ${currentTab === 'special' ? 'active' : ''}`}
          onClick={() => setCurrentTab('special')}
        >
          <Star size={20} />
          <span>특순/파송/간증/영상</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
