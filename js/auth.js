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
            
            sessionStorage.setItem(Auth.tokenKey, JSON.stringify(sessionUser));
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
        sessionStorage.removeItem(Auth.tokenKey);
        this.currentUser = null;
        window.location.href = 'index.html';
    }

    static getCurrentUser() {
        if (this.currentUser) return this.currentUser;
        
        const stored = sessionStorage.getItem(Auth.tokenKey);
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

    static isAdmin() {
        return this.hasRole('admin');
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
            'admin': 3,
            'manager': 2,
            'employee': 1
        };

        const userRole = this.getCurrentUser().role;
        const requiredLevel = roleHierarchy[requiredRole] || 0;
        const userLevel = roleHierarchy[userRole] || 0;

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
            'admin': {
                viewDashboard: true,
                viewEmployees: true,
                editEmployees: true,
                viewTimeClocks: true,
                editTimeClocks: true,
                viewReports: true,
                generateReports: true,
                viewAuditLog: true,
                manageUsers: true,
                manageSettings: true,
                closePeriods: true
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
                closePeriods: false
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
                closePeriods: false
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
