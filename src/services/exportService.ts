export const exportService = {
  downloadFile(filename: string, content: string, type: string = 'text/plain') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  exportToMarkdown(variant: any, brief: any, archetype: any, qaWarnings: string[]) {
    let md = `# ${brief.productName} - ${brief.mode} Content\n\n`;
    
    md += `## Brief Summary\n`;
    md += `- **Audience**: ${brief.targetAudience}\n`;
    md += `- **Tone**: ${brief.toneOfVoice}\n`;
    if (archetype) {
      md += `- **Archetype**: ${archetype.primary}\n`;
    }
    md += `\n---\n\n`;

    md += `## Generated Content\n\n`;
    md += `${variant.content.article}\n\n`;

    if (brief.mode === 'SEO') {
      md += `### SEO Metadata\n`;
      md += `- **Title**: ${variant.content.metaTitle}\n`;
      md += `- **Description**: ${variant.content.metaDescription}\n\n`;
      md += `### FAQ\n`;
      variant.content.faq?.forEach((item: any) => {
        md += `**Q: ${item.q}**\nA: ${item.a}\n\n`;
      });
    } else if (brief.mode === 'Ads') {
      md += `### Ad Elements\n`;
      md += `**Headlines**:\n${variant.content.headlines?.map((h: string) => `- ${h}`).join('\n')}\n\n`;
      md += `**CTAs**:\n${variant.content.ctas?.map((c: string) => `- ${c}`).join('\n')}\n\n`;
      md += `**Objections Handling**:\n${variant.content.objections?.map((o: string) => `- ${o}`).join('\n')}\n\n`;
    } else if (brief.mode === 'PR') {
      md += `### PR Elements\n`;
      md += `**Facts**:\n${variant.content.facts}\n\n`;
      md += `**Why it matters**:\n${variant.content.whyItMatters}\n\n`;
      md += `**Soft CTA**:\n${variant.content.softCta}\n\n`;
    }

    if (qaWarnings.length > 0) {
      md += `\n---\n## QA Warnings\n`;
      qaWarnings.forEach(w => {
        md += `- ⚠️ ${w}\n`;
      });
    }

    this.downloadFile(`${brief.productName.replace(/\s+/g, '_')}_export.md`, md, 'text/markdown');
  },

  exportToHtml(variant: any, brief: any, archetype: any, qaWarnings: string[]) {
    // Simple HTML generation
    let html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>${brief.productName} - Export</title>
  <style>
    body { font-family: sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; color: #333; }
    h1, h2, h3 { color: #1F2937; }
    .warning { color: #d97706; background: #fef3c7; padding: 10px; border-radius: 4px; margin-bottom: 10px; }
    .meta-box { background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
  </style>
</head>
<body>
  <h1>${brief.productName} - ${brief.mode} Content</h1>
  
  <div class="meta-box">
    <h3>Brief Summary</h3>
    <ul>
      <li><strong>Audience:</strong> ${brief.targetAudience}</li>
      <li><strong>Tone:</strong> ${brief.toneOfVoice}</li>
      ${archetype ? `<li><strong>Archetype:</strong> ${archetype.primary}</li>` : ''}
    </ul>
  </div>

  <h2>Generated Content</h2>
  <div class="content">
    <!-- Basic markdown to HTML conversion (very simplified) -->
    ${variant.content.article.replace(/\n\n/g, '</p><p>').replace(/^# (.*$)/gim, '<h3>$1</h3>').replace(/^## (.*$)/gim, '<h4>$1</h4>')}
  </div>
`;

    if (brief.mode === 'SEO') {
      html += `
  <div class="meta-box">
    <h3>SEO Metadata</h3>
    <p><strong>Title:</strong> ${variant.content.metaTitle}</p>
    <p><strong>Description:</strong> ${variant.content.metaDescription}</p>
    <h4>FAQ</h4>
    <ul>
      ${variant.content.faq?.map((item: any) => `<li><strong>Q: ${item.q}</strong><br>A: ${item.a}</li>`).join('')}
    </ul>
  </div>`;
    } else if (brief.mode === 'Ads') {
      html += `
  <div class="meta-box">
    <h3>Ad Elements</h3>
    <h4>Headlines</h4>
    <ul>${variant.content.headlines?.map((h: string) => `<li>${h}</li>`).join('')}</ul>
    <h4>CTAs</h4>
    <ul>${variant.content.ctas?.map((c: string) => `<li>${c}</li>`).join('')}</ul>
    <h4>Objections Handling</h4>
    <ul>${variant.content.objections?.map((o: string) => `<li>${o}</li>`).join('')}</ul>
  </div>`;
    } else if (brief.mode === 'PR') {
      html += `
  <div class="meta-box">
    <h3>PR Elements</h3>
    <h4>Facts</h4>
    <p>${variant.content.facts}</p>
    <h4>Why it matters</h4>
    <p>${variant.content.whyItMatters}</p>
    <h4>Soft CTA</h4>
    <p>${variant.content.softCta}</p>
  </div>`;
    }

    if (qaWarnings.length > 0) {
      html += `<h2>QA Warnings</h2>`;
      qaWarnings.forEach(w => {
        html += `<div class="warning">⚠️ ${w}</div>`;
      });
    }

    html += `</body></html>`;

    this.downloadFile(`${brief.productName.replace(/\s+/g, '_')}_export.html`, html, 'text/html');
  }
};
