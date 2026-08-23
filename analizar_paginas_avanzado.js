const fs = require('fs');
const path = require('path');

function analizarPaginaAvanzado() {
    const paginas = [];
    const baseDir = path.join(process.cwd(), 'src/app');

    function analizarContenido(contenido, ruta) {
        const lower = contenido.toLowerCase();
        const analisis = {
            funciones: [],
            formularios: [],
            botones: [],
            menus: [],
            acciones: []
        };

        // Detectar funciones
        const funcMatches = contenido.match(/function\s+(\w+)|const\s+(\w+)\s*=\s*\(/g) || [];
        analisis.funciones = funcMatches.slice(0, 8).map(f => 
            f.replace(/function |const | = \(/g, '').trim()
        );

        // Formularios
        if (lower.includes('form') || lower.includes('<form')) analisis.formularios.push("Formulario principal");
        if (lower.includes('input')) analisis.formularios.push("Campos de entrada");

        // Botones importantes
        if (lower.includes('submit') || lower.includes('button')) analisis.botones.push("Botones de acción");
        if (lower.includes('agregar') || lower.includes('add')) analisis.acciones.push("Agregar");
        if (lower.includes('comprar') || lower.includes('buy')) analisis.acciones.push("Comprar");
        if (lower.includes('edit')) analisis.acciones.push("Editar");
        if (lower.includes('delete')) analisis.acciones.push("Eliminar");

        // Menús / Navegación
        if (lower.includes('sidebar') || lower.includes('navbar') || lower.includes('menu')) {
            analisis.menus.push("Menú de navegación");
        }

        return analisis;
    }

    function recorrer(dir, rutaBase = '') {
        if (!fs.existsSync(dir)) return;

        fs.readdirSync(dir).forEach(item => {
            const rutaCompleta = path.join(dir, item);
            const rutaRel = path.join(rutaBase, item).replace(/\\/g, '/');

            if (fs.statSync(rutaCompleta).isDirectory()) {
                recorrer(rutaCompleta, rutaRel);
            } else if (item === 'page.tsx' || item === 'page.js') {
                const contenido = fs.readFileSync(rutaCompleta, 'utf8');
                const analisis = analizarContenido(contenido, rutaRel);

                paginas.push({
                    ruta: rutaRel,
                    analisis: analisis
                });
            }
        });
    }

    recorrer(baseDir);

    // Generar documento
    let md = "# 🔍 ANÁLISIS AVANZADO DE PÁGINAS\n\n";
    md += `**Fecha:** ${new Date().toLocaleString()}\n\n`;

    paginas.forEach(p => {
        md += `## 📄 ${p.ruta}\n\n`;
        md += `**Funciones detectadas:** ${p.analisis.funciones.join(', ') || 'Ninguna detectada'}\n\n`;
        md += `**Formularios:** ${p.analisis.formularios.join(', ') || 'No detectado'}\n`;
        md += `**Acciones principales:** ${p.analisis.acciones.join(', ') || 'Lectura básica'}\n`;
        md += `**Menús:** ${p.analisis.menus.join(', ') || 'No detectado'}\n\n`;
        md += "---\n\n";
    });

    fs.writeFileSync('ANALISIS_AVANZADO_PAGINAS.md', md);
    console.log("✅ Análisis avanzado completado: ANALISIS_AVANZADO_PAGINAS.md");
}

analizarPaginaAvanzado();