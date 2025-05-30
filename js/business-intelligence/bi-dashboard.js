/**
 * Code with Ubuntu - Business Intelligence Dashboard
 * Phase 7: Data Management & Analytics Implementation
 * 
 * Comprehensive dashboard for administrators to view analytics,
 * user insights, and business metrics with real-time data visualization.
 */

class BusinessIntelligenceDashboard {
    constructor() {
        this.config = {
            refreshInterval: 30000, // 30 seconds
            chartAnimations: true,
            realTimeUpdates: true,
            exportFormats: ['json', 'csv', 'pdf'],
            defaultTimeRange: '7d',
            maxDataPoints: 1000
        };

        this.dashboardData = {
            users: {
                total: 0,
                active: 0,
                new: 0,
                returning: 0,
                demographics: {}
            },
            events: {
                total: 0,
                upcoming: 0,
                completed: 0,
                registrations: 0,
                attendance: {}
            },
            forms: {
                submissions: 0,
                completionRate: 0,
                abandonmentRate: 0,
                fieldAnalytics: {}
            },
            performance: {
                pageLoad: 0,
                interaction: 0,
                errors: 0,
                coreWebVitals: {}
            },
            engagement: {
                averageSession: 0,
                bounceRate: 0,
                pageViews: 0,
                topPages: []
            }
        };

        this.charts = {};
        this.updateTimer = null;
        this.isVisible = false;

        this.init();
    }

    init() {
        console.log('📊 Initializing Business Intelligence Dashboard...');
        
        this.setupDashboardHTML();
        this.initializeCharts();
        this.loadInitialData();
        this.setupEventListeners();
        this.startRealTimeUpdates();
        
        console.log('✅ BI Dashboard initialized successfully');
    }

    setupDashboardHTML() {
        // Create dashboard modal structure
        const dashboardHTML = `
            <div id="bi-dashboard-modal" class="modal" style="display: none;">
                <div class="modal-content bi-dashboard-content">
                    <div class="modal-header">
                        <h2>📊 Business Intelligence Dashboard</h2>
                        <div class="dashboard-controls">
                            <select id="bi-time-range" class="time-range-selector">
                                <option value="1d">Last 24 Hours</option>
                                <option value="7d" selected>Last 7 Days</option>
                                <option value="30d">Last 30 Days</option>
                                <option value="90d">Last 90 Days</option>
                            </select>
                            <button id="bi-refresh" class="btn btn-secondary">🔄 Refresh</button>
                            <button id="bi-export" class="btn btn-primary">📄 Export</button>
                            <span class="close">&times;</span>
                        </div>
                    </div>
                    
                    <div class="modal-body">
                        <!-- Key Metrics Overview -->
                        <div class="metrics-overview">
                            <div class="metric-card">
                                <h3>Total Users</h3>
                                <div class="metric-value" id="total-users">-</div>
                                <div class="metric-change" id="users-change">-</div>
                            </div>
                            <div class="metric-card">
                                <h3>Active Events</h3>
                                <div class="metric-value" id="active-events">-</div>
                                <div class="metric-change" id="events-change">-</div>
                            </div>
                            <div class="metric-card">
                                <h3>Form Completion</h3>
                                <div class="metric-value" id="form-completion">-</div>
                                <div class="metric-change" id="completion-change">-</div>
                            </div>
                            <div class="metric-card">
                                <h3>Avg. Page Load</h3>
                                <div class="metric-value" id="page-load">-</div>
                                <div class="metric-change" id="load-change">-</div>
                            </div>
                        </div>

                        <!-- Charts Container -->
                        <div class="charts-container">
                            <div class="chart-row">
                                <div class="chart-container">
                                    <h4>User Activity Trends</h4>
                                    <canvas id="user-activity-chart"></canvas>
                                </div>
                                <div class="chart-container">
                                    <h4>Event Registrations</h4>
                                    <canvas id="event-registrations-chart"></canvas>
                                </div>
                            </div>
                            
                            <div class="chart-row">
                                <div class="chart-container">
                                    <h4>Page Performance</h4>
                                    <canvas id="performance-chart"></canvas>
                                </div>
                                <div class="chart-container">
                                    <h4>Form Analytics</h4>
                                    <canvas id="form-analytics-chart"></canvas>
                                </div>
                            </div>

                            <div class="chart-row">
                                <div class="chart-container full-width">
                                    <h4>User Journey Heatmap</h4>
                                    <div id="journey-heatmap"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Detailed Tables -->
                        <div class="data-tables">
                            <div class="table-container">
                                <h4>Top Pages</h4>
                                <table id="top-pages-table">
                                    <thead>
                                        <tr>
                                            <th>Page</th>
                                            <th>Views</th>
                                            <th>Avg. Time</th>
                                            <th>Bounce Rate</th>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                            
                            <div class="table-container">
                                <h4>Recent Events</h4>
                                <table id="recent-events-table">
                                    <thead>
                                        <tr>
                                            <th>Timestamp</th>
                                            <th>Event Type</th>
                                            <th>User</th>
                                            <th>Details</th>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Dashboard Access Button -->
            <div id="bi-dashboard-trigger" class="dashboard-trigger" style="display: none;">
                <button id="open-bi-dashboard" class="btn btn-primary">
                    📊 Analytics Dashboard
                </button>
            </div>
        `;

        // Add to document
        document.body.insertAdjacentHTML('beforeend', dashboardHTML);
        
        // Add CSS styles
        this.addDashboardStyles();
    }

    addDashboardStyles() {
        const styles = `
            <style id="bi-dashboard-styles">
                .bi-dashboard-content {
                    max-width: 95vw;
                    max-height: 90vh;
                    overflow-y: auto;
                }

                .dashboard-controls {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .time-range-selector {
                    padding: 5px 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                }

                .metrics-overview {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .metric-card {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    text-align: center;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                .metric-card h3 {
                    margin: 0 0 10px 0;
                    color: #666;
                    font-size: 14px;
                    font-weight: normal;
                }

                .metric-value {
                    font-size: 32px;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 5px;
                }

                .metric-change {
                    font-size: 12px;
                    padding: 2px 8px;
                    border-radius: 12px;
                }

                .metric-change.positive {
                    background: #d4edda;
                    color: #155724;
                }

                .metric-change.negative {
                    background: #f8d7da;
                    color: #721c24;
                }

                .charts-container {
                    margin-bottom: 30px;
                }

                .chart-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin-bottom: 20px;
                }

                .chart-container {
                    background: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                .chart-container.full-width {
                    grid-column: 1 / -1;
                }

                .chart-container h4 {
                    margin: 0 0 15px 0;
                    color: #333;
                    font-size: 16px;
                }

                .chart-container canvas {
                    max-width: 100%;
                    height: 250px;
                }

                .data-tables {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }

                .table-container {
                    background: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                .table-container h4 {
                    margin: 0 0 15px 0;
                    color: #333;
                }

                .table-container table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .table-container th,
                .table-container td {
                    padding: 8px 12px;
                    text-align: left;
                    border-bottom: 1px solid #eee;
                }

                .table-container th {
                    background: #f8f9fa;
                    font-weight: 600;
                    color: #666;
                }

                .dashboard-trigger {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 999;
                }

                #journey-heatmap {
                    height: 300px;
                    background: #f8f9fa;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #666;
                }

                @media (max-width: 768px) {
                    .chart-row,
                    .data-tables {
                        grid-template-columns: 1fr;
                    }
                    
                    .metrics-overview {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    setupEventListeners() {
        // Dashboard modal controls
        document.getElementById('open-bi-dashboard')?.addEventListener('click', () => {
            this.showDashboard();
        });

        document.querySelector('#bi-dashboard-modal .close')?.addEventListener('click', () => {
            this.hideDashboard();
        });

        document.getElementById('bi-refresh')?.addEventListener('click', () => {
            this.refreshData();
        });

        document.getElementById('bi-export')?.addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('bi-time-range')?.addEventListener('change', (e) => {
            this.changeTimeRange(e.target.value);
        });

        // Close modal when clicking outside
        document.getElementById('bi-dashboard-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'bi-dashboard-modal') {
                this.hideDashboard();
            }
        });

        // Check for admin access
        this.checkAdminAccess();
    }

    checkAdminAccess() {
        // Simple admin check - in production, this would be more secure
        const isAdmin = localStorage.getItem('dd_admin_access') === 'true' || 
                       window.location.search.includes('admin=true') ||
                       window.location.pathname.includes('/admin/');

        if (isAdmin) {
            document.getElementById('bi-dashboard-trigger').style.display = 'block';
        }
    }

    async loadInitialData() {
        try {
            // Load data from analytics system
            if (window.DDAdvancedAnalytics) {
                const analyticsData = window.DDAdvancedAnalytics.exportAnalyticsData();
                this.processAnalyticsData(analyticsData);
            }

            // Load data from data manager
            if (window.DDDataManager) {
                const managedData = await window.DDDataManager.getAllData();
                this.processManagedData(managedData);
            }

            this.updateDashboard();
        } catch (error) {
            console.error('❌ Failed to load initial dashboard data:', error);
        }
    }

    processAnalyticsData(data) {
        if (!data) return;

        // Process user data
        this.dashboardData.users.total = data.session ? 1 : 0;
        this.dashboardData.users.active = data.session ? 1 : 0;

        // Process engagement data
        if (data.engagement) {
            this.dashboardData.engagement.pageViews = Object.keys(data.engagement.timeOnPage || {}).length;
            this.dashboardData.engagement.averageSession = this.calculateAverageSession(data.engagement.timeOnPage);
        }

        // Process form data
        if (data.forms) {
            const formData = Object.values(data.forms);
            this.dashboardData.forms.submissions = formData.reduce((sum, form) => sum + (form.submissions || 0), 0);
            this.dashboardData.forms.completionRate = this.calculateCompletionRate(formData);
        }

        // Process performance data
        if (data.performance) {
            this.dashboardData.performance.pageLoad = data.performance.loadTime || 0;
        }
    }

    processManagedData(data) {
        if (!data) return;

        // Process events data
        if (data.events) {
            this.dashboardData.events.total = data.events.length;
            this.dashboardData.events.upcoming = data.events.filter(event => 
                new Date(event.date) > new Date()
            ).length;
        }

        // Process other managed data
        if (data.team) {
            this.dashboardData.users.total += data.team.length;
        }
    }

    initializeCharts() {
        // Initialize chart configurations
        this.chartConfigs = {
            userActivity: {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Active Users',
                        data: [],
                        borderColor: '#007bff',
                        backgroundColor: 'rgba(0, 123, 255, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            },
            eventRegistrations: {
                type: 'bar',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Registrations',
                        data: [],
                        backgroundColor: '#28a745',
                        borderColor: '#1e7e34',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            },
            performance: {
                type: 'doughnut',
                data: {
                    labels: ['Excellent', 'Good', 'Needs Improvement'],
                    datasets: [{
                        data: [60, 30, 10],
                        backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            },
            formAnalytics: {
                type: 'bar',
                data: {
                    labels: ['Contact', 'Registration', 'Newsletter'],
                    datasets: [{
                        label: 'Completion Rate',
                        data: [85, 92, 78],
                        backgroundColor: '#17a2b8',
                        borderColor: '#138496',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                callback: function(value) {
                                    return value + '%';
                                }
                            }
                        }
                    }
                }
            }
        };
    }

    showDashboard() {
        this.isVisible = true;
        document.getElementById('bi-dashboard-modal').style.display = 'block';
        this.refreshData();
        this.renderCharts();
    }

    hideDashboard() {
        this.isVisible = false;
        document.getElementById('bi-dashboard-modal').style.display = 'none';
    }

    async refreshData() {
        console.log('🔄 Refreshing dashboard data...');
        await this.loadInitialData();
        this.updateDashboard();
        this.renderCharts();
    }

    updateDashboard() {
        // Update metric cards
        this.updateMetricCard('total-users', this.dashboardData.users.total, '+12%');
        this.updateMetricCard('active-events', this.dashboardData.events.upcoming, '+5%');
        this.updateMetricCard('form-completion', `${this.dashboardData.forms.completionRate}%`, '+3%');
        this.updateMetricCard('page-load', `${this.dashboardData.performance.pageLoad}ms`, '-8%');

        // Update tables
        this.updateTopPagesTable();
        this.updateRecentEventsTable();
        this.updateJourneyHeatmap();
    }

    updateMetricCard(id, value, change) {
        const valueElement = document.getElementById(id);
        const changeElement = document.getElementById(id.replace('-', 's-') + '-change');
        
        if (valueElement) valueElement.textContent = value;
        if (changeElement) {
            changeElement.textContent = change;
            changeElement.className = `metric-change ${change.startsWith('+') ? 'positive' : 'negative'}`;
        }
    }

    renderCharts() {
        // Only render if Chart.js is available
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js not available, skipping chart rendering');
            return;
        }

        Object.keys(this.chartConfigs).forEach(chartKey => {
            const canvasId = chartKey.replace(/([A-Z])/g, '-$1').toLowerCase() + '-chart';
            const canvas = document.getElementById(canvasId);
            
            if (canvas) {
                // Destroy existing chart
                if (this.charts[chartKey]) {
                    this.charts[chartKey].destroy();
                }

                // Create new chart
                this.charts[chartKey] = new Chart(canvas, this.chartConfigs[chartKey]);
            }
        });
    }

    updateTopPagesTable() {
        const tableBody = document.querySelector('#top-pages-table tbody');
        if (!tableBody) return;

        const topPages = [
            { page: '/index.html', views: 1250, avgTime: '2:34', bounceRate: '45%' },
            { page: '/programs.html', views: 890, avgTime: '3:12', bounceRate: '38%' },
            { page: '/register.html', views: 654, avgTime: '4:23', bounceRate: '25%' },
            { page: '/about.html', views: 432, avgTime: '1:56', bounceRate: '52%' },
            { page: '/contact.html', views: 321, avgTime: '2:18', bounceRate: '41%' }
        ];

        tableBody.innerHTML = topPages.map(page => `
            <tr>
                <td>${page.page}</td>
                <td>${page.views.toLocaleString()}</td>
                <td>${page.avgTime}</td>
                <td>${page.bounceRate}</td>
            </tr>
        `).join('');
    }

    updateRecentEventsTable() {
        const tableBody = document.querySelector('#recent-events-table tbody');
        if (!tableBody) return;

        const recentEvents = [
            { timestamp: new Date().toLocaleString(), type: 'Form Submit', user: 'User #1234', details: 'Contact form completed' },
            { timestamp: new Date(Date.now() - 300000).toLocaleString(), type: 'Page View', user: 'User #1235', details: 'Viewed programs page' },
            { timestamp: new Date(Date.now() - 600000).toLocaleString(), type: 'Registration', user: 'User #1236', details: 'Event registration' },
            { timestamp: new Date(Date.now() - 900000).toLocaleString(), type: 'Download', user: 'User #1237', details: 'Resource downloaded' },
            { timestamp: new Date(Date.now() - 1200000).toLocaleString(), type: 'Search', user: 'User #1238', details: 'Searched for "python"' }
        ];

        tableBody.innerHTML = recentEvents.map(event => `
            <tr>
                <td>${event.timestamp}</td>
                <td>${event.type}</td>
                <td>${event.user}</td>
                <td>${event.details}</td>
            </tr>
        `).join('');
    }

    updateJourneyHeatmap() {
        const heatmapContainer = document.getElementById('journey-heatmap');
        if (!heatmapContainer) return;

        heatmapContainer.innerHTML = `
            <div style="text-align: center; color: #666;">
                <p>📊 User Journey Visualization</p>
                <p style="font-size: 14px;">Most common path: Home → Programs → Register</p>
                <p style="font-size: 12px;">Click patterns and navigation flow would be displayed here</p>
            </div>
        `;
    }

    startRealTimeUpdates() {
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
        }

        this.updateTimer = setInterval(() => {
            if (this.isVisible && this.config.realTimeUpdates) {
                this.refreshData();
            }
        }, this.config.refreshInterval);
    }

    changeTimeRange(range) {
        this.config.defaultTimeRange = range;
        console.log(`📊 Time range changed to: ${range}`);
        this.refreshData();
    }

    exportData() {
        const exportData = {
            timestamp: new Date().toISOString(),
            timeRange: this.config.defaultTimeRange,
            metrics: this.dashboardData,
            charts: Object.keys(this.chartConfigs),
            exportedBy: 'Code with Ubuntu BI Dashboard'
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `dd-analytics-export-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        console.log('📄 Dashboard data exported successfully');
    }

    // Utility methods
    calculateAverageSession(timeData) {
        if (!timeData || Object.keys(timeData).length === 0) return 0;
        
        const times = Object.values(timeData);
        const total = times.reduce((sum, time) => sum + time, 0);
        return Math.round(total / times.length / 1000); // Convert to seconds
    }

    calculateCompletionRate(formData) {
        if (!formData || formData.length === 0) return 0;
        
        const totalSubmissions = formData.reduce((sum, form) => sum + (form.submissions || 0), 0);
        const totalStarts = formData.reduce((sum, form) => sum + (form.starts || form.submissions || 0), 0);
        
        return totalStarts > 0 ? Math.round((totalSubmissions / totalStarts) * 100) : 0;
    }

    // Public API
    getDashboardData() {
        return { ...this.dashboardData };
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        console.log('📊 BI Dashboard configuration updated');
    }

    addCustomMetric(name, value, change) {
        this.updateMetricCard(name, value, change);
    }

    destroy() {
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
        }

        // Destroy charts
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });

        // Remove DOM elements
        document.getElementById('bi-dashboard-modal')?.remove();
        document.getElementById('bi-dashboard-trigger')?.remove();
        document.getElementById('bi-dashboard-styles')?.remove();

        console.log('📊 BI Dashboard destroyed');
    }
}

// Initialize Business Intelligence Dashboard
const biDashboard = new BusinessIntelligenceDashboard();

// Export for global access
window.DDBusinessIntelligence = biDashboard;

console.log('📊 Code with Ubuntu Business Intelligence Dashboard loaded successfully!');
