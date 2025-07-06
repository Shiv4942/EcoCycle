const bcrypt = require('bcryptjs');

const generateHashedPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    console.log('Password:', password);
    console.log('Hashed Password:', hashedPassword);
    console.log('\nCopy the hashed password above to use in MongoDB Atlas');
    
    return hashedPassword;
  } catch (error) {
    console.error('Error generating password:', error);
  }
};

// Get password from command line argument or use default
const password = process.argv[2] || 'admin123456';

generateHashedPassword(password); 