export const uploadImage = (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No image file uploaded'
      });
    }

    // Build public static URL pointing to the file served locally
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    return res.status(200).json({
      url: fileUrl
    });
  } catch (error) {
    next(error);
  }
};
