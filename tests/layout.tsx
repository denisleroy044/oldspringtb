# Fix the settings utility
cat > src/lib/settings/index.ts << 'EOF'
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

let settingsCache: any = null;
let cacheTime: number = 0;
const CACHE_TTL = 60000; // 1 minute

export async function getSettings(forceRefresh: boolean = false) {
  const now = Date.now();
  
  if (!forceRefresh && settingsCache && (now - cacheTime) < CACHE_TTL) {
    return settingsCache;
  }

  try {
    const result = await pool.query('SELECT key, value FROM public.settings');
    
    const settings = result.rows.reduce((acc: any, row: any) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
    
    settingsCache = settings;
    cacheTime = now;
    return settings;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return {};
  }
}

export async function getSetting(key: string) {
  try {
    const settings = await getSettings();
    return settings[key] || null;
  } catch (error) {
    console.error('Error getting setting:', error);
    return null;
  }
}

export async function updateSetting(key: string, value: any, userId?: string) {
  try {
    const result = await pool.query(
      'UPDATE public.settings SET value = $1, "updatedBy" = $2, "updatedAt" = NOW() WHERE key = $3 RETURNING *',
      [JSON.stringify(value), userId, key]
    );
    
    // Clear cache
    settingsCache = null;
    
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error updating setting:', error);
    throw error;
  }
}

export async function updateSettings(updates: Record<string, any>, userId?: string) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    for (const [key, value] of Object.entries(updates)) {
      await client.query(
        'UPDATE public.settings SET value = $1, "updatedBy" = $2, "updatedAt" = NOW() WHERE key = $3',
        [JSON.stringify(value), userId, key]
      );
    }
    
    await client.query('COMMIT');
    
    // Clear cache
    settingsCache = null;
    
    return { success: true };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating settings:', error);
    throw error;
  } finally {
    client.release();
  }
}
EOF

echo "✅ Settings utility fixed! Run npm run dev to restart"