// Obsługa zdjęcia
const photoInput = document.getElementById('photo');
const photoPreview = document.getElementById('photo-preview');

photoInput.addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      photoPreview.src = e.target.result;
      localStorage.setItem('photoSrc', e.target.result);
    };
    reader.readAsDataURL(file);
  } else {
    photoPreview.src = '';
    localStorage.removeItem('photoSrc');
  }
});

// Ładowanie danych z localStorage i ustawienie trybu ciemnego
window.addEventListener('DOMContentLoaded', () => {
  const fields = ['full-name', 'job-title', 'contact-info', 'work-experience', 'education', 'skills'];
  fields.forEach(id => {
    const el = document.getElementById(id);
    const saved = localStorage.getItem(id);
    if (saved) el.value = saved;

    el.addEventListener('input', () => {
      localStorage.setItem(id, el.value);
    });
  });

  // Wczytaj zdjęcie
  const savedPhoto = localStorage.getItem('photoSrc');
  if (savedPhoto) {
    photoPreview.src = savedPhoto;
  }

  // Tryb ciemny
  const toggle = document.getElementById('darkmode-toggle');
  if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    toggle.checked = true;
  }
  toggle.addEventListener('change', () => {
    if (toggle.checked) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'enabled');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'disabled');
    }
  });

  // Podpięcie przycisków
  document.getElementById('generate-btn').addEventListener('click', generateCV);
  document.getElementById('print-btn').addEventListener('click', printCV);
  document.getElementById('download-btn').addEventListener('click', downloadPDF);
});

// Generowanie podglądu CV
function generateCV() {
  const fullName = document.getElementById('full-name').value;
  const jobTitle = document.getElementById('job-title').value;
  const contactInfo = document.getElementById('contact-info').value;
  const workExperience = document.getElementById('work-experience').value;
  const education = document.getElementById('education').value;
  const skills = document.getElementById('skills').value;
  const photoSrc = photoPreview.src ? `<img src="${photoPreview.src}" alt="Zdjęcie" style="max-width: 150px; max-height: 150px; object-fit: cover; border-radius: 8px;">` : '';

  const cvContent = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <div style="text-align: center; margin-bottom: 20px;">
        ${photoSrc}
        <h1 style="margin: 10px 0;">${fullName || ''}</h1>
        <h3 style="color: gray;">${jobTitle || ''}</h3>
      </div>
      <p><strong>Dane kontaktowe:</strong><br>${contactInfo || ''}</p>
      <p><strong>Doświadczenie zawodowe:</strong><br>${workExperience || ''}</p>
      <p><strong>Szkoły, do których uczęszczałem:</strong><br>${education || ''}</p>
      <p><strong>Umiejętności:</strong><br>${skills || ''}</p>
    </div>
  `;

  document.getElementById('cv-content').innerHTML = cvContent;
}

// Drukowanie CV
function printCV() {
  const cvPreview = document.getElementById('cv-preview').innerHTML;
  const printWindow = window.open('', '', 'width=800,height=600');
  printWindow.document.write(`
    <html>
      <head>
        <title>Drukuj CV</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            padding: 0;
          }
          img {
            max-width: 150px;
            max-height: 150px;
            object-fit: cover;
            border-radius: 8px;
          }
          h1, h3 {
            text-align: center;
          }
          p {
            margin: 10px 0;
            line-height: 1.6;
          }
        </style>
      </head>
      <body>
        ${cvPreview}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}

// Pobieranie PDF
function downloadPDF() {
  const element = document.getElementById('cv-preview');
  if (!element) {
    alert('Nie znaleziono podglądu CV!');
    return;
  }
  const opt = {
    margin: 0.5,
    filename: 'CV.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(element).save();
}

