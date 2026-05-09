import React from 'react';

const MyPage = () => {
  // Logic like state or handlers would go here
  const pageTitle = "Welcome to My Page";

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>{pageTitle}</h1>
      </header>
      
      
      <main style={styles.content}>
        <p>This is a simple React component created with JSX.</p>
        <button 
          onClick={() => alert('Hello!')}
          style={styles.button}
        >
          Click Me
        </button>
          <button 
          onClick={() => alert('Hello!')}
          style={styles.button}
        >
          Click Me
        </button>
        <button 
          onClick={() => alert('Hello!')}
          style={styles.button}
        >
          Click Me
        </button>
        <button 
          onClick={() => alert('Hello!')}
          style={styles.button}
        >
          Click Me
        </button>
        <button 
          onClick={() => alert('Hello!')}
          style={styles.button}
        >
          Click Me
        </button>
         <button 
          onClick={() => alert('Hello!')}
          style={styles.button}
        >
          Click Me
        </button>
         <button 
          onClick={() => alert('Hello!')}
          style={styles.button}
        >
          Click Me
        </button>
          <button 
          onClick={() => alert('Hello!')}
          style={styles.button}
        >
          Click Me
        </button>  <button 
          onClick={() => alert('Hello!')}
          style={styles.button}
        >
          Click Me
        </button>
         <button 
          onClick={() => alert('Hello!')}
          style={styles.button}
        >
          Click Me
        </button>
         <button 
          onClick={() => alert('Hello!')}
          style={styles.button}
        >
          Click Me
        </button>
        <button 
          onClick={() => alert('Hello!')}
          style={styles.button}
        >
          Click Me
        </button>
        <button 
          onClick={() => alert('Hello!')}
          style={styles.button}
        >
          Clickmeeee
        </button>
        
        
      </main>

      <footer style={styles.footer}>
        <p>© 2026 My Awesome Site</p>
      </footer>
    </div>
  );
};

// Simple object-based styling for quick setup
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    textAlign: 'center',
    color: '#333'
  },
  header: {
    backgroundColor: '#f4f4f4',
    padding: '10px',
    borderRadius: '8px'
  },
  content: {
    margin: '20px 0'
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px'
  },
  footer: {
    marginTop: '40px',
    fontSize: '12px',
    color: '#888'
  }
};

export default MyPage;