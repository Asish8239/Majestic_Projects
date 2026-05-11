import { ProjectData } from "./types";

export function formatAbstract(abstract: ProjectData["abstract"]): string {
  return `${abstract.background} ${abstract.objective} ${abstract.methodology} ${abstract.results} ${abstract.conclusion}`;
}

export function formatProjectAsText(project: ProjectData): string {
  return `
TITLE: ${project.title}

DOMAIN: ${project.domain}

PROBLEM STATEMENT:
${project.problem_statement}

SOLUTION:
${project.solution}

TECH STACK:
${project.tech_stack.join(", ")}

ABSTRACT:
${formatAbstract(project.abstract)}
  `.trim();
}

export function exportAsJSON(project: ProjectData): void {
  const dataStr = JSON.stringify(project, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = `${project.title.replace(/\s+/g, "_")}.json`;
  link.click();
  
  URL.revokeObjectURL(url);
}

export function exportAsPDF(project: ProjectData): void {
  // Create a printable version
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${project.title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
          }
          h1 { color: #2563eb; margin-bottom: 10px; }
          h2 { color: #7c3aed; margin-top: 30px; margin-bottom: 10px; }
          .meta { color: #666; margin-bottom: 20px; }
          .tech-stack { display: flex; flex-wrap: wrap; gap: 10px; }
          .tech-item {
            background: #e0e7ff;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 14px;
          }
          @media print {
            body { margin: 0; padding: 20px; }
          }
        </style>
      </head>
      <body>
        <h1>${project.title}</h1>
        <div class="meta">Domain: ${project.domain}</div>
        
        <h2>Problem Statement</h2>
        <p>${project.problem_statement}</p>
        
        <h2>Solution</h2>
        <p>${project.solution}</p>
        
        <h2>Tech Stack</h2>
        <div class="tech-stack">
          ${project.tech_stack.map(tech => `<span class="tech-item">${tech}</span>`).join("")}
        </div>
        
        <h2>Abstract</h2>
        <p><strong>Background:</strong> ${project.abstract.background}</p>
        <p><strong>Objective:</strong> ${project.abstract.objective}</p>
        <p><strong>Methodology:</strong> ${project.abstract.methodology}</p>
        <p><strong>Results:</strong> ${project.abstract.results}</p>
        <p><strong>Conclusion:</strong> ${project.abstract.conclusion}</p>
      </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.focus();
  
  setTimeout(() => {
    printWindow.print();
  }, 250);
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
