import { UserSessionData } from "../components/AuthAndPanelSection";

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function buildPdfFromCanvases(canvases: HTMLCanvasElement[]): Blob {
  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  const pushBytes = (arr: Uint8Array) => {
    chunks.push(arr);
    totalBytes += arr.length;
  };
  const pushText = (txt: string) => pushBytes(encoder.encode(txt));

  // Header PDF-1.4 con marcador binario
  pushBytes(encoder.encode("%PDF-1.4\n%"));
  pushBytes(new Uint8Array([0xe2, 0xe3, 0xcf, 0xd3, 0x0a]));

  const pageIds: number[] = [];
  const nextObjStart = 3; // 1 = Catalog, 2 = Pages

  const objectsToWrite: { id: number; write: () => void }[] = [];

  canvases.forEach((canvas, idx) => {
    const pageObjId = nextObjStart + idx * 3;
    const contentObjId = pageObjId + 1;
    const imgObjId = pageObjId + 2;
    pageIds.push(pageObjId);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    const jpegBase64 = dataUrl.split(",")[1] || "";
    const jpegBytes = base64ToUint8Array(jpegBase64);

    // Puntos PDF A4 (595 x 842) adaptados al aspecto del canvas
    const isLandscape = canvas.width >= canvas.height;
    const pdfW = isLandscape ? 842 : 595;
    const pdfH = isLandscape ? 595 : 842;

    const contentStream = `q\n${pdfW} 0 0 ${pdfH} 0 0 cm\n/Im0 Do\nQ\n`;

    objectsToWrite.push({
      id: pageObjId,
      write: () => {
        pushText(
          `${pageObjId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pdfW} ${pdfH}] /Resources << /XObject << /Im0 ${imgObjId} 0 R >> >> /Contents ${contentObjId} 0 R >>\nendobj\n`
        );
      }
    });

    objectsToWrite.push({
      id: contentObjId,
      write: () => {
        pushText(
          `${contentObjId} 0 obj\n<< /Length ${contentStream.length} >>\nstream\n${contentStream}endstream\nendobj\n`
        );
      }
    });

    objectsToWrite.push({
      id: imgObjId,
      write: () => {
        pushText(
          `${imgObjId} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`
        );
        pushBytes(jpegBytes);
        pushText(`\nendstream\nendobj\n`);
      }
    });
  });

  const maxObjId = 2 + canvases.length * 3;
  const offsets: number[] = new Array(maxObjId + 1).fill(0);

  // Obj 1: Catalog
  offsets[1] = totalBytes;
  pushText("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");

  // Obj 2: Pages
  offsets[2] = totalBytes;
  pushText(
    `2 0 obj\n<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>\nendobj\n`
  );

  // Remaining page/content/image objects in order
  objectsToWrite.sort((a, b) => a.id - b.id);
  for (const item of objectsToWrite) {
    offsets[item.id] = totalBytes;
    item.write();
  }

  const xrefOffset = totalBytes;
  pushText(`xref\n0 ${maxObjId + 1}\n`);
  pushText("0000000000 65535 f \n");
  for (let i = 1; i <= maxObjId; i++) {
    pushText(`${String(offsets[i]).padStart(10, "0")} 00000 n \n`);
  }
  pushText(`trailer\n<< /Size ${maxObjId + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`);

  const merged = new Uint8Array(totalBytes);
  let pos = 0;
  for (const ch of chunks) {
    merged.set(ch, pos);
    pos += ch.length;
  }

  return new Blob([merged], { type: "application/pdf" });
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

function wrapTextLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawRoundedBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fill: string,
  stroke?: string,
  lineWidth = 3
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}

function renderCertificateCanvas(sessionData: UserSessionData): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 1400;
  canvas.height = 990;
  const ctx = canvas.getContext("2d")!;

  // Fondo degradado pastel sin blancos
  const grad = ctx.createLinearGradient(0, 0, 1400, 990);
  grad.addColorStop(0, "#B8D8F8");
  grad.addColorStop(0.5, "#DFD2F2");
  grad.addColorStop(1, "#FFAFCC");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1400, 990);

  // Tarjeta principal Limón Pastel
  drawRoundedBox(ctx, 48, 48, 1304, 894, 34, "#FDFFB6", "#3A265E", 10);
  drawRoundedBox(ctx, 70, 70, 1260, 850, 26, "#FDFFB6", "#FFAFCC", 4);

  // Emblema hexagonal superior
  ctx.save();
  ctx.translate(700, 152);
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const ang = (Math.PI / 3) * i - Math.PI / 6;
    const px = Math.cos(ang) * 44;
    const py = Math.sin(ang) * 44;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = "#CDB4DB";
  ctx.fill();
  ctx.strokeStyle = "#3A265E";
  ctx.lineWidth = 5;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-14, 2);
  ctx.lineTo(-4, 14);
  ctx.lineTo(18, -12);
  ctx.strokeStyle = "#3A265E";
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();
  ctx.restore();

  ctx.textAlign = "center";
  ctx.fillStyle = "#3A265E";
  ctx.font = "700 26px 'Work Sans', sans-serif";
  ctx.fillText("MENTE ADOLESCENTE: EXPLORA Y JUEGA", 700, 232);

  ctx.font = "800 54px 'Barlow Condensed', sans-serif";
  ctx.fillText("CERTIFICADO PERSONALIZADO DE SABIDURÍA EMOCIONAL", 700, 298);

  ctx.fillStyle = "#2B1D47";
  ctx.font = "600 24px 'Work Sans', sans-serif";
  ctx.fillText("Se otorga el presente reconocimiento a:", 700, 362);

  ctx.fillStyle = "#3A265E";
  ctx.font = "800 66px 'Barlow Condensed', sans-serif";
  ctx.fillText(sessionData.usuario.nombre_completo.toUpperCase(), 700, 444);

  // Línea decorativa
  ctx.beginPath();
  ctx.moveTo(310, 468);
  ctx.lineTo(1090, 468);
  ctx.strokeStyle = "#3A265E";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = "#2B1D47";
  ctx.font = "500 25px 'Work Sans', sans-serif";
  const bodyMsg = `Por explorar y fortalecer la regulación de la emoción ${sessionData.plan.emocion_a_trabajar}, aplicando estrategias saludables de empatía, asertividad y autocuidado adolescente.`;
  const bodyLines = wrapTextLines(ctx, bodyMsg, 980);
  bodyLines.forEach((ln, idx) => {
    ctx.fillText(ln, 700, 526 + idx * 36);
  });

  // Caja de frase motivacional
  drawRoundedBox(ctx, 220, 628, 960, 122, 22, "#FFAFCC", "#3A265E", 4);
  ctx.fillStyle = "#2B1D47";
  ctx.font = "700 24px 'Work Sans', sans-serif";
  const quoteLines = wrapTextLines(ctx, `“${sessionData.plan.frase_motivacional}”`, 880);
  quoteLines.slice(0, 2).forEach((ln, idx) => {
    ctx.fillText(ln, 700, 682 + idx * 34);
  });

  // Resumen rápido de actividades y folio
  const totalPts = sessionData.resultados.reduce((s, r) => s + Number(r.puntos_empatia || 0), 0);
  drawRoundedBox(ctx, 130, 790, 1140, 88, 18, "#B9FBC0", "#3A265E", 3);
  ctx.font = "700 22px 'Work Sans', sans-serif";
  ctx.fillStyle = "#3A265E";
  ctx.textAlign = "left";
  ctx.fillText(`Folio: ${sessionData.plan.codigo_certificado}`, 165, 842);
  ctx.textAlign = "center";
  ctx.fillText(`Puntos Emocionales: +${totalPts} pts (${sessionData.resultados.length} actividades)`, 700, 842);
  ctx.textAlign = "right";
  ctx.fillText(`Fecha: ${new Date().toLocaleDateString("es-MX")}`, 1235, 842);

  return canvas;
}

function renderEmotionTableCanvas(sessionData: UserSessionData): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 1240;
  canvas.height = 1754;
  const ctx = canvas.getContext("2d")!;

  const grad = ctx.createLinearGradient(0, 0, 1240, 1754);
  grad.addColorStop(0, "#B8D8F8");
  grad.addColorStop(0.5, "#C8E2FC");
  grad.addColorStop(1, "#DFD2F2");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1240, 1754);

  // Encabezado
  drawRoundedBox(ctx, 56, 56, 1128, 150, 24, "#3A265E", "#FFAFCC", 5);
  ctx.fillStyle = "#FDFFB6";
  ctx.textAlign = "left";
  ctx.font = "800 44px 'Barlow Condensed', sans-serif";
  ctx.fillText("TABLA Y PLAN DE SEGUIMIENTO EMOCIONAL", 92, 120);
  ctx.fillStyle = "#B9FBC0";
  ctx.font = "600 22px 'Work Sans', sans-serif";
  ctx.fillText(
    `${sessionData.usuario.nombre_completo} (${sessionData.usuario.edad} años) · Emoción principal: ${sessionData.plan.emocion_a_trabajar}`,
    92,
    168
  );

  // Caja Situación y Estrategias
  drawRoundedBox(ctx, 56, 232, 1128, 410, 24, "#DFD2F2", "#3A265E", 4);
  ctx.fillStyle = "#3A265E";
  ctx.font = "800 30px 'Barlow Condensed', sans-serif";
  ctx.fillText("SITUACIÓN A RESOLVER Y ESTRATEGIAS RECOMENDADAS", 88, 282);

  ctx.fillStyle = "#2B1D47";
  ctx.font = "600 21px 'Work Sans', sans-serif";
  const sitLines = wrapTextLines(ctx, `Situación: ${sessionData.plan.situacion_resolver}`, 1050);
  let cy = 324;
  sitLines.slice(0, 3).forEach((ln) => {
    ctx.fillText(ln, 88, cy);
    cy += 30;
  });

  const estrategias = [
    `1. ${sessionData.plan.estrategia_1}`,
    `2. ${sessionData.plan.estrategia_2}`,
    `3. ${sessionData.plan.estrategia_3}`
  ];
  cy += 14;
  estrategias.forEach((st) => {
    drawRoundedBox(ctx, 88, cy - 26, 1060, 48, 12, "#FDFFB6", "#3A265E", 2);
    ctx.fillStyle = "#2B1D47";
    ctx.font = "600 18px 'Work Sans', sans-serif";
    ctx.fillText(st.slice(0, 92), 106, cy + 5);
    cy += 60;
  });

  drawRoundedBox(ctx, 88, cy - 12, 1060, 74, 14, "#B9FBC0", "#3A265E", 2);
  ctx.fillStyle = "#2B1D47";
  ctx.font = "600 18px 'Work Sans', sans-serif";
  const happyLines = wrapTextLines(ctx, `Cómo cultivar felicidad: ${sessionData.plan.como_ser_feliz}`, 1020);
  happyLines.slice(0, 2).forEach((ln, i) => {
    ctx.fillText(ln, 106, cy + 18 + i * 24);
  });

  // Tabla de Emoción / Resultados
  const tableTop = 674;
  drawRoundedBox(ctx, 56, tableTop, 1128, 970, 24, "#C8E2FC", "#3A265E", 4);
  ctx.fillStyle = "#3A265E";
  ctx.font = "800 32px 'Barlow Condensed', sans-serif";
  ctx.fillText("TABLA DE ACTIVIDADES Y REGULACIÓN EMOCIONAL", 88, tableTop + 50);

  // Cabecera de tabla
  const hy = tableTop + 78;
  drawRoundedBox(ctx, 84, hy, 1072, 48, 10, "#FFD6A5", "#3A265E", 2);
  ctx.fillStyle = "#3A265E";
  ctx.font = "800 19px 'Work Sans', sans-serif";
  ctx.fillText("Actividad", 102, hy + 31);
  ctx.fillText("Emoción", 385, hy + 31);
  ctx.fillText("Puntos", 605, hy + 31);
  ctx.fillText("Detalle y Avance", 715, hy + 31);

  const rows = sessionData.resultados.slice(0, 11);
  if (rows.length === 0) {
    drawRoundedBox(ctx, 84, hy + 66, 1072, 70, 12, "#FDFFB6", "#3A265E", 2);
    ctx.fillStyle = "#2B1D47";
    ctx.font = "600 20px 'Work Sans', sans-serif";
    ctx.fillText("Aún no hay actividades registradas. Completa los minijuegos para llenar tu tabla.", 104, hy + 108);
  } else {
    rows.forEach((r, idx) => {
      const ry = hy + 62 + idx * 74;
      const rowBg = idx % 2 === 0 ? "#DFD2F2" : "#FDFFB6";
      drawRoundedBox(ctx, 84, ry, 1072, 64, 10, rowBg, "#3A265E", 2);
      ctx.fillStyle = "#3A265E";
      ctx.font = "700 17px 'Work Sans', sans-serif";
      ctx.fillText((r.actividad || "").slice(0, 26), 102, ry + 38);
      ctx.fillStyle = "#2B1D47";
      ctx.font = "600 17px 'Work Sans', sans-serif";
      ctx.fillText((r.emocion_trabajada || "").slice(0, 18), 385, ry + 38);
      ctx.fillText(`+${r.puntos_empatia} pts`, 605, ry + 38);
      const detLines = wrapTextLines(ctx, r.detalle_resultado || "", 425);
      detLines.slice(0, 2).forEach((ln, li) => {
        ctx.fillText(ln, 715, ry + 27 + li * 22);
      });
    });
  }

  ctx.fillStyle = "#3A265E";
  ctx.textAlign = "center";
  ctx.font = "700 18px 'Work Sans', sans-serif";
  ctx.fillText(
    `Generado sin conexión por Mente Adolescente · Folio ${sessionData.plan.codigo_certificado} · ${new Date().toLocaleDateString("es-MX")}`,
    620,
    1700
  );

  return canvas;
}

export function downloadCertificatePdf(sessionData: UserSessionData) {
  const certCanvas = renderCertificateCanvas(sessionData);
  const tableCanvas = renderEmotionTableCanvas(sessionData);
  const pdfBlob = buildPdfFromCanvases([certCanvas, tableCanvas]);
  const safeApodo = (sessionData.usuario.apodo || "adolescente").replace(/[^a-zA-Z0-9_-]/g, "_");
  triggerBlobDownload(pdfBlob, `Certificado_Mente_Adolescente_${safeApodo}.pdf`);
}

export function downloadEmotionTablePdf(sessionData: UserSessionData) {
  const tableCanvas = renderEmotionTableCanvas(sessionData);
  const pdfBlob = buildPdfFromCanvases([tableCanvas]);
  const safeApodo = (sessionData.usuario.apodo || "adolescente").replace(/[^a-zA-Z0-9_-]/g, "_");
  triggerBlobDownload(pdfBlob, `Tabla_Emocional_${safeApodo}.pdf`);
}
