const { webfont } = require('webfont');
const fs = require('fs').promises;
const path = require('path');

async function generateIconFont() {
  try {
    // Crear directorios si no existen
    const outputDir = path.join(__dirname, '..', 'src', 'assets', 'fonts');
    await fs.mkdir(outputDir, { recursive: true });

    // Generar fuente de iconos
    const result = await webfont({
      files: path.join(__dirname, '..', 'src', 'icons', '*.svg'),
      fontName: 'CustomIcons',
      formats: ['woff2', 'woff'],
      fontHeight: 1000,
      normalize: true,
      template: 'css',
      templateClassName: 'icon',
      templateFontPath: './fonts/',
      glyphTransformFn: (obj) => {
        obj.name = obj.name.toLowerCase().replace(/\s/g, '-');
        return obj;
      }
    });

    // Guardar archivos de fuente
    await fs.writeFile(path.join(outputDir, 'CustomIcons.woff2'), result.woff2);
    await fs.writeFile(path.join(outputDir, 'CustomIcons.woff'), result.woff);
    
    // Guardar archivo CSS
    const cssContent = `@font-face {
  font-family: 'CustomIcons';
  src: url('./CustomIcons.woff2') format('woff2'),
       url('./CustomIcons.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}

.icon {
  font-family: 'CustomIcons' !important;
  speak: never;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

${result.glyphsData.map(glyph => `.icon-${glyph.metadata.name}:before {
  content: "\\${glyph.metadata.unicode[0].charCodeAt(0).toString(16)}";
}`).join('\n\n')}`;
    
    await fs.writeFile(path.join(outputDir, 'icons.css'), cssContent);

    console.log('✅ Fuentes de iconos generadas exitosamente!');
    console.log(`📁 Archivos generados en: ${outputDir}`);
    console.log(`🎨 Iconos disponibles: ${result.glyphsData.map(g => g.metadata.name).join(', ')}`);
    
  } catch (error) {
    console.error('❌ Error generando fuentes:', error);
    process.exit(1);
  }
}

generateIconFont();