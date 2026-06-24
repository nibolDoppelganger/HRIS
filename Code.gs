// SIMDP LAZWaf Al Azhar | Backend Core v2.0.0
// Dengan Caching Layer, Full PRD Compliance, Notifikasi, User Management

// ============================================================
// CACHE KEYS
// ============================================================
var CACHE_KEY_DASHBOARD = 'simdp_dashboard_';
var CACHE_KEY_PEGAWAI   = 'simdp_pegawai_';
var CACHE_KEY_LANDING   = 'simdp_landing';
var CACHE_TTL_DASHBOARD = 120;  // 2 menit
var CACHE_TTL_PEGAWAI   = 180;  // 3 menit
var CACHE_TTL_LANDING   = 600;  // 10 menit

// ============================================================
// ENTRY POINT
// ============================================================
function doGet(e) {
  // If no action parameter, serve HTML page (legacy)
  if (!e || !e.parameter || !e.parameter.action) {
    try {
      return HtmlService.createTemplateFromFile('Index')
        .evaluate()
        .setTitle('SIMDP LAZWaf Al Azhar')
        .addMetaTag('viewport', 'width=device-width, initial-scale=1')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    } catch(err) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'No action specified' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  return handleApiRequest(e.parameter.action, e.parameter, null);
}

function doPost(e) {
  var body = {};
  try { body = JSON.parse(e.postData.contents); } catch(err) {}
  var action = body.action || (e.parameter && e.parameter.action) || '';
  return handleApiRequest(action, e.parameter || {}, body);
}

// Central API Router
function handleApiRequest(action, params, body) {
  var result;
  var token = (body && body.token) || (params && params.token) || '';

  // Extract Bearer token from headers if available
  // GAS doesn't support custom headers easily, so token comes via body/params

  try {
    switch(action) {
      // ── Public endpoints (no auth) ──
      case 'landing.stats':
        result = getLandingConfig();
        break;
      case 'rekrutmen.status':
        result = { success: true, data: { is_open: getAppSetting('rekrutmen_is_open') === 'true', info: getAppSetting('rekrutmen_info') || '', divisi_tersedia: (getAppSetting('rekrutmen_divisi') || '').split(',') } };
        break;

      // ── Auth ──
      case 'auth.login':
        result = loginUser(body.username || '', body.password || '');
        break;
      case 'auth.login_google':
        result = loginWithGoogle();
        break;
      case 'auth.logout':
        result = destroySession(token);
        break;

      // ── Dashboard ──
      case 'dashboard.stats':
        result = getDashboardData(token);
        break;

      // ── Pegawai ──
      case 'pegawai.list':
        result = getPegawaiData(token);
        break;
      case 'pegawai.detail':
        var empId = params.id || body.id || '';
        var allPeg = getPegawaiData(token);
        if (allPeg.success) {
          var found = allPeg.data.find(function(p){ return p.id === empId || p.employee_id === empId; });
          result = found ? { success: true, data: found } : { success: false, error: 'Karyawan tidak ditemukan.' };
        } else { result = allPeg; }
        break;
      case 'pegawai.save':
        result = saveData(token, body.data || body);
        break;
      case 'pegawai.deactivate':
        result = deactivatePegawai(token, body.employee_id, body.reason);
        break;

      // ── User Management (Super Admin) ──
      case 'users.list':
        result = getUsersCached(token);
        break;
      case 'users.save':
        result = saveUser(token, body.data || body);
        invalidateUserCache();
        break;
      case 'users.toggle_status':
        result = toggleUserStatus(token, body.user_id || body.id);
        invalidateUserCache();
        break;
      case 'users.delete':
        result = deleteUser(token, body.user_id || body.id);
        invalidateUserCache();
        break;

      // ── Audit Log ──
      case 'audit.list':
        result = getAuditLogs(token, parseInt(params.limit || body.limit) || 50);
        break;

      // ── Settings ──
      case 'settings.get':
        result = getLandingConfig();
        break;
      case 'settings.save':
        result = saveLandingConfig(token, body.headline, body.subheadline, body.announcement, body.theme, body.showStats);
        break;

      // ── Widget Config ──
      case 'dashboard.config.save':
        result = saveWidgetConfig(token, body.widgets || []);
        break;

      // ── Import ──
      case 'import.preview':
        result = previewImportData();
        break;
      case 'import.execute':
        result = executeImport(token);
        break;

      // ── Export ──
      case 'export.csv':
        result = exportPegawaiCSV(token, body.filters || {});
        break;

      // ── Documents ──
      case 'dokumen.list':
        result = getDokumenPegawai(token, params.employee_id || body.employee_id);
        break;
      case 'dokumen.upload':
        result = uploadDokumenPegawai(token, body.employee_id, body.kategori, body.nama_file, body.file_id, body.file_url);
        break;
      case 'dokumen.delete':
        result = deleteDokumenPegawai(token, body.doc_id);
        break;

      // ── Profile ──
      case 'profile.completeness':
        result = getProfileCompleteness(params.employee_id || body.employee_id);
        break;

      // ── Setup ──
      case 'setup.database':
        result = setupDatabase();
        break;

      default:
        result = { success: false, error: 'Action tidak dikenal: ' + action };
    }
  } catch(e) {
    result = { success: false, error: 'Server error: ' + e.toString() };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
// SETUP DATABASE
// ============================================================
function setupDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. pegawai
  var sheetPegawai = ss.getSheetByName('pegawai') || ss.insertSheet('pegawai');
  var headerPegawai = [
    'id','employee_id','full_name','current_position','departement','unit',
    'employment_status','level','job_level','join_date','contract_end_date','email_kantor','email_pribadi',
    'mobile_phone','place_of_birth','date_of_birth','gender','marital_status',
    'nik','nik_address','residential_address','education_level','institution_name',
    'institution_place','graduation_date','is_active','inactive_date','inactive_reason',
    'spouse_name','spouse_dob','created_at','updated_at','updated_by'
  ];
  if (sheetPegawai.getLastRow() === 0) sheetPegawai.appendRow(headerPegawai);

  // 2. career_history
  var sheetCareer = ss.getSheetByName('career_history') || ss.insertSheet('career_history');
  var headerCareer = [
    'id','employee_id','urutan','jabatan','departement','unit',
    'tanggal_mulai','tanggal_selesai','keterangan','is_current','created_at','updated_by'
  ];
  if (sheetCareer.getLastRow() === 0) sheetCareer.appendRow(headerCareer);

  // 3. family_members
  var sheetFamily = ss.getSheetByName('family_members') || ss.insertSheet('family_members');
  var headerFamily = ['id','employee_id','tipe','nama','tanggal_lahir','urutan_anak'];
  if (sheetFamily.getLastRow() === 0) sheetFamily.appendRow(headerFamily);

  // 4. users
  var sheetUsers = ss.getSheetByName('users') || ss.insertSheet('users');
  var headerUsers = ['username','password_hash','fullname','role','departement','email','is_active','created_at'];
  if (sheetUsers.getLastRow() === 0) {
    sheetUsers.appendRow(headerUsers);
    sheetUsers.appendRow(['admin', hashPassword('Admin@2026'), 'Super Admin HR', 'Super Admin', '', 'admin@lazwaf.or.id', 'TRUE', new Date().toISOString()]);
    sheetUsers.appendRow(['manager', hashPassword('Admin@2026'), 'Manager Divisi', 'Manager Divisi', 'Sekretariat', 'manager@lazwaf.or.id', 'TRUE', new Date().toISOString()]);
  }

  // 5. app_settings
  var sheetSettings = ss.getSheetByName('app_settings') || ss.insertSheet('app_settings');
  if (sheetSettings.getLastRow() === 0) {
    sheetSettings.appendRow(['key','value']);
    var defaults = [
      ['landing_headline','SIMDP LAZWaf Al Azhar'],
      ['landing_subheadline','Portal Sistem Informasi Manajemen Data Pegawai Internal LAZWaf. Akurat, Terintegrasi, Aman, dan Transparan.'],
      ['landing_announcement','📢 Harap lengkapi data NIK dan keluarga paling lambat 30 Juni 2026.'],
      ['landing_theme','sky'],
      ['landing_show_stats','true'],
      ['notif_kontrak_h30','true'],
      ['notif_kontrak_h14','true'],
      ['notif_kontrak_h7','true'],
      ['notif_birthday','true'],
      ['notif_email_admin','admin@lazwaf.or.id'],
      ['session_duration_hours','8'],
      ['org_name','LAZWaf Al Azhar'],
      ['source_spreadsheet_id','1tlv5QzBo6L5rHa-tUuykp4ljADSLaSJq8qvukJ4TgYY']
    ];
    defaults.forEach(function(r){ sheetSettings.appendRow(r); });
  }

  // 6. dashboard_config
  var sheetDash = ss.getSheetByName('dashboard_config') || ss.insertSheet('dashboard_config');
  if (sheetDash.getLastRow() === 0) {
    sheetDash.appendRow(['key','label','active','order','role']);
    var widgets = [
      ['TOTAL_AKTIF','Total Karyawan Aktif','true','1','All'],
      ['TOTAL_TETAP','Karyawan Tetap','true','2','All'],
      ['TOTAL_KONTRAK','Karyawan Kontrak','true','3','All'],
      ['TOTAL_RELAWAN','Relawan (Berbayar, Tanpa Tunjangan)','true','4','All'],
      ['JK_PRIA','Laki-Laki','true','5','All'],
      ['JK_WANITA','Perempuan','true','6','All'],
      ['PER_DIVISI','Per Divisi','true','7','All'],
      ['PER_UNIT','Per Unit','true','8','Super Admin'],
      ['PER_LEVEL','Per Level Jabatan','true','9','Super Admin'],
      ['MASA_KERJA_AVG','Rata-rata Masa Kerja','true','10','Super Admin'],
      ['KONTRAK_30_HARI','Kontrak Habis < 30 Hari','true','11','Super Admin'],
      ['JOIN_BULAN_INI','Masuk Bulan Ini','true','12','Super Admin'],
      ['ULTAH_MINGGU_INI','Ulang Tahun Minggu Ini','true','13','Super Admin']
    ];
    widgets.forEach(function(w){ sheetDash.appendRow(w); });
  }

  // 7. audit_log
  var sheetAudit = ss.getSheetByName('audit_log') || ss.insertSheet('audit_log');
  if (sheetAudit.getLastRow() === 0) {
    sheetAudit.appendRow(['timestamp','user','action','module','employee_id','field_changed','old_value','new_value','detail']);
  }

  // 8. master_divisi
  var sheetMDiv = ss.getSheetByName('master_divisi') || ss.insertSheet('master_divisi');
  if (sheetMDiv.getLastRow() === 0) {
    sheetMDiv.appendRow(['kode','nama','kepala_divisi','is_active']);
    [['SEK','Sekretariat','','TRUE'],['KEU','Keuangan','','TRUE'],['LAZ','LAZ Al Azhar','','TRUE'],
     ['FUN','Fundraising & Partnership','','TRUE'],['PRO','Program','','TRUE']].forEach(function(r){ sheetMDiv.appendRow(r); });
  }

  // 9. master_unit
  var sheetMUnit = ss.getSheetByName('master_unit') || ss.insertSheet('master_unit');
  if (sheetMUnit.getLastRow() === 0) {
    sheetMUnit.appendRow(['kode','nama','divisi_kode','is_active']);
    var units = [
      ['SEK-DIR','Direksi','SEK','TRUE'],['SEK-KEL','Kelembagaan','SEK','TRUE'],
      ['SEK-HUM','Humas, GA, dan IT','SEK','TRUE'],['SEK-DIK','Diklat & Litbang','SEK','TRUE'],
      ['KEU-DIR','Direksi','KEU','TRUE'],['KEU-KEL','Pengeluaran','KEU','TRUE'],
      ['KEU-PEN','Penerimaan','KEU','TRUE'],['KEU-ANG','Anggaran & Akuntansi','KEU','TRUE'],
      ['LAZ-DIR','Direksi','LAZ','TRUE'],['FUN-INT','Internal Fundraising','FUN','TRUE'],
      ['FUN-EKS','Eksternal Fundraising','FUN','TRUE'],['PRO-PRO','Program','PRO','TRUE']
    ];
    units.forEach(function(r){ sheetMUnit.appendRow(r); });
  }

  // 10. notifikasi_config
  var sheetNotif = ss.getSheetByName('notifikasi_config') || ss.insertSheet('notifikasi_config');
  if (sheetNotif.getLastRow() === 0) {
    sheetNotif.appendRow(['type','active','email_targets','last_sent']);
    [['kontrak_h30','true','admin@lazwaf.or.id',''],
     ['kontrak_h14','true','admin@lazwaf.or.id,manager@lazwaf.or.id',''],
     ['kontrak_h7','true','admin@lazwaf.or.id,manager@lazwaf.or.id,direksi@lazwaf.or.id',''],
     ['birthday','true','admin@lazwaf.or.id',''],
     ['anniversary','false','admin@lazwaf.or.id',''],
     ['missing_email_weekly','true','admin@lazwaf.or.id','']
    ].forEach(function(r){ sheetNotif.appendRow(r); });
  }

  // 11. master_level
  var sheetMLevel = ss.getSheetByName('master_level') || ss.insertSheet('master_level');
  if (sheetMLevel.getLastRow() === 0) {
    sheetMLevel.appendRow(['kode','label','deskripsi','is_active']);
    [['5A','5A','Direktur / Kepala Divisi Senior','TRUE'],
     ['5C','5C','Kepala Divisi','TRUE'],
     ['4A','4A','Manager Senior','TRUE'],['4B','4B','Manager','TRUE'],['4C','4C','Manager Junior','TRUE'],
     ['3A','3A','Koordinator Senior','TRUE'],['3B','3B','Koordinator','TRUE'],['3C','3C','Koordinator Junior','TRUE'],
     ['2A','2A','Staf Senior','TRUE'],['2B','2B','Staf','TRUE'],['2C','2C','Staf Junior','TRUE'],
     ['1','1','Non-Staf','TRUE'],['1C','1C','Relawan / Magang','TRUE']
    ].forEach(function(r){ sheetMLevel.appendRow(r); });
  }

  // 12. dokumen_pegawai
  var sheetDok = ss.getSheetByName('dokumen_pegawai') || ss.insertSheet('dokumen_pegawai');
  if (sheetDok.getLastRow() === 0) {
    sheetDok.appendRow(['id','employee_id','kategori','nama_file','file_id','url','uploaded_at','uploaded_by']);
  }

  return { success: true, message: 'Database v2.0 berhasil diinisialisasi!' };
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
function hashPassword(password) {
  var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password, Utilities.Charset.UTF_8);
  return digest.map(function(b){ var h=(b<0?b+256:b).toString(16); return h.length===1?'0'+h:h; }).join('');
}

function sanitizeInput(value, maxLength) {
  if (typeof value !== 'string') return value;
  var clean = value.replace(/<\/?[^>]+(>|$)/g, '').trim();
  return (maxLength && clean.length > maxLength) ? clean.substring(0, maxLength) : clean;
}

function safeDateFormat(value) {
  if (value instanceof Date) return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  return value ? value.toString() : '';
}

function getColumnMap(sheet) {
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var map = {};
  headers.forEach(function(h, i){ map[h] = i; });
  return map;
}

function logAction(username, action, module_, empId, field, oldVal, newVal, detail) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('audit_log');
  if (!sheet) return;
  sheet.appendRow([
    new Date().toISOString(), username, action, module_,
    empId||'', field||'', oldVal||'', newVal||'', detail||''
  ]);
}

function getAppSetting(key) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('app_settings');
  if (!sheet) return null;
  var data = sheet.getDataRange().getValues();
  for (var i=1;i<data.length;i++){
    if (data[i][0]===key) return data[i][1];
  }
  return null;
}

// Invalidate all cache keys related to data changes
function invalidateDataCache() {
  var cache = CacheService.getScriptCache();
  // Remove per-user and shared keys (we use wildcard prefix approach via multiple removes)
  cache.remove(CACHE_KEY_LANDING);
  // Dashboard & pegawai are user-scoped; we mark a global dirty flag so next read skips cache
  var dirtyKey = 'simdp_cache_dirty';
  cache.put(dirtyKey, Date.now().toString(), 3600);
}

function isCacheDirty(timestamp) {
  var cache = CacheService.getScriptCache();
  var dirtyTs = cache.get('simdp_cache_dirty');
  if (!dirtyTs) return false;
  return parseInt(dirtyTs) > (timestamp || 0);
}

// ============================================================
// SESSION & AUTH
// ============================================================
function generateSessionToken(username) {
  var token = 'simdp_' + Utilities.getUuid();
  var cache = CacheService.getScriptCache();
  var hours = parseInt(getAppSetting('session_duration_hours') || '8');
  cache.put(token, JSON.stringify({ username: username, ts: Date.now() }), hours * 3600);
  return token;
}

function validateSession(token) {
  if (!token) return { valid: false, message: 'Sesi kosong.' };
  var cache = CacheService.getScriptCache();
  var raw = cache.get(token);
  if (!raw) return { valid: false, message: 'Sesi Anda telah kedaluwarsa, silakan login kembali.' };

  var sess;
  try { sess = JSON.parse(raw); } catch(e){ return { valid: false, message: 'Token tidak valid.' }; }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('users');
  if (!sheet) return { valid: false, message: 'Database users tidak ditemukan.' };
  var data = sheet.getDataRange().getValues();
  var map = getColumnMap(sheet);
  for (var i=1;i<data.length;i++){
    if (data[i][map['username']] === sess.username) {
      return {
        valid: true,
        username: sess.username,
        fullname: data[i][map['fullname']],
        role: data[i][map['role']],
        departement: data[i][map['departement']] || ''
      };
    }
  }
  return { valid: false, message: 'Pengguna tidak ditemukan.' };
}

function destroySession(token) {
  if (token) CacheService.getScriptCache().remove(token);
  return { success: true };
}

function checkLoginRateLimit(username) {
  var count = parseInt(CacheService.getScriptCache().get('lf_'+username) || '0');
  return { allowed: count < 5 };
}
function recordLoginFailure(username) {
  var cache = CacheService.getScriptCache();
  var count = parseInt(cache.get('lf_'+username) || '0') + 1;
  cache.put('lf_'+username, count.toString(), 900);
}
function clearLoginFailures(username) {
  CacheService.getScriptCache().remove('lf_'+username);
}

function loginUser(username, password) {
  username = sanitizeInput(username, 50);
  var rl = checkLoginRateLimit(username);
  if (!rl.allowed) return { success: false, message: 'Akun dikunci 15 menit akibat terlalu banyak kesalahan login.' };

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('users');
  if (!sheet) return { success: false, message: 'Sheet users tidak ditemukan. Jalankan setupDatabase().' };

  var data = sheet.getDataRange().getValues();
  var map = getColumnMap(sheet);
  var passHash = hashPassword(password);

  for (var i=1;i<data.length;i++){
    if (data[i][map['username']] === username) {
      if (data[i][map['password_hash']] === passHash) {
        if (data[i][map['is_active']].toString().toUpperCase() !== 'TRUE') {
          return { success: false, message: 'Akun Anda non-aktif. Hubungi Admin HR.' };
        }
        clearLoginFailures(username);
        var token = generateSessionToken(username);
        logAction(username,'LOGIN','Auth','','','','','Login berhasil.');
        return {
          success: true,
          token: token,
          user: { username: username, fullname: data[i][map['fullname']], role: data[i][map['role']], departement: data[i][map['departement']]||'' }
        };
      }
    }
  }
  recordLoginFailure(username);
  logAction(username||'UNKNOWN','LOGIN_FAIL','Auth','','','','','Kredensial salah.');
  return { success: false, message: 'Username atau password salah.' };
}

// ============================================================
// LANDING CONFIG (CACHED)
// ============================================================
function getLandingConfig() {
  var cache = CacheService.getScriptCache();
  var cached = cache.get(CACHE_KEY_LANDING);
  if (cached) {
    try { return JSON.parse(cached); } catch(e){}
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('app_settings');
  var payload = {
    headline:'SIMDP LAZWaf Al Azhar',
    subheadline:'Portal Sistem Informasi Manajemen Data Pegawai Internal LAZWaf.',
    announcement:'',
    primaryColor:'sky',
    showStats:true,
    statsData:null
  };
  if (sheet) {
    var data = sheet.getDataRange().getValues();
    for (var i=1;i<data.length;i++){
      var k=data[i][0], v=data[i][1];
      if (k==='landing_headline') payload.headline=v;
      if (k==='landing_subheadline') payload.subheadline=v;
      if (k==='landing_announcement') payload.announcement=v;
      if (k==='landing_theme') payload.primaryColor=v;
      if (k==='landing_show_stats') payload.showStats=(v==='true');
    }
  }
  if (payload.showStats) {
    var pSheet = ss.getSheetByName('pegawai');
    if (pSheet && pSheet.getLastRow()>1) {
      var pData = pSheet.getRange(2,1,pSheet.getLastRow()-1,pSheet.getLastColumn()).getValues();
      var pMap = getColumnMap(pSheet);
      var tot=0,tet=0,kon=0,rel=0;
      pData.forEach(function(r){
        if ((r[pMap['is_active']]+'').toUpperCase()==='TRUE'){
          tot++;
          var st=r[pMap['employment_status']];
          if(st==='Tetap') tet++;
          else if(st==='Kontrak') kon++;
          else if(st==='Relawan') rel++;
        }
      });
      payload.statsData={ total:tot, tetap:tet, kontrak:kon, relawan:rel };
    }
  }
  cache.put(CACHE_KEY_LANDING, JSON.stringify(payload), CACHE_TTL_LANDING);
  return payload;
}

function saveLandingConfig(token, headline, subheadline, announcement, theme, showStats) {
  var session = validateSession(token);
  if (!session.valid) return { success:false, message:session.message, sessionExpired:true };
  if (session.role !== 'Super Admin') return { success:false, message:'Hak akses ditolak.' };

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('app_settings');
  if (!sheet) return { success:false, message:'Settings tidak ditemukan.' };
  var data = sheet.getDataRange().getValues();
  var mapKeys = {
    'landing_headline':headline,'landing_subheadline':subheadline,
    'landing_announcement':announcement,'landing_theme':theme,
    'landing_show_stats':showStats?'true':'false'
  };
  for (var i=1;i<data.length;i++){
    if (mapKeys[data[i][0]] !== undefined) sheet.getRange(i+1,2).setValue(mapKeys[data[i][0]]);
  }
  CacheService.getScriptCache().remove(CACHE_KEY_LANDING);
  logAction(session.username,'CONFIG','Landing Page','','','','','Kustomisasi landing page diperbarui.');
  return { success:true };
}

// ============================================================
// DASHBOARD DATA (CACHED per user-role)
// ============================================================
function getDashboardData(token) {
  var session = validateSession(token);
  if (!session.valid) return { success:false, message:session.message, sessionExpired:true };

  var cacheKey = CACHE_KEY_DASHBOARD + session.role + '_' + (session.departement||'all');
  var cache = CacheService.getScriptCache();
  var cached = cache.get(cacheKey);
  if (cached && !isCacheDirty()) {
    try {
      var parsed = JSON.parse(cached);
      parsed._fromCache = true;
      return parsed;
    } catch(e){}
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var theme = getAppSetting('landing_theme') || 'sky';

  // Widget config
  var dashSheet = ss.getSheetByName('dashboard_config');
  var widgetsList = [];
  if (dashSheet && dashSheet.getLastRow()>1) {
    var dData = dashSheet.getRange(2,1,dashSheet.getLastRow()-1,dashSheet.getLastColumn()).getValues();
    var dMap = getColumnMap(dashSheet);
    dData.forEach(function(r){
      widgetsList.push({
        key: r[dMap['key']], label: r[dMap['label']],
        active: r[dMap['active']].toString().toLowerCase()==='true',
        order: parseInt(r[dMap['order']])||99,
        role: r[dMap['role']]
      });
    });
  }

  // Pegawai raw
  var pSheet = ss.getSheetByName('pegawai');
  var dbPegawai = [];
  if (pSheet && pSheet.getLastRow()>1) {
    var pData = pSheet.getRange(2,1,pSheet.getLastRow()-1,pSheet.getLastColumn()).getValues();
    var pMap = getColumnMap(pSheet);
    var today = new Date();
    pData.forEach(function(r){
      var dept = r[pMap['departement']];
      if (session.role==='Manager Divisi' && dept !== session.departement) return;
      var isActive = (r[pMap['is_active']]+'').toUpperCase()==='TRUE';
      var joinDate = r[pMap['join_date']];
      var dobRaw = r[pMap['date_of_birth']];
      var contractEndRaw = r[pMap['contract_end_date']] || '';
      // Compute masa kerja years for avg
      var mkYears = 0;
      if (joinDate) {
        var jd = new Date(joinDate);
        if (!isNaN(jd.getTime())) mkYears = (today - jd) / (365.25*24*3600*1000);
      }
      dbPegawai.push({
        id: r[pMap['id']],
        employee_id: r[pMap['employee_id']],
        full_name: r[pMap['full_name']],
        current_position: r[pMap['current_position']],
        departement: dept,
        unit: r[pMap['unit']],
        employment_status: r[pMap['employment_status']],
        level: r[pMap['level']],
        job_level: r[pMap['job_level']]||'Staf',
        join_date: safeDateFormat(joinDate),
        contract_end_date: safeDateFormat(contractEndRaw),
        date_of_birth: safeDateFormat(dobRaw),
        gender: r[pMap['gender']],
        is_active: isActive,
        mk_years: mkYears
      });
    });
  }

  var result = { success:true, theme:theme, widgets:widgetsList, pegawai:dbPegawai, _cachedAt:Date.now() };
  try { cache.put(cacheKey, JSON.stringify(result), CACHE_TTL_DASHBOARD); } catch(e){}
  return result;
}

// ============================================================
// PEGAWAI DATA (CACHED per user-role)
// ============================================================
function getPegawaiData(token) {
  var session = validateSession(token);
  if (!session.valid) return { success:false, message:session.message, sessionExpired:true };

  var cacheKey = CACHE_KEY_PEGAWAI + session.role + '_' + (session.departement||'all');
  var cache = CacheService.getScriptCache();
  var cached = cache.get(cacheKey);
  if (cached && !isCacheDirty()) {
    try {
      var parsed = JSON.parse(cached);
      parsed._fromCache = true;
      return parsed;
    } catch(e){}
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var pSheet = ss.getSheetByName('pegawai');
  var cSheet = ss.getSheetByName('career_history');
  var fSheet = ss.getSheetByName('family_members');

  if (!pSheet || pSheet.getLastRow()<=1) {
    var empty = { success:true, data:[], _cachedAt:Date.now() };
    cache.put(cacheKey, JSON.stringify(empty), CACHE_TTL_PEGAWAI);
    return empty;
  }

  var pMap = getColumnMap(pSheet);
  var dataPeg = pSheet.getRange(2,1,pSheet.getLastRow()-1,pSheet.getLastColumn()).getValues();

  var careerByEmp = {};
  if (cSheet && cSheet.getLastRow()>1) {
    var cMap = getColumnMap(cSheet);
    var cData = cSheet.getRange(2,1,cSheet.getLastRow()-1,cSheet.getLastColumn()).getValues();
    cData.forEach(function(r){
      var eid = r[cMap['employee_id']];
      if (!careerByEmp[eid]) careerByEmp[eid] = [];
      careerByEmp[eid].push({
        urutan: parseInt(r[cMap['urutan']])||0,
        jabatan: r[cMap['jabatan']],
        departement: r[cMap['departement']],
        unit: r[cMap['unit']],
        mulai: safeDateFormat(r[cMap['tanggal_mulai']]),
        selesai: safeDateFormat(r[cMap['tanggal_selesai']]),
        keterangan: r[cMap['keterangan']],
        is_current: (r[cMap['is_current']]+'').toLowerCase()==='true'
      });
    });
    Object.keys(careerByEmp).forEach(function(k){
      careerByEmp[k].sort(function(a,b){ return a.urutan-b.urutan; });
    });
  }

  var familyByEmp = {};
  if (fSheet && fSheet.getLastRow()>1) {
    var fMap = getColumnMap(fSheet);
    var fData = fSheet.getRange(2,1,fSheet.getLastRow()-1,fSheet.getLastColumn()).getValues();
    fData.forEach(function(r){
      var eid = r[fMap['employee_id']];
      if (!familyByEmp[eid]) familyByEmp[eid] = [];
      familyByEmp[eid].push({
        tipe: r[fMap['tipe']],
        nama: r[fMap['nama']],
        dob: safeDateFormat(r[fMap['tanggal_lahir']]),
        urutan: parseInt(r[fMap['urutan_anak']])||0
      });
    });
  }

  var result = [];
  var isAdmin = (session.role==='Super Admin'||session.role==='Admin HR');
  dataPeg.forEach(function(r){
    var dept = r[pMap['departement']];
    if (session.role==='Manager Divisi' && dept !== session.departement) return;
    var eid = r[pMap['employee_id']];
    var children = (familyByEmp[eid]||[]).filter(function(f){ return f.tipe==='anak'; });
    children.sort(function(a,b){ return a.urutan-b.urutan; });
    result.push({
      id: r[pMap['id']],
      employee_id: eid,
      full_name: r[pMap['full_name']],
      current_position: r[pMap['current_position']],
      departement: dept,
      unit: r[pMap['unit']],
      employment_status: r[pMap['employment_status']],
      level: r[pMap['level']],
      job_level: r[pMap['job_level']]||'Staf',
      join_date: safeDateFormat(r[pMap['join_date']]),
      contract_end_date: safeDateFormat(r[pMap['contract_end_date']] || ''),
      email_kantor: r[pMap['email_kantor']],
      email_pribadi: r[pMap['email_pribadi']],
      mobile_phone: isAdmin ? r[pMap['mobile_phone']] : '••••••',
      place_of_birth: r[pMap['place_of_birth']],
      date_of_birth: safeDateFormat(r[pMap['date_of_birth']]),
      gender: r[pMap['gender']],
      marital_status: r[pMap['marital_status']],
      nik: isAdmin ? r[pMap['nik']] : '••••••••••••••••',
      nik_address: isAdmin ? r[pMap['nik_address']] : '••••••',
      residential_address: isAdmin ? r[pMap['residential_address']] : '••••••',
      education_level: r[pMap['education_level']],
      institution_name: r[pMap['institution_name']],
      institution_place: r[pMap['institution_place']],
      graduation_date: safeDateFormat(r[pMap['graduation_date']]),
      is_active: (r[pMap['is_active']]+'').toUpperCase()==='TRUE',
      inactive_date: safeDateFormat(r[pMap['inactive_date']]),
      inactive_reason: r[pMap['inactive_reason']],
      spouse_name: r[pMap['spouse_name']],
      spouse_dob: safeDateFormat(r[pMap['spouse_dob']]),
      children: children,
      career_history: careerByEmp[eid] || []
    });
  });

  var res = { success:true, data:result, _cachedAt:Date.now() };
  try { cache.put(cacheKey, JSON.stringify(res), CACHE_TTL_PEGAWAI); } catch(e){}
  return res;
}

// ============================================================
// SAVE DATA PEGAWAI (invalidates cache)
// ============================================================
function saveData(token, payload) {
  var session = validateSession(token);
  if (!session.valid) return { success:false, message:session.message, sessionExpired:true };
  if (session.role==='Manager Divisi' || session.role==='Staf Viewer') {
    return { success:false, message:'Anda tidak memiliki otoritas untuk memodifikasi data.' };
  }

  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetP = ss.getSheetByName('pegawai');
    var sheetC = ss.getSheetByName('career_history');
    var sheetF = ss.getSheetByName('family_members');
    var mapP = getColumnMap(sheetP);
    var dataP = sheetP.getDataRange().getValues();
    var rowIdx = -1;
    var oldName = '';

    for (var i=1;i<dataP.length;i++){
      if (dataP[i][mapP['id']].toString()===payload.id.toString()){
        rowIdx = i+1;
        oldName = dataP[i][mapP['full_name']];
        break;
      }
    }

    var now = new Date().toISOString();
    var rowValues = [
      payload.id, sanitizeInput(payload.employee_id,20), sanitizeInput(payload.full_name,100),
      sanitizeInput(payload.current_position,100), payload.departement, payload.unit,
      payload.employment_status, payload.level, payload.job_level, payload.join_date,
      payload.contract_end_date||'',
      sanitizeInput(payload.email_kantor,100), sanitizeInput(payload.email_pribadi,100),
      sanitizeInput(payload.mobile_phone,20), sanitizeInput(payload.place_of_birth,50),
      payload.date_of_birth, payload.gender, payload.marital_status,
      sanitizeInput(payload.nik,20), sanitizeInput(payload.nik_address,200),
      sanitizeInput(payload.residential_address,200), payload.education_level,
      sanitizeInput(payload.institution_name,100), sanitizeInput(payload.institution_place,50),
      payload.graduation_date, payload.is_active?'TRUE':'FALSE',
      payload.inactive_date||'', sanitizeInput(payload.inactive_reason||'',200),
      sanitizeInput(payload.spouse_name||'',100), payload.spouse_dob||'',
      rowIdx===-1?now:dataP[rowIdx-1][mapP['created_at']]||now, now, session.username
    ];

    if (rowIdx!==-1) {
      sheetP.getRange(rowIdx,1,1,rowValues.length).setValues([rowValues]);
      logAction(session.username,'EDIT','Data Pegawai',payload.employee_id,'full_name',oldName,payload.full_name,'Data pegawai diperbarui.');
    } else {
      sheetP.appendRow(rowValues);
      logAction(session.username,'ADD','Data Pegawai',payload.employee_id,'','','','Pegawai baru didaftarkan: '+payload.full_name);
    }

    // Rebuild career_history
    if (sheetC) {
      var dC = sheetC.getDataRange().getValues();
      for (var k=dC.length-1;k>=1;k--){
        if (dC[k][1]===payload.employee_id) sheetC.deleteRow(k+1);
      }
      if (payload.career_history && payload.career_history.length>0) {
        payload.career_history.forEach(function(c,idx){
          var isCurr = idx===(payload.career_history.length-1)?'TRUE':'FALSE';
          sheetC.appendRow(['c_'+payload.id+'_'+idx, payload.employee_id, idx,
            sanitizeInput(c.jabatan,100), c.departement||payload.departement,
            c.unit||payload.unit, c.mulai, c.selesai,
            sanitizeInput(c.keterangan||'',200), isCurr, now, session.username]);
        });
      }
    }

    // Rebuild family_members (children only)
    if (sheetF) {
      var dF = sheetF.getDataRange().getValues();
      for (var j=dF.length-1;j>=1;j--){
        if (dF[j][1]===payload.employee_id && dF[j][2]==='anak') sheetF.deleteRow(j+1);
      }
      if (payload.children && payload.children.length>0) {
        payload.children.forEach(function(ch,idx){
          sheetF.appendRow(['f_'+payload.id+'_'+idx, payload.employee_id,
            'anak', sanitizeInput(ch.nama,100), ch.dob, idx+1]);
        });
      }
    }

    lock.releaseLock();
    invalidateDataCache();
    return { success:true };
  } catch(e) {
    if (lock.hasLock()) lock.releaseLock();
    return { success:false, message:'Operasi gagal: '+e.toString() };
  }
}

// Nonaktifkan pegawai
function deactivatePegawai(token, employeeId, reason) {
  var session = validateSession(token);
  if (!session.valid) return { success:false, message:session.message, sessionExpired:true };
  if (session.role!=='Super Admin' && session.role!=='Admin HR') return { success:false, message:'Hak akses ditolak.' };

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('pegawai');
  var map = getColumnMap(sheet);
  var data = sheet.getDataRange().getValues();
  for (var i=1;i<data.length;i++){
    if (data[i][map['employee_id']]===employeeId){
      sheet.getRange(i+1, map['is_active']+1).setValue('FALSE');
      sheet.getRange(i+1, map['inactive_date']+1).setValue(new Date().toISOString().split('T')[0]);
      sheet.getRange(i+1, map['inactive_reason']+1).setValue(sanitizeInput(reason||'',200));
      sheet.getRange(i+1, map['updated_at']+1).setValue(new Date().toISOString());
      sheet.getRange(i+1, map['updated_by']+1).setValue(session.username);
      logAction(session.username,'DEACTIVATE','Data Pegawai',employeeId,'is_active','TRUE','FALSE',reason||'');
      invalidateDataCache();
      return { success:true };
    }
  }
  return { success:false, message:'Pegawai tidak ditemukan.' };
}

// ============================================================
// WIDGET CONFIG
// ============================================================
function saveWidgetConfig(token, listConfigs) {
  var session = validateSession(token);
  if (!session.valid) return { success:false, message:session.message, sessionExpired:true };
  if (session.role!=='Super Admin') return { success:false, message:'Hak akses ditolak.' };

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('dashboard_config');
  if (!sheet) return { success:false, message:'Konfigurasi tidak ditemukan.' };
  sheet.clearContents();
  sheet.appendRow(['key','label','active','order','role']);
  listConfigs.forEach(function(cfg){
    sheet.appendRow([cfg.key, cfg.label, cfg.active?'true':'false', cfg.order.toString(), cfg.role]);
  });
  invalidateDataCache();
  logAction(session.username,'CONFIG','Dashboard Config','','','','','Widget config diperbarui.');
  return { success:true };
}

// ============================================================
// USER MANAGEMENT (Super Admin only)
// ============================================================
function getUsers(token) {
  var session = validateSession(token);
  if (!session.valid) return { success:false, message:session.message, sessionExpired:true };
  if (session.role!=='Super Admin') return { success:false, message:'Hak akses ditolak.' };

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('users');
  var map = getColumnMap(sheet);
  var data = sheet.getDataRange().getValues();
  var users = [];
  for (var i=1;i<data.length;i++){
    users.push({
      username: data[i][map['username']],
      fullname: data[i][map['fullname']],
      role: data[i][map['role']],
      departement: data[i][map['departement']]||'',
      email: data[i][map['email']]||'',
      is_active: (data[i][map['is_active']]+'').toUpperCase()==='TRUE',
      created_at: safeDateFormat(data[i][map['created_at']])
    });
  }
  return { success:true, data:users };
}

function saveUser(token, payload) {
  var session = validateSession(token);
  if (!session.valid) return { success:false, message:session.message, sessionExpired:true };
  if (session.role!=='Super Admin') return { success:false, message:'Hak akses ditolak.' };

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('users');
  var map = getColumnMap(sheet);
  var data = sheet.getDataRange().getValues();

  // Check duplicate username on new user
  var rowIdx = -1;
  for (var i=1;i<data.length;i++){
    if (data[i][map['username']]===payload.username){ rowIdx=i+1; break; }
  }
  if (rowIdx===-1 && !payload.password) return { success:false, message:'Password wajib untuk user baru.' };

  var passHash = payload.password ? hashPassword(payload.password) : (rowIdx>-1 ? data[rowIdx-1][map['password_hash']] : '');
  var rowVals = [
    sanitizeInput(payload.username,50), passHash, sanitizeInput(payload.fullname,100),
    payload.role, payload.departement||'', sanitizeInput(payload.email||'',100),
    payload.is_active?'TRUE':'FALSE', rowIdx===-1?new Date().toISOString():data[rowIdx-1][map['created_at']]
  ];

  if (rowIdx!==-1) {
    sheet.getRange(rowIdx,1,1,rowVals.length).setValues([rowVals]);
    logAction(session.username,'EDIT_USER','Hak Akses',payload.username,'','','','Data user diperbarui.');
  } else {
    sheet.appendRow(rowVals);
    logAction(session.username,'ADD_USER','Hak Akses',payload.username,'','','','User baru ditambahkan.');
  }
  return { success:true };
}

// ============================================================
// USER MANAGEMENT - Cached + Extended CRUD
// ============================================================
var CACHE_KEY_USERS = 'simdp_users_list';
var CACHE_TTL_USERS = 180; // 3 menit

function getUsersCached(token) {
  var session = validateSession(token);
  if (!session.valid) return { success: false, message: session.message, sessionExpired: true };
  if (session.role !== 'Super Admin') return { success: false, message: 'Hak akses ditolak.' };

  var cache = CacheService.getScriptCache();
  var cached = cache.get(CACHE_KEY_USERS);
  if (cached) {
    try {
      var parsed = JSON.parse(cached);
      parsed._fromCache = true;
      return parsed;
    } catch(e) {}
  }

  var result = getUsers(token);
  if (result.success) {
    try { cache.put(CACHE_KEY_USERS, JSON.stringify(result), CACHE_TTL_USERS); } catch(e) {}
  }
  return result;
}

function invalidateUserCache() {
  CacheService.getScriptCache().remove(CACHE_KEY_USERS);
}

function toggleUserStatus(token, userId) {
  var session = validateSession(token);
  if (!session.valid) return { success: false, message: session.message, sessionExpired: true };
  if (session.role !== 'Super Admin') return { success: false, message: 'Hak akses ditolak.' };

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('users');
  if (!sheet) return { success: false, message: 'Sheet users tidak ditemukan.' };
  var map = getColumnMap(sheet);
  var data = sheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    if (data[i][map['username']] === userId || data[i][map['email']] === userId) {
      var currentStatus = (data[i][map['is_active']] + '').toUpperCase() === 'TRUE';
      var newStatus = !currentStatus;
      sheet.getRange(i + 1, map['is_active'] + 1).setValue(newStatus ? 'TRUE' : 'FALSE');
      logAction(session.username, newStatus ? 'ACTIVATE_USER' : 'DEACTIVATE_USER', 'Hak Akses',
        data[i][map['username']], 'is_active', currentStatus ? 'TRUE' : 'FALSE', newStatus ? 'TRUE' : 'FALSE',
        (newStatus ? 'Aktifkan' : 'Nonaktifkan') + ' user: ' + data[i][map['fullname']]);
      return { success: true, is_active: newStatus };
    }
  }
  return { success: false, message: 'User tidak ditemukan.' };
}

function deleteUser(token, userId) {
  var session = validateSession(token);
  if (!session.valid) return { success: false, message: session.message, sessionExpired: true };
  if (session.role !== 'Super Admin') return { success: false, message: 'Hak akses ditolak.' };

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('users');
  if (!sheet) return { success: false, message: 'Sheet users tidak ditemukan.' };
  var map = getColumnMap(sheet);
  var data = sheet.getDataRange().getValues();

  // Prevent deleting self
  for (var i = 1; i < data.length; i++) {
    if (data[i][map['username']] === userId || data[i][map['email']] === userId) {
      if (data[i][map['username']] === session.username) {
        return { success: false, message: 'Tidak dapat menghapus akun sendiri.' };
      }
      var userName = data[i][map['fullname']];
      var userEmail = data[i][map['email']] || data[i][map['username']];
      sheet.deleteRow(i + 1);
      logAction(session.username, 'DELETE_USER', 'Hak Akses', userEmail, '', '', '', 'User dihapus: ' + userName);
      return { success: true };
    }
  }
  return { success: false, message: 'User tidak ditemukan.' };
}

// ============================================================
// AUDIT LOG
// ============================================================
function getAuditLogs(token, limit) {
  var session = validateSession(token);
  if (!session.valid) return { success:false, message:session.message, sessionExpired:true };
  if (session.role!=='Super Admin' && session.role!=='Admin HR') return { success:false, message:'Hak akses ditolak.' };

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('audit_log');
  var logs = [];
  if (sheet && sheet.getLastRow()>1) {
    var lastRow = sheet.getLastRow()-1;
    var startRow = limit ? Math.max(1, lastRow-(limit-1)) : 1;
    var data = sheet.getRange(startRow+1,1,lastRow-startRow+1,sheet.getLastColumn()).getValues();
    for (var i=data.length-1;i>=0;i--){
      logs.push({
        time:data[i][0], user:data[i][1], action:data[i][2],
        module:data[i][3], employee_id:data[i][4], field_changed:data[i][5],
        old_value:data[i][6], new_value:data[i][7], detail:data[i][8]
      });
    }
  }
  return { success:true, data:logs };
}

// ============================================================
// EXPORT EXCEL (Google Sheets → CSV blob simulasi)
// Returns a CSV string; front-end akan trigger download
// ============================================================
function exportPegawaiCSV(token, filters) {
  var session = validateSession(token);
  if (!session.valid) return { success:false, message:session.message, sessionExpired:true };
  if (session.role==='Staf Viewer') return { success:false, message:'Hak akses ditolak.' };

  var full = getPegawaiData(token);
  if (!full.success) return full;

  var rows = full.data;
  // Apply filters
  if (filters) {
    if (filters.dept) rows = rows.filter(function(r){ return r.departement===filters.dept; });
    if (filters.status) rows = rows.filter(function(r){ return r.employment_status===filters.status; });
    if (filters.gender) rows = rows.filter(function(r){ return r.gender===filters.gender; });
    if (filters.active==='ActiveOnly') rows = rows.filter(function(r){ return r.is_active; });
    if (filters.active==='InactiveOnly') rows = rows.filter(function(r){ return !r.is_active; });
  }

  var isAdmin = (session.role==='Super Admin'||session.role==='Admin HR');
  var header = ['Employee ID','Nama Lengkap','Posisi','Departemen','Unit','Status Kepegawaian',
    'Level','Job Level','Tanggal Masuk','Masa Kerja (Tahun)','Jenis Kelamin','Status Aktif'];
  if (isAdmin) header = header.concat(['Email Kantor','No. HP','NIK']);

  var lines = [header.map(function(h){ return '"'+h+'"'; }).join(',')];
  var today = new Date();
  rows.forEach(function(r){
    var jd = new Date(r.join_date);
    var mk = isNaN(jd.getTime())?0:Math.floor((today-jd)/(365.25*24*3600*1000));
    var row = [r.employee_id,r.full_name,r.current_position,r.departement,r.unit,
      r.employment_status,r.level,r.job_level,r.join_date,mk,
      r.gender==='L'?'Laki-laki':'Perempuan', r.is_active?'Aktif':'Nonaktif'];
    if (isAdmin) row = row.concat([r.email_kantor,r.mobile_phone,r.nik]);
    lines.push(row.map(function(v){ return '"'+(v||'').toString().replace(/"/g,'""')+'"'; }).join(','));
  });

  return { success:true, csv:lines.join('\n'), filename:'Pegawai_LAZWaf_'+Utilities.formatDate(today, Session.getScriptTimeZone(),'yyyyMMdd')+'.csv', count:rows.length };
}

// ============================================================
// IMPORT FROM SOURCE SPREADSHEET
// ============================================================
function previewImportData() {
  var sourceId = getAppSetting('source_spreadsheet_id');
  if (!sourceId) return { success:false, message:'ID spreadsheet sumber belum dikonfigurasi.' };

  try {
    var ss = SpreadsheetApp.openById(sourceId);
    var sheets = ss.getSheets();
    // Try first data sheet; skip config sheet
    var dataSheet = sheets[0];
    if (!dataSheet || dataSheet.getLastRow()<2) return { success:false, message:'Spreadsheet sumber kosong atau tidak ditemukan.' };

    var rawData = dataSheet.getRange(1,1,Math.min(dataSheet.getLastRow(),20),64).getValues();
    var preview = [];
    for (var i=1;i<rawData.length;i++){
      var r=rawData[i];
      var empId = r[1] ? r[1].toString().trim() : '';
      // Skip non-employee rows (header divisi bukan ID numerik)
      if (!empId || empId.length<5 || isNaN(empId.replace(/\D/g,''))) continue;
      preview.push({
        employee_id: empId,
        full_name: r[2]||'',
        date_of_birth_raw: r[10]?r[10].toString():'',
        date_of_birth_norm: normalizeDateStr(r[10]),
        gender_raw: r[22]||'',
        gender_norm: r[22]==='L'?'Laki-laki':(r[22]==='P'?'Perempuan':r[22]||''),
        career_count: countCareerPaths(r),
        has_email: !!(r[17]&&r[17].toString().trim()),
        status: r[6]||'',
        departement: r[4]||''
      });
    }
    return { success:true, preview:preview, total:preview.length };
  } catch(e) {
    return { success:false, message:'Gagal membaca spreadsheet sumber: '+e.toString() };
  }
}

function normalizeDateStr(val) {
  if (!val) return '';
  if (val instanceof Date) return Utilities.formatDate(val, Session.getScriptTimeZone(),'yyyy-MM-dd');
  var s = val.toString().trim();
  // Try MM/DD/YYYY
  var m1 = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m1) return m1[3]+'-'+pad2(m1[1])+'-'+pad2(m1[2]);
  // Try DD/MM/YYYY
  var m2 = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  // Try D Mon YYYY (e.g. 3 Jul 2007)
  var months = {Jan:'01',Feb:'02',Mar:'03',Apr:'04',May:'05',Jun:'06',
                Jul:'07',Aug:'08',Sep:'09',Oct:'10',Nov:'11',Dec:'12'};
  var m3 = s.match(/^(\d{1,2})\s([A-Za-z]{3})\s(\d{4})$/);
  if (m3 && months[m3[2]]) return m3[3]+'-'+months[m3[2]]+'-'+pad2(m3[1]);
  return s;
}

function pad2(n){ return n.toString().length===1?'0'+n:n.toString(); }

function countCareerPaths(row) {
  // Career start at col 38 (AM=38), pairs after: AN(39), AO(40), ...up to BK(63)
  var count = 0;
  if (row[38]) count++; // Career Start
  for (var c=39;c<64;c+=2){ if (row[c] && row[c].toString().trim()) count++; }
  return count;
}

// ============================================================
// EXECUTE FULL IMPORT (dengan normalisasi)
// ============================================================
function executeImport(token) {
  var session = validateSession(token);
  if (!session.valid) return { success:false, message:session.message, sessionExpired:true };
  if (session.role!=='Super Admin' && session.role!=='Admin HR') return { success:false, message:'Hak akses ditolak.' };

  var sourceId = getAppSetting('source_spreadsheet_id');
  if (!sourceId) return { success:false, message:'ID spreadsheet sumber belum dikonfigurasi.' };

  try {
    var srcSS = SpreadsheetApp.openById(sourceId);
    var dataSheet = srcSS.getSheets()[0];
    if (!dataSheet || dataSheet.getLastRow()<2) return { success:false, message:'Spreadsheet sumber kosong.' };

    var maxCols = Math.min(dataSheet.getLastColumn(), 64);
    var rawData = dataSheet.getRange(1, 1, dataSheet.getLastRow(), maxCols).getValues();

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var pSheet = ss.getSheetByName('pegawai');
    var cSheet = ss.getSheetByName('career_history');
    var fSheet = ss.getSheetByName('family_members');
    var pMap = getColumnMap(pSheet);

    var imported = 0, skipped = 0, errors = [];
    var existingIds = {};
    if (pSheet.getLastRow()>1) {
      var ex = pSheet.getRange(2,1,pSheet.getLastRow()-1,2).getValues();
      ex.forEach(function(r){ existingIds[r[1]]=true; });
    }

    for (var i=1;i<rawData.length;i++){
      var r = rawData[i];
      var empId = (r[1]||'').toString().trim();
      if (!empId || empId.length<5 || isNaN(empId.replace(/\D/g,''))) { skipped++; continue; }
      if (existingIds[empId]) { skipped++; continue; }

      var now = new Date().toISOString();
      var uid = 'p_'+empId;
      var pRow = [
        uid, empId, r[2]||'', r[3]||'', r[4]||'', r[5]||'',
        r[6]||'', r[7]||'', r[40]||'', normalizeDateStr(r[12]),
        r[17]||'', '', r[8]||'', r[9]||'', normalizeDateStr(r[10]),
        r[22]||'', r[23]||'', r[19]||'', r[20]||'', r[21]||'',
        '', r[35]||'', r[36]||'', normalizeDateStr(r[34]),
        'TRUE', '', '', r[24]||'', normalizeDateStr(r[25]),
        now, now, 'IMPORT'
      ];
      pSheet.appendRow(pRow);

      // Career history
      var careerPaths = [];
      var joinDateNorm = normalizeDateStr(r[12]);
      if (r[38]) careerPaths.push({ jabatan:r[38].toString(), mulai:joinDateNorm, selesai:normalizeDateStr(r[39])||'' });
      for (var c=39;c<64;c+=2){
        var jab=r[c]?r[c].toString().trim():'';
        var dt=r[c+1]?normalizeDateStr(r[c+1]):'';
        if (jab) {
          var selesai = (c+2<64)?normalizeDateStr(r[c+2]):'';
          careerPaths.push({ jabatan:jab, mulai:dt, selesai:selesai });
        }
      }
      careerPaths.forEach(function(cp,idx){
        var isCurr=idx===(careerPaths.length-1)?'TRUE':'FALSE';
        cSheet.appendRow(['c_'+uid+'_'+idx, empId, idx, cp.jabatan, r[4]||'', r[5]||'',
          cp.mulai, cp.selesai, '', isCurr, now, 'IMPORT']);
      });

      // Family: spouse
      if (r[24]&&r[24].toString().trim()) {
        fSheet.appendRow(['fs_'+uid, empId, 'pasangan', r[24].toString(), normalizeDateStr(r[25]), 0]);
      }
      // Children (cols 26-33: AA-AH)
      var childCols = [[26,27],[28,29],[30,31],[32,33]];
      childCols.forEach(function(pair,idx){
        var cName=(r[pair[0]]||'').toString().trim();
        if (cName) fSheet.appendRow(['fc_'+uid+'_'+idx, empId, 'anak', cName, normalizeDateStr(r[pair[1]]), idx+1]);
      });

      existingIds[empId]=true;
      imported++;
    }

    invalidateDataCache();
    logAction(session.username,'IMPORT','Import Data','','','','',imported+' pegawai berhasil diimpor, '+skipped+' dilewati.');
    return { success:true, imported:imported, skipped:skipped, errors:errors };
  } catch(e) {
    return { success:false, message:'Import gagal: '+e.toString() };
  }
}

// ============================================================
// GOOGLE OAUTH LOGIN (PRD Section 6)
// ============================================================
function loginWithGoogle() {
  var email = Session.getActiveUser().getEmail();
  if (!email) return { success: false, message: 'Tidak dapat mengambil email Google. Pastikan Anda login ke Google.' };

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('users');
  if (!sheet) return { success: false, message: 'Sheet users tidak ditemukan. Jalankan setupDatabase().' };

  var data = sheet.getDataRange().getValues();
  var map = getColumnMap(sheet);
  for (var i = 1; i < data.length; i++) {
    if (data[i][map['email']] === email || data[i][map['username']] === email) {
      if (data[i][map['is_active']].toString().toUpperCase() !== 'TRUE') {
        return { success: false, message: 'Akun Anda non-aktif. Hubungi Admin HR.' };
      }
      var username = data[i][map['username']];
      var token = generateSessionToken(username);
      logAction(username, 'LOGIN_GOOGLE', 'Auth', '', '', '', '', 'Login via Google OAuth berhasil.');
      return {
        success: true,
        token: token,
        user: {
          username: username,
          fullname: data[i][map['fullname']],
          role: data[i][map['role']],
          departement: data[i][map['departement']] || ''
        }
      };
    }
  }
  logAction(email, 'LOGIN_FAIL_GOOGLE', 'Auth', '', '', '', '', 'Email tidak terdaftar: ' + email);
  return { success: false, message: 'Email ' + email + ' tidak terdaftar di sistem. Hubungi Admin HR.' };
}

// ============================================================
// DOCUMENT MANAGEMENT (PRD Section 11.4)
// ============================================================
function getDokumenPegawai(token, employeeId) {
  var session = validateSession(token);
  if (!session.valid) return { success: false, message: session.message, sessionExpired: true };
  if (session.role !== 'Super Admin' && session.role !== 'Admin HR') return { success: false, message: 'Hak akses ditolak.' };

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('dokumen_pegawai');
  if (!sheet || sheet.getLastRow() <= 1) return { success: true, data: [] };

  var map = getColumnMap(sheet);
  var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  var docs = [];
  data.forEach(function(r) {
    if (r[map['employee_id']] === employeeId) {
      docs.push({
        id: r[map['id']],
        employee_id: r[map['employee_id']],
        kategori: r[map['kategori']],
        nama_file: r[map['nama_file']],
        file_id: r[map['file_id']],
        url: r[map['url']],
        uploaded_at: safeDateFormat(r[map['uploaded_at']]),
        uploaded_by: r[map['uploaded_by']]
      });
    }
  });
  return { success: true, data: docs };
}

function uploadDokumenPegawai(token, employeeId, kategori, namaFile, fileId, fileUrl) {
  var session = validateSession(token);
  if (!session.valid) return { success: false, message: session.message, sessionExpired: true };
  if (session.role !== 'Super Admin' && session.role !== 'Admin HR') return { success: false, message: 'Hak akses ditolak.' };

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('dokumen_pegawai');
  if (!sheet) return { success: false, message: 'Sheet dokumen tidak ditemukan.' };

  var docId = 'dok_' + Date.now();
  sheet.appendRow([docId, employeeId, kategori, sanitizeInput(namaFile, 100), fileId, fileUrl, new Date().toISOString(), session.username]);
  logAction(session.username, 'UPLOAD_DOC', 'Dokumen', employeeId, 'kategori', '', kategori, 'Dokumen diupload: ' + namaFile);
  return { success: true };
}

function deleteDokumenPegawai(token, docId) {
  var session = validateSession(token);
  if (!session.valid) return { success: false, message: session.message, sessionExpired: true };
  if (session.role !== 'Super Admin') return { success: false, message: 'Hak akses ditolak.' };

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('dokumen_pegawai');
  if (!sheet) return { success: false, message: 'Sheet dokumen tidak ditemukan.' };

  var map = getColumnMap(sheet);
  var data = sheet.getDataRange().getValues();
  for (var i = data.length - 1; i >= 1; i--) {
    if (data[i][map['id']] === docId) {
      sheet.deleteRow(i + 1);
      logAction(session.username, 'DELETE_DOC', 'Dokumen', data[i][map['employee_id']], '', '', '', 'Dokumen dihapus: ' + data[i][map['nama_file']]);
      return { success: true };
    }
  }
  return { success: false, message: 'Dokumen tidak ditemukan.' };
}

// ============================================================
// PROFILE COMPLETENESS CHECK (PRD FR-022)
// ============================================================
function getProfileCompleteness(employeeId) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var pSheet = ss.getSheetByName('pegawai');
  if (!pSheet || pSheet.getLastRow() <= 1) return { completeness: 0, missing: [] };

  var pMap = getColumnMap(pSheet);
  var data = pSheet.getDataRange().getValues();
  var pegawaiRow = null;
  for (var i = 1; i < data.length; i++) {
    if (data[i][pMap['employee_id']] === employeeId) { pegawaiRow = data[i]; break; }
  }
  if (!pegawaiRow) return { completeness: 0, missing: ['Data pegawai tidak ditemukan'] };

  var required = [
    { field: 'email_kantor', label: 'Email Kantor' },
    { field: 'mobile_phone', label: 'No. HP' },
    { field: 'nik', label: 'NIK' },
    { field: 'nik_address', label: 'Alamat KTP' },
    { field: 'residential_address', label: 'Alamat Domisili' },
    { field: 'education_level', label: 'Pendidikan Terakhir' },
    { field: 'institution_name', label: 'Nama Institusi' },
    { field: 'graduation_date', label: 'Tanggal Lulus' }
  ];

  var missing = [];
  required.forEach(function(req) {
    var val = pegawaiRow[pMap[req.field]];
    if (!val || val.toString().trim() === '') missing.push(req.label);
  });

  var completeness = Math.round(((required.length - missing.length) / required.length) * 100);
  return { completeness: completeness, missing: missing };
}

// ============================================================
// NOTIFIKASI SCHEDULER (dipanggil via GAS Time-based Trigger)
// Pasang trigger: setiap hari pukul 07:00 WIB
// ============================================================
function runDailyNotifications() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var pSheet = ss.getSheetByName('pegawai');
  if (!pSheet || pSheet.getLastRow()<=1) return;

  var pMap = getColumnMap(pSheet);
  var data = pSheet.getRange(2,1,pSheet.getLastRow()-1,pSheet.getLastColumn()).getValues();
  var today = new Date();
  var adminEmail = getAppSetting('notif_email_admin') || '';

  var kontrak30=[], kontrak14=[], kontrak7=[], birthdays=[], anniversaries=[];

  data.forEach(function(r){
    if ((r[pMap['is_active']]+'').toUpperCase()!=='TRUE') return;
    var status = r[pMap['employment_status']];
    var joinDate = r[pMap['join_date']] ? new Date(r[pMap['join_date']]) : null;
    var dob = r[pMap['date_of_birth']] ? new Date(r[pMap['date_of_birth']]) : null;
    var email = r[pMap['email_kantor']]||'';
    var name = r[pMap['full_name']];
    var eid = r[pMap['employee_id']];

    // Kontrak notifications using contract_end_date field (PRD-compliant)
    if (status==='Kontrak') {
      var contractEnd = null;
      if (r[pMap['contract_end_date']]) {
        contractEnd = new Date(r[pMap['contract_end_date']]);
      } else if (joinDate) {
        // Fallback: if no explicit contract_end_date, assume 1 year from join date
        contractEnd = new Date(joinDate);
        contractEnd.setFullYear(contractEnd.getFullYear()+1);
      }
      if (contractEnd && !isNaN(contractEnd.getTime())) {
        var daysLeft = Math.round((contractEnd - today) / (24*3600*1000));
        if (daysLeft<=30 && daysLeft>=0) {
          var info = { name:name, eid:eid, email:email, days:daysLeft, end:contractEnd.toISOString().split('T')[0] };
          if (daysLeft<=7) kontrak7.push(info);
          else if (daysLeft<=14) kontrak14.push(info);
          else kontrak30.push(info);
        }
      }
    }

    // Birthday
    if (dob) {
      var thisYearBday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
      var daysToBday = Math.round((thisYearBday - today) / (24*3600*1000));
      if (daysToBday>=0 && daysToBday<=6) birthdays.push({ name:name, eid:eid, date:thisYearBday.toISOString().split('T')[0] });
    }

    // Work anniversary (whole years)
    if (joinDate) {
      var yearsWorked = today.getFullYear() - joinDate.getFullYear();
      var anniv = new Date(today.getFullYear(), joinDate.getMonth(), joinDate.getDate());
      var daysToAnniv = Math.round((anniv - today) / (24*3600*1000));
      if (daysToAnniv===0 && yearsWorked>0) anniversaries.push({ name:name, eid:eid, years:yearsWorked });
    }
  });

  // Send email summaries
  if (adminEmail) {
    if (kontrak30.length>0 || kontrak14.length>0 || kontrak7.length>0) {
      var kontrakBody = buildKontrakEmailBody(kontrak7, kontrak14, kontrak30);
      MailApp.sendEmail({ to:adminEmail, subject:'[SIMDP] Notifikasi Kontrak Habis - '+Utilities.formatDate(today, Session.getScriptTimeZone(),'dd MMMM yyyy'), body:kontrakBody });
    }
    if (birthdays.length>0) {
      var bdBody = '🎂 Ulang Tahun Karyawan Minggu Ini:\n\n'+birthdays.map(function(b){ return '• '+b.name+' ('+b.eid+') - '+b.date; }).join('\n');
      MailApp.sendEmail({ to:adminEmail, subject:'[SIMDP] Ulang Tahun Karyawan', body:bdBody });
    }
  }

  logAction('SYSTEM','NOTIF_RUN','Notifikasi','','','','',
    'H-30:'+kontrak30.length+', H-14:'+kontrak14.length+', H-7:'+kontrak7.length+
    ', Birthday:'+birthdays.length+', Anniversary:'+anniversaries.length);
}

function buildKontrakEmailBody(h7, h14, h30) {
  var lines = ['Ringkasan Status Kontrak Karyawan - '+new Date().toDateString(),''];
  if (h7.length>0) {
    lines.push('🔴 SEGERA (≤7 hari):');
    h7.forEach(function(k){ lines.push('  • '+k.name+' ('+k.eid+') – berakhir '+k.end+' ('+k.days+' hari lagi)'); });
    lines.push('');
  }
  if (h14.length>0) {
    lines.push('🟡 PERHATIAN (≤14 hari):');
    h14.forEach(function(k){ lines.push('  • '+k.name+' ('+k.eid+') – berakhir '+k.end+' ('+k.days+' hari lagi)'); });
    lines.push('');
  }
  if (h30.length>0) {
    lines.push('🟢 INFO (≤30 hari):');
    h30.forEach(function(k){ lines.push('  • '+k.name+' ('+k.eid+') – berakhir '+k.end+' ('+k.days+' hari lagi)'); });
  }
  return lines.join('\n');
}
