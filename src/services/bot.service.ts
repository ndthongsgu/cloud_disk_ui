import { api } from "./api";
import { API_ENDPOINTS } from "./endpoint";

export interface TelegramBotNode {
  id: string;
  name: string;
  token: string;
  username: string;
  chatId: string;
  isActive: boolean;
  status: string;
  statusLabel?: string;
  isCanDeActive?: boolean;
  isCanActive?: boolean;
  createdAt: string;
  updatedAt: string;
  totalFilesHandled: number;
}

const mapBotResponse = (item: any): TelegramBotNode => ({
  id: item.id,
  name: item.code,
  username: item.bot_username,
  token: item.bot_token || "••••••••••••••••••••••••••••",
  chatId: item.chat_id || "",
  isActive: item.status === "ACTIVE",
  status: item.status,
  statusLabel: item.statusLabel,
  isCanDeActive: item.isCanDeActive,
  isCanActive: item.isCanActive,
  createdAt: item.created_date,
  updatedAt: item.updated_date,
  totalFilesHandled: item.total_files_handled || 0,
});

export const botService = {
  getBots: async (): Promise<TelegramBotNode[]> => {
    const response = await api.get<{ items: any[] }>(API_ENDPOINTS.TELEGRAM_BOTS.BASE);
    const items = response.data.items || [];
    return items.map(mapBotResponse);
  },

  createBot: async (name: string, username: string, token: string, chatId: string): Promise<TelegramBotNode> => {
    const response = await api.post<any>(API_ENDPOINTS.TELEGRAM_BOTS.BASE, {
      code: name,
      bot_username: username,
      bot_token: token,
      chat_id: chatId,
    });
    return mapBotResponse(response.data);
  },

  updateBot: async (id: string, username: string, token?: string, chatId?: string): Promise<void> => {
    await api.put<any>(`${API_ENDPOINTS.TELEGRAM_BOTS.BASE}/${id}`, {
      bot_username: username,
      bot_token: token || undefined,
      chat_id: chatId || undefined,
    });
  },

  deactivateBot: async (id: string): Promise<void> => {
    await api.post(API_ENDPOINTS.TELEGRAM_BOTS.DEACTIVATE(id));
  },

  activateBot: async (id: string): Promise<void> => {
    await api.post(API_ENDPOINTS.TELEGRAM_BOTS.ACTIVATE(id));
  },
};

