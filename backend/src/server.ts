import { app } from './app';
import { env } from './config/env';

const PORT = env.port;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Servidor iniciado na porta ${PORT}`);
});
