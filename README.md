# Slack API Messaging Project

This project demonstrates the use of the **Slack API** to perform core messaging operations in a **developer sandbox environment**.  
It covers authentication, sending messages, scheduling, retrieving, editing, and deleting messages using Slack's Web API.

---

## 🚀 Features Implemented
1. **Authentication**
   - Implemented using Slack Bot/User OAuth token stored in `.env`.

2. **Messaging Operations**
   - **Send Message** → Post a message to a channel.  
   - **Schedule Message** → Post a message at a future time.  
   - **Retrieve Message** → Fetch previously sent messages by timestamp or ID.  
   - **Edit Message** → Update the content of an existing message.  
   - **Delete Message** → Remove a message from a channel.

3. **Developer Sandbox**
   - All testing was done in Slack’s **Developer Sandbox** to ensure no production data was affected.

---

## 🛠️ Tech Stack
- **Language**: Node.js (JavaScript) / Python (depending on implementation)  
- **Slack API**: [Slack Web API](https://api.slack.com/web)  
- **Environment Variables**: `.env` file for tokens

