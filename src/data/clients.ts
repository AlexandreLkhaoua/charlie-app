import { Client } from '@/types'

export const clients: Client[] = [
  {
    id: 'client-001',
    name: 'Robert Hartwell III',
    type: 'UHNW',
    email: 'r.hartwell@hartwell-family.com',
    phone: '+1 (212) 555-0101',
    relationshipManager: 'Sarah Chen',
    totalAUM: 45_000_000,
    ytdReturn: 12.4,
    riskProfile: 'Moderate',
    lastReview: '2024-10-15',
    nextReview: '2025-01-15',
    status: 'Active',
    createdAt: '2019-03-15',
  },
  {
    id: 'client-002',
    name: 'The Morrison Family Office',
    type: 'Family Office',
    email: 'office@morrison-fo.com',
    phone: '+1 (415) 555-0202',
    relationshipManager: 'Sarah Chen',
    totalAUM: 125_000_000,
    ytdReturn: 9.8,
    riskProfile: 'Conservative',
    lastReview: '2024-11-01',
    nextReview: '2025-02-01',
    status: 'Active',
    createdAt: '2018-06-20',
  },
  {
    id: 'client-003',
    name: 'Elizabeth Thornton',
    type: 'Private Client',
    email: 'e.thornton@gmail.com',
    phone: '+1 (310) 555-0303',
    relationshipManager: 'Michael Roberts',
    totalAUM: 8_500_000,
    ytdReturn: 15.2,
    riskProfile: 'Aggressive',
    lastReview: '2024-09-20',
    nextReview: '2024-12-20',
    status: 'Review Pending',
    createdAt: '2020-01-10',
  },
  {
    id: 'client-004',
    name: 'James & Patricia Williams',
    type: 'Private Client',
    email: 'jpwilliams@williams-legal.com',
    phone: '+1 (617) 555-0404',
    relationshipManager: 'Michael Roberts',
    totalAUM: 12_300_000,
    ytdReturn: -2.1,
    riskProfile: 'Conservative',
    lastReview: '2024-08-15',
    nextReview: '2025-02-15',
    status: 'At Risk',
    createdAt: '2017-11-05',
  },
  {
    id: 'client-005',
    name: 'Chen Family Trust',
    type: 'Family Office',
    email: 'trust@chen-holdings.com',
    phone: '+1 (650) 555-0505',
    relationshipManager: 'Sarah Chen',
    totalAUM: 78_000_000,
    ytdReturn: 11.3,
    riskProfile: 'Moderate',
    lastReview: '2024-10-30',
    nextReview: '2025-01-30',
    status: 'Active',
    createdAt: '2016-08-22',
  },
  {
    id: 'client-006',
    name: 'Dr. Marcus Johnson',
    type: 'Private Client',
    email: 'm.johnson@medical-partners.com',
    phone: '+1 (305) 555-0606',
    relationshipManager: 'Michael Roberts',
    totalAUM: 4_200_000,
    ytdReturn: 8.7,
    riskProfile: 'Moderate',
    lastReview: '2024-11-10',
    nextReview: '2025-02-10',
    status: 'Active',
    createdAt: '2021-04-18',
  },
]

export function getClientById(id: string): Client | undefined {
  return clients.find(client => client.id === id)
}

export function getClientsByManager(manager: string): Client[] {
  return clients.filter(client => client.relationshipManager === manager)
}

export function getClientsByStatus(status: Client['status']): Client[] {
  return clients.filter(client => client.status === status)
}
