import React, { useState } from 'react';
import { toast } from 'react-toastify';

const AddMatchModal = ({ onClose, fetchMatches }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    homeTeam: '',
    awayTeam: '',
    venue: '',
    homeTeamLogo: '',
    awayTeamLogo: '',
    matchDate: '',
    homeScore: '',
    awayScore: '',
    possessionHome: '',
    possessionAway: '',
    passesHome: '',
    passesAway: '',
    foulsHome: '',
    foulsAway: '',
    scorers: [{ player_name: '', team: '', goal_time: '' }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleScorerChange = (index, e) => {
    const { name, value } = e.target;
    const newScorers = formData.scorers.map((scorer, i) =>
      i === index ? { ...scorer, [name]: value } : scorer
    );
    setFormData({ ...formData, scorers: newScorers });
  };

  const handleAddScorer = () => {
    setFormData({
      ...formData,
      scorers: [...formData.scorers, { player_name: '', team: '', goal_time: '' }],
    });
  };

  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const matchData = {
      home_team: formData.homeTeam,
      away_team: formData.awayTeam,
      match_date: formData.matchDate,
      home_score: formData.homeScore,
      away_score: formData.awayScore,
      venue: formData.venue,
      home_team_logo: formData.homeTeamLogo,
      away_team_logo: formData.awayTeamLogo,
      possession_home: formData.possessionHome,
      possession_away: formData.possessionAway,
      passes_home: formData.passesHome,
      passes_away: formData.passesAway,
      fouls_home: formData.foulsHome,
      fouls_away: formData.foulsAway,
      scorers: formData.scorers,
    };

    try {
      const response = await fetch('/api/matches/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(matchData),
      });

      if (response.ok) {
        toast.success('Match added successfully!');
        fetchMatches(); // Refresh the matches list
        onClose(); // Close the modal on successful submission
      } else {
        console.error('Failed to submit match data');
        toast.error('Failed to submit match data');
      }
    } catch (error) {
      console.error('Error submitting match data:', error);
      toast.error('Error submitting match data');
    }
  };

  return (
    <div className="modal fade show" role="dialog" aria-labelledby="addMatchModalLabel" aria-hidden="true" style={{ display: 'block' }}>
      <div className="modal-dialog">
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h5 className="modal-title" id="addMatchModalLabel">Add New Match</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form id="addMatchForm" onSubmit={handleSubmit}>
              {currentStep === 1 && (
                <div className="form-step active">
                  <div className="mb-3">
                    <label htmlFor="homeTeam" className="form-label">Home Team</label>
                    <input type="text" id="homeTeam" name="homeTeam" className="form-control" required value={formData.homeTeam} onChange={handleChange} />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="form-step active">
                  <div className="mb-3">
                    <label htmlFor="awayTeam" className="form-label">Away Team</label>
                    <input type="text" id="awayTeam" name="awayTeam" className="form-control" required value={formData.awayTeam} onChange={handleChange} />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="form-step active">
                  <div className="mb-3">
                    <label htmlFor="venue" className="form-label">Venue</label>
                    <input type="text" id="venue" name="venue" className="form-control" required value={formData.venue} onChange={handleChange} />
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="form-step active">
                  <div className="mb-3">
                    <label htmlFor="homeTeamLogo" className="form-label">Home Team Logo (PNG URL)</label>
                    <input type="text" id="homeTeamLogo" name="homeTeamLogo" className="form-control" required placeholder="Enter path to Home Team logo" value={formData.homeTeamLogo} onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="awayTeamLogo" className="form-label">Away Team Logo (PNG URL)</label>
                    <input type="text" id="awayTeamLogo" name="awayTeamLogo" className="form-control" required placeholder="Enter path to Away Team logo" value={formData.awayTeamLogo} onChange={handleChange} />
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="form-step active">
                  <div className="mb-3">
                    <label htmlFor="matchDate" className="form-label">Match Date</label>
                    <input type="date" id="matchDate" name="matchDate" className="form-control" required value={formData.matchDate} onChange={handleChange} />
                  </div>
                </div>
              )}

              {currentStep === 6 && (
                <div className="form-step active">
                  <div className="mb-3">
                    <label htmlFor="homeScore" className="form-label">Home Score</label>
                    <input type="number" id="homeScore" name="homeScore" className="form-control" required value={formData.homeScore} onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="awayScore" className="form-label">Away Score</label>
                    <input type="number" id="awayScore" name="awayScore" className="form-control" required value={formData.awayScore} onChange={handleChange} />
                  </div>
                </div>
              )}

              {currentStep === 7 && (
                <div className="form-step active">
                  <div className="mb-3">
                    <label htmlFor="possessionHome" className="form-label">Home Team Possession (%)</label>
                    <input type="number" id="possessionHome" name="possessionHome" className="form-control" required value={formData.possessionHome} onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="possessionAway" className="form-label">Away Team Possession (%)</label>
                    <input type="number" id="possessionAway" name="possessionAway" className="form-control" required value={formData.possessionAway} onChange={handleChange} />
                  </div>
                </div>
              )}

              {currentStep === 8 && (
                <div className="form-step active">
                  <div className="mb-3">
                    <label htmlFor="passesHome" className="form-label">Home Team Passes</label>
                    <input type="number" id="passesHome" name="passesHome" className="form-control" required value={formData.passesHome} onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="passesAway" className="form-label">Away Team Passes</label>
                    <input type="number" id="passesAway" name="passesAway" className="form-control" required value={formData.passesAway} onChange={handleChange} />
                  </div>
                </div>
              )}

              {currentStep === 9 && (
                <div className="form-step active">
                  <div className="mb-3">
                    <label htmlFor="foulsHome" className="form-label">Home Team Fouls</label>
                    <input type="number" id="foulsHome" name="foulsHome" className="form-control" required value={formData.foulsHome} onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="foulsAway" className="form-label">Away Team Fouls</label>
                    <input type="number" id="foulsAway" name="foulsAway" className="form-control" required value={formData.foulsAway} onChange={handleChange} />
                  </div>
                </div>
              )}

              {currentStep === 10 && (
                <div className="form-step active">
                  <div className="mb-3">
                    <label htmlFor="scorers" className="form-label">Scorers</label>
                    <div id="scorersContainer">
                      {formData.scorers.map((scorer, index) => (
                        <div key={index} className="scorer-input">
                          <input type="text" className="form-control scorer-player" name="player_name" placeholder="Player Name" value={scorer.player_name} onChange={(e) => handleScorerChange(index, e)} />
                          <input type="text" className="form-control scorer-team" name="team" placeholder="Team (Home/Away)" value={scorer.team} onChange={(e) => handleScorerChange(index, e)} />
                          <input type="text" className="form-control scorer-goal-time" name="goal_time" placeholder="Goal Time (e.g., 20')" value={scorer.goal_time} onChange={(e) => handleScorerChange(index, e)} />
                        </div>
                      ))}
                    </div>
                    <button type="button" id="addScorerBtn" className="btn btn-secondary" onClick={handleAddScorer}>Add Scorer</button>
                  </div>
                </div>
              )}

              <div className="form-navigation text-center">
                {currentStep > 1 && (
                  <button type="button" id="prevBtn" className="btn btn-secondary" onClick={handlePrevious}>Previous</button>
                )}
                {currentStep < 10 ? (
                  <button type="button" id="nextBtn" className="btn btn-primary" onClick={handleNext}>Next</button>
                ) : (
                  <button type="submit" className="btn btn-primary" id="submitBtn">Submit</button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMatchModal;