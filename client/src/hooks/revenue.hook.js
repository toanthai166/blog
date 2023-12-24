import { useQuery } from "react-query";
import { useAtom } from "jotai";

import { useCallback } from "react";
import { getReports } from "../api/revenue.api";
import { listReport } from "../states/revenue.state";

export const useReport = (filter) => {
  const [reports, setReports] = useAtom(listReport);
  const { isLoading, error } = useQuery({
    // enabled: filter == null ? true : false,
    queryKey: [
      `revenue/${filter.time}&&${filter.endDate}&&${filter.startDate}`,
    ],
    queryFn: useCallback(() => getReports(filter), [filter]),
    onSuccess: (res) => {
      setReports(res.data);
    },
  });
  return { isLoading, error, reports };
};
