import { useQuery, useMutation } from "react-query";
import axios from "axios";

const evaluationApi = axios.create({
  baseURL: "https://stroke.dev.qualityregistry.org/api/rest/evaluation/",
});
const hpfdcApi = axios.create({
  baseURL: "https://stroke.dev.qualityregistry.org/api/rest/hpfdc/",
});

// API calls

// GET REQUESTS
const getAllProviders = async (groupId) => {
  const res = await hpfdcApi.get("/providers", {
    params: {
      group: groupId,
    },
  });
  return res.data;
};

const getSingleProvider = async (id) => {
  if (!id) {
    return null;
  }
  const res = await hpfdcApi.get(`/providers/${id}`);
  return res.data;
};

const getMyself = async () => {
  const res = await hpfdcApi.get("/myself");
  return res.data;
};

const getMetrics = async () => {
  const res = await evaluationApi.get("/metrics");
  return res.data;
};

const getCriteria = async () => {
  const res = await evaluationApi.get("/criteria");
  return res.data;
};

const getTimePeriods = async () => {
  const res = await evaluationApi.get("/timeperiods");
  return res.data;
};

const getProposals = async (timePeriodId, groupId, expandString) => {
  const res = await evaluationApi.get(`/proposals`, {
    params: {
      timeperiod: timePeriodId,
      group: groupId,
      expand: expandString,
    },
  });
  return res.data;
};

const getPendingProposals = async (groupId) => {
  const res = await evaluationApi.get("/pending-proposals", {
    params: {
      group: groupId,
    },
  });
  return res.data;
};

const getNotes = async (proposalId) => {
  const res = await evaluationApi.get("/notes", {
    params: {
      proposal: proposalId,
    },
  });
  return res.data;
};

const getEvaluations = async (timePeriodId = "", providerId = "", groupId = "", expandString) => {
  const res = await evaluationApi.get(`/evaluations`, {
    params: {
      timeperiod: timePeriodId,
      provider: providerId,
      group: groupId,
      expand: expandString,
    },
  });
  return res.data;
};

const getEvaluationsPerTimePeriod = async (groupId) => {
  const res = await evaluationApi.get("/evaluations-per-time-period", {
    params: {
      group: groupId,
    },
  });
  return res.data;
};

const getSingleProposal = async (id, expandString) => {
  if (!id) {
    return null;
  }

  const res = await evaluationApi.get(`/proposals/${id}`, {
    params: {
      expand: expandString,
    },
  });
  return res.data;
};

const getSingleEvaluation = async (id, expandString) => {
  if (!id) {
    return null;
  }
  const res = await evaluationApi.get(`/evaluations/${id}`, {
    params: {
      expand: expandString,
    },
  });
  return res.data;
};

const getChecklists = async (groupId, expandString) => {
  const res = await evaluationApi.get("/checklists", {
    params: {
      group: groupId,
      expand: expandString,
    },
  });
  return res.data;
};

const getSingleChecklist = async (id, expandString) => {
  if (!id) {
    return null;
  }
  const res = await evaluationApi.get(`/checklists/${id}`, {
    params: {
      expand: expandString,
    },
  });
  return res.data;
};

// POST REQUESTS
const postNote = async ({ text, proposal }) => {
  const res = await evaluationApi.post("/notes", {
    text,
    proposal,
  });
  return res.data;
};

const postEvaluation = async ({ evaluatedLevel, proposal }) => {
  const res = await evaluationApi.post("/evaluations", {
    evaluatedLevel,
    proposal,
  });
  return res.data;
};

const postRecalculate = async (proposalId) => {
  const res = await evaluationApi.post(`/proposals/${proposalId}/recalculate`);
  return res.data;
};

// Custom hooks

export const usePostNote = (mutationOptions) => {
  const postNoteMutation = useMutation({ mutationFn: postNote, ...mutationOptions });
  return {
    postNote: postNoteMutation.mutate,
    isLoadingPostNote: postNoteMutation.isLoading,
    isErrorPostNote: postNoteMutation.isError,
  };
};

export const usePostEvaluation = (mutationOptions) => {
  const postEvaluationMutation = useMutation({ mutationFn: postEvaluation, ...mutationOptions });
  return {
    postEvaluation: postEvaluationMutation.mutate,
  };
};

export const usePostRecalculate = (mutationOptions) => {
  const postRecalculateMutation = useMutation({ mutationFn: postRecalculate, ...mutationOptions });
  return {
    postRecalculate: postRecalculateMutation.mutate,
  };
};

export const useProviders = (groupId) => {
  const providersQuery = useQuery({
    queryKey: "providers",
    queryFn: () => getAllProviders(groupId),
    staleTime: Infinity,
  });
  return {
    providers: providersQuery.data?.results || [],
    isLoadingProviders: providersQuery.isLoading,
    isErrorProviders: providersQuery.isError,
  };
};

export const useSingleProvider = (id) => {
  const singleProviderQuery = useQuery({ queryKey: ["provider", id], queryFn: () => getSingleProvider(id) });
  return {
    singleProvider: singleProviderQuery.data || {},
    isLoadingSingleProvider: singleProviderQuery.isLoading,
    isErrorSingleProvider: singleProviderQuery.isError,
  };
};

export const useMyself = () => {
  const myselfQuery = useQuery({ queryKey: "myself", queryFn: getMyself });
  return {
    myself: myselfQuery.data,
    isLoadingMyself: myselfQuery.isLoading,
    isErrorMyself: myselfQuery.isError,
  };
};

export const useMetrics = () => {
  const metricsQuery = useQuery({ queryKey: "metrics", queryFn: getMetrics, staleTime: Infinity });
  return {
    metrics: metricsQuery.data?.results,
    isLoadingMetrics: metricsQuery.isLoading,
    isErrorMetrics: metricsQuery.isError,
  };
};

export const useCriteria = () => {
  const criteriaQuery = useQuery({ queryKey: "criteria", queryFn: getCriteria, staleTime: Infinity });
  return {
    criteria: criteriaQuery.data?.results,
    isLoadingCriteria: criteriaQuery.isLoading,
    isErrorCriteria: criteriaQuery.isError,
  };
};

export const useTimePeriods = () => {
  const timePeriodsQuery = useQuery("time-periods", getTimePeriods);
  return {
    timePeriods: timePeriodsQuery.data?.results || [],
    isLoadingTimePeriods: timePeriodsQuery.isLoading,
    isErrorTimePeriods: timePeriodsQuery.isError,
  };
};

export const useProposals = (timePeriodId, groupId) => {
  const proposalsQuery = useQuery(["proposals", timePeriodId, groupId], () =>
    getProposals(timePeriodId, groupId, "criteriaProposals,metricSet")
  );
  return {
    proposals: proposalsQuery.data?.results || [],
    isLoadingProposals: proposalsQuery.isLoading,
    isErrorProposals: proposalsQuery.isError,
  };
};

export const usePendingProposals = (groupId) => {
  const pendingProposalsQuery = useQuery("pending-proposals", () => getPendingProposals(groupId));
  return {
    pendingProposals: pendingProposalsQuery.data?.results || [],
    isLoadingPendingProposals: pendingProposalsQuery.isLoading,
    isErrorPendingProposals: pendingProposalsQuery.isError,
  };
};

export const useNotes = (proposalId) => {
  const notesQuery = useQuery(["notes", proposalId], () => getNotes(proposalId));
  return {
    notes: notesQuery.data?.results || [],
    isLoadingNotes: notesQuery.isLoading,
    isErrorNotes: notesQuery.isError,
  };
};

export const useEvaluations = (timePeriodId, providerId, groupId) => {
  const evaluationsQuery = useQuery(["evaluations", timePeriodId, providerId, groupId], () =>
    getEvaluations(timePeriodId, providerId, groupId, "proposal,proposal.criteriaProposals,proposal.metricSet")
  );
  return {
    evaluations: evaluationsQuery.data?.results || [],
    isLoadingEvaluations: evaluationsQuery.isLoading,
    isErrorEvaluations: evaluationsQuery.isError,
  };
};

export const useEvaluationsPerTimePeriod = (groupId) => {
  const evaluatedProvidersQuery = useQuery(["evaluations-per-time-period", groupId], () =>
    getEvaluationsPerTimePeriod(groupId)
  );
  return {
    evaluationsPerTimePeriod: evaluatedProvidersQuery.data?.results,
    isLoadingEvaluationsPerTimePeriod: evaluatedProvidersQuery.isLoading,
    isErrorEvaluationsPerTimePeriod: evaluatedProvidersQuery.isError,
  };
};

export const useSingleProposal = (id) => {
  const singleProposalQuery = useQuery(["single-proposal", id], () =>
    getSingleProposal(id, "criteriaProposals,metricSet")
  );
  return {
    singleProposal: singleProposalQuery.data,
    isLoadingSingleProposal: singleProposalQuery.isLoading,
    isErrorSingleProposal: singleProposalQuery.isError,
  };
};

export const useSingleEvaluation = (id) => {
  const singleEvaluationQuery = useQuery(["single-evaluation", id], () =>
    getSingleEvaluation(id, "proposal,proposal.criteriaProposals,proposal.metricSet")
  );
  return {
    singleEvaluation: singleEvaluationQuery.data,
    isLoadingSingleEvaluation: singleEvaluationQuery.isLoading,
    isErrorSingleEvaluation: singleEvaluationQuery.isError,
  };
};

export const useChecklists = (groupId) => {
  const checklistsQuery = useQuery(["checklists", groupId], () => getChecklists(groupId, "criteria.metric"));
  return {
    checklists: checklistsQuery.data?.results || [],
    isLoadingChecklists: checklistsQuery.isLoading,
    isErrorChecklists: checklistsQuery.isError,
  };
};

export const useSingleChecklist = (id) => {
  const singleChecklistQuery = useQuery(["single-checklist", id], () => getSingleChecklist(id, "criteria.metric"));
  return {
    singleChecklist: singleChecklistQuery.data,
    isLoadingSingleChecklist: singleChecklistQuery.isLoading,
    isErrorSingleChecklist: singleChecklistQuery.isError,
  };
};
