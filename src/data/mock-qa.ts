import { Lender, QAThread, User } from "@/types/deal-qa";

export const currentUser: User = {
  id: "u1",
  name: "Claire Williams",
  avatarUrl: "",
  organization: "Core Invest",
};

export const mockLenders: Lender[] = [
  { id: "l1", name: "Blomey Advisors", notificationCount: 0 },
  { id: "l2", name: "Clifton Private Finance", notificationCount: 0 },
  { id: "l3", name: "Crédit Agricole CIB", notificationCount: 0 },
  { id: "l4", name: "Funding Circle", notificationCount: 0 },
  { id: "l5", name: "Mercedes-Benz Mobility", notificationCount: 1 },
  { id: "l6", name: "Rosberg Holdings", notificationCount: 1 },
];

const rohit: User = {
  id: "u2",
  name: "Rohit Sharma",
  organization: "Mercedes-Benz Mobility",
};

export const mockThreadsByLender: Record<string, QAThread[]> = {
  l1: [
    {
      id: "t1",
      title: "Loan-to-value ratio clarification",
      isPending: false,
      question: {
        id: "m1",
        author: currentUser,
        content: "Could you provide the updated LTV ratio based on the latest appraisal? We need this for our internal credit committee review.",
        timestamp: "2026-03-17T10:30:00Z",
        isPending: false,
        attachments: [],
      },
      replies: [],
    },
  ],
  l2: [],
  l3: [],
  l4: [
    {
      id: "t2",
      title: "Environmental assessment status",
      isPending: false,
      question: {
        id: "m2",
        author: currentUser,
        content: "What is the current status of the Phase I environmental assessment? Has it been completed?",
        timestamp: "2026-03-17T09:00:00Z",
        isPending: false,
        attachments: [
          { id: "a1", name: "Phase_I_Template.pdf", url: "#", size: "2.4 MB" },
        ],
      },
      replies: [
        {
          id: "m3",
          author: { id: "u3", name: "Sarah Chen", organization: "Funding Circle" },
          content: "The Phase I ESA was completed last week. Report is attached. No recognized environmental conditions were identified.",
          timestamp: "2026-03-17T11:15:00Z",
          isPending: false,
          attachments: [
            { id: "a2", name: "Phase_I_ESA_Report_Final.pdf", url: "#", size: "5.1 MB" },
          ],
        },
      ],
    },
    {
      id: "t3",
      title: "Test pending styles",
      isPending: true,
      question: {
        id: "m4",
        author: currentUser,
        content: "test pending styles",
        timestamp: "2026-03-17T14:00:00Z",
        isPending: true,
        attachments: [],
      },
      replies: [],
    },
  ],
  l5: [
    {
      id: "t4",
      title: "Debt service coverage requirements",
      isPending: true,
      question: {
        id: "m5",
        author: rohit,
        content: "Question from Rohit, what are the minimum DSCR requirements for this tranche? We need to ensure our projections meet your thresholds before proceeding.",
        timestamp: "2026-05-07T08:00:00Z",
        isPending: true,
        attachments: [],
        },
      replies: [
        {
          id: "m6",
          author: currentUser,
          content: "Minimum DSCR is 1.25x for the senior tranche. I've attached the full covenant package for your review.",
          timestamp: "2026-05-07T10:30:00Z",
          isPending: false,
          attachments: [
            { id: "a3", name: "Covenant_Package_v3.pdf", url: "#", size: "1.8 MB" },
          ],
        },
      ],
    },
  ],
  l6: [
    {
      id: "t5",
      title: "Interest rate hedging strategy",
      isPending: true,
      question: {
        id: "m7",
        author: { id: "u4", name: "Anna Weber", organization: "Rosberg Holdings" },
        content: "Can you share your proposed interest rate hedging strategy? We'd like to understand how floating rate exposure will be managed.",
        timestamp: "2026-03-15T16:00:00Z",
        isPending: true,
        attachments: [],
      },
      replies: [],
    },
  ],
};
