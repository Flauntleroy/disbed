// Auto-generated from bangsal.sql
// Mapping kode bangsal ke nama lengkap

const WARD_NAMES = {
    "-": "-",
    "AGR": "Anggrek",
    "AGRB": "Box Bayi Anggrek",
    "AGRI": "Isolasi Anggrek",
    "AInc": "Incubator Anggrek",
    "AInf": "Infant Anggrek",
    "ALM": "Alamanda",
    "ANT": "Anestesi",
    "AP": "Apotek",
    "B0014": "LABORATORIUM",
    "B0052": "UTDRS",
    "CSSD": "CSSD",
    "DPRI": "Depo Rawat Inap",
    "Far": "Farmasi",
    "GD": "Gudang Obat",
    "GZ": "Gizi",
    "HCU": "HCU",
    "ICU": "ICU",
    "IGD": "IGD",
    "IIN": "ISOLASI ICU & NICU",
    "JNZ": "Jenazah",
    "K1": "Kamar Kelas I",
    "K2": "Kamar Kelas II",
    "K3": "Kamar Kelas III",
    "KB": "Kenanga Bedah",
    "KMDT": "Kenanga Paru MDT",
    "KNG": "Kenanga",
    "KO": "Kamar Operasi",
    "KPI": "Kenanga Paru Infeksi",
    "KPNI": "Kenanga Saraf / Kulit / noninf",
    "KS": "Konsultasi",
    "KUJI": "Kamar Uji Coba",
    "LBPA": "Lab Patalogi Anatomi",
    "LKT": "Loket",
    "M01": "Mawar",
    "MG": "Mawar Gynekologi",
    "MI": "Mawar Isolasi",
    "MO": "Mawar Obsterti",
    "MWRT": "Mawar Tindakan",
    "NICU": "NICU",
    "OPB": "Operasi Bedah",
    "PER": "Perinatologi",
    "PG": "Poli Geriatri",
    "POA": "Poliklinik Anak",
    "POB": "Poliklinik Bedah",
    "POF": "Poliklinik Fisioterapi",
    "POGM": "Poliklinik Gigi & Mulut",
    "POJ": "Poliklinik Jiwa",
    "POK": "Poliklinik Kandungan/Obgyn",
    "POKK": "Poliklinik Kulit & Kelamin",
    "POM": "Poliklinik Mata",
    "POO": "Poliklinik Orthopedi",
    "POP": "Poliklinik Paru",
    "POPD": "Poliklinik Penyakit Dalam",
    "POS": "Poliklinik Syaraf",
    "POT": "Poliklinik THT",
    "POU": "Poliklinik Umum",
    "PRM": "Poli Rehabilitasi Medik",
    "RAD": "Radiologi",
    "RECO": "Recovery Room",
    "RJ": "Ruang Jenazah",
    "TRT": "Teratai",
    "TRT2": "Teratai VIP",
    "TRTIS": "Teratai Isolasi",
    "TRTPA": "Teratai Paru Non Isolasi",
    "TU": "TU",
    "VIP": "Kamar Kelas VIP",
    "VIP01": "Ruang VIP",
    "VVIP": "Kamar Kelas VVIP",
    "KIC": "ICCU",
    "uji01": "Uji Coba"
};

// Status bangsal: '1' = aktif, '0' = tidak aktif
const WARD_STATUS = {
    "-": "1", "AGR": "1", "AGRB": "1", "AGRI": "1", "AInc": "1", "AInf": "1",
    "ALM": "1", "ANT": "0", "AP": "1", "B0014": "0", "B0052": "0", "CSSD": "1",
    "DPRI": "1", "Far": "0", "GD": "1", "GZ": "0", "HCU": "0", "ICU": "1",
    "IGD": "1", "IIN": "1", "JNZ": "0", "K1": "0", "K2": "0", "K3": "0",
    "KB": "1", "KMDT": "1", "KNG": "1", "KO": "1", "KPI": "1", "KPNI": "1",
    "KS": "0", "KUJI": "0", "LBPA": "0", "LKT": "0", "M01": "1", "MG": "1",
    "MI": "1", "MO": "1", "MWRT": "1", "NICU": "1", "OPB": "1", "PER": "0",
    "PG": "0", "POA": "0", "POB": "0", "POF": "0", "POGM": "0", "POJ": "0",
    "POK": "0", "POKK": "0", "POM": "0", "POO": "0", "POP": "0", "POPD": "0",
    "POS": "0", "POT": "0", "POU": "0", "PRM": "0", "RAD": "0", "RECO": "1",
    "RJ": "1", "TRT": "1", "TRT2": "1", "TRTIS": "1", "TRTPA": "1", "TU": "0",
    "VIP": "0", "VIP01": "0", "VVIP": "0", "KIC": "1", "uji01": "1"
};

export function getWardName(code) {
    return WARD_NAMES[code] || code;
}

export function isWardActive(code) {
    return WARD_STATUS[code] === '1';
}

export default WARD_NAMES;

