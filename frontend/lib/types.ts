export interface ProjectData {
  id: string;
  title: string;
  domain: string;
  problem_statement: string;
  solution: string;
  tech_stack: string[];
  abstract: {
    background: string;
    objective: string;
    methodology: string;
    results: string;
    conclusion: string;
  };
  timestamp: number;
}

export interface GenerateRequest {
  domain: string;
  difficulty: string;
  purpose: string;
  output_type: string;
}

export interface GenerateResponse {
  title: string;
  domain: string;
  problem_statement: string;
  solution: string;
  tech_stack: string[];
  abstract: {
    background: string;
    objective: string;
    methodology: string;
    results: string;
    conclusion: string;
  };
}
