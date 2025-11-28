import api from './api.js';

const getProfiles = (page = 0, size = 10, sort = 'type') => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sort: sort
  });
  
  return api.get(`/profiles?${params.toString()}`);
};

const getProfile = (id) => {
  return api.get(`/profiles/${id}`);
};

const getProfileByType = (type) => {
  return api.get(`/profiles/type/${type}`);
};

const createProfile = (profile) => {
  return api.post('/profiles', profile);
};

const updateProfile = (id, profile) => {
  return api.put(`/profiles/${id}`, profile);
};

const deleteProfile = (id) => {
  return api.delete(`/profiles/${id}`);
};

const profileService = {
  getProfiles,
  getProfile,
  getProfileByType,
  createProfile,
  updateProfile,
  deleteProfile,
};

export default profileService;
