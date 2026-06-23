import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const colleges = [
  {
    name: "Indian Institute of Technology Bombay",
    slug: "iit-bombay",
    location: "Mumbai",
    state: "Maharashtra",
    type: "Engineering",
    establishedYear: 1958,
    rating: 4.8,
    fees: 250000,
    description:
      "IIT Bombay is one of India's premier engineering institutes, consistently ranked among the top in the country. Known for its world-class faculty, cutting-edge research, and outstanding placement record, IIT Bombay offers a vibrant campus life with a strong emphasis on innovation and entrepreneurship.",
    website: "https://www.iitb.ac.in",
    affiliation: "UGC, AICTE",
    ranking: 3,
    ownership: "Government",
    courses: [
      { name: "Computer Science and Engineering", duration: "4 Years", degree: "B.Tech", fees: 1000000 },
      { name: "Electrical Engineering", duration: "4 Years", degree: "B.Tech", fees: 1000000 },
      { name: "Mechanical Engineering", duration: "4 Years", degree: "B.Tech", fees: 1000000 },
      { name: "Computer Science", duration: "2 Years", degree: "M.Tech", fees: 500000 },
      { name: "Data Science and AI", duration: "2 Years", degree: "M.Tech", fees: 500000 },
    ],
    placements: [
      { year: 2024, averagePackage: 2100, highestPackage: 27000, medianPackage: 1800, placementRate: 95, topRecruiters: "Google, Microsoft, Goldman Sachs, Amazon, Apple" },
      { year: 2023, averagePackage: 1950, highestPackage: 25000, medianPackage: 1700, placementRate: 94, topRecruiters: "Google, Meta, Microsoft, Goldman Sachs, Uber" },
    ],
    reviews: [
      { rating: 5.0, title: "Best Engineering College in India", content: "Incredible campus, world-class faculty, and the best placement opportunities. The peer group here pushes you to excel. Research opportunities are abundant and the alumni network is unmatched.", category: "Academics" },
      { rating: 4.5, title: "Great Campus Life", content: "The campus is beautiful with excellent facilities. Hostel life is amazing with cultural festivals like Mood Indigo being a highlight. Sports facilities are top-notch.", category: "Campus Life" },
    ],
  },
  {
    name: "Indian Institute of Technology Delhi",
    slug: "iit-delhi",
    location: "New Delhi",
    state: "Delhi",
    type: "Engineering",
    establishedYear: 1961,
    rating: 4.7,
    fees: 240000,
    description:
      "IIT Delhi is a premier engineering institution located in the heart of New Delhi. It is renowned for its rigorous academic programs, extensive research output, and strong industry connections. The institute offers a diverse range of undergraduate and postgraduate programs.",
    website: "https://home.iitd.ac.in",
    affiliation: "UGC, AICTE",
    ranking: 2,
    ownership: "Government",
    courses: [
      { name: "Computer Science and Engineering", duration: "4 Years", degree: "B.Tech", fees: 960000 },
      { name: "Electrical Engineering", duration: "4 Years", degree: "B.Tech", fees: 960000 },
      { name: "Mathematics and Computing", duration: "4 Years", degree: "B.Tech", fees: 960000 },
      { name: "Artificial Intelligence", duration: "2 Years", degree: "M.Tech", fees: 480000 },
    ],
    placements: [
      { year: 2024, averagePackage: 2200, highestPackage: 28000, medianPackage: 1900, placementRate: 96, topRecruiters: "Google, Apple, Microsoft, JP Morgan, Tower Research" },
      { year: 2023, averagePackage: 2000, highestPackage: 26000, medianPackage: 1800, placementRate: 95, topRecruiters: "Google, Microsoft, Uber, Goldman Sachs, Samsung" },
    ],
    reviews: [
      { rating: 4.8, title: "Exceptional Academics", content: "The curriculum is challenging and the professors are experts in their fields. The research labs are well-equipped. The entrepreneurship cell is very active.", category: "Academics" },
      { rating: 4.5, title: "Good Placements", content: "Placements are excellent with top companies visiting campus. The placement cell is very well organized and provides ample preparation support.", category: "Placements" },
    ],
  },
  {
    name: "Indian Institute of Technology Madras",
    slug: "iit-madras",
    location: "Chennai",
    state: "Tamil Nadu",
    type: "Engineering",
    establishedYear: 1959,
    rating: 4.9,
    fees: 230000,
    description:
      "IIT Madras consistently ranks as India's #1 engineering institute in the NIRF rankings. Set in a sprawling campus within the Guindy National Park, it combines academic excellence with a unique natural environment. Known for its research output and startup ecosystem.",
    website: "https://www.iitm.ac.in",
    affiliation: "UGC, AICTE",
    ranking: 1,
    ownership: "Government",
    courses: [
      { name: "Computer Science and Engineering", duration: "4 Years", degree: "B.Tech", fees: 920000 },
      { name: "Data Science", duration: "4 Years", degree: "B.S.", fees: 920000 },
      { name: "Electrical Engineering", duration: "4 Years", degree: "B.Tech", fees: 920000 },
      { name: "Mechanical Engineering", duration: "4 Years", degree: "B.Tech", fees: 920000 },
      { name: "Computer Science", duration: "2 Years", degree: "M.Tech", fees: 460000 },
    ],
    placements: [
      { year: 2024, averagePackage: 2300, highestPackage: 30000, medianPackage: 2000, placementRate: 97, topRecruiters: "Google, Microsoft, Amazon, Goldman Sachs, Qualcomm" },
      { year: 2023, averagePackage: 2100, highestPackage: 28000, medianPackage: 1900, placementRate: 96, topRecruiters: "Google, Apple, Microsoft, Texas Instruments, Intel" },
    ],
    reviews: [
      { rating: 5.0, title: "India's Best", content: "There's a reason IIT Madras is ranked #1. The academic rigor, research opportunities, and overall campus experience are unparalleled. The startup ecosystem here with the IIT Madras Research Park is incredible.", category: "Academics" },
    ],
  },
  {
    name: "Indian Institute of Technology Kanpur",
    slug: "iit-kanpur",
    location: "Kanpur",
    state: "Uttar Pradesh",
    type: "Engineering",
    establishedYear: 1959,
    rating: 4.6,
    fees: 220000,
    description:
      "IIT Kanpur is known for its strong emphasis on fundamental research and its pioneering role in computer science education in India. The institute has a large campus with excellent facilities and fosters a culture of academic freedom.",
    website: "https://www.iitk.ac.in",
    affiliation: "UGC, AICTE",
    ranking: 4,
    ownership: "Government",
    courses: [
      { name: "Computer Science and Engineering", duration: "4 Years", degree: "B.Tech", fees: 880000 },
      { name: "Aerospace Engineering", duration: "4 Years", degree: "B.Tech", fees: 880000 },
      { name: "Electrical Engineering", duration: "4 Years", degree: "B.Tech", fees: 880000 },
    ],
    placements: [
      { year: 2024, averagePackage: 1900, highestPackage: 25000, medianPackage: 1600, placementRate: 92, topRecruiters: "Google, Microsoft, Samsung, Qualcomm, Goldman Sachs" },
    ],
    reviews: [
      { rating: 4.5, title: "Strong Academics", content: "IIT Kanpur has an excellent academic culture with a focus on theory and research. The computer science department is one of the best in the country.", category: "Academics" },
    ],
  },
  {
    name: "Indian Institute of Technology Kharagpur",
    slug: "iit-kharagpur",
    location: "Kharagpur",
    state: "West Bengal",
    type: "Engineering",
    establishedYear: 1951,
    rating: 4.5,
    fees: 210000,
    description:
      "IIT Kharagpur is India's first IIT, established in 1951. It has the largest campus among all IITs and offers the widest range of academic programs. Known for its strong alumni network including Google CEO Sundar Pichai.",
    website: "https://www.iitkgp.ac.in",
    affiliation: "UGC, AICTE",
    ranking: 5,
    ownership: "Government",
    courses: [
      { name: "Computer Science and Engineering", duration: "4 Years", degree: "B.Tech", fees: 840000 },
      { name: "Electronics and Electrical Communication", duration: "4 Years", degree: "B.Tech", fees: 840000 },
      { name: "Architecture", duration: "5 Years", degree: "B.Arch", fees: 1050000 },
    ],
    placements: [
      { year: 2024, averagePackage: 1850, highestPackage: 24000, medianPackage: 1500, placementRate: 91, topRecruiters: "Google, Microsoft, Amazon, Flipkart, Goldman Sachs" },
    ],
    reviews: [
      { rating: 4.3, title: "Historic Institution", content: "Being the first IIT, Kharagpur has a rich legacy. The campus is huge with great facilities. Strong placement record and excellent peer group.", category: "Campus Life" },
    ],
  },
  {
    name: "National Institute of Technology Tiruchirappalli",
    slug: "nit-trichy",
    location: "Tiruchirappalli",
    state: "Tamil Nadu",
    type: "Engineering",
    establishedYear: 1964,
    rating: 4.3,
    fees: 175000,
    description:
      "NIT Trichy is consistently ranked as one of the top NITs in India. Known for its strong academic programs in engineering and technology, it offers excellent placement opportunities with a competitive fee structure.",
    website: "https://www.nitt.edu",
    affiliation: "UGC, AICTE",
    ranking: 9,
    ownership: "Government",
    courses: [
      { name: "Computer Science and Engineering", duration: "4 Years", degree: "B.Tech", fees: 700000 },
      { name: "Electronics and Communication", duration: "4 Years", degree: "B.Tech", fees: 700000 },
      { name: "Mechanical Engineering", duration: "4 Years", degree: "B.Tech", fees: 700000 },
    ],
    placements: [
      { year: 2024, averagePackage: 1200, highestPackage: 6000, medianPackage: 1000, placementRate: 88, topRecruiters: "Microsoft, Amazon, Samsung, TCS, Infosys" },
    ],
    reviews: [
      { rating: 4.2, title: "Top NIT", content: "NIT Trichy offers great value for money. The academics are rigorous and placements are consistently good. Campus life is enjoyable with many cultural events.", category: "Academics" },
    ],
  },
  {
    name: "National Institute of Technology Warangal",
    slug: "nit-warangal",
    location: "Warangal",
    state: "Telangana",
    type: "Engineering",
    establishedYear: 1959,
    rating: 4.2,
    fees: 165000,
    description:
      "NIT Warangal is one of the first 17 RECs established by the Government of India. It has grown into a premier engineering institution with strong academic programs and a beautiful campus.",
    website: "https://www.nitw.ac.in",
    affiliation: "UGC, AICTE",
    ranking: 10,
    ownership: "Government",
    courses: [
      { name: "Computer Science and Engineering", duration: "4 Years", degree: "B.Tech", fees: 660000 },
      { name: "Electrical Engineering", duration: "4 Years", degree: "B.Tech", fees: 660000 },
    ],
    placements: [
      { year: 2024, averagePackage: 1100, highestPackage: 5500, medianPackage: 900, placementRate: 86, topRecruiters: "Microsoft, Amazon, Flipkart, TCS, Wipro" },
    ],
    reviews: [
      { rating: 4.0, title: "Great College", content: "A well-established NIT with good faculty and resources. The campus is large and green. Placements have been improving year after year.", category: "Campus Life" },
    ],
  },
  {
    name: "IIIT Hyderabad",
    slug: "iiit-hyderabad",
    location: "Hyderabad",
    state: "Telangana",
    type: "Engineering",
    establishedYear: 1998,
    rating: 4.6,
    fees: 310000,
    description:
      "IIIT Hyderabad is a research-focused university specializing in IT and allied areas. Known for its strong CS curriculum and excellent placement record, it is often ranked alongside the top IITs for computer science.",
    website: "https://www.iiit.ac.in",
    affiliation: "UGC",
    ranking: 15,
    ownership: "Public",
    courses: [
      { name: "Computer Science and Engineering", duration: "4 Years", degree: "B.Tech", fees: 1240000 },
      { name: "Electronics and Communication", duration: "4 Years", degree: "B.Tech", fees: 1240000 },
      { name: "Computer Science", duration: "2 Years", degree: "M.Tech", fees: 620000 },
    ],
    placements: [
      { year: 2024, averagePackage: 1800, highestPackage: 22000, medianPackage: 1500, placementRate: 93, topRecruiters: "Google, Microsoft, Amazon, Uber, Sprinklr" },
    ],
    reviews: [
      { rating: 4.7, title: "CS Powerhouse", content: "If you want to study CS, IIIT-H is one of the best options. The research culture is incredible and the placement stats speak for themselves.", category: "Academics" },
    ],
  },
  {
    name: "Birla Institute of Technology and Science Pilani",
    slug: "bits-pilani",
    location: "Pilani",
    state: "Rajasthan",
    type: "Engineering",
    establishedYear: 1964,
    rating: 4.5,
    fees: 450000,
    description:
      "BITS Pilani is one of India's most prestigious private engineering institutions. Known for its practice school program, flexible academic system, and strong industry connections. The institute has produced numerous successful entrepreneurs and tech leaders.",
    website: "https://www.bits-pilani.ac.in",
    affiliation: "UGC",
    ranking: 12,
    ownership: "Private",
    courses: [
      { name: "Computer Science", duration: "4 Years", degree: "B.E.", fees: 1800000 },
      { name: "Electronics and Instrumentation", duration: "4 Years", degree: "B.E.", fees: 1800000 },
      { name: "Mechanical Engineering", duration: "4 Years", degree: "B.E.", fees: 1800000 },
      { name: "Chemical Engineering", duration: "4 Years", degree: "B.E.", fees: 1800000 },
    ],
    placements: [
      { year: 2024, averagePackage: 1600, highestPackage: 20000, medianPackage: 1300, placementRate: 90, topRecruiters: "Google, Microsoft, Goldman Sachs, JP Morgan, Samsung" },
    ],
    reviews: [
      { rating: 4.4, title: "Excellent Overall Experience", content: "The practice school system at BITS is unique and gives real industry exposure. The campus culture is vibrant and the alumni network is strong.", category: "Campus Life" },
    ],
  },
  {
    name: "Vellore Institute of Technology",
    slug: "vit-vellore",
    location: "Vellore",
    state: "Tamil Nadu",
    type: "Engineering",
    establishedYear: 1984,
    rating: 4.1,
    fees: 285000,
    description:
      "VIT Vellore is one of India's top private engineering colleges. Known for excellent infrastructure, international collaborations, and a structured placement process. The university offers a wide variety of programs and has a diverse student body.",
    website: "https://www.vit.ac.in",
    affiliation: "UGC, NAAC A++",
    ranking: 11,
    ownership: "Private",
    courses: [
      { name: "Computer Science and Engineering", duration: "4 Years", degree: "B.Tech", fees: 1140000 },
      { name: "Information Technology", duration: "4 Years", degree: "B.Tech", fees: 1140000 },
      { name: "Electrical and Electronics", duration: "4 Years", degree: "B.Tech", fees: 1140000 },
      { name: "Data Science", duration: "4 Years", degree: "B.Tech", fees: 1140000 },
    ],
    placements: [
      { year: 2024, averagePackage: 850, highestPackage: 6000, medianPackage: 700, placementRate: 85, topRecruiters: "Microsoft, Amazon, Deloitte, Cognizant, Infosys" },
    ],
    reviews: [
      { rating: 4.0, title: "Good Private College", content: "VIT has great infrastructure and good placement support. The campus is well-maintained with excellent facilities. International exchange programs are a plus.", category: "Infrastructure" },
    ],
  },
  {
    name: "Delhi Technological University",
    slug: "dtu-delhi",
    location: "New Delhi",
    state: "Delhi",
    type: "Engineering",
    establishedYear: 1941,
    rating: 4.2,
    fees: 178000,
    description:
      "Delhi Technological University (formerly DCE) is one of India's oldest and most reputed engineering institutions. Located in the capital city, it offers excellent placement opportunities and has a strong alumni network in the tech industry.",
    website: "https://www.dtu.ac.in",
    affiliation: "UGC, AICTE",
    ranking: 20,
    ownership: "Government",
    courses: [
      { name: "Computer Engineering", duration: "4 Years", degree: "B.Tech", fees: 712000 },
      { name: "Software Engineering", duration: "4 Years", degree: "B.Tech", fees: 712000 },
      { name: "Information Technology", duration: "4 Years", degree: "B.Tech", fees: 712000 },
    ],
    placements: [
      { year: 2024, averagePackage: 1300, highestPackage: 15000, medianPackage: 1000, placementRate: 87, topRecruiters: "Google, Microsoft, Amazon, Adobe, Samsung" },
    ],
    reviews: [
      { rating: 4.1, title: "Great Location Advantage", content: "Being in Delhi gives a massive advantage for internships and industry exposure. The alumni network is very helpful for placements and career guidance.", category: "Placements" },
    ],
  },
  {
    name: "IIIT Delhi",
    slug: "iiit-delhi",
    location: "New Delhi",
    state: "Delhi",
    type: "Engineering",
    establishedYear: 2008,
    rating: 4.4,
    fees: 335000,
    description:
      "IIIT Delhi is a state university focused on IT and allied areas. Despite being relatively new, it has quickly established itself as a top CS-focused institution in India with an excellent research track record and placement statistics.",
    website: "https://www.iiitd.ac.in",
    affiliation: "UGC",
    ranking: 18,
    ownership: "Government",
    courses: [
      { name: "Computer Science and Engineering", duration: "4 Years", degree: "B.Tech", fees: 1340000 },
      { name: "Computer Science and AI", duration: "4 Years", degree: "B.Tech", fees: 1340000 },
      { name: "Computer Science and Design", duration: "4 Years", degree: "B.Tech", fees: 1340000 },
    ],
    placements: [
      { year: 2024, averagePackage: 1700, highestPackage: 20000, medianPackage: 1400, placementRate: 92, topRecruiters: "Google, Microsoft, Amazon, Uber, Adobe" },
    ],
    reviews: [
      { rating: 4.5, title: "Rising Star", content: "IIIT Delhi has grown incredibly fast. The focused CS curriculum and research culture make it one of the best for CS in North India.", category: "Academics" },
    ],
  },
  {
    name: "College of Engineering Pune",
    slug: "coep-pune",
    location: "Pune",
    state: "Maharashtra",
    type: "Engineering",
    establishedYear: 1854,
    rating: 4.1,
    fees: 140000,
    description:
      "COEP is one of India's oldest engineering colleges, established in 1854. Located in Pune's IT hub, it offers strong engineering programs with affordable fees. The college has a rich history and an extensive alumni network.",
    website: "https://www.coep.org.in",
    affiliation: "AICTE",
    ranking: 25,
    ownership: "Government",
    courses: [
      { name: "Computer Engineering", duration: "4 Years", degree: "B.Tech", fees: 560000 },
      { name: "Electronics and Telecommunication", duration: "4 Years", degree: "B.Tech", fees: 560000 },
      { name: "Mechanical Engineering", duration: "4 Years", degree: "B.Tech", fees: 560000 },
    ],
    placements: [
      { year: 2024, averagePackage: 1000, highestPackage: 7000, medianPackage: 800, placementRate: 84, topRecruiters: "Microsoft, Persistent Systems, Infosys, TCS, Wipro" },
    ],
    reviews: [
      { rating: 4.0, title: "Heritage College", content: "COEP has a rich heritage being one of the oldest engineering colleges in Asia. The new focus on research and modern curricula has improved the quality significantly.", category: "Academics" },
    ],
  },
  {
    name: "SRM Institute of Science and Technology",
    slug: "srm-chennai",
    location: "Chennai",
    state: "Tamil Nadu",
    type: "Engineering",
    establishedYear: 1985,
    rating: 3.9,
    fees: 350000,
    description:
      "SRMIST is a leading private university in South India offering a wide range of engineering and technology programs. Known for its modern infrastructure, international collaborations, and comprehensive placement support.",
    website: "https://www.srmist.edu.in",
    affiliation: "UGC, NAAC A++",
    ranking: 30,
    ownership: "Private",
    courses: [
      { name: "Computer Science and Engineering", duration: "4 Years", degree: "B.Tech", fees: 1400000 },
      { name: "AI and Machine Learning", duration: "4 Years", degree: "B.Tech", fees: 1400000 },
      { name: "Biotechnology", duration: "4 Years", degree: "B.Tech", fees: 1400000 },
    ],
    placements: [
      { year: 2024, averagePackage: 750, highestPackage: 4500, medianPackage: 600, placementRate: 80, topRecruiters: "Amazon, Cognizant, Deloitte, TCS, HCL" },
    ],
    reviews: [
      { rating: 3.8, title: "Good Infrastructure", content: "SRM has world-class infrastructure and labs. The campus is well-maintained. Placements are decent but competition is high due to large batch sizes.", category: "Infrastructure" },
    ],
  },
  {
    name: "Manipal Institute of Technology",
    slug: "mit-manipal",
    location: "Manipal",
    state: "Karnataka",
    type: "Engineering",
    establishedYear: 1957,
    rating: 4.2,
    fees: 420000,
    description:
      "MIT Manipal is a constituent institute of MAHE Manipal and is one of India's most sought-after private engineering colleges. Known for its beautiful campus, diverse student body, and strong industry connections.",
    website: "https://www.manipal.edu",
    affiliation: "UGC, NAAC A++",
    ranking: 16,
    ownership: "Private",
    courses: [
      { name: "Computer Science and Engineering", duration: "4 Years", degree: "B.Tech", fees: 1680000 },
      { name: "Information Technology", duration: "4 Years", degree: "B.Tech", fees: 1680000 },
      { name: "Electronics and Communication", duration: "4 Years", degree: "B.Tech", fees: 1680000 },
    ],
    placements: [
      { year: 2024, averagePackage: 900, highestPackage: 8000, medianPackage: 750, placementRate: 86, topRecruiters: "Microsoft, Amazon, Goldman Sachs, VMware, Cisco" },
    ],
    reviews: [
      { rating: 4.3, title: "Amazing Campus Life", content: "Manipal offers an unbeatable campus experience. The town revolves around the university and there's always something happening. Great diverse crowd from all over India.", category: "Campus Life" },
    ],
  },
  {
    name: "NIT Surathkal",
    slug: "nit-surathkal",
    location: "Mangalore",
    state: "Karnataka",
    type: "Engineering",
    establishedYear: 1960,
    rating: 4.3,
    fees: 170000,
    description:
      "NIT Karnataka (Surathkal) is one of the top-ranked NITs in India, located along the beautiful Arabian Sea coast. Known for its strong engineering programs and consistently good placement records.",
    website: "https://www.nitk.ac.in",
    affiliation: "UGC, AICTE",
    ranking: 8,
    ownership: "Government",
    courses: [
      { name: "Computer Science and Engineering", duration: "4 Years", degree: "B.Tech", fees: 680000 },
      { name: "Information Technology", duration: "4 Years", degree: "B.Tech", fees: 680000 },
      { name: "Mechanical Engineering", duration: "4 Years", degree: "B.Tech", fees: 680000 },
    ],
    placements: [
      { year: 2024, averagePackage: 1250, highestPackage: 10000, medianPackage: 1000, placementRate: 89, topRecruiters: "Google, Microsoft, Amazon, Qualcomm, Cisco" },
    ],
    reviews: [
      { rating: 4.4, title: "Beach-side Campus", content: "The campus is right next to the beach which is a major plus. Academics are strong and the student community is very collaborative. Great for overall development.", category: "Campus Life" },
    ],
  },
  {
    name: "Jadavpur University",
    slug: "jadavpur-university",
    location: "Kolkata",
    state: "West Bengal",
    type: "Engineering",
    establishedYear: 1955,
    rating: 4.3,
    fees: 35000,
    description:
      "Jadavpur University is a highly respected public university known for its engineering and humanities departments. One of the most affordable top engineering colleges in India with an excellent academic reputation.",
    website: "https://www.jaduniv.edu.in",
    affiliation: "UGC, NAAC",
    ranking: 14,
    ownership: "Government",
    courses: [
      { name: "Computer Science and Engineering", duration: "4 Years", degree: "B.E.", fees: 140000 },
      { name: "Electronics and Telecommunication", duration: "4 Years", degree: "B.E.", fees: 140000 },
      { name: "Power Engineering", duration: "4 Years", degree: "B.E.", fees: 140000 },
    ],
    placements: [
      { year: 2024, averagePackage: 1100, highestPackage: 8000, medianPackage: 850, placementRate: 82, topRecruiters: "Amazon, Microsoft, TCS, Cognizant, Infosys" },
    ],
    reviews: [
      { rating: 4.2, title: "Incredible Value", content: "At this fee structure, JU offers unmatched value. The engineering departments are excellent, especially CS and ETC. Student culture is vibrant with strong political awareness.", category: "Academics" },
    ],
  },
  {
    name: "Indian Institute of Technology Roorkee",
    slug: "iit-roorkee",
    location: "Roorkee",
    state: "Uttarakhand",
    type: "Engineering",
    establishedYear: 1847,
    rating: 4.4,
    fees: 210000,
    description:
      "IIT Roorkee, formerly the University of Roorkee, is Asia's oldest technical institution. It has a strong legacy in civil and mechanical engineering and has expanded significantly into computer science and other modern disciplines.",
    website: "https://www.iitr.ac.in",
    affiliation: "UGC, AICTE",
    ranking: 6,
    ownership: "Government",
    courses: [
      { name: "Computer Science and Engineering", duration: "4 Years", degree: "B.Tech", fees: 840000 },
      { name: "Civil Engineering", duration: "4 Years", degree: "B.Tech", fees: 840000 },
      { name: "Architecture", duration: "5 Years", degree: "B.Arch", fees: 1050000 },
    ],
    placements: [
      { year: 2024, averagePackage: 1800, highestPackage: 22000, medianPackage: 1500, placementRate: 90, topRecruiters: "Google, Microsoft, Amazon, Goldman Sachs, Uber" },
    ],
    reviews: [
      { rating: 4.3, title: "Historic Campus", content: "The heritage of IIT Roorkee is incredible. The campus has a unique old-world charm. Academics are strong and the institute has modernized well.", category: "Campus Life" },
    ],
  },
  {
    name: "Indian Institute of Technology Guwahati",
    slug: "iit-guwahati",
    location: "Guwahati",
    state: "Assam",
    type: "Engineering",
    establishedYear: 1994,
    rating: 4.3,
    fees: 220000,
    description:
      "IIT Guwahati is one of the newer IITs that has quickly risen in rankings and reputation. Located on the banks of the Brahmaputra river, it offers a stunning campus and strong academic programs.",
    website: "https://www.iitg.ac.in",
    affiliation: "UGC, AICTE",
    ranking: 7,
    ownership: "Government",
    courses: [
      { name: "Computer Science and Engineering", duration: "4 Years", degree: "B.Tech", fees: 880000 },
      { name: "Electronics and Electrical Engineering", duration: "4 Years", degree: "B.Tech", fees: 880000 },
      { name: "Design", duration: "4 Years", degree: "B.Des", fees: 880000 },
    ],
    placements: [
      { year: 2024, averagePackage: 1700, highestPackage: 20000, medianPackage: 1400, placementRate: 89, topRecruiters: "Google, Microsoft, Amazon, Adobe, Flipkart" },
    ],
    reviews: [
      { rating: 4.2, title: "Beautiful Campus", content: "The campus by the Brahmaputra is breathtaking. The design department is unique to IIT Guwahati and very well regarded. Academics are solid across departments.", category: "Campus Life" },
    ],
  },
  {
    name: "PES University",
    slug: "pes-university",
    location: "Bangalore",
    state: "Karnataka",
    type: "Engineering",
    establishedYear: 1972,
    rating: 4.0,
    fees: 380000,
    description:
      "PES University is a top private university in Bangalore, India's tech hub. Known for its strong computer science program, industry connections, and a campus buzzling with tech startups and innovation.",
    website: "https://pes.edu",
    affiliation: "UGC, AICTE",
    ranking: 35,
    ownership: "Private",
    courses: [
      { name: "Computer Science and Engineering", duration: "4 Years", degree: "B.Tech", fees: 1520000 },
      { name: "Electronics and Communication", duration: "4 Years", degree: "B.Tech", fees: 1520000 },
      { name: "Mechanical Engineering", duration: "4 Years", degree: "B.Tech", fees: 1520000 },
    ],
    placements: [
      { year: 2024, averagePackage: 950, highestPackage: 7000, medianPackage: 800, placementRate: 83, topRecruiters: "Google, Microsoft, Amazon, Oracle, SAP" },
    ],
    reviews: [
      { rating: 4.0, title: "Bangalore Advantage", content: "Being in Bangalore gives incredible access to the tech industry. PES has good CS faculty and the placement support is organized well.", category: "Placements" },
    ],
  },
  {
    name: "Thapar Institute of Engineering and Technology",
    slug: "thapar-patiala",
    location: "Patiala",
    state: "Punjab",
    type: "Engineering",
    establishedYear: 1956,
    rating: 4.0,
    fees: 310000,
    description:
      "Thapar is a leading private institute in North India, known for its quality education and comprehensive campus facilities. The institute is a deemed university with NAAC A grade.",
    website: "https://www.thapar.edu",
    affiliation: "UGC, NAAC A",
    ranking: 28,
    ownership: "Private",
    courses: [
      { name: "Computer Engineering", duration: "4 Years", degree: "B.E.", fees: 1240000 },
      { name: "Electronics and Communication", duration: "4 Years", degree: "B.E.", fees: 1240000 },
    ],
    placements: [
      { year: 2024, averagePackage: 850, highestPackage: 6000, medianPackage: 700, placementRate: 82, topRecruiters: "Microsoft, Amazon, Infosys, TCS, Wipro" },
    ],
    reviews: [
      { rating: 3.9, title: "Well-Rounded Education", content: "Thapar provides a good all-round education with decent placements. The campus is well-maintained and faculty is generally good.", category: "Academics" },
    ],
  },
  {
    name: "Indian Institute of Technology Hyderabad",
    slug: "iit-hyderabad",
    location: "Sangareddy",
    state: "Telangana",
    type: "Engineering",
    establishedYear: 2008,
    rating: 4.4,
    fees: 230000,
    description:
      "IIT Hyderabad is one of the second-generation IITs that has rapidly established itself with excellent faculty, innovative curriculum, and strong research output. Located in the Telangana IT corridor.",
    website: "https://www.iith.ac.in",
    affiliation: "UGC, AICTE",
    ranking: 8,
    ownership: "Government",
    courses: [
      { name: "Computer Science and Engineering", duration: "4 Years", degree: "B.Tech", fees: 920000 },
      { name: "AI and Machine Learning", duration: "4 Years", degree: "B.Tech", fees: 920000 },
      { name: "Electrical Engineering", duration: "4 Years", degree: "B.Tech", fees: 920000 },
    ],
    placements: [
      { year: 2024, averagePackage: 1600, highestPackage: 18000, medianPackage: 1300, placementRate: 90, topRecruiters: "Google, Microsoft, Amazon, Qualcomm, Samsung" },
    ],
    reviews: [
      { rating: 4.3, title: "Rapid Growth", content: "IIT Hyderabad has grown incredibly fast. The AI/ML programs are cutting-edge and the faculty is top-notch. Campus is modern and well-planned.", category: "Academics" },
    ],
  },
  {
    name: "NIT Rourkela",
    slug: "nit-rourkela",
    location: "Rourkela",
    state: "Odisha",
    type: "Engineering",
    establishedYear: 1961,
    rating: 4.1,
    fees: 160000,
    description:
      "NIT Rourkela is a well-known NIT with strong programs in metallurgy, mining, and computer science. The campus is spacious with excellent sports facilities.",
    website: "https://www.nitrkl.ac.in",
    affiliation: "UGC, AICTE",
    ranking: 13,
    ownership: "Government",
    courses: [
      { name: "Computer Science and Engineering", duration: "4 Years", degree: "B.Tech", fees: 640000 },
      { name: "Metallurgical and Materials Engineering", duration: "4 Years", degree: "B.Tech", fees: 640000 },
    ],
    placements: [
      { year: 2024, averagePackage: 1050, highestPackage: 6000, medianPackage: 850, placementRate: 85, topRecruiters: "Microsoft, Amazon, Flipkart, TCS, Infosys" },
    ],
    reviews: [
      { rating: 4.0, title: "Strong NIT", content: "Good academic environment with dedicated faculty. Campus is big and green. The institute has been improving year after year in terms of placements.", category: "Academics" },
    ],
  },
  {
    name: "Indian School of Business",
    slug: "isb-hyderabad",
    location: "Hyderabad",
    state: "Telangana",
    type: "Management",
    establishedYear: 2001,
    rating: 4.8,
    fees: 1950000,
    description:
      "ISB is one of the top business schools globally. Known for its PGP (equivalent to MBA), ISB consistently ranks among the best in Asia. The faculty includes professors from Wharton, Kellogg, and other top global schools.",
    website: "https://www.isb.edu",
    affiliation: "AACSB, EQUIS",
    ranking: 1,
    ownership: "Private",
    courses: [
      { name: "Post Graduate Programme in Management", duration: "1 Year", degree: "PGP", fees: 4300000 },
      { name: "PGP in Management for Family Business", duration: "1 Year", degree: "PGP", fees: 3500000 },
    ],
    placements: [
      { year: 2024, averagePackage: 3400, highestPackage: 11200, medianPackage: 3100, placementRate: 98, topRecruiters: "McKinsey, BCG, Bain, Amazon, Google" },
    ],
    reviews: [
      { rating: 4.9, title: "World-Class MBA", content: "ISB's one-year PGP is absolutely transformative. The faculty, peer group, and career outcomes are exceptional. The alumni network opens doors globally.", category: "Academics" },
    ],
  },
  {
    name: "IIM Ahmedabad",
    slug: "iim-ahmedabad",
    location: "Ahmedabad",
    state: "Gujarat",
    type: "Management",
    establishedYear: 1961,
    rating: 4.9,
    fees: 1200000,
    description:
      "IIM Ahmedabad is India's most prestigious management institute, consistently ranked #1 for MBA in India. Known for its case-study methodology, world-class faculty, and the highest placement packages in the country.",
    website: "https://www.iima.ac.in",
    affiliation: "AACSB, EQUIS, AMBA",
    ranking: 1,
    ownership: "Government",
    courses: [
      { name: "Post Graduate Programme in Management", duration: "2 Years", degree: "MBA", fees: 2800000 },
      { name: "Executive MBA", duration: "1 Year", degree: "PGPX", fees: 3200000 },
    ],
    placements: [
      { year: 2024, averagePackage: 3600, highestPackage: 10800, medianPackage: 3200, placementRate: 100, topRecruiters: "McKinsey, BCG, Goldman Sachs, Amazon, Google" },
    ],
    reviews: [
      { rating: 5.0, title: "The Pinnacle", content: "IIM-A is the gold standard of management education in India. The case pedagogy, rigorous curriculum, and incredible peer group make it an unforgettable experience.", category: "Academics" },
    ],
  },
  {
    name: "AIIMS New Delhi",
    slug: "aiims-delhi",
    location: "New Delhi",
    state: "Delhi",
    type: "Medical",
    establishedYear: 1956,
    rating: 4.9,
    fees: 8000,
    description:
      "AIIMS Delhi is India's premier medical institute, offering world-class medical education at minimal cost. It is the dream destination for medical aspirants across India with an extremely competitive admission process.",
    website: "https://www.aiims.edu",
    affiliation: "NMC",
    ranking: 1,
    ownership: "Government",
    courses: [
      { name: "MBBS", duration: "5.5 Years", degree: "MBBS", fees: 44000 },
      { name: "M.D. General Medicine", duration: "3 Years", degree: "M.D.", fees: 30000 },
      { name: "M.S. General Surgery", duration: "3 Years", degree: "M.S.", fees: 30000 },
    ],
    placements: [
      { year: 2024, averagePackage: 1200, highestPackage: 5000, medianPackage: 1000, placementRate: 100, topRecruiters: "AIIMS Network, Apollo, Fortis, Max Healthcare, Medanta" },
    ],
    reviews: [
      { rating: 5.0, title: "Best Medical College", content: "AIIMS is the pinnacle of medical education in India. The clinical exposure, research opportunities, and patient diversity are unmatched. And all this at virtually zero cost.", category: "Academics" },
    ],
  },
  {
    name: "IIT BHU Varanasi",
    slug: "iit-bhu",
    location: "Varanasi",
    state: "Uttar Pradesh",
    type: "Engineering",
    establishedYear: 1919,
    rating: 4.3,
    fees: 200000,
    description:
      "IIT BHU (formerly IT-BHU) is located within the sprawling Banaras Hindu University campus. It combines the heritage of BHU with the academic rigor of an IIT. Known for its strong ceramics, mining, and computer science departments.",
    website: "https://www.iitbhu.ac.in",
    affiliation: "UGC, AICTE",
    ranking: 10,
    ownership: "Government",
    courses: [
      { name: "Computer Science and Engineering", duration: "4 Years", degree: "B.Tech", fees: 800000 },
      { name: "Ceramic Engineering", duration: "4 Years", degree: "B.Tech", fees: 800000 },
      { name: "Mining Engineering", duration: "4 Years", degree: "B.Tech", fees: 800000 },
    ],
    placements: [
      { year: 2024, averagePackage: 1500, highestPackage: 18000, medianPackage: 1200, placementRate: 88, topRecruiters: "Google, Microsoft, Amazon, Uber, Goldman Sachs" },
    ],
    reviews: [
      { rating: 4.2, title: "Heritage + Modern", content: "Being part of BHU campus gives a unique cultural experience. The academics are rigorous and placements for CS are excellent. Varanasi's cultural richness adds to the experience.", category: "Campus Life" },
    ],
  },
  {
    name: "NIT Calicut",
    slug: "nit-calicut",
    location: "Kozhikode",
    state: "Kerala",
    type: "Engineering",
    establishedYear: 1961,
    rating: 4.1,
    fees: 165000,
    description:
      "NIT Calicut is one of the oldest and most reputed NITs in South India. Set amidst lush green surroundings in Kerala, it offers quality engineering education with strong placement support.",
    website: "https://www.nitc.ac.in",
    affiliation: "UGC, AICTE",
    ranking: 12,
    ownership: "Government",
    courses: [
      { name: "Computer Science and Engineering", duration: "4 Years", degree: "B.Tech", fees: 660000 },
      { name: "Electronics and Communication", duration: "4 Years", degree: "B.Tech", fees: 660000 },
    ],
    placements: [
      { year: 2024, averagePackage: 1100, highestPackage: 6500, medianPackage: 900, placementRate: 86, topRecruiters: "Microsoft, Amazon, Flipkart, Samsung, TCS" },
    ],
    reviews: [
      { rating: 4.0, title: "Green and Peaceful", content: "NIT Calicut has one of the most beautiful campuses among NITs. The academics are strong and the hostel life is great. Kerala's natural beauty adds to the experience.", category: "Campus Life" },
    ],
  },
  {
    name: "Amity University Noida",
    slug: "amity-noida",
    location: "Noida",
    state: "Uttar Pradesh",
    type: "Engineering",
    establishedYear: 2005,
    rating: 3.5,
    fees: 380000,
    description:
      "Amity University is one of India's largest private universities. It offers a wide variety of programs and has invested heavily in infrastructure and international collaborations.",
    website: "https://www.amity.edu",
    affiliation: "UGC, NAAC A+",
    ranking: 45,
    ownership: "Private",
    courses: [
      { name: "Computer Science and Engineering", duration: "4 Years", degree: "B.Tech", fees: 1520000 },
      { name: "Biotechnology", duration: "4 Years", degree: "B.Tech", fees: 1520000 },
    ],
    placements: [
      { year: 2024, averagePackage: 550, highestPackage: 3500, medianPackage: 450, placementRate: 72, topRecruiters: "Infosys, TCS, Wipro, Cognizant, HCL" },
    ],
    reviews: [
      { rating: 3.4, title: "Good Infrastructure", content: "Amity has invested a lot in infrastructure and the campus is impressive. Placements vary significantly by branch. Industry exposure through seminars and workshops is decent.", category: "Infrastructure" },
    ],
  },
  {
    name: "Indian Institute of Technology Indore",
    slug: "iit-indore",
    location: "Indore",
    state: "Madhya Pradesh",
    type: "Engineering",
    establishedYear: 2009,
    rating: 4.2,
    fees: 225000,
    description:
      "IIT Indore is one of the third-generation IITs that has shown remarkable growth. With a modern campus and strong focus on research, it has quickly climbed the NIRF rankings.",
    website: "https://www.iiti.ac.in",
    affiliation: "UGC, AICTE",
    ranking: 11,
    ownership: "Government",
    courses: [
      { name: "Computer Science and Engineering", duration: "4 Years", degree: "B.Tech", fees: 900000 },
      { name: "Electrical Engineering", duration: "4 Years", degree: "B.Tech", fees: 900000 },
    ],
    placements: [
      { year: 2024, averagePackage: 1400, highestPackage: 15000, medianPackage: 1100, placementRate: 88, topRecruiters: "Google, Microsoft, Amazon, Samsung, Adobe" },
    ],
    reviews: [
      { rating: 4.1, title: "Fast Growing IIT", content: "IIT Indore has a modern campus with great facilities. Being a newer IIT, the culture is very collaborative and the research output has been impressive.", category: "Academics" },
    ],
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.savedCollege.deleteMany();
  await prisma.review.deleteMany();
  await prisma.placement.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();
  await prisma.user.deleteMany();

  // Create a demo user
  const hashedPassword = await hash("password123", 12);
  const demoUser = await prisma.user.create({
    data: {
      name: "Demo User",
      email: "demo@example.com",
      password: hashedPassword,
    },
  });
  console.log(`✅ Created demo user: ${demoUser.email}`);

  // Seed colleges
  for (const collegeData of colleges) {
    const { courses, placements, reviews, ...college } = collegeData;

    const created = await prisma.college.create({
      data: {
        ...college,
        courses: {
          create: courses,
        },
        placements: {
          create: placements,
        },
        reviews: {
          create: reviews.map((r) => ({
            ...r,
            userId: demoUser.id,
          })),
        },
      },
    });
    console.log(`  📚 ${created.name}`);
  }

  console.log(`\n✅ Seeded ${colleges.length} colleges successfully!`);
  console.log(`\n📧 Demo login: demo@example.com / password123`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
