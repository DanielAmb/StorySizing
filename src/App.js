import { useEffect, useState } from "react";
import './App.css';

const API_BASE = 'https://storysizing-api-g7etekc7e4brc4ad.canadacentral-01.azurewebsites.net';

function App() {
  const [view, setView] = useState('home'); // home, team
  const [teamId, setTeamId] = useState('');
  const [userName, setUserName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [createUserName, setCreateUserName] = useState('');
  const [joinUserName, setJoinUserName] = useState('');
  const [status, setStatus] = useState({ revealed: true, voteCount: 0, totalUsers: 0, users: [], name: '', leader: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (view === 'team' && teamId) {
      fetchStatus();
      const interval = setInterval(fetchStatus, 2000);
      return () => clearInterval(interval);
    }
  }, [view, teamId]);

  useEffect(() => {
    const cleanupTeam = () => {
      if (view !== 'team' || !teamId || !userName || status?.leader !== userName) return;

      const url = `${API_BASE}/api/deleteTeam`;
      const body = JSON.stringify({ teamId, userName });

      if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: 'application/json' });
        navigator.sendBeacon(url, blob);
      } else {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, false);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(body);
      }
    };

    window.addEventListener('beforeunload', cleanupTeam);
    return () => window.removeEventListener('beforeunload', cleanupTeam);
  }, [view, teamId, userName, status]);

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/getStatus?teamId=${teamId}`);
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error);
        if (res.status === 404) {
          setView('home');
        }
        return;
      }
      setStatus(data);
    } catch (err) {
      console.error('Error fetching status:', err);
    }
  };

  const createTeam = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/createTeam`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamName, leaderName: createUserName }),
      });
      const data = await res.json();
      if (res.ok) {
        setTeamId(data.teamId);
        setUserName(createUserName);
        setView('team');
        setMessage('');
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      setMessage("API error");
    }
  };

  const joinTeam = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/joinTeam`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, userName: joinUserName }),
      });
      const data = await res.json();
      if (res.ok) {
        setUserName(joinUserName);
        setView('team');
        setMessage('');
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      setMessage("API error");
    }
  };

  const startVoting = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/startVoting`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, userName }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('');
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      setMessage("API error");
    }
  };

  const resetVotes = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/resetVotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, userName }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('');
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      setMessage("API error");
    }
  };

  const vote = async (voteValue) => {
    try {
      const res = await fetch(`${API_BASE}/api/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, userName, vote: voteValue }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('');
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      setMessage("API error");
    }
  };

  const reveal = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/reveal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, userName }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('');
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      setMessage("API error");
    }
  };

  if (view === 'home') {
    return (
      <div className="app-container">
        <h1>Sprint Story Sizing App</h1>
        <h2>Create Team</h2>
        <form onSubmit={createTeam}>
          <div className="form-group">
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Team Name"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              value={createUserName}
              onChange={(e) => setCreateUserName(e.target.value)}
              placeholder="Your Name"
              required
            />
          </div>
          <button type="submit">Create Team</button>
        </form>
        <h2>Join Team</h2>
        <form onSubmit={joinTeam}>
          <div className="form-group">
            <input
              type="text"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              placeholder="Team ID"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              value={joinUserName}
              onChange={(e) => setJoinUserName(e.target.value)}
              placeholder="Your Name"
              required
            />
          </div>
          <button type="submit">Join Team</button>
        </form>
        {message && (
          <div className="error-message">{message}</div>
        )}
      </div>
    );
  }

  if (view === 'team') {
    return (
      <div className="app-container">
        <h1>Team: {status?.name || 'Loading...'}</h1>
        <div className="user-list">
          <strong>Team Members:</strong>
          <ul>
            {status?.users?.map(user => <li key={user}>{user}</li>) || []}
          </ul>
        </div>
        {!status?.revealed && (
          <div>
            <h2>Vote</h2>
            <div className="vote-buttons">
              {[1, 2, 3, 5].map(v => (
                <button key={v} className="vote-button" onClick={() => vote(v)}>
                  {v}
                </button>
              ))}
            </div>
            <div className="status-info">
              <p>Votes: {status.voteCount}/{status.totalUsers}</p>
            </div>
          </div>
        )}
        {status?.revealed && status.voteCount === 0 && (
          <div className="status-info">
            <h2>Voting is not active yet</h2>
            <p>Click Start Voting to begin a round.</p>
          </div>
        )}
        {status?.revealed && status.voteCount > 0 && (
          <div className="results">
            <h2>Results</h2>
            <p><strong>Average:</strong> {status.average}</p>
            <p><strong>Agreement:</strong> {status.agreement}</p>
            <div className="individual-votes">
              <h3>Individual Votes</h3>
              <div className="votes-list">
                {Object.entries(status.votes).map(([user, vote]) => (
                  <div key={user} className="vote-item">
                    <span className="vote-user">{user}:</span>
                    <span className="vote-value">{vote}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {status?.leader === userName && (
          <div className="leader-actions">
            <h2>Actions</h2>
            <div className="team-info">
              <span>Team ID: <span className="team-id">{teamId}</span></span>
            </div>
            <button onClick={resetVotes}>Reset Votes</button>
            {!status?.revealed && (
              <button onClick={reveal}>Reveal Votes</button>
            )}
            {status?.revealed && (
              <button onClick={startVoting}>Start Voting</button>
            )}
          </div>
        )}
        {message && (
          <div className="error-message">{message}</div>
        )}
        <button className="back-button" onClick={() => setView('home')}>Back to Home</button>
      </div>
    );
  }

  return null;
}

export default App;