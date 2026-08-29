/** 47 Kenyan counties with delivery sub-locations (towns / estates) */
export type County = { name: string; subs: string[] };

export const COUNTIES: County[] = [
  {
    name: "Nairobi",
    subs: [
      "CBD", "Westlands", "Kilimani", "Lavington", "Karen", "Langata", "South B", "South C",
      "Embakasi", "Kayole", "Kasarani", "Roysambu", "Parklands", "Eastleigh", "Ngara",
      "Donholm", "Buruburu", "Umoja", "Pipeline", "Syokimau", "Ruiru border", "Kileleshwa",
      "Runda", "Gigiri", "Spring Valley", "Hurlingham", "Ngong Road", "Madaraka", "Industrial Area", "Githurai",
    ],
  },
  {
    name: "Mombasa",
    subs: [
      "CBD", "Nyali", "Bamburi", "Kisauni", "Likoni", "Changamwe", "Mikindani", "Tudor",
      "Shanzu", "Mtongwe", "Port Reitz", "Mtwapa", "Bombolulu", "Makupa", "Old Town",
      "Frere Town", "Kongowea", "Jomvu", "Magongo", "Miritini",
    ],
  },
  {
    name: "Kisumu",
    subs: [
      "CBD", "Milimani", "Kondele", "Nyalenda", "Manyatta", "Mamboleo", "Kibos", "Kisian",
      "Ojola", "Riat", "Dunga", "Kibuye", "Tom Mboya Estate", "Lolwe", "Nyamasaria",
    ],
  },
  {
    name: "Nakuru",
    subs: [
      "CBD", "Section 58", "Milimani", "Lanet", "Njoro", "Naivasha town", "Gilgil", "Molo",
      "Bahati", "Pipeline", "Free Area", "Shabab", "Kaptembwa", "Rhonda", "London",
    ],
  },
  {
    name: "Kiambu",
    subs: [
      "Thika", "Ruiru", "Juja", "Kikuyu", "Limuru", "Githunguri", "Kiambu town", "Karuri",
      "Kabete", "Wangige", "Gatundu", "Ruiru Kamakis", "Kenol", "Ruiru Mugutha", "Githurai 45",
    ],
  },
  {
    name: "Machakos",
    subs: [
      "Machakos town", "Athi River", "Mlolongo", "Syokimau", "Kitengela", "Kangundo", "Tala",
      "Matuu", "Mavoko", "Kathiani", "Masii", "Wote border", "Kyumbi", "Joska",
    ],
  },
  {
    name: "Kajiado",
    subs: [
      "Kajiado town", "Ngong", "Ongata Rongai", "Kitengela", "Isinya", "Kiserian", "Magadi",
      "Namanga", "Bissil", "Oloitokitok", "Rombo", "Emali border",
    ],
  },
  {
    name: "Uasin Gishu",
    subs: [
      "Eldoret CBD", "Langas", "Huruma", "Kapsoya", "Elgon View", "West Indies", "Annex",
      "Kimumu", "Pioneer", "Maili Nne", "Turbo", "Burnt Forest", "Moi University",
    ],
  },
  {
    name: "Kisii",
    subs: ["Kisii town", "Nyanchwa", "Daraja Mbili", "Mwembe", "Jogoo", "Nyamataro", "Keroka", "Ogembo", "Suneka"],
  },
  {
    name: "Nyeri",
    subs: ["Nyeri town", "Ruringu", "King'ong'o", "Kamakwa", "Karatina", "Othaya", "Mukurweini", "Naro Moru"],
  },
  {
    name: "Meru",
    subs: ["Meru town", "Makutano", "Gakoromone", "Kaaga", "Nkubu", "Maua", "Timau", "Mikinduri"],
  },
  {
    name: "Kakamega",
    subs: ["Kakamega town", "Mumias", "Malava", "Butere", "Lugari", "Shinyalu", "Lurambi", "Navakholo"],
  },
  {
    name: "Bungoma",
    subs: ["Bungoma town", "Webuye", "Kimilili", "Chwele", "Kanduyi", "Sirisia", "Tongaren", "Mt Elgon"],
  },
  {
    name: "Kilifi",
    subs: ["Kilifi town", "Malindi", "Watamu", "Mtwapa", "Mariakani", "Kaloleni", "Gongoni", "Gede"],
  },
  {
    name: "Kwale",
    subs: ["Kwale town", "Ukunda", "Diani", "Msambweni", "Lunga Lunga", "Kinango", "Shimba Hills"],
  },
  {
    name: "Garissa",
    subs: ["Garissa town", "Modogashe", "Dadaab", "Balambala", "Hulugho", "Ijara"],
  },
  {
    name: "Wajir",
    subs: ["Wajir town", "Habaswein", "Bute", "Tarbaj", "Eldas", "Griftu"],
  },
  {
    name: "Mandera",
    subs: ["Mandera town", "Elwak", "Rhamu", "Takaba", "Banisa", "Lafey"],
  },
  {
    name: "Marsabit",
    subs: ["Marsabit town", "Moyale", "Laisamis", "North Horr", "Loiyangalani", "Sololo"],
  },
  {
    name: "Isiolo",
    subs: ["Isiolo town", "Garbatulla", "Merti", "Kinna", "Oldonyiro"],
  },
  {
    name: "Turkana",
    subs: ["Lodwar", "Kakuma", "Lokichoggio", "Kalokol", "Lokichar", "Katilu"],
  },
  {
    name: "West Pokot",
    subs: ["Kapenguria", "Makutano", "Chepareria", "Ortum", "Kacheliba", "Alale"],
  },
  {
    name: "Samburu",
    subs: ["Maralal", "Baragoi", "Wamba", "Archers Post", "Suguta Marmar"],
  },
  {
    name: "Trans Nzoia",
    subs: ["Kitale", "Kiminini", "Endebess", "Kwanza", "Saboti", "Sikhendu"],
  },
  {
    name: "Elgeyo Marakwet",
    subs: ["Iten", "Kapsowar", "Chepkorio", "Tambach", "Tot", "Arror"],
  },
  {
    name: "Nandi",
    subs: ["Kapsabet", "Nandi Hills", "Mosoriot", "Kabiyet", "Chepterwai", "Lessos"],
  },
  {
    name: "Baringo",
    subs: ["Kabarnet", "Eldama Ravine", "Marigat", "Mogotio", "Kabarnet Estate", "Chemolingot"],
  },
  {
    name: "Laikipia",
    subs: ["Nanyuki", "Nyahururu", "Rumuruti", "Dol Dol", "Kinamba", "Sipili"],
  },
  {
    name: "Nyandarua",
    subs: ["Ol Kalou", "Engineer", "Njabini", "Kinangop", "Mairo Inya", "Ol Joro Orok"],
  },
  {
    name: "Kirinyaga",
    subs: ["Kerugoya", "Kutus", "Sagana", "Kagumo", "Wanguru", "Kianyaga"],
  },
  {
    name: "Murang'a",
    subs: ["Murang'a town", "Kenol", "Kangema", "Maragua", "Kandara", "Sabasaba", "Makuyu"],
  },
  {
    name: "Embu",
    subs: ["Embu town", "Runyenjes", "Siakago", "Manyatta", "Kiritiri", "Ishiara"],
  },
  {
    name: "Tharaka Nithi",
    subs: ["Chuka", "Chogoria", "Marimanti", "Kathwana", "Tunyai"],
  },
  {
    name: "Kitui",
    subs: ["Kitui town", "Mwingi", "Mutomo", "Kyuso", "Kabati", "Kanyangi"],
  },
  {
    name: "Makueni",
    subs: ["Wote", "Emali", "Mtito Andei", "Sultan Hamud", "Kibwezi", "Makindu"],
  },
  {
    name: "Taita Taveta",
    subs: ["Voi", "Wundanyi", "Taveta", "Mwatate", "Maungu", "Taita"],
  },
  {
    name: "Tana River",
    subs: ["Hola", "Garsen", "Bura", "Madogo", "Wenje"],
  },
  {
    name: "Lamu",
    subs: ["Lamu town", "Mokowe", "Mpeketoni", "Faza", "Hindi", "Witu"],
  },
  {
    name: "Siaya",
    subs: ["Siaya town", "Bondo", "Ugunja", "Yala", "Ukwala", "Ndori"],
  },
  {
    name: "Homa Bay",
    subs: ["Homa Bay town", "Mbita", "Oyugis", "Kendu Bay", "Ndhiwa", "Sindo"],
  },
  {
    name: "Migori",
    subs: ["Migori town", "Rongo", "Awendo", "Kehancha", "Isebania", "Suna"],
  },
  {
    name: "Nyamira",
    subs: ["Nyamira town", "Keroka", "Ikonge", "Ekerenyo", "Manga", "Nyansiongo"],
  },
  {
    name: "Bomet",
    subs: ["Bomet town", "Sotik", "Longisa", "Mulot", "Sigor", "Chepalungu"],
  },
  {
    name: "Kericho",
    subs: ["Kericho town", "Litein", "Londiani", "Kipkelion", "Ainamoi", "Sosiot"],
  },
  {
    name: "Narok",
    subs: ["Narok town", "Kilgoris", "Ololulunga", "Suswa", "Ntulele", "Loita"],
  },
  {
    name: "Busia",
    subs: ["Busia town", "Malaba", "Nambale", "Port Victoria", "Funyula", "Butula"],
  },
  {
    name: "Vihiga",
    subs: ["Mbale", "Luanda", "Chavakali", "Majengo", "Hamisi", "Sabatia"],
  },
];

export function getSubs(countyName: string): string[] {
  const c = COUNTIES.find((x) => x.name === countyName);
  return c?.subs ?? [];
}
