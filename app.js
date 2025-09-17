import express from "express";
import session from "express-session";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";

dotenv.config();
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// session for storing access token
app.use(
  session({
    secret: process.env.SESSION_SECRET || "slacksecret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.static("public"));

// OAuth redirect
app.get("/slack/login", (req, res) => {
  const url = `https://slack.com/oauth/v2/authorize?client_id=${process.env.SLACK_CLIENT_ID}&scope=chat:write,channels:history,channels:read&redirect_uri=${process.env.SLACK_REDIRECT_URI}`;
  res.redirect(url);
});

// OAuth callback
app.get("/slack/callback", async (req, res) => {
  const { code } = req.query;
  try {
    const response = await axios.post(
      "https://slack.com/api/oauth.v2.access",
      null,
      {
        params: {
          code,
          client_id: process.env.SLACK_CLIENT_ID,
          client_secret: process.env.SLACK_CLIENT_SECRET,
          redirect_uri: process.env.SLACK_REDIRECT_URI,
        },
      }
    );
    req.session.access_token = response.data.access_token;
    res.redirect("/");
  } catch (err) {
    res.send("OAuth error: " + err.message);
  }
});

// ✅ Send Message
app.post("/api/send", async (req, res) => {
  const token = req.session.access_token;
  const { text } = req.body;
  try {
    const response = await axios.post(
      "https://slack.com/api/chat.postMessage",
      {
        channel: process.env.SLACK_CHANNEL_ID,
        text,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Schedule Message
app.post("/api/schedule", async (req, res) => {
  const token = req.session.access_token;
  const { text, postAt } = req.body;
  try {
    const response = await axios.post(
      "https://slack.com/api/chat.scheduleMessage",
      {
        channel: process.env.SLACK_CHANNEL_ID,
        text,
        post_at: postAt, // epoch timestamp
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Retrieve Messages
app.get("/api/messages", async (req, res) => {
  const token = req.session.access_token;
  try {
    const response = await axios.get(
      "https://slack.com/api/conversations.history",
      {
        params: { channel: process.env.SLACK_CHANNEL_ID, limit: 5 },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Edit Message
app.post("/api/edit", async (req, res) => {
  const token = req.session.access_token;
  const { ts, text } = req.body;
  try {
    const response = await axios.post(
      "https://slack.com/api/chat.update",
      {
        channel: process.env.SLACK_CHANNEL_ID,
        ts,
        text,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete Message
app.post("/api/delete", async (req, res) => {
  const token = req.session.access_token;
  const { ts } = req.body;
  try {
    const response = await axios.post(
      "https://slack.com/api/chat.delete",
      {
        channel: process.env.SLACK_CHANNEL_ID,
        ts,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
