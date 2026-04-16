// ===== HOUR CALCULATIONS AND BUSINESS LOGIC =====

class HourCalculations {
    static getSettings() {
        return DB.getSettings();
    }

    // Convert time string "HH:MM" to minutes
    static timeToMinutes(timeStr) {
        if (!timeStr) return 0;
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    // Convert minutes to time string "HH:MM"
    static minutesToTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    }

    // Calculate worked hours for a day
    static calculateDailyWorkedHours(timeLog) {
        if (!timeLog || !timeLog.entryTime || !timeLog.exitTime) {
            return 0;
        }

        let workedMinutes = this.timeToMinutes(timeLog.exitTime) - this.timeToMinutes(timeLog.entryTime);

        // Subtract lunch time
        if (timeLog.lunchStartTime && timeLog.lunchEndTime) {
            const lunchMinutes = this.timeToMinutes(timeLog.lunchEndTime) - this.timeToMinutes(timeLog.lunchStartTime);
            workedMinutes -= lunchMinutes;
        }

        // Apply tolerance
        const settings = this.getSettings();
        if (workedMinutes > 0 && workedMinutes < settings.tolerance) {
            workedMinutes = 0; // Discart minimal variations
        }

        return Math.max(0, workedMinutes);
    }

    // Check if today is a weekend or holiday
    static isWeekend(date) {
        const day = new Date(date).getDay();
        return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
    }

    static isHoliday(date) {
        // Brazilian national holidays (can be extended)
        const holidays = [
            '01-01', // New Year
            '04-21', // Tiradentes Day
            '05-01', // Labor Day
            '09-07', // Independence Day
            '10-12', // Our Lady Aparecida
            '11-02', // All Souls' Day
            '11-15', // Proclamation of the Republic
            '11-20', // Black Consciousness Day
            '12-25'  // Christmas
        ];

        const dateStr = new Date(date).toISOString().split('T')[0];
        const month_day = dateStr.slice(5);
        return holidays.includes(month_day);
    }

    // Get overtime multiplier based on date
    static getOvertimeMultiplier(date) {
        const settings = this.getSettings();
        
        if (this.isWeekend(date) || this.isHoliday(date)) {
            return settings.holidayMultiplier; // 100% (or 200% for double hours)
        }
        
        return settings.overtimeMultiplier; // 50% for weekdays
    }

    // Calculate overtime hours
    static calculateOvertimeHours(employeeId, startDate, endDate) {
        const employee = DB.getEmployeeById(employeeId);
        if (!employee) return 0;

        const timeLogs = DB.getTimeLogsByEmployee(employeeId, startDate, endDate);
        const expectedDaily = (employee.monthlyHours / 22); // 22 business days per month avg
        const expectedDailyMinutes = expectedDaily * 60;

        let overtimeMinutes = 0;

        timeLogs.forEach(log => {
            if (log.status === 'closed') { // Only count completed days
                const dailyWorked = this.calculateDailyWorkedHours(log);
                const excess = dailyWorked - expectedDailyMinutes;
                
                if (excess > 0) {
                    overtimeMinutes += excess;
                }
            }
        });

        return overtimeMinutes;
    }

    // Calculate delay or advance
    static calculateDelayOrAdvance(timeLog, expectedHours) {
        if (!timeLog || !timeLog.entryTime || !timeLog.exitTime) {
            return 0; // No data
        }

        const workedMinutes = this.calculateDailyWorkedHours(timeLog);
        const expectedMinutes = expectedHours * 60;
        const difference = workedMinutes - expectedMinutes;

        return difference; // Positive = advance, negative = delay
    }

    // Check if there's delay
    static hasDelay(timeLog, employeeId) {
        const employee = DB.getEmployeeById(employeeId);
        if (!employee || !timeLog || !timeLog.entryTime) return false;

        const settings = this.getSettings();
        const expectedEntryTime = '08:00'; // Standard entry time
        const entryMinutes = this.timeToMinutes(timeLog.entryTime);
        const expectedMinutes = this.timeToMinutes(expectedEntryTime);
        const delayMinutes = entryMinutes - expectedMinutes;

        return delayMinutes > settings.tolerance;
    }

    // Calculate period closure (Fechamento de Quinzena)
    static calculatePeriodClosure(employeeId, startDate, endDate) {
        const employee = DB.getEmployeeById(employeeId);
        if (!employee) return null;

        const timeLogs = DB.getTimeLogsByEmployee(employeeId, startDate, endDate);
        const settings = this.getSettings();

        let totalWorkedMinutes = 0;
        let totalOvertimeMinutes = 0;
        let totalDelayMinutes = 0;
        let daysPresent = 0;
        let daysAbsent = 0;
        let nightHours = 0;

        const expectedDailyMinutes = (employee.monthlyHours / 22) * 60;

        timeLogs.forEach(log => {
            if (log.status === 'closed') {
                daysPresent++;
                const dailyWorked = this.calculateDailyWorkedHours(log);
                totalWorkedMinutes += dailyWorked;

                // Calculate overtime
                const excess = dailyWorked - expectedDailyMinutes;
                if (excess > 0) {
                    const multiplier = this.getOvertimeMultiplier(log.date);
                    totalOvertimeMinutes += excess * (multiplier - 1);
                }

                // Calculate delay
                if (this.hasDelay(log, employeeId)) {
                    const delayMinutes = this.timeToMinutes(log.entryTime) - this.timeToMinutes('08:00');
                    totalDelayMinutes += Math.max(0, delayMinutes - settings.tolerance);
                }

                // Calculate night shift (after 22:00 or before 05:00)
                if (log.entryTime) {
                    const entryHour = parseInt(log.entryTime.split(':')[0]);
                    const exitHour = parseInt(log.exitTime.split(':')[0]);
                    if (entryHour >= 22 || exitHour <= 5 || (entryHour < 5 || exitHour > 22)) {
                        // Simplified night shift calculation
                        nightHours += dailyWorked / 60;
                    }
                }
            } else if (log.status === 'absent') {
                daysAbsent++;
            }
        });

        // Get current closure or create new
        const period = `${new Date(startDate).getFullYear()}-${String(new Date(startDate).getMonth() + 1).padStart(2, '0')}`;
        
        return {
            employeeId: employeeId,
            period: period,
            startDate: startDate,
            endDate: endDate,
            totalWorkedMinutes: totalWorkedMinutes,
            totalWorkedHours: Math.floor(totalWorkedMinutes / 60),
            totalWorkedDecimal: (totalWorkedMinutes / 60).toFixed(2),
            expectedHours: employee.monthlyHours,
            balanceMinutes: totalWorkedMinutes - (employee.monthlyHours * 60),
            balanceHours: (totalWorkedMinutes - (employee.monthlyHours * 60)) / 60,
            overtimeMinutes: totalOvertimeMinutes,
            overtimeHours: totalOvertimeMinutes / 60,
            nightHours: nightHours,
            nightAdditional: nightHours * employee.hourlyRate * 0.2, // 20% additional
            delayMinutes: totalDelayMinutes,
            daysPresent: daysPresent,
            daysAbsent: daysAbsent,
            status: 'open',
            totalValue: employee.hourlyRate * (totalWorkedMinutes / 60),
            overtimeValue: this.calculateOvertimeValue(totalOvertimeMinutes, employee.hourlyRate),
            calculatedAt: new Date().toISOString()
        };
    }

    static calculateOvertimeValue(overtimeMinutes, hourlyRate) {
        const settings = this.getSettings();
        const overtimeHours = overtimeMinutes / 60;
        return overtimeHours * hourlyRate * settings.overtimeMultiplier;
    }

    // Get current period (which half of month)
    static getCurrentPeriod() {
        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth();
        const year = today.getFullYear();

        if (day <= 15) {
            return {
                start: new Date(year, month, 1),
                end: new Date(year, month, 15),
                period: `${year}-${String(month + 1).padStart(2, '0')}-P1`
            };
        } else {
            return {
                start: new Date(year, month, 16),
                end: new Date(year, month + 1, 0),
                period: `${year}-${String(month + 1).padStart(2, '0')}-P2`
            };
        }
    }

    // Get period end date to close timeclock
    static getPeriodEndDate(date = null) {
        const targetDate = date ? new Date(date) : new Date();
        const day = targetDate.getDate();
        
        if (day <= 15) {
            return new Date(targetDate.getFullYear(), targetDate.getMonth(), 15);
        } else {
            return new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);
        }
    }

    // Format time for display
    static formatTime(minutes) {
        const hours = Math.floor(Math.abs(minutes) / 60);
        const mins = Math.abs(minutes) % 60;
        const sign = minutes < 0 ? '-' : '';
        return `${sign}${hours}h ${mins}m`;
    }

    static formatTimeHours(minutes) {
        return (minutes / 60).toFixed(2);
    }

    // Get employee status for today
    static getEmployeeTodayStatus(employeeId) {
        const today = new Date().toISOString().split('T')[0];
        const timeLog = DB.getTimeLogByEmployeeAndDate(employeeId, today);

        if (!timeLog) return 'absent';
        if (timeLog.status === 'closed') return 'present';
        if (timeLog.lunchStartTime && !timeLog.lunchEndTime) return 'lunch';
        if (timeLog.entryTime && !timeLog.exitTime) return 'present';
        
        return 'absent';
    }
}

// Utility function to format currency
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Utility function to format date
function formatDate(date) {
    return new Intl.DateTimeFormat('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(new Date(date));
}

// Utility function to format date and time
function formatDateTime(date) {
    return new Intl.DateTimeFormat('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date(date));
}
