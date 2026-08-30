export const serviceCategories = [
  { slug: "flights", name: "Uçuş", short: "Uçak bileti", description: "Yüzlerce havayolu ve bilet sağlayıcısı" },
  { slug: "stays", name: "Konaklama", short: "Otel & ev", description: "Otel, apart, hostel ve tatil evi" },
  { slug: "cars", name: "Araç Kiralama", short: "Kiralık araç", description: "Ekonomiden premium araca kadar" },
  { slug: "trains", name: "Tren", short: "Tren bileti", description: "Avrupa ve dünya demiryolları" },
  { slug: "buses", name: "Otobüs", short: "Otobüs bileti", description: "Şehirler arası kara ulaşımı" },
  { slug: "transfers", name: "Taksi & Transfer", short: "Havalimanı ulaşımı", description: "Özel transfer, taksi ve şoför" },
  { slug: "ferries", name: "Feribot", short: "Feribot bileti", description: "Adalar ve uluslararası hatlar" },
  { slug: "experiences", name: "Tur & Aktivite", short: "Deneyimler", description: "Müze, tur, etkinlik ve bilet" },
  { slug: "insurance", name: "Seyahat Sigortası", short: "Güvence", description: "Sağlık, iptal ve bagaj koruması" },
  { slug: "esim", name: "eSIM & İnternet", short: "Mobil internet", description: "190+ ülkede dijital bağlantı" },
  { slug: "cruises", name: "Gemi Turları", short: "Cruise", description: "Akdeniz ve dünya rotaları" },
  { slug: "airport", name: "Havalimanı Hizmetleri", short: "Park & lounge", description: "Lounge, otopark ve hızlı geçiş" },
];

export const partnerGroups: Record<string, string[]> = {
  flights: ["Aviasales", "Trip.com", "Kiwi.com", "Skyscanner", "Qatar Airways", "Turkish Airlines", "Pegasus", "AJet"],
  stays: ["Booking.com", "Agoda", "Hotels.com", "Expedia", "Hostelworld", "Tripadvisor", "Marriott", "Accor"],
  cars: ["Discover Cars", "Rentalcars.com", "EconomyBookings", "Localrent", "Europcar", "Sixt", "Avis", "Enterprise"],
  trains: ["Trainline", "Rail Europe", "Omio", "Eurostar", "Trenitalia", "Italo", "Deutsche Bahn", "SNCF Connect"],
  buses: ["FlixBus", "Busbud", "BlaBlaCar Bus", "redBus", "Obilet", "Kamil Koç", "Pamukkale", "Metro Turizm"],
  transfers: ["GetTransfer", "Welcome Pickups", "Kiwitaxi", "Blacklane", "Bolt", "Uber", "FREE NOW", "BiTaksi"],
  ferries: ["Direct Ferries", "Ferryhopper", "Ferryscanner", "SeaJets", "Minoan Lines", "İDO", "BUDO", "Turyol"],
  experiences: ["GetYourGuide", "Viator", "Klook", "Tiqets", "Musement", "Headout", "Civitatis", "Go City"],
  insurance: ["SafetyWing", "Heymondo", "VisitorsCoverage", "Allianz Travel", "AXA Travel", "World Nomads", "Ekta", "Genki"],
  esim: ["Airalo", "Holafly", "Nomad", "Saily", "Yesim", "Ubigi", "aloSIM", "GigSky"],
  cruises: ["MSC Cruises", "Royal Caribbean", "Costa Cruises", "Norwegian Cruise Line", "Celebrity Cruises", "Princess Cruises", "Celestyal", "Virgin Voyages"],
  airport: ["Priority Pass", "LoungeBuddy", "Plaza Premium", "Holiday Extras", "ParkVia", "AirportParkingReservations", "FastTrack.aero", "AirHelp"],
};

export const partnerCount = Object.values(partnerGroups).reduce((sum, group) => sum + group.length, 0);

export const marketplaceBundles = [
  { city: "Paris", code: "CDG", total: "₺12.840", saving: "₺4.610 tasarruf", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&fm=webp&q=82&w=1200", items: ["Uçuş", "3 gece otel", "Havalimanı transferi"] },
  { city: "Tokyo", code: "NRT", total: "₺31.750", saving: "₺7.920 tasarruf", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&fm=webp&q=82&w=1200", items: ["Uçuş", "5 gece otel", "eSIM"] },
  { city: "New York", code: "JFK", total: "₺29.480", saving: "₺6.240 tasarruf", image: "https://images.unsplash.com/photo-1522083165195-3424ed129620?auto=format&fit=crop&fm=webp&q=82&w=1200", items: ["Uçuş", "4 gece otel", "Şehir kartı"] },
];
