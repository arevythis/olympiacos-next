import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Navbar from '../components/navbar';
import LoginModal from '../components/LoginModal';
import SignupModal from '../components/SignupModal';
import AddMatchModal from '../components/AddMatchModal';
import AddTeamModal from '../components/AddTeamModal';
import { useAuth } from '../context/AuthContext';
import '../styles/home.css';
import Link from 'next/link';

const HomePage = () => {
  const [matches, setMatches] = useState([]);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showAddMatchModal, setShowAddMatchModal] = useState(false);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const { currentUser, setCurrentUser, logout, isLoginModalOpen, setIsLoginModalOpen } = useAuth();

  useEffect(() => {
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

    fetchMatches();
  }, [setCurrentUser, setIsLoginModalOpen]);

  const fetchMatches = () => {
    axios.get('/api/matches')
      .then(response => setMatches(response.data))
      .catch(error => console.error('Error fetching matches:', error));
  };

  const deleteMatch = (id) => {
    axios.delete(`/api/matches/${id}`)
      .then(response => {
        if (response.status === 200) {
          fetchMatches();
        } else {
          console.error('Failed to delete match');
        }
      })
      .catch(error => console.error('Error during delete request:', error));
  };

  const sortTable = (column, order) => {
    const sortedMatches = [...matches].sort((a, b) => {
      let compareA = a[column];
      let compareB = b[column];

      if (column === 'match_date') {
        compareA = new Date(a[column]);
        compareB = new Date(b[column]);
      }

      if (compareA < compareB) {
        return order === 'asc' ? -1 : 1;
      } else if (compareA > compareB) {
        return order === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });
    setMatches(sortedMatches);
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <title>Football Matches</title>
      </Head>
      <div className="bg-light">
        <Navbar
          logout={logout}
          onShowLoginModal={() => setIsLoginModalOpen(true)}
          onShowAddMatchModal={() => setShowAddMatchModal(true)}
          onShowAddTeamModal={() => setShowAddTeamModal(true)}
        />
        <div className="container-fluid mt-4 main-content">
          <div className="matches-container">
            <div className="table-responsive">
              <table id="matchesTable" className="table table-striped table-hover table-bordered rounded shadow">
                <thead className="table-dark sticky-top">
                  <tr>
                    <th className="text-center">
                      Home Team
                      <span id="home_team_up" className="sorting-arrow" onClick={() => sortTable('home_team', 'asc')}>&#8593;</span>
                      <span id="home_team_down" className="sorting-arrow" onClick={() => sortTable('home_team', 'desc')}>&#8595;</span>
                    </th>
                    <th className="text-center">
                      Away Team
                      <span id="away_team_up" className="sorting-arrow" onClick={() => sortTable('away_team', 'asc')}>&#8593;</span>
                      <span id="away_team_down" className="sorting-arrow" onClick={() => sortTable('away_team', 'desc')}>&#8595;</span>
                    </th>
                    <th className="text-center">
                      Match Date
                      <span id="match_date_up" className="sorting-arrow" onClick={() => sortTable('match_date', 'asc')}>&#8593;</span>
                      <span id="match_date_down" className="sorting-arrow" onClick={() => sortTable('match_date', 'desc')}>&#8595;</span>
                    </th>
                    <th className="text-center">Home Score</th>
                    <th className="text-center">Away Score</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map((match, index) => (
                    <tr key={index}>
                      <td className="text-center">
                        <Link href={`/match?id=${match.id}`} legacyBehavior>
                          <a className="table-link">{match.home_team}</a>
                        </Link>
                      </td>
                      <td className="text-center">
                        <Link href={`/match?id=${match.id}`} legacyBehavior>
                          <a className="table-link">{match.away_team}</a>
                        </Link>
                      </td>
                      <td className="text-center">{new Date(match.match_date).toLocaleDateString()}</td>
                      <td className="text-center">{match.home_score}</td>
                      <td className="text-center">{match.away_score}</td>
                      <td className="text-center">
                        <button className="btn btn-danger btn-sm" onClick={() => deleteMatch(match.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {isLoginModalOpen && !currentUser && <LoginModal onClose={() => setIsLoginModalOpen(false)} showSignupModal={() => { setIsLoginModalOpen(false); setShowSignupModal(true); }} />}
      {showSignupModal && <SignupModal onClose={() => setShowSignupModal(false)} />}
      {showAddMatchModal && <AddMatchModal onClose={() => setShowAddMatchModal(false)} fetchMatches={fetchMatches} />}
      {showAddTeamModal && <AddTeamModal onClose={() => setShowAddTeamModal(false)} />}
    </>
  );
};

export default HomePage;