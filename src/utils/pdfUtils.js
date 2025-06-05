// pdfUtils.js
export const fixRussianText = (text) => {
  // Просто возвращаем текст - современные версии jspdf поддерживают кириллицу
  return text;
  
  // Если не работает, раскомментируйте этот вариант:
  // return text.split('').map(c => 
  //   c.charCodeAt(0) > 127 ? String.fromCharCode(c.charCodeAt(0)) : c
  // ).join('');
};