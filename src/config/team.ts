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
    email: null, // Configure when supplied (e.g. 'rajesh@example.com')
    linkedinUrl: null, // Configure when supplied (e.g. 'https://www.linkedin.com/in/...')
  },
  {
    name: 'Abankita Behera',
    email: null, // Configure when supplied
    linkedinUrl: null, // Configure when supplied
  },
];
