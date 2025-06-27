function Dashboard({ user, setUser }) {
  function handleLogout() {
    fetch('http://localhost:5555/logout', {
      method: 'DELETE',
      credentials: 'include',
    })
      .then(() => {
        setUser(null); // Clear the user from state
      });
  }

  if (!user) {
    return <h2>You must be logged in to view this page.</h2>;
  }

  return (
    <div>
      <h1>Welcome, {user.username} 👋</h1>
      <p>Email: {user.email}</p>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
}

export default Dashboard;
