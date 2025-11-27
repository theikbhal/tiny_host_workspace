'use client';

export default function PricingCard({
    plan,
    description,
    price,
    billedYearly,
    features,
    colorScheme,
    highlighted = false
}) {
    const colorClasses = {
        blue: {
            gradient: 'from-blue-50 to-blue-100',
            border: 'border-blue-200',
            titleColor: 'text-blue-600',
            priceColor: 'text-blue-600',
            button: 'bg-blue-600 hover:bg-blue-700 text-white',
            icon: 'text-blue-600'
        },
        purple: {
            gradient: 'from-purple-50 to-purple-100',
            border: 'border-purple-300',
            titleColor: 'text-purple-600',
            priceColor: 'text-purple-600',
            button: 'bg-purple-600 hover:bg-purple-700 text-white',
            icon: 'text-purple-600'
        },
        gold: {
            gradient: 'from-yellow-50 to-amber-100',
            border: 'border-yellow-300',
            titleColor: 'text-yellow-600',
            priceColor: 'text-yellow-600',
            button: 'bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold',
            icon: 'text-yellow-600'
        }
    };

    const colors = colorClasses[colorScheme] || colorClasses.blue;

    return (
        <div
            className={`
        relative bg-white rounded-xl p-5 
        border-2 ${colors.border}
        shadow-lg hover:shadow-2xl
        transition-all duration-300 ease-in-out
        hover:scale-105 hover:-translate-y-2
        ${highlighted ? 'ring-2 ring-purple-300 ring-opacity-50' : ''}
      `}
        >
            {/* Plan Name */}
            <h3 className={`text-2xl font-bold mb-2 ${colors.titleColor}`}>
                {plan}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 min-h-[2.5rem]">
                {description}
            </p>

            {/* Price */}
            <div className="mb-4">
                <div className="flex items-baseline gap-1">
                    <span className="text-gray-500 text-base">₹</span>
                    <span className={`text-3xl font-bold ${colors.priceColor}`}>
                        {price.toLocaleString()}
                    </span>
                    <span className="text-gray-500 text-sm">/month</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    Billed ₹{billedYearly.toLocaleString()} /year
                </p>
            </div>

            {/* CTA Button */}
            <button
                className={`
          w-full py-2 px-4 rounded-lg
          ${colors.button}
          transition-all duration-200
          transform active:scale-95
          font-medium text-base
          mb-4
        `}
            >
                Get started →
            </button>

            {/* Money Back Guarantee */}
            {plan !== 'Free' && (
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
                    <span className="text-lg">🎯</span>
                    <span className="text-xs text-gray-700 font-medium">
                        7 day money back guarantee
                    </span>
                </div>
            )}

            {/* Features List */}
            <ul className="space-y-2">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                        <span className={`text-base mt-0.5 ${colors.icon}`}>
                            {feature.icon}
                        </span>
                        <span className="text-sm text-gray-700 flex-1">
                            {feature.text}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
