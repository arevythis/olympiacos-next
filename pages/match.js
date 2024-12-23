import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Navbar from '../components/navbar';
import LoginModal from '../components/LoginModal';
import SignupModal from '../components/SignupModal';
import AddMatchModal from '../components/AddMatchModal';
import AddTeamModal from '../components/AddTeamModal';
import { useAuth } from '../context/AuthContext';
import '../styles/match.css';

const MatchPage = () => {
  const [match, setMatch] = useState(null);
  const { currentUser, setCurrentUser, isLoginModalOpen, setIsLoginModalOpen, logout } = useAuth();
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showAddMatchModal, setShowAddMatchModal] = useState(false);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);

  useEffect(() => {
    // Initialize user state from localStorage
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user && user !== 'undefined') {
      try {
        const parsedUser = JSON.parse(user);
        setCurrentUser(parsedUser);
        console.log('User loaded from localStorage:', parsedUser);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('user');
      }
    } else {
      setIsLoginModalOpen(true);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const matchId = urlParams.get('id');

    axios.get(`/api/matches/${matchId}`)
      .then(response => {
        setMatch(response.data);
        console.log('Match details loaded:', response.data);
      })
      .catch(error => console.error('Error loading match details:', error));
  }, [setCurrentUser, setIsLoginModalOpen]);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Match Details</title>
      </Head>
      <Navbar
        currentUser={currentUser}
        logout={logout}
        onShowLoginModal={() => setIsLoginModalOpen(true)}
        onShowAddMatchModal={() => setShowAddMatchModal(true)}
        onShowAddTeamModal={() => setShowAddTeamModal(true)}
      />

      <div className="container mt-5">
        {match && (
          <>
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h5 className="card-title">Match Details</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="stat-item">
                      <span className="stat-title">Home Team:</span>
                      <span className="stat-value">
                        <img src={match.home_team_logo} alt={`${match.home_team} Logo`} className="team-logo" /> {match.home_team}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-title">Away Team:</span>
                      <span className="stat-value">
                        <img src={match.away_team_logo} alt={`${match.away_team} Logo`} className="team-logo" /> {match.away_team}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-title">Match Date:</span>
                      <span className="stat-value">{new Date(match.match_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="stat-item">
                      <span className="stat-title">Final Score:</span>
                      <span className="stat-value">{`${match.home_team} ${match.home_score} - ${match.away_score} ${match.away_team}`}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-title">Venue:</span>
                      <span className="stat-value">{match.venue}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card mt-4">
              <div className="card-header bg-info text-white">
                <h5 className="card-title">Match Statistics</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="stat-item">
                      <span className="stat-title">Possession:</span>
                      <div className="stat-value">
                        <img src={match.home_team_logo} id="homeLogo" className="team-logo" alt="Home Team Logo" />
                        <span id="possessionHome">{match.possession_home}</span> %
                        <img src={match.away_team_logo} id="awayLogo" className="team-logo" alt="Away Team Logo" />
                        <span id="possessionAway">{match.possession_away}</span> %
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="stat-item">
                      <span className="stat-title">Passes:</span>
                      <div className="stat-value">
                        <img src={match.home_team_logo} id="homeLogoPass" className="team-logo" alt="Home Team Logo" />
                        <span id="passesHome">{match.passes_home}</span>
                        <img src={match.away_team_logo} id="awayLogoPass" className="team-logo" alt="Away Team Logo" />
                        <span id="passesAway">{match.passes_away}</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="stat-item">
                      <span className="stat-title">Fouls:</span>
                      <div className="stat-value">
                        <img src={match.home_team_logo} id="homeLogoFoul" className="team-logo" alt="Home Team Logo" />
                        <span id="foulsHome">{match.fouls_home}</span>
                        <img src={match.away_team_logo} id="awayLogoFoul" className="team-logo" alt="Away Team Logo" />
                        <span id="foulsAway">{match.fouls_away}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card mt-4">
              <div className="card-header bg-success text-white">
                <h5 className="card-title">Scorers</h5>
              </div>
              <div className="card-body" id="scorers">
                {match.scorers && match.scorers.length > 0 ? (
                  match.scorers.map((scorer, index) => (
                    <div key={index} className="scorer-item">
                      <img src={scorer.team === "home" ? match.home_team_logo : match.away_team_logo} className="team-logo" alt={`${scorer.team} Team Logo`} />
                      {`${scorer.player_name} - ${scorer.goal_time} min`}
                    </div>
                  ))
                ) : (
                  <p>No scorers recorded for this match.</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {isLoginModalOpen && !currentUser && <LoginModal onClose={() => setIsLoginModalOpen(false)} showSignupModal={() => { setIsLoginModalOpen(false); setShowSignupModal(true); }} />}
      {showSignupModal && <SignupModal onClose={() => setShowSignupModal(false)} />}
      {showAddMatchModal && <AddMatchModal onClose={() => setShowAddMatchModal(false)} />}
      {showAddTeamModal && <AddTeamModal onClose={() => setShowAddTeamModal(false)} />}
    </>
  );
};

export default MatchPage;