import { elements } from '../shared/dom.js';
import { encodeHTML } from '../shared/util.js';
import { PAGE_ROUTES } from '../core/routes.js';

const STATUS = {
    active:    { label: 'Active',    cls: 'active' },
    completed: { label: 'Completed', cls: 'completed' },
    archived:  { label: 'Archived',  cls: 'archived' },
};

const view = { projects: [], filter: null, search: '', sort: 'due' };
let eventsWired = false;

function getProgress(project) {
    const total = (project.tasks ?? []).length;
    const completed = (project.tasks ?? []).filter(t => t.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
}

function formatDate(dateStr) {
    if (!dateStr) return { text: 'No due date', soon: false };
    const date = new Date(dateStr);
    if (isNaN(date)) return { text: 'No due date', soon: false };
    const text = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const days = Math.floor((date - new Date()) / 86400000);
    return { text, soon: days <= 7 };
}

function getVisibility() {
    const query = view.search.trim().toLowerCase();
    let list = view.projects.filter(project =>
        (!view.filter || project.status === view.filter) &&
        (!query || project.name.toLowerCase().includes(query))
    );
    if (view.sort === 'name') {
        list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (view.sort === 'progress') {
        list.sort((a, b) => getProgress(b).progress - getProgress(a).progress);
    } else {
        list.sort((a, b) => {
            const dueDateA = a.due_date ? Date.parse(a.due_date) : Infinity;
            const dueDateB = b.due_date ? Date.parse(b.due_date) : Infinity;
            return dueDateA - dueDateB;
        });
    }
    return list;
}

function renderStatusCounts() {
    const counts = { active: 0, completed: 0, archived: 0 };
    for (const project of view.projects) {
        if (counts[project.status] !== null) {
            counts[project.status]++;
        }
    }
    elements.statusCounts.innerHTML = Object.entries(STATUS).map(([key, meta]) => {
        const on = view.filter === key;
        return `<button class='statCount' data-filter='${key}' aria-pressed='${on}'>
            <span class='statCount-label'>${meta.label}</span>
            <span class='statCount-num'>${counts[key]}</span>
            <span class='statCount-hint'>${on ? 'Click to clear' : 'Click to filter'}</span>
        </button>`;
    }).join('');
}

function renderProjectList(list) {
    if (!list.length) {
        const filtered = view.filter || view.search;
        elements.projectsList.innerHTML = `<div class="empty-state">
            <strong>${filtered ? 'No projects match' : 'No projects yet'}</strong>
            <span>${filtered ? 'Clear the filter or search above' : 'Create a new project to get started.'}</span>
        </div>`;
        return;
    }

    elements.projectsList.innerHTML = list.map(project => {
        const meta = STATUS[project.status] ?? { label: project.status, cls: 'active' };
        const { total, completed, percentage } = getProgress(project);
        const due = formatDate(project.due_date);
        const members = project.members_count ?? (Array.isArray(project.members) ? project.members.length : 0);
        return `<article class='projectCard' role='button' tabindex='0' data-project-id='${encodeHTML(project.id)}'>
            <div class='projectCard-top'>
                <span class='statusPill ${meta.cls}'>${encodeHTML(meta.label)}</span>
                <span class='projectCard-due ${due.soon ? ' soon' : ''}'>${encodeHTML(due.text)}</span>
            </div>
            <h3 class='projectCard-title'>${encodeHTML(project.name)}</h3>
            ${project.description ? `<p class='projectCard-desc'>${encodeHTML(project.description)}</p>` : ''}
            ${total > 0 ? `
                <div>
                    <div class='progressMeta'><span>${completed}/${total} tasks</span><span>${percentage}%</span></div>
                    <div class='progressTrack'><span style='width: ${percentage}%;'></span></div>
                </div>` : `<p class='projectCard-noTasks'>No tasks yet</p>`}
            <div class='projectCard-foot'>
                <span class='memberCount'>${members === 0 ? 'No member(s) added' : `${members} member${members === 1 ? '' : 's'}`}</span>
            </div>
        </article>`;
    }).join('');
}

export function renderActivity(items = []) {
    if (!items.length) {
        elements.activityFeed.innerHTML = `<li class='activityEmpty'>No activity yet.</li>`;
        return;
    }

    elements.activityFeed.innerHTML = items.map(item => `<li class='activityItem'>
        <span class='activityDot'></span>
        <div>
            <p class='activityText'>
                <b>${encodeHTML(item.actor_username ?? 'Someone')}</b>
                ${encodeHTML(item.action ?? '')}
                <span class='activityCtx'><a href='/project/${encodeHTML(item.project_id)}'>${encodeHTML((item.target_label ?? '').length > 20 ? item.target_label.slice(0, 20) + '...' : item.target_label ?? '')}</a></span>
            </p>
            <span class='activityWhen'>${encodeHTML(item.when ?? '')}</span>
        </div>
    </li>`).join('');
}

function refreshDashboard() {
    const list = getVisibility();
    renderStatusCounts();
    renderProjectList(list);
    elements.projectCount.textContent = `
        ${list.length} project${list.length === 1 ? '' : 's'}`;
}

function wireEvents() {
    elements.statusCounts.addEventListener('click', e => {
        const button = e.target.closest('[data-filter]');
        if (!button) return;
        const filter = button.dataset.filter;
        view.filter = view.filter === filter ? null : filter;
        refreshDashboard();
    });
    elements.projectSearch.addEventListener('input', e => {
        view.search = e.target.value;
        refreshDashboard();
    });
    elements.projectSort.addEventListener('change', e => {
        view.sort = e.target.value;
        refreshDashboard();
    });

    const open = el => {
        const card = el.closest('[data-project-id]');
        if (card) {
            window.location.href = `/project/${card.dataset.projectId}`;
        }
    };
    elements.projectsList.addEventListener('click', e => open(e.target));
    elements.projectsList.addEventListener('keydown', e => {
        if (e.key === 'Enter') open(e.target);
    });
}

export function dashboardFeature({ projects, activity = [] } = {}) {
    view.projects = projects ?? [];
    renderActivity(activity);
    refreshDashboard();
    if (!eventsWired) {
        wireEvents();
        eventsWired = true;
    }
}