import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Dashboard({ user }) {
  const [stats, setStats] = useState({
    streak: 0,
    topicsStarted: 0,
    lessonsCompleted: 0,
    totalPoints: 0
  })
  
  const [quickActions, setQuickActions] = useState([])
  const [dailyTasks, setDailyTasks] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [showAchievements, setShowAchievements] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState('week')

  useEffect(() => {
    const savedStats = JSON.parse(localStorage.getItem('mathGeniusStats')) || {
      streak: 0,
      topicsStarted: 0,
      lessonsCompleted: 0,
      totalPoints: 0,
      lastActiveDate: new Date().toDateString()
    }

    const today = new Date().toDateString()
    if (savedStats.lastActiveDate !== today) {
      const lastActive = new Date(savedStats.lastActiveDate)
      const todayDate = new Date()
      const diffTime = Math.abs(todayDate - lastActive)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) savedStats.streak += 1
      else if (diffDays > 1) savedStats.streak = 1

      savedStats.lastActiveDate = today
    }

    setStats(savedStats)
    localStorage.setItem('mathGeniusStats', JSON.stringify(savedStats))

    const savedProgress = JSON.parse(localStorage.getItem('topicProgress')) || {}
    const actions = [
      { id: 'algebra', icon: '🧮', title: 'Algebra', description: 'Equations & Functions', path: '/topics/algebra', color: '#3B82F6' },
      { id: 'geometry', icon: '📐', title: 'Geometry', description: 'Shapes & Spaces', path: '/topics/geometry', color: '#10B981' },
      { id: 'trigonometry', icon: '📏', title: 'Trigonometry', description: 'Angles & Triangles', path: '/topics/trigonometry', color: '#8B5CF6' }
    ].map(topic => ({ ...topic, progress: savedProgress[topic.id] || 0 }))

    setQuickActions(actions)

    const savedTasks = JSON.parse(localStorage.getItem('dailyTasks')) || [
      { id: 1, task: 'Complete 1 algebra lesson', completed: false, points: 10 },
      { id: 2, task: 'Solve 3 practice problems', completed: false, points: 15 },
      { id: 3, task: 'Review previous lessons', completed: false, points: 5 }
    ]
    setDailyTasks(savedTasks)

    const savedActivity = JSON.parse(localStorage.getItem('recentActivity')) || []
    setRecentActivity(savedActivity)
  }, [])

  useEffect(() => {
    const savedProgress = JSON.parse(localStorage.getItem('topicProgress')) || {}
    const topicsStarted = Object.keys(savedProgress).length
    const lessonsCompleted = Object.values(savedProgress).reduce((sum, progress) => sum + Math.floor(progress / 20), 0)
    setStats(prev => ({ ...prev, topicsStarted, lessonsCompleted }))
  }, [])

  const handleTaskComplete = (taskId) => {
    const updatedTasks = dailyTasks.map(task => task.id === taskId ? { ...task, completed: !task.completed } : task)
    setDailyTasks(updatedTasks)
    localStorage.setItem('dailyTasks', JSON.stringify(updatedTasks))

    const task = dailyTasks.find(t => t.id === taskId)
    if (!task.completed) {
      const newStats = { ...stats, totalPoints: stats.totalPoints + task.points }
      setStats(newStats)
      localStorage.setItem('mathGeniusStats', JSON.stringify(newStats))

      const newActivity = { id: Date.now(), action: `Completed: ${task.task}`, time: 'Just now', icon: '⭐', points: task.points }
      const updatedActivity = [newActivity, ...recentActivity.slice(0, 4)]
      setRecentActivity(updatedActivity)
      localStorage.setItem('recentActivity', JSON.stringify(updatedActivity))
    }
  }

  const resetDailyTasks = () => {
    const resetTasks = dailyTasks.map(task => ({ ...task, completed: false }))
    setDailyTasks(resetTasks)
    localStorage.setItem('dailyTasks', JSON.stringify(resetTasks))
  }

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to reset all your progress?')) {
      localStorage.removeItem('mathGeniusStats')
      localStorage.removeItem('topicProgress')
      localStorage.removeItem('dailyTasks')
      localStorage.removeItem('recentActivity')
      window.location.reload()
    }
  }

  const statsDisplay = [
    { label: 'Learning Streak', value: `${stats.streak} day${stats.streak !== 1 ? 's' : ''}`, icon: '🔥', color: '#F97316', description: 'Consecutive days active' },
    { label: 'Topics Started', value: `${stats.topicsStarted}/5`, icon: '📚', color: '#3B82F6', description: 'Subjects explored' },
    { label: 'Lessons Completed', value: `${stats.lessonsCompleted}`, icon: '✅', color: '#10B981', description: 'Lessons finished' },
    { label: 'Total Points', value: `${stats.totalPoints}`, icon: '⭐', color: '#F59E0B', description: 'Points earned' }
  ]

  const achievements = [
    { id: 1, name: 'First Step', description: 'Complete your first lesson', icon: '🎯', achieved: stats.lessonsCompleted >= 1, points: 50 },
    { id: 2, name: 'Streak Master', description: '7 day learning streak', icon: '🔥', achieved: stats.streak >= 7, points: 100 },
    { id: 3, name: 'Topic Explorer', description: 'Start 3 different topics', icon: '📚', achieved: stats.topicsStarted >= 3, points: 75 },
    { id: 4, name: 'Point Collector', description: 'Earn 500 total points', icon: '⭐', achieved: stats.totalPoints >= 500, points: 150 }
  ]

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const completedTasksCount = dailyTasks.filter(task => task.completed).length
  const totalTasksPoints = dailyTasks.reduce((sum, task) => task.completed ? sum + task.points : sum, 0)
  const nextAchievement = achievements.find(a => !a.achieved)

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)',
      padding: 'clamp(16px, 4vw, 24px)',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      
      {/* Animated Background Orbs */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        left: '-10%',
        width: '60%',
        height: '60%',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'floatOrb 15s ease-in-out infinite',
        pointerEvents: 'none'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        right: '-10%',
        width: '60%',
        height: '60%',
        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'floatOrb 12s ease-in-out infinite reverse',
        pointerEvents: 'none'
      }}></div>

      {/* Grid Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(139, 92, 246, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(139, 92, 246, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        pointerEvents: 'none'
      }}></div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        {/* Hero Section */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(31, 27, 75, 0.95) 100%)',
          backdropFilter: 'blur(10px)',
          borderRadius: 'clamp(20px, 5vw, 28px)',
          padding: 'clamp(20px, 5vw, 32px)',
          marginBottom: 'clamp(20px, 5vw, 32px)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <h1 style={{
                fontSize: 'clamp(24px, 6vw, 36px)',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #F472B6, #A78BFA, #60A5FA)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '8px'
              }}>
                {getGreeting()}, {user?.name || 'Scholar'}! 👋
              </h1>
              <p style={{ color: '#94A3B8', fontSize: 'clamp(13px, 4vw, 16px)', marginBottom: '24px' }}>
                Stay consistent. Build momentum. Master mathematics one lesson at a time.
              </p>
              
              {/* Progress Card */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.8)',
                borderRadius: '16px',
                padding: '16px',
                maxWidth: '100%',
                border: '1px solid rgba(139, 92, 246, 0.2)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'clamp(12px, 3.5vw, 14px)', marginBottom: '8px', color: '#CBD5E1' }}>
                  <span>📊 Daily Progress</span>
                  <span>{completedTasksCount}/{dailyTasks.length} tasks</span>
                </div>
                <div style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '9999px',
                  height: '8px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(completedTasksCount / dailyTasks.length) * 100}%`,
                    background: 'linear-gradient(90deg, #8B5CF6, #EC4899)',
                    height: '100%',
                    borderRadius: '9999px',
                    transition: 'width 0.7s ease-out'
                  }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: 'clamp(10px, 3vw, 12px)' }}>
                  <span style={{ color: '#CBD5E1' }}>✨ +{totalTasksPoints} XP today</span>
                  <button 
                    onClick={resetDailyTasks}
                    style={{
                      color: '#94A3B8',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 'clamp(10px, 3vw, 12px)',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#E2E8F0'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}
                  >
                    🔄 Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Next Achievement Badge */}
            {nextAchievement && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))',
                borderRadius: '16px',
                padding: '16px',
                minWidth: '200px',
                border: '1px solid rgba(139, 92, 246, 0.3)'
              }}>
                <div style={{ fontSize: '12px', color: '#A78BFA', marginBottom: '8px' }}>🎯 Next Achievement</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '28px' }}>{nextAchievement.icon}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>{nextAchievement.name}</div>
                    <div style={{ fontSize: '10px', color: '#94A3B8' }}>{nextAchievement.description}</div>
                    <div style={{ fontSize: '10px', color: '#F59E0B', marginTop: '4px' }}>+{nextAchievement.points} XP</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid - Responsive */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'clamp(12px, 3vw, 16px)',
          marginBottom: 'clamp(20px, 5vw, 32px)'
        }}>
          {statsDisplay.map((stat, index) => (
            <div key={index} style={{
              background: 'rgba(30, 41, 59, 0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: 'clamp(14px, 4vw, 20px)',
              padding: 'clamp(16px, 4vw, 20px)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 20px 25px -12px rgba(0, 0, 0, 0.3)';
              e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.2)';
            }}>
              <div style={{ fontSize: 'clamp(28px, 7vw, 36px)', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{ fontSize: 'clamp(22px, 6vw, 28px)', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ fontSize: 'clamp(11px, 3vw, 13px)', color: '#94A3B8', marginBottom: '4px' }}>{stat.label}</div>
              <div style={{ fontSize: 'clamp(9px, 2.5vw, 11px)', color: '#64748B' }}>{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Main Grid - Responsive */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'clamp(16px, 4vw, 24px)'
        }}>
          
          {/* Continue Learning Section */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: 'clamp(20px, 5vw, 24px)',
            padding: 'clamp(20px, 5vw, 24px)',
            border: '1px solid rgba(139, 92, 246, 0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <h2 style={{ fontSize: 'clamp(18px, 5vw, 20px)', fontWeight: '600', color: 'white' }}>📖 Continue Learning</h2>
              <Link to="/topics" style={{ 
                color: '#A78BFA', 
                fontSize: 'clamp(12px, 3.5vw, 14px)', 
                textDecoration: 'none',
                padding: '6px 12px',
                background: 'rgba(139, 92, 246, 0.1)',
                borderRadius: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)';
                e.currentTarget.style.color = '#C4B5FD';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
                e.currentTarget.style.color = '#A78BFA';
              }}>
                Browse All Topics →
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {quickActions.map((topic, index) => (
                <Link key={index} to={topic.path} style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: 'clamp(12px, 4vw, 16px)',
                    background: 'rgba(15, 23, 42, 0.6)',
                    borderRadius: 'clamp(14px, 4vw, 16px)',
                    border: '1px solid rgba(139, 92, 246, 0.15)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                    e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(15, 23, 42, 0.6)';
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.15)';
                  }}>
                    <div style={{
                      width: 'clamp(48px, 12vw, 56px)',
                      height: 'clamp(48px, 12vw, 56px)',
                      background: `linear-gradient(135deg, ${topic.color}20, ${topic.color}40)`,
                      borderRadius: 'clamp(12px, 3vw, 16px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 'clamp(24px, 6vw, 28px)'
                    }}>
                      {topic.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: '150px' }}>
                      <h3 style={{ fontWeight: '600', color: 'white', marginBottom: '4px', fontSize: 'clamp(14px, 4vw, 16px)' }}>{topic.title}</h3>
                      <p style={{ fontSize: 'clamp(11px, 3vw, 12px)', color: '#94A3B8', marginBottom: '8px' }}>{topic.description}</p>
                      <div style={{ width: '100%', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '9999px', height: '4px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${topic.progress}%`,
                          background: `linear-gradient(90deg, ${topic.color}, ${topic.color}CC)`,
                          height: '100%',
                          borderRadius: '9999px',
                          transition: 'width 0.5s'
                        }}></div>
                      </div>
                      <p style={{ fontSize: 'clamp(9px, 2.5vw, 10px)', color: '#64748B', marginTop: '4px' }}>{topic.progress}% completed</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Daily Tasks & Activity Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 4vw, 24px)' }}>
            {/* Daily Tasks */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(31, 27, 75, 0.95) 100%)',
              backdropFilter: 'blur(10px)',
              borderRadius: 'clamp(20px, 5vw, 24px)',
              padding: 'clamp(20px, 5vw, 24px)',
              border: '1px solid rgba(236, 72, 153, 0.3)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <h3 style={{ fontSize: 'clamp(16px, 4.5vw, 18px)', fontWeight: '600', color: 'white' }}>🎯 Today's Goals</h3>
                <span style={{ fontSize: 'clamp(11px, 3vw, 12px)', background: 'rgba(236, 72, 153, 0.2)', padding: '4px 12px', borderRadius: '9999px', color: '#F472B6' }}>
                  {completedTasksCount}/{dailyTasks.length} Complete
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {dailyTasks.map((task) => (
                  <div 
                    key={task.id} 
                    onClick={() => handleTaskComplete(task.id)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 'clamp(10px, 3vw, 12px)',
                      background: task.completed ? 'rgba(30, 41, 59, 0.6)' : 'rgba(15, 23, 42, 0.6)',
                      borderRadius: '12px',
                      border: '1px solid rgba(139, 92, 246, 0.15)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      opacity: task.completed ? 0.6 : 1,
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      if (!task.completed) {
                        e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)';
                        e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!task.completed) {
                        e.currentTarget.style.background = 'rgba(15, 23, 42, 0.6)';
                        e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.15)';
                      }
                    }}>
                    <span style={{
                      fontSize: 'clamp(12px, 3.5vw, 14px)',
                      color: task.completed ? '#94A3B8' : 'white',
                      textDecoration: task.completed ? 'line-through' : 'none',
                      flex: 1
                    }}>
                      {task.task}
                    </span>
                    <span style={{ fontSize: 'clamp(10px, 3vw, 11px)', background: 'rgba(139, 92, 246, 0.2)', padding: '4px 8px', borderRadius: '8px', color: '#C4B5FD' }}>
                      +{task.points} XP
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: 'clamp(20px, 5vw, 24px)',
              padding: 'clamp(20px, 5vw, 24px)',
              border: '1px solid rgba(139, 92, 246, 0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <h3 style={{ fontWeight: '600', color: 'white', fontSize: 'clamp(16px, 4.5vw, 18px)' }}>⏱️ Recent Activity</h3>
                {recentActivity.length > 0 && (
                  <button 
                    onClick={() => { setRecentActivity([]); localStorage.setItem('recentActivity', JSON.stringify([])) }}
                    style={{ fontSize: 'clamp(10px, 3vw, 11px)', color: '#64748B', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#94A3B8'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {recentActivity.length > 0 ? recentActivity.slice(0, 5).map((activity, index) => (
                  <div key={activity.id || index} style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      background: 'rgba(139, 92, 246, 0.2)',
                      borderRadius: '9999px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px'
                    }}>
                      {activity.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 'clamp(12px, 3.5vw, 13px)', color: 'white' }}>{activity.action}</p>
                      <p style={{ fontSize: 'clamp(9px, 2.5vw, 10px)', color: '#64748B' }}>{activity.time}</p>
                    </div>
                    {activity.points && <p style={{ fontSize: 'clamp(10px, 3vw, 11px)', color: '#10B981', fontWeight: '500' }}>+{activity.points} XP</p>}
                  </div>
                )) : (
                  <div style={{ textAlign: 'center', padding: '24px' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>📊</div>
                    <p style={{ fontSize: 'clamp(12px, 3.5vw, 13px)', color: '#64748B' }}>No activity yet</p>
                    <p style={{ fontSize: 'clamp(10px, 3vw, 11px)', color: '#475569' }}>Complete tasks to see your progress!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Motivation Card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%)',
              backdropFilter: 'blur(10px)',
              borderRadius: 'clamp(20px, 5vw, 24px)',
              padding: 'clamp(20px, 5vw, 24px)',
              textAlign: 'center',
              border: '1px solid rgba(139, 92, 246, 0.3)'
            }}>
              <div style={{ fontSize: 'clamp(28px, 7vw, 32px)', marginBottom: '12px' }}>💡</div>
              <p style={{ color: '#C4B5FD', fontSize: 'clamp(12px, 3.5vw, 14px)', fontStyle: 'italic', lineHeight: '1.5' }}>
                "The only way to learn mathematics is to do mathematics."
              </p>
              <p style={{ color: '#64748B', fontSize: 'clamp(10px, 3vw, 12px)', marginTop: '12px' }}>— Paul Halmos</p>
            </div>

            {/* Reset Button */}
            <button 
              onClick={clearAllData}
              style={{
                width: '100%',
                background: 'rgba(30, 41, 59, 0.8)',
                backdropFilter: 'blur(10px)',
                color: '#F87171',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 'clamp(20px, 5vw, 24px)',
                padding: 'clamp(12px, 3.5vw, 14px)',
                fontSize: 'clamp(12px, 3.5vw, 14px)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.6)';
                e.currentTarget.style.color = '#FCA5A5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                e.currentTarget.style.color = '#F87171';
              }}
            >
              🗑️ Reset All Progress
            </button>
          </div>
        </div>
      </div>

      {/* Animation Keyframes */}
      <style>
        {`
          @keyframes floatOrb {
            0%, 100% {
              transform: translate(0, 0) scale(1);
            }
            33% {
              transform: translate(30px, -30px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
          }
        `}
      </style>
    </div>
  )
}