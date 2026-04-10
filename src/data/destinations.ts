export interface TransitEntry {
  id: string;
  route: string;
  dest: string;
  time: string;
  status: "on-time" | "delayed";
  type: "bus" | "train";
  stops: string[];
  frequency?: string;
  country: string;
  mapCountry: string; // for Google Maps suffix
}

export interface DestinationStop {
  name: string;
  x: number;
  y: number;
}

export interface VehicleInfo {
  type: "bus" | "train";
  name: string;
  dest: string;
  stops: DestinationStop[];
  color: string;
}

export const countries = [
  { id: "singapore", label: "🇸🇬 Singapore", mapSuffix: "Singapore" },
  { id: "india", label: "🇮🇳 India", mapSuffix: "India" },
  { id: "dubai", label: "🇦🇪 Dubai", mapSuffix: "UAE" },
  { id: "america", label: "🇺🇸 America", mapSuffix: "USA" },
  { id: "japan", label: "🇯🇵 Japan", mapSuffix: "Japan" },
  { id: "china", label: "🇨🇳 China", mapSuffix: "China" },
];

export const allTransit: TransitEntry[] = [
  // ===== SINGAPORE =====
  { id: "sg-bus-170", route: "Bus 170", dest: "Johor Bahru ↔ Kranji MRT", time: "07:15", status: "on-time", type: "bus", stops: ["Johor Bahru CIQ", "Woodlands Checkpoint", "Woodlands Centre", "Marsiling MRT", "Kranji MRT"], country: "singapore", mapCountry: "Singapore" },
  { id: "sg-bus-858", route: "Bus 858", dest: "Yishun ↔ Woodlands", time: "07:30", status: "delayed", type: "bus", stops: ["Yishun Int", "Yishun Ring Rd", "Sembawang", "Admiralty", "Woodlands Int"], country: "singapore", mapCountry: "Singapore" },
  { id: "sg-bus-67", route: "Bus 67", dest: "Tampines ↔ Choa Chu Kang", time: "08:00", status: "on-time", type: "bus", stops: ["Tampines Int", "Bedok North", "Bishan", "Bukit Panjang", "Choa Chu Kang"], country: "singapore", mapCountry: "Singapore" },
  { id: "sg-bus-36", route: "Bus 36", dest: "Changi Airport ↔ Tomlinson Rd", time: "06:45", status: "on-time", type: "bus", stops: ["Changi Airport T3", "Tanah Merah", "Geylang", "Orchard", "Tomlinson Rd"], country: "singapore", mapCountry: "Singapore" },
  { id: "sg-bus-51", route: "Bus 51", dest: "Hougang ↔ Jurong East", time: "07:00", status: "on-time", type: "bus", stops: ["Hougang Central", "Serangoon", "Toa Payoh", "Bukit Timah", "Jurong East"], country: "singapore", mapCountry: "Singapore" },
  { id: "sg-nsl", route: "North-South Line", dest: "Jurong East ↔ Marina Bay", time: "07:10", status: "on-time", type: "train", frequency: "4", stops: ["Jurong East", "Bukit Batok", "Bishan", "Orchard", "City Hall", "Marina Bay"], country: "singapore", mapCountry: "Singapore" },
  { id: "sg-ewl", route: "East-West Line", dest: "Pasir Ris ↔ Tuas Link", time: "07:12", status: "on-time", type: "train", frequency: "5", stops: ["Pasir Ris", "Tampines", "Paya Lebar", "Bugis", "Jurong East", "Tuas Link"], country: "singapore", mapCountry: "Singapore" },
  { id: "sg-dtl", route: "Downtown Line", dest: "Bukit Panjang ↔ Expo", time: "07:08", status: "on-time", type: "train", frequency: "3", stops: ["Bukit Panjang", "Beauty World", "Botanic Gardens", "Downtown", "Bayfront", "Expo"], country: "singapore", mapCountry: "Singapore" },
  { id: "sg-ccl", route: "Circle Line", dest: "Dhoby Ghaut ↔ HarbourFront", time: "07:05", status: "on-time", type: "train", frequency: "4", stops: ["Dhoby Ghaut", "Bras Basah", "Paya Lebar", "Bishan", "Botanic Gardens", "HarbourFront"], country: "singapore", mapCountry: "Singapore" },
  { id: "sg-nel", route: "North-East Line", dest: "HarbourFront ↔ Punggol", time: "07:06", status: "on-time", type: "train", frequency: "5", stops: ["HarbourFront", "Outram Park", "Dhoby Ghaut", "Little India", "Serangoon", "Punggol"], country: "singapore", mapCountry: "Singapore" },

  // ===== INDIA =====
  { id: "in-metro-blue", route: "Delhi Blue Line", dest: "Dwarka ↔ Noida City Centre", time: "06:00", status: "on-time", type: "train", frequency: "4", stops: ["Dwarka Sec 21", "Janakpuri West", "Rajouri Garden", "Rajiv Chowk", "Mandi House", "Noida City Centre"], country: "india", mapCountry: "India" },
  { id: "in-metro-yellow", route: "Delhi Yellow Line", dest: "Samaypur Badli ↔ HUDA City Centre", time: "06:10", status: "on-time", type: "train", frequency: "3", stops: ["Samaypur Badli", "Kashmere Gate", "Chandni Chowk", "Rajiv Chowk", "Qutub Minar", "HUDA City Centre"], country: "india", mapCountry: "India" },
  { id: "in-bus-dtc1", route: "DTC Bus 522", dest: "ISBT ↔ Badarpur", time: "07:00", status: "on-time", type: "bus", stops: ["ISBT Kashmere Gate", "Red Fort", "India Gate", "Lajpat Nagar", "Badarpur Border"], country: "india", mapCountry: "India" },
  { id: "in-bus-mumbai", route: "BEST Bus 1", dest: "Colaba ↔ CSMT", time: "06:30", status: "on-time", type: "bus", stops: ["Colaba Bus Depot", "Regal Cinema", "Flora Fountain", "Crawford Market", "CSMT"], country: "india", mapCountry: "India" },
  { id: "in-metro-mumbai", route: "Mumbai Metro Line 1", dest: "Versova ↔ Ghatkopar", time: "06:15", status: "on-time", type: "train", frequency: "4", stops: ["Versova", "Andheri", "Chakala", "Marol Naka", "Saki Naka", "Ghatkopar"], country: "india", mapCountry: "India" },
  { id: "in-metro-blr", route: "Namma Metro Green", dest: "Nagasandra ↔ Silk Institute", time: "06:00", status: "on-time", type: "train", frequency: "5", stops: ["Nagasandra", "Yeshwanthpur", "Majestic", "Chickpete", "Jayanagar", "Silk Institute"], country: "india", mapCountry: "India" },
  { id: "in-bus-blr", route: "BMTC Bus 500", dest: "Majestic ↔ Electronic City", time: "07:15", status: "delayed", type: "bus", stops: ["Majestic", "Lalbagh", "Jayanagar", "BTM Layout", "Electronic City"], country: "india", mapCountry: "India" },
  { id: "in-metro-chennai", route: "Chennai Metro Blue", dest: "Wimco Nagar ↔ Airport", time: "06:20", status: "on-time", type: "train", frequency: "6", stops: ["Wimco Nagar", "Washermanpet", "High Court", "Egmore", "Saidapet", "Airport"], country: "india", mapCountry: "India" },
  { id: "in-bus-chennai", route: "MTC Bus 27C", dest: "Broadway ↔ Tambaram", time: "06:45", status: "on-time", type: "bus", stops: ["Broadway", "T. Nagar", "Guindy", "Chromepet", "Tambaram"], country: "india", mapCountry: "India" },
  { id: "in-metro-kolkata", route: "Kolkata Metro Blue", dest: "Dakshineswar ↔ Kavi Subhash", time: "06:30", status: "on-time", type: "train", frequency: "5", stops: ["Dakshineswar", "Dum Dum", "Park Street", "Esplanade", "Rabindra Sarobar", "Kavi Subhash"], country: "india", mapCountry: "India" },

  // ===== DUBAI =====
  { id: "ae-metro-red", route: "Dubai Metro Red", dest: "Rashidiya ↔ UAE Exchange", time: "05:30", status: "on-time", type: "train", frequency: "4", stops: ["Rashidiya", "Dubai Airport T3", "Deira City Centre", "Burjuman", "Burj Khalifa/Dubai Mall", "UAE Exchange"], country: "dubai", mapCountry: "UAE" },
  { id: "ae-metro-green", route: "Dubai Metro Green", dest: "Etisalat ↔ Creek", time: "05:45", status: "on-time", type: "train", frequency: "5", stops: ["Etisalat", "Al Qusais", "Abu Hail", "Al Ras", "Bur Dubai", "Creek"], country: "dubai", mapCountry: "UAE" },
  { id: "ae-bus-8", route: "RTA Bus 8", dest: "Gold Souq ↔ Mall of Emirates", time: "06:00", status: "on-time", type: "bus", stops: ["Gold Souq Station", "Al Rigga", "World Trade Centre", "Al Quoz", "Mall of the Emirates"], country: "dubai", mapCountry: "UAE" },
  { id: "ae-bus-27", route: "RTA Bus 27", dest: "Deira ↔ Dragon Mart", time: "06:30", status: "on-time", type: "bus", stops: ["Deira City Centre", "Al Twar", "Mirdif", "Silicon Oasis", "Dragon Mart"], country: "dubai", mapCountry: "UAE" },
  { id: "ae-tram", route: "Dubai Tram", dest: "Al Sufouh ↔ JBR", time: "06:15", status: "on-time", type: "train", frequency: "6", stops: ["Al Sufouh", "Knowledge Village", "Dubai Marina", "JLT", "JBR"], country: "dubai", mapCountry: "UAE" },
  { id: "ae-bus-f55", route: "RTA Bus F55", dest: "Dubai Mall ↔ Business Bay", time: "07:00", status: "on-time", type: "bus", stops: ["Dubai Mall", "Burj Khalifa", "Business Bay", "Bay Square", "Executive Towers"], country: "dubai", mapCountry: "UAE" },
  { id: "ae-bus-x25", route: "RTA Bus X25", dest: "Abu Dhabi ↔ Dubai", time: "05:00", status: "delayed", type: "bus", stops: ["Abu Dhabi Central", "Khalifa City", "Jebel Ali", "Ibn Battuta", "Dubai Internet City"], country: "dubai", mapCountry: "UAE" },
  { id: "ae-monorail", route: "Palm Monorail", dest: "Gateway ↔ Atlantis", time: "10:00", status: "on-time", type: "train", frequency: "10", stops: ["Gateway Station", "Al Ittihad Park", "Nakheel Mall", "Atlantis Aquaventure"], country: "dubai", mapCountry: "UAE" },
  { id: "ae-bus-88", route: "RTA Bus 88", dest: "Mall of Emirates ↔ Jumeirah", time: "07:15", status: "on-time", type: "bus", stops: ["Mall of the Emirates", "Al Barsha", "Umm Suqeim", "Jumeirah Beach", "Jumeirah Mosque"], country: "dubai", mapCountry: "UAE" },
  { id: "ae-bus-c26", route: "RTA Bus C26", dest: "Deira ↔ Al Mamzar", time: "06:45", status: "on-time", type: "bus", stops: ["Deira City Centre", "Naif", "Corniche Deira", "Al Hamriya", "Al Mamzar Beach"], country: "dubai", mapCountry: "UAE" },

  // ===== AMERICA =====
  { id: "us-subway-1", route: "NYC Subway 1", dest: "Van Cortlandt Park ↔ South Ferry", time: "05:30", status: "on-time", type: "train", frequency: "4", stops: ["Van Cortlandt Park", "Times Square", "Penn Station", "Christopher St", "Chambers St", "South Ferry"], country: "america", mapCountry: "USA" },
  { id: "us-subway-7", route: "NYC Subway 7", dest: "Flushing ↔ Hudson Yards", time: "05:45", status: "on-time", type: "train", frequency: "4", stops: ["Flushing Main St", "Mets-Willets Point", "Jackson Heights", "Grand Central", "Times Square", "Hudson Yards"], country: "america", mapCountry: "USA" },
  { id: "us-bus-m15", route: "MTA Bus M15", dest: "Harlem ↔ South Ferry", time: "06:00", status: "on-time", type: "bus", stops: ["Harlem", "East Village", "Lower East Side", "City Hall", "South Ferry"], country: "america", mapCountry: "USA" },
  { id: "us-bart", route: "SF BART Yellow", dest: "Pittsburg ↔ Millbrae", time: "05:15", status: "on-time", type: "train", frequency: "6", stops: ["Pittsburg Center", "Walnut Creek", "Oakland City Center", "Embarcadero", "SFO Airport", "Millbrae"], country: "america", mapCountry: "USA" },
  { id: "us-la-metro", route: "LA Metro Red Line", dest: "North Hollywood ↔ Union Station", time: "05:00", status: "on-time", type: "train", frequency: "6", stops: ["North Hollywood", "Universal City", "Hollywood/Highland", "Wilshire/Vermont", "Civic Center", "Union Station"], country: "america", mapCountry: "USA" },
  { id: "us-bus-chi", route: "CTA Bus 151", dest: "Devon ↔ Union Station", time: "06:30", status: "delayed", type: "bus", stops: ["Devon & Sheridan", "Belmont", "Lincoln Park", "Michigan Ave", "Union Station"], country: "america", mapCountry: "USA" },
  { id: "us-chi-l", route: "Chicago L Blue", dest: "O'Hare ↔ Forest Park", time: "05:00", status: "on-time", type: "train", frequency: "5", stops: ["O'Hare", "Rosemont", "Logan Square", "Jackson", "UIC-Halsted", "Forest Park"], country: "america", mapCountry: "USA" },
  { id: "us-bus-la", route: "LA Metro Bus 720", dest: "Santa Monica ↔ Commerce", time: "06:15", status: "on-time", type: "bus", stops: ["Santa Monica", "Westwood", "Wilshire/Western", "Downtown LA", "East LA", "Commerce"], country: "america", mapCountry: "USA" },
  { id: "us-dc-metro", route: "DC Metro Red", dest: "Shady Grove ↔ Glenmont", time: "05:15", status: "on-time", type: "train", frequency: "6", stops: ["Shady Grove", "Bethesda", "Dupont Circle", "Metro Center", "Union Station", "Glenmont"], country: "america", mapCountry: "USA" },
  { id: "us-bus-dc", route: "DC Metrobus 32", dest: "Friendship Hts ↔ Southern Ave", time: "06:00", status: "on-time", type: "bus", stops: ["Friendship Heights", "Georgetown", "Foggy Bottom", "Federal Triangle", "Southern Ave"], country: "america", mapCountry: "USA" },

  // ===== JAPAN =====
  { id: "jp-yamanote", route: "JR Yamanote Line", dest: "Tokyo ↔ Shibuya (Loop)", time: "05:00", status: "on-time", type: "train", frequency: "3", stops: ["Tokyo", "Akihabara", "Ueno", "Ikebukuro", "Shinjuku", "Shibuya"], country: "japan", mapCountry: "Japan" },
  { id: "jp-chuo", route: "JR Chuo Line", dest: "Tokyo ↔ Takao", time: "05:15", status: "on-time", type: "train", frequency: "4", stops: ["Tokyo", "Ochanomizu", "Shinjuku", "Nakano", "Kichijoji", "Takao"], country: "japan", mapCountry: "Japan" },
  { id: "jp-ginza", route: "Tokyo Metro Ginza", dest: "Shibuya ↔ Asakusa", time: "05:10", status: "on-time", type: "train", frequency: "3", stops: ["Shibuya", "Omotesando", "Ginza", "Nihombashi", "Ueno", "Asakusa"], country: "japan", mapCountry: "Japan" },
  { id: "jp-bus-tokyo", route: "Toei Bus 都01", dest: "Shibuya ↔ Roppongi", time: "06:00", status: "on-time", type: "bus", stops: ["Shibuya Station", "Aoyama", "Roppongi Hills", "Tokyo Tower", "Roppongi"], country: "japan", mapCountry: "Japan" },
  { id: "jp-osaka-midosuji", route: "Osaka Midosuji Line", dest: "Nakamozu ↔ Shin-Osaka", time: "05:00", status: "on-time", type: "train", frequency: "4", stops: ["Nakamozu", "Tennoji", "Namba", "Shinsaibashi", "Umeda", "Shin-Osaka"], country: "japan", mapCountry: "Japan" },
  { id: "jp-bus-kyoto", route: "Kyoto Bus 206", dest: "Kyoto Station ↔ Kinkakuji", time: "06:30", status: "on-time", type: "bus", stops: ["Kyoto Station", "Higashiyama", "Gion", "Kitaoji", "Kinkakuji"], country: "japan", mapCountry: "Japan" },
  { id: "jp-shinkansen", route: "Tokaido Shinkansen", dest: "Tokyo ↔ Osaka", time: "06:00", status: "on-time", type: "train", frequency: "10", stops: ["Tokyo", "Shinagawa", "Nagoya", "Kyoto", "Shin-Osaka"], country: "japan", mapCountry: "Japan" },
  { id: "jp-bus-osaka", route: "Osaka City Bus 88", dest: "Osaka Station ↔ Universal", time: "07:00", status: "delayed", type: "bus", stops: ["Osaka Station", "Fukushima", "Nishikujo", "Universal City Walk", "USJ"], country: "japan", mapCountry: "Japan" },
  { id: "jp-namboku", route: "Tokyo Metro Namboku", dest: "Meguro ↔ Akabane-iwabuchi", time: "05:20", status: "on-time", type: "train", frequency: "4", stops: ["Meguro", "Azabu-Juban", "Roppongi-itchome", "Iidabashi", "Komagome", "Akabane-iwabuchi"], country: "japan", mapCountry: "Japan" },
  { id: "jp-bus-hiroshima", route: "Hiroshima Bus 24", dest: "Hiroshima Sta ↔ Peace Park", time: "07:15", status: "on-time", type: "bus", stops: ["Hiroshima Station", "Enkobashi", "Kamiya-cho", "Atomic Bomb Dome", "Peace Memorial Park"], country: "japan", mapCountry: "Japan" },

  // ===== CHINA =====
  { id: "cn-sh-line1", route: "Shanghai Metro Line 1", dest: "Fujin Rd ↔ Xinzhuang", time: "05:30", status: "on-time", type: "train", frequency: "3", stops: ["Fujin Road", "People's Square", "South Shaanxi Road", "Xujiahui", "Shanghai South Railway", "Xinzhuang"], country: "china", mapCountry: "China" },
  { id: "cn-sh-line2", route: "Shanghai Metro Line 2", dest: "Pudong Airport ↔ East Xujing", time: "06:00", status: "on-time", type: "train", frequency: "4", stops: ["Pudong Int'l Airport", "Longyang Road", "Century Avenue", "Nanjing East Road", "Jing'an Temple", "East Xujing"], country: "china", mapCountry: "China" },
  { id: "cn-bj-line1", route: "Beijing Metro Line 1", dest: "Pingguoyuan ↔ Sihui East", time: "05:00", status: "on-time", type: "train", frequency: "3", stops: ["Pingguoyuan", "Military Museum", "Tiananmen West", "Wangfujing", "Jianguomen", "Sihui East"], country: "china", mapCountry: "China" },
  { id: "cn-bj-line2", route: "Beijing Metro Line 2", dest: "Xizhimen ↔ Loop", time: "05:15", status: "on-time", type: "train", frequency: "3", stops: ["Xizhimen", "Drum Tower", "Dongzhimen", "Jianguomen", "Beijing Station", "Fuxingmen"], country: "china", mapCountry: "China" },
  { id: "cn-bus-bj1", route: "Beijing Bus 1", dest: "Laoshan ↔ Sihui", time: "05:30", status: "on-time", type: "bus", stops: ["Laoshan", "Babaoshan", "Military Museum", "Tiananmen", "Wangfujing", "Sihui"], country: "china", mapCountry: "China" },
  { id: "cn-bus-sh", route: "Shanghai Bus 71", dest: "Waigaoqiao ↔ Yan'an Rd", time: "06:15", status: "delayed", type: "bus", stops: ["Waigaoqiao", "Wujiaochang", "Dalian Road", "The Bund", "People's Square", "Yan'an Road"], country: "china", mapCountry: "China" },
  { id: "cn-gz-line3", route: "Guangzhou Metro Line 3", dest: "Airport South ↔ Tiyu Xilu", time: "06:10", status: "on-time", type: "train", frequency: "3", stops: ["Airport South", "Renhe", "Jiahe Wanggang", "Tianhe Coach Terminal", "Zhujiang New Town", "Tiyu Xilu"], country: "china", mapCountry: "China" },
  { id: "cn-bus-gz", route: "Guangzhou Bus B1", dest: "BRT Gangding ↔ Xia Village", time: "06:30", status: "on-time", type: "bus", stops: ["BRT Gangding", "BRT Tiyu Center", "BRT Tangxia", "BRT Huangcun", "BRT Xia Village"], country: "china", mapCountry: "China" },
  { id: "cn-sz-line1", route: "Shenzhen Metro Line 1", dest: "Airport East ↔ Luohu", time: "06:30", status: "on-time", type: "train", frequency: "4", stops: ["Airport East", "Bao'an Center", "Qianhaiwan", "Window of the World", "Convention Center", "Luohu"], country: "china", mapCountry: "China" },
  { id: "cn-bus-cd", route: "Chengdu Bus 16", dest: "Wuhouci ↔ Chunxi Rd", time: "06:45", status: "on-time", type: "bus", stops: ["Wuhouci", "Jinli Ancient Street", "Tianfu Square", "Chunxi Road", "Taikoo Li"], country: "china", mapCountry: "China" },
];

// Generate route data for VehicleTrackingMap dynamically from transit entries
export function generateRouteData(): Record<string, VehicleInfo> {
  const colors = {
    bus: ["hsl(var(--primary))", "hsl(var(--warning))", "#e67e22", "#16a085", "#8e44ad"],
    train: ["#e4002b", "#009645", "#005da2", "#fa9e0d", "#9900aa", "#784008"],
  };

  const data: Record<string, VehicleInfo> = {};

  allTransit.forEach((entry, idx) => {
    const numStops = entry.stops.length;
    const colorArr = entry.type === "bus" ? colors.bus : colors.train;
    const color = colorArr[idx % colorArr.length];

    // Generate natural-looking coordinates with some curves
    const stops: DestinationStop[] = entry.stops.map((name, i) => {
      const t = i / (numStops - 1);
      // Create a curved path using sine for variation
      const baseX = 50 + t * 300;
      const baseY = 350 - t * 250;
      const curveX = Math.sin(t * Math.PI * 1.5) * 40;
      const curveY = Math.cos(t * Math.PI) * 30;
      return {
        name,
        x: Math.round(baseX + curveX),
        y: Math.round(baseY + curveY),
      };
    });

    data[entry.route] = {
      type: entry.type,
      name: entry.route,
      dest: entry.dest,
      stops,
      color,
    };
  });

  return data;
}
