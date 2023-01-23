import { useQuery } from "react-query";
import axios from "axios";

// API calls

const getProposals = async () => {
  const res = await axios.get("/axiosMocks/proposalsData.json");
  return JSON.parse(res.data);
};

const getPendingProposals = async () => {
  const res = await axios.get("/axiosMocks/pendingProposalsData.json");
  return res.data;
};

const getNotes = async () => {
  const res = await axios.get("/axiosMocks/notesData.json");
  return res.data;
};

const getEvaluations = async () => {
  const res = await axios.get("/axiosMocks/evaluationsData.json");
  return res.data;
};

const getEvaluatedProviders = async () => {
  const res = await axios.get("/axiosMocks/evaluatedProvidersData.json");
  return res.data;
};

const getSingleProposal = async (id) => {
  const res = await axios.get("/axiosMocks/singleProposalData.json");
  return res.data;
};

const getSingleEvaluation = async (id) => {
  const res = await axios.get("/axiosMocks/singleEvaluationData.json");
  return res.data;
};

// Custom hooks

export const useProposalsQuery = () => {
  const proposalsQuery = useQuery("proposals", getProposals);
  return {
    proposals: proposalsQuery.data?.results,
    isLoadingProposals: proposalsQuery.isLoading,
    isErrorProposals: proposalsQuery.isError,
  };
};

export const usePendingProposals = () => {
  const pendingProposalsQuery = useQuery("pending-proposals", getPendingProposals);
  return {
    pendingProposals: pendingProposalsQuery.data?.results,
    isLoadingPendingProposals: pendingProposalsQuery.isLoading,
    isErrorPendingProposals: pendingProposalsQuery.isError,
  };
};

export const useNotes = () => {
  const notesQuery = useQuery("notes", getNotes);
  return {
    notes: notesQuery.data?.results,
    isLoadingNotes: notesQuery.isLoading,
    isErrorNotes: notesQuery.isError,
  };
};

export const useEvaluations = () => {
  const evaluationsQuery = useQuery("evaluations", getEvaluations);
  return {
    evaluations: evaluationsQuery.data?.results,
    isLoadingEvaluations: evaluationsQuery.isLoading,
    isErrorEvaluations: evaluationsQuery.isError,
  };
};

export const useEvaluatedProviders = () => {
  const evaluatedProvidersQuery = useQuery("evaluated-providers", getEvaluatedProviders);
  return {
    evaluatedProviders: evaluatedProvidersQuery.data?.results,
    isLoadingEvaluatedProviders: evaluatedProvidersQuery.isLoading,
    isErrorEvaluatedProviders: evaluatedProvidersQuery.isError,
  };
};

export const useSingleProposal = (id) => {
  const singleProposalQuery = useQuery(["single-proposal", id], () => getSingleProposal(id));
  return {
    singleProposal: singleProposalQuery.data,
    isLoadingSingleProposal: singleProposalQuery.isLoading,
    isErrorSingleProposal: singleProposalQuery.isError,
  };
};

export const useSingleEvaluation = (id) => {
  const singleEvaluationQuery = useQuery(["single-evaluation", id], () => getSingleEvaluation(id));
  return {
    singleEvaluation: singleEvaluationQuery.data,
    isLoadingSingleEvaluation: singleEvaluationQuery.isLoading,
    isErrorSingleEvaluation: singleEvaluationQuery.isError,
  };
};
