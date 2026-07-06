# Auditoría de Instagram · bysandrix

Herramienta gratuita: la persona sube UNA captura de su perfil completo (foto + bio + primeros posts) y recibe un diagnóstico con criterio de CM senior, actualizado al algoritmo de Instagram 2026. Termina con CTA a la Asesoría Estratégica 1:1 por WhatsApp.

## Antes de publicar: 2 cosas que tenés que cambiar

### 1. Tu número de WhatsApp
En `src/App.jsx`, buscá:
```
const WHATSAPP_URL = "https://wa.me/549TUNUMERO?text=" + ...
```
Reemplazá `549TUNUMERO` por tu número completo sin `+` ni espacios.
Ejemplo Argentina: `5491155555555`

### 2. Tu precio/oferta si cambia
El mensaje de WhatsApp y el texto del botón mencionan "Asesoría Estratégica 1:1". Si el nombre o la oferta cambia, actualizalo en `src/App.jsx` (buscá "Asesoría Estratégica").

## Deploy en Vercel (5 minutos)

### Paso 1: Subir a GitHub
1. Entrá a github.com y creá una cuenta si no tenés
2. "New repository" → nombralo `sandrix-auditoria`
3. Subí todos los archivos de esta carpeta (arrastrá o "Upload files")

### Paso 2: Conectar con Vercel
1. Entrá a vercel.com → creá cuenta con tu GitHub
2. "Add New Project" → elegí `sandrix-auditoria`
3. Click en "Deploy"

### Paso 3: Agregar tu API Key de Anthropic
1. En Vercel: Settings → Environment Variables
2. Agregá: Name = `ANTHROPIC_API_KEY`, Value = tu key (la sacás de console.anthropic.com)
3. "Save" y después "Redeploy"

## Tu link
Vercel te da un link tipo `https://sandrix-auditoria.vercel.app` — ese es el que ponés en tu bio de Instagram.

## Cómo funciona el análisis
El criterio de la IA (definido en `api/analyze.js`) evalúa 3 cosas siguiendo lógica de algoritmo actual, no reglas viejas:
- **Bio**: keywords de nicho, propuesta de valor clara, CTA visible
- **Foto de perfil**: legibilidad en formato circular, coherencia con el rubro
- **Primeros 3 posts**: originalidad (Instagram penaliza reposts sin edición), si el contenido invita a guardar/compartir (pesa más que los likes), coherencia de nicho

Cada sección devuelve un semáforo (🔴🟡🟢) y una prioridad única: la acción más urgente a resolver primero. Esto empuja naturalmente hacia la Asesoría 1:1 como siguiente paso.
