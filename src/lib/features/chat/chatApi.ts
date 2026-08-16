import api from "@/lib/api/api";
import { Message, Room } from "@/types/chat";

export const getGeneralRoom = async (): Promise<Room> => {
  const res = await api.get("/rooms/general");
  return res.data.data;
};

export const getMessageHistory = async (
  roomId: string,
  page = 1,
  limit = 30
): Promise<Message[]> => {
  const res = await api.get(`/messages/${roomId}`, {
    params: { page, limit },
  });
  return res.data.data;
};