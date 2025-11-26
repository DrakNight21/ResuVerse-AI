document.getElementById("resumeForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const photo = document.getElementById("photo").files[0];
  const selectedTemplate = document.getElementById("template").value;

  fetch("generate.php", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.text())
    .then((data) => {
      const resumeBox = document.getElementById("resumeContent");
      resumeBox.innerHTML = "";

      // Always keep base resume-box class for styling
      resumeBox.className = "resume-box " + selectedTemplate;

      if (photo) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const img = document.createElement("img");
          img.src = e.target.result;
          img.classList.add("resume-photo"); // Use this class in CSS
          resumeBox.appendChild(img);
          resumeBox.innerHTML += data;
        };
        reader.readAsDataURL(photo);
      } else {
        resumeBox.innerHTML = data;
      }

      document.getElementById("output").style.display = "block";
      document.getElementById("downloadBtn").style.display = "inline-block";
      document.getElementById("wordBtn").style.display = "inline-block";
    });
});


document.getElementById("downloadBtn").addEventListener("click", () => {
  const resumeContent = document.getElementById("resumeContent");

  html2canvas(resumeContent, {
    backgroundColor: "#ffffff",
    scale: 3,
    useCORS: true,
  }).then((canvas) => {
    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let position = 0;

    if (imgHeight < pageHeight) {
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    } else {
      while (position < imgHeight) {
        pdf.addImage(imgData, "JPEG", 0, -position, imgWidth, imgHeight);
        position += pageHeight;
        if (position < imgHeight) pdf.addPage();
      }
    }

    pdf.save("AI_Resume.pdf");
  });
});

document.getElementById("wordBtn").addEventListener("click", () => {
  const resumeContent = document.getElementById("resumeContent").innerText;
  const lines = resumeContent.split('\n').filter(line => line.trim() !== '');

  const { Document, Paragraph, Packer, TextRun } = docx;
  const doc = new Document();

  const children = lines.map((line) => {
    if (
      line.match(/^(Objective|Education|Skills|Experience|Projects|Name|Email|Phone|LinkedIn ID):/i)
    ) {
      const [key, ...rest] = line.split(':');
      return new Paragraph({
        children: [
          new TextRun({ text: key + ':', bold: true }),
          new TextRun(' ' + rest.join(':').trim()),
        ],
        spacing: { after: 200 },
      });
    } else {
      return new Paragraph({
        text: line,
        spacing: { after: 150 },
      });
    }
  });

  doc.addSection({ children });

  Packer.toBlob(doc).then((blob) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "AI_Resume.docx";
    link.click();
  });
});
