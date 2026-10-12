
export type Dietary = "veg" | "non-veg" | "mixed";

export type MenuSection = {
  id: string;
  label: string;
  dietary: Dietary;
  items: string[];
};

export type SelectionGroupId =
  | "drinks"
  | "chaat-snacks"
  | "street-food"
  | "veg-starters"
  | "non-veg-starters"
  | "veg-mains"
  | "non-veg-mains"
  | "breads"
  | "rice"
  | "non-veg-rice"
  | "desserts";

export type PackageSlot = {
  id: string;
  label: string;
  groupId: SelectionGroupId;
  count: number;
};

export type CateringPackage = {
  id: string;
  name: string;
  pricePerGuest: number | null;
  description: string;
  dietary: Dietary;
  slots: PackageSlot[];
  fixedItems?: string[];
  quoteOnly?: boolean;
};

export const menuSections: MenuSection[] = [
  {
    id: "welcome-drinks",
    label: "Welcome Drinks",
    dietary: "veg",
    items: ["Jaljeera", "Shikanji", "Masaladar Soda Shikanji", "Kala Khatta", "Lemon Mint Cooler", "Aam Panna (Seasonal)", "Masala Chaas", "Sweet Lassi", "Rose Lassi", "Mango Lassi", "Mint Mojito", "Orange Mojito", "Watermelon Mojito", "Kashmiri Kehwa", "Orange Rasam", "Tea", "Coffee"],
  },
  {
    id: "chaats",
    label: "Chaats",
    dietary: "veg",
    items: ["Pani Puri", "Sev Puri", "Bhel Puri", "Churmur", "Jhal Muri", "Papdi Chaat", "Dahi Bhalla", "Dahi Puri", "Phool Makhana Bhel", "Boondi Bhel", "Corn Bhel"],
  },
  {
    id: "snacks",
    label: "Snacks",
    dietary: "veg",
    items: ["Samosa", "Kachori", "Aloo Bonda", "Vada Pav", "Samosa Pav", "Mix Veg Pakora", "Onion Pakora", "Palak Pakora", "Mirchi Pakora", "Bread Pakora", "Paneer Pakora"],
  },
  {
    id: "salads",
    label: "Salads",
    dietary: "veg",
    items: ["Quinoa Salad", "Russian Salad", "Caesar Salad", "Sprout Salad", "Pasta Salad", "Grilled Veg Salad", "Kala Chana Chaat", "Kachumbar Salad"],
  },
  {
    id: "continental-starters",
    label: "Continental Starters",
    dietary: "veg",
    items: ["Avocado Bites", "Avocado Cheese Balls", "Mexican Triangles", "Mango Salsa Bruschetta", "Veggie Quesadilla", "Potato Croquettes", "Broccoli Cheese Balls", "Jalapeno Cheese Sticks", "Funghi Risotto Balls", "Chilli & Basil Paneer", "Paneer Fritters", "Arancini Balls", "Cauliflower Tots", "Gold Coin", "Paneer Bomb", "Bread Wheel", "Paneer Roll", "Maggi Fritter"],
  },
  {
    id: "street-food",
    label: "Street Food",
    dietary: "veg",
    items: ["Samosa Chola Chaat", "Aloo Tikki Choley", "Ragda Patties", "Delhi Wali Aloo Chaat", "Pav Bhaji", "Chole Bhatura", "Chole Kulcha", "Maggi Masala", "Veg Grilled Sandwich", "Veg Kathi Rolls", "Veg Momos", "Paneer Momos"],
  },
  {
    id: "veg-tandoori-starters",
    label: "Veg Tandoori Starters",
    dietary: "veg",
    items: ["Paneer Tikka", "Paneer Malai Tikka", "Lasuni Paneer Tikka", "Stuffed Aloo", "Tandoori Aloo", "Tandoori Mushroom", "Malai Broccoli", "Hara Bhara Kebab", "Veg Seekh Kabab", "Aloo Corn Tikki", "Veg Croquettes", "Aloo Tandoori", "Dahi Ke Kabab", "Til Kabab", "Aloo Cheese Tikka", "Soya Chaap", "Malai Soya Chaap", "Navaratan Tikki"],
  },
  {
    id: "veg-chinese-starters",
    label: "Veg Chinese Starters",
    dietary: "veg",
    items: ["Paneer Chilli", "Honey Chilli Potato", "Babycorn Chilli", "Veg Manchurian", "Gobi Manchurian", "Chilli Mushroom", "Spring Rolls", "Soya Chilli"],
  },
  {
    id: "veg-chinese-mains",
    label: "Veg Chinese Mains",
    dietary: "veg",
    items: ["Chowmein", "Veg Fried Rice", "Veg Hakka Noodles", "Triple Schezwan Fried Rice"],
  },
  {
    id: "veg-main-course",
    label: "Veg Main Course",
    dietary: "veg",
    items: ["Paneer Makhani", "Paneer Lababdaar", "Kadhai Paneer", "Shahi Paneer", "Matar Paneer", "Paneer Butter Masala", "Palak Paneer", "Paneer Do Pyaza", "Paneer Chetakedar", "Hariyali Paneer", "Matar Methi Malai Makai", "Veg Kadai", "Vegetable Kofta", "Paneer Tikka Masala", "Corn Palak", "Gobi Adraki", "Mix Veg", "Malai Kofta", "Dum Aloo Banarasi", "Aloo Palak", "Gobi Aloo Masala", "Kadhai Mushroom", "Rajma Masala", "Mushroom Matar", "Jeera Aloo", "Bhindi Do Pyaza", "Mirch Baingan Ka Salan", "Bhindi Masala", "Sholay Chole", "Makhan Singh Ki Daal", "Kadhi Pakoda", "Maa Ki Daal (Punjabi Daal Tadka)", "Sarson Ka Saag (Seasonal)"],
  },
  {
    id: "italian",
    label: "Italian",
    dietary: "veg",
    items: ["Cheesy Garlic Bread", "Cheese Chilli Toast", "Spicy Grilled Paneer", "Cheese Corn Balls", "Tandoori Paneer Tikka Pizza", "Veg Pizza", "Margherita Pizza", "Penne Arrabbiata", "Pasta Alfredo", "Khau Galli Special Pink Sauce Pasta"],
  },
  {
    id: "breads",
    label: "Breads",
    dietary: "veg",
    items: ["Phulka", "Tandoori Roti", "Roomali Roti", "Butter Garlic Naan", "Butter Naan", "Laccha Parantha", "Missi Roti", "Makai Roti (Seasonal)"],
  },
  {
    id: "rice",
    label: "Rice",
    dietary: "veg",
    items: ["Steam Rice", "Jeera Rice", "Matar Pulao", "Paneer Pulao", "Tawa Pulao", "Vegetable Biryani"],
  },
  {
    id: "desserts",
    label: "Desserts",
    dietary: "veg",
    items: ["Gulab Jamun", "Kheer", "Gajar Ka Halwa", "Moong Dal Ka Halwa", "Jalebi", "Rabri"],
  },
  {
    id: "fruit-creams",
    label: "Fruit Creams",
    dietary: "veg",
    items: ["Mix Fruit Cream", "Dry Fruit Cream", "Mango Cream", "Sitaphal Cream", "Strawberry Cream", "Chikoo Cream", "Kesar Badam Pista Cream", "Kaju Anjeer Cream"],
  },
  {
    id: "kulfi-falooda",
    label: "Kulfi & Falooda",
    dietary: "veg",
    items: ["Rabri Falooda", "Rose Falooda", "Kulfi Stick Small", "Ice Creams"],
  },
  {
    id: "non-veg-tandoori-chicken",
    label: "Non-Veg Tandoori Starters - Chicken",
    dietary: "non-veg",
    items: ["Malai Tikka (White)", "Chicken Tikka", "Murg Garlic Tikka", "Murg Hariyali Tikka", "Murg Cheese Kabab", "Murg Baanjara Kabab (Spicy)"],
  },
  {
    id: "non-veg-tandoori-mutton",
    label: "Non-Veg Tandoori Starters - Mutton",
    dietary: "non-veg",
    items: ["Mutton Boti Tikki", "Mutton Seekh Kabab", "Mutton SP Kabab (Spicy)"],
  },
  {
    id: "non-veg-tandoori-fish",
    label: "Non-Veg Tandoori Starters - Fish",
    dietary: "non-veg",
    items: ["Fish Tikka Garlic Tikka", "Hariyali Fish Tikka", "Malai Fish Tikka", "Tandoori Prawns", "Garlic Prawns", "Malai Prawns Hariyali"],
  },
  {
    id: "non-veg-chinese-starters",
    label: "Non-Veg Chinese Starters",
    dietary: "non-veg",
    items: ["Chilli Chicken Dry", "Chicken 65", "Crispy Chicken Wontons", "Honey Chilli Chicken", "Chicken Spring Rolls", "Chicken Momos", "Schezwan Chicken"],
  },
  {
    id: "non-veg-chinese-mains",
    label: "Non-Veg Chinese Mains",
    dietary: "non-veg",
    items: ["Chicken Hakka Noodles", "Chicken Schezwan Noodles", "Chicken Fried Rice", "Chicken Schezwan Fried Rice", "Chilli Chicken Gravy", "Chicken Manchurian", "Chicken in Black Bean Sauce", "Chicken Schezwan", "Sweet and Sour Chicken", "Chicken with Broccoli", "Lemon Chicken"],
  },
  {
    id: "non-veg-main-chicken",
    label: "Non-Veg Main Course - Chicken",
    dietary: "non-veg",
    items: ["Kadhai Chicken", "Chicken Butter Masala", "Chicken Adraki", "Chicken Achari", "Black Pepper Palak Chicken", "Chicken Korma", "Chicken Tikka Masala", "Chicken Do Pyaza"],
  },
  {
    id: "non-veg-main-mutton",
    label: "Non-Veg Main Course - Mutton",
    dietary: "non-veg",
    items: ["Mutton Korma", "Mutton Rogan Josh", "Kadhai Mutton", "Mutton Saag Wala Lal Maas", "Mutton Railway"],
  },
  {
    id: "non-veg-main-fish",
    label: "Non-Veg Main Course - Fish",
    dietary: "non-veg",
    items: ["Goan Fish Curry", "Malabar Fish Curry", "Fish Tikka Masala", "Tawa Prawns", "Prawn Malabar Masala"],
  },
  {
    id: "non-veg-biryani",
    label: "Non-Veg Biryani",
    dietary: "non-veg",
    items: ["Chicken Biryani", "Mutton Biryani", "Fish Biryani", "Prawns Biryani"],
  },
];

const section = (id: string) => menuSections.find((candidate) => candidate.id === id)?.items ?? [];
const combine = (...ids: string[]) => Array.from(new Set(ids.flatMap(section)));

export const selectionGroups: Record<SelectionGroupId, { label: string; items: string[] }> = {
  drinks: { label: "Welcome drinks", items: section("welcome-drinks") },
  "chaat-snacks": { label: "Chaats or snacks", items: combine("chaats", "snacks") },
  "street-food": { label: "Street food", items: section("street-food") },
  "veg-starters": { label: "Veg starters", items: combine("veg-tandoori-starters", "veg-chinese-starters") },
  "non-veg-starters": { label: "Non-veg starters", items: combine("non-veg-tandoori-chicken", "non-veg-tandoori-mutton", "non-veg-tandoori-fish", "non-veg-chinese-starters") },
  "veg-mains": { label: "Veg mains", items: combine("veg-main-course", "veg-chinese-mains") },
  "non-veg-mains": { label: "Non-veg mains", items: combine("non-veg-main-chicken", "non-veg-main-mutton", "non-veg-main-fish", "non-veg-chinese-mains") },
  breads: { label: "Breads", items: section("breads") },
  rice: { label: "Rice", items: section("rice") },
  "non-veg-rice": { label: "Non-veg rice / biryani", items: section("non-veg-biryani") },
  desserts: { label: "Desserts", items: combine("desserts", "fruit-creams", "kulfi-falooda") },
};

const slot = (id: string, label: string, groupId: SelectionGroupId, count: number): PackageSlot => ({ id, label, groupId, count });

export const cateringPackages: CateringPackage[] = [
  {
    id: "chaat-counter",
    name: "Chaat Counter",
    pricePerGuest: 40,
    description: "The four signature chaats are fixed and served together.",
    dietary: "veg",
    slots: [],
    fixedItems: ["Pani Puri", "Sev Puri", "Dahi Puri", "Papdi Chaat"],
  },
  {
    id: "street-food-delights",
    name: "Street Food Delights",
    pricePerGuest: 50,
    description: "Choose 3 chaats or snacks, 2 street-food favourites and 1 dessert.",
    dietary: "veg",
    slots: [slot("chaat-snacks", "Chaats or snacks", "chaat-snacks", 3), slot("street-food", "Street food", "street-food", 2), slot("dessert", "Dessert", "desserts", 1)],
  },
  {
    id: "veg-basic",
    name: "North Indian / Chinese Veg - Basic",
    pricePerGuest: 45,
    description: "1 starter, 2 veg mains, 1 bread, 1 rice and 1 dessert.",
    dietary: "veg",
    slots: [slot("veg-starter", "Veg starter", "veg-starters", 1), slot("veg-mains", "Veg mains", "veg-mains", 2), slot("bread", "Bread", "breads", 1), slot("rice", "Rice", "rice", 1), slot("dessert", "Dessert", "desserts", 1)],
  },
  {
    id: "non-veg-basic",
    name: "North Indian / Chinese Non-Veg - Basic",
    pricePerGuest: 55,
    description: "1 non-veg starter, 1 non-veg main, 1 veg main, bread, rice and dessert.",
    dietary: "non-veg",
    slots: [slot("non-veg-starter", "Non-veg starter", "non-veg-starters", 1), slot("non-veg-main", "Non-veg main", "non-veg-mains", 1), slot("veg-main", "Veg main", "veg-mains", 1), slot("bread", "Bread", "breads", 1), slot("rice", "Rice", "rice", 1), slot("dessert", "Dessert", "desserts", 1)],
  },
  {
    id: "veg-deluxe",
    name: "North Indian / Chinese Veg - Deluxe",
    pricePerGuest: 55,
    description: "2 starters, 3 veg mains, 1 bread, 1 rice and 1 dessert.",
    dietary: "veg",
    slots: [slot("veg-starters", "Veg starters", "veg-starters", 2), slot("veg-mains", "Veg mains", "veg-mains", 3), slot("bread", "Bread", "breads", 1), slot("rice", "Rice", "rice", 1), slot("dessert", "Dessert", "desserts", 1)],
  },
  {
    id: "non-veg-deluxe",
    name: "North Indian / Chinese Non-Veg - Deluxe",
    pricePerGuest: 65,
    description: "Veg and non-veg starters, 3 mains, bread, biryani and dessert.",
    dietary: "non-veg",
    slots: [slot("veg-starter", "Veg starter", "veg-starters", 1), slot("non-veg-starter", "Non-veg starter", "non-veg-starters", 1), slot("non-veg-main", "Non-veg main", "non-veg-mains", 1), slot("veg-mains", "Veg mains", "veg-mains", 2), slot("bread", "Bread", "breads", 1), slot("non-veg-rice", "Non-veg rice / biryani", "non-veg-rice", 1), slot("dessert", "Dessert", "desserts", 1)],
  },
  {
    id: "ultra",
    name: "North Indian / Chinese Veg & Non-Veg - Ultra",
    pricePerGuest: 75,
    description: "Four starters, 3 mains, bread, biryani and dessert.",
    dietary: "mixed",
    slots: [slot("veg-starters", "Veg starters", "veg-starters", 2), slot("non-veg-starters", "Non-veg starters", "non-veg-starters", 2), slot("non-veg-main", "Non-veg main", "non-veg-mains", 1), slot("veg-mains", "Veg mains", "veg-mains", 2), slot("bread", "Bread", "breads", 1), slot("non-veg-rice", "Non-veg rice / biryani", "non-veg-rice", 1), slot("dessert", "Dessert", "desserts", 1)],
  },
  {
    id: "chaat-main-veg",
    name: "Chaat with Main Course - Veg",
    pricePerGuest: 75,
    description: "A welcome drink, 4 chaats or snacks and a complete veg main course.",
    dietary: "veg",
    slots: [slot("drink", "Welcome drink", "drinks", 1), slot("chaat-snacks", "Chaats or snacks", "chaat-snacks", 4), slot("veg-mains", "Veg mains", "veg-mains", 3), slot("bread", "Bread", "breads", 1), slot("rice", "Rice", "rice", 1), slot("dessert", "Dessert", "desserts", 1)],
  },
  {
    id: "chaat-main-non-veg",
    name: "Chaat with Main Course - Non-Veg",
    pricePerGuest: 80,
    description: "A welcome drink, 4 chaats or snacks, veg and non-veg mains, bread, rice and dessert.",
    dietary: "mixed",
    slots: [slot("drink", "Welcome drink", "drinks", 1), slot("chaat-snacks", "Chaats or snacks", "chaat-snacks", 4), slot("veg-mains", "Veg mains", "veg-mains", 2), slot("non-veg-main", "Non-veg main", "non-veg-mains", 1), slot("bread", "Bread", "breads", 1), slot("rice", "Rice", "rice", 1), slot("dessert", "Dessert", "desserts", 1)],
  },
  {
    id: "build-your-own",
    name: "Build Your Own Menu",
    pricePerGuest: null,
    description: "Pick any dishes from the complete catering menu. Our team will price your exact brief and send a tailored quotation.",
    dietary: "mixed",
    slots: [],
    quoteOnly: true,
  },
];

export type LiveCounter = {
  id: string;
  name: string;
  description: string;
  ratePerGuest: number;
  choices?: string[];
};

export const liveCounters: LiveCounter[] = [
  { id: "tawa-street-food", name: "Street Food Counter", description: "Tawa setup with one selected street-food preparation.", ratePerGuest: 10, choices: ["Ragda Patties", "Aloo Tikki Chole", "Samosa Chole Chaat", "Ragda Samosa"] },
  { id: "pav-bhaji", name: "Pav Bhaji Counter", description: "Pav Bhaji prepared and served live.", ratePerGuest: 10 },
  { id: "chole-bhatura", name: "Chole Bhatura Counter", description: "Includes live bhatura frying.", ratePerGuest: 10 },
  { id: "pasta", name: "Pasta Counter", description: "3 pasta varieties with 2 sauces and vegetables.", ratePerGuest: 20 },
  { id: "dosa", name: "Dosa Counter", description: "4 dosa varieties with 2 chutneys and sambhar.", ratePerGuest: 20 },
  { id: "momos", name: "Momos Station", description: "2 varieties of momos.", ratePerGuest: 10 },
  { id: "jalebi", name: "Jalebi Counter", description: "Fresh jalebi prepared live.", ratePerGuest: 10 },
  { id: "kulfi", name: "Kulfi Cart", description: "3 varieties of kulfi sticks.", ratePerGuest: 10 },
  { id: "mocktails", name: "Mocktails Counter", description: "Choose 3 welcome drinks, made live like a bar counter.", ratePerGuest: 20 },
  { id: "sugarcane", name: "Sugar Cane Juice Counter", description: "Freshly squeezed sugar cane juice.", ratePerGuest: 20 },
];

export const serviceExtras = [
  { id: "ceramic-cutlery", name: "Ceramic dinner plates", price: 10, priceType: "per-guest" as const },
  { id: "fancy-cutlery", name: "Fancy serving cutlery for chaat and starter pass-around", price: 10, priceType: "per-guest" as const },
  { id: "continental-supplement", name: "Continental starters supplement", price: 10, priceType: "per-guest" as const },
  { id: "traditional-chaat-cart", name: "Traditional chaat cart instead of catering table", price: 250, priceType: "fixed" as const },
];

export const menuItemSurcharges: Record<string, number> = {
  "Rabri Falooda": 10,
};

export const logisticsAreas = [
  { id: "dubai", name: "Dubai", charge: 250 },
  { id: "abu-dhabi", name: "Abu Dhabi", charge: 500 },
  { id: "sharjah", name: "Sharjah", charge: 250 },
  { id: "ajman", name: "Ajman", charge: 500 },
  { id: "al-ain", name: "Al Ain", charge: 750 },
  { id: "fujairah", name: "Fujairah", charge: 1000 },
];

export const paanShishaFlavours = ["Paan Rasna Kiwi Vanilla", "Zaffran Paan Spring Water", "Royal Paan Masala", "Magai Paan Masala", "Rajnigandha Paan", "Commissioner", "Banarasi Paan", "Kolkata Paan", "Sweet 69 Paan", "Special Paan", "Paan Supari", "Paan Jaan"];
export const fruitShishaFlavours = ["Double Apple", "Grape", "Orange", "Lemon", "Kiwi", "Mint", "Blueberry", "Strawberry", "Blue Mix", "Raspberry", "Watermelon", "Sweet Melon"];

export const locations = [
  { name: "Sahara Centre", detail: "Unit 235, 2nd Floor Food Court", phone: "+971 55 983 9626" },
  { name: "IBN Battuta Mall", detail: "Food Court, near Carrefour", phone: "+971 4 546 4588" },
  { name: "Deira City Centre", detail: "Shop FC11A, 1st Floor Food Court", phone: "+971 56 132 5188" },
  { name: "Silicon Central Mall", detail: "1st Floor Food Court, Dubai Silicon Oasis", phone: "+971 52 385 1394" },
  { name: "Mega Mall", detail: "FC06-FC07, 3rd Floor, Sharjah", phone: "+971 52 106 3971" },
  { name: "Al Quoz 4", detail: "Al Quoz Industrial Fourth, Dubai", phone: "+971 52 278 8619" },
  { name: "Al Quoz Mall", detail: "Shops 66-67, Ground Floor, Al Quoz Industrial Area 3", phone: "+971 56 982 3223" },
];
