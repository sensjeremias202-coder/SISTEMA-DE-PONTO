// ===== DATABASE SIMULATION =====
// Simulates 3 main tables: Employees, TimeLogs, Closures

class Database {
    constructor() {
        this.dbName = 'sistemaPonto_v1';
        this.initDatabase();
    }

    initDatabase() {
        // Initialize default data if empty
        if (!localStorage.getItem(this.dbName + '_employees')) {
            this.insertDefaultEmployees();
        }
        if (!localStorage.getItem(this.dbName + '_timelogs')) {
            localStorage.setItem(this.dbName + '_timelogs', JSON.stringify([]));
        }
        if (!localStorage.getItem(this.dbName + '_closures')) {
            localStorage.setItem(this.dbName + '_closures', JSON.stringify([]));
        }
        if (!localStorage.getItem(this.dbName + '_users')) {
            this.insertDefaultUsers();
        }
        if (!localStorage.getItem(this.dbName + '_auditlog')) {
            localStorage.setItem(this.dbName + '_auditlog', JSON.stringify([]));
        }
        if (!localStorage.getItem(this.dbName + '_settings')) {
            this.insertDefaultSettings();
        }
        if (!localStorage.getItem(this.dbName + '_departments')) {
            this.insertDefaultDepartments();
        }
    }

    insertDefaultUsers() {
        const users = [
            {
                id: 1,
                email: 'admin@empresa.com',
                password: 'admin123',
                name: 'Administrador RH',
                role: 'admin',
                department: 'RH',
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                email: 'gestor@empresa.com',
                password: 'gestor123',
                name: 'Carlos Gestor',
                role: 'manager',
                department: 'Gestão',
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                email: 'joao@empresa.com',
                password: 'joao123',
                name: 'João Silva',
                role: 'employee',
                employeeId: 1,
                department: 'TI',
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem(this.dbName + '_users', JSON.stringify(users));
    }

    insertDefaultEmployees() {
        const employees = [
            {
                id: 1,
                name: 'João Silva',
                email: 'joao@empresa.com',
                cpf: '123.456.789-00',
                position: 'Desenvolvedor',
                department: 'TI',
                monthlyHours: 176,
                hourlyRate: 50.00,
                contract: 'CLT',
                status: 'ativo',
                createdAt: new Date().toISOString(),
                bankAccount: '12345-6',
                registrationNumber: 'E001'
            },
            {
                id: 2,
                name: 'Maria Santos',
                email: 'maria@empresa.com',
                cpf: '987.654.321-00',
                position: 'Analista de Sistemas',
                department: 'TI',
                monthlyHours: 176,
                hourlyRate: 60.00,
                contract: 'CLT',
                status: 'ativo',
                createdAt: new Date().toISOString(),
                bankAccount: '12345-7',
                registrationNumber: 'E002'
            },
            {
                id: 3,
                name: 'Pedro Oliveira',
                email: 'pedro@empresa.com',
                cpf: '456.789.123-00',
                position: 'Gerente de Projetos',
                department: 'Gestão',
                monthlyHours: 176,
                hourlyRate: 75.00,
                contract: 'CLT',
                status: 'ativo',
                createdAt: new Date().toISOString(),
                bankAccount: '12345-8',
                registrationNumber: 'E003'
            },
            {
                id: 4,
                name: 'Ana Costa',
                email: 'ana@empresa.com',
                cpf: '789.123.456-00',
                position: 'Recursos Humanos',
                department: 'RH',
                monthlyHours: 176,
                hourlyRate: 55.00,
                contract: 'CLT',
                status: 'ativo',
                createdAt: new Date().toISOString(),
                bankAccount: '12345-9',
                registrationNumber: 'E004'
            }
        ];
        localStorage.setItem(this.dbName + '_employees', JSON.stringify(employees));
    }

    insertDefaultSettings() {
        const settings = {
            companyName: 'Minha Empresa LTDA',
            cnpj: '12.345.678/0001-99',
            tolerance: 10, // minutes
            overtimeMultiplier: 1.5, // 50% for weekdays
            sundayMultiplier: 2.0, // 100% for sunday
            holidayMultiplier: 2.0, // 100% for holidays
            useHourBank: true,
            startDate: '01',
            endDate: '15',
            timezone: 'America/Sao_Paulo'
        };
        localStorage.setItem(this.dbName + '_settings', JSON.stringify(settings));
    }

    insertDefaultDepartments() {
        const departments = [
            { id: 1, name: 'TI', createdAt: new Date().toISOString() },
            { id: 2, name: 'RH', createdAt: new Date().toISOString() },
            { id: 3, name: 'Gestão', createdAt: new Date().toISOString() }
        ];
        localStorage.setItem(this.dbName + '_departments', JSON.stringify(departments));
    }

    // ===== DEPARTMENTS =====
    getDepartments() {
        return JSON.parse(localStorage.getItem(this.dbName + '_departments') || '[]');
    }

    getDepartmentById(id) {
        return this.getDepartments().find(d => d.id === id);
    }

    addDepartment(department) {
        const departments = this.getDepartments();
        department.id = Math.max(...departments.map(d => d.id), 0) + 1;
        department.createdAt = new Date().toISOString();
        departments.push(department);
        localStorage.setItem(this.dbName + '_departments', JSON.stringify(departments));
        this.addAuditLog('CREATE', 'departments', department.id, `Departamento ${department.name} criado`);
        return department;
    }

    updateDepartment(id, data) {
        const departments = this.getDepartments();
        const index = departments.findIndex(d => d.id === id);
        if (index !== -1) {
            const oldName = departments[index].name;
            departments[index] = { ...departments[index], ...data };
            localStorage.setItem(this.dbName + '_departments', JSON.stringify(departments));
            this.addAuditLog('UPDATE', 'departments', id, `Departamento atualizado`);

            // If department name changed, update employees that referenced the old name
            if (data.name && data.name !== oldName) {
                const employees = this.getEmployees();
                let changed = false;
                employees.forEach(e => {
                    if (e.department === oldName) {
                        e.department = data.name;
                        changed = true;
                    }
                });
                if (changed) {
                    localStorage.setItem(this.dbName + '_employees', JSON.stringify(employees));
                    this.addAuditLog('UPDATE', 'employees', null, `Departamentos dos funcionários atualizados de ${oldName} para ${data.name}`);
                }
            }

            return departments[index];
        }
        return null;
    }

    deleteDepartment(id) {
        const departments = this.getDepartments();
        const index = departments.findIndex(d => d.id === id);
        if (index !== -1) {
            const [removed] = departments.splice(index, 1);
            localStorage.setItem(this.dbName + '_departments', JSON.stringify(departments));
            this.addAuditLog('DELETE', 'departments', id, `Departamento ${removed.name} removido`);

            // Remove department name from employees who belonged to this department
            const employees = this.getEmployees();
            let changed = false;
            employees.forEach(e => {
                if (e.department === removed.name) {
                    e.department = '';
                    changed = true;
                }
            });
            if (changed) {
                localStorage.setItem(this.dbName + '_employees', JSON.stringify(employees));
                this.addAuditLog('UPDATE', 'employees', null, `Departamento ${removed.name} removido de funcionários`);
            }

            return removed;
        }
        return null;
    }

    // ===== USERS =====
    getUsers() {
        return JSON.parse(localStorage.getItem(this.dbName + '_users') || '[]');
    }

    getUserByEmail(email) {
        return this.getUsers().find(u => u.email === email);
    }

    getUserById(id) {
        return this.getUsers().find(u => u.id === id);
    }

    // ===== EMPLOYEES =====
    getEmployees() {
        return JSON.parse(localStorage.getItem(this.dbName + '_employees') || '[]');
    }

    getEmployeeById(id) {
        return this.getEmployees().find(e => e.id === id);
    }

    getEmployeesByDepartment(department) {
        return this.getEmployees().filter(e => e.department === department);
    }

    addEmployee(employee) {
        const employees = this.getEmployees();
        employee.id = Math.max(...employees.map(e => e.id), 0) + 1;
        employee.createdAt = new Date().toISOString();
        employees.push(employee);
        localStorage.setItem(this.dbName + '_employees', JSON.stringify(employees));
        this.addAuditLog('CREATE', 'employees', employee.id, `Funcionário ${employee.name} criado`);
        return employee;
    }

    updateEmployee(id, data) {
        const employees = this.getEmployees();
        const index = employees.findIndex(e => e.id === id);
        if (index !== -1) {
            employees[index] = { ...employees[index], ...data };
            localStorage.setItem(this.dbName + '_employees', JSON.stringify(employees));
            this.addAuditLog('UPDATE', 'employees', id, `Funcionário atualizado`);
            return employees[index];
        }
        return null;
    }

    // ===== TIME LOGS =====
    getTimeLogs() {
        return JSON.parse(localStorage.getItem(this.dbName + '_timelogs') || '[]');
    }

    getTimeLogsByEmployee(employeeId, startDate = null, endDate = null) {
        let logs = this.getTimeLogs().filter(l => l.employeeId === employeeId);
        
        if (startDate && endDate) {
            const start = new Date(startDate).getTime();
            const end = new Date(endDate).getTime();
            logs = logs.filter(l => {
                const logDate = new Date(l.date).getTime();
                return logDate >= start && logDate <= end;
            });
        }
        
        return logs.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    getTimeLogsByDate(date) {
        const dateStr = new Date(date).toISOString().split('T')[0];
        return this.getTimeLogs().filter(l => l.date === dateStr);
    }

    getTimeLogByEmployeeAndDate(employeeId, date) {
        const dateStr = new Date(date).toISOString().split('T')[0];
        return this.getTimeLogs().find(l => l.employeeId === employeeId && l.date === dateStr);
    }

    addTimeLog(timeLog) {
        const timeLogs = this.getTimeLogs();
        timeLog.id = Math.max(...timeLogs.map(t => t.id), 0) + 1;
        timeLog.createdAt = new Date().toISOString();
        timeLog.ipAddress = this.getClientIP();
        timeLog.geolocation = 'Local'; // Would need geolocation API in production
        timeLogs.push(timeLog);
        localStorage.setItem(this.dbName + '_timelogs', JSON.stringify(timeLogs));
        this.addAuditLog('CREATE', 'timelogs', timeLog.id, `Ponto registrado: ${timeLog.type}`);
        return timeLog;
    }

    updateTimeLog(id, data) {
        const timeLogs = this.getTimeLogs();
        const index = timeLogs.findIndex(t => t.id === id);
        if (index !== -1) {
            timeLogs[index] = { ...timeLogs[index], ...data };
            timeLogs[index].updatedAt = new Date().toISOString();
            localStorage.setItem(this.dbName + '_timelogs', JSON.stringify(timeLogs));
            this.addAuditLog('UPDATE', 'timelogs', id, `Horário modificado`);
            return timeLogs[index];
        }
        return null;
    }

    // ===== CLOSURES (Fechamentos de Quinzena) =====
    getClosures() {
        return JSON.parse(localStorage.getItem(this.dbName + '_closures') || '[]');
    }

    getClosuresByEmployee(employeeId) {
        return this.getClosures().filter(c => c.employeeId === employeeId);
    }

    getClosureByEmployeeAndPeriod(employeeId, period) {
        return this.getClosures().find(c => c.employeeId === employeeId && c.period === period);
    }

    addClosure(closure) {
        const closures = this.getClosures();
        closure.id = Math.max(...closures.map(c => c.id), 0) + 1;
        closure.closedAt = new Date().toISOString();
        closures.push(closure);
        localStorage.setItem(this.dbName + '_closures', JSON.stringify(closures));
        this.addAuditLog('CREATE', 'closures', closure.id, `Fechamento de período: ${closure.period}`);
        return closure;
    }

    // ===== AUDIT LOG =====
    getAuditLog() {
        return JSON.parse(localStorage.getItem(this.dbName + '_auditlog') || '[]');
    }

    addAuditLog(action, table, recordId, details) {
        const auditLog = this.getAuditLog();
        const user = Auth.getCurrentUser();
        auditLog.push({
            id: Math.max(...auditLog.map(a => a.id || 0), 0) + 1,
            action: action,
            table: table,
            recordId: recordId,
            details: details,
            userId: user ? user.id : null,
            userEmail: user ? user.email : 'system',
            timestamp: new Date().toISOString(),
            ipAddress: this.getClientIP()
        });
        localStorage.setItem(this.dbName + '_auditlog', JSON.stringify(auditLog));
    }

    // ===== SETTINGS =====
    getSettings() {
        return JSON.parse(localStorage.getItem(this.dbName + '_settings') || '{}');
    }

    updateSettings(settings) {
        localStorage.setItem(this.dbName + '_settings', JSON.stringify(settings));
        this.addAuditLog('UPDATE', 'settings', 1, 'Configurações atualizadas');
    }

    // ===== UTILITY FUNCTIONS =====
    getClientIP() {
        // In a real application, this would come from the backend
        return 'LOCAL_CLIENT';
    }

    // Clear all data
    clearAllData() {
        localStorage.removeItem(this.dbName + '_employees');
        localStorage.removeItem(this.dbName + '_timelogs');
        localStorage.removeItem(this.dbName + '_closures');
        localStorage.removeItem(this.dbName + '_users');
        localStorage.removeItem(this.dbName + '_auditlog');
        localStorage.removeItem(this.dbName + '_settings');
        this.initDatabase();
    }

    exportData() {
        return {
            employees: this.getEmployees(),
            timeLogs: this.getTimeLogs(),
            closures: this.getClosures(),
            auditLog: this.getAuditLog(),
            settings: this.getSettings(),
            exportDate: new Date().toISOString()
        };
    }
}

// Global database instance
const DB = new Database();
