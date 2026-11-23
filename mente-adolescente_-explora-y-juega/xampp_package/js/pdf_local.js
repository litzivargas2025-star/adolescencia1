// Generador PDF 100% local (sin internet ni window.print) para Certificado y Tabla Emocional
(function () {
  function b64ToBytes(b64) {
    var bin = atob(b64);
    var arr = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return arr;
  }

  function buildPdfBlob(canvases) {
    var enc = new TextEncoder();
    var chunks = [];
    var total = 0;
    function pushB(u) { chunks.push(u); total += u.length; }
    function pushT(s) { pushB(enc.encode(s)); }

    pushT("%PDF-1.4\n%");
    pushB(new Uint8Array([0xe2, 0xe3, 0xcf, 0xd3, 0x0a]));

    var pageIds = [];
    var objs = [];
    canvases.forEach(function (canvas, idx) {
      var pId = 3 + idx * 3;
      var cId = pId + 1;
      var iId = pId + 2;
      pageIds.push(pId);
      var b64 = canvas.toDataURL("image/jpeg", 0.92).split(",")[1] || "";
      var jpg = b64ToBytes(b64);
      var land = canvas.width >= canvas.height;
      var pw = land ? 842 : 595;
      var ph = land ? 595 : 842;
      var stream = "q\n" + pw + " 0 0 " + ph + " 0 0 cm\n/Im0 Do\nQ\n";
      objs.push({ id: pId, fn: function () { pushT(pId + " 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 " + pw + " " + ph + "] /Resources << /XObject << /Im0 " + iId + " 0 R >> >> /Contents " + cId + " 0 R >>\nendobj\n"); } });
      objs.push({ id: cId, fn: function () { pushT(cId + " 0 obj\n<< /Length " + stream.length + " >>\nstream\n" + stream + "endstream\nendobj\n"); } });
      objs.push({ id: iId, fn: function () { pushT(iId + " 0 obj\n<< /Type /XObject /Subtype /Image /Width " + canvas.width + " /Height " + canvas.height + " /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length " + jpg.length + " >>\nstream\n"); pushB(jpg); pushT("\nendstream\nendobj\n"); } });
    });

    var maxId = 2 + canvases.length * 3;
    var offsets = new Array(maxId + 1).fill(0);
    offsets[1] = total;
    pushT("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");
    offsets[2] = total;
    pushT("2 0 obj\n<< /Type /Pages /Kids [" + pageIds.map(function (id) { return id + " 0 R"; }).join(" ") + "] /Count " + pageIds.length + " >>\nendobj\n");
    objs.sort(function (a, b) { return a.id - b.id; });
    objs.forEach(function (o) { offsets[o.id] = total; o.fn(); });

    var xref = total;
    pushT("xref\n0 " + (maxId + 1) + "\n0000000000 65535 f \n");
    for (var i = 1; i <= maxId; i++) pushT(String(offsets[i]).padStart(10, "0") + " 00000 n \n");
    pushT("trailer\n<< /Size " + (maxId + 1) + " /Root 1 0 R >>\nstartxref\n" + xref + "\n%%EOF\n");

    var merged = new Uint8Array(total);
    var pos = 0;
    chunks.forEach(function (c) { merged.set(c, pos); pos += c.length; });
    return new Blob([merged], { type: "application/pdf" });
  }

  function downloadBlob(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }

  function wrapLines(ctx, txt, maxW) {
    var words = String(txt || "").split(/\s+/);
    var lines = [], cur = "";
    words.forEach(function (w) {
      var t = cur ? cur + " " + w : w;
      if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; }
      else cur = t;
    });
    if (cur) lines.push(cur);
    return lines;
  }

  function roundBox(ctx, x, y, w, h, r, fill, stroke, lw) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lw || 3;
      ctx.stroke();
    }
  }

  window.guardarCertificadoLocalPDF = function (data) {
    var c = document.createElement("canvas");
    c.width = 1400; c.height = 990;
    var ctx = c.getContext("2d");
    var g = ctx.createLinearGradient(0, 0, 1400, 990);
    g.addColorStop(0, "#B8D8F8"); g.addColorStop(0.5, "#DFD2F2"); g.addColorStop(1, "#FFAFCC");
    ctx.fillStyle = g; ctx.fillRect(0, 0, 1400, 990);
    roundBox(ctx, 48, 48, 1304, 894, 34, "#FDFFB6", "#3A265E", 10);
    roundBox(ctx, 70, 70, 1260, 850, 26, "#FDFFB6", "#FFAFCC", 4);
    ctx.textAlign = "center";
    ctx.fillStyle = "#3A265E";
    ctx.font = "700 28px sans-serif";
    ctx.fillText("MENTE ADOLESCENTE: EXPLORA Y JUEGA", 700, 150);
    ctx.font = "800 50px sans-serif";
    ctx.fillText("CERTIFICADO DE SABIDURÍA EMOCIONAL", 700, 230);
    ctx.fillStyle = "#2B1D47";
    ctx.font = "600 24px sans-serif";
    ctx.fillText("Se otorga el presente reconocimiento a:", 700, 315);
    ctx.fillStyle = "#3A265E";
    ctx.font = "800 58px sans-serif";
    ctx.fillText(String(data.nombre || "Adolescente").toUpperCase(), 700, 400);
    ctx.fillStyle = "#2B1D47";
    ctx.font = "500 25px sans-serif";
    wrapLines(ctx, "Por fortalecer la regulación de la emoción " + (data.emocion || "Miedo") + " con estrategias saludables.", 980).forEach(function (ln, i) {
      ctx.fillText(ln, 700, 480 + i * 36);
    });
    roundBox(ctx, 210, 585, 980, 120, 22, "#FFAFCC", "#3A265E", 4);
    ctx.fillStyle = "#2B1D47";
    ctx.font = "700 24px sans-serif";
    wrapLines(ctx, "“" + (data.frase || "") + "”", 900).slice(0, 2).forEach(function (ln, i) {
      ctx.fillText(ln, 700, 640 + i * 34);
    });
    roundBox(ctx, 130, 765, 1140, 90, 18, "#B9FBC0", "#3A265E", 3);
    ctx.fillStyle = "#3A265E";
    ctx.font = "700 22px sans-serif";
    ctx.textAlign = "left"; ctx.fillText("Folio: " + (data.codigo || "MA-2026"), 170, 818);
    ctx.textAlign = "right"; ctx.fillText("Fecha: " + (data.fecha || ""), 1230, 818);
    var blob = buildPdfBlob([c]);
    downloadBlob(blob, "Certificado_Mente_Adolescente.pdf");
  };

  window.guardarTablaEmocionalLocalPDF = function (data) {
    var c = document.createElement("canvas");
    c.width = 1240; c.height = 1754;
    var ctx = c.getContext("2d");
    var g = ctx.createLinearGradient(0, 0, 1240, 1754);
    g.addColorStop(0, "#B8D8F8"); g.addColorStop(0.5, "#C8E2FC"); g.addColorStop(1, "#DFD2F2");
    ctx.fillStyle = g; ctx.fillRect(0, 0, 1240, 1754);
    roundBox(ctx, 56, 56, 1128, 145, 24, "#3A265E", "#FFAFCC", 5);
    ctx.textAlign = "left"; ctx.fillStyle = "#FDFFB6"; ctx.font = "800 40px sans-serif";
    ctx.fillText("TABLA DE SEGUIMIENTO EMOCIONAL", 90, 118);
    ctx.fillStyle = "#B9FBC0"; ctx.font = "600 22px sans-serif";
    ctx.fillText((data.nombre || "") + " · Emoción: " + (data.emocion || ""), 90, 162);
    roundBox(ctx, 56, 232, 1128, 1420, 24, "#C8E2FC", "#3A265E", 4);
    roundBox(ctx, 84, 268, 1072, 50, 10, "#FFD6A5", "#3A265E", 2);
    ctx.fillStyle = "#3A265E"; ctx.font = "800 19px sans-serif";
    ctx.fillText("Actividad", 104, 300); ctx.fillText("Emoción", 385, 300); ctx.fillText("Puntos", 605, 300); ctx.fillText("Detalle", 720, 300);
    var rows = (data.resultados || []).slice(0, 16);
    if (!rows.length) {
      roundBox(ctx, 84, 340, 1072, 74, 12, "#FDFFB6", "#3A265E", 2);
      ctx.fillStyle = "#2B1D47"; ctx.font = "600 20px sans-serif";
      ctx.fillText("Aún no hay resultados registrados en la tabla.", 104, 384);
    } else {
      rows.forEach(function (r, idx) {
        var ry = 334 + idx * 78;
        roundBox(ctx, 84, ry, 1072, 66, 10, idx % 2 === 0 ? "#DFD2F2" : "#FDFFB6", "#3A265E", 2);
        ctx.fillStyle = "#3A265E"; ctx.font = "700 17px sans-serif";
        ctx.fillText(String(r.actividad || "").slice(0, 26), 104, ry + 40);
        ctx.fillStyle = "#2B1D47"; ctx.font = "600 17px sans-serif";
        ctx.fillText(String(r.emocion || "").slice(0, 18), 385, ry + 40);
        ctx.fillText("+" + (r.puntos || 0) + " pts", 605, ry + 40);
        ctx.fillText(String(r.detalle || "").slice(0, 42), 720, ry + 40);
      });
    }
    var blob = buildPdfBlob([c]);
    downloadBlob(blob, "Tabla_Emocional_Mente_Adolescente.pdf");
  };
})();
