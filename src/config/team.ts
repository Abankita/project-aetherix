/**
 * Team configuration for AETHERIX presents AFTER THE FIRE
 * Central source of truth for consortium team members.
 */

export interface TeamMember {
  name: string;
  email: string | null;
  linkedinUrl: string | null;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Rajesh Kumar Swain',
    email: 'rajeshkumarswain1976@gmail.com',
    linkedinUrl: 'https://www.linkedin.com/in/rajesh-kumar-swain-71243raj/',
  },
  {
    name: 'Abankita Behera',
    email: 'abankitabehera05@gmail.com',
    linkedinUrl: 'https://www.linkedin.com/in/abankita-behera-210836227/',
  },
];
