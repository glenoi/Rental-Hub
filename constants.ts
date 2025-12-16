import { Property, PropertyType, Furnishing, BookingRequest, RequestStatus, TenantProfile } from './types';

// --- RAW DATASETS ---

const KL_DATA = `No.,Project / Property Name,Location,Type,Size (sqft),Sale Price (RM),Rental (RM/mo)
1,Platinum Melati Residences,Setapak,Apartment,"1,100","677,500","2,200"
2,Talisa @ Bangsar Hill Park,Bangsar,Condo,917,"914,000","3,500"
3,SkyAman 1 Residences,Cheras,Condo,"1,097","701,000","2,000"
4,J.Rayon Residences,Seputeh,Apartment,950,"550,000","1,800"
5,Majestic @ Kiara Reserve,Mont Kiara,Twin Villa,"2,314","2,800,000","9,500"
6,Padang Residence,KL City Centre,Service Res,802,"580,000","2,800"
7,EkoTitiwangsa,Titiwangsa,Service Res,690,"413,000","1,900"
8,PSV 2 Residences,Bandar Tasik Selatan,Apartment,947,"512,000","1,700"
9,M Aspira,Taman Desa,Service Res,706,"452,000","1,600"
10,Radium Arena,Old Klang Road,Condo,658,"410,000","1,500"
11,KL East: The Reya,KL East,Condo,"1,350","899,000","3,200"
12,Kiaramas deDaun Phase 2,Mont Kiara,Condo,"1,313","1,112,800","4,500"
13,M Azura,Setapak,Service Res,700,"380,000","1,400"
14,PV22 Residences,Setapak,Apartment,490,"373,000","1,300"
15,TuJu Residences,Jalan Kuching,Service Res,710,"440,960","1,600"
16,The Connaught One,Cheras,Service Res,452,"380,000","1,400"
17,Sunway Flora 2,Bukit Jalil,Service Res,764,"568,000","2,100"
18,Conlay Signature Suites,KLCC,Service Res,635,"1,552,000","4,800"
19,Chancery Ampang,Ampang,SOHO,452,"420,000","1,800"
20,SkyAwani PRIMA,Brickfields,Apartment,900,"390,000","1,600"
21,Levia Residence,Cheras,Condo,938,"684,000","2,300"
22,CloutHaus Residences,KLCC,Service Res,904,"600,000","3,000"
23,River Park,Bangsar South,Condo,812,"573,000","2,500"
24,SWNK Houze @ BBCC,Bukit Bintang,Service Res,650,"780,000","3,200"
25,Solaris Condo,Mont Kiara,Bungalow,"1,000","400,000","2,000"
26,The Maple Residences,OUG,Condo,952,"835,000","2,800"
27,Pavilion Damansara Heights,Damansara Heights,Condo,"2,803","3,998,000","12,000"
28,Aetas Seputeh,Seputeh,Condo,"3,500","3,800,000","11,500"
29,Gallery @ U-Thant,Ampang Hilir,Condo,"4,602","4,200,000","13,000"
30,SO Sofitel Residences,KLCC,Condo,"4,039","4,030,000","15,000"
31,One Eleven Menerung,Bangsar,Service Res,"1,400","1,270,000","5,500"
32,One Residence,Chan Sow Lin,Condo,"1,250","1,960,000","4,200"
33,Kinrara Mas,Bukit Jalil,Condo,"1,240","450,000","1,700"
34,Brunsfield EmbassyView,Ampang,Condo,"1,851","1,100,000","4,000"
35,Mulberi,Segambut,Condo,"1,051","600,000","2,100"
36,Taman Tun Dr Ismail Condo,TTDI,Condo,600,"250,000","1,200"
37,Bukit Pantai Condo,Bangsar,Condo,700,"260,000","1,300"
38,Sentul Point,Sentul,Condo,878,"370,000","1,600"
39,Sungai Besi Furnished,Sungai Besi,Condo,900,"350,000","1,500"
40,The Treez Jalil,Bukit Jalil,Condo,"1,500","1,100,000","3,500"
41,Agile Bukit Bintang,Bukit Bintang,Service Res,625,"1,100,000","3,800"
42,Lucentia Residences,BBCC,Service Res,454,"550,000","2,500"
43,Core Residence @ TRX,TRX,Service Res,624,"1,300,000","4,200"
44,Stonor 3,KLCC,Condo,871,"1,450,000","4,500"
45,The Manor,KLCC,Condo,"1,109","1,800,000","6,000"
46,Aria Luxury Residence,KLCC,Condo,630,"1,200,000","4,000"
47,Setia Sky Seputeh,Seputeh,Condo,"2,300","2,400,000","8,500"
48,Alix Residences,Dutamas,Condo,"1,600","1,300,000","4,800"
49,The Fennel,Sentul East,Condo,"1,186","750,000","2,600"
50,Capri by Fraser,Bukit Bintang,Service Res,588,"980,000","3,300"`;

const JOHOR_DATA = `No.,Project / Property Name,Location,Type,Size (sqft),Sale Price (RM),Rental (RM/mo)
1,Taman Kolam Air,Johor Bahru,Bungalow,"6,800","3,500,000","8,000"
2,The Kews @ Leisure Farm,Gelang Patah,Terrace,"2,003","1,000,000","4,500"
3,Southkey NADI Residences,Southkey,Service Res,649,"434,000","2,200"
4,Taman Bestari Indah,Ulu Tiram,Terrace,775,"340,000","1,200"
5,Skudai Bungalow,Skudai,Bungalow,"5,302","1,450,000","3,500"
6,Taman Molek Terrace,Taman Molek,1.5-Sty,"1,300","600,000","1,800"
7,Eco Botanic Semi-D,Iskandar Puteri,Semi-D,"3,271","2,680,000","6,500"
8,Taman Mount Austin,Tebrau,Cluster,"2,394","1,559,030","3,000"
9,R&F Princess Cove Ph 1,JB City Centre,Service Res,471,"382,000","2,300"
10,Setia Eco Gardens,Iskandar Puteri,Bungalow,"4,648","2,180,000","5,000"
11,SKS Pavillion Residences,JB City Centre,Condo,"1,076","958,000","3,500"
12,M Grand Minori,Taman Pelangi,Apartment,403,"350,000","1,400"
13,Summer Suites,Bukit Meldrum,Service Res,599,"450,000","1,800"
14,The Straits View,Permas Jaya,Semi-D,"4,165","2,580,000","5,500"
15,Taman Desa Tebrau,Tebrau,Terrace,"1,650","590,000","1,700"
16,Astera,Ulu Tiram,Terrace,"1,939","721,000","1,900"
17,Skypark Kepler,Lido Waterfront,Service Res,667,"450,000","1,600"
18,Monterra Johor Bahru,JB City Centre,Service Res,579,"382,200","1,500"
19,The M @ Medini,Medini,Service Res,753,"421,000","1,800"
20,Paragon Gateway,Taman Suria,Service Res,648,"498,000","1,900"
21,Eco Botanic Cluster,Iskandar Puteri,Cluster,"3,420","2,600,000","5,000"
22,Nusa Idaman Precinct 8,Bukit Indah,Semi-D,"2,765","1,550,000","3,200"
23,Taman Scientex,Pasir Gudang,Terrace,"2,077","450,000","1,300"
24,TriTower Residence,JB Sentral,Condo,"1,345","1,018,290","4,000"
25,Taman Nusa Bestari,Iskandar Puteri,Apartment,895,"395,000","1,400"
26,Taman Kota Jaya,Kota Tinggi,Terrace,"1,620","388,000","1,000"
27,8Scape Residence,Sutera,Apartment,808,"380,000","1,500"
28,Taman Sri Skudai,Skudai,Terrace,"1,300","618,000","1,600"
29,Midas @ Seri Alam,Masai,Service Res,431,"238,000","1,000"
30,Havona,Mount Austin,Condo,953,"570,000","2,200"
31,Danga Bay Bungalow,Danga Bay,Bungalow,"10,000","3,499,000","9,000"
32,Bandar Dato Onn,Dato Onn,Terrace,"1,680","749,000","2,400"
33,Bandar Baru Uda,JB City,Terrace,882,"420,000","1,500"
34,Taman Nong Chik,JB City,Semi-D,"3,660","1,500,000","3,500"
35,Yahya Awal Bungalow,JB City,Bungalow,"7,900","1,500,000","4,000"
36,Century Garden,JB City,Terrace,"1,920","868,000","2,500"
37,Taman Laguna,Perling,Superlink,"2,210","930,000","2,800"
38,Tropez Residences,Danga Bay,Service Res,500,"300,000","1,400"
39,Forest City,Gelang Patah,Service Res,517,"350,000","1,200"
40,Teega Residences,Puteri Harbour,Condo,"1,167","850,000","2,800"
41,Imperia Condominium,Puteri Harbour,Condo,"1,519","1,200,000","3,500"
42,Horizon Hills,Iskandar Puteri,Semi-D,"3,000","1,900,000","4,500"
43,East Ledang,Iskandar Puteri,Bungalow,"4,800","3,200,000","7,500"
44,Austin Heights,Mount Austin,Bungalow,"4,000","2,500,000","6,000"
45,Senibong Cove,Masai,Semi-D,"3,200","2,100,000","5,500"
46,Country Garden Danga Bay,Danga Bay,Condo,800,"550,000","1,900"
47,Twin Galaxy,JB City,Service Res,936,"650,000","2,300"
48,Setia Sky 88,JB City,Service Res,872,"750,000","2,600"
49,KSL Residences,Daya,Service Res,"1,097","480,000","2,000"
50,Green Haven,Permas Jaya,Service Res,750,"400,000","1,700"`;

const PENANG_DATA = `No.,Project / Property Name,Location,Type,Size (sqft),Sale Price (RM),Rental (RM/mo)
1,Andaman @ Quayside,Tanjung Tokong,Condo,"2,824","2,600,000","8,500"
2,SkyWorld Pearlmont,Seberang Perai,Apartment,900,"323,000","1,300"
3,M Zenni,Batu Maung,Service Res,688,"400,000","1,500"
4,Tuan Pavilion,Ayer Itam,Condo,"1,172","550,000","1,800"
5,Lumina Residence,George Town,Condo,"1,346","1,070,000","3,800"
6,QuayWest Residence,Bayan Lepas,Condo,"1,310","850,000","3,200"
7,Quayside Condominium,Tanjung Tokong,Condo,"1,137","1,280,000","4,500"
8,Millennium Tower,Gurney Drive,Condo,"6,380","4,200,000","12,000"
9,Mayfair Condominium,George Town,Condo,"4,964","3,200,000","9,500"
10,Sri York Condominium,George Town,Condo,"2,120","995,000","2,500"
11,8 Gurney (The Shore),Gurney Drive,Condo,"5,800","3,650,000","10,000"
12,Setia V Residences,Gurney Drive,Condo,"2,753","3,598,000","8,000"
13,Straits Residences,Tanjung Tokong,Service Res,861,"1,200,000","4,000"
14,The Tamarind,Tanjung Tokong,Condo,"1,047","780,000","2,800"
15,The Light Collection II,Gelugor,Condo,"1,701","1,650,000","4,500"
16,The Light Point,Gelugor,Condo,"1,830","1,480,000","4,200"
17,Moulmein Rise,Pulau Tikus,Condo,"1,787","2,500,000","6,500"
18,Gurney Park,Gurney Drive,Condo,970,"650,000","2,300"
19,Skyview Residence,Jelutong,Condo,"1,450","750,000","2,400"
20,Urban Suites,Jelutong,Service Res,630,"480,000","1,800"
21,Arte S,Gelugor,Condo,"1,313","700,000","2,500"
22,Queens Waterfront Q1,Bayan Lepas,Condo,950,"900,000","3,500"
23,Tree Sparina,Bayan Lepas,Condo,"1,130","600,000","1,900"
24,Summerskye Residences,Bayan Lepas,Condo,"1,100","620,000","2,000"
25,Solaria Residences,Bayan Lepas,Condo,"1,100","630,000","2,100"
26,Olive Tree Residences,Bayan Lepas,Condo,"1,656","850,000","2,800"
27,One Foresta,Bayan Lepas,Condo,900,"450,000","1,400"
28,Forestville,Bayan Lepas,Condo,"1,000","480,000","1,500"
29,Imperial Grande,Sungai Ara,Condo,"1,000","520,000","1,600"
30,Golden Triangle 2,Sungai Ara,Condo,"1,161","580,000","1,800"
31,Sierra East,Relau,Condo,"1,304","600,000","1,900"
32,Havana Beach Residences,Bayan Lepas,Condo,900,"400,000","1,400"
33,Vertu Resort,Batu Kawan,Condo,"1,030","550,000","1,800"
34,Utropolis Utama,Batu Kawan,Service Res,729,"450,000","1,600"
35,Suasana @ Utropolis,Batu Kawan,Service Res,926,"520,000","1,900"
36,Sensasi @ Utropolis,Batu Kawan,Service Res,729,"420,000","1,500"
37,Woodsbury Suites,Butterworth,Service Res,750,"380,000","1,400"
38,Wellesley Residences,Butterworth,Condo,"1,100","420,000","1,500"
39,Luminari,Butterworth,Service Res,947,"450,000","1,600"
40,Meritus Residensi,Perai,Service Res,950,"420,000","1,500"
41,Evoke Residence,Perai,Condo,"1,100","460,000","1,600"
42,Prominence,Bukit Mertajam,Condo,"1,162","480,000","1,700"
43,BM City Suites,Bukit Mertajam,Service Res,871,"380,000","1,400"
44,Kondominium Mutiara,Bandar Perda,Condo,800,"250,000","1,000"
45,Casa Perdana,Seberang Perai,Terrace,"1,600","550,000","1,500"
46,Hijauan Valdor,Sungai Bakap,Semi-D,"2,400","600,000","1,600"
47,Eco Horizon,Batu Kawan,Terrace,"2,290","950,000","2,800"
48,Setia Fontaines,Bertam,Terrace,"1,800","450,000","1,500"
49,Mekarsari,Bertam,Semi-D,"2,100","550,000","1,700"
50,Scientex Tasek Gelugor,Tasek Gelugor,Terrace,"1,200","300,000","1,100"`;

// --- PARSING LOGIC ---

// Helper to determine rooms based on size (heuristic)
const getSpecs = (sqft: number) => {
    if (sqft < 600) return { rooms: 1, bathrooms: 1 };
    if (sqft < 900) return { rooms: 2, bathrooms: 2 };
    if (sqft < 1500) return { rooms: 3, bathrooms: 2 };
    return { 
        rooms: 4 + Math.floor((sqft - 1500)/1000), 
        bathrooms: 3 + Math.floor((sqft - 1500)/1500) 
    };
}

// Helper to map raw CSV type to Enum
const mapType = (rawType: string): PropertyType => {
    const lower = rawType.toLowerCase();
    if (lower.includes('bungalow') || lower.includes('terrace') || lower.includes('semi-d') || lower.includes('cluster') || lower.includes('villa') || lower.includes('superlink') || lower.includes('1.5-sty')) {
        return PropertyType.LANDED;
    }
    return PropertyType.CONDO; // Default for Apartment, Condo, Service Res, SOHO
}

// Helper to get random furnishing
const getRandomFurnishing = () => {
    const types = [Furnishing.FULLY, Furnishing.PARTIALLY, Furnishing.UNFURNISHED];
    return types[Math.floor(Math.random() * types.length)];
}

const parseCSV = (csvData: string, regionPrefix: string): Property[] => {
    const lines = csvData.trim().split('\n');
    const properties: Property[] = [];
    
    // Skip header row (i=1)
    for (let i = 1; i < lines.length; i++) {
        // Handle CSV parsing considering quoted fields with commas (e.g., "1,200")
        const row = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        
        if (!row || row.length < 7) continue;

        // Cleanup function to remove quotes and commas from numbers
        const clean = (str: string) => str ? str.replace(/"/g, '').trim() : '';
        const cleanNum = (str: string) => str ? parseInt(str.replace(/"/g, '').replace(/,/g, ''), 10) : 0;

        const rawTitle = clean(lines[i].split(',')[1]); // Simple split for name might fail if name has comma, but these datasets look safe on name.
        // Actually, let's use a safer regex approach for the whole line split if possible, 
        // but for this specific dataset structure, the quoted numbers are the main issue.
        // Let's do a more manual parse to be safe against "Project, Name" issues if any.
        
        // Robust CSV Line Parser
        const parts: string[] = [];
        let current = '';
        let inQuotes = false;
        const line = lines[i];
        for(let char of line) {
            if (char === '"') { inQuotes = !inQuotes; continue; }
            if (char === ',' && !inQuotes) { parts.push(current); current = ''; continue; }
            current += char;
        }
        parts.push(current);

        if(parts.length < 7) continue;

        const id = `${regionPrefix}_${parts[0]}`;
        const title = parts[1];
        const location = parts[2];
        const typeRaw = parts[3];
        const sqft = parseInt(parts[4].replace(/,/g, ''), 10);
        // Col 5 is Sale Price, skip
        const rentalPrice = parseInt(parts[6].replace(/,/g, ''), 10);

        const { rooms, bathrooms } = getSpecs(sqft);

        properties.push({
            id,
            title,
            location: `${location}`,
            price: rentalPrice,
            type: mapType(typeRaw),
            furnishing: getRandomFurnishing(),
            rooms,
            bathrooms,
            sqft,
            images: [
                `https://picsum.photos/800/600?random=${id}`,
                `https://picsum.photos/800/600?random=${id}b`
            ],
            tags: [typeRaw, 'Available Now'],
            ownerId: 'owner_1',
            description: `A stunning ${sqft} sqft ${typeRaw} unit in ${location}. Perfect for those seeking comfort and convenience.`
        });
    }
    return properties;
}

const parsedKL = parseCSV(KL_DATA, 'kl');
const parsedJohor = parseCSV(JOHOR_DATA, 'jh');
const parsedPenang = parseCSV(PENANG_DATA, 'pg');

export const MOCK_PROPERTIES: Property[] = [
    ...parsedKL,
    ...parsedJohor,
    ...parsedPenang
];

export const MOCK_TENANT_PROFILE: TenantProfile = {
  id: 'tenant_1',
  fullName: 'Ahmad bin Razak',
  nricOrPassport: '950101-14-XXXX',
  gender: 'Male',
  nationality: 'Malaysian',
  race: 'Malay',
  occupation: 'Software Engineer',
  companyName: 'Grab Malaysia',
  officeLocation: 'First Avenue, Bandar Utama',
  monthlyIncome: 8500,
  paxAdults: 2,
  paxKids: 0,
  moveInDate: '2023-11-01',
  contractPeriod: 12,
  depositAgreed: true,
  bio: 'Quiet professional couple, clean and responsible.'
};

export const MOCK_REQUESTS: BookingRequest[] = [
  {
    id: 'req_1',
    propertyId: 'kl_1', // Updated to match new IDs
    tenantId: 'tenant_x',
    tenantProfile: { ...MOCK_TENANT_PROFILE, fullName: 'Sarah Lee', race: 'Chinese', occupation: 'Marketing Manager', monthlyIncome: 5500 },
    status: RequestStatus.PENDING,
    aiScore: 85,
    aiReasoning: 'Strong income-to-rent ratio. Stable employment in reputable industry.',
    createdAt: '2023-10-24T10:00:00Z'
  },
  {
    id: 'req_2',
    propertyId: 'kl_1',
    tenantId: 'tenant_y',
    tenantProfile: { ...MOCK_TENANT_PROFILE, fullName: 'John Doe', nationality: 'UK', occupation: 'Freelancer', monthlyIncome: 4000 },
    status: RequestStatus.REJECTED,
    aiScore: 45,
    aiReasoning: 'Income is borderline for this rental price. Freelance status poses higher risk.',
    createdAt: '2023-10-23T14:30:00Z'
  }
];