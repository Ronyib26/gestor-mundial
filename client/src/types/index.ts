export interface Team {
  id: string;
  countryName: string;
  fifaCode: string;
  coach: string;
  playersCount: number;
  fifaRanking: number;
  createdAt: string;
  updatedAt: string;
}

export interface Group {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DistributionGroup {
  group: Group;
  teams: Team[];
}

export interface Distribution {
  id: string;
  name: string;
  createdAt: string;
  groups: DistributionGroup[];
}

export interface DistributionPreviewItem {
  groupId: string;
  groupName: string;
  teamIds: string[];
  teams: Team[];
}

export interface DistributionPreview {
  groups: DistributionPreviewItem[];
  teamsPerGroup: number;
  totalTeams: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
