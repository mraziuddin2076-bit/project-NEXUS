// Seeded sample data for multiple projects across different statuses
// Realistically structured: tasks with dependencies, team members with capacity, budgets

const teamMemberCapacity = {
  // Working hours per week available per person
  "Alice": 32,
  "Bob": 36,
  "Charlie": 28,
  "Diana": 40,
  "Evan": 30,
  "Fiona": 34,
};

const projects = [
  {
    id: "p1",
    name: "Mobile App Redesign",
    description: "Complete overhaul of customer-facing mobile app with new UI and payment flow",
    status: "running",
    priority: 10,
    budget: { total: 80000, spent: 42000 },
    startDate: "2026-08-15",
    deadline: "2026-11-30",
    team: ["Alice", "Bob", "Charlie"],
    taskIds: ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9", "t10"]
  },
  {
    id: "p2",
    name: "Data Warehouse Migration",
    description: "Migrating on-prem data warehouse to cloud-native platform (Snowflake)",
    status: "queued",
    priority: 9,
    budget: { total: 120000, spent: 0 },
    startDate: null, // not started
    deadline: "2027-02-15",
    team: ["Diana", "Evan", "Fiona"],
    taskIds: []
  },
  {
    id: "p3",
    name: "Q4 Marketing Campaign",
    description: "Full campaign setup: landing pages, ad creative, analytics, influencer outreach",
    status: "running",
    priority: 8,
    budget: { total: 45000, spent: 28000 },
    startDate: "2026-08-01",
    deadline: "2026-10-15",
    team: ["Alice", "Fiona"],
    taskIds: []
  },
  {
    id: "p4",
    name: "Backend API Refactor",
    description: "Refactoring legacy monolith into microservices for scaling",
    status: "delayed",
    priority: 7,
    budget: { total: 95000, spent: 68000 },
    startDate: "2026-07-10",
    deadline: "2026-09-15",
    team: ["Bob", "Charlie"],
    taskIds: []
  },
  {
    id: "p5",
    name: "Customer Support Portal",
    description: "Self-service ticketing and knowledge base for enterprise clients",
    status: "on-hold",
    priority: 6,
    budget: { total: 30000, spent: 8000 },
    startDate: "2026-06-20",
    deadline: "2026-09-20",
    team: ["Evan"],
    taskIds: []
  },
  {
    id: "p6",
    name: "Analytics Dashboard v2",
    description: "Enhanced analytics with real-time streaming and predictive modeling",
    status: "running",
    priority: 5,
    budget: { total: 65000, spent: 35000 },
    startDate: "2026-08-05",
    deadline: "2026-10-30",
    team: ["Charlie", "Diana"],
    taskIds: []
  }
];

// All tasks across projects with dependencies and estimates
const tasks = [
  { id: "t1", projectId: "p1", name: "Design System Creation", duration: 5, startDate: "2026-08-15", completed: false, owner: "Alice", dependsOn: [], risk: "low" },
  { id: "t2", projectId: "p1", name: "Wireframe Screens", duration: 4, startDate: "2026-08-20", completed: true, owner: "Alice", dependsOn: ["t1"], risk: "low" },
  { id: "t3", projectId: "p1", name: "Frontend React Components", duration: 18, startDate: "2026-08-22", completed: false, owner: "Bob", dependsOn: ["t2"], risk: "medium" },
  { id: "t4", projectId: "p1", name: "Payment Gateway Integration", duration: 10, startDate: null, completed: false, owner: "Charlie", dependsOn: ["t2"], risk: "high" },
  { id: "t5", projectId: "p1", name: "Backend API Development", duration: 20, startDate: null, completed: false, owner: "Bob", dependsOn: ["t2"], risk: "medium" },
  { id: "t6", projectId: "p1", name: "API Testing", duration: 5, startDate: null, completed: false, owner: "Charlie", dependsOn: ["t3", "t5"], risk: "low" },
  { id: "t7", projectId: "p1", name: "UI Testing", duration: 3, startDate: null, completed: false, owner: "Alice", dependsOn: ["t3"], risk: "low" },
  { id: "t8", projectId: "p1", name: "Security Review", duration: 3, startDate: null, completed: false, owner: "Charlie", dependsOn: ["t4", "t5"], risk: "medium" },
  { id: "t9", projectId: "p1", name: "Beta Deployment", duration: 2, startDate: null, completed: false, owner: "Bob", dependsOn: ["t6", "t7", "t8"], risk: "low" },
  { id: "t10", projectId: "p1", name: "Production Release", duration: 1, startDate: null, completed: false, owner: "Alice", dependsOn: ["t9"], risk: "low" },
  // Placeholder tasks for other projects (engine will generate detailed tasks)
  { id: "t11", projectId: "p3", name: "Campaign Planning", duration: 3, startDate: "2026-08-01", completed: true, owner: "Alice", dependsOn: [], risk: "low" },
  { id: "t12", projectId: "p3", name: "Landing Page Build", duration: 12, startDate: "2026-08-04", completed: false, owner: "Fiona", dependsOn: ["t11"], risk: "medium" },
  { id: "t13", projectId: "p3", name: "Ad Creative", duration: 5, startDate: "2026-08-09", completed: false, owner: "Fiona", dependsOn: ["t11"], risk: "low" },
  { id: "t14", projectId: "p3", name: "Campaign Launch", duration: 1, startDate: null, completed: false, owner: "Alice", dependsOn: ["t12", "t13"], risk: "high" },
  { id: "t15", projectId: "p4", name: "Legacy Code Audit", duration: 8, startDate: "2026-07-10", completed: true, owner: "Charlie", dependsOn: [], risk: "low" },
  { id: "t16", projectId: "p4", name: "Service Decomposition", duration: 22, startDate: "2026-07-18", completed: false, owner: "Bob", dependsOn: ["t15"], risk: "medium" },
  { id: "t17", projectId: "p4", name: "API Testing", duration: 6, startDate: null, completed: false, owner: "Charlie", dependsOn: ["t16"], risk: "medium" },
  { id: "t18", projectId: "p4", name: "Deployment", duration: 3, startDate: null, completed: false, owner: "Bob", dependsOn: ["t17"], risk: "high" },
  { id: "t19", projectId: "p6", name: "Requirements Gathering", duration: 4, startDate: "2026-08-05", completed: true, owner: "Diana", dependsOn: [], risk: "low" },
  { id: "t20", projectId: "p6", name: "Data Pipeline", duration: 15, startDate: "2026-08-09", completed: false, owner: "Charlie", dependsOn: ["t19"], risk: "medium" },
  { id: "t21", projectId: "p6", name: "Dashboard UI", duration: 14, startDate: "2026-08-10", completed: false, owner: "Diana", dependsOn: ["t19"], risk: "low" },
  { id: "t22", projectId: "p6", name: "Real-time Streaming", duration: 18, startDate: null, completed: false, owner: "Charlie", dependsOn: ["t20"], risk: "high" },
  { id: "t23", projectId: "p6", name: "Predictive Models", duration: 10, startDate: "2026-08-24", completed: false, owner: "Diana", dependsOn: ["t21"], risk: "medium" },
  { id: "t24", projectId: "p6", name: "Integration Testing", duration: 5, startDate: null, completed: false, owner: "Charlie", dependsOn: ["t22", "t23"], risk: "high" },
];

// Simulated progress for tasks not yet completed (for realistic demo)
const taskProgress = {
  "t3": 60,   // 60% done
  "t4": 0,    // not started due to dependency
  "t5": 30,   // 30% done
  "t12": 45,
  "t13": 75,
  "t16": 40,
  "t17": 0,
  "t20": 55,
  "t21": 80,
  "t22": 0,
  "t23": 25,
  "t24": 0,
};

export { projects, tasks, taskProgress, teamMemberCapacity };
