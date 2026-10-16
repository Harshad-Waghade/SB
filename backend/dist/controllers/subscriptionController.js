"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribePlan = exports.getMySubscription = exports.getSubscriptionPlans = void 0;
const Subscription_1 = require("../models/Subscription");
const SystemConfig_1 = require("../models/SystemConfig");
const getSubscriptionPlans = async (_req, res) => {
    try {
        const config = await SystemConfig_1.SystemConfig.findOne({ configKey: 'global_config' });
        const defaultUserPlans = [
            {
                id: 'free',
                name: 'Free Seeker',
                price: 0,
                billingCycle: 'Forever Free',
                badge: 'Basic',
                features: [
                    'Browse all verified rooms & messes',
                    'Basic search filters',
                    'Up to 3 free inquiries/month',
                    'Save up to 5 favorites',
                    'Community support'
                ]
            },
            {
                id: 'user_premium',
                name: 'Seeker Premium',
                price: 99,
                billingCycle: 'per month',
                badge: 'Most Popular',
                isPopular: true,
                features: [
                    'Unlimited enquiries & owner contacts',
                    'Advanced multi-parameter filters',
                    'Direct WhatsApp & Instant Call',
                    'Priority recommendations near your college/office',
                    'Unlimited saved favorites',
                    'Zero platform booking convenience fee'
                ]
            },
            {
                id: 'user_premium_plus',
                name: 'Premium Plus',
                price: 199,
                billingCycle: 'per month',
                badge: 'VIP Assistance',
                features: [
                    'All Seeker Premium features',
                    'Dedicated StayBite Deal Assistant',
                    'Digital Rental Agreement generation included (₹299 value)',
                    'Physical verified visit assistance',
                    '24/7 Priority VIP hotline'
                ]
            }
        ];
        const defaultOwnerPlans = [
            {
                id: 'owner_free',
                name: 'Starter Owner',
                price: 0,
                billingCycle: 'Forever Free',
                badge: 'Starter',
                features: [
                    '1 Active Property / Mess listing',
                    'Standard search visibility',
                    'Standard lead notifications',
                    'Basic enquiry inbox'
                ]
            },
            {
                id: 'owner_pro',
                name: 'Owner Pro',
                price: 299,
                billingCycle: 'per month',
                badge: 'High Demand',
                isPopular: true,
                features: [
                    'Up to 10 Active Room / Mess listings',
                    '3x Higher search ranking & visibility',
                    'Direct tenant phone numbers & verified leads',
                    'Detailed listing analytics & performance insights',
                    'StayBite Verified Badge on all properties'
                ]
            },
            {
                id: 'owner_business',
                name: 'Owner Business / Chain',
                price: 599,
                billingCycle: 'per month',
                badge: 'Enterprise',
                features: [
                    'Unlimited Room & Mess listings',
                    'Top Featured placement on Home & Category pages',
                    'Unlimited leads + automated WhatsApp notifications',
                    'Free Digital Agreements for all tenants',
                    'Dedicated Account Manager'
                ]
            }
        ];
        res.json({
            success: true,
            userPlans: defaultUserPlans,
            ownerPlans: defaultOwnerPlans,
            featuredPricing: config?.featuredPricing || { sevenDays: 199, fifteenDays: 349, thirtyDays: 599 }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getSubscriptionPlans = getSubscriptionPlans;
const getMySubscription = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const subscription = await Subscription_1.Subscription.findOne({
            userId: req.user._id,
            status: 'active',
            endDate: { $gte: new Date() }
        }).sort({ createdAt: -1 });
        res.json({
            success: true,
            data: subscription || {
                planId: req.user.role === 'room_owner' || req.user.role === 'mess_owner' ? 'owner_free' : 'free',
                status: 'active',
                role: req.user.role,
                price: 0
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getMySubscription = getMySubscription;
const subscribePlan = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const { planId, paymentId } = req.body;
        if (!planId) {
            res.status(400).json({ success: false, message: 'Plan ID is required.' });
            return;
        }
        const planPrices = {
            free: 0,
            user_premium: 99,
            user_premium_plus: 199,
            owner_free: 0,
            owner_pro: 299,
            owner_business: 599
        };
        const price = planPrices[planId] || 0;
        const isOwner = req.user.role === 'room_owner' || req.user.role === 'mess_owner';
        // Expire any existing active subscription
        await Subscription_1.Subscription.updateMany({ userId: req.user._id, status: 'active' }, { $set: { status: 'expired' } });
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);
        const newSub = await Subscription_1.Subscription.create({
            userId: req.user._id,
            planId: planId,
            role: isOwner ? 'owner' : 'user',
            price,
            durationDays: 30,
            startDate,
            endDate,
            status: 'active',
            paymentId: paymentId || undefined
        });
        res.status(201).json({
            success: true,
            message: `Subscribed to ${planId.replace(/_/g, ' ').toUpperCase()} successfully!`,
            data: newSub
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.subscribePlan = subscribePlan;
//# sourceMappingURL=subscriptionController.js.map