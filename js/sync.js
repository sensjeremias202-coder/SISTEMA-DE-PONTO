// ===== DATA SYNCHRONIZATION =====
// Synchronizes data across browser tabs, devices and navigators

class DataSync {
    static dbName = 'sistemaPonto_v1';
    static channel = null;

    static initBroadcastChannel() {
        try {
            // Broadcast Channel API for cross-tab communication
            this.channel = new BroadcastChannel('sistemaPonto_sync');
            this.channel.addEventListener('message', (event) => {
                const { type, key, data } = event.data;
                if (type === 'SYNC_UPDATE') {
                    // Update localStorage when data changes in another tab
                    localStorage.setItem(key, JSON.stringify(data));
                    // Dispatch custom event to notify other parts of the app
                    window.dispatchEvent(new CustomEvent('dataSync', { detail: { key } }));
                }
            });
        } catch (e) {
            console.log('BroadcastChannel not available, cross-tab sync disabled');
        }
    }

    static broadcastUpdate(key, data) {
        try {
            if (this.channel) {
                this.channel.postMessage({ type: 'SYNC_UPDATE', key, data });
            }
        } catch (e) {
            console.log('Broadcast failed:', e);
        }
    }

    static setItemWithSync(key, value) {
        localStorage.setItem(key, value);
        try {
            const data = JSON.parse(value);
            this.broadcastUpdate(key, data);
        } catch (e) {
            this.broadcastUpdate(key, value);
        }
    }

    static exportForDeviceSync() {
        const data = {
            timestamp: new Date().toISOString(),
            device: navigator.userAgent.substring(0, 100),
            version: '1.0',
            backup: {
                employees: JSON.parse(localStorage.getItem(this.dbName + '_employees') || '[]'),
                timelogs: JSON.parse(localStorage.getItem(this.dbName + '_timelogs') || '[]'),
                closures: JSON.parse(localStorage.getItem(this.dbName + '_closures') || '[]'),
                users: JSON.parse(localStorage.getItem(this.dbName + '_users') || '[]'),
                departments: JSON.parse(localStorage.getItem(this.dbName + '_departments') || '[]'),
                settings: JSON.parse(localStorage.getItem(this.dbName + '_settings') || '{}'),
                auditlog: JSON.parse(localStorage.getItem(this.dbName + '_auditlog') || '[]')
            }
        };
        return data;
    }

    static importDeviceSync(syncData) {
        if (!syncData || !syncData.backup) {
            console.error('Invalid sync data');
            return false;
        }

        try {
            const backup = syncData.backup;
            
            // Only update if the incoming data is newer
            localStorage.setItem(this.dbName + '_employees', JSON.stringify(backup.employees || []));
            localStorage.setItem(this.dbName + '_timelogs', JSON.stringify(backup.timelogs || []));
            localStorage.setItem(this.dbName + '_closures', JSON.stringify(backup.closures || []));
            localStorage.setItem(this.dbName + '_users', JSON.stringify(backup.users || []));
            localStorage.setItem(this.dbName + '_departments', JSON.stringify(backup.departments || []));
            localStorage.setItem(this.dbName + '_settings', JSON.stringify(backup.settings || {}));
            localStorage.setItem(this.dbName + '_auditlog', JSON.stringify(backup.auditlog || []));

            // Notify the app that sync happened
            window.dispatchEvent(new CustomEvent('deviceSynced', { detail: { timestamp: syncData.timestamp } }));
            
            return true;
        } catch (e) {
            console.error('Sync import failed:', e);
            return false;
        }
    }

    static exportToFile() {
        const syncData = this.exportForDeviceSync();
        const jsonStr = JSON.stringify(syncData, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'sistema-ponto-sync-' + new Date().getTime() + '.json';
        link.click();
        window.URL.revokeObjectURL(url);
    }

    static importFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const syncData = JSON.parse(e.target.result);
                    if (this.importDeviceSync(syncData)) {
                        resolve({ success: true, timestamp: syncData.timestamp });
                    } else {
                        reject('Failed to import sync data');
                    }
                } catch (err) {
                    reject('Invalid sync file: ' + err.message);
                }
            };
            reader.onerror = () => reject('Failed to read file');
            reader.readAsText(file);
        });
    }

    static init() {
        this.initBroadcastChannel();
    }
}

// Initialize on load
DataSync.init();
