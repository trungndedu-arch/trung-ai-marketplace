import { chatbots, type Chatbot } from "@/data/chatbots";

export type { Chatbot } from "@/data/chatbots";

function sortChatbots(items: Chatbot[]) {
  return [...items].sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name, "vi"));
}

export function getActiveChatbots() {
  return sortChatbots(chatbots.filter((chatbot) => chatbot.isActive));
}

export function getFeaturedChatbots() {
  return getActiveChatbots().filter((chatbot) => chatbot.isFeatured);
}

export function getChatbotBySlug(slug: string) {
  return getActiveChatbots().find((chatbot) => chatbot.slug === slug);
}
