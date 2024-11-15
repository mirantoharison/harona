import { SxProps, Theme } from "@mui/material";

export interface TaskProps {
  id: number;
  name: string;
  state: string;
  processedOn: string;
  finishedOn: string;
  data: {
    url: string;
    name: string;
  };
  totalReviews: number;
  countReviewsScrapped: number
}

export interface TaskCardProps {
  recordId: number;
  style?: SxProps<Theme>;
  task: TaskProps,
  canEdit: boolean;
  canDelete: boolean;
}

export interface WorkerState {
  running: boolean;
}

export interface SortFilterArray {
  label: string;
  key: string | number;
}


export interface JobProps {
  url: string;
  name: string;
  comments?: string;
  timestamp: string;
  processedOn?: string;
}

export interface JobDetailsProps {
  job: {
    data: {
      url: string;
      name: string;
    }
    comments?: string;
    timestamp: string;
    processedOn?: string;
    state: string;
  };
}