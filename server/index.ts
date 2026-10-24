import { app } from './app';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`⚡ Chan Sovannarith Portfolio Backend API Server`);
  console.log(`🌐 Local Server:  http://localhost:${PORT}`);
  console.log(`🚀 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📂 CMS Endpoints: /api/projects, /api/skills, /api/profile`);
  console.log(`✉️  Contact Form:  POST /api/contact`);
  console.log(`====================================================`);
});
