import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Navbar from '../components/navbar';
import LoginModal from '../components/LoginModal';
import SignupModal from '../components/SignupModal';
import AddMatchModal from '../components/AddMatchModal';
import AddTeamModal from '../components/AddTeamModal';
import { useAuth } from '../context/AuthContext';
import '../styles/teams.css';

const TeamsTable = () => {
  const [teams, setTeams] = useState([]);
  const { currentUser, setCurrentUser, logout, isLoginModalOpen, setIsLoginModalOpen } = useAuth();
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showAddMatchModal, setShowAddMatchModal] = useState(false);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);

  useEffect(() => {
    // Initialize user state from localStorage
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user && user !== 'undefined') {
      try {
        setCurrentUser(JSON.parse(user));
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('user');
      }
    } else {
      setIsLoginModalOpen(true);
    }

    fetchTeams();
  }, [setCurrentUser, setIsLoginModalOpen]);

  const fetchTeams = () => {
    axios.get('/api/teams')
      .then(response => setTeams(response.data))
      .catch(error => console.error('Error fetching teams:', error));
  };

  const deleteTeam = async (teamId) => {
    if (!teamId) {
      alert('Invalid team ID');
      return;
    }

    const confirmation = confirm("Are you sure you want to delete this team? This action cannot be undone.");

    if (confirmation) {
      try {
        const response = await axios.delete('/api/teams/delete', {
          data: { id: teamId }
        });
        if (response.status === 200) {
          alert('Team deleted successfully!');
          fetchTeams(); // Refresh the teams list
        } else {
          alert('Failed to delete team');
          console.error('Failed to delete team:', response.status);
        }
      } catch (error) {
        alert('Failed to delete team');
        console.error('Error during delete request:', error);
      }
    }
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Teams Table</title>
      </Head>
      <Navbar
        currentUser={currentUser}
        logout={logout}
        onShowLoginModal={() => setIsLoginModalOpen(true)}
        onShowAddMatchModal={() => setShowAddMatchModal(true)}
        onShowAddTeamModal={() => setShowAddTeamModal(true)}
      />

      <div className="container mt-5">
        <div className="card">
          <div className="card-body table-responsive">
            <table className="table table-striped table-hover">
              <thead className="thead-dark">
                <tr>
                  <th>Actions</th>
                  <th>Team Name</th>
                  <th>Logo</th>
                </tr>
              </thead>
              <tbody>
                {teams.map(team => (
                  <tr key={team.team_id}>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteTeam(team.team_id)}>Delete</button>
                    </td>
                    <td>{team.team_name}</td>
                    <td><img src={team.logo_url} className="team-logo" alt={`${team.team_name} logo`} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isLoginModalOpen && !currentUser && <LoginModal onClose={() => setIsLoginModalOpen(false)} showSignupModal={() => { setIsLoginModalOpen(false); setShowSignupModal(true); }} />}
      {showSignupModal && <SignupModal onClose={() => setShowSignupModal(false)} />}
      {showAddMatchModal && <AddMatchModal onClose={() => setShowAddMatchModal(false)} />}
      {showAddTeamModal && <AddTeamModal onClose={() => setShowAddTeamModal(false)} />}
    </>
  );
};

export default TeamsTable;