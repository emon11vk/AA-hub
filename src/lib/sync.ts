import { supabase } from './supabase';
import { db } from '../db/db';

// Utils to convert case
function toSnakeCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(v => toSnakeCase(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      result[snakeKey] = toSnakeCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
}

function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(v => toCamelCase(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      result[camelKey] = toCamelCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
}

const tableMapping: Record<string, string> = {
  hoSoDoanhNghiep: 'ho_so_doanh_nghiep',
  nhaCungCap: 'nha_cung_cap',
  khachHang: 'khach_hang',
  nganHang: 'ngan_hang',
  taiKhoanKeToan: 'tai_khoan_ke_toan',
  chungTu: 'chung_tu',
};

// Sync logic
export class SyncService {
  static async pushUnsyncedChanges() {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) return;

    for (const [dexieTable, supaTable] of Object.entries(tableMapping)) {
      const table = (db as any)[dexieTable];
      
      // Get all records that need syncing
      const unsynced = await table.filter((r: any) => !r.isSynced).toArray();
      if (unsynced.length === 0) continue;

      // Transform and push
      const payloads = unsynced.map((record: any) => {
        const { isSynced, ...rest } = record;
        const snakeRecord = toSnakeCase(rest);
        snakeRecord.user_id = session.session.user.id;
        // Make sure date fields are correctly formatted if needed, usually string is fine
        return snakeRecord;
      });

      const { error } = await supabase.from(supaTable).upsert(payloads);
      
      if (!error) {
        // Mark as synced
        await db.transaction('rw', table, async () => {
          for (const item of unsynced) {
            await table.update(item.id, { isSynced: true });
          }
        });
      } else {
        console.error(`Sync push error for ${supaTable}:`, error);
      }
    }
  }

  static async pullFromServer() {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) return;

    for (const [dexieTable, supaTable] of Object.entries(tableMapping)) {
      const { data, error } = await supabase.from(supaTable).select('*');
      
      if (!error && data) {
        const table = (db as any)[dexieTable];
        
        const camelData = data.map((row: any) => {
          const item = toCamelCase(row);
          item.isSynced = true; // Data from server is considered synced
          return item;
        });

        if (camelData.length > 0) {
          await table.bulkPut(camelData);
        }
      } else if (error) {
         console.error(`Sync pull error for ${supaTable}:`, error);
      }
    }
  }

  static startAutoSync(intervalMs = 30000) {
    // Initial pull
    this.pullFromServer().then(() => this.pushUnsyncedChanges());

    // Listen to online events
    window.addEventListener('online', () => {
      this.pushUnsyncedChanges();
    });

    // Periodic sync
    setInterval(() => {
      if (navigator.onLine) {
        this.pushUnsyncedChanges();
      }
    }, intervalMs);
  }
}
