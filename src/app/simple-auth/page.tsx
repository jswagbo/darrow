'use client'

export default function SimpleAuthPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#000000', 
      color: '#ffffff', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>
        Simple Auth Test
      </h1>
      
      <div style={{ 
        backgroundColor: '#111111', 
        padding: '20px', 
        borderRadius: '8px',
        maxWidth: '400px'
      }}>
        <h2 style={{ marginBottom: '16px' }}>Sign In</h2>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            Email Address
          </label>
          <input 
            type="email" 
            placeholder="Enter your email"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#000000',
              border: '1px solid #333333',
              borderRadius: '4px',
              color: '#ffffff',
              fontSize: '16px'
            }}
          />
        </div>
        
        <button 
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#c0c0c0',
            color: '#000000',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
          onClick={() => alert('Button clicked! Basic functionality works.')}
        >
          Send Magic Link
        </button>
        
        <div style={{ marginTop: '16px', color: '#888888', fontSize: '14px' }}>
          ✅ This is a simple version without any external dependencies<br/>
          ✅ No Supabase, no service workers, no complex components<br/>
          ✅ Pure HTML/CSS/JS only
        </div>
      </div>
    </div>
  )
}