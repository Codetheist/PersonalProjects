import { elements } from '../shared/dom.js';

const DEMO_WORDS = {
    verbs: [
        'Build', 'Create', 'Develop', 'Design', 'Construct', 'Assemble',
        'Upgrade', 'Improve', 'Enhance', 'Refactor', 'Modernize', 'Optimize',
        'Plan', 'Organize', 'Coordinate', 'Manage', 'Launch', 'Deploy'
    ],

    descriptors: [
        'Custom', 'Advanced', 'Scalable', 'Secure',
        'Modern', 'Efficient', 'Automated', 'High-Performance'
    ],

    modifiers: [
        'V2', 'Prototype', 'MVP', 'Expansion', 'Upgrade',
        'Phase 1', 'Phase 2', 'Migration', 'Integration', 'Rollout'
    ],

    categories: {
        physical: {
            objects: ['Deck', 'Patio', 'Garage', 'Pool', 'Kitchen', 'Roof', 'Garden'],
            phases: ['Planning', 'Preparation', 'Construction', 'Inspection', 'Finishing'],
            dateRange: [14, 90]
        },

        digital: {
            objects: ['App', 'API', 'Dashboard', 'Platform', 'Website', 'System', 'Database'],
            phases: ['Planning', 'Design', 'Development', 'Testing', 'Deployment'],
            dateRange: [7, 45]
        },

        business: {
            objects: ['Workflow', 'Process', 'Strategy', 'Campaign', 'Sales Funnel'],
            phases: ['Planning', 'Strategy', 'Execution', 'Analysis', 'Optimization'],
            dateRange: [10, 60]
        },

        creative: {
            objects: ['Brand Identity', 'Video Project', 'Content Strategy', 'Design System'],
            phases: ['Concept', 'Design', 'Production', 'Review', 'Publish'],
            dateRange: [7, 30]
        },

        event: {
            objects: ['Wedding', 'Conference', 'Workshop', 'Meeting', 'Launch Event'],
            phases: ['Planning', 'Booking', 'Coordination', 'Execution', 'Wrap-up'],
            dateRange: [3, 20]
        },

        general: {
            objects: ['Project', 'Plan', 'Routine', 'Tracker', 'Schedule'],
            phases: ['Planning', 'Execution', 'Review', 'Completion'],
            dateRange: [7, 30]
        }
    }
};

const OWNER_NAMES = {
    first: [
        'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey',
        'Riley', 'Sam', 'Jamie', 'Cameron', 'Avery'
    ],

    last: [
        'Brooks', 'Carter', 'Hayes', 'Reed', 'Parker',
        'Bennett', 'Collins', 'Foster', 'Morgan', 'Gray'
    ]
};

const TASK_TEMPLATES = {
    Planning: ['Define scope', 'Outline requirements', 'Create project plan'],
    Preparation: ['Order materials', 'Prepare tools and workspace', 'Set up work area'],
    Construction: ['Install components', 'Build core structure', 'Complete main work'],
    Inspection: ['Inspect work', 'Check quality', 'Review installation'],
    Finishing: ['Apply finishing touches', 'Clean up workspace', 'Finalize project'],

    Design: ['Create wireframes', 'Design layout', 'Review visual direction'],
    Development: ['Implement features', 'Write code', 'Connect system pieces'],
    Testing: ['Run tests', 'Fix bugs', 'Validate functionality'],
    Deployment: ['Deploy system', 'Set up hosting', 'Confirm launch checklist'],

    Strategy: ['Define strategy', 'Review goals', 'Identify target audience'],
    Execution: ['Carry out main work', 'Coordinate next steps', 'Track progress'],
    Analysis: ['Review performance', 'Analyze results', 'Document findings'],
    Optimization: ['Improve workflow', 'Refine process', 'Optimize results'],

    Concept: ['Create concept', 'Gather inspiration', 'Define creative direction'],
    Production: ['Produce assets', 'Build final materials', 'Prepare deliverables'],
    Review: ['Review work', 'Collect feedback', 'Make revisions'],
    Publish: ['Publish final version', 'Prepare launch materials', 'Share deliverables'],

    Booking: ['Book vendors', 'Reserve location', 'Confirm schedule'],
    Coordination: ['Coordinate team', 'Confirm responsibilities', 'Review logistics'],
    'Wrap-up': ['Send follow-ups', 'Review event results', 'Close out project'],

    Completion: ['Confirm final work', 'Archive notes', 'Mark project complete']
};

const randomItem = (items) => {
    return items[Math.floor(Math.random() * items.length)];
}

const randomChance = (chance) => {
    return Math.random() < chance;
}

const ownerNameGenerator = () => {
    return `${randomItem(OWNER_NAMES.first)} ${randomItem(OWNER_NAMES.last)}`;
}

const pickCategory = () => {
    return randomItem(Object.keys(DEMO_WORDS.categories));
}

const getStatus = () => {
    const roll = Math.random();
    if (roll < 0.2) return 'Done';
    if (roll < 0.7) return 'In Progress';
    return 'To Do';
}

const getPriority = (phase) => {
    if (['Planning', 'Design', 'Strategy'].includes(phase)) {
        return 'High';
    }
    
    if (['Development', 'Execution', 'Construction'].includes(phase)) {
        return 'Medium';
    }
    
    return 'Low';
}

const getDueDate = (category, index) => {
    const [minDays, maxDays] = DEMO_WORDS.categories[category].dateRange;
    const randomOffset = Math.floor(Math.random() * (maxDays - minDays));

    const date = new Date();
    date.setDate(date.getDate() + minDays + randomOffset + index * 5);
    return date.toISOString().split('T')[0];
};

const projectTitle = () => {
    const category = pickCategory();
    const categoryData = DEMO_WORDS.categories[category];
    
    const verb = randomItem(DEMO_WORDS.verbs);
    const object = randomItem(categoryData.objects);
    const descriptor = randomChance(0.4) ? `${randomItem(DEMO_WORDS.descriptors)} ` : '';
    const modifier = randomChance(0.5) ? ` ${randomItem(DEMO_WORDS.modifiers)}` : '';

    return {
        category,
        title: `${verb} ${descriptor}${object}${modifier}`
    };
}

const generateTasks = (category) => {
    const phases = DEMO_WORDS.categories[category].phases;

    return phases.map((phase, index) => {
        const templates = TASK_TEMPLATES[phase] || [`Complete ${phase.toLowerCase()} tasks`];

        return {
            id: index + 1,
            title: randomItem(templates),
            status: getStatus(),
            priority: getPriority(phase),
            dueDate: getDueDate(category, index),
        };
    });
}

const generateLastUpdate = () => {
    const options = [
        'Just now',
        `${Math.floor(Math.random() * 59) + 1} minutes ago`,
        `${Math.floor(Math.random() * 23) + 1} hours ago`,
        `${Math.floor(Math.random() * 6) + 1} days ago`
    ];
    return randomItem(options);
}

const demoProjectGenerator = () => {
    const { title, category } = projectTitle();

    return {
        name: title,
        owner: ownerNameGenerator(),
        members: Math.floor(Math.random() * 6) + 2,
        tasks: generateTasks(category),
        lastUpdate: generateLastUpdate()
    };
}

const getPercentage = (tasks) => {
    const doneCount = tasks.filter(task => task.status === 'Done').length;
    return Math.round((doneCount / tasks.length) * 100);
}

const taskCounter = (tasks, status) => {
    return tasks.filter(task => task.status === status).length;
}

function renderDemoProject(project) {
    const preview = elements.demoPreview;
    if (!preview) return;

    const percentage = getPercentage(project.tasks);

    preview.innerHTML = `
        <div class="projectCard">
            <h3>${project.name}</h3>
            <p>Owner: ${project.owner} | Members: ${project.members}</p>
    
            <div class="progressBar">
                <div class="progressFill" style="width: ${percentage}%;"></div>
            </div>

            <p>${percentage}% Complete</p>
            <div class="taskStatusCounts">
                <span>To Do: ${taskCounter(project.tasks, 'To Do')}</span>
                <span>In Progress: ${taskCounter(project.tasks, 'In Progress')}</span>
                <span>Done: ${taskCounter(project.tasks, 'Done')}</span>
            </div>

            <div class="taskList">
                ${project.tasks.map(task => `
                    <p>
                        <strong>${task.title} - ${task.status}</strong><br>
                        <span>Priority: ${task.priority} | Due: ${task.dueDate}</span>
                    </p>
                `).join('')}
            </div><br>
            <p>Last Updated: ${project.lastUpdate}</p>
        </div>
    `;
}

export function runDemo() {
    renderDemoProject(demoProjectGenerator());
}