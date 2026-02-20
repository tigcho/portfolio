# 🖥️ Retro Desktop Portfolio
This is a Windows 95 inspired interactive portfolio built with React and TypeScript.
The interface simulates a classic desktop environment with draggable windows, a taskbar, boot/shutdown animations, and modular apps.

![Preview](https://i.imgur.com/movPYEj.png)

## Project Structure
```
├── apps
│   ├── about
│   │   └── AboutContent.tsx
│   ├── gallery
│   │   └── GalleryContent.tsx
│   ├── projects
│   │   └── ProjectsContent.tsx
│   ├── socials
│   │   └── SocialsContent.tsx
│   ├── registry.ts
│   └── types.ts
│
├── components
│   ├── BootScreen.tsx
│   ├── CRTContainer.tsx
│   └── ShutdownScreen.tsx
│
├── desktop
│   ├── components
│   │   ├── DesktopGrid.tsx
│   │   ├── DesktopIcon.tsx
│   │   ├── Taskbar.tsx
│   │   ├── Window.tsx
│   │   └── WindowManager.tsx
│   └── Desktop.tsx
│
├── styles
│   ├── apps.css
│   ├── boot.css
│   ├── crt.css
│   ├── desktop.css
│   └── index.css
│
├── App.tsx
└── main.tsx
```

## How to Run
1. Install dependencies
```bash
npm install
```
2. Start the development server
```bash
npm run dev
```
3. Open your browser and navigate to `http://localhost:5173` to see it in action!
