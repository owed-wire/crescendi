import { useState, useEffect } from 'react'
import { auth } from './firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import ParentDashboard from './components/ParentDashboard'
import ChildInterface from './components/ChildInterface'
import AuthPage from './components/AuthPage'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState('parent') // 'parent' or 'child'
  const [childProfile, setChildProfile] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setMode('parent')
      setChildProfile(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleSwitchToChild = (profile) => {
    setChildProfile(profile)
    setMode('child')
  }

  const handleSwitchToParent = () => {
    setMode('parent')
    setChildProfile(null)
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <AuthPage />
  }

  return (
    <div className="app-container">
      {mode === 'parent' ? (
        <ParentDashboard
          user={user}
          onLogout={handleLogout}
          onSwitchToChild={handleSwitchToChild}
        />
      ) : (
        <ChildInterface
          profile={childProfile}
          onBack={handleSwitchToParent}
        />
      )}
    </div>
  )
}
