import React from 'react';
import PropTypes from 'prop-types';

const Table = ({ data, sortTable, deleteMatch }) => {
  return (
    <div className="matches-container">
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
          {data.map((match, index) => (
            <tr key={index}>
              <td className="text-center">
                <a href={`match.html?id=${match.id}`} className="table-link">{match.homeTeam}</a>
              </td>
              <td className="text-center">
                <a href={`match.html?id=${match.id}`} className="table-link">{match.awayTeam}</a>
              </td>
              <td className="text-center">{new Date(match.matchDate).toLocaleDateString()}</td>
              <td className="text-center">{match.homeScore}</td>
              <td className="text-center">{match.awayScore}</td>
              <td className="text-center">
                <button className="btn btn-danger btn-sm" onClick={() => deleteMatch(match.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Table.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    homeTeam: PropTypes.string.isRequired,
    awayTeam: PropTypes.string.isRequired,
    matchDate: PropTypes.string.isRequired,
    homeScore: PropTypes.number.isRequired,
    awayScore: PropTypes.number.isRequired,
  })).isRequired,
  sortTable: PropTypes.func.isRequired,
  deleteMatch: PropTypes.func.isRequired,
};

export default Table;