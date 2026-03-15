export const GAME_BASE_URL = "https://www.bojiogame.sg/games";

export interface Game {
  key: string;
  name: string;
  description: string;
  tagline?: string;
  category?: string;
  featured?: boolean;
  developer?: string;
  rating?: string;
  released?: string;
  updated?: string;
}

function buildGameUrl(key: string): string {
  return `${GAME_BASE_URL}/${key}/game.html`;
}

export const games: Game[] = [
  {
    key: "happy-fishing-life",
    name: "Happy Fishing Life",
    description:
      "Câu cá thư giãn, thu thập nhiều loại cá và nâng cấp hồ câu của bạn.",
    tagline: "Câu cá thư giãn",
    category: "Mô Phỏng",
    featured: true,
    developer: "Casual Games",
    rating: "8,5",
    released: "2023",
  },
  {
    key: "subway-runner",
    name: "Subway Runner",
    description:
      "Chạy không ngừng qua đường ray tàu điện, tránh chướng ngại và thu thập xu.",
    tagline: "Chạy không ngừng",
    category: "Hành Động",
    featured: true,
    developer: "Endless Games",
    rating: "8,8",
    released: "2023",
  },
  {
    key: "blockblastadventure",
    name: "BlockBuster Puzzle",
    description:
      "Puzzle xếp khối đầy thách thức. Ghép các khối màu và tạo combo để đạt điểm cao.",
    tagline: "Puzzle đầy thách thức",
    category: "Giải Đố",
    featured: true,
    developer: "Vanuplay Innovations Inc",
    rating: "9,0 (13.568 phiếu bầu)",
    released: "tháng 5 năm 2024",
    updated: "tháng 11 năm 2024",
  },
  {
    key: "blockblaster",
    name: "Block Blaster",
    description:
      "Game xếp gạch kinh điển với nhiều chế độ chơi và power-up hấp dẫn.",
    tagline: "Xếp gạch cổ điển",
    category: "Giải Đố",
    developer: "Puzzle Studio",
    rating: "8,7",
    released: "2022",
  },
  {
    key: "bubbleblast",
    name: "Bubble Blast",
    description:
      "Bắn bong bóng cùng màu để làm vỡ chúng và giải phóng không gian.",
    tagline: "Bắn bong bóng",
    category: "Giải Đố",
    developer: "Bubble Games",
    rating: "8,4",
    released: "2023",
  },
  {
    key: "cups",
    name: "Cups",
    description:
      "Game sắp xếp màu nước vào đúng cốc. Logic đơn giản nhưng gây nghiện.",
    tagline: "Sắp xếp màu",
    category: "Giải Đố",
    developer: "Brain Teaser",
    rating: "8,6",
    released: "2022",
  },
  {
    key: "wordwipe",
    name: "Word Wipe+",
    description:
      "Tìm từ tiếng Anh trên lưới chữ cái. Nối các chữ liền kề để tạo từ.",
    tagline: "Tìm từ",
    category: "Giải Đố",
    developer: "Word Games Inc",
    rating: "8,3",
    released: "2023",
  },
  {
    key: "wordsearch",
    name: "Word Search",
    description: "Ô chữ tìm từ quen thuộc. Quét ngang dọc chéo để tìm từ ẩn.",
    tagline: "Ô chữ tìm từ",
    category: "Giải Đố",
    developer: "Puzzle Lab",
    rating: "8,2",
    released: "2022",
  },
  {
    key: "coffeematch",
    name: "Coffee Match",
    description: "Match-3 với chủ đề cà phê. Ghép 3 viên trở lên để qua màn.",
    tagline: "Match-3 cà phê",
    category: "Giải Đố",
    developer: "Match Games",
    rating: "8,5",
    released: "2023",
  },
  {
    key: "hexa",
    name: "Hexa",
    description: "Puzzle lục giác. Xoay và ghép các mảnh để hoàn thành hình.",
    tagline: "Puzzle lục giác",
    category: "Giải Đố",
    developer: "Hex Studio",
    rating: "8,1",
    released: "2022",
  },
  {
    key: "colormatch",
    name: "Color Match",
    description: "Ghép màu nhanh tay. Chạm vào nhóm cùng màu để làm biến mất.",
    tagline: "Ghép màu",
    category: "Giải Đố",
    developer: "Color Games",
    rating: "8,4",
    released: "2023",
  },
  {
    key: "bridgerace",
    name: "Bridge Race",
    description:
      "Đua thu thập gạch và xây cầu. Vượt đối thủ để về đích đầu tiên.",
    tagline: "Đua xây cầu",
    category: "Hành Động",
    developer: "Race Games",
    rating: "8,6",
    released: "2023",
  },
  {
    key: "slitherio",
    name: "Slither.io",
    description:
      "Rắn săn mồi phiên bản multiplayer. Ăn chấm để dài ra, tránh đụng thân và đầu.",
    tagline: "Rắn săn mồi",
    category: "Hành Động",
    developer: "IO Games",
    rating: "8,9",
    released: "2022",
  },
  {
    key: "agario",
    name: "Agar.io",
    description:
      "Nuốt cell nhỏ hơn để lớn lên. Cẩn thận kẻ lớn hơn có thể nuốt bạn.",
    tagline: "Cell sinh tồn",
    category: "Hành Động",
    developer: "IO Games",
    rating: "8,7",
    released: "2021",
  },
  {
    key: "stack",
    name: "Stack",
    description:
      "Xếp khối lên cao không đổ. Canh thời điểm chính xác để chồng từng lớp.",
    tagline: "Xếp khối cao",
    category: "Giải Đố",
    developer: "Stack Studio",
    rating: "8,3",
    released: "2023",
  },
  {
    key: "helix-jump",
    name: "Helix Jump",
    description:
      "Quả bóng rơi qua các tầng xoắn. Chọn hướng rơi để tránh vùng đỏ.",
    tagline: "Nhảy xoắn ốc",
    category: "Giải Đố",
    developer: "Voodoo",
    rating: "8,5",
    released: "2022",
  },
  {
    key: "duck-life",
    name: "Duck Life",
    description:
      "Nuôi vịt và huấn luyện để thi chạy, bơi, bay. Nâng cấp kỹ năng qua các mùa.",
    tagline: "Nuôi vịt thi đấu",
    category: "Mô Phỏng",
    developer: "Wix Games",
    rating: "8,4",
    released: "2022",
  },
  {
    key: "run-3",
    name: "Run 3",
    description:
      "Chạy trong đường hầm không trọng lực. Nhảy qua khoảng trống và giữ thăng bằng.",
    tagline: "Chạy không trọng lực",
    category: "Phiêu Lưu",
    developer: "Player 03",
    rating: "8,8",
    released: "2021",
  },
];

export function getGameUrl(key: string): string {
  return buildGameUrl(key);
}

export function getFeaturedGames(): Game[] {
  return games.filter((g) => g.featured);
}

export function getAllGames(): Game[] {
  return games;
}

export function getGameByKey(key: string): Game | undefined {
  return games.find((g) => g.key === key);
}

export function getRelatedGames(currentKey: string, limit = 9): Game[] {
  return games.filter((g) => g.key !== currentKey).slice(0, limit);
}
