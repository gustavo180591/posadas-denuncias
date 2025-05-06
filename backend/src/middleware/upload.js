const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurar almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    
    // Crear directorio si no existe
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generar nombre único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Filtrar archivos
const fileFilter = (req, file, cb) => {
  // Tipos de archivo permitidos
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, GIF) y videos (MP4).'), false);
  }
};

// Configurar límites
const limits = {
  fileSize: 10 * 1024 * 1024, // 10MB
  files: 5 // Máximo 5 archivos por denuncia
};

// Crear middleware de upload
const upload = multer({
  storage,
  fileFilter,
  limits
});

module.exports = upload; 