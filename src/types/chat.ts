export interface ChatUser {
  _id: string;
  fullName: string;
  profileImage?: string;
}

export interface Room {
  _id: string;
  name: string;
  description?: string;
  members: string[];
  createdBy: string;
}

export interface Message {
  _id: string;
  room: string;
  sender: ChatUser;
  content: string;
  createdAt: string;
}

export interface TypingUser {
  userId: string;
  fullName: string;
}