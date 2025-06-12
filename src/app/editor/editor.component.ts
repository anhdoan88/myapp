import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as katex from 'katex';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-editor',
  imports: [CommonModule, FormsModule, ],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
})
export class EditorComponent implements OnInit {
@ViewChild('preview', { static: true }) previewElement!: ElementRef;

latexInput: string = `\\documentclass{article}
\\usepackage{amsmath}
\\begin{document}

\\title{My LaTeX Document}
\\author{Your Name}
\\date{\\today}
\\maketitle

\\section{Introduction}
This is a sample LaTeX document with math:

\\begin{equation}
E = mc^2
\\end{equation}

\\section{More Math}
Inline math: $\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$

\\subsection{Matrix Example}
\\begin{equation}
\\begin{pmatrix}
a & b \\\\
c & d
\\end{pmatrix}
\\end{equation}

\\end{document}`;

renderedOutput: string = '';

 constructor() { }

  ngOnInit(): void {
    this.renderLatex();
  }

onLatexChange(event:any): void{
  this.latexInput = event.target.value;
  this.renderLatex();
}

renderLatex(): void {
    try {
      let output = this.latexInput;
      
      // Remove document class and preamble
      output = output.replace(/\\documentclass\{[^}]+\}/g, '');
      output = output.replace(/\\usepackage\{[^}]+\}/g, '');
      output = output.replace(/\\begin\{document\}/g, '');
      output = output.replace(/\\end\{document\}/g, '');

      // Handle title, author, date
      output = output.replace(/\\title\{([^}]+)\}/g, '<h1 class="title">$1</h1>');
      output = output.replace(/\\author\{([^}]+)\}/g, '<p class="author">By $1</p>');
      output = output.replace(/\\date\{([^}]+)\}/g, '<p class="date">$1</p>');
      output = output.replace(/\\maketitle/g, '<div class="title-section"></div>');

      // Handle sections
      output = output.replace(/\\section\{([^}]+)\}/g, '<h2>$1</h2>');
      output = output.replace(/\\subsection\{([^}]+)\}/g, '<h3>$1</h3>');
      output = output.replace(/\\subsubsection\{([^}]+)\}/g, '<h4>$1</h4>');

      // Handle math environments first (before inline math)
      output = output.replace(/\\begin\{equation\}([\s\S]*?)\\end\{equation\}/g, (match, math) => {
        try {
          return `<div class="equation">${katex.renderToString(math.trim(), { displayMode: true })}</div>`;
        } catch (e) {
          return `<div class="error">Error in equation: ${e}</div>`;
        }
      });

      output = output.replace(/\\begin\{align\}([\s\S]*?)\\end\{align\}/g, (match, math) => {
        try {
          return `<div class="equation">${katex.renderToString(math.trim(), { displayMode: true })}</div>`;
        } catch (e) {
          return `<div class="error">Error in align: ${e}</div>`;
        }
      });

      // Handle pmatrix, bmatrix environments
      output = output.replace(/\\begin\{pmatrix\}([\s\S]*?)\\end\{pmatrix\}/g, (match, content) => {
        return `\\begin{pmatrix}${content}\\end{pmatrix}`;
      });

      // Handle display math $...$
      output = output.replace(/\$\$([^$]+)\$\$/g, (match, math) => {
        try {
          return `<div class="equation">${katex.renderToString(math, { displayMode: true })}</div>`;
        } catch (e : any) {
          return `<div class="error">Error: ${e.message}</div>`;
        }
      });

      // Handle inline math $...$
      output = output.replace(/\$([^$]+)\$/g, (match, math) => {
        try {
          return katex.renderToString(math, { displayMode: false });
        } catch (e) {
          return `<span class="error">Error: ${math}</span>`;
        }
      });

      // Handle text formatting
      output = output.replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>');
      output = output.replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>');
      output = output.replace(/\\underline\{([^}]+)\}/g, '<u>$1</u>');

      // Handle lists
      output = output.replace(/\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g, (match, items) => {
        const listItems = items.replace(/\\item\s+([^\n]+)/g, '<li>$1</li>');
        return `<ul>${listItems}</ul>`;
      });

      output = output.replace(/\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g, (match, items) => {
        const listItems = items.replace(/\\item\s+([^\n]+)/g, '<li>$1</li>');
        return `<ol>${listItems}</ol>`;
      });

      // Handle line breaks and paragraphs
      output = output.replace(/\\\\/g, '<br>');
      output = output.replace(/\n\s*\n/g, '</p><p>');
      
      // Wrap in paragraph tags
      output = output.trim();
      if (output && !output.startsWith('<')) {
        output = `<p>${output}</p>`;
      }

      // Clean up empty paragraphs
      output = output.replace(/<p>\s*<\/p>/g, '');
      output = output.replace(/<p>(\s*<[^>]+>\s*)*<\/p>/g, '$1');

      this.renderedOutput = output;
    } catch (error) {
      this.renderedOutput = `<div class="error">Rendering error: ${error}</div>`;
    }
  }

  async downloadPDF(): Promise<void> {
    try {
      const { default: html2canvas } = await import('html2canvas');
      const { default: jsPDF } = await import('jspdf');
      
      const element = this.previewElement.nativeElement.querySelector('.rendered-output');
      if (!element) return;

      // Convert HTML to canvas with better options
      const canvas = await html2canvas(element, {
        scale: 1.5, // Reduced from 2 for better file size
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight
      });

      // PDF dimensions (A4 in mm)
      const pdfWidth = 210;
      const pdfHeight = 297;
      
      // Margins in mm
      const marginLeft = 20;
      const marginRight = 20;
      const marginTop = 20;
      const marginBottom = 20;
      
      // Available content area
      const contentWidth = pdfWidth - marginLeft - marginRight;
      const contentHeight = pdfHeight - marginTop - marginBottom;
      
      // Calculate scaling to fit content width
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * contentWidth) / canvas.width;
      
      const doc = new jsPDF('p', 'mm', 'a4');
      
      let yPosition = marginTop;
      let remainingHeight = imgHeight;
      let sourceY = 0;
      
      while (remainingHeight > 0) {
        // Calculate how much of the image fits on current page
        const pageContentHeight = Math.min(remainingHeight, contentHeight);
        const sourceHeight = (pageContentHeight / imgHeight) * canvas.height;
        
        // Create a temporary canvas for this page portion
        const pageCanvas = document.createElement('canvas');
        const pageContext = pageCanvas.getContext('2d')!;
        
        pageCanvas.width = canvas.width;
        pageCanvas.height = sourceHeight;
        
        // Draw the portion of the original canvas
        pageContext.drawImage(
          canvas,
          0, sourceY, canvas.width, sourceHeight,
          0, 0, canvas.width, sourceHeight
        );
        
        // Add to PDF
        doc.addImage(
          pageCanvas.toDataURL('image/png'),
          'PNG',
          marginLeft,
          yPosition,
          imgWidth,
          pageContentHeight
        );
        
        remainingHeight -= pageContentHeight;
        sourceY += sourceHeight;
        
        // Add new page if there's more content
        if (remainingHeight > 0) {
          doc.addPage();
          yPosition = marginTop;
        }
      }

      // Save PDF
      doc.save('latex-document.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  }

}
