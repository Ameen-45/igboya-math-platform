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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  // Check for mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
      { id: 'trigonometry', icon: '📏', title: 'Trigonometry', description: 'Angles & Triangles', path: '/topics/trigonometry', color: '#8B5CF6' },
      { id: 'calculus', icon: '📈', title: 'Calculus', description: 'Limits & Derivatives', path: '/topics/calculus', color: '#F59E0B' }
    ].map(topic => ({ ...topic, progress: savedProgress[topic.id] || 0 }))

    setQuickActions(actions)

    const savedTasks = JSON.parse(localStorage.getItem('dailyTasks')) || [
      { id: 1, task: 'Complete 1 lesson', completed: false, points: 10, category: 'algebra' },
      { id: 2, task: 'Solve 3 practice problems', completed: false, points: 15, category: 'geometry' },
      { id: 3, task: 'Watch a video lesson', completed: false, points: 5, category: 'trigonometry' },
      { id: 4, task: 'Review previous topics', completed: false, points: 8, category: 'review' }
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
    if (window.confirm('Are you sure you want to reset all your progress? This cannot be undone.')) {
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
      background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
      padding: isMobile ? '16px' : '24px',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      
      {/* Main Container */}
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Hero Section */}
        <div style={{
          background: 'white',
          borderRadius: isMobile ? '20px' : '24px',
          padding: isMobile ? '20px' : '28px',
          marginBottom: isMobile ? '20px' : '28px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)',
          border: '1px solid #E2E8F0'
        }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between', 
            alignItems: isMobile ? 'flex-start' : 'center', 
            gap: isMobile ? '20px' : '0'
          }}>
            <div style={{ flex: 1 }}>
              <h1 style={{
                fontSize: isMobile ? '24px' : '32px',
                fontWeight: 'bold',
                color: '#0F172A',
                marginBottom: '8px'
              }}>
                {getGreeting()}, {user?.name || 'Scholar'}! 👋
              </h1>
              <p style={{ color: '#64748B', fontSize: isMobile ? '13px' : '15px', marginBottom: '20px' }}>
                Stay consistent. Build momentum. Master mathematics one lesson at a time.
              </p>
              
              {/* Progress Card */}
              <div style={{
                background: '#F8FAFC',
                borderRadius: '16px',
                padding: '16px',
                border: '1px solid #E2E8F0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '10px', color: '#475569' }}>
                  <span>📊 Daily Progress</span>
                  <span style={{ fontWeight: '600' }}>{completedTasksCount}/{dailyTasks.length} tasks</span>
                </div>
                <div style={{
                  width: '100%',
                  background: '#E2E8F0',
                  borderRadius: '9999px',
                  height: '8px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(completedTasksCount / dailyTasks.length) * 100}%`,
                    background: 'linear-gradient(90deg, #6366F1, #8B5CF6)',
                    height: '100%',
                    borderRadius: '9999px',
                    transition: 'width 0.7s ease-out'
                  }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '12px' }}>
                  <span style={{ color: '#6366F1', fontWeight: '500' }}>✨ +{totalTasksPoints} XP today</span>
                  <button 
                    onClick={resetDailyTasks}
                    style={{
                      color: '#94A3B8',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#6366F1'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}
                  >
                    🔄 Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Next Achievement Badge - Hide on mobile */}
            {!isMobile && nextAchievement && (
              <div style={{
                background: 'linear-gradient(135deg, #EEF2FF, #F5F3FF)',
                borderRadius: '16px',
                padding: '16px',
                minWidth: '220px',
                border: '1px solid #C7D2FE'
              }}>
                <div style={{ fontSize: '12px', color: '#6366F1', marginBottom: '8px', fontWeight: '500' }}>🎯 Next Achievement</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '28px' }}>{nextAchievement.icon}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>{nextAchievement.name}</div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>{nextAchievement.description}</div>
                    <div style={{ fontSize: '11px', color: '#F59E0B', marginTop: '4px', fontWeight: '500' }}>+{nextAchievement.points} XP</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid - Mobile optimized */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: isMobile ? '12px' : '16px',
          marginBottom: isMobile ? '20px' : '28px'
        }}>
          {statsDisplay.map((stat, index) => (
            <div key={index} style={{
              background: 'white',
              borderRadius: '16px',
              padding: isMobile ? '16px' : '20px',
              border: '1px solid #E2E8F0',
              transition: 'all 0.3s ease',
              textAlign: 'center',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
              e.currentTarget.style.borderColor = '#C7D2FE';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#E2E8F0';
            }}>
              <div style={{ fontSize: isMobile ? '28px' : '32px', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: 'bold', color: '#0F172A', marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>{stat.label}</div>
              <div style={{ fontSize: '10px', color: '#94A3B8' }}>{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Main Grid - Mobile optimized (stack on mobile) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: isMobile ? '20px' : '24px'
        }}>
          
          {/* Continue Learning Section - Spans 2 columns on desktop */}
          <div style={{ gridColumn: isMobile ? '1' : 'span 2' }}>
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: isMobile ? '20px' : '24px',
              border: '1px solid #E2E8F0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <h2 style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: '600', color: '#0F172A' }}>📖 Continue Learning</h2>
                <Link to="/topics" style={{ 
                  color: '#6366F1', 
                  fontSize: '13px', 
                  textDecoration: 'none',
                  padding: '6px 12px',
                  background: '#EEF2FF',
                  borderRadius: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#C7D2FE';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#EEF2FF';
                }}>
                  Browse All Topics →
                </Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {quickActions.map((topic, index) => (
                  <Link key={index} to={topic.path} style={{ textDecoration: 'none' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: isMobile ? '12px' : '16px',
                      background: '#F8FAFC',
                      borderRadius: '14px',
                      border: '1px solid #E2E8F0',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      gap: isMobile ? '12px' : '16px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#F1F5F9';
                      e.currentTarget.style.transform = 'translateX(4px)';
                      e.currentTarget.style.borderColor = '#C7D2FE';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#F8FAFC';
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.borderColor = '#E2E8F0';
                    }}>
                      <div style={{
                        width: isMobile ? '48px' : '56px',
                        height: isMobile ? '48px' : '56px',
                        background: `linear-gradient(135deg, ${topic.color}15, ${topic.color}25)`,
                        borderRadius: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: isMobile ? '24px' : '28px'
                      }}>
                        {topic.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontWeight: '600', color: '#0F172A', marginBottom: '4px', fontSize: isMobile ? '15px' : '16px' }}>{topic.title}</h3>
                        <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '8px' }}>{topic.description}</p>
                        <div style={{ width: '100%', background: '#E2E8F0', borderRadius: '9999px', height: '4px', overflow: 'hidden' }}>
                          <div style={{
                            width: `${topic.progress}%`,
                            background: topic.color,
                            height: '100%',
                            borderRadius: '9999px',
                            transition: 'width 0.5s'
                          }}></div>
                        </div>
                        <p style={{ fontSize: '10px', color: '#94A3B8', marginTop: '4px' }}>{topic.progress}% completed</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '20px' : '24px' }}>
            {/* Daily Tasks */}
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: isMobile ? '20px' : '24px',
              border: '1px solid #E2E8F0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <h3 style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '600', color: '#0F172A' }}>🎯 Today's Goals</h3>
                <span style={{ fontSize: '12px', background: '#EEF2FF', padding: '4px 12px', borderRadius: '9999px', color: '#6366F1', fontWeight: '500' }}>
                  {completedTasksCount}/{dailyTasks.length} Complete
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {dailyTasks.map((task) => (
                  <div 
                    key={task.id} 
                    onClick={() => handleTaskComplete(task.id)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px',
                      background: task.completed ? '#F8FAFC' : '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      opacity: task.completed ? 0.7 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (!task.completed) {
                        e.currentTarget.style.background = '#F8FAFC';
                        e.currentTarget.style.borderColor = '#C7D2FE';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!task.completed) {
                        e.currentTarget.style.background = '#FFFFFF';
                        e.currentTarget.style.borderColor = '#E2E8F0';
                      }
                    }}>
                    <span style={{
                      fontSize: '13px',
                      color: task.completed ? '#94A3B8' : '#1E293B',
                      textDecoration: task.completed ? 'line-through' : 'none',
                      flex: 1
                    }}>
                      {task.task}
                    </span>
                    <span style={{ fontSize: '11px', background: '#EEF2FF', padding: '4px 8px', borderRadius: '8px', color: '#6366F1', fontWeight: '500' }}>
                      +{task.points} XP
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: isMobile ? '20px' : '24px',
              border: '1px solid #E2E8F0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <h3 style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '600', color: '#0F172A' }}>⏱️ Recent Activity</h3>
                {recentActivity.length > 0 && (
                  <button 
                    onClick={() => { setRecentActivity([]); localStorage.setItem('recentActivity', JSON.stringify([])) }}
                    style={{ fontSize: '11px', color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#6366F1'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {recentActivity.length > 0 ? recentActivity.slice(0, 5).map((activity, index) => (
                  <div key={activity.id || index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      background: '#EEF2FF',
                      borderRadius: '9999px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px'
                    }}>
                      {activity.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '13px', color: '#1E293B' }}>{activity.action}</p>
                      <p style={{ fontSize: '10px', color: '#94A3B8' }}>{activity.time}</p>
                    </div>
                    {activity.points && <p style={{ fontSize: '11px', color: '#10B981', fontWeight: '500' }}>+{activity.points} XP</p>}
                  </div>
                )) : (
                  <div style={{ textAlign: 'center', padding: '24px' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>📊</div>
                    <p style={{ fontSize: '13px', color: '#64748B' }}>No activity yet</p>
                    <p style={{ fontSize: '11px', color: '#94A3B8' }}>Complete tasks to see your progress!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Motivation Card */}
            <div style={{
              background: 'linear-gradient(135deg, #EEF2FF, #F5F3FF)',
              borderRadius: '20px',
              padding: isMobile ? '20px' : '24px',
              textAlign: 'center',
              border: '1px solid #C7D2FE'
            }}>
              <div style={{ fontSize: isMobile ? '28px' : '32px', marginBottom: '12px' }}>💡</div>
              <p style={{ color: '#1E293B', fontSize: isMobile ? '13px' : '14px', fontStyle: 'italic', lineHeight: '1.5' }}>
                "The only way to learn mathematics is to do mathematics."
              </p>
              <p style={{ color: '#64748B', fontSize: '11px', marginTop: '12px' }}>— Paul Halmos</p>
            </div>

            {/* Reset Button */}
            <button 
              onClick={clearAllData}
              style={{
                width: '100%',
                background: 'white',
                color: '#EF4444',
                border: '1px solid #FEE2E2',
                borderRadius: '20px',
                padding: isMobile ? '12px' : '14px',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#FEF2F2';
                e.currentTarget.style.borderColor = '#FECACA';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#FEE2E2';
              }}
            >
              🗑️ Reset All Progress
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}