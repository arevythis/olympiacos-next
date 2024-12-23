import React, { useState } from 'react';
import { toast } from 'react-toastify';

const AddTeamModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    team_name: '',
    logo_url: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const teamData = {
      team_name: formData.team_name,
      logo_url: formData.logo_url
    };

    try {
      const response = await fetch('/api/teams/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamData),
      });

      if (response.ok) {
        toast.success('Team added successfully!');
        onClose(); // Close the modal
      } else {
        console.error('Failed to add team');
        toast.error('Failed to add team');
      }
    } catch (error) {
      console.error('Error adding team:', error);
      toast.error('Error adding team');
    }
  };

  return (
    <div className="modal fade show" id="addTeamModal" tabIndex="-1" aria-labelledby="addTeamModalLabel" aria-hidden="true" style={{ display: 'block' }}>
      <div className="modal-dialog">
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h5 className="modal-title" id="addTeamModalLabel">Add New Team</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form id="addTeamForm" onSubmit={handleSubmit}>
              {/* Team Name Input */}
              <div className="mb-3">
                <label htmlFor="team_name" className="form-label">Team Name</label>
                <input
                  type="text"
                  id="team_name"
                  name="team_name"
                  className="form-control"
                  placeholder="Enter Team Name"
                  required
                  value={formData.team_name}
                  onChange={handleChange}
                />
              </div>
              
              {/* Team Logo Input */}
              <div className="mb-3">
                <label htmlFor="logo_url" className="form-label">Team Logo (URL)</label>
                <input
                  type="text"
                  id="logo_url"
                  name="logo_url"
                  className="form-control"
                  placeholder="Enter URL of Team Logo"
                  required
                  value={formData.logo_url}
                  onChange={handleChange}
                />
              </div>
              
              {/* Submit Button */}
              <div className="text-center">
                <button type="submit" id="submitTeamBtn" className="btn btn-success">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTeamModal;