import express from 'express';
import route from './routes/index';

const { env } = process;
const port = env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(route);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
