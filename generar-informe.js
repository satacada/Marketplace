const fs = require('fs');
const path = require('path');

function analizarProyectoReact(dir = '.') {
    const proyecto = {
        nombre: path.basename(dir),
        fecha: new Date().toLocaleString('es-ES'),
        ruta: path.resolve(dir),
        archivosTotales: 0,
        carpetas: [],
        extensiones: {},
        dependencias: {},
        componentes: [],
        archivosClave: []
    };

    const ignorar = new Set(['node_modules', '.git', 'build', 'dist', '.vscode', '.idea']);

    function recorrer(dirActual) {
        const items = fs.readdirSync(dirActual);
        
        for (const item of items) {
            const rutaCompleta = path.join(dirActual, item);
            const rutaRelativa = path.relative(dir, rutaCompleta);
            
            if (ignorar.has(item) || item.startsWith('.')) continue;

            const stats = fs.statSync(rutaCompleta);

            if (stats.isDirectory()) {
                proyecto.carpetas.push(rutaRelativa);
                recorrer(rutaCompleta);
            } else {
                proyecto.archivosTotales++;
                const ext = path.extname(item).toLowerCase();
                proyecto.extensiones[ext] = (proyecto.extensiones[ext] || 0) + 1;

                // Archivos importantes
                if (['package.json', 'README.md', 'vite.config.js', 'next.config.js', 'tailwind.config.js'].includes(item)) {
                    proyecto.archivosClave.push(rutaRelativa);
                }

                // Componentes React
                if ((item.endsWith('.jsx') || item.endsWith('.tsx')) && item[0] === item[0].toUpperCase()) {
                    proyecto.componentes.push(rutaRelativa);
                }
            }
        }
    }

    // Leer package.json
    try {
        const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
        proyecto.version = pkg.version || 'desconocida';
        proyecto.dependencias = { ...pkg.dependencies, ...pkg.devDependencies };
    } catch (e) {
        proyecto.version = 'No encontrado';
    }

    recorrer(dir);
    return proyecto;
}

function generarInforme() {
    const info = analizarProyectoReact();
    const nombreArchivo = `INFORME-REACT-${info.nombre}-${new Date().toISOString().slice(0,10)}.md`;

    let contenido = `# 📋 INFORME DEL PROYECTO REACT - ${info.nombre}\n\n`;
    contenido += `**Generado:** ${info.fecha}\n`;
    contenido += `**Ruta:** \`${info.ruta}\`\n\n`;

    contenido += `## 📊 Resumen\n`;
    contenido += `- Archivos totales: **${info.archivosTotales}**\n`;
    contenido += `- Carpetas: **${info.carpetas.length}**\n`;
    contenido += `- Componentes React: **${info.componentes.length}**\n\n`;

    contenido += `## 📦 Dependencias Principales\n`;
    Object.keys(info.dependencias).slice(0, 25).forEach(dep => {
        contenido += `- \`${dep}\`: ${info.dependencias[dep]}\n`;
    });

    contenido += `\n## 🗂️ Estructura de Carpetas\n`;
    info.carpetas.slice(0, 30).forEach(c => contenido += `- \`${c}\`\n`);

    contenido += `\n## ⚛️ Componentes Principales\n`;
    info.componentes.slice(0, 40).forEach(c => contenido += `- \`${c}\`\n`);

    contenido += `\n## 📄 Archivos Clave\n`;
    info.archivosClave.forEach(a => contenido += `- \`${a}\`\n`);

    contenido += `\n## 🚀 Instrucciones para la siguiente IA\n`;
    contenido += `Este es un proyecto **React**. Continúa el desarrollo manteniendo la misma estructura, estilo y tecnologías.\n`;

    fs.writeFileSync(nombreArchivo, contenido, 'utf8');
    console.log(`✅ Informe generado: ${nombreArchivo}`);
}

generarInforme();