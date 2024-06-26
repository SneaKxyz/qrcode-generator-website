// The 'qrcode.js' module is used to generate qrcode.
// The github page for 'qrcode.js' => 'https://github.com/davidshimjs/qrcodejs'.


// QRCODE PANEL


document.addEventListener('DOMContentLoaded', (event) => {
  const fileSelectorLink  = document.getElementById('fileSelectorLink'); // file import button
  const hiddenFileInput = document.getElementById('hiddenFileInput');
  const fileNameDisplayInput = document.getElementById('fileNameDisplayInput'); // text field for qrcode value
  const qrcodeFrame = document.getElementById('qrcode_frame');
  const qrCodeContainer = document.getElementById('qrcode');

  // buttons
  const generateQRLink = document.getElementById('generateQRLink'); // generate qrcode based on the input value
  // const removeInputLink = document.getElementById('removeInputLink'); // clears the value entered in the input
  const download_btn  = document.getElementById('download_btn'); // suggests saving the qrcode
  // const darkMode = document.getElementById('darkMode'); // dark-theme
  
  // qrcode stats
  const qrcode_size = document.getElementById('qrcode_size');
  const units = {
    0: 'octets',
    3: 'Ko',
    6: 'Mo',
    9: 'Go',
    12: 'To'
  }


  resetInput()
  
  // darkMode.addEventListener('click', () => {
  //   document.body.classList.toggle('dark_theme');
  //   darkMode.classList.toggle('active');
    
  //   if (document.body.classList.contains("dark_theme")) {
  //     // darkMode.src = "./sources/images/sun.png";

  //     fileSelectorLink.classList.add('invert_icon');
  //     download_btn.classList.add('invert_icon');

  //   } else {
  //     // darkMode.src = "./sources/images/moon.svg";

  //     fileSelectorLink.classList.remove('invert_icon');
  //     download_btn.classList.remove('invert_icon');
  //   }
  // });
  
  fileNameDisplayInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      generateQRCode();
    }
  });

  fileNameDisplayInput.addEventListener('change', (e) => {
    generateQRCode();
  });

  generateQRLink.addEventListener('click', (e) => {
    generateQRCode();
  });

  function generateQRCode() {
    
    const value = fileNameDisplayInput.value;
    
    if (value.trim() !== '') {
      
      qrCodeContainer.innerHTML = ''; // delete previous qrcode
      new QRCode(qrCodeContainer, value); // Generate new qrcode

      qrcodeActions(get_size=true);

      qrcodeFrame.classList.add('active');
      
    } else {
      
      qrcodeFrame.classList.remove('active');
    
      qrCodeContainer.innerHTML = '';
      alert('Please enter a value to generate a qrcode.');
      
    }
  }


  download_btn.addEventListener('click', function(event) {
    event.preventDefault();
    qrcodeActions();
  });


  // removeInputLink.addEventListener('click', function(event) {
  //   event.preventDefault();
  //   resetInput();

  //   qrCodeContainer.innerHTML = '';
  // });

  function resetInput() {
    fileNameDisplayInput.value = '';
    hiddenFileInput.value = '';
    fileNameDisplayInput.removeEventListener('focus', preventFocus);
  }

  fileSelectorLink.addEventListener('click', (e) => {
    e.preventDefault();
    hiddenFileInput.click();
  });

  hiddenFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];

    if (file) {
      resetInput();
      
      fileNameDisplayInput.value = file.name;
      
      generateQRCode();
    }
  });

  function preventFocus() {
    this.blur(); // prevents access to the text field when the qrcode is generated and it has not been deleted
  }

  function qrcodeActions(get_size=false) {
    setTimeout(() => {
      const qrCodeImage = qrCodeContainer.querySelector('img').src;

      fetch(qrCodeImage)
        .then(response => response.blob())
        .then(blob => {

          if (get_size === true) {

            const fileSize = blob.size;
            qrcode_size.innerText = findUnit(fileSize);

          } else {

            const link = document.createElement('a');

            link.href = URL.createObjectURL(blob);
            link.download = 'qrcode.png';
            link.click();

            URL.revokeObjectURL(link.href);
          }


        });

    }, 100);
  }

  function findUnit(size) {
    let k = 0;

    while (size >= Math.pow(10, k)) {
      k += 3;
    }

    let value = size / Math.pow(10, k-3);
    value = value.toFixed(2)

    return value + ' ' + units[k-3];
  }

});
