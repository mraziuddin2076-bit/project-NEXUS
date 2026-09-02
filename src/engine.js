// engine.js — Pure-JS "AI" engine (NO external API). All logic runs client-side.
// Implements: Monte Carlo simulation, Critical Path Method (CPM),
// Health Scoring, Delay Detection with reasons, What-If simulation,
// Resource Clash detection, and Recovery Opportunity suggestions.

const DAY_MS = 24 * 60 * 60 * 1000;

// ------------------------------------------------------------------
// Date utilities
// ------------------------------------------------------------------
function parseDate(s) {
  if (!s) return null;
  const d = new Date(s);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function daysBetween(a, b) {
  if (!a || !b) return 0;
  return Math.round((b - a) / DAY_MS);
}

function today() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

// ------------------------------------------------------------------
// Project ordering: priority-desc, then queued-first within same priority
// ------------------------------------------------------------------
function orderByPriority(projects) {
  return [...projects].sort((a, b) => {
    const pa = a.status === "queued" ? 1000 + a.priority : a.priority;
    const pb = b.status === "queued" ? 1000 + b.priority : b.priority;
    // queued projects get a large bump so they surface above running ones at lower priority
    return pb - pa;
  });
}

// ------------------------------------------------------------------
// Critical Path Method (CPM) — forward/backward pass
// Returns task map with earliestStart, earliestFinish, latestStart, latestFinish, slack
// ------------------------------------------------------------------
function computeCriticalPath(projectTasks, taskProgress) {
  // Build task map
  const taskMap = {};
  projectTasks.forEach((t) => {
    const est = t.startDate ? parseDate(t.startDate) : null;
    taskMap[t.id] = {
      ...t,
      // Effective remaining duration based on progress
      effectiveDuration: Math.ceil((t.duration || 1) * ((100 - (taskProgress[t.id] || 0)) / 100)),
      est: est, // earliest start time (from data or computed)
      eft: null, // earliest finish
      lst: null, // latest start
      lft: null, // latest finish
      slack: 0,
    };
  });

  // Forward pass
  function forwardPass(taskId, visited = new Set()) {
    const task = taskMap[taskId];
    if (!task) return null;
    if (task.eft) return task.eft; // memoized
    if (visited.has(taskId)) return task.est; // cycle guard
    visited.add(taskId);

    let es = task.est;
    if (!es) es = today();

    for (const depId of task.dependsOn) {
      const depFinish = forwardPass(depId, visited);
      if (depFinish && depFinish > es) es = depFinish;
    }

    task.est = es;
    task.eft = addDays(es, task.effectiveDuration);
    return task.eft;
  }

  projectTasks.forEach((t) => forwardPass(t.id));

  // Project finish = max EFT
  let projectFinish = null;
  projectTasks.forEach((t) => {
    if (taskMap[t.id].eft && (!projectFinish || taskMap[t.id].eft > projectFinish)) {
      projectFinish = taskMap[t.id].eft;
    }
  });

  if (!projectFinish) return { taskMap, projectFinish: null, criticalPath: [] };

  // Backward pass
  function backwardPass(taskId, projFinish, visited = new Set()) {
    const task = taskMap[taskId];
    if (task.lft) return task.lft;
    if (visited.has(taskId)) return projFinish;
    visited.add(taskId);

    if (task.eft && daysBetween(task.eft, projFinish) <= 1) {
      // Task is on the final leg
      task.lft = projFinish;
      task.lst = addDays(task.eft, -task.effectiveDuration);
    } else {
      // Find successors
      const successors = projectTasks.filter((t2) => t2.dependsOn.includes(taskId));
      let lf = projFinish;
      successors.forEach((s) => {
        const succLST = backwardPass(s.id, projFinish, visited);
        if (succLST && succLST < lf) lf = succLST;
      });
      task.lft = lf;
      task.lst = addDays(lf, -task.effectiveDuration);
    }
    return task.lft;
  }

  projectTasks.forEach((t) => backwardPass(t.id, projectFinish));

  // Slack
  let criticalPath = [];
  projectTasks.forEach((t) => {
    const task = taskMap[t.id];
    task.slack = daysBetween(task.est, task.lst);
    if (task.slack === 0) criticalPath.push(task.id);
  });

  return { taskMap, projectFinish, criticalPath };
}

// ------------------------------------------------------------------
// Monte Carlo Simulation — run 1000 trials with randomized durations
// Returns distribution of project completion dates
// ------------------------------------------------------------------
function monteCarloSimulation(projectTasks, taskProgress, numTrials = 1000) {
  if (!projectTasks || projectTasks.length === 0) {
    return { p50: null, p80: null, p95: null, distribution: [] };
  }

  const finishDates = [];

  for (let trial = 0; trial < numTrials; trial++) {
    // Randomize durations ±30% with triangular distribution centered on estimate
    const trialTasks = projectTasks.map((t) => {
      const baseDur = t.effectiveDuration || t.duration || 1;
      const randomFactor = 0.7 + Math.random() * 0.6; // 0.7x to 1.3x
      return {
        ...t,
        simDuration: Math.max(1, Math.round(baseDur * randomFactor)),
      };
    });

    const taskMap = {};
    trialTasks.forEach((t) => {
      taskMap[t.id] = { ...t, eft: null };
    });

    function computeEF(tId, visited = new Set()) {
      const t = taskMap[tId];
      if (!t) return null;
      if (t.eft) return t.eft;
      if (visited.has(tId)) return parseDate(t.startDate) || today();
      visited.add(tId);

      let es = parseDate(t.startDate) || today();
      for (const depId of t.dependsOn) {
        const depFinish = computeEF(depId, visited);
        if (depFinish && depFinish > es) es = depFinish;
      }
      t.eft = addDays(es, t.simDuration);
      return t.eft;
    }

    let trialFinish = null;
    trialTasks.forEach((t) => {
      const ef = computeEF(t.id);
      if (ef && (!trialFinish || ef > trialFinish)) trialFinish = ef;
    });

    if (trialFinish) finishDates.push(trialFinish);
  }

  if (finishDates.length === 0) return { p50: null, p80: null, p95: null, distribution: [] };

  finishDates.sort((a, b) => a - b);

  const p50 = finishDates[Math.floor(finishDates.length * 0.5)];
  const p80 = finishDates[Math.floor(finishDates.length * 0.8)];
  const p95 = finishDates[Math.floor(finishDates.length * 0.95)];

  return { p50, p80, p95, distribution: finishDates };
}

// ------------------------------------------------------------------
// Project Health Score (0-100)
// ------------------------------------------------------------------
function computeHealthScore(project, projectTasks, taskProgress, simulation) {
  let score = 100;

  // Budget factor
  const { total, spent } = project.budget || { total: 0, spent: 0 };
  if (total > 0) {
    const burnRate = spent / total;
    if (burnRate > 0.9) score -= 15;
    else if (burnRate > 0.7) score -= 8;
    else if (burnRate < 0.3 && project.status === "running") score -= 5;
  }

  // Deadline proximity & simulation confidence
  const deadline = parseDate(project.deadline);
  const now = today();
  if (deadline && simulation.p95) {
    const bufferDays = daysBetween(now, simulation.p95) - daysBetween(now, deadline);
    if (bufferDays < 0) {
      score -= Math.min(30, Math.abs(bufferDays) * 2);
    } else if (bufferDays > 30) {
      score += 5;
    }
  } else if (deadline) {
    const daysLeft = daysBetween(now, deadline);
    if (daysLeft < 0) score -= 20;
    else if (daysLeft < 14) score -= 10;
  }

  // Completion velocity
  const totalTasks = projectTasks.length;
  const completedTasks = projectTasks.filter((t) => t.completed).length;
  if (totalTasks > 0) {
    const pct = (completedTasks / totalTasks) * 100;
    // If less than 30% done but more than 50% of time elapsed → penalty
    const startDate = parseDate(project.startDate);
    const deadline = parseDate(project.deadline);
    if (startDate && deadline) {
      const elapsed = daysBetween(startDate, now);
      const totalSpan = daysBetween(startDate, deadline);
      if (totalSpan > 0) {
        const timeElapsedPct = (elapsed / totalSpan) * 100;
        if (pct < 0.3 && timeElapsedPct > 50) score -= 15;
        else if (pct < timeElapsedPct - 10) score -= 8;
      }
    }
  }

  // Risk tasks
  const highRiskTasks = projectTasks.filter((t) => t.risk === "high" && !t.completed).length;
  score -= highRiskTasks * 5;

  return Math.max(0, Math.min(100, Math.round(score)));
}

// ------------------------------------------------------------------
// Delay Detection — identifies delays and reasons
// ------------------------------------------------------------------
function detectDelays(project, projectTasks, taskProgress, simulation) {
  const reasons = [];
  const deadline = parseDate(project.deadline);
  const now = today();

  if (!deadline) return { isDelayed: false, reasons: [] };

  // Check simulation — if p80 exceeds deadline
  if (simulation.p80 && simulation.p80 > deadline) {
    const daysOver = daysBetween(deadline, simulation.p80);
    reasons.push(
      `Monte Carlo predicts ${daysOver} day(s) delay based on task uncertainty`
    );
  }

  // Check critical path tasks that are stuck/not started
  const { criticalPath } = computeCriticalPath(projectTasks, taskProgress);
  const stalledCritical = projectTasks.filter(
    (t) => criticalPath.includes(t.id) && !t.completed && (taskProgress[t.id] || 0) < 30
  );

  stalledCritical.forEach((t) => {
    reasons.push(
      `Task "${t.name}" on critical path is only ${taskProgress[t.id] || 0}% complete`
    );
  });

  // Check overallocated team members on this project
  const overallocated = detectResourceClashes(projectTasks, taskProgress);
  overallocated.forEach((member) => {
    if (member.projects.includes(project.id)) {
      reasons.push(
        `Team member ${member.name} is overallocated (${member.utilization}% across ${member.projects.length} project(s))`
      );
    }
  });

  // Check if any dependency is blocking
  const blockedTasks = projectTasks.filter(
    (t) => !t.completed && t.dependsOn.some((depId) => {
      const dep = projectTasks.find((dt) => dt.id === depId);
      return dep && !dep.completed;
    })
  );
  if (blockedTasks.length > 0) {
    reasons.push(`${blockedTasks.length} task(s) blocked by incomplete dependencies`);
  }

  const isDelayed = simulation.p80 && simulation.p80 > deadline;

  return { isDelayed, reasons: reasons.slice(0, 4) }; // Top 4 reasons
}

// ------------------------------------------------------------------
// Resource Clash Detection — across ALL projects
// ------------------------------------------------------------------
function detectResourceClashes(allTasks, taskProgress) {
  // Aggregate workload per team member across all projects
  const memberWork = {};
  allTasks.forEach((t) => {
    if (t.owner && !t.completed) {
      if (!memberWork[t.owner]) memberWork[t.owner] = { name: t.owner, tasks: [], projects: new Set() };
      memberWork[t.owner].tasks.push(t);
      memberWork[t.owner].projects.add(t.projectId);
    }
  });

  const clashes = [];
  Object.values(memberWork).forEach((m) => {
    const totalEffort = m.tasks.reduce((sum, t) => sum + (t.duration || 5), 0);
    // Assume 40h/week capacity; clash if total effort > 60 hours
    const utilization = Math.round((totalEffort / 60) * 100);
    if (utilization > 80) {
      clashes.push({
        name: m.name,
        utilization,
        tasks: m.tasks,
        projects: [...m.projects],
        severity: utilization > 120 ? "critical" : "warning",
      });
    }
  });

  return clashes;
}

// ------------------------------------------------------------------
// Recovery Opportunity Finder — suggest non-critical delays to free resources
// ------------------------------------------------------------------
function findRecoveryOpportunities(project, projectTasks, taskProgress, allTasks) {
  const { taskMap, criticalPath } = computeCriticalPath(projectTasks, taskProgress);
  const opportunities = [];

  // Non-critical tasks with slack → can be delayed to free resources
  projectTasks.forEach((t) => {
    const tm = taskMap[t.id];
    if (tm && tm.slack > 0 && !t.completed && t.risk !== "high") {
      opportunities.push({
        taskId: t.id,
        taskName: t.name,
        currentSlack: tm.slack,
        suggestedDelay: Math.min(tm.slack, 5),
        reason: `Task has ${tm.slack} day(s) of slack — delay by up to 5 days without impacting deadline`,
        owner: t.owner,
      });
    }
  });

  // Cross-project resource reallocation
  const clashes = detectResourceClashes(allTasks, taskProgress);
  const projectMembers = project.team || [];
  clashes.forEach((clash) => {
    if (clash.severity === "critical") {
      opportunities.push({
        type: "realloc",
        member: clash.name,
        reason: `${clash.name} is overalllocated (${clash.utilization}%). Consider redistributing tasks`,
        recommendedTask: clash.tasks[0]?.name,
      });
    }
  });

  return opportunities.slice(0, 3);
}

// ------------------------------------------------------------------
// Time-Bomb Warning — critical future dates when risks materialize
// ------------------------------------------------------------------
function computeTimeBombs(project, projectTasks, taskProgress, simulation) {
  const bombs = [];
  const deadline = parseDate(project.deadline);
  const now = today();

  if (simulation.p80 && deadline) {
    const riskDate = simulation.p80;
    const hoursToRisk = Math.max(0, Math.round((riskDate - now) / (1000 * 60 * 60)));
    bombs.push({
      label: "Critical Risk Date",
      date: riskDate.toISOString().split("T")[0],
      hoursRemaining: hoursToRisk,
      severity: "high",
      description: `By ${riskDate.toISOString().split("T")[0]}, risk of missing deadline exceeds 80%`,
    });
  }

  // Find longest critical path task nearing completion
  const { criticalPath } = computeCriticalPath(projectTasks, taskProgress);
  criticalPath.forEach((taskId) => {
    const t = projectTasks.find((pt) => pt.id === taskId);
    if (t && !t.completed) {
      const prog = taskProgress[t.id] || 0;
      if (prog > 50) {
        const remaining = Math.ceil((t.duration || 5) * ((100 - prog) / 100));
        if (remaining > 0) {
          const bombDate = addDays(now, remaining);
          bombs.push({
            label: `Task "${t.name}" Completion`,
            date: bombDate.toISOString().split("T")[0],
            hoursRemaining: remaining * 24,
            severity: prog > 80 ? "medium" : "low",
            description: `${t.name} (${prog}% complete) needs ~${remaining} more day(s)`,
          });
        }
      }
    }
  });

  return bombs;
}

// ------------------------------------------------------------------
// What-If Simulation — apply change to a task and recompute
// ------------------------------------------------------------------
function whatIfScenario(projectTasks, taskProgress, changes) {
  // Apply changes: { taskId, newDuration, newStartDate, completed }
  const modifiedTasks = projectTasks.map((t) => {
    const change = changes.find((c) => c.taskId === t.id);
    if (!change) return t;
    return {
      ...t,
      duration: change.newDuration || t.duration,
      startDate: change.newStartDate || t.startDate,
      completed: change.completed !== undefined ? change.completed : t.completed,
    };
  });

  const modifiedProgress = { ...taskProgress };
  changes.forEach((c) => {
    if (c.newProgress !== undefined) modifiedProgress[c.taskId] = c.newProgress;
  });

  // Recompute critical path + simulation
  const cp = computeCriticalPath(modifiedTasks, modifiedProgress);
  const sim = monteCarloSimulation(modifiedTasks, modifiedProgress);

  const oldSim = monteCarloSimulation(projectTasks, taskProgress);
  const oldFinish = oldSim.p80;
  const newFinish = sim.p80;

  const deltaDays = oldFinish && newFinish ? daysBetween(oldFinish, newFinish) : 0;
  const deltaHealth = ""; // caller handles this

  return {
    modifiedTasks,
    criticalPath: cp.criticalPath,
    projectFinish: cp.projectFinish,
    simulation: sim,
    estimatedCompletion: sim.p50,
    daysChange: deltaDays,
    confidence: {
      p50: formatDate(sim.p50),
      p80: formatDate(sim.p80),
      p95: formatDate(sim.p95),
    },
  };
}

// ------------------------------------------------------------------
// Format helpers
// ------------------------------------------------------------------
function formatDate(date) {
  if (!date) return "TBD";
  return date.toISOString().split("T")[0];
}

// ------------------------------------------------------------------
// Main analysis function — processes ALL projects and returns full state
// ------------------------------------------------------------------
function analyzeAllProjects(projects, tasks, taskProgress) {
  const results = [];

  projects.forEach((project) => {
    // Get tasks for this project
    let projectTasks = tasks.filter((t) => t.projectId === project.id);

    // If project has no explicit tasks yet (queued/on-hold), generate placeholder tasks
    if (projectTasks.length === 0) {
      projectTasks = generatePlaceholderTasks(project);
    }

    const progressMap = {};
    projectTasks.forEach((t) => {
      progressMap[t.id] = taskProgress[t.id] || (t.completed ? 100 : 0);
    });

    const cp = computeCriticalPath(projectTasks, progressMap);
    const simulation = monteCarloSimulation(projectTasks, progressMap);
    const healthScore = computeHealthScore(project, projectTasks, progressMap, simulation);
    const delayInfo = detectDelays(project, projectTasks, progressMap, simulation);
    const timeBombs = computeTimeBombs(project, projectTasks, progressMap, simulation);
    const recoveryOpportunities = findRecoveryOpportunities(
      project,
      projectTasks,
      progressMap,
      tasks
    );

    // Completion percentage
    const completedTasks = projectTasks.filter((t) => t.completed).length;
    const completionPct =
      projectTasks.length > 0 ? Math.round((completedTasks / projectTasks.length) * 100) : 0;

    // Estimated completion date
    const estCompletion = simulation.p80 || cp.projectFinish;

    results.push({
      project,
      projectTasks,
      completionPct,
      healthScore,
      criticalPath: cp.criticalPath,
      estimatedCompletion: formatDate(estCompletion),
      estimatedCompletionDate: estCompletion,
      simulation,
      delayInfo,
      timeBombs,
      recoveryOpportunities,
      isActive: project.status === "running" || project.status === "delayed",
      queuePosition: project.status === "queued" ? computeQueuePosition(projects, project) : null,
    });
  });

  // Global resource clashes
  const resourceClashes = detectResourceClashes(tasks, taskProgress);

  // Queue ordering for queued projects
  const queuedProjects = projects.filter((p) => p.status === "queued");
  const queueOrder = orderByPriority(queuedProjects);

  return {
    projects: results,
    stats: {
      total: projects.length,
      running: projects.filter((p) => p.status === "running").length,
      queued: projects.filter((p) => p.status === "queued").length,
      completed: projects.filter((p) => p.status === "completed").length,
      delayed: projects.filter((p) => p.status === "delayed").length,
      onHold: projects.filter((p) => p.status === "on-hold").length,
    },
    resourceClashes,
    queueOrder,
    now: today(),
  };
}

function computeQueuePosition(projects, targetProject) {
  const queued = orderByPriority(projects.filter((p) => p.status === "queued"));
  return queued.findIndex((p) => p.id === targetProject.id) + 1;
}

function generatePlaceholderTasks(project) {
  // Generate generic tasks based on project description
  const genericTasks = [
    { name: "Planning & Requirements", duration: 5, risk: "low" },
    { name: "Design", duration: 7, risk: "medium" },
    { name: "Development", duration: 14, risk: "medium" },
    { name: "Testing", duration: 5, risk: "medium" },
    { name: "Deployment", duration: 2, risk: "high" },
  ];

  const startDate = parseDate(project.startDate) || today();
  return genericTasks.map((gt, i) => ({
    id: `${project.id}-t${i + 1}`,
    projectId: project.id,
    name: gt.name,
    duration: gt.duration,
    startDate: i === 0 ? formatDate(startDate) : null,
    completed: false,
    owner: project.team ? project.team[i % project.team.length] : "Unassigned",
    dependsOn: i > 0 ? [`${project.id}-t${i}`] : [],
    risk: gt.risk,
  }));
}

export {
  analyzeAllProjects,
  computeHealthScore,
  computeCriticalPath,
  monteCarloSimulation,
  detectDelays,
  detectResourceClashes,
  findRecoveryOpportunities,
  computeTimeBombs,
  whatIfScenario,
  orderByPriority,
  parseDate,
  addDays,
  daysBetween,
  today,
  formatDate,
};
