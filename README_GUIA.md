# Baby Shower Máximo - Frontend con Reserva de Regalos

Este proyecto es una aplicación React moderna creada con Vite y Tailwind CSS v4, basada en el diseño de Stitch.

## Características
- **Reserva en Tiempo Real**: Los invitados pueden elegir un regalo y se marcará como reservado para todos los demás usuarios al instante.
- **Modo Oscuro/Claro**: Adaptable a la preferencia del usuario.
- **Diseño Premium**: Animaciones suaves con Framer Motion y efectos de confeti al reservar.
- **Backend Gratuito**: Utiliza Supabase (Nivel gratuito) para gestionar la base de datos sin costo de servidores.

## Configuración del "Backend" (Supabase)

Como mencionaste que no quieren pagar servidores, usaremos **Supabase**, que tiene un plan gratuito generoso y es perfecto para esto.

1. Ve a [Supabase.com](https://supabase.com/) y crea un nuevo proyecto (es gratis).
2. Ve al **SQL Editor** y pega el contenido del archivo `supabase_init.sql` (está en la raíz de este proyecto). Ejecútalo para crear la tabla de regalos.
3. Ve a **Project Settings > API** y copia la `Project URL` y la `Anon Key`.
4. Crea un archivo `.env` en la carpeta `frontend/` y pega lo siguiente:
   ```env
   VITE_SUPABASE_URL=TU_URL_AQUÍ
   VITE_SUPABASE_ANON_KEY=TU_KEY_AQUÍ
   ```
5. ¡Listo! La app ahora guardará las reservas de forma persistente y gratuita.

## Ejecución Local

1. `cd frontend`
2. `npm install`
3. `npm run dev`

## Despliegue
Puedes subir la carpeta `frontend` a **Vercel** o **Netlify** (ambos gratuitos para este tipo de proyectos) y se desplegará automáticamente.
