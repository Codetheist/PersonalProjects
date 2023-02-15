const form = document.getElementById('form-generator');
const qr_code = document.getElementById('qrcode');

// Submit form
const submitForm = (e) => {
    e.preventDefault();

    clearQRCode();

    const url = document.getElementById('url').value;
    const size = document.getElementById('size').value;

    if (url === '') {
        alert('Please enter a URL');
    } else {
        showSpinner();

        setTimeout(() => {
            hideSpinner();
            generateQrCode(url, size);

            setTimeout(() => {
                const saveLink = qr_code.querySelector('img').src;

                saveButton(saveLink);
            }, 50);
        }, 1000);
    }
}

// Generate QR Code
const generateQrCode = (url, size) => {
    const qrcode = new QRCode('qrcode', {
        text: url,
        width: size,
        height: size
    });
}

// Clear QR Code
const clearQRCode = () => {
    qr_code.innerHTML = '';
    const submitButton = document.getElementById('data-link');
    if (submitButton) {
        submitButton.remove();
    }
}

// Show spinner
const showSpinner = () => {
    const spinner = document.getElementById('spinner');
    spinner.style.display = 'block';
}

// Hide spinner
const hideSpinner = () => {
    const spinner = document.getElementById('spinner');
    spinner.style.display = 'none';
}

// Save button
const saveButton = (saveLink) => {
    const dataLink = document.createElement('a');
    dataLink.id = 'data-link';
    dataLink.classList = 'bg-blue-800 hover:bg-black text-white font-bold py-2 rounded w-1/3 m-auto my-5';
    dataLink.href = saveLink;
    dataLink.download = 'qrcode';
    dataLink.innerHTML = 'Save';
    document.getElementById('generated').appendChild(dataLink);
}

hideSpinner();

form.addEventListener('submit', submitForm);