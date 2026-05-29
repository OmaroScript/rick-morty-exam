# Rick & Morty Explorer

Prueba técnica de Frontend Developer — Aeroméxico.

Aplicación para explorar personajes de Rick & Morty con búsqueda en tiempo real, navegación paginada, sistema de favoritos persistente y estados visuales por status del personaje.

Pueden darle un pequeño vistazo ya montado en Vercel: https://rick-morty-exam.vercel.app/

---

## Stack tecnológico

- **Next.js 16 / React 19** — App Router con Server & Client Components
- **TypeScript** — tipado estricto en toda la base de código
- **CSS Modules** — estilos encapsulados por componente sin colisiones
- **Redux Toolkit** — gestión de estado global para favoritos
- **JSON Server** — API REST local para persistir favoritos (`db.json`)
- **rickmortyapi** — paquete npm del repositorio amTesting (tipos e interfaces)
- **Jest + Testing Library** — pruebas unitarias

---

## Requisitos previos

- Node.js ≥ 18
- npm ≥ 9

---

## Levantar el proyecto

```bash
# 1. Clonar el repo e instalar dependencias
git clone git@github.com:OmaroScript/rick-morty-exam.git
cd rick-morty-exam
npm install

# 2. Levantar Next.js + JSON Server en paralelo
npm run dev
```

Esto arranca:
- **Next.js** en `http://localhost:3000`
- **JSON Server** (favoritos) en `http://localhost:3001`

---

## Correr pruebas unitarias

```bash
# Una vez
npm test

# Modo watch
npm run test:watch

# Con reporte de cobertura
npm run test:coverage
```

Los tests cubren:
- `CharacterCard` — render, selección, toggle de favorito, estado seleccionado
- `FavsButton` — apertura/cierre de dropdown, selección de favorito
- `useDebounce` — comportamiento de debounce con timers simulados

---

## Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Next.js + JSON Server en paralelo |
| `npm run dev:next` | Solo Next.js |
| `npm run db` | Solo JSON Server |
| `npm run build` | Build de producción |
| `npm test` | Pruebas unitarias |
| `npm run test:coverage` | Pruebas + reporte de cobertura |

---

## ¿Qué es lo que más me gustó de mi desarrollo?

La arquitectura de capas quedó muy clara: **tipos → servicio → slice → componentes**. Cada pieza tiene una única responsabilidad y las dependencias fluyen en una sola dirección. Esto hace que agregar un nuevo campo al personaje sea un cambio de pocas líneas sin tocar nada más.

Además es un desarrollo visualmente atractivo que es lo que atrae al usuario final siempre, me gustó porque aparte puedes implementar estilos adicionales o darle un poco de dinamismo, dentro de lo posible.

---

## ¿Qué hubiera mejorado con más tiempo?

1. **Tests de integración** — cubrir el flujo completo: buscar → seleccionar → agregar a favoritos → verificar persistencia en JSON Server con MSW (Mock Service Worker).
2. **Skeleton loading** — reemplazar el spinner por skeletons de las tarjetas para un UX más pulido durante la carga.
3. **Modo offline** — aprovechar `next/cache` o `SWR` para cachear personajes y funcionar sin conexión a la API pública.
4. **Animaciones** — transición suave al cambiar el personaje featured en el panel izquierdo (fade/slide).

---

## Pain point encontrado

**Pain point 1 — Bug en el paquete `rickmortyapi` (amTesting)**

El repositorio proporcionado ([amTesting](https://github.com/heatxel/amTesting)) es el paquete npm `rickmortyapi` v2.3.0. Se instaló con `npm i rickmortyapi` y se intentó usar sus funciones `getCharacters` y `getCharacter` directamente.

El problema: la función interna `generateQueryString` devuelve strings con barra inicial (`/1`, `/?page=1`), y `getResource` los concatena con otro separador, produciendo URLs con doble barra:

```
https://rickandmortyapi.com/api/character//?page=1  ← 404
https://rickandmortyapi.com/api/character//1         ← 404
```

La API rechaza ambas con `404 Not Found`. El bug está en la versión publicada del paquete y no tiene fix disponible en npm.

**La solución:** Se importan únicamente los tipos e interfaces del paquete (`Character`, `Info`) para mantener el contrato tipado con amTesting, pero las llamadas HTTP se hacen directamente a `https://rickandmortyapi.com/api` con la URL construida correctamente. Esto cumple el requerimiento de integrar el repositorio proporcionado sin depender de su implementación defectuosa.

---

**Pain point 2 — `next/image` con dominios externos**

Al usar `next/image` con imágenes externas, Next.js bloquea dominios no configurados y lanza un error en runtime, no en build time. El error aparece solo cuando se renderiza el primer `<Image>` con una URL de rickandmortyapi.com.

**La solución:** Agregar el dominio en `next.config.ts` bajo `images.remotePatterns`. La validación es lazy — se evalúa en el primer render, no durante el build — por lo que el error no aparece en CI hasta que el componente se monta con datos reales.

```ts
images: {
  remotePatterns: [{ protocol: 'https', hostname: 'rickandmortyapi.com' }],
}
```
