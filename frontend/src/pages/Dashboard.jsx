import React, { useState, useEffect } from "react";
import { 
  CheckSquare, 
  Clock, 
  Award, 
  Lightbulb, 
  Calendar,
  AlertCircle,
  TrendingUp,
  ArrowRight
} from "lucide-react";

export default function Dashboard({ setCurrentPage }) {
  const [plannerData, setPlannerData] = useState(null);
  const [completedTaskIds, setCompletedTaskIds] = useState([]);
  const [stats, setStats] = useState({
    studyHours: 0,
    completedTasksCount: 0,
    totalTasksCount: 0,
    quizScoreAverage: 82,
    recommendedProjects: 0
  });

  useEffect(() => {
    // Load planner data from localstorage
    const storedPlan = localStorage.getItem("active_study_plan");
    const completedTasks = localStorage.getItem("completed_study_tasks");
    const storedProjects = localStorage.getItem("saved_projects_count");
    const storedQuizzes = localStorage.getItem("quiz_scores");

    let parsedPlan = null;
    let parsedCompleted = [];
    
    if (storedPlan) {
      try {
        parsedPlan = JSON.parse(storedPlan);
        setPlannerData(parsedPlan);
      } catch (e) {}
    }

    if (completedTasks) {
      try {
        parsedCompleted = JSON.parse(completedTasks);
        setCompletedTaskIds(parsedCompleted);
      } catch (e) {}
    }

    // Process statistics
    let totalTasks = 0;
    let completedCount = parsedCompleted.length;
    let hours = 0;

    if (parsedPlan && parsedPlan.weekly_schedule) {
      parsedPlan.weekly_schedule.forEach(week => {
        if (week.days) {
          week.days.forEach(day => {
            totalTasks += 1;
            if (parsedCompleted.includes(`${week.week_number}-${day.day_name}`)) {
              hours += day.duration_hours;
            }
          });
        }
      });
    } else {
      // Sample defaults if empty
      totalTasks = 12;
      completedCount = 4;
      hours = 12.5;
    }

    let avgQuiz = 82;
    if (storedQuizzes) {
      try {
        const scores = JSON.parse(storedQuizzes);
        if (scores.length > 0) {
          avgQuiz = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        }
      } catch (e) {}
    }

    setStats({
      studyHours: parseFloat(hours.toFixed(1)),
      completedTasksCount: completedCount,
      totalTasksCount: totalTasks,
      quizScoreAverage: avgQuiz,
      recommendedProjects: storedProjects ? parseInt(storedProjects, 10) : 1
    });

  }, []);

  // Filter tasks to show today's agenda (or a list of pending tasks)
  const getPendingAgenda = () => {
    if (!plannerData || !plannerData.weekly_schedule) return [];
    
    const list = [];
    plannerData.weekly_schedule.forEach(week => {
      week.days.forEach(day => {
        const taskId = `${week.week_number}-${day.day_name}`;
        const isDone = completedTaskIds.includes(taskId);
        if (!isDone) {
          list.push({
            id: taskId,
            weekNum: week.week_number,
            dayName: day.day_name,
            topic: day.topic,
            activity: day.activities[0] || "Study core concepts",
            priority: day.priority
          });
        }
      });
    });
    return list.slice(0, 4); // limit to 4 items
  };

  const pendingAgenda = getPendingAgenda();
  const completionPercentage = stats.totalTasksCount > 0 
    ? Math.round((stats.completedTasksCount / stats.totalTasksCount) * 100) 
    : 0;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Stats Widgets */}
      <section className="grid gap-6 grid-cols-2 lg:grid-cols-4">
        {/* Hours Studied */}
        <div className="glass-card rounded-2xl border p-5 flex items-center gap-4 bg-bg-card">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Hours Studied</p>
            <h3 className="text-xl font-bold text-text-primary">{stats.studyHours}h</h3>
            <p className="text-[10px] text-text-secondary">Logged from planner</p>
          </div>
        </div>

        {/* Tasks Checklist */}
        <div className="glass-card rounded-2xl border p-5 flex items-center gap-4 bg-bg-card">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success">
            <CheckSquare className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Tasks Complete</p>
            <h3 className="text-xl font-bold text-text-primary">{stats.completedTasksCount}/{stats.totalTasksCount}</h3>
            <p className="text-[10px] text-text-secondary">{completionPercentage}% progress rate</p>
          </div>
        </div>

        {/* Quiz Avg */}
        <div className="glass-card rounded-2xl border p-5 flex items-center gap-4 bg-bg-card">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Quiz Score Avg</p>
            <h3 className="text-xl font-bold text-text-primary">{stats.quizScoreAverage}%</h3>
            <p className="text-[10px] text-text-secondary">Based on mock tests</p>
          </div>
        </div>

        {/* Saved Projects */}
        <div className="glass-card rounded-2xl border p-5 flex items-center gap-4 bg-bg-card">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10 text-warning">
            <Lightbulb className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Suggested Projects</p>
            <h3 className="text-xl font-bold text-text-primary">{stats.recommendedProjects}</h3>
            <p className="text-[10px] text-text-secondary">Active in portfolio</p>
          </div>
        </div>
      </section>

      {/* Grid Layout for Graphs & Agenda */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* SVG Performance Chart */}
        <div className="glass-card lg:col-span-2 rounded-2xl border p-6 bg-bg-card flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4">
            <div>
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                <TrendingUp className="h-4.5 w-4.5 text-primary" />
                Weekly Performance Activity
              </h3>
              <p className="text-[10px] text-text-muted">Visualizing learning intensity (target hours vs completed)</p>
            </div>
            <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-1 rounded">Last 4 Weeks</span>
          </div>

          {/* SVG Chart */}
          <div className="w-full h-48 flex items-end justify-center py-2">
            <svg viewBox="0 0 400 150" className="w-full h-full">
              {/* Grid Lines */}
              <line x1="0" y1="30" x2="400" y2="30" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              <line x1="0" y1="75" x2="400" y2="75" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              <line x1="0" y1="120" x2="400" y2="120" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

              {/* Weekly columns bars */}
              {/* Week 1 */}
              <rect x="50" y="50" width="24" height="70" rx="3" fill="url(#primaryGrad)" opacity="0.8" />
              <rect x="50" y="80" width="24" height="40" rx="3" fill="#10b981" />
              
              {/* Week 2 */}
              <rect x="140" y="30" width="24" height="90" rx="3" fill="url(#primaryGrad)" opacity="0.8" />
              <rect x="140" y="60" width="24" height="60" rx="3" fill="#10b981" />

              {/* Week 3 */}
              <rect x="230" y="40" width="24" height="80" rx="3" fill="url(#primaryGrad)" opacity="0.8" />
              <rect x="230" y="90" width="24" height="30" rx="3" fill="#10b981" />

              {/* Week 4 */}
              <rect x="320" y="20" width="24" height="100" rx="3" fill="url(#primaryGrad)" opacity="0.8" />
              {plannerData ? (
                <rect x="320" y="120 - stats.completedTasksCount * 5" width="24" height={stats.completedTasksCount * 5} rx="3" fill="#10b981" />
              ) : (
                <rect x="320" y="45" width="24" height="75" rx="3" fill="#10b981" />
              )}

              {/* X Axis Labels */}
              <text x="62" y="140" fill="#64748b" fontSize="10" textAnchor="middle">Week 1</text>
              <text x="152" y="140" fill="#64748b" fontSize="10" textAnchor="middle">Week 2</text>
              <text x="242" y="140" fill="#64748b" fontSize="10" textAnchor="middle">Week 3</text>
              <text x="332" y="140" fill="#64748b" fontSize="10" textAnchor="middle">Week 4</text>

              {/* Gradients */}
              <defs>
                <linearGradient id="primaryGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="flex gap-4 justify-center text-[10px] text-text-secondary pt-3 border-t border-border-card/20">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-primary"></span>
              Assigned Tasks Target
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-success"></span>
              Completed Tasks
            </span>
          </div>
        </div>

        {/* Agenda / Upcoming study tasks */}
        <div className="glass-card rounded-2xl border p-6 bg-bg-card flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border-card/30">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                <Calendar className="h-4.5 w-4.5 text-secondary" />
                Next Up Agenda
              </h3>
              <span className="text-[10px] text-text-muted">{pendingAgenda.length} tasks pending</span>
            </div>

            {pendingAgenda.length > 0 ? (
              <div className="space-y-3">
                {pendingAgenda.map((item, idx) => (
                  <div key={idx} className="bg-bg-dark/40 border border-border-card p-3 rounded-xl flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-bold text-secondary uppercase tracking-wider">Week {item.weekNum} - {item.dayName}</span>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                        item.priority === "High" ? "bg-accent/10 text-accent" : "bg-warning/10 text-warning"
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-text-primary truncate">{item.topic}</h4>
                    <p className="text-[10px] text-text-secondary line-clamp-1">{item.activity}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
                <AlertCircle className="h-8 w-8 text-text-muted" />
                <div>
                  <p className="text-xs font-bold text-text-secondary">No active study plan loaded</p>
                  <p className="text-[10px] text-text-muted max-w-[200px]">Use the study planner agent to map out schedules.</p>
                </div>
                <button
                  onClick={() => setCurrentPage("planner")}
                  className="flex items-center gap-1 text-[10px] font-bold text-primary hover:text-primary-hover border border-primary/20 px-3 py-1.5 rounded-lg bg-primary/5 transition cursor-pointer"
                >
                  Create Plan Now
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
          
          {plannerData && (
            <button
              onClick={() => setCurrentPage("planner")}
              className="w-full text-center text-xs font-bold text-text-secondary hover:text-text-primary py-2.5 mt-4 border-t border-border-card/30"
            >
              Open Study Planner checklist
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
