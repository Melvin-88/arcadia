export const downloadFile = (file: File | Blob, filename = 'export.txt') => {
  // @ts-ignore ignored cause we need to just check IE support to fallback
  if (window.navigator.msSaveOrOpenBlob) {
    // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
    window.navigator.msSaveBlob(file, filename);
  } else {
    const a = window.document.createElement('a');

    a.href = window.URL.createObjectURL(file);
    a.download = filename;
    document.body.appendChild(a);

    // IE: "Access is denied";
    // see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
    a.click();
    document.body.removeChild(a);
  }
};

export const saveStringAsFile = (content: string, filename = 'export.txt') => {
  const encodedContent = new TextEncoder().encode(content);
  const blob = new Blob([encodedContent], {
    type: 'text/plain;charset=utf-8',
  });

  downloadFile(blob, filename);
};

export const saveVideoFile = (data: File, filename = 'export.mp4') => {
  const urlData = new Blob([data]);

  downloadFile(urlData, filename);
};
