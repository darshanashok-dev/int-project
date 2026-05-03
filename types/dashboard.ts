export interface StartupBasic {
  id: string;
  name: string;
  sector: string | null;
  stage: string | null;
  status: string | null;
}

export interface SessionBasic {
  id: string;
  scheduled_at: string;
  status: string | null;
  startups: { name: string } | null;
}

export interface ApplicationBasic {
  id: string;
  status: string | null;
  startups: { name: string } | null;
  programs: { name: string } | null;
}

export interface ProgramBasic {
  id: string;
  name: string;
  cohort: string;
  start_date: string | null;
  end_date: string | null;
  max_startups: number | null;
}
