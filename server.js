import express from 'express';
import history from 'connect-history-api-fallback';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

// Middleware for SPA handling (must be before static)
app.use(history());

// Serve static assets from dist
app.use(express.static(join(__dirname, 'dist')));

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
