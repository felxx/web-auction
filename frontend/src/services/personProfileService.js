import api from './api.js';

const getPersonProfiles = (page = 0, size = 10) => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString()
  });
  
  return api.get(`/person-profiles?${params.toString()}`);
};

const getPersonProfile = (id) => {
  return api.get(`/person-profiles/${id}`);
};

const getPersonProfilesByPerson = (personId, page = 0, size = 100) => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString()
  });
  return api.get(`/person-profiles/person/${personId}?${params.toString()}`);
};

const getPersonProfilesByProfile = (profileId) => {
  return api.get(`/person-profiles/profile/${profileId}`);
};

const createPersonProfile = (personProfile) => {
  return api.post('/person-profiles', personProfile);
};

const updatePersonProfile = (id, personProfile) => {
  return api.put(`/person-profiles/${id}`, personProfile);
};

const deletePersonProfile = (id) => {
  return api.delete(`/person-profiles/${id}`);
};

const personProfileService = {
  getPersonProfiles,
  getPersonProfile,
  getPersonProfilesByPerson,
  getPersonProfilesByProfile,
  createPersonProfile,
  updatePersonProfile,
  deletePersonProfile,
};

export default personProfileService;
