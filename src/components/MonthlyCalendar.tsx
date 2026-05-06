import { useState, useMemo } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay,
  differenceInDays
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SCHEDULES } from '../data/schedules';
import { STAFF_LIST } from '../data/staff';

interface MonthlyCalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

type DisplayEvent = {
  id: string;
  name: string;
  type: string;
  startDate: Date;
  endDate: Date;
};

export function MonthlyCalendar({ selectedDate, onSelectDate }: MonthlyCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(selectedDate));

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  // 1. 모든 일정을 DisplayEvent 형태로 평탄화
  const allEvents = useMemo(() => {
    const events: DisplayEvent[] = [];
    SCHEDULES.forEach(s => {
      const sStart = new Date(s.startDate);
      const sEnd = new Date(s.endDate);
      const sStartNorm = new Date(sStart.getFullYear(), sStart.getMonth(), sStart.getDate());
      const sEndNorm = new Date(sEnd.getFullYear(), sEnd.getMonth(), sEnd.getDate());

      if (s.participants.length === 0) {
        const displayName = s.location ? `${s.location} ${s.type}` : s.type;
        events.push({
          id: s.id,
          name: displayName,
          type: s.type,
          startDate: sStartNorm,
          endDate: sEndNorm,
        });
      } else {
        s.participants.forEach(pid => {
          const staff = STAFF_LIST.find(st => st.id === pid);
          if (staff) {
            let displayName = staff.name;
            if (s.type === '휴가') {
              displayName = `${staff.name} 휴가`;
            } else if (s.type === '아웃리치') {
              displayName = `${staff.name} ${s.location} 아웃리치`;
            } else {
              displayName = `${staff.name} ${s.location} ${s.type}`;
            }

            events.push({
              id: `${s.id}-${pid}`,
              name: displayName,
              type: s.type,
              startDate: sStartNorm,
              endDate: sEndNorm,
            });
          }
        });
      }
    });
    // 정렬: 시작일 빠른 순, 기간 긴 순
    events.sort((a, b) => {
      if (a.startDate.getTime() !== b.startDate.getTime()) {
        return a.startDate.getTime() - b.startDate.getTime();
      }
      return (b.endDate.getTime() - b.startDate.getTime()) - (a.endDate.getTime() - a.startDate.getTime());
    });
    return events;
  }, []);

  // 2. 주 단위로 쪼개기
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="card" style={{ padding: '16px 12px' }}>
      {/* Header */}
      <div className="flex-row justify-between" style={{ marginBottom: '16px', padding: '0 8px' }}>
        <button onClick={prevMonth} className="icon-button" aria-label="이전 달">
          <ChevronLeft size={24} color="var(--color-text-muted)" />
        </button>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary-deep)' }}>
          {format(currentMonth, 'yyyy년 M월')}
        </h2>
        <button onClick={nextMonth} className="icon-button" aria-label="다음 달">
          <ChevronRight size={24} color="var(--color-text-muted)" />
        </button>
      </div>

      {/* Weekdays Header */}
      <div className="calendar-week-header">
        {weekDays.map(d => (
          <div key={d} className="calendar-cell-header">{d}</div>
        ))}
      </div>

      {/* Calendar Body (Weeks) */}
      <div className="calendar-body">
        {weeks.map((week, weekIdx) => {
          const weekStart = week[0];
          const weekEnd = week[6];

          // 이 주에 겹치는 이벤트 필터링
          const weekEvents = allEvents.filter(ev => ev.startDate <= weekEnd && ev.endDate >= weekStart);
          
          // 위치(rowIdx) 계산 알고리즘
          const rowOccupancy: boolean[][] = []; // rowOccupancy[rowIdx][colIdx]
          
          const renderedEvents = weekEvents.map(ev => {
            const startCol = Math.max(0, differenceInDays(ev.startDate, weekStart));
            const endCol = Math.min(6, differenceInDays(ev.endDate, weekStart));
            
            let rowIdx = 0;
            while (true) {
              if (!rowOccupancy[rowIdx]) {
                rowOccupancy[rowIdx] = new Array(7).fill(false);
              }
              let isOccupied = false;
              for (let c = startCol; c <= endCol; c++) {
                if (rowOccupancy[rowIdx][c]) {
                  isOccupied = true;
                  break;
                }
              }
              if (!isOccupied) {
                for (let c = startCol; c <= endCol; c++) {
                  rowOccupancy[rowIdx][c] = true;
                }
                break;
              }
              rowIdx++;
            }

            return {
              ...ev,
              startCol: startCol + 1, // CSS Grid is 1-indexed
              endCol: endCol + 2, // CSS Grid end is exclusive
              rowIdx,
              isStartCut: ev.startDate < weekStart,
              isEndCut: ev.endDate > weekEnd
            };
          });

          const maxRows = rowOccupancy.length;
          const totalGridRows = maxRows + 1; // row 1: date number

          return (
            <div key={weekIdx} className="calendar-week-grid" style={{ gridTemplateRows: `30px repeat(${maxRows}, 22px) minmax(10px, auto)` }}>
              {/* Background Cells */}
              {week.map((day, colIdx) => {
                const isSelected = isSameDay(day, selectedDate);
                const isCurMonth = isSameMonth(day, monthStart);
                return (
                  <div 
                    key={day.toISOString()}
                    className={`calendar-cell-bg ${isSelected ? 'selected' : ''} ${!isCurMonth ? 'text-muted' : ''}`}
                    onClick={() => onSelectDate(day)}
                    style={{
                      gridColumn: colIdx + 1,
                      gridRow: `1 / span ${totalGridRows + 1}`,
                    }}
                  />
                );
              })}

              {/* Date Numbers */}
              {week.map((day, colIdx) => (
                <div 
                  key={`num-${day.toISOString()}`}
                  className="calendar-day-num"
                  style={{
                    gridColumn: colIdx + 1,
                    gridRow: 1,
                    pointerEvents: 'none',
                    color: !isSameMonth(day, monthStart) ? 'var(--color-text-muted)' : 'inherit',
                  }}
                >
                  {format(day, 'd')}
                </div>
              ))}

              {/* Spanning Event Bars */}
              {renderedEvents.map((ev, idx) => (
                <div
                  key={`${ev.id}-${weekIdx}-${idx}`}
                  className={`spanning-event-bar tag-${ev.type}`}
                  style={{
                    gridColumn: `${ev.startCol} / ${ev.endCol}`,
                    gridRow: ev.rowIdx + 2, // +2 because row 1 is dates
                    borderTopLeftRadius: ev.isStartCut ? '0' : '4px',
                    borderBottomLeftRadius: ev.isStartCut ? '0' : '4px',
                    borderTopRightRadius: ev.isEndCut ? '0' : '4px',
                    borderBottomRightRadius: ev.isEndCut ? '0' : '4px',
                    marginLeft: ev.isStartCut ? '0' : '2px',
                    marginRight: ev.isEndCut ? '0' : '2px',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // 바 클릭 시, 해당 바의 이번 주 시작일(또는 이벤트 시작일 중 늦은 쪽)을 선택
                    onSelectDate(week[ev.startCol - 1]);
                  }}
                >
                  {ev.name}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
