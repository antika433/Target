// src/api.js
import axios from "axios";

const BASE_URL = "https://68d93cd190a75154f0d9e236.mockapi.io";

export const api = {
  getJobs: (params) => axios.get(`${BASE_URL}/jobs`, { params }),
  getJobById: (id) => axios.get(`${BASE_URL}/jobs/${id}`),
  createJob: (data) => axios.post(`${BASE_URL}/jobs`, data),
  updateJob: (id, data) => axios.put(`${BASE_URL}/jobs/${id}`, data),
  deleteJob: (id) => axios.delete(`${BASE_URL}/jobs/${id}`),

  getCandidates: (params) => axios.get(`${BASE_URL}/candidates`, { params }),
  getCandidateById: (id) => axios.get(`${BASE_URL}/candidates/${id}`),
  createCandidate: (data) => axios.post(`${BASE_URL}/candidates`, data),
  updateCandidate: (id, data) => axios.put(`${BASE_URL}/candidates/${id}`, data),
  deleteCandidate: (id) => axios.delete(`${BASE_URL}/candidates/${id}`),
};
