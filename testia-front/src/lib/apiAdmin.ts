import api from "./api";

export const adminApi = {
  getSubmissions: async () => {
    const res = await api.get("/api/v1/admin/submissions");
    return res.data;
  },

  getSubmissionDetail: async (id: string) => {
    const res = await api.get(`/api/v1/admin/submissions/${id}`);
    return res.data;
  },

  refreshEvaluation: async (assignmentId: string) => {
    const res = await api.post(`/api/v1/admin/evaluation/${assignmentId}/refresh`);
    return res.data;
  },

  generateTest: async (language: string, seniority: string) => {
    const res = await api.post(`/api/v1/tests/generate`, {
      language,
      seniority
    });
    return res.data;
  },
  assignGeneratedTest: async (payload: any) => {
    const res = await api.post("/api/v1/tests/assign", payload);
    return res.data;
  },
};
