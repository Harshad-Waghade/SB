"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabaseIfEmpty = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../models/User");
const Profile_1 = require("../models/Profile");
const RoomListing_1 = require("../models/RoomListing");
const MessListing_1 = require("../models/MessListing");
const Review_1 = require("../models/Review");
const Enquiry_1 = require("../models/Enquiry");
const Deal_1 = require("../models/Deal");
const Agreement_1 = require("../models/Agreement");
const Coupon_1 = require("../models/Coupon");
const Notification_1 = require("../models/Notification");
const env_1 = require("../config/env");
const seedDatabaseIfEmpty = async () => {
    const usersCount = await User_1.User.countDocuments();
    if (usersCount > 0) {
        console.log('🌱 Database already populated. Skipping initial seed.');
        return;
    }
    console.log('🌱 Populating database with realistic StayBite Indian marketplace seed data...');
    const salt = await bcryptjs_1.default.genSalt(10);
    const defaultPasswordHash = await bcryptjs_1.default.hash('StayBite@123', salt);
    const adminPasswordHash = await bcryptjs_1.default.hash(env_1.ENV.ADMIN_PASSWORD, salt);
    // 1. Create Admin
    const admin = await User_1.User.create({
        name: 'StayBite Super Admin',
        email: env_1.ENV.ADMIN_EMAIL,
        phone: env_1.ENV.ADMIN_PHONE,
        passwordHash: adminPasswordHash,
        role: 'admin',
        isVerified: true,
        referralCode: 'ADMIN01',
        walletBalance: 10000
    });
    await Profile_1.Profile.create({
        userId: admin._id,
        preferredLanguage: 'en',
        currentCity: 'Nagpur',
        bio: 'Official Administrator of StayBite Platform.'
    });
    // 2. Create Students
    const studentData = [
        { name: 'Aarav Sharma', email: 'aarav.sharma@gmail.com', phone: '+919823011221', college: 'VNIT Nagpur', city: 'Nagpur', budget: 6000, food: 'veg' },
        { name: 'Ananya Iyer', email: 'ananya.iyer@gmail.com', phone: '+919823022332', college: 'COEP Pune', city: 'Pune', budget: 7500, food: 'veg' },
        { name: 'Rohit Deshmukh', email: 'rohit.deshmukh@gmail.com', phone: '+919823033443', college: 'RCOEM Nagpur', city: 'Nagpur', budget: 5000, food: 'both' },
        { name: 'Sneha Patil', email: 'sneha.patil@gmail.com', phone: '+919823044554', college: 'MIT World Peace University', city: 'Pune', budget: 8500, food: 'veg' },
        { name: 'Rahul Verma', email: 'rahul.verma@gmail.com', phone: '+919823055665', college: 'VJTI Mumbai', city: 'Mumbai', budget: 9000, food: 'non-veg' }
    ];
    const studentUsers = [];
    for (const s of studentData) {
        const user = await User_1.User.create({
            name: s.name,
            email: s.email,
            phone: s.phone,
            passwordHash: defaultPasswordHash,
            role: 'student',
            isVerified: true,
            referralCode: s.name.substring(0, 4).toUpperCase() + '2025',
            walletBalance: 100
        });
        await Profile_1.Profile.create({
            userId: user._id,
            preferredLanguage: 'en',
            collegeOrWorkplace: s.college,
            currentCity: s.city,
            preferredLocations: [s.city],
            budgetMin: s.budget - 1500,
            budgetMax: s.budget + 2000,
            foodPreference: s.food
        });
        studentUsers.push(user);
    }
    // 3. Create Employed Users
    const employedData = [
        { name: 'Rohan Kulkarni', email: 'rohan.k@gmail.com', phone: '+919823066778', company: 'TCS Hinjewadi', city: 'Pune', budget: 11000 },
        { name: 'Priya Nair', email: 'priya.nair@gmail.com', phone: '+919823077889', company: 'Infosys SEZ', city: 'Nagpur', budget: 9500 },
        { name: 'Vikram Joshi', email: 'vikram.j@gmail.com', phone: '+919823088990', company: 'Persistent Systems', city: 'Nagpur', budget: 8000 },
        { name: 'Pooja Mehta', email: 'pooja.mehta@gmail.com', phone: '+919823099001', company: 'Tech Mahindra', city: 'Pune', budget: 12000 },
        { name: 'Amit Kadam', email: 'amit.kadam@gmail.com', phone: '+919823100112', company: 'L&T Infotech', city: 'Mumbai', budget: 15000 }
    ];
    const employedUsers = [];
    for (const e of employedData) {
        const user = await User_1.User.create({
            name: e.name,
            email: e.email,
            phone: e.phone,
            passwordHash: defaultPasswordHash,
            role: 'employed',
            isVerified: true,
            referralCode: e.name.substring(0, 4).toUpperCase() + '99',
            walletBalance: 150
        });
        await Profile_1.Profile.create({
            userId: user._id,
            preferredLanguage: 'en',
            collegeOrWorkplace: e.company,
            currentCity: e.city,
            preferredLocations: [e.city],
            budgetMin: e.budget - 2000,
            budgetMax: e.budget + 3000
        });
        employedUsers.push(user);
    }
    // 4. Create Room Owners
    const roomOwnersData = [
        { name: 'Ramesh Deshpande', email: 'ramesh.rooms@staybite.com', phone: '+919850011221', city: 'Nagpur' },
        { name: 'Suresh Patil', email: 'suresh.pg@staybite.com', phone: '+919850022332', city: 'Pune' },
        { name: 'Sunita Rathi', email: 'sunita.hostels@staybite.com', phone: '+919850033443', city: 'Nagpur' },
        { name: 'Anand Kulkarni', email: 'anand.stays@staybite.com', phone: '+919850044554', city: 'Pune' },
        { name: 'Rajesh Agrawal', email: 'rajesh.hostel@staybite.com', phone: '+919850055665', city: 'Mumbai' }
    ];
    const roomOwnerUsers = [];
    for (const o of roomOwnersData) {
        const user = await User_1.User.create({
            name: o.name,
            email: o.email,
            phone: o.phone,
            passwordHash: defaultPasswordHash,
            role: 'room_owner',
            isVerified: true,
            referralCode: o.name.substring(0, 4).toUpperCase() + 'PRO',
            walletBalance: 500
        });
        await Profile_1.Profile.create({
            userId: user._id,
            preferredLanguage: 'en',
            currentCity: o.city,
            verificationDocuments: [
                {
                    docType: 'electricity_bill',
                    docUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
                    docNumber: 'EB-9920194',
                    status: 'verified',
                    verifiedAt: new Date()
                }
            ]
        });
        roomOwnerUsers.push(user);
    }
    // 5. Create Mess Owners
    const messOwnersData = [
        { name: 'Mangala Tai Deshmukh (Annapurna Mess)', email: 'annapurna.mess@staybite.com', phone: '+919860011221', city: 'Nagpur' },
        { name: 'Santosh Sawant (Sai Sagar Dining)', email: 'saisagar.mess@staybite.com', phone: '+919860022332', city: 'Pune' },
        { name: 'Shyam Sundar (Swad Pure Veg)', email: 'swad.kitchen@staybite.com', phone: '+919860033443', city: 'Nagpur' },
        { name: 'Kavita Joshi (Ghar Jaisa Tiffin)', email: 'tiffin.kavita@staybite.com', phone: '+919860044554', city: 'Pune' },
        { name: 'Dinesh Purohit (Maharaja Thali)', email: 'maharaja.thali@staybite.com', phone: '+919860055665', city: 'Mumbai' }
    ];
    const messOwnerUsers = [];
    for (const m of messOwnersData) {
        const user = await User_1.User.create({
            name: m.name,
            email: m.email,
            phone: m.phone,
            passwordHash: defaultPasswordHash,
            role: 'mess_owner',
            isVerified: true,
            referralCode: m.name.substring(0, 4).toUpperCase() + 'MESS',
            walletBalance: 500
        });
        await Profile_1.Profile.create({
            userId: user._id,
            preferredLanguage: 'en',
            currentCity: m.city,
            verificationDocuments: [
                {
                    docType: 'fssai_cert',
                    docUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
                    docNumber: 'FSSAI-11223344556677',
                    status: 'verified',
                    verifiedAt: new Date()
                }
            ]
        });
        messOwnerUsers.push(user);
    }
    // 6. Create 10 Realistic Room Listings
    const roomSeedData = [
        {
            title: 'Shree Residency Luxury PG for Boys',
            description: 'Well-ventilated, newly constructed premium PG with air conditioning, high-speed WiFi, RO water, daily housekeeping, and 24/7 biometric security. Located just 5 minutes walk from VNIT Nagpur gate.',
            ownerId: roomOwnerUsers[0]._id,
            city: 'Nagpur',
            locality: 'Dharampeth',
            address: 'Plot 45, West High Court Road, Near Coffee House, Dharampeth, Nagpur',
            pincode: '440010',
            coordinates: { lat: 21.1415, lng: 79.0687 },
            rent: 5500,
            deposit: 10000,
            maintenanceCharges: 300,
            roomType: 'pg',
            sharingType: '2_sharing',
            genderPreference: 'boys',
            furnishedStatus: 'fully-furnished',
            amenities: ['Wi-Fi', 'AC', 'Attached Bathroom', 'RO Drinking Water', 'Geyser', 'Washing Machine', 'CCTV Security', 'Power Backup', 'Study Table', 'Cupboard'],
            rules: ['No smoking inside premises', 'Gate closes at 10:30 PM', 'Visitors allowed in common lobby only'],
            images: [
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
            ],
            collegeDistances: [{ collegeName: 'VNIT Nagpur', distanceKm: 1.2 }, { collegeName: 'LAD College', distanceKm: 0.8 }],
            workplaceDistances: [{ workplaceName: 'Civil Lines IT Hub', distanceKm: 2.5 }],
            isFeatured: true,
            verifiedBadge: true,
            status: 'approved',
            ratings: { average: 4.8, count: 18 }
        },
        {
            title: 'Sai Comforts PG & Hostel for Girls',
            description: 'Safe and secure girls hostel with CCTV cameras, 24/7 lady warden, biometric entry, study hall, high-speed optic fiber internet, and attached hygienic washrooms. Near Laxmi Nagar Square.',
            ownerId: roomOwnerUsers[2]._id,
            city: 'Nagpur',
            locality: 'Laxmi Nagar',
            address: '12, Bajaj Nagar Extension, Near VNIT Gate No 2, Laxmi Nagar, Nagpur',
            pincode: '440022',
            coordinates: { lat: 21.1278, lng: 79.0652 },
            rent: 6200,
            deposit: 12000,
            maintenanceCharges: 0,
            roomType: 'pg',
            sharingType: '2_sharing',
            genderPreference: 'girls',
            furnishedStatus: 'fully-furnished',
            amenities: ['Wi-Fi', 'Attached Bathroom', 'Lady Warden', 'RO Water', 'Hot Water (Solar + Geyser)', 'Study Table', 'Fridge', 'Power Backup', 'Biometric Entry'],
            rules: ['Curfew 9:30 PM', 'Parent authorization required for night stay-out', 'Zero noise tolerance post 11 PM'],
            images: [
                'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
            ],
            collegeDistances: [{ collegeName: 'VNIT Nagpur', distanceKm: 0.5 }, { collegeName: 'G.H. Raisoni College', distanceKm: 3.5 }],
            workplaceDistances: [{ workplaceName: 'IT Park Gayatri Nagar', distanceKm: 1.8 }],
            isFeatured: true,
            verifiedBadge: true,
            status: 'approved',
            ratings: { average: 4.9, count: 24 }
        },
        {
            title: 'Green View 1BHK Furnished Apartment',
            description: 'Spacious independent 1BHK flat ideal for working professionals or couple in IT Park road. Comes with modular kitchen, double bed with mattress, wardrobe, 32" smart LED TV, and dedicated covered two-wheeler parking.',
            ownerId: roomOwnerUsers[0]._id,
            city: 'Nagpur',
            locality: 'Pratap Nagar',
            address: 'Flat 202, Green View Apartments, Mate Chowk, Pratap Nagar, Nagpur',
            pincode: '440022',
            coordinates: { lat: 21.1205, lng: 79.0558 },
            rent: 11000,
            deposit: 22000,
            maintenanceCharges: 500,
            roomType: '1bhk',
            sharingType: 'private',
            genderPreference: 'all',
            furnishedStatus: 'fully-furnished',
            amenities: ['Wi-Fi', 'AC', 'TV', 'Modular Kitchen', 'Geyser', 'Covered Parking', 'Balcony', 'Lift', 'Security Guard'],
            rules: ['No loud parties after midnight', 'Maintain building cleanliness'],
            images: [
                'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80'
            ],
            collegeDistances: [{ collegeName: 'YCCE Nagpur', distanceKm: 6.0 }],
            workplaceDistances: [{ workplaceName: 'Nagpur IT Park', distanceKm: 1.2 }, { workplaceName: 'Persistent Systems', distanceKm: 1.5 }],
            isFeatured: false,
            verifiedBadge: true,
            status: 'approved',
            ratings: { average: 4.6, count: 9 }
        },
        {
            title: 'Hinjewadi Techie Haven PG (Phase 1)',
            description: 'Modern co-living space designed specifically for IT professionals working in Rajiv Gandhi Infotech Park. Includes 300 Mbps WiFi, gaming zone, fitness gym, daily professional cleaning, and healthy buffet meals.',
            ownerId: roomOwnerUsers[1]._id,
            city: 'Pune',
            locality: 'Hinjewadi Phase 1',
            address: 'Opposite Wipro Circle, Hinjewadi Phase 1, Pune',
            pincode: '411057',
            coordinates: { lat: 18.5913, lng: 73.7389 },
            rent: 9500,
            deposit: 15000,
            maintenanceCharges: 0,
            roomType: 'pg',
            sharingType: '2_sharing',
            genderPreference: 'all',
            furnishedStatus: 'fully-furnished',
            amenities: ['Wi-Fi', 'AC', 'Food Included', 'Gym', 'Gaming Zone', 'Daily Housekeeping', 'Power Backup', 'Work Desk', 'Washing Machine', 'Cafeteria'],
            rules: ['ID verification mandatory', 'Keep common areas clean'],
            images: [
                'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80'
            ],
            collegeDistances: [{ collegeName: 'Symbiosis Infotech Campus', distanceKm: 2.1 }],
            workplaceDistances: [{ workplaceName: 'TCS Hinjewadi', distanceKm: 0.8 }, { workplaceName: 'Infosys Hinjewadi', distanceKm: 1.4 }, { workplaceName: 'Wipro', distanceKm: 0.5 }],
            isFeatured: true,
            verifiedBadge: true,
            status: 'approved',
            ratings: { average: 4.9, count: 42 }
        },
        {
            title: 'Kothrud Scholar Single Private Room',
            description: 'Peaceful private room in a quiet residential colony in Kothrud. Perfect for MIT or COEP students or competitive exam aspirants looking for undisturbed study environment with high-speed internet.',
            ownerId: roomOwnerUsers[3]._id,
            city: 'Pune',
            locality: 'Kothrud',
            address: 'Near Gandhi Bhavan, Near MIT Road, Kothrud, Pune',
            pincode: '411038',
            coordinates: { lat: 18.5074, lng: 73.8077 },
            rent: 7000,
            deposit: 14000,
            maintenanceCharges: 200,
            roomType: 'single',
            sharingType: 'private',
            genderPreference: 'all',
            furnishedStatus: 'semi-furnished',
            amenities: ['Wi-Fi', 'Separate Entrance', 'Geyser', 'Study Desk', 'Ergonomic Chair', 'Balcony', '24/7 Water Supply'],
            rules: ['No late night loud audio', 'Smoking prohibited'],
            images: [
                'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1540518614846-7ede433c4ef2?auto=format&fit=crop&w=1200&q=80'
            ],
            collegeDistances: [{ collegeName: 'MIT WPU Pune', distanceKm: 1.1 }, { collegeName: 'COEP Shivajinagar', distanceKm: 6.2 }],
            workplaceDistances: [{ workplaceName: 'Senapati Bapat Road', distanceKm: 4.5 }],
            isFeatured: true,
            verifiedBadge: true,
            status: 'approved',
            ratings: { average: 4.7, count: 15 }
        },
        {
            title: 'Viman Nagar Executive Double Sharing PG',
            description: 'Upscale PG minutes away from Symbiosis Viman Nagar and Phoenix Marketcity. Comes with attached washroom, smart TV in common lounge, microwave, induction stove, and chilled air conditioning.',
            ownerId: roomOwnerUsers[1]._id,
            city: 'Pune',
            locality: 'Viman Nagar',
            address: 'Row House 4, Clover Park, Viman Nagar, Pune',
            pincode: '411014',
            coordinates: { lat: 18.5679, lng: 73.9143 },
            rent: 8500,
            deposit: 15000,
            maintenanceCharges: 0,
            roomType: 'pg',
            sharingType: '2_sharing',
            genderPreference: 'all',
            furnishedStatus: 'fully-furnished',
            amenities: ['Wi-Fi', 'AC', 'Attached Bathroom', 'Induction', 'Microwave', 'Washing Machine', 'Housekeeping', 'CCTV'],
            rules: ['No smoking', 'Maintain quiet hours post 11:30 PM'],
            images: [
                'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80'
            ],
            collegeDistances: [{ collegeName: 'Symbiosis Viman Nagar', distanceKm: 0.7 }],
            workplaceDistances: [{ workplaceName: 'EON Free Zone Kharadi', distanceKm: 4.2 }, { workplaceName: 'Business Bay', distanceKm: 2.0 }],
            isFeatured: false,
            verifiedBadge: true,
            status: 'approved',
            ratings: { average: 4.8, count: 31 }
        },
        {
            title: 'Andheri East Metro Haven PG for Boys',
            description: 'Convenient PG located 300 meters from Chakala Metro Station. Ideal for working professionals in SEEPZ, MIDC, and BKC commuters. Air-conditioned rooms with high-speed WiFi and locker wardrobes.',
            ownerId: roomOwnerUsers[4]._id,
            city: 'Mumbai',
            locality: 'Andheri East',
            address: 'Near Chakala Metro Station, JB Nagar, Andheri East, Mumbai',
            pincode: '400059',
            coordinates: { lat: 19.1136, lng: 72.8697 },
            rent: 10500,
            deposit: 20000,
            maintenanceCharges: 0,
            roomType: 'pg',
            sharingType: '3_sharing',
            genderPreference: 'boys',
            furnishedStatus: 'fully-furnished',
            amenities: ['Wi-Fi', 'AC', 'Metro Connectivity', 'Locker Cupboard', 'Daily Cleaning', 'RO Water', 'CCTV Security', 'Geyser'],
            rules: ['Metro passes available nearby', 'Visitors allowed during day only'],
            images: [
                'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1502005229762-ee1b2b8ab98f?auto=format&fit=crop&w=1200&q=80'
            ],
            collegeDistances: [{ collegeName: 'Bhavans College Andheri', distanceKm: 3.5 }],
            workplaceDistances: [{ workplaceName: 'SEEPZ Andheri', distanceKm: 1.5 }, { workplaceName: 'MIDC Andheri', distanceKm: 1.0 }],
            isFeatured: true,
            verifiedBadge: true,
            status: 'approved',
            ratings: { average: 4.6, count: 28 }
        },
        {
            title: 'Hitec City IT Professional Studio 1RK',
            description: 'Self-contained 1RK studio room with mini pantry, refrigerator, queen size bed, workspace, and attached balcony overlooking Hyderabad cyber towers skyline.',
            ownerId: roomOwnerUsers[1]._id,
            city: 'Hyderabad',
            locality: 'Hitec City',
            address: 'Near Cyber Towers, Madhapur, Hitec City, Hyderabad',
            pincode: '500081',
            coordinates: { lat: 17.4483, lng: 78.3915 },
            rent: 13000,
            deposit: 25000,
            maintenanceCharges: 600,
            roomType: '1rk',
            sharingType: 'private',
            genderPreference: 'all',
            furnishedStatus: 'fully-furnished',
            amenities: ['Wi-Fi', 'AC', 'Mini Pantry', 'Smart TV', 'Balcony', 'Covered Parking', 'Lift', '24/7 Security'],
            rules: ['Standard tenancy norms apply'],
            images: [
                'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'
            ],
            collegeDistances: [{ collegeName: 'IIIT Hyderabad', distanceKm: 3.2 }],
            workplaceDistances: [{ workplaceName: 'Google Hyderabad', distanceKm: 2.0 }, { workplaceName: 'Microsoft Campus', distanceKm: 3.5 }, { workplaceName: 'Cyber Towers', distanceKm: 0.8 }],
            isFeatured: true,
            verifiedBadge: true,
            status: 'approved',
            ratings: { average: 4.9, count: 19 }
        },
        {
            title: 'Koramangala Premium Coliving Suites',
            description: 'Chic designer coliving building in Koramangala 4th block with rooftop lounge, co-working space, fast wifi, cafe on ground floor, and community events every weekend.',
            ownerId: roomOwnerUsers[3]._id,
            city: 'Bengaluru',
            locality: 'Koramangala',
            address: '4th Block, 80 Feet Road, Koramangala, Bengaluru',
            pincode: '560034',
            coordinates: { lat: 12.9352, lng: 77.6245 },
            rent: 14500,
            deposit: 25000,
            maintenanceCharges: 0,
            roomType: 'pg',
            sharingType: '2_sharing',
            genderPreference: 'all',
            furnishedStatus: 'fully-furnished',
            amenities: ['Wi-Fi', 'AC', 'Rooftop Cafe', 'Coworking Desk', 'Housekeeping', 'Laundry Machine', 'Community Events', 'Gym'],
            rules: ['Respect fellow community members'],
            images: [
                'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80'
            ],
            collegeDistances: [{ collegeName: 'St. Johns Medical College', distanceKm: 1.5 }],
            workplaceDistances: [{ workplaceName: 'Sony World Junction IT Hub', distanceKm: 0.5 }, { workplaceName: 'Embassy GolfLinks', distanceKm: 3.8 }],
            isFeatured: true,
            verifiedBadge: true,
            status: 'approved',
            ratings: { average: 4.8, count: 37 }
        },
        {
            title: 'Ramdaspeth Budget Single Room',
            description: 'Affordable quiet single room in central Nagpur with attached private washroom, separate water meter, ceiling fan, cupboard, and study table. Close to Central Bazar Road and medical colleges.',
            ownerId: roomOwnerUsers[0]._id,
            city: 'Nagpur',
            locality: 'Ramdaspeth',
            address: 'Behind Lokmat Square, Wardha Road, Ramdaspeth, Nagpur',
            pincode: '440012',
            coordinates: { lat: 21.1356, lng: 79.0789 },
            rent: 4800,
            deposit: 9000,
            maintenanceCharges: 150,
            roomType: 'single',
            sharingType: 'private',
            genderPreference: 'all',
            furnishedStatus: 'semi-furnished',
            amenities: ['Wi-Fi', 'Attached Bathroom', '24/7 Water', 'Study Table', 'Cupboard', 'Two Wheeler Parking'],
            rules: ['Keep surroundings clean', 'No loud noise after 10 PM'],
            images: [
                'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
            ],
            collegeDistances: [{ collegeName: 'GMC Nagpur', distanceKm: 1.8 }, { collegeName: 'IGGMC', distanceKm: 3.2 }],
            workplaceDistances: [{ workplaceName: 'Sitabuldi Commercial Zone', distanceKm: 1.5 }],
            isFeatured: false,
            verifiedBadge: true,
            status: 'approved',
            ratings: { average: 4.5, count: 11 }
        }
    ];
    const createdRooms = await RoomListing_1.RoomListing.insertMany(roomSeedData);
    // 7. Create 10 Realistic Mess Listings
    const messSeedData = [
        {
            name: 'Annapurna Pure Veg Maharashtrian Mess & Tiffin',
            description: 'Authentic ghar-jaisa Maharashtrian food prepared with minimal oil and highest hygiene standards. Unlimited chapati/bhakri, 2 seasonal vegetables, dal tadka, steamed rice, sweet (Sunday special Puran Poli / Gulab Jamun), pickle and papad.',
            ownerId: messOwnerUsers[0]._id,
            city: 'Nagpur',
            locality: 'Dharampeth',
            address: 'Opposite LAD College Gate, West High Court Road, Dharampeth, Nagpur',
            pincode: '440010',
            coordinates: { lat: 21.1419, lng: 79.0682 },
            monthlyPrice: 2800,
            dailyPrice: 110,
            mealType: 'veg',
            mealsProvided: { breakfast: true, lunch: true, dinner: true },
            weeklyMenu: [
                { day: 'Monday', breakfast: 'Poha + Tea', lunch: 'Paneer Butter Masala, Matar Sabzi, Dal Tadka, Rice, 4 Chapatis', dinner: 'Shev Bhaji, Dal Fry, Rice, 4 Chapatis' },
                { day: 'Tuesday', breakfast: 'Upma + Chutney', lunch: 'Aloo Gobi, Chana Masala, Varann-Bhaat, 4 Chapatis', dinner: 'Baingan Bharta, Dal, Rice, 4 Chapatis' },
                { day: 'Wednesday', breakfast: 'Idli Sambar', lunch: 'Chole Masala, Bhindi Fry, Dal, Jeera Rice, Chapatis', dinner: 'Mix Veg, Dal Tadka, Rice, Chapatis' },
                { day: 'Thursday', breakfast: 'Misal Pav', lunch: 'Palak Paneer, Aloo Jeera, Dal, Rice, Chapatis', dinner: 'Kadhi Pakoda, Khichdi, Papad, 4 Chapatis' },
                { day: 'Friday', breakfast: 'Aloo Paratha + Dahi', lunch: 'Dal Makhani, Gobi Masala, Rice, Chapatis', dinner: 'Soyabean Curry, Dal, Rice, Chapatis' },
                { day: 'Saturday', breakfast: 'Sheera / Sabudana Khichdi', lunch: 'Rajma Masala, Aloo Shimla Mirch, Jeera Rice, Chapatis', dinner: 'Dal Fry, Jeera Rice, Bhaji, Chapatis' },
                { day: 'Sunday', breakfast: 'Poori Bhaji', lunch: 'Special Puran Poli / Gulab Jamun, Shahi Paneer, Pulav, Dal, Kurdai Papad', dinner: 'Veg Biryani, Raita, Dal Tadka' }
            ],
            timings: { breakfastTime: '07:30 AM - 09:30 AM', lunchTime: '12:00 PM - 03:00 PM', dinnerTime: '07:30 PM - 10:30 PM' },
            tiffinService: true,
            homeDelivery: true,
            deliveryRadiusKm: 5,
            fssaiLicenseNumber: '11520054000123',
            facilities: ['Air Cooled Dining Hall', 'Stainless Steel Utensils', 'Doorstep Tiffin Delivery', 'Pure RO Water', 'Unlimited Rice & Dal'],
            rules: ['Please inform 3 hours prior for cancellation of daily meal', 'Monthly subscription non-refundable once started'],
            images: [
                'https://images.unsplash.com/photo-1613292443284-c73fe1674488?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80'
            ],
            isFeatured: true,
            verifiedBadge: true,
            status: 'approved',
            ratings: { average: 4.9, count: 48 }
        },
        {
            name: 'Sai Sagar Pure Veg & Jain Dining Hall',
            description: 'Specialized Satvik and Jain meal service for Pune students and tech professionals. Strict onion-garlic free options prepared in a dedicated clean kitchen zone. Fresh hot fulkas made on tawa right in front of you.',
            ownerId: messOwnerUsers[1]._id,
            city: 'Pune',
            locality: 'Kothrud',
            address: 'Near Karve Statue, Karve Road, Kothrud, Pune',
            pincode: '411038',
            coordinates: { lat: 18.5034, lng: 73.8152 },
            monthlyPrice: 3200,
            dailyPrice: 125,
            mealType: 'jain',
            mealsProvided: { breakfast: true, lunch: true, dinner: true },
            weeklyMenu: [
                { day: 'Monday', breakfast: 'Kanda-free Poha + Tea', lunch: 'Paneer Bhurji (Jain), Moong Dal, 4 Fulkas, Steamed Basmati Rice', dinner: 'Lauki Kofta, Dal, Rice, Fulkas' },
                { day: 'Wednesday', breakfast: 'Sada Dosa + Coconut Chutney', lunch: 'Chole (Jain style), Bhindi, Varann-Bhaat, Ghee, Fulkas', dinner: 'Matar Paneer, Dal, Rice, Fulkas' },
                { day: 'Sunday', breakfast: 'Fafda Jalebi & Kadhi', lunch: 'Special Jain Thali with Shrikhand, Dal Baati Churma, Paneer', dinner: 'Khichdi Kadi, Papad' }
            ],
            timings: { breakfastTime: '08:00 AM - 10:00 AM', lunchTime: '12:15 PM - 03:30 PM', dinnerTime: '07:15 PM - 10:00 PM' },
            tiffinService: true,
            homeDelivery: true,
            deliveryRadiusKm: 4,
            fssaiLicenseNumber: '11519034000456',
            facilities: ['Separate Jain Kitchen', 'Unlimited Salad & Buttermilk', 'AC Dining Space', 'Tiffin Box System'],
            rules: ['Cleanliness must be maintained inside dining hall'],
            images: [
                'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80'
            ],
            isFeatured: true,
            verifiedBadge: true,
            status: 'approved',
            ratings: { average: 4.8, count: 36 }
        },
        {
            name: 'Saoji & Varadi Non-Veg / Veg Food Club',
            description: 'Famous spicy Saoji style Chicken, Mutton, Egg Curry, and Paneer Saoji for spicy food enthusiasts. Includes Jowar Roti / Chapati, spicy rassa, fragrant rice, and soothing taak (chaas).',
            ownerId: messOwnerUsers[2]._id,
            city: 'Nagpur',
            locality: 'Laxmi Nagar',
            address: 'Near VNIT Sub Post Office, Laxmi Nagar, Nagpur',
            pincode: '440022',
            coordinates: { lat: 21.1285, lng: 79.0645 },
            monthlyPrice: 3600,
            dailyPrice: 150,
            mealType: 'both',
            mealsProvided: { breakfast: false, lunch: true, dinner: true },
            weeklyMenu: [
                { day: 'Tuesday', lunch: 'Egg Curry, Jeera Rice, 4 Chapatis', dinner: 'Veg Saoji Masala, Dal, Rice, Chapatis' },
                { day: 'Wednesday', lunch: 'Nagpuri Saoji Chicken Thali, Jowar Bhakri, Rassa, Rice', dinner: 'Paneer Saoji, Dal Fry, Rice' },
                { day: 'Friday', lunch: 'Fish Curry, Steamed Rice, Chapatis', dinner: 'Egg Bhurji, Dal Tadka, Rice' },
                { day: 'Sunday', lunch: 'Special Saoji Mutton / Chicken Biryani, Raita, Sweet', dinner: 'Light Khichdi, Papad' }
            ],
            timings: { lunchTime: '12:30 PM - 03:30 PM', dinnerTime: '07:30 PM - 11:00 PM' },
            tiffinService: true,
            homeDelivery: true,
            deliveryRadiusKm: 6,
            fssaiLicenseNumber: '11521045000789',
            facilities: ['Non-Veg 4 days a week', 'Authentic Saoji Masalas', 'Home Delivery Available'],
            rules: ['Non-veg thalis on designated days'],
            images: [
                'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1613292443284-c73fe1674488?auto=format&fit=crop&w=1200&q=80'
            ],
            isFeatured: true,
            verifiedBadge: true,
            status: 'approved',
            ratings: { average: 4.9, count: 52 }
        },
        {
            name: 'Ghar Jaisa Homely Tiffin & Dining Hub',
            description: 'Specially crafted for Hinjewadi and Wakad techies who miss Mom\'s cooking. 100% homely food with low spices, pure sunflower oil, fresh vegetables bought daily, and warm chapatis packed in thermal foil.',
            ownerId: messOwnerUsers[3]._id,
            city: 'Pune',
            locality: 'Hinjewadi Phase 1',
            address: 'Near Mezza 9, Hinjewadi Phase 1, Pune',
            pincode: '411057',
            coordinates: { lat: 18.5925, lng: 73.7410 },
            monthlyPrice: 3400,
            dailyPrice: 130,
            mealType: 'both',
            mealsProvided: { breakfast: true, lunch: true, dinner: true },
            weeklyMenu: [
                { day: 'Monday', lunch: 'Aloo Methi, Yellow Dal, 4 Chapatis, Steamed Rice', dinner: 'Sev Tamatar, Dal, Rice' },
                { day: 'Wednesday', lunch: 'Egg Curry / Paneer Lababdar, Rice, Chapatis', dinner: 'Mix Dal Khichdi, Ghee, Papad' },
                { day: 'Sunday', lunch: 'Special Butter Chicken / Shahi Paneer, Jeera Rice, Gulab Jamun', dinner: 'Dal Tadka, Rice' }
            ],
            timings: { breakfastTime: '07:45 AM - 09:45 AM', lunchTime: '12:15 PM - 03:00 PM', dinnerTime: '07:30 PM - 10:15 PM' },
            tiffinService: true,
            homeDelivery: true,
            deliveryRadiusKm: 6,
            fssaiLicenseNumber: '11520033000888',
            facilities: ['Daily Office Delivery to Tech Parks', 'Customizable Spice Level', 'Eco-friendly Tiffins'],
            rules: ['Delivery orders cut-off: 10:30 AM for lunch'],
            images: [
                'https://images.unsplash.com/photo-1613292443284-c73fe1674488?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80'
            ],
            isFeatured: false,
            verifiedBadge: true,
            status: 'approved',
            ratings: { average: 4.7, count: 27 }
        },
        {
            name: 'Maharaja Rajasthani & Gujarati Thali',
            description: 'Royal unlimited Gujarati and Rajasthani thali featuring Dal Baati Churma, Gatte ki Sabzi, Kadhi, Phulkas, Rotla, multiple chutneys, and authentic sweets like Moong Dal Halwa.',
            ownerId: messOwnerUsers[4]._id,
            city: 'Mumbai',
            locality: 'Andheri East',
            address: 'Near Western Express Highway, Andheri East, Mumbai',
            pincode: '400069',
            coordinates: { lat: 19.1158, lng: 72.8592 },
            monthlyPrice: 4200,
            dailyPrice: 170,
            mealType: 'veg',
            mealsProvided: { breakfast: true, lunch: true, dinner: true },
            weeklyMenu: [
                { day: 'Monday', lunch: 'Sev Tameta, Gujarati Dal, 4 Phulkas, Rice, Chaas', dinner: 'Ringan No Oro, Bajri Rotla, Gud Ghee' },
                { day: 'Wednesday', lunch: 'Gatte ki Sabzi, Rajasthani Kadi, Rice, Phulkas', dinner: 'Pithla Bhakri, Thecha, Dal, Rice' },
                { day: 'Sunday', lunch: 'Unlimited Dal Baati Churma, Paneer Makhani, Moong Halwa, Buttermilk', dinner: 'Vaghareli Khichdi & Kadhi' }
            ],
            timings: { breakfastTime: '08:00 AM - 10:30 AM', lunchTime: '12:00 PM - 03:45 PM', dinnerTime: '07:00 PM - 11:00 PM' },
            tiffinService: true,
            homeDelivery: true,
            deliveryRadiusKm: 5,
            fssaiLicenseNumber: '11518012000999',
            facilities: ['Unlimited Thali Dining', 'Authentic Desi Ghee Prep', 'AC Hall', 'Takeaway Packing'],
            rules: ['No food wastage'],
            images: [
                'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80'
            ],
            isFeatured: true,
            verifiedBadge: true,
            status: 'approved',
            ratings: { average: 4.8, count: 64 }
        },
        {
            name: 'South Kitchen Tiffin & Meals Express',
            description: 'Authentic Andhra & Tamil Nadu style vegetarian and non-vegetarian meals served on banana leaf. Includes Sambar, Rasam, Gongura pickle, Chicken Chettinad, Poriyal, Appalam, and fragrant curd rice.',
            ownerId: messOwnerUsers[1]._id,
            city: 'Hyderabad',
            locality: 'Hitec City',
            address: 'Opposite Inorbit Mall, Madhapur, Hitec City, Hyderabad',
            pincode: '500081',
            coordinates: { lat: 17.4375, lng: 78.3882 },
            monthlyPrice: 3500,
            dailyPrice: 135,
            mealType: 'both',
            mealsProvided: { breakfast: true, lunch: true, dinner: true },
            weeklyMenu: [
                { day: 'Monday', breakfast: 'Ghee Podi Idli', lunch: 'Andhra Veg Meals with Pappu, Sambar, Rasam, Rice', dinner: 'Dosa & Uthappam Varieties' },
                { day: 'Wednesday', breakfast: 'Medu Vada + Sambar', lunch: 'Chettinad Chicken Meals, Egg Masala, Rice', dinner: 'Chicken Biryani / Veg Pulao' }
            ],
            timings: { breakfastTime: '07:00 AM - 10:30 AM', lunchTime: '12:00 PM - 03:30 PM', dinnerTime: '07:00 PM - 10:45 PM' },
            tiffinService: true,
            homeDelivery: true,
            deliveryRadiusKm: 7,
            fssaiLicenseNumber: '11520023000777',
            facilities: ['Banana Leaf Meals', 'South Indian Filter Coffee', 'Fast Doorstep Delivery'],
            rules: ['Prompt delivery across Hitec City'],
            images: [
                'https://images.unsplash.com/photo-1613292443284-c73fe1674488?auto=format&fit=crop&w=1200&q=80'
            ],
            isFeatured: true,
            verifiedBadge: true,
            status: 'approved',
            ratings: { average: 4.8, count: 41 }
        },
        {
            name: 'Namma Bengaluru Student & Corporate Mess',
            description: 'Balanced South + North Indian fusion meals with unlimited Rice, Roti, 2 curries, Dal, Rasam, curd, and dessert on weekends. Located near Sony World junction.',
            ownerId: messOwnerUsers[3]._id,
            city: 'Bengaluru',
            locality: 'Koramangala',
            address: '5th Block, 1st Cross, Koramangala, Bengaluru',
            pincode: '560095',
            coordinates: { lat: 12.9345, lng: 77.6210 },
            monthlyPrice: 3800,
            dailyPrice: 140,
            mealType: 'veg',
            mealsProvided: { breakfast: true, lunch: true, dinner: true },
            weeklyMenu: [
                { day: 'Monday', lunch: 'Paneer Butter Masala, Sambar, 3 Phulkas, Rice, Curd', dinner: 'Veg Pulao, Kadhi, Papad' },
                { day: 'Sunday', lunch: 'Bisibelebath, Shahi Paneer, Naan, Gulab Jamun, Ice Cream', dinner: 'Dal Khichdi' }
            ],
            timings: { breakfastTime: '07:30 AM - 10:00 AM', lunchTime: '12:30 PM - 03:30 PM', dinnerTime: '07:30 PM - 10:30 PM' },
            tiffinService: true,
            homeDelivery: true,
            deliveryRadiusKm: 4,
            fssaiLicenseNumber: '11521011000555',
            facilities: ['High Speed WiFi in Dining Area', 'Clean Water Dispenser', 'Digital Meal Card'],
            rules: ['Subscription card scan at entrance'],
            images: [
                'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80'
            ],
            isFeatured: false,
            verifiedBadge: true,
            status: 'approved',
            ratings: { average: 4.7, count: 29 }
        },
        {
            name: 'Punekar Classic Tiffin Service',
            description: 'Traditional Puneri style food: Patal Bhaji, Usal, Varan, Polya, Koshimbir, and Taak. Loved by Fergusson, SPPU, and BMCC college students.',
            ownerId: messOwnerUsers[1]._id,
            city: 'Pune',
            locality: 'Shivajinagar',
            address: 'Near FC Road, Shivajinagar, Pune',
            pincode: '411005',
            coordinates: { lat: 18.5284, lng: 73.8419 },
            monthlyPrice: 2900,
            dailyPrice: 115,
            mealType: 'veg',
            mealsProvided: { breakfast: false, lunch: true, dinner: true },
            weeklyMenu: [
                { day: 'Monday', lunch: 'Matki Usal, Varan-Bhat, 4 Polya, Taak', dinner: 'Shev Bhaji, Dal, Rice, Polya' },
                { day: 'Friday', lunch: 'Chawli Masala, Koshimbir, Varan-Bhat, Polya', dinner: 'Khichdi Kadi, Papad' }
            ],
            timings: { lunchTime: '12:00 PM - 03:00 PM', dinnerTime: '07:30 PM - 10:00 PM' },
            tiffinService: true,
            homeDelivery: true,
            deliveryRadiusKm: 4,
            fssaiLicenseNumber: '11519022000333',
            facilities: ['Authentic Puneri Flavor', 'Stainless Steel Tiffin Setups', 'Budget Friendly'],
            rules: ['Advance notice for off days'],
            images: [
                'https://images.unsplash.com/photo-1613292443284-c73fe1674488?auto=format&fit=crop&w=1200&q=80'
            ],
            isFeatured: true,
            verifiedBadge: true,
            status: 'approved',
            ratings: { average: 4.6, count: 23 }
        },
        {
            name: 'Swad Desi Kitchen & North Indian Thali',
            description: 'North Indian delicacies including Rajma Chawal, Chole Bhature, Dal Makhani, Sarson Ka Saag (winter special), and soft butter rotis.',
            ownerId: messOwnerUsers[2]._id,
            city: 'Nagpur',
            locality: 'Pratap Nagar',
            address: 'Near Khamla Square, Pratap Nagar, Nagpur',
            pincode: '440022',
            coordinates: { lat: 21.1189, lng: 79.0601 },
            monthlyPrice: 3000,
            dailyPrice: 120,
            mealType: 'veg',
            mealsProvided: { breakfast: true, lunch: true, dinner: true },
            weeklyMenu: [
                { day: 'Monday', lunch: 'Punjabi Rajma, Jeera Rice, 4 Rotis, Salad', dinner: 'Paneer Bhurji, Dal, Rice' },
                { day: 'Sunday', lunch: 'Chole Bhature Special, Lassi, Gulab Jamun', dinner: 'Dal Tadka, Rice' }
            ],
            timings: { breakfastTime: '08:00 AM - 10:00 AM', lunchTime: '12:30 PM - 03:30 PM', dinnerTime: '07:30 PM - 10:30 PM' },
            tiffinService: true,
            homeDelivery: true,
            deliveryRadiusKm: 5,
            fssaiLicenseNumber: '11520044000222',
            facilities: ['North Indian Homely Chefs', 'Fresh Hot Rotis', 'Doorstep Tiffin'],
            rules: ['Clean dining environment'],
            images: [
                'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80'
            ],
            isFeatured: false,
            verifiedBadge: true,
            status: 'approved',
            ratings: { average: 4.7, count: 19 }
        },
        {
            name: 'Mumbai Dabbawala Express Tiffin',
            description: 'Reliable hot lunch tiffin delivered right to your office desk or college campus across Andheri and BKC.',
            ownerId: messOwnerUsers[4]._id,
            city: 'Mumbai',
            locality: 'Andheri East',
            address: 'Marol Naka, Andheri East, Mumbai',
            pincode: '400059',
            coordinates: { lat: 19.1120, lng: 72.8780 },
            monthlyPrice: 3900,
            dailyPrice: 160,
            mealType: 'both',
            mealsProvided: { breakfast: false, lunch: true, dinner: true },
            weeklyMenu: [
                { day: 'Monday', lunch: 'Paneer Makhani, Dal Tadka, 4 Chapatis, Jeera Rice', dinner: 'Bhindi Masala, Dal, Rice' },
                { day: 'Friday', lunch: 'Egg Curry / Veg Kolhapuri, Rice, Chapatis', dinner: 'Moong Dal Khichdi, Papad' }
            ],
            timings: { lunchTime: '12:00 PM - 02:30 PM', dinnerTime: '07:30 PM - 10:00 PM' },
            tiffinService: true,
            homeDelivery: true,
            deliveryRadiusKm: 8,
            fssaiLicenseNumber: '11519011000111',
            facilities: ['Guaranteed On-time Delivery', 'Insulated Stainless Steel Dabbas', 'Zero Spill Packaging'],
            rules: ['Tiffin box to be returned next morning'],
            images: [
                'https://images.unsplash.com/photo-1613292443284-c73fe1674488?auto=format&fit=crop&w=1200&q=80'
            ],
            isFeatured: false,
            verifiedBadge: true,
            status: 'approved',
            ratings: { average: 4.8, count: 35 }
        }
    ];
    const createdMesses = await MessListing_1.MessListing.insertMany(messSeedData);
    // 8. Create Realistic Reviews
    await Review_1.Review.create([
        {
            userId: studentUsers[0]._id,
            listingType: 'room',
            listingId: createdRooms[0]._id,
            rating: 5,
            cleanlinessRating: 5,
            foodQualityOrMaintenanceRating: 5,
            valueForMoneyRating: 5,
            title: 'Best PG near VNIT Nagpur!',
            comment: 'Staying here for the last 6 months. High speed wifi is truly 100+ mbps which helps during college submissions. Ramesh sir (owner) is very supportive and quick to resolve any minor issues.',
            pros: ['Fast WiFi', 'Close to VNIT gate', 'Clean bathrooms', 'Quiet study atmosphere'],
            cons: ['Slightly strict entry time at 10:30 PM'],
            status: 'approved',
            helpfulVotes: 8,
            ownerReply: {
                comment: 'Thank you Aarav! We strive to make your academic stay comfortable and productive.',
                repliedAt: new Date()
            }
        },
        {
            userId: studentUsers[1]._id,
            listingType: 'mess',
            listingId: createdMesses[0]._id,
            rating: 5,
            cleanlinessRating: 5,
            foodQualityOrMaintenanceRating: 5,
            valueForMoneyRating: 5,
            title: 'Tastes exactly like home food! Mangala Tai is amazing.',
            comment: 'The puran poli on Sunday is worth every rupee. Chapatis are always hot and thin. Best mess in Dharampeth area.',
            pros: ['Homely taste', 'Low oil', 'Hot chapatis', 'Clean kitchen'],
            cons: ['Can get crowded between 1:00 PM and 1:45 PM'],
            status: 'approved',
            helpfulVotes: 12
        },
        {
            userId: employedUsers[0]._id,
            listingType: 'room',
            listingId: createdRooms[3]._id,
            rating: 5,
            title: 'Ideal PG for Hinjewadi techies',
            comment: 'Walking distance to TCS and Wipro. Saves daily commute hassle and the gaming room is awesome on weekends.',
            pros: ['Walking distance to IT Park', 'Gym inside building', 'Great crowd'],
            cons: ['Rent is on premium side'],
            status: 'approved',
            helpfulVotes: 5
        }
    ]);
    // 9. Create Promotional Coupons
    await Coupon_1.Coupon.create([
        {
            code: 'STAYBITE50',
            description: 'Get 50% discount on Seeker or Owner Pro monthly subscriptions',
            discountType: 'percentage',
            discountValue: 50,
            maxDiscountAmount: 150,
            minOrderAmount: 99,
            validTo: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            usageLimit: 500,
            isActive: true,
            applicableFor: ['subscription']
        },
        {
            code: 'STUDENT500',
            description: 'Flat ₹500 off on Digital Rental Agreement generation',
            discountType: 'flat',
            discountValue: 200,
            minOrderAmount: 200,
            validTo: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
            usageLimit: 200,
            isActive: true,
            applicableFor: ['agreement_service', 'all']
        },
        {
            code: 'FESTIVAL100',
            description: 'Diwali & Monsoon Special ₹100 Off on Featured Listing promotion',
            discountType: 'flat',
            discountValue: 100,
            minOrderAmount: 199,
            validTo: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
            usageLimit: 300,
            isActive: true,
            applicableFor: ['featured_listing', 'all']
        }
    ]);
    // 10. Create Sample Enquiry, Deal & Agreement
    const sampleEnquiry = await Enquiry_1.Enquiry.create({
        senderId: studentUsers[0]._id,
        recipientId: roomOwnerUsers[0]._id,
        listingType: 'room',
        listingId: createdRooms[0]._id,
        message: 'Hello, I am a 2nd year student at VNIT. I want to check availability for 2 sharing room starting from next Monday. Can I visit tomorrow evening?',
        phone: studentUsers[0].phone,
        email: studentUsers[0].email,
        preferredMoveInDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        budgetOffered: 5500,
        status: 'visit_scheduled',
        visitDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        visitNotes: 'Visit scheduled at 5:30 PM. Owner will be present at property.'
    });
    const sampleDeal = await Deal_1.Deal.create({
        dealCode: 'SB-DEAL-849201',
        enquiryId: sampleEnquiry._id,
        userId: studentUsers[0]._id,
        ownerId: roomOwnerUsers[0]._id,
        listingType: 'room',
        listingId: createdRooms[0]._id,
        agreedPrice: 5500,
        agreedDeposit: 10000,
        maintenanceCharges: 300,
        startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        durationMonths: 11,
        needsAgreement: true,
        status: 'agreement_completed'
    });
    const sampleAgreement = await Agreement_1.Agreement.create({
        agreementNumber: 'SBA-849201-9921',
        dealId: sampleDeal._id,
        listingType: 'room',
        listingId: createdRooms[0]._id,
        tenant: {
            userId: studentUsers[0]._id,
            fullName: studentUsers[0].name,
            phone: studentUsers[0].phone,
            email: studentUsers[0].email,
            permanentAddress: 'House 14, Near IT Park Square, Nagpur',
            idProofType: 'Aadhaar',
            idProofNumber: '8920-1192-3344',
            signature: studentUsers[0].name,
            signedAt: new Date()
        },
        owner: {
            userId: roomOwnerUsers[0]._id,
            fullName: roomOwnerUsers[0].name,
            phone: roomOwnerUsers[0].phone,
            email: roomOwnerUsers[0].email,
            permanentAddress: 'Plot 45, West High Court Road, Dharampeth, Nagpur',
            idProofType: 'PAN/Aadhaar',
            idProofNumber: 'AAAPA9910K',
            signature: roomOwnerUsers[0].name,
            signedAt: new Date()
        },
        propertyDetails: {
            propertyTitle: createdRooms[0].title,
            fullAddress: createdRooms[0].address,
            city: 'Nagpur',
            pincode: '440010',
            monthlyRent: 5500,
            securityDeposit: 10000,
            maintenanceCharges: 300,
            electricityTerms: 'As per sub-meter reading @ ₹9/unit',
            waterTerms: 'Included in rent',
            lockInPeriodMonths: 1,
            noticePeriodDays: 30,
            leaseStartDate: new Date(),
            leaseEndDate: new Date(Date.now() + 330 * 24 * 60 * 60 * 1000)
        },
        termsAndConditions: [
            'The Tenant agrees to pay the monthly rent on or before the 5th day of every calendar month.',
            'The Security Deposit of ₹10,000 shall be refundable at the time of vacating the premises.',
            'Electricity shall be calculated monthly based on sub-meter reading.',
            'Both parties agree to a 30-day notice period before vacating premises.',
            'Premises shall be used exclusively for residential purposes.'
        ],
        status: 'completed',
        legalDisclaimerAcknowledged: true,
        stampDutyNoticeAcknowledged: true
    });
    sampleDeal.agreementId = sampleAgreement._id;
    await sampleDeal.save();
    // 11. Create Sample Notifications
    await Notification_1.Notification.create([
        {
            userId: studentUsers[0]._id,
            title: '🎉 Digital Rental Agreement Finalized!',
            body: `Your agreement #${sampleAgreement.agreementNumber} for Shree Residency PG has been signed by both parties.`,
            type: 'agreement_signed',
            link: `/agreements/${sampleAgreement._id}`
        },
        {
            userId: roomOwnerUsers[0]._id,
            title: 'New Lead / Enquiry for Shree Residency PG',
            body: 'Aarav Sharma has requested a property visit for tomorrow evening.',
            type: 'enquiry_received',
            link: `/owner/leads`
        }
    ]);
    console.log('✅ StayBite Database seeded successfully with realistic Indian marketplace data!');
};
exports.seedDatabaseIfEmpty = seedDatabaseIfEmpty;
//# sourceMappingURL=seed.js.map