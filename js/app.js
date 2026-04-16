// ===== MAIN APP UTILITIES =====

class AppUtils {
    static initializeNavigation() {
        const user = Auth.getCurrentUser();
        if (!user) return;

        const userInfo = document.querySelector('.user-info');
        if (userInfo) {
            userInfo.innerHTML = `
                <p><strong>${user.name}</strong></p>
                <p>${this.getRoleLabel(user.role)}</p>
                <button class="logout-btn" onclick="handleLogout()">Sair</button>
            `;
        }

        // Set active nav item
        const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
        document.querySelectorAll('.sidebar-nav a').forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    static getRoleLabel(role) {
        const labels = {
            'admin': '👨‍💼 Administrador RH',
            'manager': '👤 Gestor',
            'employee': '👷 Funcionário'
        };
        return labels[role] || role;
    }

    static showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" style="background:none;border:none;cursor:pointer;font-size:18px;">×</button>
        `;
        
        const container = document.querySelector('.main-content') || document.body;
        container.insertBefore(alertDiv, container.firstChild);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }

    static showError(message) {
        this.showAlert(message, 'error');
    }

    static showSuccess(message) {
        this.showAlert(message, 'success');
    }

    static showWarning(message) {
        this.showAlert(message, 'warning');
    }

    static openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    }

    static closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    }

    static exportToCSV(data, filename) {
        if (!Array.isArray(data) || data.length === 0) {
            alert('Nenhum dado para exportar');
            return;
        }

        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(h => {
                const value = row[h];
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename + '.csv';
        link.click();
        window.URL.revokeObjectURL(url);
    }

    static exportToPDF(html, filename) {
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>${filename}</title>
                <link rel="stylesheet" href="css/styles.css">
                <style>
                    body { padding: 20px; font-size: 12px; }
                    .no-print { display: none; }
                </style>
            </head>
            <body>
                ${html}
            </body>
            </html>
        `);
        printWindow.document.close();
        setTimeout(() => {
            printWindow.print();
        }, 250);
    }

    static generatePDFContent(title, data) {
        const settings = DB.getSettings();
        return `
            <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px;">
                <h1>${title}</h1>
                <p><strong>${settings.companyName}</strong></p>
                <p>CNPJ: ${settings.cnpj}</p>
                <p>Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
            </div>
            <div>${data}</div>
            <div style="margin-top: 50px; display: flex; justify-content: space-around; border-top: 1px solid #333; padding-top: 40px;">
                <div style="text-align: center;">
                    <p style="margin-bottom: 60px;">_____________________</p>
                    <p>Assinatura do Funcionário</p>
                </div>
                <div style="text-align: center;">
                    <p style="margin-bottom: 60px;">_____________________</p>
                    <p>Assinatura do Gestor</p>
                </div>
                <div style="text-align: center;">
                    <p style="margin-bottom: 60px;">_____________________</p>
                    <p>Assinatura do RH</p>
                </div>
            </div>
        `;
    }
}

// Global logout function
function handleLogout() {
    if (confirm('Deseja realmente sair?')) {
        Auth.logout();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    AppUtils.initializeNavigation();
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.classList.remove('active');
        }
    });

    // Close modals when clicking close button
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
        });
    });
});

// Format currency helper
function currency(value) {
    return formatCurrency(value);
}

// Format date helper
function date(value) {
    return formatDate(value);
}

// Format date and time helper
function dateTime(value) {
    return formatDateTime(value);
}

// Time to readable format
function timeFormat(minutes) {
    return HourCalculations.formatTime(minutes);
}

// Minutes to hours
function hoursFormat(minutes) {
    return HourCalculations.formatTimeHours(minutes);
}
