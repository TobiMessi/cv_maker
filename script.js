<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Generator CV</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: #f4f4f4;
        }
        .container {
            max-width: 700px;
            margin: 30px auto;
            background: #fff;
            padding: 30px 40px;
            border-radius: 12px;
            box-shadow: 0 4px 18px #0002;
        }
        .form-group {
            margin-bottom: 18px;
        }
        label {
            display: block;
            font-weight: bold;
            margin-bottom: 6px;
        }
        input[type="text"], textarea {
            width: 100%;
            padding: 8px;
            border: 1px solid #bbb;
            border-radius: 4px;
            box-sizing: border-box;
        }
        textarea {
            resize: vertical;
            min-height: 40px;
        }
        #photo-preview {
            display: block;
            max-width: 140px;
            max-height: 140px;
            margin-top: 12px;
            border-radius: 8px;
            object-fit: cover;
            border: 1px solid #ccc;
        }
        .buttons {
            margin-top: 20px;
            display: flex;
            gap: 10px;
        }
        .buttons button {
            padding: 8px 16px;
            font-size: 1rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            background: #1976d2;
            color: #fff;
            transition: background 0.2s;
        }
        .buttons button:hover {
            background: #125ea9;
        }
        #cv-preview {
            margin-top: 32px;
            background: #f9f9f9;
            padding: 24px;
            border-radius: 10px;
            box-shadow: 0 2px 8px #0001;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Generator CV</h2>
        <div class="form-group">
            <label for="photo">Zdjęcie:</label>
            <input type="file" id="photo" accept="image/*">
            <img id="photo-preview" src="" alt="Podgląd zdjęcia" />
        </div>
        <div class="form-group">
            <label for="full-name">Imię i nazwisko:</label>
            <input type="text" id="full-name">
        </div>
        <div class="form-group">
            <label for="job-title">Stanowisko:</label>
            <input type="text" id="job-title">
        </div>
        <div class="form-group">
            <label for="contact-info">Dane kontaktowe:</label>
            <textarea id="contact-info"></textarea>
        </div>
        <div class="form-group">
            <label for="work-experience">Doświadczenie zawodowe:</label>
            <textarea id="work-experience"></textarea>
        </div>
        <div class="form-group">
            <label for="education">Szkoły, do których uczęszczałem:</label>
            <textarea id="education"></textarea>
        </div>
        <div class="form-group">
            <label for="skills">Umiejętności:</label>
            <textarea id="skills"></textarea>
        </div>
        <div class="buttons">
            <button type="button" onclick="generateCV()">Generuj podgląd</button>
            <button type="button" onclick="printCV()">Drukuj CV</button>
            <button type="button" onclick="downloadPDF()">Pobierz PDF</button>
        </div>
        <div id="cv-preview">
            <div id="cv-content"></div>
        </div>
    </div>

    <!-- DODAJ TEN SKRYPT html2pdf.js - NIE ZMIENIAJ TEGO! -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>

    <script>
        // Obsługa podglądu zdjęcia
        const photoInput = document.getElementById('photo');
        const photoPreview = document.getElementById('photo-preview');
        photoInput.addEventListener('change', function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    photoPreview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            } else {
                photoPreview.src = '';
            }
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

        // Funkcja do drukowania CV
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

        // NIE ZMIENIAJ TEJ FUNKCJI - to jest dodatek do pobierania PDF!
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
    </script>
</body>
</html>
