const { sequelize } = require('../models');
const migration = require('../migrations/add_store_id_to_order_line');

async function runMigration() {
  try {
    console.log('Running migration...');
    await migration.up(sequelize.getQueryInterface(), sequelize);
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration(); 