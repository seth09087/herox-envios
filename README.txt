# HEROX — formulario con búsqueda de agencias

Este proyecto usa un pequeño servidor Node.js para consultar el catálogo público de agencias. Así el navegador consulta `/api/agencies` en el mismo sitio y no llama directamente al proveedor externo.

## Probar en tu computadora (Windows)

1. Instala Node.js 18 o superior desde https://nodejs.org/.
2. Descomprime esta carpeta.
3. Abre la carpeta `herox-agencias-servidor` en VS Code.
4. En VS Code, abre **Terminal > New Terminal**.
5. Ejecuta:

   ```bash
   npm install
   npm start
   ```

6. Abre en Chrome: http://localhost:3000
7. Selecciona un departamento y busca una agencia.

Para comprobar que el servidor está encendido, abre http://localhost:3000/health. Debe mostrar `{"ok":true}`.

## Publicarlo para que tus clientes lo usen

Necesitarás una cuenta de GitHub y una cuenta de Render.

1. Sube los archivos de esta carpeta a un repositorio de GitHub.
2. En Render, selecciona **New + > Web Service** y conecta ese repositorio.
3. Configura:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Runtime:** Node
4. Pulsa **Create Web Service** y espera a que termine el despliegue.
5. Abre la URL `*.onrender.com` que Render te entregue.

La instancia gratuita puede tardar un poco en despertar después de estar inactiva.

## Importante

- El catálogo consultado es de un proveedor independiente, no una API oficial garantizada por Shalom. Comprueba que las agencias y direcciones sean correctas antes de usarlo con clientes.
- Esta versión solo busca agencias y prepara el mensaje para WhatsApp; no crea una guía oficial ni registra pedidos en Shalom.
- Antes de publicar, verifica que el número de WhatsApp configurado dentro de `public/index.html` sea el correcto para HEROX.
