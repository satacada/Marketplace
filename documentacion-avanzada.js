const fs = require('fs');
const path = require('path');

function analizarProyectoAvanzado() {
    const doc = {
        proyecto: path.basename(process.cwd()),
        fecha: new Date().toLocaleString('es-ES'),
        paginas: [],
        menus: { superior: [], lateral: [] },
        stores: [],
        relaciones: [],
        funcionalidades: []
    };

    function leerArchivo(ruta) {
        return fs.readFileSync(ruta, 'utf8');
    }

    function recorrer(dir) {
        fs.readdirSync(dir).forEach(item => {
            const rutaCompleta = path.join(dir, item);
            const rutaRel = path.relative(process.cwd(), rutaCompleta);

            if (fs.statSync(rutaCompleta).isDirectory()) {
                if (!['node_modules', 'build', 'dist'].includes(item)) recorrer(rutaCompleta);
                return;
            }

            if (!item.match(/\.(jsx|tsx|js)$/)) return;

            const codigo = leerArchivo(rutaCompleta);
            const nombre = item;

            // Detectar páginas
            if (nombre.toLowerCase().includes('page') || rutaRel.includes('/app/') || rutaRel.includes('/pages/')) {
                doc.paginas.push({
                    nombre,
                    ruta: rutaRel,
                    tieneSupabase: codigo.includes('supabase'),
                    tieneStore: codigo.includes('useStore') || codigo.includes('zustand')
                });
            }

            // Detectar Menús
            if (codigo.includes('Sidebar') || codigo.includes('sideBar') || rutaRel.toLowerCase().includes('sidebar')) {
                doc.menus.lateral.push(nombre);
            }
            if (codigo.includes('Navbar') || codigo.includes('Header') || rutaRel.toLowerCase().includes('navbar')) {
                doc.menus.superior.push(nombre);
            }

            // Detectar Stores
            if (codigo.includes('create') && (codigo.includes('zustand') || codigo.includes('store'))) {
                doc.stores.push(nombre);
            }
        });
    }

    recorrer('.');

    // Generar Markdown Detallado
    let md = `# 📘 DOCUMENTACIÓN AVANZADA - ${doc.proyecto}\n\n`;
    md += `**Fecha:** ${doc.fecha}\n\n`;

    md += `## Menús Detectados\n`;
    md += `**Menú Superior:** ${doc.menus.superior.length ? doc.menus.superior.join(', ') : 'No detectado'}\n`;
    md += `**Menú Lateral:** ${doc.menus.lateral.length ? doc.menus.lateral.join(', ') : 'No detectado'}\n\n`;

    md += `## Páginas Principales\n`;
    doc.paginas.forEach(p => {
        md += `### ${p.nombre}\n`;
        md += `- Ruta: \`${p.ruta}\`\n`;
        md += `- Usa Supabase: ${p.tieneSupabase ? 'Sí' : 'No'}\n`;
        md += `- Usa Store: ${p.tieneStore ? 'Sí' : 'No'}\n\n`;
    });

    md += `## Stores / Estado Global\n`;
    doc.stores.forEach(s => md += `- ${s}\n`);

    md += `\n## Recomendación para la siguiente IA\n`;
    md += `Este proyecto es una aplicación React con Supabase. Analiza especialmente las páginas listadas arriba y mantén la estructura de menús y stores.\n`;

    fs.writeFileSync(`DOCUMENTACION_AVANZADA_${doc.proyecto}.md`, md);
    console.log("✅ Documentación Avanzada generada exitosamente!");
}

analizarProyectoAvanzado();