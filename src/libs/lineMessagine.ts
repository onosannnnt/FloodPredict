import { lineClient } from "..";

export async function sendLineMessage(userId, message) {
  try {
    await lineClient.pushMessage({
      to: userId,
      messages: [{ type: "text", text: message }],
    });
  } catch (error) {
    console.error("Error sending message:", error);
    throw new error("Error sending message:", error);
  }
}
