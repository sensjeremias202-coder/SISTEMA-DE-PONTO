// ===== AUTHENTICATION & AUTHORIZATION =====

class Auth {
    static currentUser = null;
    static tokenKey = 'sistemaPonto_token';

    static login(email, password) {
        const users = DB.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Remove sensitive data before storing
            const sessionUser = {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                department: user.department,
                employeeId: user.employeeId || null
            };
            
            localStorage.setItem(Auth.tokenKey, JSON.stringify(sessionUser));
            this.currentUser = sessionUser;
            DB.addAuditLog('LOGIN', 'users', user.id, `Usuário ${email} fez login`);
            return true;
        }
        
        return false;
    }

    static logout() {
        if (this.currentUser) {
            DB.addAuditLog('LOGOUT', 'users', this.currentUser.id, `Usuário ${this.currentUser.email} fez logout`);
        }
        localStorage.removeItem(Auth.tokenKey);
        this.currentUser = null;
        window.location.href = 'index.html';
    }

    static getCurrentUser() {
        if (this.currentUser) return this.currentUser;
        
        const stored = localStorage.getItem(Auth.tokenKey);
        if (stored) {
            this.currentUser = JSON.parse(stored);
            return this.currentUser;
        }
        
        return null;
    }

    static isAuthenticated() {
        return this.getCurrentUser() !== null;
    }

    static hasRole(role) {
        const user = this.getCurrentUser();
        if (!user) return false;
        
        if (typeof role === 'string') {
            return user.role === role;
        }
        
        if (Array.isArray(role)) {
            return role.includes(user.role);
        }
        
        return false;
    }

    static isSystemAdmin() {
        return this.hasRole('admin_system');
    }

    static isBusinessAdmin() {
        return this.hasRole('admin_business');
    }

    static isAdmin() {
        return this.hasRole(['admin_system', 'admin_business']);
    }

    static isManager() {
        return this.hasRole('manager');
    }

    static isEmployee() {
        return this.hasRole('employee');
    }

    static canAccess(requiredRole) {
        if (!this.isAuthenticated()) {
            window.location.href = 'index.html';
            return false;
        }

        const roleHierarchy = {
            'admin_system': 4,
            'admin_business': 4,
            'admin': 4,
            'manager': 3,
            'employee': 2
        };

        const userRole = this.getCurrentUser().role;
        const userLevel = roleHierarchy[userRole] || 0;

        let requiredLevel = 0;
        if (Array.isArray(requiredRole)) {
            requiredLevel = Math.max(...requiredRole.map(r => roleHierarchy[r] || 0));
        } else {
            requiredLevel = roleHierarchy[requiredRole] || 0;
        }

        if (userLevel < requiredLevel) {
            alert('Acesso negado. Você não tem permissão para acessar esta página.');
            window.location.href = 'dashboard.html';
            return false;
        }

        return true;
    }

    static getPermissions() {
        const user = this.getCurrentUser();
        if (!user) return {};

        const permissions = {
            'admin_system': {
                viewDashboard: true,
                viewEmployees: true,
                editEmployees: false,
                viewTimeClocks: true,
                editTimeClocks: false,
                viewReports: true,
                generateReports: true,
                viewAuditLog: true,
                manageUsers: false,
                manageSettings: true,
                closePeriods: true,
                clearData: true,
                manageInfrastructure: true
            },
            'admin_business': {
                viewDashboard: true,
                viewEmployees: true,
                editEmployees: true,
                viewTimeClocks: true,
                editTimeClocks: false,
                viewReports: true,
                generateReports: true,
                viewAuditLog: false,
                manageUsers: true,
                manageSettings: true,
                closePeriods: true,
                clearData: false,
                manageInfrastructure: false
            },
            'admin': {
                viewDashboard: true,
                viewEmployees: true,
                editEmployees: true,
                viewTimeClocks: true,
                editTimeClocks: false,
                viewReports: true,
                generateReports: true,
                viewAuditLog: false,
                manageUsers: true,
                manageSettings: true,
                closePeriods: true,
                clearData: false,
                manageInfrastructure: false
            },
            'manager': {
                viewDashboard: true,
                viewEmployees: true,
                editEmployees: false,
                viewTimeClocks: true,
                editTimeClocks: false,
                viewReports: true,
                generateReports: true,
                viewAuditLog: false,
                manageUsers: false,
                manageSettings: false,
                closePeriods: false,
                clearData: false,
                manageInfrastructure: false
            },
            'employee': {
                viewDashboard: true,
                viewEmployees: false,
                editEmployees: false,
                viewTimeClocks: true,
                editTimeClocks: false,
                viewReports: true,
                generateReports: false,
                viewAuditLog: false,
                manageUsers: false,
                manageSettings: false,
                closePeriods: false,
                clearData: false,
                manageInfrastructure: false
            }
        };

        return permissions[user.role] || {};
    }

    static can(action) {
        const permissions = this.getPermissions();
        return permissions[action] || false;
    }
}

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    if (!window.location.pathname.includes('index.html') && !Auth.isAuthenticated()) {
        window.location.href = 'index.html';
    }
});
