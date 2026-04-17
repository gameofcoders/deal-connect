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
  { id: "l4", name: "Funding Circle", notificationCount: 2 },
  { id: "l5", name: "Mercedes-Benz Mobility", notificationCount: 1 },
  { id: "l6", name: "Rosberg Holdings", notificationCount: 1 },
];

const rohit: User = {
  id: "u2",
  name: "Rohit Sharma",
  organization: "Mercedes-Benz Mobility",
};

const sarah: User = {
  id: "u3",
  name: "Sarah Chen",
  organization: "Funding Circle",
};

const anna: User = {
  id: "u4",
  name: "Anna Weber",
  organization: "Rosberg Holdings",
};

const teammate: User = {
  id: "u5",
  name: "Marcus Patel",
  organization: "Core Invest",
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
          author: sarah,
          content: "The Phase I ESA was completed last week. Report is attached. No recognized environmental conditions were identified.",
          timestamp: "2026-03-17T11:15:00Z",
          isPending: false,
          attachments: [
            { id: "a2", name: "Phase_I_ESA_Report_Final.pdf", url: "#", size: "5.1 MB" },
            { id: "a2b", name: "Site_Photos.zip", url: "#", size: "12.3 MB" },
          ],
        },
        {
          id: "m3b",
          author: teammate,
          content: "Thanks Sarah. We'll circulate this to the committee. One follow-up: were any data gaps flagged that would require a Phase II?",
          timestamp: "2026-03-17T13:40:00Z",
          isPending: false,
          attachments: [],
        },
        {
          id: "m3c",
          author: sarah,
          content: "No Phase II is recommended. The consultant's executive summary on page 4 confirms it. Let me know if you want a call to walk through the findings.",
          timestamp: "2026-03-17T15:20:00Z",
          isPending: true,
          attachments: [],
        },
      ],
    },
    {
      id: "t6",
      title: "Title insurance and survey requirements",
      isPending: false,
      question: {
        id: "m10",
        author: sarah,
        content: "We'll need an ALTA survey and an owner's title policy at closing. Can you confirm both are being ordered?",
        timestamp: "2026-04-02T09:15:00Z",
        isPending: false,
        attachments: [
          { id: "a6", name: "Title_Requirements_Checklist.pdf", url: "#", size: "340 KB" },
        ],
      },
      replies: [
        {
          id: "m11",
          author: currentUser,
          content: "Both are in process. Survey was commissioned on Monday — ETA 10 business days. Title commitment attached.",
          timestamp: "2026-04-02T11:00:00Z",
          isPending: false,
          attachments: [
            { id: "a7", name: "Title_Commitment_Draft.pdf", url: "#", size: "1.2 MB" },
          ],
        },
      ],
    },
    {
      id: "t3",
      title: "Insurance certificates",
      isPending: true,
      question: {
        id: "m4",
        author: sarah,
        content: "Please share the property and liability insurance certificates with the lender named as additional insured.",
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
        content: "What are the minimum DSCR requirements for this tranche? We need to ensure our projections meet your thresholds before proceeding.",
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
            { id: "a3b", name: "DSCR_Model.xlsx", url: "#", size: "640 KB" },
          ],
        },
        {
          id: "m6b",
          author: rohit,
          content: "Thanks Claire. We'll run the model against our base and downside cases and revert by Friday.",
          timestamp: "2026-05-07T14:05:00Z",
          isPending: false,
          attachments: [],
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
        author: anna,
        content: "Can you share your proposed interest rate hedging strategy? We'd like to understand how floating rate exposure will be managed.",
        timestamp: "2026-03-15T16:00:00Z",
        isPending: true,
        attachments: [
          { id: "a4", name: "Hedging_Policy_Template.pdf", url: "#", size: "880 KB" },
        ],
      },
      replies: [
        {
          id: "m8",
          author: currentUser,
          content: "We're proposing a 5-year interest rate swap covering 75% of the outstanding balance. Term sheet from our counterparty attached.",
          timestamp: "2026-03-16T09:30:00Z",
          isPending: false,
          attachments: [
            { id: "a5", name: "Swap_Termsheet_v2.pdf", url: "#", size: "1.1 MB" },
          ],
        },
        {
          id: "m9",
          author: anna,
          content: "75% coverage works for us. Please confirm the counterparty rating is at least A- and share the ISDA documentation when ready.",
          timestamp: "2026-03-16T11:45:00Z",
          isPending: true,
          attachments: [],
        },
      ],
    },
  ],
};
