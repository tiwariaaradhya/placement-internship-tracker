
/* =========================================
   PLACETRACK — DASHBOARD JAVASCRIPT
   Backend: Spring Boot
========================================= */

const API_URL = window.location.origin;

const $ = (id) => document.getElementById(id);

let dashboardData = {
    applications: [],
    students: [],
    internships: [],
    companies: []
};


/* -----------------------------------------
   HELPER FUNCTIONS
----------------------------------------- */

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value + (String(value).length === 10 ? "T00:00:00" : ""));

    if (Number.isNaN(date.getTime())) return escapeHTML(value);

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function showToast(message, isError = false) {
    const toast = $("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.toggle("error", isError);
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

function getStatus(status) {
    const value = String(status || "Unknown").trim().toLowerCase();

    if (value === "pending") {
        return { label: "Pending", className: "status-pending" };
    }

    if (value === "accepted") {
        return { label: "Accepted", className: "status-accepted" };
    }

    if (value === "rejected") {
        return { label: "Rejected", className: "status-rejected" };
    }

    return {
        label: status || "Unknown",
        className: "status-other"
    };
}

async function fetchJSON(endpoint) {
    const response = await fetch(`${API_URL}${endpoint}`);

    if (!response.ok) {
        throw new Error(`Request failed: ${endpoint} (${response.status})`);
    }

    return response.json();
}


/* -----------------------------------------
   DATE DISPLAY
----------------------------------------- */

function displayDate() {
    const dateElement = $("currentDate");
    if (!dateElement) return;

    dateElement.textContent = new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}


/* -----------------------------------------
   DASHBOARD STATISTICS
----------------------------------------- */

function renderStatistics(stats) {
    $("totalStudents").textContent = stats.totalStudents ?? 0;
    $("totalCompanies").textContent = stats.totalCompanies ?? 0;
    $("totalInternships").textContent = stats.totalInternships ?? 0;
    $("totalApplications").textContent = stats.totalApplications ?? 0;
}


/* -----------------------------------------
   APPLICATION STATUS
----------------------------------------- */

function renderStatusChart(applications) {
    const total = applications.length;

    const counts = {
        pending: 0,
        accepted: 0,
        rejected: 0
    };

    applications.forEach((application) => {
        const status = String(application.status || "").trim().toLowerCase();

        if (status === "pending") counts.pending++;
        else if (status === "accepted") counts.accepted++;
        else if (status === "rejected") counts.rejected++;
    });

    const pendingPercent = total ? counts.pending / total * 100 : 0;
    const acceptedPercent = total ? counts.accepted / total * 100 : 0;
    const rejectedPercent = total ? counts.rejected / total * 100 : 0;

    $("donutTotal").textContent = total;

    $("pendingApplications").textContent = counts.pending;
    $("acceptedApplications").textContent = counts.accepted;
    $("rejectedApplications").textContent = counts.rejected;

    $("pendingPercent").textContent = `${Math.round(pendingPercent)}%`;
    $("acceptedPercent").textContent = `${Math.round(acceptedPercent)}%`;
    $("rejectedPercent").textContent = `${Math.round(rejectedPercent)}%`;

    const pendingEnd = pendingPercent * 3.6;
    const acceptedEnd = pendingEnd + acceptedPercent * 3.6;

    const donut = $("statusDonut");

    donut.style.background = total
        ? `conic-gradient(
            var(--warning) 0deg ${pendingEnd}deg,
            var(--accent) ${pendingEnd}deg ${acceptedEnd}deg,
            var(--danger) ${acceptedEnd}deg 360deg
        )`
        : "#283226";
}


/* -----------------------------------------
   APPLICATION ACTIVITY CHART
----------------------------------------- */

function renderActivityChart(applications) {
    const days = Number($("activityRange").value) || 30;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - days + 1);

    const dateCounts = {};

    for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);

        const key = [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, "0"),
            String(date.getDate()).padStart(2, "0")
        ].join("-");

        dateCounts[key] = 0;
    }

    applications.forEach((application) => {
        if (!application.applicationDate) return;

        const key = String(application.applicationDate).slice(0, 10);

        if (Object.prototype.hasOwnProperty.call(dateCounts, key)) {
            dateCounts[key]++;
        }
    });

    const values = Object.values(dateCounts);
    const total = values.reduce((sum, value) => sum + value, 0);

    $("activityTotal").textContent = total;

    const width = 700;
    const height = 180;
    const padding = 15;

    const maxValue = Math.max(...values, 1);

    const points = values.map((value, index) => {
        const x = padding + (index / Math.max(days - 1, 1)) * (width - padding * 2);
        const y = height - padding - (value / maxValue) * (height - padding * 2);

        return { x, y, value };
    });

    const linePoints = points.map(point => `${point.x},${point.y}`).join(" ");

    const areaPoints = [
        `${padding},${height - padding}`,
        linePoints,
        `${width - padding},${height - padding}`
    ].join(" ");

    const gridLines = [0, 1, 2, 3].map(index => {
        const y = padding + index * ((height - padding * 2) / 3);

        return `<line x1="${padding}" y1="${y}"
            x2="${width - padding}" y2="${y}"
            stroke="#FFFFFF12" stroke-dasharray="4 6"/>`;
    }).join("");

    const circles = points.map(point => `
        <circle cx="${point.x}" cy="${point.y}" r="3.5"
            fill="#B7F500" stroke="#101510" stroke-width="2"/>
    `).join("");

    $("activityChart").innerHTML = `
        <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none"
             role="img" aria-label="Application activity chart">
            <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#B7F500" stop-opacity=".27"/>
                    <stop offset="100%" stop-color="#B7F500" stop-opacity="0"/>
                </linearGradient>
            </defs>

            ${gridLines}

            <polygon points="${areaPoints}"
                fill="url(#chartGradient)"/>

            <polyline points="${linePoints}"
                fill="none"
                stroke="#B7F500"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"/>

            ${circles}
        </svg>
    `;

    const labelIndexes = [
        0,
        Math.floor((days - 1) / 3),
        Math.floor((days - 1) * 2 / 3),
        days - 1
    ];

    $("chartLabels").innerHTML = [...new Set(labelIndexes)]
        .map(index => {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + index);

            return `<span>${date.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short"
            })}</span>`;
        })
        .join("");
}


/* -----------------------------------------
   RECENT APPLICATIONS
----------------------------------------- */

function renderRecentApplications(applications, students, internships, companies) {
    const tbody = $("applicationsTable");

    const sorted = [...applications].sort((a, b) => {
        return new Date(b.applicationDate || 0) - new Date(a.applicationDate || 0);
    });

    const recent = sorted.slice(0, 6);

    if (!recent.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    No applications found yet.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = recent.map(application => {
        const student = students.find(
            item => Number(item.id) === Number(application.studentId)
        );

        const internship = internships.find(
            item => Number(item.id) === Number(application.internshipId)
        );

        const company = internship
            ? companies.find(item => Number(item.id) === Number(internship.companyId))
            : null;

        const status = getStatus(application.status);

        return `
            <tr>
                <td>
                    <span class="application-id">
                        #${escapeHTML(application.id)}
                    </span>
                </td>

                <td>
                    <span class="table-primary">
                        ${escapeHTML(student?.name || `Student #${application.studentId ?? "—"}`)}
                    </span>
                    <span class="table-secondary">
                        ${escapeHTML(student?.branch || "Student")}
                    </span>
                </td>

                <td>
                    <span class="table-primary">
                        ${escapeHTML(internship?.title || `Internship #${application.internshipId ?? "—"}`)}
                    </span>
                    <span class="table-secondary">
                        ${escapeHTML(company?.name || "Company")}
                    </span>
                </td>

                <td>${formatDate(application.applicationDate)}</td>

                <td>
                    <span class="status-badge ${status.className}">
                        ${escapeHTML(status.label)}
                    </span>
                </td>
            </tr>
        `;
    }).join("");
}


/* -----------------------------------------
   LOAD DASHBOARD
----------------------------------------- */

async function refreshDashboard() {
    const refreshButton = $("refreshButton");

    if (refreshButton) {
        refreshButton.disabled = true;
        refreshButton.textContent = "Loading...";
    }

    try {
        const results = await Promise.allSettled([
            fetchJSON("/dashboard"),
            fetchJSON("/applications"),
            fetchJSON("/students"),
            fetchJSON("/internships"),
            fetchJSON("/companies")
        ]);

        const [statsResult, applicationsResult, studentsResult,
            internshipsResult, companiesResult] = results;

        if (statsResult.status === "fulfilled") {
            renderStatistics(statsResult.value);
        } else {
            console.error("Dashboard statistics:", statsResult.reason);
        }

        dashboardData.applications =
            applicationsResult.status === "fulfilled" && Array.isArray(applicationsResult.value)
                ? applicationsResult.value : [];

        dashboardData.students =
            studentsResult.status === "fulfilled" && Array.isArray(studentsResult.value)
                ? studentsResult.value : [];

        dashboardData.internships =
            internshipsResult.status === "fulfilled" && Array.isArray(internshipsResult.value)
                ? internshipsResult.value : [];

        dashboardData.companies =
            companiesResult.status === "fulfilled" && Array.isArray(companiesResult.value)
                ? companiesResult.value : [];

        renderStatusChart(dashboardData.applications);

        renderActivityChart(dashboardData.applications);

        renderRecentApplications(
            dashboardData.applications,
            dashboardData.students,
            dashboardData.internships,
            dashboardData.companies
        );

        const failed = results.filter(result => result.status === "rejected");

        if (failed.length) {
            console.error("Some dashboard requests failed:", failed);
            showToast("Some dashboard data could not be loaded.", true);
        }

    } catch (error) {
        console.error("Dashboard error:", error);
        showToast("Unable to load dashboard data.", true);
    } finally {
        if (refreshButton) {
            refreshButton.disabled = false;
            refreshButton.innerHTML = "<span>↻</span> Refresh";
        }
    }
}


/* -----------------------------------------
   EVENT LISTENERS
----------------------------------------- */

$("refreshButton").addEventListener("click", refreshDashboard);

$("activityRange").addEventListener("change", () => {
    renderActivityChart(dashboardData.applications);
});


/* -----------------------------------------
   INITIALIZE
----------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
    displayDate();
    refreshDashboard();
});
