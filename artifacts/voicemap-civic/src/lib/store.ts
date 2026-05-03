import { useState, useEffect } from "react";
import { INITIAL_REPS, INITIAL_ISSUES, INITIAL_ACCOUNTABILITY, INITIAL_SPOTLIGHT, Issue, Petition, MessageLog, Representative } from "./data";

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}

export function useStore() {
  const [reps, setReps] = useLocalStorage<Representative[]>("voicemap_reps", INITIAL_REPS);
  const [issues, setIssues] = useLocalStorage<Issue[]>("voicemap_issues", INITIAL_ISSUES);
  const [userVotes, setUserVotes] = useLocalStorage<Record<string, string>>("voicemap_votes", {});
  const [petitions, setPetitions] = useLocalStorage<Petition[]>("voicemap_petitions", []);
  const [messageLogs, setMessageLogs] = useLocalStorage<MessageLog[]>("voicemap_messages", []);
  const [accountability] = useLocalStorage("voicemap_accountability", INITIAL_ACCOUNTABILITY);
  const [spotlight] = useLocalStorage("voicemap_spotlight", INITIAL_SPOTLIGHT);

  const voteOnIssue = (issueId: string, voteType: 'support' | 'oppose' | 'unsure' | 'needs-info') => {
    const previousVote = userVotes[issueId];
    setIssues(currentIssues => {
      return currentIssues.map(issue => {
        if (issue.id === issueId) {
          const newPositions = [...issue.positions];
          if (previousVote) {
            const prevPosIndex = newPositions.findIndex(p => p.type === previousVote);
            if (prevPosIndex >= 0) newPositions[prevPosIndex].count--;
          }
          const newPosIndex = newPositions.findIndex(p => p.type === voteType);
          if (newPosIndex >= 0) {
            newPositions[newPosIndex].count++;
          } else {
            newPositions.push({ type: voteType, count: 1 });
          }
          return { ...issue, positions: newPositions };
        }
        return issue;
      });
    });
    setUserVotes({ ...userVotes, [issueId]: voteType });
  };

  const updateRepPhoto = (repId: string, photoUrl: string) => {
    setReps(currentReps =>
      currentReps.map(rep => rep.id === repId ? { ...rep, photoUrl } : rep)
    );
  };

  const addCustomRep = (rep: Representative) => {
    setReps(current => [...current, rep]);
  };

  const addPetition = (petition: Petition) => {
    setPetitions([petition, ...petitions]);
  };

  const logMessage = (log: MessageLog) => {
    setMessageLogs([log, ...messageLogs]);
  };

  return {
    reps,
    issues,
    userVotes,
    petitions,
    messageLogs,
    accountability,
    spotlight,
    voteOnIssue,
    updateRepPhoto,
    addCustomRep,
    addPetition,
    logMessage
  };
}
