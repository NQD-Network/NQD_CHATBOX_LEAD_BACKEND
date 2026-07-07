/**
 * Validate environment variables on startup
 */
const validateEnv = () => {
  const warnings = [];
  const errors = [];

  // Optional but recommended variables
  if (!process.env.MONGODB_URI) {
    warnings.push('MONGODB_URI not set, using default: mongodb://localhost:27017/leaddb');
  }

  if (!process.env.N8N_WEBHOOK_URL) {
    warnings.push('N8N_WEBHOOK_URL not set, using default: http://localhost:5678/webhook/lead');
  }

  if (!process.env.PORT) {
    warnings.push('PORT not set, using default: 4000');
  }

  if (!process.env.ALLOWED_ORIGINS) {
    warnings.push('ALLOWED_ORIGINS not set, CORS will allow all origins (not recommended for production)');
  }

  // Log warnings
  if (warnings.length > 0) {
    console.log('\n⚠️  Environment Variable Warnings:');
    warnings.forEach(warning => console.log(`   - ${warning}`));
  }

  // Log errors and exit if critical
  if (errors.length > 0) {
    console.error('\n❌ Environment Variable Errors:');
    errors.forEach(error => console.error(`   - ${error}`));
    process.exit(1);
  }

  if (warnings.length === 0 && errors.length === 0) {
    console.log('✅ Environment variables validated');
  }
};

module.exports = validateEnv;
