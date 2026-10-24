import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { db } from './db';

export const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Admin Auth Helper (simple Bearer token or query param for CMS write access)
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'keo-kimchan-cms-2026';

const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '') || req.query.adminKey;

  // In local development or if matching token, allow write operations
  if (process.env.NODE_ENV !== 'production' || token === ADMIN_SECRET) {
    next();
    return;
  }

  res.status(401).json({
    error: 'Unauthorized: Invalid or missing admin credentials to update CMS data.'
  });
};

// -----------------------------------------------------------------------------
// Healthcheck & System Telemetry
// -----------------------------------------------------------------------------
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    service: 'KEO KIMCHAN Portfolio API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// -----------------------------------------------------------------------------
// Profile CMS Endpoints
// -----------------------------------------------------------------------------
app.get('/api/profile', (_req: Request, res: Response) => {
  try {
    const profile = db.getProfile();
    res.json(profile);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve profile data', details: err.message });
  }
});

app.put('/api/profile', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = db.updateProfile(req.body);
    res.json({ success: true, profile: updated });
  } catch (err: any) {
    res.status(400).json({ error: 'Failed to update profile', details: err.message });
  }
});

// -----------------------------------------------------------------------------
// Projects CMS Endpoints
// -----------------------------------------------------------------------------
app.get('/api/projects', (_req: Request, res: Response) => {
  try {
    const projects = db.getProjects();
    res.json(projects);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve projects', details: err.message });
  }
});

app.get('/api/projects/:id', (req: Request, res: Response) => {
  try {
    const project = db.getProject(req.params.id);
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json(project);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve project', details: err.message });
  }
});

app.post('/api/projects', requireAdmin, (req: Request, res: Response) => {
  try {
    const { title, tagline, description, image, tags, category, liveUrl, githubUrl } = req.body;
    if (!title || !description || !category) {
      res.status(400).json({ error: 'Missing required project fields (title, description, category)' });
      return;
    }

    const created = db.createProject({
      title,
      tagline: tagline || '',
      description,
      image: image || '/projects/nexus-3d.jpg',
      tags: tags || ['React', 'TypeScript'],
      category: category || '3D & WebGL',
      liveUrl: liveUrl || '#',
      githubUrl: githubUrl || '#',
      featured: req.body.featured ?? true,
      metrics: req.body.metrics || [],
      highlights: req.body.highlights || []
    });

    res.status(201).json({ success: true, project: created });
  } catch (err: any) {
    res.status(400).json({ error: 'Failed to create project', details: err.message });
  }
});

app.put('/api/projects/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = db.updateProject(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json({ success: true, project: updated });
  } catch (err: any) {
    res.status(400).json({ error: 'Failed to update project', details: err.message });
  }
});

app.delete('/api/projects/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const deleted = db.deleteProject(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete project', details: err.message });
  }
});

app.post('/api/projects/:id/like', (req: Request, res: Response) => {
  try {
    const likes = db.likeProject(req.params.id);
    if (likes === null) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json({ success: true, likes });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to record like', details: err.message });
  }
});

// -----------------------------------------------------------------------------
// Skills CMS Endpoints
// -----------------------------------------------------------------------------
app.get('/api/skills', (_req: Request, res: Response) => {
  try {
    const skills = db.getSkills();
    res.json(skills);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve skills', details: err.message });
  }
});

app.put('/api/skills', requireAdmin, (req: Request, res: Response) => {
  try {
    if (!Array.isArray(req.body)) {
      res.status(400).json({ error: 'Body must be an array of SkillCategories' });
      return;
    }
    const updated = db.updateSkills(req.body);
    res.json({ success: true, skills: updated });
  } catch (err: any) {
    res.status(400).json({ error: 'Failed to update skills', details: err.message });
  }
});

// -----------------------------------------------------------------------------
// Contact Inquiries API
// -----------------------------------------------------------------------------
app.post('/api/contact', (req: Request, res: Response) => {
  try {
    const { name, email, subject, budget, message } = req.body;

    if (!name || !email) {
      res.status(400).json({ error: 'Name and email are required fields.' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ error: 'Invalid email address format.' });
      return;
    }

    const created = db.createMessage({
      name: String(name).trim(),
      email: String(email).trim(),
      subject: String(subject || 'General Connection').trim(),
      budget: String(budget || 'N/A').trim(),
      message: String(message || `Connection request from ${name} (${email})`).trim(),
      ip: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress,
      userAgent: req.headers['user-agent']
    });

    console.log(`[Contact Form Received] From: ${created.name} (${created.email}) | Subject: ${created.subject}`);

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been received. Chan will review and respond shortly!',
      inquiryId: created.id
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to save contact message', details: err.message });
  }
});

app.get('/api/contact/messages', requireAdmin, (_req: Request, res: Response) => {
  try {
    const messages = db.getMessages();
    res.json(messages);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve messages', details: err.message });
  }
});

app.patch('/api/contact/messages/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!status) {
      res.status(400).json({ error: 'Status is required' });
      return;
    }
    const updated = db.updateMessageStatus(req.params.id, status);
    if (!updated) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update message status', details: err.message });
  }
});

// -----------------------------------------------------------------------------
// Site Stats & Telemetry
// -----------------------------------------------------------------------------
app.get('/api/stats', (_req: Request, res: Response) => {
  try {
    const stats = db.getStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch site stats', details: err.message });
  }
});

app.post('/api/stats/visit', (req: Request, res: Response) => {
  try {
    const { isUnique } = req.body || {};
    const updatedStats = db.recordVisit(Boolean(isUnique));
    res.json({ success: true, stats: updatedStats });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to record visit', details: err.message });
  }
});
