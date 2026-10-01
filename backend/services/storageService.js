import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User.js';
import MultimodalSession from '../models/MultimodalSession.js';
import Workspace from '../models/Workspace.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '../data');
const dbFilePath = path.join(dataDir, 'local_db.json');

// Ensure local data directory and database file exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const getInitialData = () => ({
  users: [],
  sessions: [],
  workspaces: [],
});

const loadLocalData = () => {
  if (!fs.existsSync(dbFilePath)) {
    const initial = getInitialData();
    fs.writeFileSync(dbFilePath, JSON.stringify(initial, null, 2));
    return initial;
  }
  try {
    const raw = fs.readFileSync(dbFilePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('[StorageService] Error reading local_db.json, reinitializing:', err.message);
    const initial = getInitialData();
    fs.writeFileSync(dbFilePath, JSON.stringify(initial, null, 2));
    return initial;
  }
};

const saveLocalData = (data) => {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('[StorageService] Error saving local_db.json:', err.message);
  }
};

// Seed default demo user if local database is empty
const seedDefaultUser = async () => {
  const data = loadLocalData();
  const demoEmail = 'clinician@omnimedi.ai';
  const existing = data.users.find((u) => u.email === demoEmail);
  if (!existing) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Password123!', salt);
    data.users.push({
      _id: 'usr_demo_clinician_001',
      name: 'Dr. Evelyn Reed, MD',
      email: demoEmail,
      password: hashedPassword,
      role: 'clinician',
      organization: 'St. Jude Multimodal Diagnostic Center',
      preferences: {
        theme: 'dark',
        defaultDomain: 'Healthcare',
        enableStreaming: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    saveLocalData(data);
    console.log('[StorageService] Default demo user seeded: clinician@omnimedi.ai / Password123!');
  }
};

seedDefaultUser();

class StorageService {
  isMongoActive() {
    return mongoose.connection.readyState === 1;
  }

  // ================= USER OPERATIONS =================

  async findUserByEmail(email, includePassword = false) {
    if (this.isMongoActive()) {
      const query = User.findOne({ email });
      if (includePassword) query.select('+password');
      return await query;
    }

    const data = loadLocalData();
    const user = data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return null;

    if (!includePassword) {
      const { password, ...safeUser } = user;
      return safeUser;
    }
    return { ...user };
  }

  async findUserById(id) {
    if (this.isMongoActive()) {
      return await User.findById(id).select('-password');
    }

    const data = loadLocalData();
    const user = data.users.find((u) => u._id === id || u.id === id);
    if (!user) return null;

    const { password, ...safeUser } = user;
    return safeUser;
  }

  async createUser({ name, email, password, role, organization }) {
    if (this.isMongoActive()) {
      return await User.create({ name, email, password, role, organization });
    }

    const data = loadLocalData();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      _id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'user',
      organization: organization || 'OmniCognition Lab',
      preferences: {
        theme: 'dark',
        defaultDomain: 'Healthcare',
        enableStreaming: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    data.users.push(newUser);
    saveLocalData(data);

    const { password: _, ...safeUser } = newUser;
    return safeUser;
  }

  async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  // ================= SESSION OPERATIONS =================

  async createSession(sessionData) {
    if (this.isMongoActive()) {
      const session = new MultimodalSession(sessionData);
      return await session.save();
    }

    const data = loadLocalData();
    const newSession = {
      _id: `ses_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: sessionData.title,
      user: sessionData.user,
      workspace: sessionData.workspace || null,
      domain: sessionData.domain || 'Healthcare',
      files: sessionData.files || [],
      prompt: sessionData.prompt || '',
      aiAnalysis: sessionData.aiAnalysis || {
        summary: '',
        keyFindings: [],
        crossModalCorrelation: '',
        riskOrAnomalyAlerts: [],
        recommendedActions: [],
        confidenceScore: 95,
        rawGeminiResponse: '',
      },
      messages: sessionData.messages || [],
      status: sessionData.status || 'pending',
      errorMessage: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    data.sessions.unshift(newSession);
    saveLocalData(data);
    return newSession;
  }

  async updateSession(sessionId, updates) {
    if (this.isMongoActive()) {
      return await MultimodalSession.findByIdAndUpdate(
        sessionId,
        { ...updates, updatedAt: new Date() },
        { new: true }
      );
    }

    const data = loadLocalData();
    const index = data.sessions.findIndex((s) => s._id === sessionId || s.id === sessionId);
    if (index === -1) return null;

    data.sessions[index] = {
      ...data.sessions[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    saveLocalData(data);
    return data.sessions[index];
  }

  async getUserSessions(userId) {
    if (this.isMongoActive()) {
      return await MultimodalSession.find({ user: userId })
        .select('-aiAnalysis.rawGeminiResponse')
        .sort({ createdAt: -1 })
        .limit(50);
    }

    const data = loadLocalData();
    return data.sessions
      .filter((s) => String(s.user) === String(userId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getSessionById(sessionId, userId) {
    if (this.isMongoActive()) {
      return await MultimodalSession.findOne({ _id: sessionId, user: userId });
    }

    const data = loadLocalData();
    return (
      data.sessions.find(
        (s) => (s._id === sessionId || s.id === sessionId) && String(s.user) === String(userId)
      ) || null
    );
  }

  async addSessionMessage(sessionId, message) {
    if (this.isMongoActive()) {
      const session = await MultimodalSession.findById(sessionId);
      if (!session) return null;
      session.messages.push(message);
      await session.save();
      return session.messages;
    }

    const data = loadLocalData();
    const session = data.sessions.find((s) => s._id === sessionId || s.id === sessionId);
    if (!session) return null;

    if (!session.messages) session.messages = [];
    session.messages.push({
      ...message,
      timestamp: message.timestamp || new Date().toISOString(),
    });
    session.updatedAt = new Date().toISOString();
    saveLocalData(data);
    return session.messages;
  }

  async deleteSession(sessionId, userId) {
    if (this.isMongoActive()) {
      return await MultimodalSession.findOneAndDelete({ _id: sessionId, user: userId });
    }

    const data = loadLocalData();
    const index = data.sessions.findIndex(
      (s) => (s._id === sessionId || s.id === sessionId) && String(s.user) === String(userId)
    );
    if (index === -1) return null;

    const [deleted] = data.sessions.splice(index, 1);
    saveLocalData(data);
    return deleted;
  }

  // ================= WORKSPACE OPERATIONS =================

  async createWorkspace({ name, description, domain, owner }) {
    if (this.isMongoActive()) {
      return await Workspace.create({
        name,
        description,
        domain,
        owner,
        members: [{ user: owner, role: 'admin' }],
      });
    }

    const data = loadLocalData();
    const newWs = {
      _id: `ws_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name,
      description: description || '',
      domain: domain || 'Healthcare',
      owner,
      members: [{ user: owner, role: 'admin' }],
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    data.workspaces.push(newWs);
    saveLocalData(data);
    return newWs;
  }

  async getUserWorkspaces(userId) {
    if (this.isMongoActive()) {
      return await Workspace.find({
        $or: [{ owner: userId }, { 'members.user': userId }],
        isArchived: false,
      }).sort({ updatedAt: -1 });
    }

    const data = loadLocalData();
    return data.workspaces.filter(
      (w) => String(w.owner) === String(userId) && !w.isArchived
    );
  }
}

export default new StorageService();
