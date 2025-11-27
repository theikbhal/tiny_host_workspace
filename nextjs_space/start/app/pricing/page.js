import PricingCard from '@/components/PricingCard';

export default function PricingPage() {
    const pricingPlans = [
        {
            plan: 'Free',
            description: 'Perfect for a single, professional link',
            price: 0,
            billedYearly: 0,
            colorScheme: 'blue',
            features: [
                { icon: '💻', text: '1 active project' },
                { icon: '☁️', text: '25 MB upload limit/project' },
                { icon: '📊', text: '10,000 visits /mo' },
                { icon: '🔒', text: 'SSL certificate' },
                { icon: '⚡', text: 'Fast CDN delivery' },
                { icon: '🌐', text: 'Custom subdomain' }
            ]
        },
        {
            plan: 'Solo',
            description: 'Great for individuals & small projects',
            price: 550,
            billedYearly: 6600,
            colorScheme: 'purple',
            highlighted: true,
            features: [
                { icon: '💻', text: '5 active projects' },
                { icon: '☁️', text: '75 MB upload limit/project' },
                { icon: '📊', text: '100,000 visits /mo' },
                { icon: '🔒', text: 'SSL certificate' },
                { icon: '⚡', text: 'Fast CDN delivery' },
                { icon: '🌐', text: 'Custom domain support' },
                { icon: '🎨', text: 'Remove tiiny.host branding' },
                { icon: '📧', text: 'Priority email support' }
            ]
        },
        {
            plan: 'Pro',
            description: 'For freelancers, agencies & companies',
            price: 1300,
            billedYearly: 15600,
            colorScheme: 'gold',
            features: [
                { icon: '💻', text: '15 active projects' },
                { icon: '☁️', text: '10 GB upload limit/project' },
                { icon: '📊', text: '500,000 visits /mo' },
                { icon: '🔒', text: 'SSL certificate' },
                { icon: '⚡', text: 'Fast CDN delivery' },
                { icon: '🌐', text: 'Custom domain support' },
                { icon: '🎨', text: 'Remove tiiny.host branding' },
                { icon: '📧', text: 'Priority email support' },
                { icon: '📈', text: 'Advanced analytics' },
                { icon: '🔐', text: 'Password protection' },
                { icon: '👥', text: 'Team collaboration' }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            {/* Header Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Choose the perfect plan for your needs. All plans include our core features with a 7-day money-back guarantee.
                    </p>
                    <div className="mt-6 flex items-center justify-center gap-2">
                        <span className="text-sm text-gray-500">Questions?</span>
                        <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium underline">
                            Chat with us
                        </a>
                    </div>
                </div>

                {/* Pricing Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {pricingPlans.map((plan, index) => (
                        <PricingCard
                            key={index}
                            plan={plan.plan}
                            description={plan.description}
                            price={plan.price}
                            billedYearly={plan.billedYearly}
                            features={plan.features}
                            colorScheme={plan.colorScheme}
                            highlighted={plan.highlighted}
                        />
                    ))}
                </div>

                {/* FAQ Section */}
                <div className="mt-20 max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
                        Frequently Asked Questions
                    </h2>
                    <div className="grid gap-6">
                        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                            <h3 className="font-semibold text-lg mb-2 text-gray-800">
                                Can I upgrade or downgrade my plan?
                            </h3>
                            <p className="text-gray-600">
                                Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                            <h3 className="font-semibold text-lg mb-2 text-gray-800">
                                What payment methods do you accept?
                            </h3>
                            <p className="text-gray-600">
                                We accept all major credit cards, debit cards, and UPI payments for your convenience.
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                            <h3 className="font-semibold text-lg mb-2 text-gray-800">
                                Is there a free trial?
                            </h3>
                            <p className="text-gray-600">
                                Our Free plan is available forever with no credit card required. For paid plans, we offer a 7-day money-back guarantee.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
