export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  organization: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: string;
}

export interface QAMessage {
  id: string;
  author: User;
  content: string;
  timestamp: string;
  isPending: boolean;
  attachments: Attachment[];
  isEditing?: boolean;
}

export interface QAThread {
  id: string;
  title: string;
  question: QAMessage;
  replies: QAMessage[];
  isPending: boolean;
  hasNotification?: boolean;
}

export interface Lender {
  id: string;
  name: string;
  notificationCount: number;
}

export type FilterStatus = "all" | "pending";

export type DealStatus = "active" | "closed";
